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
    let replayJSON;
    let replaying = false;
    let replayIndex = 0;

    


    let ticktest = {
        async init() {

            document.addEventListener("keyup", (event) => {this.keyUp(event)});


            replayJSON = await fetch('../src/mods/modloader/replay/level1.json')
                .then((response) => response.json())
                .then(jsondata => {
                    return jsondata;
                });
            console.log(replayJSON)


            runtime.tickMe(this);            
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
            instance.visible = false; //whether hitbox is visible or not
            instance.instance_vars[16] = 1;
            instance.instance_vars[17] = "";
            instance.instance_vars[12] = data.skin;
            instance.instance_vars[0] = data.state;
            instance.opacity = 0.1;

            setTimeout(() => {
              if (!getFlag()) return;
              instance.siblings.forEach((sibling) => {
                if (data.skin === "") {
                  cr.behaviors.SkymenSkin.prototype.acts.UseDefault.call(
                    sibling.behaviorSkins[0]
                  );
                } else {
                  cr.behaviors.SkymenSkin.prototype.acts.SetSkin.call(
                    sibling.behaviorSkins[0],
                    data.skin
                  );
                }
              });
            }, 200);

            return {
              instance,
            };
        },
        loadPlayerData(player, data) {
            if (data.layout !== getCurLayout()) return;
            player.instance.x = data.x;
            player.instance.y = data.y;
            player.instance.angle = data.angle;
            player.instance.instance_vars[0] = data.state;
            player.instance.instance_vars[2] = data.side;
            player.instance.opacity = 0.1;
            if (data.side > 0) {
              c2_callFunction("Player > Unmirror", [player.instance.uid]);
            }
            if (data.side < 0) {
              c2_callFunction("Player > Mirror", [player.instance.uid]);
            }
            cr.plugins_.Sprite.prototype.acts.SetAnimFrame.call(
              player.instance,
              data.frame
            );
            player.instance.set_bbox_changed();
        },

        keyUp(event) {
            if (event.keyCode == 73) { // key I
                replaying = true;
                replayIndex = 0;
            }  
        },

        tick() {
            if(replaying) { 
                if(replayIndex % 2 === 0) {//only even frames because 120 fps (update for generic fps)
                    let replayFrame = replayJSON.data[replayIndex / 2];
                    let data = {
                        x: replayFrame[0][0],
                        y: replayFrame[1][0],
                        angle: replayFrame[2][0],
                        state: replayFrame[3][0],
                        side: replayFrame[5][0],
                        layout: getCurLayout(),
                        layer: getPlayer().layer.name,
                        frame: replayFrame[4][0],
                    }
                    if(replayIndex === 0) {
                        replayInstance = this.createGhostPlayer(data);
                        console.log(replayInstance)
                        replayInstance.instance.opacity = 0.1;
                    } else {
                        this.loadPlayerData(replayInstance, data);
                    }
                }
                replayIndex++;
                if (replayIndex >= replayJSON.data.length * 2) {
                    replaying = false;
                    replayIndex = 0;
                }
            }


        },
    };
    ticktest.init();
})();