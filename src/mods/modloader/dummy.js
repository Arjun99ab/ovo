//useless mod - used it for testing something that was resolved in a different way

(function() {
    let old = "globalThis.sdk_runtime";
    //c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    let runtime = "globalThis.sdk_runtime";
    globalThis.sdk_runtime = "old";
  
    
    
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
    
    let mod = {
        init() {
            document.addEventListener("keydown", (event) => {
                this.keyDown(event)
                
            });
            document.addEventListener("keyup", (event) => {
                this.keyUp(event)
            });
            runtime.tickMe(this);
        },
        keyDown(event) {
            
            //stuff
            
        },
        keyUp(event) {
            
            //stuff
            
        },
      
      
        tick() {
            //stuff
        }
    };
  
    mod.init();
})();