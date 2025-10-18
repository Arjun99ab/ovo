(function() {
  
  const CONFIG = {
    GHOST_OPACITY: 0.5,
    HITBOX_VISIBLE: true,
    DEFAULT_SKIN: "",
    FPS_BASE: 60,
    UI: {
      ARROW_SIZE: "6%",
      ARROW_BOTTOM: "10%",
      LEFT_ARROW_POSITION: "46%",
      RIGHT_ARROW_POSITION: "54%",
      ARROW_ZINDEX: "1000",
      LEFT_ARROW_ICON: "https://cdn-icons-png.flaticon.com/128/93/93634.png",
      RIGHT_ARROW_ICON: "https://cdn-icons-png.flaticon.com/128/2767/2767192.png"
    }
  };

  const runtime = cr_getC2Runtime();

  const getPlayerType = () => runtime.types_by_index.find(
    x => !!x.animations && x.animations[0].frames[0].texture_file.includes("collider")
  );

  const getGhostArrType = () => runtime.types_by_index.find(
    x => x.plugin instanceof cr.plugins_.Arr && x.default_instance[5][1] === 6
  );

  const getGlobalsType = () => runtime.types_by_index.find(
    x => x.plugin instanceof cr.plugins_.Globals
  );

  const getCameraType = () => runtime.types_by_index.find(
    x => x.plugin instanceof cr.plugins_.MagiCam
  );
  
  const getPlayer = () => {
    const playerType = getPlayerType();
    if (!playerType) return null;
    
    return playerType.instances.find(
      x => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
    );
  };
  
  const getFlag = () => {
    const flagType = runtime.types_by_index.find(
      x => x.name === "EndFlag" || 
        (x.plugin instanceof cr.plugins_.Sprite && 
         x.all_frames && 
         x.all_frames[0].texture_file.includes("endflag"))
    );
    return flagType ? flagType.instances[0] : null;
  };

  
  const getCurrentLayout = () => runtime.running_layout.name;

  
  const calculateFrames = (replayData) => {
    // const currentReplayIndex = state.replayIndex;
    // const currentTotalFrames = state.frames.length;

    const totalFrames = replayData.size[0] * (runtime.fps / CONFIG.FPS_BASE);
    const numFrames = replayData.size[0];
    const frames = [];
    
    for (let i = 0; i < numFrames; i++) {
      frames.push(Math.floor((i * totalFrames) / numFrames));
    }

    // state.replayIndex = Math.floor(currentReplayIndex * (numFrames / currentTotalFrames));
    
    return frames;
  };

  class ReplayState {
    constructor() {
      this.reset();
    }

    reset() {
      this.replayInstance = null;
      this.replayJSON = null;
      this.replayIndex = 0;
      this.frames = [];
      this.replaying = false;
      this.ghostAtFlag = false;
      this.playerDeath = false;
      this.paused = false;
      this.playingBack = false;
      this.replayInfo = null;
      this.lastNonDeathState = "";
    }

    isActive() {
      return this.replaying || this.playerDeath || this.ghostAtFlag;
    }
  }

  class CompareState {
    constructor() {
      this.reset();
    }

    reset() {
      this.active = false;
      this.replayJSONs = [];
      this.replayInstances = [];
    }
  }

  const state = new ReplayState();
  const compareState = new CompareState();

  class GhostManager {
    static destroyNonPlayerGhosts() {
      if (!getFlag()) return;

      const playerType = getPlayerType();
      if (!playerType) return;

      const ghosts = playerType.instances.filter(
        x => x.instance_vars[16] && x.instance_vars[17] !== ""
      );

      ghosts.forEach(ghost => {
        runtime.DestroyInstance(ghost);
        ghost.siblings.forEach(sibling => {
          cr.behaviors.SkymenSkin.prototype.acts.UseDefault.call(
            sibling.behaviorSkins[0]
          );
        });
      });

      const ghostArrType = getGhostArrType();
      if (ghostArrType) {
        const ghostArr = ghostArrType.instances[0];
        ghostArr.setSize(0, ghostArr.cy, ghostArr.cz);
      }

      const playerEvents = runtime.eventsheets.Player?.events?.[2]?.subevents?.[2]?.subevents?.[1];
      if (playerEvents) {
        playerEvents.actions.length = 0;
      }
    }

    static createGhostPlayer(data) {
      if (!data || data.layout !== getCurrentLayout()) return null;

      const layer = runtime.running_layout.layers.find(
        layer => layer.name === data.layer
      );
      
      if (!layer) return null;

      this.destroyNonPlayerGhosts();

      const playerType = getPlayerType();
      const instance = runtime.createInstance(playerType, layer, data.x, data.y);

      instance.visible = data.hitboxShown;
      instance.instance_vars[16] = 1; 
      instance.instance_vars[17] = "test";
      instance.instance_vars[18] = 1;
      instance.instance_vars[12] = data.skin;
      instance.instance_vars[0] = data.state;
      instance.collisionsEnabled = false;

      instance.siblings.forEach(sibling => {
        if (data.skin === "") {
          cr.behaviors.SkymenSkin.prototype.acts.UseDefault.call(
            sibling.behaviorSkins[0]
          );
          sibling.opacity = data.opacity;
          sibling.set_bbox_changed();
        } else {
          cr.behaviors.SkymenSkin.prototype.acts.SetSkin.call(
            sibling.behaviorSkins[0],
            data.skin
          );
        }
      });

      return instance;
    }

    static loadPlayerData(player, data) {
      if (data.layout !== getCurrentLayout()) {
        state.replaying = false;
        compareState.active = false;
        state.replayInstance = null;
        return;
      }

      player.x = data.x;
      player.y = data.y;
      player.angle = data.angle;

      if (data.state !== "dead") {
        state.lastNonDeathState = data.state;
      }
      player.instance_vars[0] = data.state === "dead" ? state.lastNonDeathState : data.state;
      player.instance_vars[2] = data.side;

      if (data.side > 0) {
        c2_callFunction("Player > Unmirror", [player.uid]);
      } else if (data.side < 0) {
        c2_callFunction("Player > Mirror", [player.uid]);
      }

      cr.plugins_.Sprite.prototype.acts.SetAnimFrame.call(player, data.frame);
      player.set_bbox_changed();
    }
  }


  class ReplayProcessor {
    static createPlayerData(replayFrame, includeLayout = false) {
      const data = {
        x: replayFrame[0][0],
        y: replayFrame[1][0],
        angle: replayFrame[2][0],
        state: replayFrame[3][0],
        side: replayFrame[5][0],
        frame: replayFrame[4][0],
        skin: CONFIG.DEFAULT_SKIN,
        opacity: CONFIG.GHOST_OPACITY,
        hitboxShown: CONFIG.HITBOX_VISIBLE
      };

      if (includeLayout) {
        const player = getPlayer();
        if (!player) return null;
        
        data.layout = getCurrentLayout();
        data.layer = player.layer.name;
      }

      return data;
    }

   
    static normalizeReplayLengths(replayList) {
      if (!replayList || replayList.length === 0) return replayList;

      // find the longest replay
      const longestReplay = replayList.reduce((longest, current) => 
        current.size[0] > longest.size[0] ? current : longest,
        replayList[0]
      );

      // move longest to front
      const longestIndex = replayList.indexOf(longestReplay);
      if (longestIndex !== 0) {
        [replayList[0], replayList[longestIndex]] = [replayList[longestIndex], replayList[0]];
      }

      // pad shorter replays
      replayList.forEach(replay => {
        if (replay !== longestReplay) {
          const difference = longestReplay.size[0] - replay.size[0];
          const lastFrame = replay.data[replay.data.length - 1];
          
          for (let i = 0; i < difference; i++) {
            replay.data.push([...lastFrame]);
          }
          replay.size[0] = longestReplay.size[0];
        }
      });

      return replayList;
    }
  }


  class GlobalsManager {
    static setGlobalVar(index, value) {
      const globals = getGlobalsType();
      if (globals && globals.instances[0]) {
        globals.instances[0].instance_vars[index] = value;
      }
    }

    static resetReplayGlobals() {
      this.setGlobalVar(3, 0);
      this.setGlobalVar(21, 0);
      this.setGlobalVar(18, 0);
    }
  }

  class CameraManager {
    static setFollowTarget(target) {
      const cameraType = getCameraType();
      if (cameraType && cameraType.instances[0]) {
        cameraType.instances[0].activeCamera.followedObjects[0] = target;
      }
    }

    static cycleFollowTarget(direction) {
      if (compareState.replayInstances.length === 0) return;

      const cameraType = getCameraType();
      if (!cameraType || !cameraType.instances[0]) return;

      const currentFollowing = cameraType.instances[0].activeCamera.followedObjects[0];
      const currentIndex = compareState.replayInstances.indexOf(currentFollowing);
      
      const numInstances = compareState.replayInstances.length;
      const newIndex = (currentIndex + direction + numInstances) % numInstances;
      
      this.setFollowTarget(compareState.replayInstances[newIndex]);
    }
  }

  class UIManager {
    static createComparisonControls() {
      this.removeComparisonControls();

      const leftArrow = this.createArrowElement(
        CONFIG.UI.LEFT_ARROW_ICON,
        CONFIG.UI.LEFT_ARROW_POSITION,
        () => CameraManager.cycleFollowTarget(-1)
      );

      const rightArrow = this.createArrowElement(
        CONFIG.UI.RIGHT_ARROW_ICON,
        CONFIG.UI.RIGHT_ARROW_POSITION,
        () => CameraManager.cycleFollowTarget(1)
      );

      document.body.appendChild(leftArrow);
      document.body.appendChild(rightArrow);
    }

    static createArrowElement(iconSrc, leftPosition, clickHandler) {
      const arrow = document.createElement("img");
      arrow.src = iconSrc;
      arrow.classList.add("replay-compare-arrow");
      
      Object.assign(arrow.style, {
        position: "absolute",
        bottom: CONFIG.UI.ARROW_BOTTOM,
        left: leftPosition,
        width: CONFIG.UI.ARROW_SIZE,
        cursor: "pointer",
        zIndex: CONFIG.UI.ARROW_ZINDEX
      });

      arrow.addEventListener("click", clickHandler);
      return arrow;
    }

    static removeComparisonControls() {
      document.querySelectorAll(".replay-compare-arrow").forEach(element => {
        element.remove();
      });
    }
  }
  
  class ReplayTicker {
    static processReplayFrame(replayData, frames, replayIndex, isFirstReplay = false) {
      if (!frames.includes(replayIndex)) return null;

      const frameIndex = frames.indexOf(replayIndex);
      const replayFrame = replayData.data[frameIndex];
      
      if (replayIndex === 0) {
        const data = ReplayProcessor.createPlayerData(replayFrame, true);
        if (!data) return null;

        if (state.playingBack && isFirstReplay) {
          GhostManager.destroyNonPlayerGhosts();
          const instance = getPlayer();
          if (instance) {
            instance.instance_vars[16] = 1;
            return instance;
          }
        } else {
          return GhostManager.createGhostPlayer(data);
        }
      } else {
        const data = ReplayProcessor.createPlayerData(replayFrame);
        data.layout = replayData.data[replayData.data.length - 1][1][1];
        console.log(isFirstReplay, data)
        return data;
      }
    }


    static tickSingleReplay() {
      if (!state.replaying || state.paused) return;

      const targetLayout = state.replayJSON.data[state.replayJSON.data.length - 1][1][1];
      
      if (runtime.running_layout.name !== targetLayout) {
        runtime.changelayout = runtime.layouts[targetLayout];
        return;
      }

      const result = this.processReplayFrame(
        state.replayJSON,
        state.frames,
        state.replayIndex,
        true
      );

      if (result) {
        if (state.replayIndex === 0) {
          state.replayInstance = result;
        } else if (state.replayInstance) {
          GhostManager.loadPlayerData(state.replayInstance, result);
        }
        
        state.frames = calculateFrames(state.replayJSON);
      }

      state.replayIndex++;

      if (state.replayIndex >= state.frames[state.frames.length - 1]) {
        this.finishReplay();
      }
    }

    
    static tickCompareMode() {
      if (!compareState.active || state.paused) return;

      const targetLayout = state.replayJSON.data[state.replayJSON.data.length - 1][1][1];
      
      if (runtime.running_layout.name !== targetLayout) {
        runtime.changelayout = runtime.layouts[targetLayout];
        return;
      }

      compareState.replayJSONs.forEach((replayData, index) => {
        const result = this.processReplayFrame(
          replayData,
          replayData.frames,
          state.replayIndex,
          index === 0 && state.playingBack
        );

        if (result) {
          if (state.replayIndex === 0) {
            compareState.replayInstances[index] = result;
          } else if (compareState.replayInstances[index] && typeof result === 'object') {
            result.layer = compareState.replayInstances[index].layer.name;
            GhostManager.loadPlayerData(compareState.replayInstances[index], result);
          }

          replayData.frames = calculateFrames(replayData);
        }
      });

      state.replayIndex++;

      if (state.replayIndex >= state.frames[state.frames.length - 1]) {
        this.finishComparison();
      }
    }

    static finishReplay() {
      state.ghostAtFlag = true;
      state.replaying = false;
      state.replayIndex = 0;

      if (state.playingBack) {
        console.log("done playing")
        state.replayInstance.instance_vars[16] = 0;
        GlobalsManager.setGlobalVar(18, 0);
        GlobalsManager.setGlobalVar(21, 0);
        
        c2_callFunction("Menu > End", []);
        // GlobalsManager.resetReplayGlobals();


        runtime.untickMe(replaySystem);
        state.playingBack = false;
      }
    }

    
    static finishComparison() {
      state.ghostAtFlag = true;
      compareState.active = false;
      state.replayIndex = 0;

      if (state.playingBack) {
        compareState.replayInstances[0].instance_vars[16] = 0;
        // GlobalsManager.resetReplayGlobals();
        GlobalsManager.setGlobalVar(18, 0);
        GlobalsManager.setGlobalVar(21, 0);

        c2_callFunction("Menu > End", []);
        runtime.untickMe(replaySystem);
        state.playingBack = false;
        
        CameraManager.setFollowTarget(compareState.replayInstances[0]);
        UIManager.removeComparisonControls();
      }
    }
  }

  class EventHandlers {
    static handleLayoutChange(event) {
      const { currentLayout, layout } = event.detail;
      
      if (currentLayout === layout && layout.name.startsWith("Level")) {
        // player respawned
        if (state.isActive()) {
          state.replayIndex = 0;
          state.replaying = true;
          state.playerDeath = false;
          state.ghostAtFlag = false;
          state.paused = false;
          // compareState.active = true;
        }
      } else if (
        currentLayout.name === state.replayJSON?.data[state.replayJSON.data.length - 1][1][1] &&
        currentLayout !== layout &&
        layout.name !== state.replayJSON.data[state.replayJSON.data.length - 1][1][1]
      ) {
        // player leaves level
        if (state.isActive()) {
          this.resetAllState();
        }
      }
    }

    static handleFunctionCall(event) {
      if (event.detail.name === "Gameplay > Death" && state.replaying) {
        state.playerDeath = true;
        state.replaying = false;
      }
      
      if (event.detail.name === "Menu > End" && state.replaying) {
        state.paused = true;
        console.log("hi chatters")
      }
    }

    static handleDialogOpen(event) {
      if (event.detail.name === "PauseClose" && state.replaying) {
        state.paused = true;
      }
    }

    static handleDialogClose(event) {
      if (event.detail.name === "PauseClose" && state.replaying) {
        state.paused = false;
      }
    }

    static handleButtonClick(event) {
      if (event.detail.name === "Menu > GiveUp" && state.replaying) {
        // this.resetAllState();
        GlobalsManager.setGlobalVar(18, 0);
        GlobalsManager.setGlobalVar(21, 0);
        state.reset()
        compareState.reset()
        UIManager.removeComparisonControls();
      }
    }

    static resetAllState() {
      state.replaying = false;
      state.replayIndex = 0;
      state.playerDeath = false;
      state.ghostAtFlag = false;
      state.replayInstance = null;
      state.playingBack = false;
      state.paused = false;
      
      GlobalsManager.resetReplayGlobals();
      runtime.untickMe(replaySystem);
    }
  }


  const replaySystem = {
    init() {
      // register hooks
      window.addEventListener("LayoutChange", (e) => EventHandlers.handleLayoutChange(e), false);
      window.addEventListener("CallFunction", (e) => EventHandlers.handleFunctionCall(e), false);
      window.addEventListener("DialogOpen", (e) => EventHandlers.handleDialogOpen(e), false);
      window.addEventListener("DialogClose", (e) => EventHandlers.handleDialogClose(e), false);
      window.addEventListener("ButtonClick", (e) => EventHandlers.handleButtonClick(e), false);

    },

    tick() {
      if (compareState.active) {
        ReplayTicker.tickCompareMode();
      } else if (state.replaying) {
        ReplayTicker.tickSingleReplay();
      }
    },

    toString() {
      return "modloader.replay";
    }
  };

  
  globalThis.beginRacing = function(replayData, replayObj) {
    // console.log("begin racing", replayData);
    
    runtime.tickMe(replaySystem);
    state.replayInfo = replayObj;
    state.replayJSON = replayData;
    state.replaying = true;
    state.replayIndex = 0;
    state.playingBack = false;
    state.frames = calculateFrames(replayData);
    GlobalsManager.setGlobalVar(3, 1);
    GlobalsManager.setGlobalVar(21, 1);
  };

  
  globalThis.beginReplay = function(replayData) {
    // console.log("begin replaying", replayData);
    
    runtime.tickMe(replaySystem);
    state.replayJSON = replayData;
    state.replaying = true;
    state.replayIndex = 0;
    state.playingBack = true;
    state.frames = calculateFrames(replayData);
    GlobalsManager.setGlobalVar(3, 1);
    GlobalsManager.setGlobalVar(21, 1);
  };

  
  globalThis.beginComparing = function(compareReplayList) {
    // console.log("begin comparing", compareReplayList);

    // runtime.changelayout = runtime.running_layout
    
    runtime.tickMe(replaySystem);
    
    const normalizedReplays = ReplayProcessor.normalizeReplayLengths(compareReplayList);
    
    state.replayJSON = normalizedReplays[0];
    compareState.active = true;
    compareState.replayJSONs = normalizedReplays;
    state.replayIndex = 0;
    compareState.replayInstances = [];
    state.playingBack = true;
    state.replaying = true;

    
    normalizedReplays.forEach(replay => {
      replay.frames = calculateFrames(replay);
    });
    
    state.frames = state.replayJSON.frames;
    
    UIManager.createComparisonControls();
    GlobalsManager.setGlobalVar(3, 1);
    GlobalsManager.setGlobalVar(21, 1);
  };

  
  globalThis.replaysInfo = function() {
    return {
      replayInstance: state.replayInstance,
      replayJSON: state.replayJSON,
      replayIndex: state.ghostAtFlag ? state.frames[state.frames.length - 1] : state.replayIndex,
      replaying: state.replaying,
      ghostAtFlag: state.ghostAtFlag,
      playerDeath: state.playerDeath,
      paused: state.paused,
      playingBack: state.playingBack,
      frames: state.frames,
      replayInfo: state.replayInfo,
      compareMode: compareState.active,
      compareInstances: compareState.replayInstances
    };
  };

  replaySystem.init();

})();
