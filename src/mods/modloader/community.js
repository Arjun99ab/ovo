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
    // let test = () => {
    //     console.log("hi");
    // };
    
    let isPaused = () => {
        if (isInLevel()) return runtime.running_layout.layers.find(function(a) {
            return "Pause" === a.name
        }).visible
    };

    
    

    let communityExplorerMod = {
        init() {
           


            function addStyle(styleString) {
                const style = document.createElement('style');
                style.textContent = styleString;
                document.head.append(style);
              }
            addStyle(`
            #ovo-multiplayer-disconnected-container {
                pointer-events: none;
            }
            #ovo-multiplayer-other-container {
                pointer-events: none;
            }
            #ovo-multiplayer-container {
                pointer-events: none;
            }
            #ovo-multiplayer-tab-container {
                pointer-events: all;
            }
            .ovo-multiplayer-button-holder {
                pointer-events: all;
            }
            .ovo-multiplayer-tab {
                pointer-events: all;
            }
            .ovo-multiplayer-button {
                pointer-events: all;
            }
            `);



            console.log(ovoLevelEditor)

            
            


            
            
            
                


            document.addEventListener("keydown", (event) => {this.keyDown(event)});

            notify("Community Levels Loaded", "by Awesomeguy")
            runtime.tickMe(this);

        },
        keyDown(event) {
            
            if (event.code === "KeyH") {
                fetch('Novaya_Zemlya.json')
                .then((response) => response.json())
                .then((data) => {
                    ovoLevelEditor.startLevel(data);
                });
            }
            
            
            
        },

        
        
        tick() {
            let playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
            let player = playerInstances[0];
            

            try {
                
               

                
            } catch (err) {}
        }
    };
  
    communityExplorerMod.init();
})();