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
    globalThis.randomlevelToggle = function (enable) {
        if (enable) {
            // Use the bound methods when adding the event listeners
            document.addEventListener("keydown", randomlevel.boundKeyDown);
        } else {
            // Use the bound methods when removing the event listeners
            document.removeEventListener("keydown", randomlevel.boundKeyDown);
        }
    }

    let randomlevel = {
        init() {
            this.boundKeyDown = this.keyDown.bind(this);
            document.addEventListener("keydown", this.boundKeyDown);

            this.interval = null;
            globalThis.ovoRandomLevel = this;
            notify("Random Level Mod loaded", "Shift + Y", "./tutorials.png");
        },
        keyDown(event) {
            if (event.code === "KeyY") {
                if (event.shiftKey) {
                    this.loadRandomLevel();
                }
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