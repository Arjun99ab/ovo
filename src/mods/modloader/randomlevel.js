(function() {
    let old = globalThis.sdk_runtime;
    c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    let runtime = globalThis.sdk_runtime;
    globalThis.sdk_runtime = old;

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
    let settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['randomlevel']['settings'];

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
    globalThis.randomlevelToggle = function (enable) {
        if (enable) {
            // Use the bound methods when adding the event listeners
            document.addEventListener("keydown", randomlevel.boundKeyDown);
        } else {
            // Use the bound methods when removing the event listeners
            document.removeEventListener("keydown", randomlevel.boundKeyDown);
        }
    }
    globalThis.randomlevelSettingsUpdate = function () {
        settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['randomlevel']['settings'];
      }

    let randomlevel = {
        init() {
            this.boundKeyDown = this.keyDown.bind(this);
            document.addEventListener("keydown", this.boundKeyDown);

            this.interval = null;
            globalThis.ovoRandomLevel = this;
            notify("Random Level Mod loaded", "Teleport to a random level!", "../src/img/mods/randomlevel.png");
        },
        keyDown(event) {
            if (keybindDown(event, "randomlevelkeybind")) {
                this.loadRandomLevel();
            }
        },

        loadRandomLevel() {
            runtime.changelayout = runtime.layouts[Object.keys(runtime.layouts)[Math.floor(Math.random() * Object.keys(runtime.layouts).length)]]
        },

        startCycle(time) {
            if (!this.interval) {
                this.interval = setInterval(this.loadRandomLevel, time);
            }
        },

        stopCycle() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }
    }

    randomlevel.init();
})()