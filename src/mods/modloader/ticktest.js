(function() {
  let runtime = cr_getC2Runtime();




  let playerType = runtime.types_by_index.find(
      (x) =>
        !!x.animations &&
        x.animations[0].frames[0].texture_file.includes("collider")
  );

  let getPlayer = () =>
      playerType.instances.filter(
        (x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
      )[0];

  let ghostArrType = runtime.types_by_index.find(
  (x) =>
      x.plugin instanceof cr.plugins_.Arr && x.default_instance[5][1] === 6
  );

  let getFlag = () =>
      runtime.types_by_index.find(
        (x) =>
          x.name === "EndFlag" ||
          (x.plugin instanceof cr.plugins_.Sprite &&
            x.all_frames &&
            x.all_frames[0].texture_file.includes("endflag"))
      ).instances[0];
  let getCurLayout = () => runtime.running_layout.name;

  let replayInstance = null;
  let replayJSON = null;
  let replayIndex = 0;


  let replaying = false;
  let ghostAtFlag = false;
  let playerDeath = false;
  let paused = false;

  let playingBack = false;

  let replayInfo = null;
  
  let frames = []; 


  
  


  let ticktest = {
    
      async init() {

        document.addEventListener("keyup", (event) => {this.keyUp(event)});

        // replayJSON = await fetch('../src/mods/modloader/replay/level1_1.4.json')
        //     .then((response) => response.json())
        //     .then(jsondata => {
        //         return jsondata;
        //     });
        // console.log(replayJSON)

        window.addEventListener(
          "LayoutChange",
          (e) => {
            if (e.detail.currentLayout === e.detail.layout && e.detail.layout.name.startsWith("Level")) {
              //player respawned
              if (replaying || playerDeath || ghostAtFlag) {
                console.log("YEP")
                replayIndex = 0;
                replaying = true;
                playerDeath = false;
                ghostAtFlag = false;
                paused = false;

              }
            } else if (e.detail.currentLayout.name === replayJSON.data[replayJSON.data.length - 1][1][1] && e.detail.currentLayout !== e.detail.layout && e.detail.layout.name !== replayJSON.data[replayJSON.data.length - 1][1][1]) {
              //user leaves level
              if (replaying || playerDeath || ghostAtFlag) {
                console.log("user leave")
                replaying = false;
                replayIndex = 0;
                playerDeath = false;
                ghostAtFlag = false;
                replayInstance = null;
                runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[3] = 0
                runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[21] = 0
                runtime.untickMe(this);

              }
            }
          },
          false,
        );

        window.addEventListener(
          "CallFunction",
          (e) => {
            if(e.detail.name === "Gameplay > Death") {
              if(replaying) {
                //note that player died
                playerDeath = true;
                //stop replay ghost, will resume when player respawns
                replaying = false
              }
            }
            if(e.detail.name === "Menu > End") {
              if(replaying) {
                paused = true;
              }
            }
          },
          false,
        );
      
        window.addEventListener(
          "DialogOpen",
          (e) => {
            if (e.detail.name === "PauseClose") {
              if(replaying) {
                paused = true;
              }
            }
          },
          false,
        );

        window.addEventListener(
          "DialogClose",
          (e) => {
            if (e.detail.name === "PauseClose") {
              if(replaying) {
                paused = false;
              }
            }
            
          },
          false,
        );


      },

      destroyNonPlayerGhosts() {
          if (!getFlag()) return;
          let ghosts = playerType.instances.filter(
            (x) => x.instance_vars[16] && x.instance_vars[17] !== ""
          );
          if (!ghosts) return;
          ghosts.forEach((ghost) => {
            runtime.DestroyInstance(ghost);
            ghost.siblings.forEach((sibling) => {
              cr.behaviors.SkymenSkin.prototype.acts.UseDefault.call(
                sibling.behaviorSkins[0]
              );
            });
          });
          let ghostArr = ghostArrType.instances[0];
          ghostArr.setSize(0, ghostArr.cy, ghostArr.cz);
          runtime.eventsheets.Player.events[2].subevents[2].subevents[1].actions.length = 0;
      },

      createGhostPlayer(data) {
          console.log("create ghost player")
          if (!data || data.layout !== getCurLayout()) return null;
          let layer = runtime.running_layout.layers.find(
            (layer) => layer.name === data.layer
          );
          if (!layer) return null;
          this.destroyNonPlayerGhosts();
          let instance = runtime.createInstance(
            playerType,
            layer,
            data.x,
            data.y
          );
          instance.visible = data.hitboxShown; //whether hitbox is visible or not
          instance.instance_vars[16] = 1;
          instance.instance_vars[17] = "";
          instance.instance_vars[12] = data.skin;
          instance.instance_vars[0] = data.state;

          instance.siblings.forEach((sibling) => {
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
      },
      loadPlayerData(player, data) {
          if (data.layout !== getCurLayout()) {
            replaying = false;
            replayInstance = null;
            runtime.tickMe(this);
            return;
          }
          player.x = data.x;
          player.y = data.y;
          player.angle = data.angle;
          player.instance_vars[0] = data.state;
          player.instance_vars[2] = data.side;
          if (data.side > 0) {
            c2_callFunction("Player > Unmirror", [player.uid]);
          }
          if (data.side < 0) {
            c2_callFunction("Player > Mirror", [player.uid]);
          }
          cr.plugins_.Sprite.prototype.acts.SetAnimFrame.call(
            player,
            data.frame
          );
          player.set_bbox_changed();
      },

      keyUp(event) {
        if (event.keyCode == 85) { // key U
          // console.log(replayJSON);
          runtime.untickMe(this);
        }
        if (event.keyCode == 89) { // key Y
          // console.log(replayJSON);
          runtime.tickMe(this);
        }
        if (event.keyCode == 73) { // key I
            runtime.tickMe(this);
            replaying = true;
            replayIndex = 0;
            let totalFrames = replayJSON.size[0] * (165 / 60);
            let numFrames = replayJSON.size[0];
            for (let i = 0; i < numFrames; i++) {
                frames.push(Math.floor((i * totalFrames) / numFrames));
            }
        } 
        if (event.keyCode == 79) { // key O
          let data = {
            x: 522,
            y: 352,
            angle: 0,
            state: "idle",
            side: 1,
            frame: 0,
            skin: "",
            layout: getCurLayout(),
            layer: getPlayer().layer.name
          }
          replayInstance = this.createGhostPlayer(data);
        }
      },

      tick() {
        // console.log(runtime.deathRow);

        if (replaying && !paused) { 
          if (runtime.running_layout.name === replayJSON.data[replayJSON.data.length - 1][1][1]) {
            if(frames.includes(replayIndex)) {

              let replayFrame = replayJSON.data[frames.indexOf(replayIndex)]; //o(n) but n is small so it should be fine
              let data = {
                  x: replayFrame[0][0],
                  y: replayFrame[1][0],
                  angle: replayFrame[2][0],
                  state: replayFrame[3][0],
                  side: replayFrame[5][0],
                  frame: replayFrame[4][0],
                  skin: "",
                  opacity: 0.5,
                  hitboxShown: true
              }
              if(replayIndex === 0) {
                  data.layout = getCurLayout();
                  data.layer = getPlayer().layer.name;
                  if (playingBack) {
                    this.destroyNonPlayerGhosts();

                    replayInstance = getPlayer();
                    replayInstance.instance_vars[16] = 1;
                    console.log(replayInstance.behavior_insts[0].enabled)
                    runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[18] = 1
                    console.log(replayInstance.behavior_insts[0].enabled)
                  } else {
                    replayInstance = this.createGhostPlayer(data);
                  }
              } else if (replayIndex === 2) {
                console.log(replayInstance.behavior_insts[0].enabled)
                console.log(replayInstance)
                console.log(getPlayer())
              } else {
                  data.layout = replayJSON.data[replayJSON.data.length - 1][1][1]
                  data.layer = replayInstance.layer.name;
                  this.loadPlayerData(replayInstance, data);
              }
            }
            replayIndex += 1;
            if (replayIndex >= frames[frames.length - 10]) {
              // ghostAtFlag = true;
              // replaying = false;
              replayIndex = 0;
              

              if (playingBack) {

                replayInstance.instance_vars[16] = 0;
                runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[18] = 0;
                runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[3] = 0
                runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[21] = 0

                console.log("replay done")

                console.log(replayInstance)
                console.log(getPlayer())

                // c2_callFunction("Menu > End", []);
                // runtime.untickMe(this);
              }
              

            }
          } else {
            // replay
            runtime.changelayout = runtime.layouts[replayJSON.data[replayJSON.data.length - 1][1][1]];
          }
        }


      },
      toString() {
          return "modloader.replay";
      }
  };
  ticktest.init();

  globalThis.beginRacing = function(replayData, replayObj) {
    console.log("begin racing", replayData)
    runtime.tickMe(ticktest);
    replayInfo = replayObj;
    replayJSON = replayData;
    replaying = true;
    replayIndex = 0;
    let totalFrames = replayJSON.size[0] * (runtime.fps / 60);
    let numFrames = replayJSON.size[0];
    frames = [];
    for (let i = 0; i < numFrames; i++) {
        frames.push(Math.floor((i * totalFrames) / numFrames));
    }
  }
  globalThis.replaysInfo = function() {
    return {
      replayInstance: replayInstance,
      replayJSON: replayJSON,
      replayIndex: ghostAtFlag ? frames[frames.length - 1] : replayIndex,
      replaying: replaying,
      ghostAtFlag: ghostAtFlag,
      playerDeath: playerDeath,
      paused: paused,
      playingBack: playingBack,
      frames: frames,
      replayInfo: replayInfo
    }
  }
  globalThis.beginReplay = function(replayData) {
    console.log("begin replay", replayData)
    runtime.tickMe(ticktest);
    replayJSON = replayData;
    replaying = true;
    replayIndex = 0;
    playingBack = true;
    let totalFrames = replayJSON.size[0] * (runtime.fps / 60);
    let numFrames = replayJSON.size[0];
    frames = [];
    for (let i = 0; i < numFrames; i++) {
        frames.push(Math.floor((i * totalFrames) / numFrames));
    }
    // console.log(frames)
  }
})();