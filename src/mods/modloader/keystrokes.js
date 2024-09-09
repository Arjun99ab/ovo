
(function() {
    let runtime = cr_getC2Runtime();

    let settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['keystrokes']['settings'];


    let keyColors = {
        "up": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]],
        "down": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]],
        "left": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]],
        "right": [settings["inactivecolor"], settings["activecolor"], settings["inactivetextcolor"], settings["activetextcolor"]]
    }


    globalThis.keystrokesToggle = function (enable) {
        if (enable) {
            document.getElementById("arrowsContainer").style.display = "block";
        } else {
            document.getElementById("arrowsContainer").style.display = "none";
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
        arrowsContainer.style.left = `${settings["position"].split(' ')[0]}px`;
        arrowsContainer.style.fontFamily = `${settings["position"].split(' ')[0]}`;
        arrowsContainer.style.transform = `scale(${settings["scale"]})`;
        arrowsContainer.style.opacity = `${settings["opacity"]}`;
        
        Array.from(arrowsContainer.children).forEach(child => {
            let arrow = child.id;
            child.style.backgroundColor = keyColors[arrow][0];
            child.style.color = keyColors[arrow][2];
            // child.style.border = settings["border"] ? "2px solid black" : "none"
        });
        

    }


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

            let arrowsContainer = document.createElement("div");
            arrowsContainer.id = "arrowsContainer";
            let c = {
                position: "absolute",
                top: `${settings["position"].split(' ')[0]}px`,
                left: `${settings["position"].split(' ')[0]}px`,
                fontFamily: `${settings["position"].split(' ')[0]}`,
                fontSize: "10pt",
                display: "block",
                transform: `scale(${settings["scale"]})`,
                opacity: `${settings["opacity"]}`, 
                // backgroundColor: "blue",
                // border: "2px solid black",
            };
            Object.keys(c).forEach(function (a) {
                arrowsContainer.style[a] = c[a];
            });

            this.arrows.forEach((arrow) => {
                let top, left;
                switch (arrow) {
                    case "up":
                        top = 0;
                        left = 50;
                        break;
                    case "down":
                        top = 50;
                        left = 50;
                        break;
                    case "left":
                        top = 50;
                        left = 5;
                        break;
                    case "right":
                        top = 50;
                        left = 90;
                        break;
                }
                let arrowElement = createGuiElement(arrow, top, left, `&#859${arrow === "up" ? 3 : arrow === "down" ? 5 : arrow === "left" ? 2 : 4};`);
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
            } else {
                runtime.tickMe(this);
            }
            console.log("init complete")
            notify("Keystrokes loaded")
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
            let touch = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Touch).instances[0]
            let uiDirection = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Sprite && x.all_frames && x.all_frames[0].texture_file.includes("uidirection"))
            if (cr.plugins_.Touch.prototype.cnds.IsTouchingObject.call(touch, uiDirection)) {
                document.getElementById("up").style.backgroundColor = uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]).includes("up") ? "red" : "white";
                document.getElementById("down").style.backgroundColor = uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]).includes("down") ? "red" : "white";
                document.getElementById("left").style.backgroundColor = uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]).includes("left") ? "red" : "white";
                document.getElementById("right").style.backgroundColor = uiDirection.getCurrentSol().getObjects().map(x=>x.instance_vars[0]).includes("right") ? "red" : "white";
            } else {
                document.getElementById("up").style.backgroundColor = "white";
                document.getElementById("down").style.backgroundColor = "white";
                document.getElementById("left").style.backgroundColor = "white";
                document.getElementById("right").style.backgroundColor = "white";
            }
        },

        toString() { //need tostring because add tick obj ios bug
            return "awesomeguy.keystrokes";
        }
    };
    keystrokes.init();
})();