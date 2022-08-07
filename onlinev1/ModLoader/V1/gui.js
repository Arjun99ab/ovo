(function() {
    let old = globalThis.sdk_runtime;
    c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    let runtime = globalThis.sdk_runtime;
    globalThis.sdk_runtime = old;
  
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

    let isInLevel = () => {
        return runtime.running_layout.name.startsWith("Level")
    };
    
    let createGuiElement = (id1, bottom, right) => {
        b = document.createElement("div")
        c = {
            backgroundColor: "white",
            border: "solid",
            borderColor: "black",
            borderWidth: "2px",
            fontFamily: "Retron2000",
            position: "absolute",
            bottom: bottom.toString() + "px",
            right: right.toString() + "px",
            padding: "5px",
            color: "black",
            fontSize: "10pt",
            display: "none",
        };
        Object.keys(c).forEach(function (a) {
            b.style[a] = c[a];
        });
        b.id = id1;
        const newContent = document.createTextNode("N/A");

        // add the text node to the newly created div
        b.appendChild(newContent);

        document.body.appendChild(b);

        document.getElementById(b.id).className = 'gui';

    };
    let guiMod = {
        init() {
            this.movementKeys = []; //left, up, right, down
            this.arrows = ["left", "up", "right", "down"];
            this.activatorKeyHeld = false;
            this.activated = false;
            this.speed = {x: 10, y: 10};
            this.stored = [1500, true];
            this.override = false;
            this.previousPosLength = 7;
            this.attempts = 1;
            
            document.addEventListener("keydown", (event) => {
                this.keyDown(event)
                
            });
            document.addEventListener("keyup", (event) => {
                this.keyUp(event)
            });
          
            runtime.tickMe(this);
            
            createGuiElement("pos", 5, 5); //create position element
            
            createGuiElement("fps", 40, 5); //create fps element
            //createGuiElement("dy", 40, 30); //create position element
            //createGuiElement("dx", 40, 55); //create position element
            createGuiElement("state", 5, 85); //create position element
            createGuiElement("attempts", 75, 5); //create attempts element


            createGuiElement(this.arrows[1], 75, 70); //create w key element
            document.getElementById(this.arrows[1]).innerHTML = "🠙";
            createGuiElement(this.arrows[0], 40, 96); //create a key element
            document.getElementById(this.arrows[0]).innerHTML = "🠘";
            createGuiElement(this.arrows[3], 40, 70); //create s key element
            document.getElementById(this.arrows[3]).innerHTML = "🠛";
            createGuiElement(this.arrows[2], 40, 40); //create d key element
            document.getElementById(this.arrows[2]).innerHTML = "🠚";

            
            // localforage.getItem("DedraOvO").then(function(value) {
            //     // This code runs once the value has been loaded
            //     // from the offline store.
            //     console.log(value);
            // }).catch(function(err) {
            //     // This code runs if there were any errors
            //     console.log(err);
            // });
            // localforage.keys().then(function(keys) {
            //     // An array of all the key names.
            //     console.log(keys);
            // }).catch(function(err) {
            //     // This code runs if there were any errors
            //     console.log(err);
            // });\

            let inputsObject = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals && x.instvar_sids.length === 6).instances[0];
            //inputsObject.instance_vars;
            console.log(inputsObject.instance_vars);
            this.movementKeys = (inputsObject.instance_vars).slice(0, 4);
            console.log(this.movementKeys);
            
            
                





        },

        keyDown(event) {
            //console.log(String.fromCharCode(event.keyCode));
            //console.log(cr.plugins_.Keyboard.prototype.cnds.OnKey() || cr.plugins_.Keyboard.prototype.cnds.OnKeyCode());
            //console.log(cr.plugins_.Keyboard.prototype.exps.StringFromKeyCode())
            //c2_callFunction("Controls > Buffer", ["Jump"]);
            if (this.movementKeys.includes(event.keyCode)) {
                
                // //console.log(event.key);
                //console.log("key down")
                arrow = this.arrows[this.movementKeys.indexOf(event.keyCode)]
                
                document.getElementById(arrow).style.backgroundColor = "black";
                document.getElementById(arrow).style.color = "white";
            }
        },
      
        keyUp(event) {
            if (this.movementKeys.includes(event.keyCode)) {
                arrow = this.arrows[this.movementKeys.indexOf(event.keyCode)]
                
                document.getElementById(arrow).style.backgroundColor = "white";
                document.getElementById(arrow).style.color = "black";

                //console.log(event.key);

            }
        },
        
        tick() {
            let playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
            let player = playerInstances[0];
            const elements = document.querySelectorAll('.gui');
            //console.log(this.attempts)
       
            try {
                //console.log(isInLevel())
                //console.log(runtime.running_layout.name);
                elements.forEach(element => {
                    element.style.display = "block";
                });
                if(isInLevel() && runtime.running_layout.name !== "Level Menu") {
                    document.getElementById("fps").innerHTML = runtime.fps;
                    //console.log(document.getElementById("fps").offsetWidth); 41
                    if(parseInt(document.getElementById("right").style.right.substring(0, 2)) - (parseInt(document.getElementById("fps").style.right.substring(0, 2)) + document.getElementById("fps").offsetWidth) !== 3) {
                        document.getElementById("right").style.right = (parseInt(document.getElementById("fps").style.right.substring(0, 2)) + document.getElementById("fps").offsetWidth + 3).toString() + "px";
                        document.getElementById("down").style.right = (parseInt(document.getElementById("fps").style.right.substring(0, 2)) + document.getElementById("fps").offsetWidth + 33).toString() + "px";
                        document.getElementById("up").style.right = document.getElementById("down").style.right;
                        document.getElementById("left").style.right = (parseInt(document.getElementById("fps").style.right.substring(0, 2)) + document.getElementById("fps").offsetWidth + 59).toString() + "px";
                    }
                    //console.log(document.getElementById("fps").style.bottom);
                    //console.log(runtime.deathRow);
                    if(Object.keys(runtime.deathRow).length !== 0) {
                        this.attempts++;
                        console.log(this.attempts);
                        console.log("??");
                    }
                    //console.log(this.attempts);
                    document.getElementById("attempts").innerHTML = this.attempts.toString();
                    document.getElementById("pos").innerHTML = 
                        Math.round(player.x.toString()) +
                        ", " +
                        Math.round(player.y.toString());
                    console.log(document.getElementById("pos").offsetWidth);

                    if(parseInt(document.getElementById("state").style.right.substring(0, 2)) - (parseInt(document.getElementById("pos").style.right.substring(0, 2)) + document.getElementById("pos").offsetWidth) !== 6) {
                        document.getElementById("state").style.right = (parseInt(document.getElementById("pos").style.right.substring(0, 2)) + document.getElementById("pos").offsetWidth + 6).toString() + "px";
                    }
                    //document.getElementById("dy").innerHTML = Math.round(player.behavior_insts[0].dy.toString())
                    //document.getElementById("dx").innerHTML = Math.round(player.behavior_insts[0].dx.toString())
                    if(Math.abs(player.behavior_insts[0].dx) > 500) {
                        document.getElementById("state").innerHTML = "Sliding";                    
                    } else if(Math.abs(player.behavior_insts[0].dx) > 450) {
                        document.getElementById("state").innerHTML = "Diving";                    
                    } else if(player.behavior_insts[0].dy < 0) {
                        document.getElementById("state").innerHTML = "Jumping";                    
                    } else if(player.behavior_insts[0].dy > 0) {
                        document.getElementById("state").innerHTML = "Falling";                    
                    } else if(Math.abs(player.behavior_insts[0].dx) > 0) {
                        document.getElementById("state").innerHTML = "Running";                    
                    } else {
                        document.getElementById("state").innerHTML = "Resting"; 
                    }

                    
                } else {
                    elements.forEach(element => {
                        element.style.display = "none";
                    });
                    if((runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals && x.instvar_sids.length === 6).instances[0]).instance_vars.slice(0, 4) !== this.movementKeys) {
                        this.movementKeys = (runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals && x.instvar_sids.length === 6).instances[0]).instance_vars.slice(0, 4);
                    }
                }
                

                
            } catch (err) {}
        }
    };
  
    guiMod.init();
})();