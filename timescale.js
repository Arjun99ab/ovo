(function () {
//   let old = globalThis.sdk_runtime;
//   console.log(globalThis.sdk_runtime)
//   c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
//   //let runtime = globalThis.sdk_runtime;
//   globalThis.sdk_runtime = old;

  console.log(window.cr_getC2Runtime);
  console.log(cr_getC2Runtime().timescale);
  //window.cr_getC2Runtime
  let runtime = cr_getC2Runtime()
  ovoTasTools = runtime;


  let notify = (title, text, image = "./loading-logo.png") => {
    cr.plugins_.sirg_notifications.prototype.acts.AddSimpleNotification.call(
        runtime.types_by_index.find(
            (type) => type.plugin instanceof cr.plugins_.sirg_notifications
        ).instances[0],
        title,
        text,
        image
        );
    };

    notify(
        "Timescale Mod!",
        "Mod loaded"
      );




  document.addEventListener("keydown", (event) => {
    if (event.code === "KeyA") {
        //console.log(globalThis.timescale);
        ovoTasTools.timescale = 0.2
        //console.log(runtime.fps);
        //c2_callFunction("Controls > Buffer", ["Jump"])
    }
    if (event.code === "KeyS") {
      ovoTasTools.timescale = 0.05
    }
    if (event.code === "KeyD") {
      ovoTasTools.timescale = 0.02
    }
    if (event.code === "KeyQ") {
      ovoTasTools.timescale = 1
    }
    if (event.code === "KeyW") {
      ovoTasTools.timescale = 0.1
    }
    if (event.code === "KeyE") {
      ovoTasTools.timescale = 0.01
    }
    if (event.code === "KeyZ") {
      ovoTasTools.timescale = 2
    }
    if (event.code === "KeyX") {
      ovoTasTools.timescale = 0.5
    }
    if (event.code === "KeyC") {
      ovoTasTools.timescale = 0.005
    }
    if (event.code === "KeyV") {
      ovoTasTools.timescale = 0.003
    }
    if (event.code === "KeyT") {
        // ovoTasTools.loadInputs([["jump"],])
        // ovoTasTools.playInputs()
        c2_callFunction("Controls > Buffer", ["Jump"])
        notify("tas jump inputed");
    }
    if (event.code === "KeyG") {
        // ovoTasTools.loadInputs([["Jump"],["Jump"],["Jump"],["Jump"],["Jump"],])
        // ovoTasTools.playInputs()
        c2_callFunction("Controls > Buffer", ["Jump"])
        c2_callFunction("Controls > Buffer", ["Jump"])
        c2_callFunction("Controls > Buffer", ["Jump"])
        c2_callFunction("Controls > Buffer", ["Jump"])
        c2_callFunction("Controls > Buffer", ["Jump"])
        notify("auto mj inputed");
    }
    
  });
})();