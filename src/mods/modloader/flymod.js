//allows a user to fly + be invincible when pressing the shift key & arrows

(function() {
    //get ovo runtime variable
    let old = globalThis.sdk_runtime;
    c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    let runtime = globalThis.sdk_runtime;
    globalThis.sdk_runtime = old;


    globalThis.flymodToggle = function (enable) {
        if (enable) {
            // Use the bound methods when adding the event listeners
            document.addEventListener("keydown", flyMod.boundKeyDown);
            document.addEventListener("keyup", flyMod.boundKeyUp);
        } else {
            // Use the bound methods when removing the event listeners
            document.removeEventListener("keydown", flyMod.boundKeyDown);
            document.removeEventListener("keyup", flyMod.boundKeyUp);
        }
    }
    let settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['flymod']['settings'];

    globalThis.flymodSettingsUpdate = function () {
        settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['flymod']['settings'];
        speed = {x: settings["speed"], y: settings["speed"]};
    }

    let keybindDown = (event, type) => {
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
    let speed = {x: settings["speed"], y: settings["speed"]};

    var modEnabled;
    //get the player object
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
    
    //popup notification
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
    
    let flyMod = {
        init() {
            //setup general variables and presets
            this.movementKeys = [false, false, false, false];
            this.activatorKeyHeld = false;
            this.activated = false;
            // this.speed = {x: 10, y: 10};
            this.stored = [1500, true];
            this.override = false;

            this.boundKeyDown = this.keyDown.bind(this);
            this.boundKeyUp = this.keyUp.bind(this);
            
            //listen to key events
            document.addEventListener("keydown", this.boundKeyDown);
            document.addEventListener("keyup", this.boundKeyUp);
          
            runtime.tickMe(this);
          
            globalThis.ovoFlyMod = this;
            notify("Fly Mod Loaded", "Shift + [arrow keys]", "../src/img/mods/fly.png");
        },

        flymodToggle(enable) {
            if (enable) {
                // Use the bound methods when adding the event listeners
                document.addEventListener("keydown", this.boundKeyDown);
                document.addEventListener("keyup", this.boundKeyUp);
            } else {
                // Use the bound methods when removing the event listeners
                document.removeEventListener("keydown", this.boundKeyDown);
            }
        },
      
        keyDown(event) {
            //check if mod is enabled & shift arrows => allow to fly
            let key = event.key.toLowerCase();
            if (keybindDown(event, "activatorkeybind") && !this.override) {
                console.log("womp womp")
                this.activatorKeyHeld = true;
            } else if (event.keyCode >= 37 && event.keyCode <= 40 && this.activatorKeyHeld) {
                if (!this.activated) {
                    console.log(this.startActivation)
                    console.log(this)
                    console.log(this.activated)

                    this.startActivation();
                    this.activated = true;
                }
                
                this.movementKeys[event.keyCode - 37] = true;
            }
            
            
            
            
        },
      
        keyUp(event) {
            //activated variable can only be true if it was set true in the first palce
            //if shift is released, disable fly
            let key = event.key.toLowerCase();
            if (keybindDown(event, "activatorkeybind")&& this.activatorKeyHeld) {
                this.activatorKeyHeld = false;
              
                if (this.activated) {
                    this.movementKeys = [false, false, false, false];
                    this.activated = false;
                    this.endActivation();
                }
            } else if (event.keyCode >= 37 && event.keyCode <= 40 && this.activatorKeyHeld) {
                this.movementKeys[event.keyCode - 37] = false;
            }
        },
      
        startActivation() {
            let player = getPlayer();
          
            if (player) {
                this.stored = [player.behavior_insts[0].g, player.collisionsEnabled];
            } else {
                this.stored = [1500, true];
            }
          
            notify("Fly Mod", "Fly Enabled");
        },
      
        endActivation() {
            let player = getPlayer();
          
            if (player) {
                player.behavior_insts[0].g = this.stored[0];
                player.collisionsEnabled = this.stored[1];
            }
          
            notify("Fly Mod", "Fly Disabled");
        },
      
        speedX(speed) {
            speed.x = speed;
        },
      
        speedY(speed) {
            speed.y = speed;
        },
      
        setSpeed(speed) {
            speed.x = speed;
            speed.y = speed;  //
        },

        setOverride(value) {
            this.override = !!value;
        },
      
        tick() {
            //if fly is enabled, do the fly stuff
            if (this.activated) {
                let player = getPlayer();
              
                if (player) {
                    if (!!player.behavior_insts[0].g || player.collisionsEnabled) {
                        player.behavior_insts[0].g = 0;
                        player.collisionsEnabled = false
                    }
                  
                    let moveX = this.movementKeys[2] - this.movementKeys[0];
                    let moveY = this.movementKeys[3] - this.movementKeys[1];
                    player.x += moveX * speed.x;
                    player.y += moveY * speed.y;
                }
            }
        }
    };
  
    flyMod.init();
})();