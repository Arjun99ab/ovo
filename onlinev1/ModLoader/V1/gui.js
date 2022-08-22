(function() {
    var keyboardMap = [
      "", // [0]
      "", // [1]
      "", // [2]
      "CANCEL", // [3]
      "", // [4]
      "", // [5]
      "HELP", // [6]
      "", // [7]
      "BACK_SPACE", // [8]
      "TAB", // [9]
      "", // [10]
      "", // [11]
      "CLEAR", // [12]
      "ENTER", // [13]
      "ENTER_SPECIAL", // [14]
      "", // [15]
      "SHIFT", // [16]
      "CONTROL", // [17]
      "ALT", // [18]
      "PAUSE", // [19]
      "CAPS_LOCK", // [20]
      "KANA", // [21]
      "EISU", // [22]
      "JUNJA", // [23]
      "FINAL", // [24]
      "HANJA", // [25]
      "", // [26]
      "ESCAPE", // [27]
      "CONVERT", // [28]
      "NONCONVERT", // [29]
      "ACCEPT", // [30]
      "MODECHANGE", // [31]
      "⎵", // [32]
      "PAGE_UP", // [33]
      "PAGE_DOWN", // [34]
      "END", // [35]
      "HOME", // [36]
      "←", // [37]
      "↑", // [38]
      "→", // [39]
      "↓", // [40]
      "SELECT", // [41]
      "PRINT", // [42]
      "EXECUTE", // [43]
      "PRINTSCREEN", // [44]
      "INSERT", // [45]
      "DELETE", // [46]
      "", // [47]
      "0", // [48]
      "1", // [49]
      "2", // [50]
      "3", // [51]
      "4", // [52]
      "5", // [53]
      "6", // [54]
      "7", // [55]
      "8", // [56]
      "9", // [57]
      ":", // [58]
      ";", // [59]
      "<", // [60]
      "=", // [61]
      ">", // [62]
      "?", // [63]
      "AT", // [64]
      "A", // [65]
      "B", // [66]
      "C", // [67]
      "D", // [68]
      "E", // [69]
      "F", // [70]
      "G", // [71]
      "H", // [72]
      "I", // [73]
      "J", // [74]
      "K", // [75]
      "L", // [76]
      "M", // [77]
      "N", // [78]
      "O", // [79]
      "P", // [80]
      "Q", // [81]
      "R", // [82]
      "S", // [83]
      "T", // [84]
      "U", // [85]
      "V", // [86]
      "W", // [87]
      "X", // [88]
      "Y", // [89]
      "Z", // [90]
      "OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
      "", // [92]
      "CONTEXT_MENU", // [93]
      "", // [94]
      "SLEEP", // [95]
      "NUMPAD0", // [96]
      "NUMPAD1", // [97]
      "NUMPAD2", // [98]
      "NUMPAD3", // [99]
      "NUMPAD4", // [100]
      "NUMPAD5", // [101]
      "NUMPAD6", // [102]
      "NUMPAD7", // [103]
      "NUMPAD8", // [104]
      "NUMPAD9", // [105]
      "MULTIPLY", // [106]
      "ADD", // [107]
      "SEPARATOR", // [108]
      "SUBTRACT", // [109]
      "DECIMAL", // [110]
      "DIVIDE", // [111]
      "F1", // [112]
      "F2", // [113]
      "F3", // [114]
      "F4", // [115]
      "F5", // [116]
      "F6", // [117]
      "F7", // [118]
      "F8", // [119]
      "F9", // [120]
      "F10", // [121]
      "F11", // [122]
      "F12", // [123]
      "F13", // [124]
      "F14", // [125]
      "F15", // [126]
      "F16", // [127]
      "F17", // [128]
      "F18", // [129]
      "F19", // [130]
      "F20", // [131]
      "F21", // [132]
      "F22", // [133]
      "F23", // [134]
      "F24", // [135]
      "", // [136]
      "", // [137]
      "", // [138]
      "", // [139]
      "", // [140]
      "", // [141]
      "", // [142]
      "", // [143]
      "NUM_LOCK", // [144]
      "SCROLL_LOCK", // [145]
      "WIN_OEM_FJ_JISHO", // [146]
      "WIN_OEM_FJ_MASSHOU", // [147]
      "WIN_OEM_FJ_TOUROKU", // [148]
      "WIN_OEM_FJ_LOYA", // [149]
      "WIN_OEM_FJ_ROYA", // [150]
      "", // [151]
      "", // [152]
      "", // [153]
      "", // [154]
      "", // [155]
      "", // [156]
      "", // [157]
      "", // [158]
      "", // [159]
      "CIRCUMFLEX", // [160]
      "EXCLAMATION", // [161]
      "DOUBLE_QUOTE", // [162]
      "HASH", // [163]
      "DOLLAR", // [164]
      "PERCENT", // [165]
      "AMPERSAND", // [166]
      "UNDERSCORE", // [167]
      "OPEN_PAREN", // [168]
      "CLOSE_PAREN", // [169]
      "ASTERISK", // [170]
      "PLUS", // [171]
      "PIPE", // [172]
      "HYPHEN_MINUS", // [173]
      "OPEN_CURLY_BRACKET", // [174]
      "CLOSE_CURLY_BRACKET", // [175]
      "TILDE", // [176]
      "", // [177]
      "", // [178]
      "", // [179]
      "", // [180]
      "VOLUME_MUTE", // [181]
      "VOLUME_DOWN", // [182]
      "VOLUME_UP", // [183]
      "", // [184]
      "", // [185]
      "SEMICOLON", // [186]
      "EQUALS", // [187]
      "COMMA", // [188]
      "MINUS", // [189]
      "PERIOD", // [190]
      "SLASH", // [191]
      "BACK_QUOTE", // [192]
      "", // [193]
      "", // [194]
      "", // [195]
      "", // [196]
      "", // [197]
      "", // [198]
      "", // [199]
      "", // [200]
      "", // [201]
      "", // [202]
      "", // [203]
      "", // [204]
      "", // [205]
      "", // [206]
      "", // [207]
      "", // [208]
      "", // [209]
      "", // [210]
      "", // [211]
      "", // [212]
      "", // [213]
      "", // [214]
      "", // [215]
      "", // [216]
      "", // [217]
      "", // [218]
      "OPEN_BRACKET", // [219]
      "BACK_SLASH", // [220]
      "CLOSE_BRACKET", // [221]
      "QUOTE", // [222]
      "", // [223]
      "META", // [224]
      "ALTGR", // [225]
      "", // [226]
      "WIN_ICO_HELP", // [227]
      "WIN_ICO_00", // [228]
      "", // [229]
      "WIN_ICO_CLEAR", // [230]
      "", // [231]
      "", // [232]
      "WIN_OEM_RESET", // [233]
      "WIN_OEM_JUMP", // [234]
      "WIN_OEM_PA1", // [235]
      "WIN_OEM_PA2", // [236]
      "WIN_OEM_PA3", // [237]
      "WIN_OEM_WSCTRL", // [238]
      "WIN_OEM_CUSEL", // [239]
      "WIN_OEM_ATTN", // [240]
      "WIN_OEM_FINISH", // [241]
      "WIN_OEM_COPY", // [242]
      "WIN_OEM_AUTO", // [243]
      "WIN_OEM_ENLW", // [244]
      "WIN_OEM_BACKTAB", // [245]
      "ATTN", // [246]
      "CRSEL", // [247]
      "EXSEL", // [248]
      "EREOF", // [249]
      "PLAY", // [250]
      "ZOOM", // [251]
      "", // [252]
      "PA1", // [253]
      "WIN_OEM_CLEAR", // [254]
      "" // [255]
    ];
    let old = globalThis.sdk_runtime;
    c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    let runtime = globalThis.sdk_runtime;
    globalThis.sdk_runtime = old;
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

    let isInLevel = () => {
        return runtime.running_layout.name.startsWith("Level")
    };
    
    let createGuiElement = (id1, bottom, right) => {
        b = document.createElement("div")
        c = {
            backgroundColor: "white",
            border: "solid",
            borderColor: "black",
            borderWidth: "2px",
            fontFamily: "Retron2000",
            position: "absolute",
            bottom: bottom.toString() + "px",
            right: right.toString() + "px",
            padding: "5px",
            color: "black",
            fontSize: "10pt",
            display: "none",
        };
        Object.keys(c).forEach(function (a) {
            b.style[a] = c[a];
        });
        b.id = id1;
        const newContent = document.createTextNode("N/A");

        // add the text node to the newly created div
        b.appendChild(newContent);

        document.body.appendChild(b);

        document.getElementById(b.id).className = 'gui';

    };
    let guiMod = {
        init() {
            this.movementKeys = []; //left, up, right, down
            this.arrows = ["left", "up", "right", "down"];
            this.activatorKeyHeld = false;
            this.activated = false;
            this.speed = {x: 10, y: 10};
            this.stored = [1500, true];
            this.override = false;
            this.previousPosLength = 7;
            this.attempts = 1;
            
            document.addEventListener("keydown", (event) => {
                this.keyDown(event)
                
            });
            document.addEventListener("keyup", (event) => {
                this.keyUp(event)
            });
          
            runtime.tickMe(this);
            
            createGuiElement("pos", 5, 5); //create position element
            
            createGuiElement("fps", 40, 5); //create fps element
            //createGuiElement("dy", 40, 30); //create position element
            //createGuiElement("dx", 40, 55); //create position element
            createGuiElement("state", 5, 85); //create position element
            createGuiElement("attempts", 75, 5); //create attempts element


            
            // localforage.getItem("DedraOvO").then(function(value) {
            //     // This code runs once the value has been loaded
            //     // from the offline store.
            //     console.log(value);
            // }).catch(function(err) {
            //     // This code runs if there were any errors
            //     console.log(err);
            // });
            // localforage.keys().then(function(keys) {
            //     // An array of all the key names.
            //     console.log(keys);
            // }).catch(function(err) {
            //     // This code runs if there were any errors
            //     console.log(err);
            // });\

            let inputsObject = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals && x.instvar_sids.length === 6).instances[0];
            //inputsObject.instance_vars;
            console.log(inputsObject.instance_vars);
            this.movementKeys = (inputsObject.instance_vars).slice(0, 4);
            console.log(this.movementKeys);
            //create arrow keys after movment keys are create {:
            createGuiElement(this.arrows[1], 75, 70); //create w key element
            document.getElementById(this.arrows[1]).innerText = keyboardMap[this.movementKeys[1]];
            createGuiElement(this.arrows[0], 40, 96); //create a key element
            document.getElementById(this.arrows[0]).innerHTML = keyboardMap[this.movementKeys[0]];
            createGuiElement(this.arrows[3], 40, 70); //create s key element
            document.getElementById(this.arrows[3]).innerHTML = keyboardMap[this.movementKeys[3]];
            createGuiElement(this.arrows[2], 40, 40); //create d key element
            document.getElementById(this.arrows[2]).innerHTML = keyboardMap[this.movementKeys[2]];
            
        },

        keyDown(event) {
            //console.log(String.fromCharCode(event.keyCode));
            //console.log(cr.plugins_.Keyboard.prototype.cnds.OnKey() || cr.plugins_.Keyboard.prototype.cnds.OnKeyCode());
            //console.log(cr.plugins_.Keyboard.prototype.exps.StringFromKeyCode())
            //c2_callFunction("Controls > Buffer", ["Jump"]);
            if (this.movementKeys.includes(event.keyCode)) {
                arrow = this.arrows[this.movementKeys.indexOf(event.keyCode)]
                //console.log(arrow)
                document.getElementById(arrow).style.backgroundColor = "black";
                document.getElementById(arrow).style.color = "white";
            }
        },
      
        keyUp(event) {
            if (this.movementKeys.includes(event.keyCode)) {
                arrow = this.arrows[this.movementKeys.indexOf(event.keyCode)]
                
                document.getElementById(arrow).style.backgroundColor = "white";
                document.getElementById(arrow).style.color = "black";

                //console.log(event.key);

            }
        },
        
        tick() {
            let playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
            let player = playerInstances[0];
            const elements = document.querySelectorAll('.gui');
            //console.log(this.attempts)
       
            try {
                //console.log(isInLevel())
                //console.log(runtime.running_layout.name);
                elements.forEach(element => {
                    element.style.display = "block";
                });
                if(isInLevel() && runtime.running_layout.name !== "Level Menu") {
                    document.getElementById("fps").innerHTML = runtime.fps;
                    //console.log(document.getElementById("fps").offsetWidth); 41
                    if(parseInt(document.getElementById("right").style.right.substring(0, 2)) - (parseInt(document.getElementById("fps").style.right.substring(0, 2)) + document.getElementById("fps").offsetWidth) !== 3) {
                        document.getElementById("right").style.right = (parseInt(document.getElementById("fps").style.right.substring(0, 2)) + document.getElementById("fps").offsetWidth + 3).toString() + "px";
                        document.getElementById("down").style.right = (parseInt(document.getElementById("fps").style.right.substring(0, 2)) + document.getElementById("fps").offsetWidth + 33).toString() + "px";
                        document.getElementById("up").style.right = document.getElementById("down").style.right;
                        document.getElementById("left").style.right = (parseInt(document.getElementById("fps").style.right.substring(0, 2)) + document.getElementById("fps").offsetWidth + 59).toString() + "px";
                    }
                    //console.log(document.getElementById("fps").style.bottom);
                    //console.log(runtime.deathRow);
                    if(Object.keys(runtime.deathRow).length !== 0) {
                        this.attempts++;
                        console.log(this.attempts);
                        console.log("??");
                    }
                    //console.log(this.attempts);
                    document.getElementById("attempts").innerHTML = this.attempts.toString();
                    document.getElementById("pos").innerHTML = 
                        Math.round(player.x.toString()) +
                        ", " +
                        Math.round(player.y.toString());
                    //console.log(document.getElementById("pos").offsetWidth);

                    if(parseInt(document.getElementById("state").style.right.substring(0, 2)) - (parseInt(document.getElementById("pos").style.right.substring(0, 2)) + document.getElementById("pos").offsetWidth) !== 6) {
                        document.getElementById("state").style.right = (parseInt(document.getElementById("pos").style.right.substring(0, 2)) + document.getElementById("pos").offsetWidth + 6).toString() + "px";
                    }
                    //document.getElementById("dy").innerHTML = Math.round(player.behavior_insts[0].dy.toString())
                    //document.getElementById("dx").innerHTML = Math.round(player.behavior_insts[0].dx.toString())
                    if(Math.abs(player.behavior_insts[0].dx) > 500) {
                        document.getElementById("state").innerHTML = "Sliding";                    
                    } else if(Math.abs(player.behavior_insts[0].dx) > 450) {
                        document.getElementById("state").innerHTML = "Diving";                    
                    } else if(player.behavior_insts[0].dy < 0) {
                        document.getElementById("state").innerHTML = "Jumping";                    
                    } else if(player.behavior_insts[0].dy > 0) {
                        document.getElementById("state").innerHTML = "Falling";                    
                    } else if(Math.abs(player.behavior_insts[0].dx) > 0) {
                        document.getElementById("state").innerHTML = "Running";                    
                    } else {
                        document.getElementById("state").innerHTML = "Resting"; 
                    }

                    
                } else {
                    elements.forEach(element => {
                        element.style.display = "none";
                    });
                    if((runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals && x.instvar_sids.length === 6).instances[0]).instance_vars.slice(0, 4) !== this.movementKeys) {
                        this.movementKeys = (runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals && x.instvar_sids.length === 6).instances[0]).instance_vars.slice(0, 4);
                    }
                }
                

                
            } catch (err) {}
        }
    };
  
    guiMod.init();
})();
