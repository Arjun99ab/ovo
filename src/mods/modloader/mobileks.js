//useless mod - used it for testing something that was resolved in a different way

(function() {
    // let old = "globalThis.sdk_runtime";
    // //c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    // let runtime = "globalThis.sdk_runtime";
    // globalThis.sdk_runtime = "old";
    let runtime = cr_getC2Runtime();
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

    let isInLevel = () => {
        return runtime.running_layout.name.startsWith("Level")
    };

    let getArrow = (a) => {
        return runtime.types_by_index
                        .filter(
                            (x) =>
                            !!x.animations &&
                            x.animations[0].frames[0].texture_file.includes("uidirection")
                        )[0].instances[a];
    }
    
    
    let notify = (text, title = "", image = "./speedrunner.png") => {
        cr.plugins_.sirg_notifications.prototype.acts.AddSimpleNotification.call(
          runtime.types_by_index.find(
            (type) => type.plugin instanceof cr.plugins_.sirg_notifications
          ).instances[0],
          title,
          text,
          image
        );
      };
      let createGuiElement = (id1, top, left, name) => {
        b = document.createElement("div")
        c = {
            backgroundColor: "white",
            border: "2px solid black",
            fontFamily: "Retron2000",
            position: "absolute",
            top: top.toString() + "px",
            left: left.toString() + "px",
            padding: "15px",
            color: "black",
            fontSize: "10pt",
            display: "block",
            cursor: "pointer",
        };
        Object.keys(c).forEach(function (a) {
            b.style[a] = c[a];
        });
        b.id = id1;
        const newContent = document.createTextNode(name);

        // add the text node to the newly created div
        b.appendChild(newContent);
        // console.log('hi guys')
        document.body.appendChild(b);
    }
    
    let mod = {
        init() {
            this.touching = false;
            document.addEventListener("touchstart", (event) => {
                this.touchstart(event)
                
            });
            document.addEventListener("touchend", (event) => {
                this.touchend(event)
            });

            document.addEventListener("mousedown", (event) => {
                this.touchstart(event)
            });
            document.addEventListener("mouseup", (event) => {
                this.touchend(event)
            });

            document.addEventListener("keydown", (event) => {
                if (event.keyCode === 71) {
                    console.log(runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Touch)[0].instances[0].touches[0].x, runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Touch)[0].instances[0].touches[0].y)
                    // console.log(runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Touch)[0].instances[0].touches[0])
                    console.log(getArrow(2));
                    // console.log(getPlayer());
                }
            });
            createGuiElement("up", 150, 150, " ");
            createGuiElement("down", 200, 150, " " );
            createGuiElement("left", 200, 100, " ");
            createGuiElement("right", 200, 200, " ");


            
            // runtime.tickMe(this);
        },
        touchstart(event) {
            if (event.target.tagName === 'CANVAS') {
                console.log("touchstart")
                let touch = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Touch).instances[0]
                let uiDirection = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Sprite && x.all_frames && x.all_frames[0].texture_file.includes("uidirection"))
                // console.log(uiDirection)
                let playButton = runtime.types_by_index.filter((x) =>
                    x.behaviors.some(
                    (y) => y.behavior instanceof cr.behaviors.aekiro_button
                    )
                )[0];
                console.log(playButton.getCurrentSol().getObjects())
                // console.log(playButton.getCurrentSol().getObjects().map(x=>x.instance_vars))

                
                if (cr.plugins_.Touch.prototype.cnds.IsTouchingObject.call(touch, playButton)) {
                    console.log("playbutton")
                    console.log(playButton.getCurrentSol().getObjects().map(x=>x.properties[1]))
                    // notify("playbutton")
                }
                // console.log(uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]))
                if (cr.plugins_.Touch.prototype.cnds.IsTouchingObject.call(touch, uiDirection)) {
                    console.log("start", uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]))
                    
                    pressed = uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0])
                    if(pressed.includes("up")) {
                        document.getElementById("up").style.backgroundColor = "red";
                    }
                    if(pressed.includes("down")) {
                        document.getElementById("down").style.backgroundColor = "red";
                    }
                    if(pressed.includes("left")) {
                        document.getElementById("left").style.backgroundColor = "red";
                    }
                    if(pressed.includes("right")) {
                        document.getElementById("right").style.backgroundColor = "red";
                    }

                    // console.log(uiDirection.getCurrentSol().instances)
                }
                console.log("-------------------------")
            }

            

            
        },
        touchend(event) {
            if (event.target.tagName === 'CANVAS') {
                console.log("touchend")
                let touch = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Touch).instances[0]
                let uiDirection = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Sprite && x.all_frames && x.all_frames[0].texture_file.includes("uidirection"))
                pressed = uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0])
                if(pressed.includes("up")) {
                    document.getElementById("up").style.backgroundColor = "white";
                }
                if(pressed.includes("down")) {
                    document.getElementById("down").style.backgroundColor = "white";
                }
                if(pressed.includes("left")) {
                    document.getElementById("left").style.backgroundColor = "white";
                }
                if(pressed.includes("right")) {
                    document.getElementById("right").style.backgroundColor = "white";
                }
                // if (!cr.plugins_.Touch.prototype.cnds.IsTouchingObject.call(touch, uiDirection)) {
                //     console.log("if end", uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]))
                    
                //     // console.log("end", uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars))
                // }
                console.log("-------------------------")

            }   
        },
      
      
        // tick() {
        //     try {
        //         if (this.touching) {
        //             console.log('touching')
        //             let touch = runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Touch)[0].instances[0];
        //             console.log(touch.touches)
        //             if (touch.touches.length > 0) {
        //                 console.log('touching')
        //                 let touch = touch.touches[0];
        //                 console.log(touch.x, touch.y)
        //             }
        //         }
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
    };
  
    mod.init();
})();

// runtime.types_by_index.find(
//     (x) =>
//         (x.plugin instanceof cr.plugins_.Sprite &&
//             x.all_frames &&
//             x.all_frames[0].texture_file.includes("uidirection"))
// )