(function() {
    // let old = globalThis.sdk_runtime;
    // c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    // let runtime = globalThis.sdk_runtime;
    // globalThis.sdk_runtime = old;

    let runtime = cr_getC2Runtime();

    let ticktest = {
        init() {

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