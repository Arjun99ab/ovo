(function() {
    let old = globalThis.sdk_runtime;
    c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    let runtime = globalThis.sdk_runtime;
    
    let getPlayer = () => {
        return runtime.types_by_index
            .filter(
                (x) =>
                !!x.animations &&
                x.animations[0].frames[0].texture_file.includes("collider")
            )[0]
            .instances.filter(
                (x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
            )[0];
    }
    
    let notify = (title, text, image = "./speedrunner.png") => {
        cr.plugins_.sirg_notifications.prototype.acts.AddSimpleNotification.call(
            runtime.types_by_index.find(
                (type) => type.plugin instanceof cr.plugins_.sirg_notifications
            ).instances[0],
            title,
            text,
            image
        );
    };
    let disableClick = () => {
        let map = [];
        let mapUI = [];
        let types = runtime.types_by_index.filter((x) =>
          x.behaviors.some(
            (y) => y.behavior instanceof cr.behaviors.aekiro_button
          )
        );
        types.forEach((type) => {
          type.instances.forEach((inst) => {
            let behavior = inst.behavior_insts.find(
              (x) => x.behavior instanceof cr.behaviors.aekiro_button
            );
            // console.log(behavior)
            // console.log(behavior.isEnabled)
            map.push({
              inst,
              oldState: behavior.isEnabled,
            });
            behavior.isEnabled = 0;
          });
        });
        let layer = runtime.running_layout.layers.find((x) => x.name == "UI");
        if (layer) {
          layer.instances.forEach((inst) => {
            //save state to mapUI
            mapUI.push({
              inst,
              oldState: {
                width: inst.width,
                height: inst.height,
              },
            });
            // set size to 0
            inst.width = 0;
            inst.height = 0;
            inst.set_bbox_changed();
          });
        }
        return {
          map,
          mapUI,
        };
      };

      let enableClick = ({ map, mapUI }) => {
        map.forEach((x) => {
          let inst = x.inst.behavior_insts.find(
            (x) => x.behavior instanceof cr.behaviors.aekiro_button
          );
          inst.isEnabled = inst.isEnabled ? 1 : x.oldState;
        });
        mapUI.forEach((x) => {
          x.inst.width = x.oldState.width;
          x.inst.height = x.oldState.height;
          x.inst.set_bbox_changed();
        });
      };

    let isInLevel = () => {
        return runtime.running_layout.name.startsWith("Level")
    };
    
    let isPaused = () => {
        if (isInLevel()) return runtime.running_layout.layers.find(function(a) {
            return "Pause" === a.name
        }).visible
    };

    let createConfirmMenu = () => {
        //Create background div
        let confirmBg = document.createElement("div");
        confirmBg.id = "confirm-bg";

        c = {
            display: "block",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "solid",
            borderColor: "black",
            borderWidth: "2px",
            fontFamily: "Retron2000",
            cursor: "default",
            color: "black",
            fontSize: "10pt",
            width: "35%",
            // height: "15%",
            overflow: "auto",
            margin: "0",
            padding: "5px",
        };
        Object.keys(c).forEach(function (a) {
            confirmBg.style[a] = c[a];
        });

        titleText = document.createElement("div");

        c = {
            backgroundColor: "white",
            border: "none",
            fontFamily: "Retron2000",
            // position: "relative",
            // top: "2%",
            // left: "25%",
            textAlign: "center",
            //padding: "5px",
            color: "black",
            fontSize: "13pt",
            cursor: "default",
        };
        Object.keys(c).forEach(function (a) {
            titleText.style[a] = c[a];
        });

        newContent = document.createTextNode("This mod requires a reload to disable.");
        titleText.appendChild(newContent);
        
        // Create buttons container
        let buttonsContainer = document.createElement("div");
        buttonsContainer.style.display = "flex";
        buttonsContainer.style.flexWrap = "wrap";
        buttonsContainer.style.justifyContent = "center";
        buttonsContainer.style.alignItems = "center";
        buttonsContainer.style.marginTop = "15px";
        buttonsContainer.style.marginBottom = "10px";
        buttonsContainer.style.gap = "10px";
        // buttonsContainer.style.position = "relative";

        // Create confirm button
        let confirmButton = document.createElement("button");
        confirmButton.innerHTML = "Reload now";
        confirmButton.style.fontFamily = "Retron2000";
        confirmButton.style.fontSize = "14pt";
        confirmButton.style.backgroundColor = "rgb(45, 186, 47)";
        confirmButton.style.color = "white";
        confirmButton.style.border = "none";
        confirmButton.style.padding = "5px 10px";
        confirmButton.style.cursor = "pointer";
        confirmButton.onclick = function() {
            return true;
        };

        // Create cancel button
        let cancelButton = document.createElement("button");
        cancelButton.innerHTML = "Reload later";
        cancelButton.style.fontFamily = "Retron2000";
        cancelButton.style.fontSize = "14pt"
        cancelButton.style.backgroundColor = "rgb(222, 48, 51)";
        cancelButton.style.color = "white";
        cancelButton.style.border = "none";
        cancelButton.style.padding = "5px 10px";
        cancelButton.style.cursor = "pointer";
        cancelButton.onclick = function() {
            confirmBg.remove();
            // enableClick(map);   
        };

        // Append buttons to the buttons container
        buttonsContainer.appendChild(confirmButton);
        buttonsContainer.appendChild(cancelButton);


        confirmBg.appendChild(titleText);
        confirmBg.appendChild(buttonsContainer);
        

        // confirmBg.appendChild(xButton);
        document.body.appendChild(confirmBg);
    }

    

    
    

    let cosmeticsMod = {
        init() {
            document.addEventListener("keydown", (event) => {this.keyDown(event)});
            // document.addEventListener("keyup", (event) => {this.keyUp(event)});

            // runtime.tickMe(this);

            notify("cosmetics mod loaded");
        },

        keyDown(event) {
            if(event.keyCode === 80) { //p
                if(document.getElementById("confirm-bg") === null) { //menu doesnt exist
                    //create mod menu via tab
                    console.log("menu doesnt exist");
                    // map = disableClick();
                    document.getElementById("menu-bg").style.pointerEvents = "none";
                    createConfirmMenu(); 
                } else { //menu exists
                    //remove mod menu via tab
                    xButton = document.getElementById("x-button");
                    xButton.click();
                }
            }
        },
      
        keyUp(event) {
        },
        
        
        tick() {
            let playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
            let player = playerInstances[0];
            // };

            try {
                 

                
            } catch (err) {}
        }
    };
  
    cosmeticsMod.init();
})();