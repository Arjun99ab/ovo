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
        };
        Object.keys(c).forEach(function (a) {
            b.style[a] = c[a];
        });
        b.id = id1;
        const newContent = document.createTextNode("N/A");

        // add the text node to the newly created div
        b.appendChild(newContent);

        document.body.appendChild(b);
    };
    let guiMod = {
        init() {
            this.movementKeys = [false, false, false, false]; //left, up, right, down
            this.activatorKeyHeld = false;
            this.activated = false;
            this.speed = {x: 10, y: 10};
            this.stored = [1500, true];
            this.override = false;
            this.previousPosLength = 7;
            this.attempts = 0;
            
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


            createGuiElement("ArrowUp", 75, 70); //create w key element
            document.getElementById("ArrowUp").innerHTML = "🠙";
            createGuiElement("ArrowLeft", 40, 98); //create a key element
            document.getElementById("ArrowLeft").innerHTML = "🠘";
            createGuiElement("ArrowDown", 40, 70); //create s key element
            document.getElementById("ArrowDown").innerHTML = "🠛";
            createGuiElement("ArrowRight", 40, 40); //create d key element
            document.getElementById("ArrowRight").innerHTML = "🠚";

            
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
            console.log(cr.plugins_.Keyboard.prototype.cnds.OnKey);
            
                





        },

        keyDown(event) {
            if (event.keyCode >= 37 && event.keyCode <= 40) {
                this.movementKeys[event.keyCode - 37] = true;
                //console.log(event.key);
                document.getElementById(event.key).style.backgroundColor = "black";
                document.getElementById(event.key).style.color = "white";
                //console.log("key down")
            }
        },
      
        keyUp(event) {
            if (event.keyCode >= 37 && event.keyCode <= 40) {
                this.movementKeys[event.keyCode - 37] = false;
                document.getElementById(event.key).style.backgroundColor = "white";
                document.getElementById(event.key).style.color = "black";

                //console.log(event.key);

            }
        },
        
        tick() {
            let playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
            let player = playerInstances[0];
            //console.log(this.attempts)
       
            try {
                //console.log(runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKey) || runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyCode));
                document.getElementById("fps").innerHTML = runtime.fps;
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
                
            } catch (err) {}
        }
    };
  
    guiMod.init();
})();