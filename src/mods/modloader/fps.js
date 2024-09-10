
(function() {
    let runtime = cr_getC2Runtime();

    let settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['fps']['settings'];

    let currentMouseCoords = [];
    var elementMoving = null;
    var startingMouseCoords = []; 

    let moving = false;

    let enabled = true;
    

    let keyColors = {
        "up": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]],
        "down": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]],
        "left": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]],
        "right": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]]
    }


    globalThis.fpsToggleMoving = function (enable) {
        moving = enable;
        document.getElementById("fps").style.cursor = enable ? "grab" : "default";
    }

    globalThis.fpsToggle = function (enable) {
        if (enable) {
            enabled = true;
        } else {
            document.getElementById("fps").style.display = "none";
            enabled = false;
        }
    }

    globalThis.fpsSettingsUpdate = function () {
        settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['fps']['settings'];
        keyColors = {
            "up": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]],
            "down": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]],
            "left": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]],
            "right": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]]
        }
        let fps = document.getElementById("fps")
        fps.style.top = `${settings["position"].split(' ')[0]}px`;
        fps.style.left = `${settings["position"].split(' ')[1]}px`;
        // arrowsContainer.style.fontFamily = `${settings["font"]}`;
        fps.style.transform = `scale(${settings["scale"]})`;
        fps.style.opacity = `${settings["opacity"]}`;
        

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
            backgroundColor: "white",
            border: "2px solid black",
            fontFamily: "Retron2000",
            position: "absolute",
            top: `${top}px`,
            left: `${left}px`,
            padding: "5px",
            color: "black",
            fontSize: "10pt",
            display: "none",
            cursor: "pointer",
        };
        Object.keys(c).forEach(function (a) {
            b.style[a] = c[a];
        });
        b.id = id1;
        b.name = name;
        const newContent = document.createTextNode("N/A");

        // add the text node to the newly created div
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
                settings['mods']['fps']['settings']["position"] = `${parseInt(elementMoving.style.top)} ${parseInt(elementMoving.style.left)}`;
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
                settings['mods']['fps']['settings']["position"] = `${parseInt(elementMoving.style.top)} ${parseInt(elementMoving.style.left)}`;
                localStorage.setItem('modSettings', JSON.stringify(settings));

                elementMoving = null;
                startingMouseCoords = null;

            }
        });

        document.body.appendChild(b);

    }

    let fps = {
        init() {

            document.addEventListener('mousemove', (event) => {
                currentMouseCoords = [event.clientX, event.clientY]
            });
            
            createGuiElement('fps', settings["position"].split(' ')[0], settings["position"].split(' ')[0], "FPS")

            runtime.tickMe(this);
            console.log("init complete")
            notify("by Awesomeguy", "FPS Mod Loaded", "../src/img/mods/fps.png");
        },



        tick() {
            if (!enabled) {
                return;
            }
            if((isInLevel() && runtime.running_layout.name !== "Level Menu") || moving ) {
                console.log("cuh")
                document.getElementById("fps").style.display = "block";
                document.getElementById("fps").innerHTML = runtime.fps;
            } else {
                // console.log("cuh^2")
                document.getElementById("fps").style.display = "none";
            }
            if (detectDeviceType() === "pc") {
                if(elementMoving !== null && moving) {
                    elementMoving.style.left = (currentMouseCoords[0] - startingMouseCoords[0] + parseInt(elementMoving.style.left)).toString() + 'px';
                    elementMoving.style.top = (currentMouseCoords[1] - startingMouseCoords[1] + parseInt(elementMoving.style.top)).toString() + 'px';
                    startingMouseCoords  = currentMouseCoords;
                }
            }
            
        },

        toString() { //need tostring because add tick obj ios bug
            return "awesomeguy.fps";
        }
    };
    fps.init();
})();