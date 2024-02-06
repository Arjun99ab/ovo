//useless mod - used it for testing something that was resolved in a different way

(function() {
    // let old = "globalThis.sdk_runtime";
    // //c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    // let runtime = "globalThis.sdk_runtime";
    // globalThis.sdk_runtime = "old";
    let runtime = cr_getC2Runtime();
  
    
    
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
            this.touching = false;
            document.addEventListener("touchstart", (event) => {
                this.touchstart(event)
                
            });
            document.addEventListener("touchend", (event) => {
                this.touchend(event)
            });
            // runtime.tickMe(this);
        },
        touchstart(event) {
            // console.log('touchstart')
            // console.log(event.target.tagName)
            if (event.target.tagName === 'CANVAS') {
                // this.touching = true;
                console.log("touchstart")

                console.log(runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Touch)[0].instances[0])
            }
            

            
        },
        touchend(event) {
            if (event.target.tagName === 'CANVAS') {
                // this.touching = true;
                console.log("touchend")
                console.log(runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Touch)[0].instances[0])
            }
            // this.touching = false;
            // console.log('touchend')
            
        },
      
      
        tick() {
            try {
                if (this.touching) {
                    console.log('touching')
                    let touch = runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Touch)[0].instances[0];
                    console.log(touch.touches)
                    if (touch.touches.length > 0) {
                        console.log('touching')
                        let touch = touch.touches[0];
                        console.log(touch.x, touch.y)
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    };
  
    mod.init();
})();

// runtime.types_by_index.find(
//     (x) =>
//         (x.plugin instanceof cr.plugins_.Sprite &&
//             x.all_frames &&
//             x.all_frames[0].texture_file.includes("uidirection"))
// )