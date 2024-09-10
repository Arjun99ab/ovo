
(function() {
    let runtime = cr_getC2Runtime();

    let settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['stateGUI']['settings'];

    let currentMouseCoords = [];
    var elementMoving = null;
    var startingMouseCoords = []; 

    let moving = false;

    let enabled = true;


    globalThis.stateGUIToggleMoving = function (enable) {
        moving = enable;
        document.getElementById("gui-state").style.cursor = enable ? "grab" : "default";
    }

    globalThis.stateGUIToggle = function (enable) {
        if (enable) {
            enabled = true;
        } else {
            document.getElementById("gui-state").style.display = "none";
            enabled = false;
        }
    }

    globalThis.stateGUISettingsUpdate = function () {
        settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['stateGUI']['settings'];
        let state = document.getElementById("gui-state")
        state.style.top = `${settings["position"].split(' ')[0]}px`;
        state.style.left = `${settings["position"].split(' ')[1]}px`;
        state.style.transform = `scale(${settings["scale"]})`;
        state.style.opacity = `${settings["opacity"]}`;
        state.style.color = settings["textcolor"];
        state.style.backgroundColor = settings["backgroundcolor"];
        state.style.border = settings["border"] ? "2px solid black" : "none";
        
        

    }

    let isInLevel = () => {
        return runtime.running_layout.name.startsWith("Level")
    };

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

    let detectDeviceType = () => 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'pc';

    let createGuiElement = (id1, top, left, name) => {
        let b = document.createElement("div")
        let c = {
            backgroundColor: settings["backgroundcolor"],
            border: settings["border"] ? "2px solid black" : "none",
            fontFamily: "Retron2000",
            position: "absolute",
            top: `${top}px`,
            left: `${left}px`,
            padding: "5px",
            color: settings["textcolor"],
            fontSize: "10pt",
            transform: `scale(${settings["scale"]})`,
            opacity: `${settings["opacity"]}`, 
            display: "block",
            cursor: "default",
            zIndex: "1000",
            userSelect: "none",
        };
        Object.keys(c).forEach(function (a) {
            b.style[a] = c[a];
        });
        b.id = id1;
        b.name = name;
        const newContent = document.createTextNode("N/A");

        b.appendChild(newContent);

        b.addEventListener('mousedown', (event) => {
            //onsole.log(event.button)
            if(event.button === 0 && moving) {
                elementMoving = b;
                startingMouseCoords = [event.clientX, event.clientY]
            }
            
        });
        b.addEventListener('mouseup', (event) => {
            if(event.button === 0 && elementMoving !== null && moving) {
                settings = JSON.parse(localStorage.getItem("modSettings"));
                settings['mods']['stateGUI']['settings']["position"] = `${parseInt(elementMoving.style.top)} ${parseInt(elementMoving.style.left)}`;
                localStorage.setItem('modSettings', JSON.stringify(settings));

                elementMoving = null;
                startingMouseCoords = null;
            }
            
        });
        b.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1 && moving) {
                elementMoving = b;
                startingMouseCoords = [event.touches[0].clientX, event.touches[0].clientY];
            }
        });

        b.addEventListener('touchmove', (event) => {
            if (elementMoving !== null && event.touches.length === 1 && moving) {
                currentMouseCoords = [event.touches[0].clientX, event.touches[0].clientY];
                elementMoving.style.left = (currentMouseCoords[0] - startingMouseCoords[0] + parseInt(elementMoving.style.left)).toString() + 'px';
                elementMoving.style.top = (currentMouseCoords[1] - startingMouseCoords[1] + parseInt(elementMoving.style.top)).toString() + 'px';
                startingMouseCoords = currentMouseCoords;
            }
        });

        b.addEventListener('touchend', (event) => {
            if (elementMoving !== null && moving) {
                settings = JSON.parse(localStorage.getItem("modSettings"));
                settings['mods']['stateGUI']['settings']["position"] = `${parseInt(elementMoving.style.top)} ${parseInt(elementMoving.style.left)}`;
                localStorage.setItem('modSettings', JSON.stringify(settings));

                elementMoving = null;
                startingMouseCoords = null;

            }
        });

        return b;

    }

    let stateGUI = {
        init() {

            document.addEventListener('mousemove', (event) => {
                currentMouseCoords = [event.clientX, event.clientY]
            });
            
            let stateElement = createGuiElement('gui-state', settings["position"].split(' ')[0], settings["position"].split(' ')[1], "state")
            document.body.appendChild(stateElement);
            runtime.tickMe(this);
            console.log("init complete")
            notify("by Awesomeguy", "State GUI Loaded", "../src/img/mods/stateGUI.png");
        },



        tick() {
            try {
                if (!enabled) {
                    return;
                }
                if((isInLevel() && runtime.running_layout.name !== "Level Menu") || moving ) {
                    document.getElementById("gui-state").style.display = "block";
                    let playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
                    let player = playerInstances[0];  
                    if(Math.abs(player.behavior_insts[0].dx) > 551) {
                        document.getElementById("gui-state").innerHTML = "Rejump/1FSJ";
                    } else if(Math.abs(player.behavior_insts[0].dx) > 500) {
                        document.getElementById("gui-state").innerHTML = "Sliding";                    
                    } else if(Math.abs(player.behavior_insts[0].dx) > 450) {
                        document.getElementById("gui-state").innerHTML = "Diving";                    
                    } else if(player.behavior_insts[0].dy < 0) {
                        document.getElementById("gui-state").innerHTML = "Jumping";                    
                    } else if(player.behavior_insts[0].dy > 0) {
                        document.getElementById("gui-state").innerHTML = "Falling";                    
                    } else if(Math.abs(player.behavior_insts[0].dx) > 0) {
                        document.getElementById("gui-state").innerHTML = "Running";                    
                    } else {
                        document.getElementById("gui-state").innerHTML = "Resting"; 
                    }
                } else {
                    // console.log("cuh^2")
                    document.getElementById("gui-state").style.display = "none";
                }
                if (detectDeviceType() === "pc") {
                    if(elementMoving !== null && moving) {
                        elementMoving.style.left = (currentMouseCoords[0] - startingMouseCoords[0] + parseInt(elementMoving.style.left)).toString() + 'px';
                        elementMoving.style.top = (currentMouseCoords[1] - startingMouseCoords[1] + parseInt(elementMoving.style.top)).toString() + 'px';
                        startingMouseCoords  = currentMouseCoords;
                    }
                }
            } catch {}
            
        },

        toString() { //need tostring because add tick obj ios bug
            return "awesomeguy.stateGUI";
        }
    };
    stateGUI.init();
})();