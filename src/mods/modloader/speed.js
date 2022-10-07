(function() {
    let old = globalThis.sdk_runtime;
    c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    let runtime = globalThis.sdk_runtime;
    globalThis.sdk_runtime = old;

    var jumping = false

  
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
    // let test = () => {
    //     console.log("hi");
    // };
    
    let isPaused = () => {
        if (isInLevel()) return runtime.running_layout.layers.find(function(a) {
            return "Pause" === a.name
        }).visible
    };

    

    
    

    let speedMod = {
        init() {
            document.addEventListener("keydown", (event) => {this.keyDown(event)});
            document.addEventListener("keyup", (event) => {this.keyUp(event)});
            this.movementKeys = [false, false, false, false];
            
            runtime.tickMe(this);

            notify("hyello??")
//
            


            
            
            
                





        },

        keyDown(event) {
            
            if (event.keyCode >= 37 && event.keyCode <= 40) {
                
                
                this.movementKeys[event.keyCode - 37] = true;
                

            }
            
            
            
        },
      
        keyUp(event) {

            
          
            if (event.keyCode >= 37 && event.keyCode <= 40) { //37 left 39 up
                console.log(event.keyCode)
                this.movementKeys[event.keyCode - 37] = false;

            }
        },

        
        
        tick() {
            let playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
            let player = playerInstances[0];
            // };

            try {
                
                if(this.movementKeys[2]) { // right key
                    player.x += 5
                } 
                if(this.movementKeys[0]) { // left key
                    player.x -= 5
                }
               
                
                 
                //console.log(this.movementKeys)
                
                 

                
            } catch (err) {}
        }
    };
  
    speedMod.init();
})();