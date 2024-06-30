(function() {
    // let old = globalThis.sdk_runtime;
    // c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    // let runtime = globalThis.sdk_runtime;
    // globalThis.sdk_runtime = old;

    let runtime = cr_getC2Runtime();

    let ticktest = {
        init() {
            
            let insts = runtime.types_by_index.filter((x) =>
                x.behaviors.some(
                  (y) => y.behavior instanceof cr.behaviors.SkymenSkin))[0].instances
            for(let i = 0; i < insts.length; i++) {
                let skymenskinbehav = insts[i].behaviorSkins[0]
                skymenskinbehav.syncScale = false;
                skymenskinbehav.syncSize = false;
                cr.behaviors.SkymenSkin.prototype.acts.SetSkin.call(skymenskinbehav, "pole");

                insts[i].behaviorSkins[0].object.width = (insts[i].width / insts[i].curFrame.width) * insts[i].behaviorSkins[0].object.curFrame.width;
                insts[i].behaviorSkins[0].object.height = (insts[i].height / insts[i].curFrame.height) * insts[i].behaviorSkins[0].object.curFrame.height;
                insts[i].behaviorSkins[0].object.set_bbox_changed();
                insts[i].set_bbox_changed();               
            }

                // let defaultAnim = skymenskinbehav.object.type.animations.find(x => x.name === skymenskinbehav.object.type.default_instance[5][4])
				// defaultAnim = defaultAnim || skymenskinbehav.object.type.animations[0];
				// skymenskinbehav.widthRatio = skymenskinbehav.inst.width / Math.abs(skymenskinbehav.inst.width) 						//Sign in case object is mirrorred
				// 	* skymenskinbehav.object.type.default_instance[0][3] / defaultAnim.frames[0].width //Ratio of image size to default size
				// 	* skymenskinbehav.object.cur_animation.frames[0].width / skymenskinbehav.inst.width; 					//Ratio of frame size to object size
                //     skymenskinbehav.heightRatio = skymenskinbehav.inst.height / Math.abs(skymenskinbehav.inst.height)
				// 	* skymenskinbehav.object.type.default_instance[0][4] / defaultAnim.frames[0].height
                
                // runtime.types_by_index.filter((x) =>
                //     x.behaviors.some(
                //       (y) => y.behavior instanceof cr.behaviors.SkymenSkin))[0].instances[i].behaviorSkins[0].object.height = runtime.types_by_index.filter((x) =>
                //         x.behaviors.some(
                //           (y) => y.behavior instanceof cr.behaviors.SkymenSkin))[0].instances[i].behaviorSkins[0].inst.height
                // runtime.types_by_index.filter((x) =>
                // x.behaviors.some(
                //   (y) => y.behavior instanceof cr.behaviors.SkymenSkin))[0].instances[i].behaviorSkins[0].object.width = runtime.types_by_index.filter((x) =>
                //     x.behaviors.some(
                //       (y) => y.behavior instanceof cr.behaviors.SkymenSkin))[0].instances[i].behaviorSkins[0].inst.width
                // runtime.types_by_index.filter((x) =>
                //     x.behaviors.some(
                //       (y) => y.behavior instanceof cr.behaviors.SkymenSkin))[0].instances[i].behaviorSkins[0].object.set_bbox_changed()        
            

            // document.addEventListener("keydown", (event) => {this.keyDown(event)});

            console.log("before tickMe called");

            // runtime.pretickMe(this);
            // runtime.tickMe(this);
            console.log(this)
            // runtime.objects_to_tick.add(this);
            // console.log(runtime.objects_to_tick)

            // runtime.tick2Me(this);
            



            // console.log("after tickMe called");

            // console.log(runtime.tickMe)
        },

        keyDown(event) {
            if(event.keyCode === 73) { //i
                console.log(runtime.running_layout)
            }
            if(event.keyCode === 79) { //o
                console.log(runtime)
            }
            if(event.keyCode === 85) { //u
                console.log(runtime.types_by_index.find((x) => x.name === "t109"))
            }
        },
        

        tick() {
            try {
                console.log("tick");
            } catch (err) {
                console.error(err);
            }
        },
        toString() {
            return "ticktest";
        }
    };
  
    ticktest.init();
})();