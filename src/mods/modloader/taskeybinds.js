(function () {
    let old = globalThis.sdk_runtime;
    c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    let runtime = globalThis.sdk_runtime;
    globalThis.sdk_runtime = old;
  
    let notify = (text, title = "yoooooo", image = "./speedrunner.png") => {
      cr.plugins_.sirg_notifications.prototype.acts.AddSimpleNotification.call(
        runtime.types_by_index.find(
          (type) => type.plugin instanceof cr.plugins_.sirg_notifications
        ).instances[0],
        title,
        text,
        image
      );
    };

    let settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['taskeybinds']['settings'];
    globalThis.taskeybindsSettingsUpdate = function () {
      settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['taskeybinds']['settings'];
    }

    let keybindDown = (event, type) => {
        console.log(event.key, settings[type])
        console.log(settings)
        if(settings[type].length === 2) { //special + regular
          if (event.key.toLowerCase() === settings[type][1]) {
            if ((event.shiftKey && settings[type][0] === "shift") || (event.ctrlKey && settings[type][0] === "control") || (event.altKey && settings[type][0] === "alt") || (event.metaKey && settings[type][0] === "meta")) {
              return true;
            }
          }
        } else { //regular (1 key)
          if (event.key.toLowerCase() === settings[type][0]) {
            return true;
          }
        }
        return false;
      }
  
    notify("Mod loaded", "timescale shortcut mod loaded", "../src/img/mods/taskeybinds.png");
    let keyDown = (event) => {
      if (keybindDown(event, "timescale1keybind")) {
        ovoTasTools.timescale = 1
        notify("timescale set to 1");
      }
      else if (keybindDown(event, "timescale0.5keybind")) {
        ovoTasTools.timescale = 0.5
          notify("timescale set to 0.5");
      }
      else if (keybindDown(event, "timescale0.02keybind")) {
        ovoTasTools.timescale = 0.02
          notify("timescale set to 0.02");
      }
      else if (keybindDown(event, "timescale0.2keybind")) {
        ovoTasTools.timescale = 0.2
        notify("timescale set to 0.2");
      }
      else if (keybindDown(event, "timescale0.07keybind")) {
        ovoTasTools.timescale = 0.07
        notify("timescale set to 0.07");
      } 
      else if (keybindDown(event, "timescale0.05keybind")) {        
        ovoTasTools.timescale = 0.05
        notify("timescale set to 0.05");
      }
      else if (keybindDown(event, "timescale0.1keybind")) {
        ovoTasTools.timescale = 0.1
        notify("timescale set to 0.1");
      }
      else if (keybindDown(event, "timescalex2keybind")) {
        ovoTasTools.timescale *= 2
        notify("timescale set to *2");
      }
      else if (keybindDown(event, "timescalex5keybind")) {
        ovoTasTools.timescale *= 5
        notify("timescale set to *5");
      }
      else if (keybindDown(event, "timescale/2keybind")) {
        ovoTasTools.timescale /= 2
        notify("timescale set to /2");
      }
      else if (keybindDown(event, "timescale/5keybind")) {
        ovoTasTools.timescale /= 5
        notify("timescale set to /5");
      }
      else if(keybindDown(event, "automjkeybind")) {
        ovoTasTools.loadInputs([["Down"],])
        ovoTasTools.playInputs()
        notify("auto mj inputed");
      } else if (keybindDown(event, "autojumpkeybind")) {
        ovoTasTools.loadInputs([["Jump"],["Jump"],["Jump"],["Jump"],["Jump"],])
        ovoTasTools.playInputs()
        notify("auto jump inputed");
        
      }
    };
    globalThis.taskeybindsToggle = function (enable) {
      if (enable) {
        document.addEventListener("keydown", keyDown);
      } else {
        document.removeEventListener("keydown", keyDown);
        try {
          ovoTasTools.timescale = 1
        } catch (e) {}
      }
    }
    document.addEventListener("keydown", keyDown);
  })();