
(function() {
    let runtime = cr_getC2Runtime();

    let settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['keystrokes']['settings'];

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


    globalThis.keystrokesToggleMoving = function (enable) {
        moving = enable;
        document.getElementById("arrowsContainer").style.cursor = enable ? "grab" : "default";
    }

    globalThis.keystrokesToggle = function (enable) {
        if (enable) {
            enabled = true;
        } else {
            document.getElementById("arrowsContainer").style.display = "none";
            enabled = false;
        }
    }

    globalThis.keystrokesSettingsUpdate = function () {
        settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['keystrokes']['settings'];
        keyColors = {
            "up": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]],
            "down": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]],
            "left": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]],
            "right": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]]
        }
        let arrowsContainer = document.getElementById("arrowsContainer")
        arrowsContainer.style.top = `${settings["position"].split(' ')[0]}px`;
        arrowsContainer.style.left = `${settings["position"].split(' ')[1]}px`;
        // arrowsContainer.style.fontFamily = `${settings["font"]}`;
        arrowsContainer.style.transform = `scale(${settings["scale"]})`;
        arrowsContainer.style.opacity = `${settings["opacity"]}`;
        
        Array.from(arrowsContainer.children).forEach(child => {
            let arrow = child.id;
            child.style.backgroundColor = keyColors[arrow][0];
            child.style.color = keyColors[arrow][2];
            child.style.border = settings["border"] ? "2px solid black" : "none"
        });
        

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
            backgroundColor: settings["inactivecolor"],
            border: settings["border"] ? "2px solid black" : "none",
            position: "absolute",
            top: top.toString() + "px",
            left: left.toString() + "px",
            padding: "10px",
            color: settings["inactivetextcolor"],
            // display: "block",

        };
        Object.keys(c).forEach(function (a) {
            b.style[a] = c[a];
        });
        b.id = id1;
        b.innerHTML = name;
        return b;
    }

    let keystrokes = {
        init() {
            this.movementKeys = [];
            this.arrows = ["left", "up", "right", "down"];

            document.addEventListener('mousemove', (event) => {
                currentMouseCoords = [event.clientX, event.clientY]
            });

            let arrowsContainer = document.createElement("div");
            arrowsContainer.id = "arrowsContainer";
            let c = {
                position: "absolute",
                top: `${settings["position"].split(' ')[0]}px`,
                left: `${settings["position"].split(' ')[1]}px`,
                fontFamily: 'Arial',
                fontSize: "14pt",
                display: "block",
                transform: `scale(${settings["scale"]})`,
                opacity: `${settings["opacity"]}`, 
                // backgroundColor: "blue",
                // border: "2px solid black",
                cursor: "default",
                zIndex: "1000",
                userSelect: "none",
            };
            Object.keys(c).forEach(function (a) {
                arrowsContainer.style[a] = c[a];
            });

            arrowsContainer.addEventListener('mousedown', (event) => {
                //onsole.log(event.button)
                if(event.button === 0 && moving) {
                    elementMoving = arrowsContainer;
                    startingMouseCoords = [event.clientX, event.clientY]
                }
                
            });
            arrowsContainer.addEventListener('mouseup', (event) => {
                if(event.button === 0 && elementMoving !== null && moving) {
                    settings = JSON.parse(localStorage.getItem("modSettings"));
                    settings['mods']['keystrokes']['settings']["position"] = `${parseInt(elementMoving.style.top)} ${parseInt(elementMoving.style.left)}`;
                    localStorage.setItem('modSettings', JSON.stringify(settings));
    
                    elementMoving = null;
                    startingMouseCoords = null;
                }
                
            });
            arrowsContainer.addEventListener('touchstart', (event) => {
                if (event.touches.length === 1 && moving) {
                    elementMoving = arrowsContainer;
                    startingMouseCoords = [event.touches[0].clientX, event.touches[0].clientY];
                }
            });

            arrowsContainer.addEventListener('touchmove', (event) => {
                if (elementMoving !== null && event.touches.length === 1 && moving) {
                    currentMouseCoords = [event.touches[0].clientX, event.touches[0].clientY];
                    elementMoving.style.left = (currentMouseCoords[0] - startingMouseCoords[0] + parseInt(elementMoving.style.left)).toString() + 'px';
                    elementMoving.style.top = (currentMouseCoords[1] - startingMouseCoords[1] + parseInt(elementMoving.style.top)).toString() + 'px';
                    startingMouseCoords = currentMouseCoords;
                }
            });

            arrowsContainer.addEventListener('touchend', (event) => {
                if (elementMoving !== null && moving) {
                    settings = JSON.parse(localStorage.getItem("modSettings"));
                    settings['mods']['keystrokes']['settings']["position"] = `${parseInt(elementMoving.style.top)} ${parseInt(elementMoving.style.left)}`;
                    localStorage.setItem('modSettings', JSON.stringify(settings));

                    elementMoving = null;
                    startingMouseCoords = null;

                }
            });

            this.arrows.forEach((arrow) => {
                let top, left;
                switch (arrow) {
                    case "up":
                        top = 0;
                        left = 50;
                        break;
                    case "down":
                        top = 52;
                        left = 50;
                        break;
                    case "left":
                        top = 52;
                        left = 2;
                        break;
                    case "right":
                        top = 52;
                        left = 90;
                        break;
                }
                let arrowElement = createGuiElement(arrow, top, left, `&#x219${arrow === "up" ? 1 : arrow === "right" ? 2 : arrow === "left" ? 0 : 3};`);
                arrowsContainer.appendChild(arrowElement);
            });



            document.body.appendChild(arrowsContainer);


            // createGuiElement("up", 150, 150, "&#8593;");
            // createGuiElement("down", 200, 150, "&#8595;" );
            // createGuiElement("left", 200, 105, "&#8592;");
            // createGuiElement("right", 200, 190, "&#8594;");

            if (detectDeviceType() === "pc") {
                document.addEventListener("keydown", (event) => {
                    this.keyDown(event)
                    
                });
                document.addEventListener("keyup", (event) => {
                    this.keyUp(event)
                });
                let inputsObject = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals && x.instvar_sids.length === 6).instances[0];
                this.movementKeys = (inputsObject.instance_vars).slice(0, 4); //Left, Up, Right, Down
            } 
            runtime.tickMe(this);
            console.log("init complete")
            notify("by Awesomeguy", "Keystrokes Mod Loaded", "../src/img/mods/keystrokes.png");
        },

        keyDown(event) {
            if (this.movementKeys.includes(event.keyCode)) {
                let arrow = this.arrows[this.movementKeys.indexOf(event.keyCode)]
                document.getElementById(arrow).style.backgroundColor = keyColors[arrow][1];
                document.getElementById(arrow).style.color = keyColors[arrow][3];
            }
        },

        keyUp(event) {
            if (this.movementKeys.includes(event.keyCode)) {
                let arrow = this.arrows[this.movementKeys.indexOf(event.keyCode)]
                document.getElementById(arrow).style.backgroundColor = keyColors[arrow][0];
                document.getElementById(arrow).style.color = keyColors[arrow][2];
            }
        },


        tick() {
            try {
                if (!enabled) {
                    return;
                }
                if((isInLevel() && runtime.running_layout.name !== "Level Menu") || moving ) {
                    document.getElementById("arrowsContainer").style.display = "block";
                } else {
                    document.getElementById("arrowsContainer").style.display = "none";
                }
                if (detectDeviceType() === "pc") {
                    if(elementMoving !== null && moving) {
                        elementMoving.style.left = (currentMouseCoords[0] - startingMouseCoords[0] + parseInt(elementMoving.style.left)).toString() + 'px';
                        elementMoving.style.top = (currentMouseCoords[1] - startingMouseCoords[1] + parseInt(elementMoving.style.top)).toString() + 'px';
                        startingMouseCoords  = currentMouseCoords;
                    }
                }
                if (detectDeviceType() === "mobile") {
                    let touch = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Touch).instances[0]
                    let uiDirection = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Sprite && x.all_frames && x.all_frames[0].texture_file.includes("uidirection"))
                    uiDirection.pushCleanSol();
                    
                    if (cr.plugins_.Touch.prototype.cnds.IsTouchingObject.call(touch, uiDirection)) {
                        document.getElementById("up").style.backgroundColor = uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]).includes("up") ? keyColors["up"][1] : keyColors["up"][0];
                        document.getElementById("down").style.backgroundColor = uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]).includes("down") ? keyColors["up"][1] : keyColors["up"][0]
                        document.getElementById("left").style.backgroundColor = uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]).includes("left") ? keyColors["up"][1] : keyColors["up"][0];
                        document.getElementById("right").style.backgroundColor = uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]).includes("right") ? keyColors["up"][1] : keyColors["up"][0];
                        
                        document.getElementById("up").style.color = uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]).includes("up") ? keyColors["up"][3] : keyColors["up"][2];
                        document.getElementById("down").style.color = uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]).includes("down") ? keyColors["up"][3] : keyColors["up"][2]
                        document.getElementById("left").style.color = uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]).includes("left") ? keyColors["up"][3] : keyColors["up"][2];
                        document.getElementById("right").style.color = uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]).includes("right") ? keyColors["up"][3] : keyColors["up"][2];
                        
                    
                    } else {
                        document.getElementById("up").style.backgroundColor = keyColors["up"][0];
                        document.getElementById("down").style.backgroundColor = keyColors["up"][0];
                        document.getElementById("left").style.backgroundColor = keyColors["up"][0];
                        document.getElementById("right").style.backgroundColor = keyColors["up"][0];

                        document.getElementById("up").style.color = keyColors["up"][2];
                        document.getElementById("down").style.color = keyColors["up"][2];
                        document.getElementById("left").style.color = keyColors["up"][2];
                        document.getElementById("right").style.color = keyColors["up"][2];
                    }
                    uiDirection.popSol();

                }
            } catch {}
        },

        toString() { //need tostring because add tick obj ios bug
            return "awesomeguy.keystrokes";
        }
    };
    keystrokes.init();
})();