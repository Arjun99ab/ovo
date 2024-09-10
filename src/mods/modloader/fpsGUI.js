
(function() {
    let runtime = cr_getC2Runtime();

    let settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['fpsGUI']['settings'];

    let currentMouseCoords = [];
    var elementMoving = null;
    var startingMouseCoords = []; 

    let moving = false;

    let enabled = true;


    globalThis.fpsGUIToggleMoving = function (enable) {
        moving = enable;
        document.getElementById("gui-fps").style.cursor = enable ? "grab" : "default";
    }

    globalThis.fpsGUIToggle = function (enable) {
        if (enable) {
            enabled = true;
        } else {
            document.getElementById("gui-fps").style.display = "none";
            enabled = false;
        }
    }

    globalThis.fpsGUISettingsUpdate = function () {
        settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['fpsGUI']['settings'];
        let fps = document.getElementById("gui-fps")
        fps.style.top = `${settings["position"].split(' ')[0]}px`;
        fps.style.left = `${settings["position"].split(' ')[1]}px`;
        fps.style.transform = `scale(${settings["scale"]})`;
        fps.style.opacity = `${settings["opacity"]}`;
        fps.style.color = settings["textcolor"];
        fps.style.backgroundColor = settings["backgroundcolor"];
        fps.style.border = settings["border"] ? "2px solid black" : "none";
        
        

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
                settings['mods']['fpsGUI']['settings']["position"] = `${parseInt(elementMoving.style.top)} ${parseInt(elementMoving.style.left)}`;
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
                settings['mods']['fpsGUI']['settings']["position"] = `${parseInt(elementMoving.style.top)} ${parseInt(elementMoving.style.left)}`;
                localStorage.setItem('modSettings', JSON.stringify(settings));

                elementMoving = null;
                startingMouseCoords = null;

            }
        });

        return b;

    }

    let fpsGUI = {
        init() {

            document.addEventListener('mousemove', (event) => {
                currentMouseCoords = [event.clientX, event.clientY]
            });
            
            let fpsElement = createGuiElement('gui-fps', settings["position"].split(' ')[0], settings["position"].split(' ')[1], "FPS")
            document.body.appendChild(fpsElement);
            runtime.tickMe(this);
            console.log("init complete")
            notify("by Awesomeguy", "FPS GUI Loaded", "../src/img/mods/fpsGUI.png");
        },



        tick() {
            try {
                if (!enabled) {
                    return;
                }
                if((isInLevel() && runtime.running_layout.name !== "Level Menu") || moving ) {
                    document.getElementById("gui-fps").style.display = "block";
                    document.getElementById("gui-fps").innerHTML = runtime.fps;
                } else {
                    // console.log("cuh^2")
                    document.getElementById("gui-fps").style.display = "none";
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
            return "awesomeguy.fpsGUI";
        }
    };
    fpsGUI.init();
})();