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

  let replaying_compare = false; 
  let compareReplayJSONs = [];
  let replayInstances = [];


  let lastNonDeathState = "";


  
  


  let ticktest = {
    
      async init() {

        // document.addEventListener("keyup", (event) => {this.keyUp(event)});

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
                playingBack = false;
                paused = false;
                runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[3] = 0
                runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[21] = 0
                runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[18] = 0;

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
          instance.instance_vars[17] = "test";
          instance.instance_vars[18] = 1;

          instance.instance_vars[12] = data.skin;
          instance.instance_vars[0] = data.state;
          instance.collisionsEnabled = false;

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

          //if any player instances have a state of “dead”, the game makes all the other player instances in an “invincible state”
          if (data.state !== "dead") {
            lastNonDeathState = data.state;
          }
          player.instance_vars[0] = data.state === "dead" ? lastNonDeathState : data.state; 
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
        // if (event.keyCode == 85) { // key U
        //   // console.log(replayJSON);
        //   runtime.untickMe(this);
        // }
        // if (event.keyCode == 89) { // key Y
        //   // console.log(replayJSON);
        //   runtime.tickMe(this);
        // }
        // if (event.keyCode == 73) { // key I
        //     runtime.tickMe(this);
        //     replaying = true;
        //     replayIndex = 0;
        //     let totalFrames = replayJSON.size[0] * (165 / 60);
        //     let numFrames = replayJSON.size[0];
        //     for (let i = 0; i < numFrames; i++) {
        //         frames.push(Math.floor((i * totalFrames) / numFrames));
        //     }
        // } 
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
            layer: getPlayer().layer.name,
            hitboxShown: true,
            opacity: 1
          }
          replayInstance = this.createGhostPlayer(data);

          runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.MagiCam).instances[0].activeCamera.followedObjects[0] = replayInstance; // set the camera to follow the ghost player
        }
      },

      tick() {
        // console.log(runtime.deathRow);

        if(replaying_compare && !paused) {
          if (runtime.running_layout.name === replayJSON.data[replayJSON.data.length - 1][1][1]) {
            for(let i = 0; i < compareReplayJSONs.length; i++) {
              let compareReplay = compareReplayJSONs[i];
              let frames = compareReplay.frames;
              
              if(frames.includes(replayIndex)) {
                  let replayFrame = compareReplay.data[frames.indexOf(replayIndex)]; //o(n) but n is small so it should be fine
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
                      if(getPlayer() === undefined) { //if they were on the same level, and they replay, they will be undefined
                        return;
                      }
                      data.layout = getCurLayout();
                      data.layer = getPlayer().layer.name;
                      if (playingBack && i === 0) {
                        console.log("replay done for compare, but this is the first one, so we will use it")
                        this.destroyNonPlayerGhosts();

                        replayInstances[i] = getPlayer(); // save the first instance for comparison
                        replayInstances[i].instance_vars[16] = 1; //this line makes behaivour insts disabled, breaking the getPlayer() function
                        // however we need this line otherwise the player sprite looks weird
                        
                        console.log(replayInstances[i].behavior_insts[0].enabled)
                        console.log(getPlayer())

                        // runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[18] = 1

                        console.log(replayInstances[i].behavior_insts[0].enabled)
                        console.log(getPlayer())

                      } else {
                        console.log("yo")
                        replayInstances[i] = this.createGhostPlayer(data);
                      }
                  } else if (replayIndex === 3) {
                    console.log(replayInstances[i].behavior_insts[0].enabled)
                    console.log(replayInstances[i])
                    console.log(getPlayer())
                  } else {
                      data.layout = compareReplay.data[compareReplay.data.length - 1][1][1]
                      data.layer = replayInstances[i].layer.name;
                      this.loadPlayerData(replayInstances[i], data);
                  }
                }
                // let totalFrames = replayJSON.size[0] * (runtime.fps / 60);
                // let numFrames = replayJSON.size[0];
                // frames = [];
                // for (let i = 0; i < numFrames; i++) {
                //   frames.push(Math.floor((i * totalFrames) / numFrames));
                // }

                // compareReplayJSONs.forEach((compareReplay) => {
                //   if (compareReplay !== replayJSON) {
                //     let compareTotalFrames = compareReplay.size[0] * (runtime.fps / 60);
                //     let compareNumFrames = compareReplay.size[0];
                //     compareReplay.frames = [];
                //     for (let i = 0; i < compareNumFrames; i++) {
                //       compareReplay.frames.push(Math.floor((i * compareTotalFrames) / compareNumFrames));
                //     }
                //   }
                // });
                let compareTotalFrames = compareReplay.size[0] * (runtime.fps / 60);
                let compareNumFrames = compareReplay.size[0];
                compareReplay.frames = [];
                for (let i = 0; i < compareNumFrames; i++) {
                  compareReplay.frames.push(Math.floor((i * compareTotalFrames) / compareNumFrames));
                }
              }
            replayIndex += 1;
            if (replayIndex >= frames[frames.length - 1]) {
              ghostAtFlag = true;
              replaying_compare = false;
              replayIndex = 0;
              

              if (playingBack) {

                replayInstances[0].instance_vars[16] = 0;
                runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[18] = 0;
                // runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[3] = 0
                runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[21] = 0

                console.log("replay done")

                console.log(replayInstance)
                console.log(getPlayer())
                playerType.instances.filter(
                  (x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
                )[0] = replayInstance;

                c2_callFunction("Menu > End", []);
                runtime.untickMe(this);
                playingBack = false;
                runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.MagiCam).instances[0].activeCamera.followedObjects[0] = replayInstances[0]; // set the camera to follow the ghost player
                document.querySelectorAll(".replay-compare-arrow").forEach((element) => {
                  element.remove();
                });
              }
            }
          } else {
            // replay
            runtime.changelayout = runtime.layouts[replayJSON.data[replayJSON.data.length - 1][1][1]];
          }
        }

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
                  if(getPlayer() === undefined) { //if they were on the same level, and they replay, they will be undefined
                    console.log("undefined player")
                    return;
                  }
                  data.layout = getCurLayout();
                  data.layer = getPlayer().layer.name;
                  if (playingBack) {
                    this.destroyNonPlayerGhosts();

                    replayInstance = getPlayer();
                    replayInstance.instance_vars[16] = 1; //this line makes behaivour insts disabled, breaking the getPlayer() function
                    // however we need this line otherwise the player sprite looks weird
                    
                    console.log(replayInstance.behavior_insts[0].enabled)
                    console.log(getPlayer())

                    // runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[18] = 1
                    console.log(replayInstance.behavior_insts[0].enabled)
                    console.log(getPlayer())

                  } else {
                    replayInstance = this.createGhostPlayer(data);
                    // console.log(replayInstance);
                  }
              } else {
                  data.layout = replayJSON.data[replayJSON.data.length - 1][1][1]
                  data.layer = replayInstance.layer.name;
                  this.loadPlayerData(replayInstance, data);
              }
              let totalFrames = replayJSON.size[0] * (runtime.fps / 60);
              let numFrames = replayJSON.size[0];
              frames = [];
              for (let i = 0; i < numFrames; i++) {
                  frames.push(Math.floor((i * totalFrames) / numFrames));
              }
            }
            
            replayIndex += 1;
            if (replayIndex >= frames[frames.length - 1]) {
              ghostAtFlag = true;
              replaying = false;
              replayIndex = 0;

              console.log("replay done")
              console.log(getPlayer())
              

              if (playingBack) {

                replayInstance.instance_vars[16] = 0;
                runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[18] = 0;
                // runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[3] = 0
                runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[21] = 0

                console.log("replay done2")

                console.log(replayInstance)
                console.log(getPlayer())
                playerType.instances.filter(
                  (x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
                )[0] = replayInstance;

                c2_callFunction("Menu > End", []);
                runtime.untickMe(this);
                playingBack = false;
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
    playingBack = false;
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

  globalThis.beginComparing = function(compareReplayList) {
    console.log("begin comparing", compareReplayList);
    runtime.tickMe(ticktest);
    
    let largestSubarray = compareReplayList.reduce((largest, current) => {
      return current.size[0] > largest.size[0] ? current : largest;
    }, compareReplayList[0]);

    console.log("largest", largestSubarray);

    let largestIndex = compareReplayList.indexOf(largestSubarray);
    if (largestIndex !== 0) {
      [compareReplayList[0], compareReplayList[largestIndex]] = [compareReplayList[largestIndex], compareReplayList[0]];
    }

    console.log(compareReplayList)
    compareReplayList.forEach((replay) => {
      if (replay !== largestSubarray) {
      let difference = largestSubarray.size[0] - replay.size[0];
      for (let i = 0; i < difference; i++) {
        replay.data.push([...replay.data[replay.data.length - 1]]);
      }
      replay.size[0] = largestSubarray.size[0];
      }
    });
    console.log(compareReplayList)




    console.log(compareReplayList)
    replayJSON = largestSubarray; 
    replaying_compare = true;
    replayIndex = 0;
    replayInstances = []; // clear previous instances
    playingBack = true; // for the purposes of the end flag
    // let totalFrames = replayJSON.size[0] * (runtime.fps / 60);
    // let numFrames = replayJSON.size[0];
    // frames = [];
    // for (let i = 0; i < numFrames; i++) {
    //     frames.push(Math.floor((i * totalFrames) / numFrames));
    // }

    compareReplayJSONs = compareReplayList

    compareReplayJSONs.forEach((compareReplay) => {
      let compareTotalFrames = compareReplay.size[0] * (runtime.fps / 60);
      let compareNumFrames = compareReplay.size[0];
      compareReplay.frames = [];
      for (let i = 0; i < compareNumFrames; i++) {
        compareReplay.frames.push(Math.floor((i * compareTotalFrames) / compareNumFrames));
      }
    });

    // Create UI arrow elements
    let leftArrow = document.createElement("img");
    leftArrow.src = "https://cdn-icons-png.flaticon.com/128/93/93634.png";
    leftArrow.style.position = "absolute";
    leftArrow.style.bottom = "10%";
    leftArrow.style.left = "46%";
    leftArrow.style.width = "6%";
    // leftArrow.style.height = "10%";
    leftArrow.style.cursor = "pointer";
    leftArrow.style.zIndex = "1000";
    leftArrow.classList.add("replay-compare-arrow");

    document.body.appendChild(leftArrow);


    let rightArrow = document.createElement("img");
    rightArrow.src = "https://cdn-icons-png.flaticon.com/128/2767/2767192.png"; 
    rightArrow.style.position = "absolute";
    rightArrow.style.bottom = "10%";
    rightArrow.style.left = "54%";
    rightArrow.style.width = "6%";
    // rightArrow.style.height = "10%";
    rightArrow.style.cursor = "pointer";
    rightArrow.style.zIndex = "1000";
    rightArrow.classList.add("replay-compare-arrow");
    
    document.body.appendChild(rightArrow);

    // Add event listeners for arrows
    leftArrow.addEventListener("click", () => {
      console.log("Left arrow clicked");

      let currentFollowing = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.MagiCam).instances[0].activeCamera.followedObjects[0]
      let currentFollowingIndex = replayInstances.indexOf(currentFollowing);
      runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.MagiCam).instances[0].activeCamera.followedObjects[0] = replayInstances[(currentFollowingIndex - 1 + replayInstances.length) % replayInstances.length]

      // Add functionality for left arrow click
    });

    rightArrow.addEventListener("click", () => {
      console.log("Right arrow clicked");

      let currentFollowing = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.MagiCam).instances[0].activeCamera.followedObjects[0]
      let currentFollowingIndex = replayInstances.indexOf(currentFollowing);
      runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.MagiCam).instances[0].activeCamera.followedObjects[0] = replayInstances[(currentFollowingIndex + 1) % replayInstances.length]
      // Add functionality for right arrow click
    });

  }
})();