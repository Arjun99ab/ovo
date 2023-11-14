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
    let isInLevel = () => {
        return runtime.running_layout.name.startsWith("Level")
    };
    
    let isPaused = () => {
        if (isInLevel()) return runtime.running_layout.layers.find(function(a) {
            return "Pause" === a.name
        }).visible
    };

    

    
    

    let cosmeticsMod = {
        init() {
            // document.addEventListener("keydown", (event) => {this.keyDown(event)});
            document.addEventListener("keyup", (event) => {this.keyUp(event)});

            // runtime.tickMe(this);

            notify("cosmetics mod loaded");
        },

        keyDown(event) {
            if (event.keyCode == 71) {
            }  
        },
      
        keyUp(event) {
            if (event.keyCode == 71) {
                let playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
                let player = playerInstances[0];
                console.log(player)
                console.log(player.bbox.top, player.bbox.left)
                var b=document.createElement("div")
                c={backgroundColor:"rgba(255,0,0,1)",width:"5px",height:"5px",position:"absolute",top: player.bbox.top + "px",left: player.bbox.left+"5px", zIndex:"2147483647", display:"block"}
                Object.keys(c).forEach(function(a){b.style[a]=c[a]})
                document.body.appendChild(b)
            }
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