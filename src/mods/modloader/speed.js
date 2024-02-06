(function() {
    let old = globalThis.sdk_runtime;
    c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    let runtime = globalThis.sdk_runtime;
    globalThis.sdk_runtime = old;

    var done = true

  
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
            // document.addEventListener("keydown", (event) => {this.keyDown(event)});
            document.addEventListener("keyup", (event) => {this.keyUp(event)});
            this.movementKeys = [false];

            // runtime.tickMe(this);

            notify("hyello??");
            console.log("w");
        },

        keyDown(event) {
            if (event.keyCode == 71) {
                console
            }  
        },
      
        keyUp(event) {
            if (event.keyCode == 71) {
                console.log(runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Mouse)[0].instances[0].mouseXcanvas, runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Mouse)[0].instances[0].mouseYcanvas)
                console.log(runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Touch)[0].instances[0])

                
                console.log(runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Touch)[0].instances[0].touches[0])
                console.log(runtime.types_by_index.find(
                    (x) =>
                        (x.plugin instanceof cr.plugins_.Sprite &&
                            x.all_frames &&
                            x.all_frames[0].texture_file.includes("uidirection"))
                ).instances[1])
            }
        },
        
        
        tick() {
            let playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
            let player = playerInstances[0];
            // };

            try {
                if(this.movementKeys[0] && !done) {
                    console.log(player.bquad);
                    
                    player.bquad.tlx = 200; 
                    player.bquad.tly = 200; 
                    player.bquad.trx = 200; 
                    player.bquad.try_ = 200;
                    player.bquad.blx = 200; 
                    player.bquad.bly = 200; 
                    player.bquad.brx = 200; 
                    player.bquad.bry_ = 200; 

                    console.log(player.bquad.tlx);
                    console.log(player.bquad);
                    // for (const property in player.bquad) {
                    //     console.log(`${property}: ${player.bquad[property]}`);
                    //   }
                      

                    done = true;            
                }

                
                // if(isInLevel() && !done) {
                //     player.angle+=1;
                //     done = true;
                // }
                
                 

                
            } catch (err) {}
        }
    };
  
    speedMod.init();
})();