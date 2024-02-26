(function() {

    let version = VERSION.version() //1.4, 1.4.4, or CTLE
    if(version === "1.4") {
        timers = [500, 5000]
    } else { //1.4.4 or CTLE
        timers = [100, 2000]
    }

    var runtime;
    var filters = new Set();
    var currentFilter = "all";

    var menus = ["mods", "settings", "profiles", "skins", "addmod"];

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
      "space", // [32]
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

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    function arraysEqual(a, b) {
      if (a === b) return true;
      if (a == null || b == null) return false;
      if (a.length !== b.length) return false;
    
      // If you don't care about the order of the elements inside
      // the array, you should sort both arrays here.
      // Please note that calling sort on an array will modify that array.
      // you might want to clone your array first.
    
      for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }

    let onFinishLoad = () => {
        if ((cr_getC2Runtime() || {isloading: true}).isloading) {
            setTimeout(onFinishLoad, timers[0]);
        } else {
            if(version === "1.4") {
                var Retron2000 = new FontFace('Retron2000', 'url(./retron2000.ttf)');
                Retron2000.load().then(function(loaded_face) {
                    document.fonts.add(loaded_face);
                    document.body.style.fontFamily = '"Retron2000", Arial';
                console.log("123123")
                }).catch(function(error) {
                    console.log(error)
                });
                runtime = cr_getC2Runtime();

                let old = globalThis.sdk_runtime;
                c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
                //runtime = globalThis.sdk_runtime;
                globalThis.sdk_runtime = old;
            } else { //1.4.4 or CTLE
                runtime = cr_getC2Runtime();
            }
            sleep(timers[1]).then(() => {
                cleanModLoader.init();
            });
        }
    }

    //general 
    var map = null;
    var map2 = null;

    var customModNum = 0;
    

    
    
    



    let isInLevel = () => {
        return runtime.running_layout.name.startsWith("Level")
    };
    let isPaused = () => {
        if (isInLevel()) return runtime.running_layout.layers.find(function(a) {
            return "Pause" === a.name
        }).visible
    };
    
    let closePaused = () => {
        if (isInLevel()) return runtime.running_layout.layers.find(function(a) {return "Pause" === a.name}).visible = false
    }



    let disableScroll = () => {
        let map = [];
        let mapUI = [];
        let types = runtime.types_by_index.filter((x) =>
          x.behaviors.some(
            (y) => y.behavior instanceof cr.behaviors.aekiro_scrollView
          )
        );
        types.forEach((type) => {
          type.instances.forEach((inst) => {
            let behavior = inst.behavior_insts.find(
              (x) => x.behavior instanceof cr.behaviors.aekiro_scrollView
            );
            console.log(behavior)
            console.log(behavior.scroll.isEnabled)
            map.push({
              inst,
              oldState: behavior.scroll.isEnabled,
            });
            behavior.scroll.isEnabled = false;
          });
        });
        let layer = runtime.running_layout.layers.find((x) => x.name == "UI");
        if (layer) {
          layer.instances.forEach((inst) => {
            //save state to mapUI
            mapUI.push({
              inst,
              oldState: {
                width: inst.width,
                height: inst.height,
              },
            });
            // set size to 0
            inst.width = 0;
            inst.height = 0;
            inst.set_bbox_changed();
          });
        }
        return {
          map,
          mapUI,
        };
      };

    let enableScroll = ({ map, mapUI }) => {
        map.forEach((x) => {
          let inst = x.inst.behavior_insts.find(
            (x) => x.behavior instanceof cr.behaviors.aekiro_scrollView
          );
          inst.scroll.isEnabled = inst.scroll.isEnabled ? 1 : x.oldState;
        });
        mapUI.forEach((x) => {
          x.inst.width = x.oldState.width;
          x.inst.height = x.oldState.height;
          x.inst.set_bbox_changed();
        });
      };

    
    let disableClick = () => {
        let map = [];
        let mapUI = [];
        let types = runtime.types_by_index.filter((x) =>
          x.behaviors.some(
            (y) => y.behavior instanceof cr.behaviors.aekiro_button
          )
        );
        types.forEach((type) => {
          type.instances.forEach((inst) => {
            let behavior = inst.behavior_insts.find(
              (x) => x.behavior instanceof cr.behaviors.aekiro_button
            );
            // console.log(behavior)
            // console.log(behavior.isEnabled)
            map.push({
              inst,
              oldState: behavior.isEnabled,
            });
            behavior.isEnabled = 0;
          });
        });
        let layer = runtime.running_layout.layers.find((x) => x.name == "UI");
        if (layer) {
          layer.instances.forEach((inst) => {
            //save state to mapUI
            mapUI.push({
              inst,
              oldState: {
                width: inst.width,
                height: inst.height,
              },
            });
            // set size to 0
            inst.width = 0;
            inst.height = 0;
            inst.set_bbox_changed();
          });
        }
        return {
          map,
          mapUI,
        };
      };

      let enableClick = ({ map, mapUI }) => {
        map.forEach((x) => {
          let inst = x.inst.behavior_insts.find(
            (x) => x.behavior instanceof cr.behaviors.aekiro_button
          );
          inst.isEnabled = inst.isEnabled ? 1 : x.oldState;
        });
        mapUI.forEach((x) => {
          x.inst.width = x.oldState.width;
          x.inst.height = x.oldState.height;
          x.inst.set_bbox_changed();
        });
      };


    
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


    
    
    let detectDeviceType = () => 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'pc';

    let toggleMod = (modId, enable) => {
      console.log(modId)
      if (enable) { //want to enable
        console.log(document.getElementById(modId))
        console.log(!document.getElementById(modId), !document.getElementById(modId))
        if(!document.getElementById(modId)) { // custom mods or mods that aren't in memory
          console.log('sadghyfisatdgifuygasdyifg')
          js = document.createElement("script");
          js.type = "application/javascript";
          modSettings = JSON.parse(localStorage.getItem('modSettings'));
          if(modId.startsWith("customMod")) {
              js.text = modSettings['mods'][modId]["url"];
          } else {
              console.log(backendConfig['mods'][modId]["url"])
              js.src = backendConfig['mods'][modId]["url"];
          }
          js.id = modId;
          document.head.appendChild(js);    

          modSettings['mods'][modId]["enabled"] = true;
          localStorage.setItem('modSettings', JSON.stringify(modSettings));

        } else { //mods that have been loaded before
            modSettings = JSON.parse(localStorage.getItem('modSettings'));
            modSettings['mods'][modId]["enabled"] = true;
            localStorage.setItem('modSettings', JSON.stringify(modSettings));            
            
            // TODO - use globalThis to toggle mod
            console.log(modId)
            globalThis[modId + "Toggle"](true); //true is to toggle

        }
      } else { //currently enabled, so we want to disable
        console.log("hewwo")
        modSettings = JSON.parse(localStorage.getItem('modSettings'));
        modSettings['mods'][modId]["enabled"] = false;
        localStorage.setItem('modSettings', JSON.stringify(modSettings));
        if(modId.startsWith("custom") || backendConfig['mods'][modId]["reload"]) { //if mod requires reload
          document.getElementById("menu-bg").style.pointerEvents = "none";
          document.getElementById("menu-bg").style.filter = "blur(1.2px)";
          createConfirmReloadModal();
        }
        // TODO - use globalThis to toggle mod
        else {
          globalThis[modId + "Toggle"](false); //false
        }
      }
    }

    let createConfirmDeleteModal = (modId) => {
      //Create background div
      let confirmBg = document.createElement("div");
      confirmBg.id = "confirm-delete-bg";

      c = {
          display: "block",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          border: "solid",
          borderColor: "black",
          borderWidth: "2px",
          fontFamily: "Retron2000",
          cursor: "default",
          color: "black",
          fontSize: "10pt",
          width: "40%",
          // height: "15%",
          overflow: "auto",
          margin: "0",
          padding: "5px",
          borderRadius: "10px",
      };
      Object.keys(c).forEach(function (a) {
          confirmBg.style[a] = c[a];
      });

      infoText = document.createElement("div");
      infoText.id = "asd";

      c = {
          backgroundColor: "white",
          border: "none",
          fontFamily: "Retron2000",
          // position: "relative",
          // top: "2%",
          // left: "25%",
          textAlign: "center",
          //padding: "5px",
          color: "black",
          fontSize: "13pt",
          cursor: "default",
      };
      Object.keys(c).forEach(function (a) {
          infoText.style[a] = c[a];
      });

      content = document.createTextNode("Are you sure you want to delete this mod?");
      infoText.appendChild(content);
      
      // Create buttons container
      let buttonsContainer = document.createElement("div");
      buttonsContainer.style.display = "flex";
      buttonsContainer.style.flexWrap = "wrap";
      buttonsContainer.style.justifyContent = "center";
      buttonsContainer.style.alignItems = "center";
      buttonsContainer.style.marginTop = "15px";
      buttonsContainer.style.marginBottom = "10px";
      buttonsContainer.style.gap = "10px";
      // buttonsContainer.style.position = "relative";

      // Create confirm button
      let confirmButton = document.createElement("button");
      confirmButton.innerHTML = "Yes";
      confirmButton.style.fontFamily = "Retron2000";
      confirmButton.style.fontSize = "14pt";
      confirmButton.style.backgroundColor = "rgb(45, 186, 47)";
      confirmButton.style.color = "white";
      confirmButton.style.border = "none";
      confirmButton.style.padding = "5px 10px";
      confirmButton.style.cursor = "pointer";
      confirmButton.onclick = function() {
          modSettings = JSON.parse(localStorage.getItem('modSettings'));
          
          if(modSettings['mods'][modId]["enabled"] === true) { //if mod is enabled, disable it (which will anyway reload)
            confirmBg.remove();
            toggleMod(modId, false);
            delete modSettings['mods'][modId];
            localStorage.setItem('modSettings', JSON.stringify(modSettings));
          } else {
            delete modSettings['mods'][modId];
            localStorage.setItem('modSettings', JSON.stringify(modSettings));
            document.getElementById('nav-mods-btn').click(); //refresh the mods page
            document.getElementById("confirm-delete-bg").remove();
            document.getElementById("menu-bg").style.pointerEvents = "auto";
            document.getElementById("menu-bg").style.filter = "none";
          }
          

      };

      // Create cancel button
      let cancelButton = document.createElement("button");
      cancelButton.innerHTML = "No";
      cancelButton.style.fontFamily = "Retron2000";
      cancelButton.style.fontSize = "14pt"
      cancelButton.style.backgroundColor = "rgb(222, 48, 51)";
      cancelButton.style.color = "white";
      cancelButton.style.border = "none";
      cancelButton.style.padding = "5px 10px";
      cancelButton.style.cursor = "pointer";
      cancelButton.onclick = function() {
          console.log("cancel");

          confirmBg.remove();
          document.getElementById("menu-bg").style.pointerEvents = "auto";
          document.getElementById("menu-bg").style.filter = "none";
          document.getElementById("c2canvasdiv").style.filter = "none";

          
          // enableClick(map);   
      };

      // Append buttons to the buttons container
      buttonsContainer.appendChild(confirmButton);
      buttonsContainer.appendChild(cancelButton);


      confirmBg.appendChild(infoText);
      confirmBg.appendChild(buttonsContainer);
      

      // confirmBg.appendChild(xButton);
      document.body.appendChild(confirmBg);
  }



    let createConfirmReloadModal = () => {
      //Create background div
      let confirmBg = document.createElement("div");
      confirmBg.id = "confirm-bg";

      c = {
          display: "block",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          border: "solid",
          borderColor: "black",
          borderWidth: "2px",
          fontFamily: "Retron2000",
          cursor: "default",
          color: "black",
          fontSize: "10pt",
          width: "40%",
          // height: "15%",
          overflow: "auto",
          margin: "0",
          padding: "5px",
          borderRadius: "10px",
      };
      Object.keys(c).forEach(function (a) {
          confirmBg.style[a] = c[a];
      });

      infoText = document.createElement("div");
      infoText.id = "asd";

      c = {
          backgroundColor: "white",
          border: "none",
          fontFamily: "Retron2000",
          // position: "relative",
          // top: "2%",
          // left: "25%",
          textAlign: "center",
          //padding: "5px",
          color: "black",
          fontSize: "13pt",
          cursor: "default",
      };
      Object.keys(c).forEach(function (a) {
          infoText.style[a] = c[a];
      });

      content = document.createTextNode("This mod requires a reload to disable. Would you like to reload now?");
      infoText.appendChild(content);
      
      // Create buttons container
      let buttonsContainer = document.createElement("div");
      buttonsContainer.style.display = "flex";
      buttonsContainer.style.flexWrap = "wrap";
      buttonsContainer.style.justifyContent = "center";
      buttonsContainer.style.alignItems = "center";
      buttonsContainer.style.marginTop = "15px";
      buttonsContainer.style.marginBottom = "10px";
      buttonsContainer.style.gap = "10px";
      // buttonsContainer.style.position = "relative";

      // Create confirm button
      let confirmButton = document.createElement("button");
      confirmButton.innerHTML = "Now";
      confirmButton.style.fontFamily = "Retron2000";
      confirmButton.style.fontSize = "14pt";
      confirmButton.style.backgroundColor = "rgb(45, 186, 47)";
      confirmButton.style.color = "white";
      confirmButton.style.border = "none";
      confirmButton.style.padding = "5px 10px";
      confirmButton.style.cursor = "pointer";
      confirmButton.onclick = function() {
          location.reload();
      };

      // Create cancel button
      let cancelButton = document.createElement("button");
      cancelButton.innerHTML = "Later";
      cancelButton.style.fontFamily = "Retron2000";
      cancelButton.style.fontSize = "14pt"
      cancelButton.style.backgroundColor = "rgb(222, 48, 51)";
      cancelButton.style.color = "white";
      cancelButton.style.border = "none";
      cancelButton.style.padding = "5px 10px";
      cancelButton.style.cursor = "pointer";
      cancelButton.onclick = function() {
          console.log("cancel");

          confirmBg.remove();
          document.getElementById("menu-bg").style.pointerEvents = "auto";
          document.getElementById("menu-bg").style.filter = "none";
          document.getElementById("c2canvasdiv").style.filter = "none";

          
          // enableClick(map);   
      };

      // Append buttons to the buttons container
      buttonsContainer.appendChild(confirmButton);
      buttonsContainer.appendChild(cancelButton);


      confirmBg.appendChild(infoText);
      confirmBg.appendChild(buttonsContainer);
      

      // confirmBg.appendChild(xButton);
      document.body.appendChild(confirmBg);
  }

  let createNotifyModal = (text) => {
    //Create background div
    let notifyBg = document.createElement("div");
    notifyBg.id = "notify-bg";

    c = {
        display: "block",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        border: "solid",
        borderColor: "black",
        borderWidth: "2px",
        fontFamily: "Retron2000",
        cursor: "default",
        color: "black",
        fontSize: "10pt",
        width: "40%",
        // height: "15%",
        overflow: "auto",
        margin: "0",
        padding: "10px",
        borderRadius: "10px",
    };
    Object.keys(c).forEach(function (a) {
      notifyBg.style[a] = c[a];
    });

    infoText = document.createElement("div");
    infoText.id = "asd";

    c = {
        backgroundColor: "white",
        border: "none",
        fontFamily: "Retron2000",
        // position: "relative",
        // top: "2%",
        // left: "25%",
        textAlign: "center",
        //padding: "5px",
        color: "black",
        fontSize: "2vw",
        cursor: "default",
    };
    Object.keys(c).forEach(function (a) {
        infoText.style[a] = c[a];
    });

    content = document.createTextNode(text);
    infoText.appendChild(content);
    
    // Create buttons container
    let buttonsContainer = document.createElement("div");
    c = {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "15px",
      marginBottom: "10px",
      gap: "10px",
    }
    Object.keys(c).forEach(function (a) {
      buttonsContainer.style[a] = c[a];
    });


    // Create confirm button
    let okButton = document.createElement("button");
    okButton.innerHTML = "Okay";
    d = {
      fontFamily: "Retron2000",
      fontSize: "1.75vw",
      backgroundColor: "#1c73e8",
      color: "white",
      border: "none",
      padding: "5px 10px 5px 10px",
      cursor: "pointer",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "10px",
    }
    Object.keys(d).forEach(function (a) {
      okButton.style[a] = d[a];

    });
    okButton.onclick = function() {
      notifyBg.remove();
      document.getElementById("menu-bg").style.pointerEvents = "auto";
      document.getElementById("menu-bg").style.filter = "none";
      document.getElementById("c2canvasdiv").style.filter = "none";
    };

    // // Append buttons to the buttons container
    buttonsContainer.appendChild(okButton);
    // buttonsContainer.appendChild(cancelButton);


    notifyBg.appendChild(infoText);
    notifyBg.appendChild(buttonsContainer);
    

    // confirmBg.appendChild(xButton);
    document.body.appendChild(notifyBg);
}

let createChangelogPopup = (changelog, userVersion, currentVersion) => {
  //Create background div
  let changelogPopup = document.createElement("div");
  changelogPopup.id = "changelogPopup-bg";

  c = {
      display: "flex",
      flexDirection: "column",
      // justifyContent: "center",
      // alignItems: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      border: "solid",
      borderColor: "black",
      borderWidth: "2px",
      fontFamily: "Retron2000",
      cursor: "default",
      color: "black",
      fontSize: "10pt",
      width: "40%",
      height: "auto",
      overflow: "auto",
      margin: "0",
      padding: "10px",
      borderRadius: "10px",
  };
  Object.keys(c).forEach(function (a) {
    changelogPopup.style[a] = c[a];
  });

  

  //Title
  titleText = document.createElement("div");
  c = {
      backgroundColor: "white",
      border: "none",
      fontFamily: "Retron2000",
      // position: "relative",
      // top: "2%",
      //left: "35%",
      color: "black",
      fontSize: "3vw",
      textAlign: "center",
      cursor: "default",
      // margin: "0",
      // textAlign: "center",
  };
  Object.keys(c).forEach(function (a) {
      titleText.style[a] = c[a];
  });
  titleText.id = "title-text";
  newContent = document.createTextNode("Changelog");
  titleText.appendChild(newContent);

  changelogPopup.appendChild(titleText);

  //X button CSS
  xButton = document.createElement("button");
  c = {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "white",
    border: "none",
    fontFamily: "Retron2000",
    color: "black",
    fontSize: "2.3vw",
    cursor: "pointer",
  };
  Object.keys(c).forEach(function (a) {
      xButton.style[a] = c[a];
  });

  xButton.innerHTML = "❌";
  xButton.id = "x-button";

  xButton.onclick = function() {
    changelogPopup.remove();
    // document.getElementById("c2canvasdiv").style.filter = "none";
    // enableClick(map);
  }
  // navbar.appendChild(xButton);
  changelogPopup.appendChild(xButton);

  modSettings = JSON.parse(localStorage.getItem('modSettings'));
 
  

  descText = document.createElement("div");
  descText.id = "descText";
  descText.style.fontSize = "1.5vw";
  descText.style.textAlign = "left";
  descText.style.margin = "10px";
  changelogVersions = Object.keys(changelog);
  currentVersionIndex = changelogVersions.indexOf(currentVersion);
  userVersionIndex = changelogVersions.indexOf(userVersion);
  console.log(currentVersionIndex, userVersionIndex)
  if(userVersionIndex === -1) {
    // document.getElementById("c2canvasdiv").style.filter = "none";
    // enableClick(map);
    return;
  }
  if(currentVersionIndex < userVersionIndex) {
    // document.getElementById("c2canvasdiv").style.filter = "none";
    // enableClick(map);
    return
  }
  for(i = currentVersionIndex; i > userVersionIndex; i--) {
    descText.innerHTML += "<h3>" + changelogVersions[i] + "</h3>";
    descText.innerHTML += "<ul>";
    console.log(changelog[changelogVersions[i]])
    changelog[changelogVersions[i]]['changes'].forEach((change) => {
      descText.innerHTML += "<li>" + change + "</li>";
    });
    descText.innerHTML += "</ul>";
    if(i !== userVersionIndex + 1){ 
      descText.innerHTML += "<br>";
    }
  }



  changelogPopup.appendChild(descText);

  

  

  

  document.body.appendChild(changelogPopup);
}

let createModSettingsKeybind = (modId, setting, bg) => {
  settingRow = document.createElement("div");
    settingRow.style.display = "flex";
    settingRow.style.flexDirection = "row";
    settingRow.style.justifyContent = "space-between";
    settingRow.style.alignItems = "center";
    settingRow.style.margin = "5px";
    settingRow.style.columnGap = "3vw";
    // settingRow.style.rowGap = "5vh";


    settingText = document.createElement("p");
    settingText.innerHTML = backendConfig['mods'][modId]['settings'][setting]['name'] + ": ";
    settingText.style.fontSize = "1.8vw";
    settingText.style.margin = "0";
    settingText.style.padding = "0";

    // settingValue = document.createElement("p");
    // settingValue.innerHTML = modSettings['mods'][modId]['settings'][setting];
    // settingValue.style.fontSize = "1.8vw";
    // settingValue.style.margin = "0";
    // settingValue.style.padding = "0";
    // settingRow.appendChild(settingText);
    // settingRow.appendChild(settingValue);

    
        let settingInput = document.createElement("div");
        settingInput.innerHTML = modSettings['mods'][modId]['settings'][setting];
        settingInput.style.fontSize = "1.8vw";
        settingInput.style.margin = "0";
        settingInput.style.padding = "0";
        settingInput.style.border = "1px solid black";
        settingInput.style.width = "10vw";
        settingInput.style.height = "2vh";
        settingInput.style.display = "flex";
        settingInput.style.justifyContent = "center";
        settingInput.style.alignItems = "center";
        settingInput.style.cursor = "pointer";

        let keybind = modSettings['mods'][modId]['settings'][setting];

        settingInput.addEventListener('click', () => {
          settingInput.innerHTML = "Press any key";
          window.addEventListener('keydown', function keydown(e) {
            keybind = e.code;
            settingInput.innerHTML = keybind;
            console.log(keybind)
            // modSettings['mods'][modId]['settings'][setting] = keybind;
            // localStorage.setItem('modSettings', JSON.stringify(modSettings));
            window.removeEventListener('keydown', keydown);
          });
        });

        settingRow.appendChild(settingText);
        settingRow.appendChild(settingInput);
    return settingRow;
  }

let createModSettingsSlider = (modId, setting, bg) => {
  settingRow = document.createElement("div");
    settingRow.style.display = "flex";
    settingRow.style.flexDirection = "row";
    settingRow.style.justifyContent = "space-between";
    settingRow.style.alignItems = "center";
    settingRow.style.margin = "5px";
    settingRow.style.columnGap = "3vw";
    // settingRow.style.rowGap = "5vh";


    settingText = document.createElement("p");
    settingText.innerHTML = backendConfig['mods'][modId]['settings'][setting]['name'] + ": ";
    settingText.style.fontSize = "1.8vw";
    settingText.style.margin = "0";
    settingText.style.padding = "0";

    settingValue = document.createElement("p");
    settingValue.innerHTML = modSettings['mods'][modId]['settings'][setting];
    settingValue.style.fontSize = "1.8vw";
    settingValue.style.margin = "0";
    settingValue.style.padding = "0";
    settingRow.appendChild(settingText);
    settingRow.appendChild(settingValue);

    settingLine = document.createElement("input");
    settingLine.type = "range";
    settingLine.style.alignItems = "center";
    settingLine.style.width = "10vw";
    settingLine.style.height = "2vh";
    settingLine.style.margin = "0";
    settingLine.style.padding = "0";
    console.log(setting)
    settingLine.min = backendConfig['mods'][modId]['settings'][setting]['min'];
    settingLine.max = backendConfig['mods'][modId]['settings'][setting]['max'];
    settingLine.value = modSettings['mods'][modId]['settings'][setting];


    
    settingLine.addEventListener('click', (e) => {
      // console.log("please1")
      e.preventDefault();
      e.stopImmediatePropagation()
      e.stopPropagation();
      settingLine.focus();
      // settingLine.select();
      // settingLine.stepUp();
    });
    settingLine.addEventListener('mousedown', (e) => {
      // console.log("please0")
      // e.preventDefault();
      e.stopImmediatePropagation()
      e.stopPropagation();
      settingLine.focus();
      // settingLine.select();
    });
    settingLine.addEventListener('input', (e) => {
      // console.log("please2")
      e.stopImmediatePropagation()
      e.stopPropagation();
      // e.preventDefault();
      settingLine.focus();
      // console.log(settingLine.value)
      settingValue.innerHTML = settingLine.value;
      modSettings = JSON.parse(localStorage.getItem('modSettings'));
      modSettings['mods'][modId]['settings'][setting] = settingLine.value;
      localStorage.setItem('modSettings', JSON.stringify(modSettings));
    });
    settingLine.addEventListener('change', (e) => {
      // console.log("please3")
      e.stopImmediatePropagation()
      e.stopPropagation();
      // e.preventDefault();
      settingLine.focus();
    });

    bg.onclick = (e) => { //ensure that input box focus
      // console.log("please");
      settingLine.blur()
    }
    settingRow.appendChild(settingLine);
    return settingRow;
  }


let createModSettingsPopup = (modId) => {
  //Create background div
  let modSettingsPopup = document.createElement("div");
  modSettingsPopup.id = "modSettingsPopup-bg";

  c = {
      display: "flex",
      flexDirection: "column",
      // justifyContent: "center",
      // alignItems: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      border: "solid",
      borderColor: "black",
      borderWidth: "2px",
      fontFamily: "Retron2000",
      cursor: "default",
      color: "black",
      fontSize: "10pt",
      width: "auto",
      height: "auto",
      overflow: "auto",
      margin: "0",
      // padding: "10px",
      borderRadius: "10px",
  };
  Object.keys(c).forEach(function (a) {
    modSettingsPopup.style[a] = c[a];
  });

  

  //Title
  titleText = document.createElement("div");
  c = {
      backgroundColor: "white",
      border: "none",
      fontFamily: "Retron2000",
      // position: "relative",
      // top: "2%",
      //left: "35%",
      color: "black",
      fontSize: "2.3vw",
      textAlign: "center",
      cursor: "default",
      padding: "10px",
      // textAlign: "center",
  };
  Object.keys(c).forEach(function (a) {
      titleText.style[a] = c[a];
  });
  titleText.id = "title-text";
  newContent = document.createTextNode("Settings");
  titleText.appendChild(newContent);

  modSettingsPopup.appendChild(titleText);

  //X button CSS
  xButton = document.createElement("button");
  c = {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "white",
    border: "none",
    fontFamily: "Retron2000",
    color: "black",
    fontSize: "2.3vw",
    cursor: "pointer",
  };
  Object.keys(c).forEach(function (a) {
      xButton.style[a] = c[a];
  });

  xButton.innerHTML = "❌";
  xButton.id = "x-button";

  xButton.onclick = function() {
    modSettingsPopup.remove();
    document.getElementById("menu-bg").style.pointerEvents = "auto";
    document.getElementById("menu-bg").style.filter = "none";
  }
  // navbar.appendChild(xButton);
  modSettingsPopup.appendChild(xButton);

  modSettings = JSON.parse(localStorage.getItem('modSettings'));

  settingsDiv = document.createElement("div");
  c = {
    display: "flex",
    // flex: "1",
    alignItems: "left",
    // justifyContent: "space-between",
    padding: "15px",
    // margin: "5px",
    flexDirection: "column",
    rowGap: "10px",
    // width: "10%",
    borderTop: "solid 3px black",

    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    // backgroundColor: "red",

    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    // backgroundColor: "red",
    // position: "sticky",
    // marginRight: "2%",
  }
  Object.keys(c).forEach(function (a) {
    settingsDiv.style[a] = c[a];
  });
  modSettings = JSON.parse(localStorage.getItem('modSettings'));
  Object.keys(backendConfig['mods'][modId]['settings']).forEach((setting) => {
    if(backendConfig['mods'][modId]['settings'][setting]['type'] === "slider") {
      createModSettingsSlider(modId, setting, modSettingsPopup);
    } else if(backendConfig['mods'][modId]['settings'][setting]['type'] === "keybind") {
      settingRow = createModSettingsSlider(modId, setting, modSettingsPopup);
    }
    settingsDiv.appendChild(settingRow);
  });
  
  modSettingsPopup.appendChild(settingsDiv);

  document.body.appendChild(modSettingsPopup);
}



  //Create background div
  let createDescPopup = (modId) => {
    //Create background div
    let descPopup = document.createElement("div");
    descPopup.id = "descPopup-bg";
  
    c = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        border: "solid",
        borderColor: "black",
        borderWidth: "2px",
        fontFamily: "Retron2000",
        cursor: "default",
        color: "black",
        fontSize: "10pt",
        width: "auto",
        height: "auto",
        overflow: "auto",
        margin: "0",
        padding: "10px",
        borderRadius: "10px",
    };
    Object.keys(c).forEach(function (a) {
      descPopup.style[a] = c[a];
    });
  
    navbar = document.createElement("nav");
  
    c = {
      display: "flex",
      // flex: "0 0 auto",
      // alignItems: "center",
      justifyContent: "space-between",
      padding: "5px",
      // position: "relative",
      // backgroundColor: "#f2f2f2",
    }
    Object.keys(c).forEach(function (a) {
        navbar.style[a] = c[a];
    });
    navbar.id = "navbar";
  
    navbar.appendChild(document.createElement("div"));
  
    //Title
    headerText = document.createElement("div");
    c = {
        backgroundColor: "white",
        border: "none",
        fontFamily: "Retron2000",
        // position: "relative",
        // top: "2%",
        //left: "35%",
        color: "black",
        cursor: "default",
        // margin: "0",
        textAlign: "center",
  
    };
    Object.keys(c).forEach(function (a) {
        titleText.style[a] = c[a];
    });
  
    //X button CSS
    xButton = document.createElement("button");
    c = {
      position: "absolute",
      top: "5px",
      right: "5px",
      backgroundColor: "white",
      border: "none",
      fontFamily: "Retron2000",
      color: "black",
      fontSize: "2.3vw",
      cursor: "pointer",
    };
    Object.keys(c).forEach(function (a) {
        xButton.style[a] = c[a];
    });
  
    xButton.innerHTML = "❌";
    xButton.id = "x-button";
  
    xButton.onclick = function() {
        descPopup.remove();
        // enableClick(map);
        document.getElementById("menu-bg").style.pointerEvents = "auto";
        document.getElementById("menu-bg").style.filter = "none";
    }
    // navbar.appendChild(xButton);
    descPopup.appendChild(xButton);
  
    if(modId.startsWith("customMod")) {
      modSettings = JSON.parse(localStorage.getItem('modSettings'));
      
      titleText = document.createElement("p");
      titleText.style.fontSize = "2.3vw";
      titleText.style.textAlign = "center";
      titleText.innerHTML = modSettings['mods'][modId]['name'];
      headerText.appendChild(titleText);
      if(modSettings['mods'][modId]['author'] !== null) {
        authorText = document.createElement("p");
        authorText.style.fontSize = "1.3vw";
        authorText.style.textAlign = "center";
        authorText.innerHTML = "by " + modSettings['mods'][modId]['author'];
        headerText.appendChild(authorText);
      }
      
      navbar.appendChild(headerText);
  
      
      descPopup.appendChild(navbar);
  
      descText = document.createElement("div");
      descText.id = "descText";
      descText.innerHTML = modSettings['mods'][modId]['desc'];
      descText.style.fontSize = "1.5vw";
      descText.style.textAlign = "center";
      descText.style.margin = "15px";
  
      descPopup.appendChild(descText);
  
    } else {
      titleText = document.createElement("p");
      titleText.style.fontSize = "2.3vw";
      titleText.style.textAlign = "center";
      titleText.innerHTML = backendConfig['mods'][modId]['name'];
      headerText.appendChild(titleText);
      if(backendConfig['mods'][modId]['author'] !== null) {
        authorText = document.createElement("p");
        authorText.style.fontSize = "1.3vw";
        authorText.style.textAlign = "center";
        authorText.innerHTML = "by " + backendConfig['mods'][modId]['author'];
        headerText.appendChild(authorText);
      }
      
      navbar.appendChild(headerText);
  
      
      descPopup.appendChild(navbar);
  
      descText = document.createElement("div");
      descText.id = "descText";
      descText.innerHTML = backendConfig['mods'][modId]['desc'];
      descText.style.fontSize = "1.5vw";
      descText.style.textAlign = "center";
      descText.style.margin = "15px";
  
      descPopup.appendChild(descText);
  
      if(modId === "taskeybinds") {
        image = document.createElement("img");
        image.src = "../src/mods/modloader/taskeybinds.png";
        image.style.width = "50%";
        image.style.height = "auto";
        image.style.borderRadius = "10px";
        descPopup.appendChild(image);
      }
    }
  
    
  
    
  
    document.body.appendChild(descPopup);
  }
  let searchMods = (search, filter = "all") => {
    search = search.toLowerCase();
    console.log(filter)
    

    filterCards = document.getElementById("cards-div").children;
    while(filterCards.length > 0) { //clear all cards
      filterCards[0].remove();
    }
    cardsList = [];
    userConfig = JSON.parse(localStorage.getItem('modSettings'));
    for (const [key] of Object.entries(backendConfig['mods'])) {
      if(key != "version" && key != "settings" && backendConfig['mods'][key]['version'].includes(version) && backendConfig['mods'][key]['platform'].includes(detectDeviceType()) && backendConfig['mods'][key]['name'].toLowerCase().includes(search) && (backendConfig['mods'][key]['tags'].includes(filter) || filter === "all" || userConfig['mods'][key]['favorite'] === true)) {
        cardsList.push(createMenuCard(key + '-card', backendConfig['mods'][key]['name'], backendConfig['mods'][key]['icon'], JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['enabled']));
      }
    }
    Object.keys(userConfig['mods']).forEach(function (key) {
      if(key.startsWith("custom")) {
        console.log(userConfig['mods'][key])
        if(userConfig['mods'][key]['name'].toLowerCase().includes(search) && userConfig['mods'][key]['version'].includes(version) && userConfig['mods'][key]['platform'].includes(detectDeviceType()) && (userConfig['mods'][key]['tags'].includes(filter) || filter === "all" || userConfig['mods'][key]['favorite'] === true)) {
          cardsList.push(createMenuCard(key + '-card', userConfig['mods'][key]['name'], userConfig['mods'][key]['icon'], userConfig['mods'][key]['enabled']));
        }
      }
    }
    );
    console.log(cardsList)
    cardsList.sort((a, b) => a.children[1].innerHTML.localeCompare(b.children[1].innerHTML));

    return cardsList;
  }


    let createFilterButton = (id, text, width) => {
      let menuButton = document.createElement("button");
      menuButton.id = id;
      menuButton.innerHTML = text;

      let c = {
        fontFamily: "Retron2000",
        color: "black",
        fontSize: "2vw",
        cursor: "pointer",
        backgroundColor: "white",
        width: width,
        textAlign: "center",
        verticalAlign: "middle",
        marginBottom: "15px",
        border: "solid 3px black",
        borderRadius: "10px",

        // height: "auto",
      }
      Object.keys(c).forEach(function (a) {
        menuButton.style[a] = c[a];
      });

      menuButton.onclick = function() {
        if(document.getElementById(id).style.backgroundColor === "white") {
          filters.forEach((filter) => { //set all other filters to white
            document.getElementById(filter + "-filter-btn").style.backgroundColor = "white";
          });
          currentFilter = id.split("-")[0]; //set currentFilter to this filter
          console.log(currentFilter)
          document.getElementById(id).style.backgroundColor = "lightblue";
          filterCards = document.getElementById("cards-div").children;
          while(filterCards.length > 0) { //clear all cards
            filterCards[0].remove();
          }
          cardsList = [];
          for (const [key] of Object.entries(backendConfig['mods'])) {
            if(key != "version" && key != "settings" && backendConfig['mods'][key]['version'].includes(version) && backendConfig['mods'][key]['platform'].includes(detectDeviceType())) {
              if(currentFilter === 'all') {
                cardsList.push(createMenuCard(key + '-card', backendConfig['mods'][key]['name'], backendConfig['mods'][key]['icon'], JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['enabled']));
              } else if(currentFilter === 'favorite') {
                // console.log(JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['favorite'])
                if(JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['favorite']) {
                  b = createMenuCard(key + '-card', backendConfig['mods'][key]['name'], backendConfig['mods'][key]['icon'], JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['enabled']);
                  cardsDiv.appendChild(b);
                }
              } else {
                if(backendConfig['mods'][key]['tags'].includes(currentFilter)) {
                  cardsList.push(createMenuCard(key + '-card', backendConfig['mods'][key]['name'], backendConfig['mods'][key]['icon'], JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['enabled']));
                  // cardsDiv.appendChild(b);
                }
              }
            }
          }
          console.log("???/")
          userConfig = JSON.parse(localStorage.getItem('modSettings'));
          console.log(userConfig['mods'])
          Object.keys(userConfig['mods']).forEach(function (key) {          
            console.log(key)
            if(key.startsWith("custom")) {
              console.log(currentFilter)
              if(currentFilter === 'all') {
                cardsList.push(createMenuCard(key + '-card', userConfig['mods'][key]['name'], userConfig['mods'][key]['icon'], userConfig['mods'][key]['enabled']));
                // cardsDiv.appendChild(b);
              } else if(currentFilter === 'favorite') {
                console.log(userConfig['mods'][key]['favorite'])
                if(userConfig['mods'][key]['favorite']) {
                  cardsList.push(createMenuCard(key + '-card', userConfig['mods'][key]['name'], userConfig['mods'][key]['icon'], userConfig['mods'][key]['enabled']));
                  // cardsDiv.appendChild(b);
                }
              } else {
                if(userConfig['mods'][key]['tags'].includes(currentFilter)) {
                  cardsList.push(createMenuCard(key + '-card', userConfig['mods'][key]['name'], userConfig['mods'][key]['icon'], userConfig['mods'][key]['enabled']));
                  // cardsDiv.appendChild(b);
                }
              }
            }
          }
          );
        cardsList.sort((a, b) => a.children[1].innerHTML.localeCompare(b.children[1].innerHTML));
        cardsList.forEach((card) => {
          cardsDiv.appendChild(card);
        });
        



        } 
      }
      return menuButton;
    }

    let createToggleButton = (id, text, width) => {
      let menuButton = document.createElement("div");
      menuButton.id = id;
      let p = document.createElement("p");
      p.innerHTML = text;
      let d = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: width,
        height: "3vw",
        cursor: "pointer",
        backgroundColor: "white",
        textAlign: "center",
        verticalAlign: "middle",
        border: "solid 3px black",
        fontSize: "2vw",
        color: "black",
        fontFamily: "Retron2000",
        borderRadius: "10px 10px 10px 10px",
        
      }
      Object.keys(d).forEach(function (a) {
        menuButton.style[a] = d[a];
      });
      
      menuButton.appendChild(p);

      return menuButton;
    }

    
    let createNavButton = (id, text, width) => {
      let menuButton = document.createElement("div");
      menuButton.id = id;
      menuButton.className = "nav-button";
      let p = document.createElement("p");
      p.innerHTML = text;
      let d = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: width,
        height: "3vw",
        cursor: "pointer",
        backgroundColor: "white",
        textAlign: "center",
        verticalAlign: "middle",
        border: "solid 3px black",
        fontSize: "2vw",
        color: "black",
        fontFamily: "Retron2000",
        borderRadius: "10px 10px 10px 10px",
        
      }
      Object.keys(d).forEach(function (a) {
        menuButton.style[a] = d[a];
      });
      
      menuButton.appendChild(p);

      return menuButton;
    }

    let createCardButton = (id, url, width) => {
      let cardButton = document.createElement("div");
      cardButton.id = id;
      let d = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: width,
        height: "3vw",
        textAlign: "center",
        verticalAlign: "middle",
        border: "solid 3px black",
        
      }
      Object.keys(d).forEach(function (a) {
        cardButton.style[a] = d[a];
      });
      
      let c = {
        fontFamily: "Retron2000",
        color: "black",
        fontSize: "2vw",
        cursor: "pointer",
        backgroundColor: "white",
        width: width,
        height: "3vw",
        textAlign: "center",
        verticalAlign: "middle",
        border: "solid 3px black",
        background: "url(" + url + ")",
        backgroundSize: "2.5vw", //or 50% 
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }
      Object.keys(c).forEach(function (a) {
        cardButton.style[a] = c[a];
      });

      cardButton.onclick = function() {
        if(id.includes("info")) {
          document.getElementById("menu-bg").style.pointerEvents = "none";
          document.getElementById("menu-bg").style.filter = "blur(1.2px)";
          createDescPopup(id.split("-")[0]);
        } else if(id.includes("settings")) {
          if(backendConfig['mods'][id.split("-")[0]]['settings'] !== null) {
            document.getElementById("menu-bg").style.pointerEvents = "none";
            document.getElementById("menu-bg").style.filter = "blur(1.2px)";
            createModSettingsPopup(id.split("-")[0]);
          } else {
            document.getElementById("menu-bg").style.pointerEvents = "none";
            document.getElementById("menu-bg").style.filter = "blur(1.2px)";
            createNotifyModal("This mod doesn't have any settings.")
          }
        } else if(id.includes("favorite")) {
          console.log(JSON.parse(localStorage.getItem('modSettings'))['mods'][id.split("-")[0]]['favorite'])
          if(!JSON.parse(localStorage.getItem('modSettings'))['mods'][id.split("-")[0]]['favorite']) {
            document.getElementById(id).style.background = "url(https://cdn-icons-png.flaticon.com/128/1828/1828884.png)";
            document.getElementById(id).style.backgroundSize = "2.5vw";
            document.getElementById(id).style.backgroundRepeat = "no-repeat";
            document.getElementById(id).style.backgroundPosition = "center";
            modSettings = JSON.parse(localStorage.getItem('modSettings'));
            modSettings['mods'][id.split("-")[0]]["favorite"] = true;
            localStorage.setItem('modSettings', JSON.stringify(modSettings));

          } else {
            document.getElementById(id).style.background = "url(https://cdn-icons-png.flaticon.com/128/1828/1828970.png)";
            document.getElementById(id).style.backgroundSize = "2.5vw";
            document.getElementById(id).style.backgroundRepeat = "no-repeat";
            document.getElementById(id).style.backgroundPosition = "center";
            modSettings = JSON.parse(localStorage.getItem('modSettings'));
            modSettings['mods'][id.split("-")[0]]["favorite"] = false;
            localStorage.setItem('modSettings', JSON.stringify(modSettings));
            
          }

        } else if(id.includes("delete")) {
          document.getElementById("menu-bg").style.pointerEvents = "none";
          document.getElementById("menu-bg").style.filter = "blur(1.2px)";
          createConfirmDeleteModal(id.split("-")[0]);
        }
      }
      return cardButton;
    }

    let createMenuCard = (id, name, iconurl, enabled) => {
      let menuCard = document.createElement("div");
      menuCard.id = id;
      console.log(menuCard.id)
      id = id.split("-")[0];
      // menuCard.innerHTML = text;
      c = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        // alignItems: "center",
        width: "100%",

        // padding: "0",
        aspectRatio: "5 / 6",
        fontFamily: "Retron2000",
        color: "black",
        // fontSize: "2vw",
        backgroundColor: "white",  
        textAlign: "center",
        verticalAlign: "middle",
        border: "solid 3px black",
        borderRadius: "10px 10px 13px 13px",
      }
      Object.keys(c).forEach(function (a) {
        menuCard.style[a] = c[a];
      });

      

      cardImage = document.createElement("img");
      c = {
        width: "auto",
        height: "auto",
        maxWidth: "60%",
        minWidth: "60%",
        // aspectRatio: "1 / 1",
        marginTop: "5%",
        marginLeft: "auto",
        marginRight: "auto",
        // backgroundColor: "blue",

        
      }
      Object.keys(c).forEach(function (a) {
        cardImage.style[a] = c[a];
      });
      cardImage.src = iconurl;

      cardText = document.createElement("p");
      if(id.startsWith("customMod") && JSON.parse(localStorage.getItem('modSettings'))['mods'][id]['name'].length > 10) {
        name = JSON.parse(localStorage.getItem('modSettings'))['mods'][id]['name'].substring(0, 9) + "-";
      }
      cardText.innerHTML = name;

      c = {
        display: "block",
        fontFamily: "Retron2000",
        color: "black",
        fontSize: "2vw",
        flexGrow: "0",
        flexShrink: "0",
        flexBasis: "auto",
        textAlign: "center",
        verticalAlign: "middle",
        margin: "0",
        whiteSpace: "nowrap",
      }
      Object.keys(c).forEach(function (a) {
        cardText.style[a] = c[a];
      });

      cardButtons = document.createElement("div");
      c = {
        display: "flex",
        flexWrap: "wrap",  
        justifyContent: "flex-end",
      }
      Object.keys(c).forEach(function (a) {
        cardButtons.style[a] = c[a];
      });
      
      topCards = document.createElement("div"); 
      c = {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        // padding: "5px",
      }
      Object.keys(c).forEach(function (a) {
        topCards.style[a] = c[a];
      });

      topCards.className = "card-buttons";
      infoButton = createCardButton(id + "-info-btn", "https://cdn-icons-png.flaticon.com/128/157/157933.png", "calc(100%/3)");
      if(id.startsWith("customMod")) {
        deleteButton = createCardButton(id + "-delete-btn", "https://cdn-icons-png.flaticon.com/128/3096/3096673.png", "calc(100%/3)");
      } else {
        settingsButton = createCardButton(id + "-settings-btn", "https://cdn-icons-png.flaticon.com/128/2040/2040504.png", "calc(100%/3)");
      }
      favoriteButton = createCardButton(id + "-favorites-btn", "https://cdn-icons-png.flaticon.com/128/1828/1828970.png", "calc(100%/3)");
      if(JSON.parse(localStorage.getItem('modSettings'))['mods'][id]['favorite']) {
        favoriteButton.style.background = "url(https://cdn-icons-png.flaticon.com/128/1828/1828884.png)";
        favoriteButton.style.backgroundSize = "2.5vw";
        favoriteButton.style.backgroundRepeat = "no-repeat";
        favoriteButton.style.backgroundPosition = "center";
      }
      infoButton.style.borderLeft = "none";
      infoButton.style.borderRight = "none";
      favoriteButton.style.borderLeft = "none"
      favoriteButton.style.borderRight = "none";



      topCards.appendChild(infoButton);
      if(id.startsWith("customMod")) {
        topCards.appendChild(deleteButton);
      } else {
        topCards.appendChild(settingsButton);
      }
      topCards.appendChild(favoriteButton);
      cardButtons.appendChild(topCards);
      

      bottomCards = document.createElement("div"); 
      c = {
        display: "flex",
        flex: "1",
        // justifyContent: "space-between",
        // padding: "5px",
      }
      Object.keys(c).forEach(function (a) {
        bottomCards.style[a] = c[a];
      });
      if(enabled) {
        enabledButton = createToggleButton("button4", "Enabled", "100%");
        enabledButton.style.backgroundColor = "rgb(45, 186, 47)"; //lightgreen
      } else {
        enabledButton = createToggleButton("button4", "Disabled", "100%");
        enabledButton.style.backgroundColor = "rgb(222, 48, 51)";
      }
      enabledButton.style.gridArea = "b4";
      enabledButton.style.border = "none";
      enabledButton.style.borderRadius = "0px 0px 10px 10px";
      enabledButton.id = id + "-enable-button";
      enabledButton.onclick = function() {
        
        console.log("clicked")
        console.log(JSON.parse(localStorage.getItem('modSettings'))['mods'][id]['enabled'])
        if(JSON.parse(localStorage.getItem('modSettings'))['mods'][id]['enabled']) { //if enabled, we want to disable
          console.log("disabled")
          document.getElementById(id + '-enable-button').innerHTML = "Disabled";
          document.getElementById(id + '-enable-button').style.backgroundColor = "rgb(222, 48, 51)";
          toggleMod(id, false);
        } else { //if disabled, we want to enable
          console.log("enabled")

          document.getElementById(id + '-enable-button').innerHTML = "Enabled";
          document.getElementById(id + '-enable-button').style.backgroundColor = "rgb(45, 186, 47)";
          toggleMod(id, true);

        }
      }
      
      bottomCards.appendChild(enabledButton);
      cardButtons.appendChild(bottomCards);

      menuCard.appendChild(cardImage);
      menuCard.appendChild(cardText);
      menuCard.appendChild(cardButtons);
        



      return menuCard;
    }



    let createModLoaderMenuBtn = () => {
      menuButton = document.createElement("button");
      c = {
          background: "url(https://cdn-icons-png.flaticon.com/512/2099/2099192.png)",
          backgroundSize: "cover", //or contain
          backgroundColor: "white",
          border: "none", //2p solid black
          position: "absolute",
          cursor: "pointer",
          left: "4px",
          top: "100px",
          width: "100px",
          height: "100px",
          display: "block",
          zIndex: "2147483647",
      };
      Object.keys(c).forEach(function (a) {
          menuButton.style[a] = c[a];
      });
      menuButton.id = "menu-button";


      menuButton.onclick = function() {
          if(document.getElementById("menu-bg") === null) { //if menu doesnt exist, to avoid duplicates
              map = disableClick();
              createModLoaderMenu();
              document.getElementById("menu-button").style.display = "none";
              document.getElementById("c2canvasdiv").style.filter = "blur(1.2px)";
          } 
      }
      document.body.appendChild(menuButton);

    }
    let createModLoaderMenu = () => {
      //Create background div
      

      menuBg = document.createElement("div")
      c = {
          // justifyContent: "center",
          // alignItems: "center",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          border: "solid",
          borderColor: "black",
          borderWidth: "3px",
          fontFamily: "Retron2000",
          position: "absolute",
          cursor: "default",
          padding: "0px",
          color: "black",
          fontSize: "10pt",
          // display: "block",
          width: "90%",
          height: "90%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "10px",
      };
      Object.keys(c).forEach(function (a) {
          menuBg.style[a] = c[a];
      });
      menuBg.id = "menu-bg";

      versionText = document.createElement("div");
      c = {

          position: "absolute",
          bottom: "3px",
          left: "3px",
          fontFamily: "Retron2000",
          color: "black",
          fontSize: "0.8vw",
          cursor: "default",
      }
      Object.keys(c).forEach(function (a) {
          versionText.style[a] = c[a];
      });
      versionText.id = "modloader-version-text";
      versionText.innerHTML = "v" + backendConfig['version'];
      document.body.appendChild(versionText);
      

      navbar = document.createElement("nav");

      c = {
        display: "flex",
        // flex: "0 0 auto",
        // alignItems: "center",
        justifyContent: "space-between",
        padding: "5px",
        // position: "relative",
        // backgroundColor: "#f2f2f2",
      }
      Object.keys(c).forEach(function (a) {
          navbar.style[a] = c[a];
      });
      navbar.id = "navbar";

      logo = document.createElement("img");
      c = {
          width: "50px",
          height: "50px",
          // display: "block",
          cursor: "pointer",
      };
      Object.keys(c).forEach(function (a) {
          logo.style[a] = c[a];
      });
      logo.src = "../assets/img/home-icon.png";
      logo.onclick = function() {
          window.location.href = "../";
      }
      navbar.appendChild(logo);

      //Title
      titleText = document.createElement("div");
      c = {
          backgroundColor: "white",
          border: "none",
          fontFamily: "Retron2000",
          // position: "relative",
          // top: "2%",
          //left: "35%",
          color: "black",
          fontSize: "28pt",
          cursor: "default",
          // margin: "0",
          // textAlign: "center",
      };
      Object.keys(c).forEach(function (a) {
          titleText.style[a] = c[a];
      });
      titleText.id = "title-text";
      newContent = document.createTextNode("OvO Modloader");
      titleText.appendChild(newContent);
      navbar.appendChild(titleText);

      //X button CSS
      xButton = document.createElement("button");
      c = {
          backgroundColor: "white",
          border: "none",
          fontFamily: "Retron2000",
          color: "black",
          fontSize: "26pt",
          cursor: "pointer",
      };
      Object.keys(c).forEach(function (a) {
          xButton.style[a] = c[a];
      });

      xButton.innerHTML = "❌";
      xButton.id = "x-button";

      xButton.onclick = function() {
          menuBg.remove();
          versionText.remove();
          enableClick(map);
          document.getElementById("menu-button").style.display = "block";
          document.getElementById("c2canvasdiv").style.filter = "none";
      }
      navbar.appendChild(xButton);

      buttonContainer = document.createElement("div");
      c = {
        display: "flex",
        margin: "10px",
        alignItems: "center",
        justifyContent: "space-between", 
      }
      Object.keys(c).forEach(function (a) {
          buttonContainer.style[a] = c[a];
      });
      buttonContainer.className = "button-container";
      modsButton = createNavButton("nav-mods-btn", "Mods", "13vw");
      modsButton.style.backgroundColor = "lightblue"; //set default button to blue
      modsButton.onclick = function() {
        searchBar.disabled = false;
        let elements = document.getElementsByClassName('nav-button');
        for(let i = 0; i < elements.length; i++) {
          elements[i].style.backgroundColor = 'white';
        }
        modsButton.style.backgroundColor = "lightblue";
        renderModsMenu(filtersDiv, cardsDiv);

      }
      settingsButton = createNavButton("nav-settings-btn", "Settings", "13vw");
      settingsButton.onclick = function() {
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createNotifyModal("Settings are not available yet.");
      }

      profilesButton = createNavButton("nav-profiles-btn", "Profiles", "13vw");
      profilesButton.onclick = function() {
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createNotifyModal("Profiles are not available yet.");
      }
      skinsButton = createNavButton("nav-skins-btn", "Skins", "13vw");
      skinsButton.onclick = function() {
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createNotifyModal("Skins are not available yet.");
      }
      addmodButton = createNavButton("nav-addmod-btn", "Add Mod", "13vw");
      addmodButton.onclick = function() {
        searchBar.disabled = true;
        searchBar.value = "";
        let elements = document.getElementsByClassName('nav-button');
        for(let i = 0; i < elements.length; i++) {
          elements[i].style.backgroundColor = 'white';
        }
        addmodButton.style.backgroundColor = "lightblue";
        renderAddModMenu(filtersDiv, cardsDiv);
        
      }
      let searchBar = document.createElement("input");
      searchBar.id = 'nav-search-bar';
      searchBar.placeholder = "Search...";
      let d = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "13vw",
        height: "3vw",
        cursor: "pointer",
        backgroundColor: "white",
        verticalAlign: "middle",
        border: "solid 3px black",
        fontSize: "2vw",
        color: "black",
        fontFamily: "Retron2000",
        paddingLeft: "10px",
        borderRadius: "10px 10px 10px 10px",
        
      }
      Object.keys(d).forEach(function (a) {
        searchBar.style[a] = d[a];
      });
      searchBar.onclick = (e) => { //ensure that input box focus
        // console.log("please");
        e.stopImmediatePropagation()
        e.stopPropagation();
        e.preventDefault();
        searchBar.focus()
      }
      menuBg.onclick = (e) => { //ensure that input box focus
        // console.log("please");
        searchBar.blur()
      }
      searchBar.onkeydown = (e) => { // ensures that user is able to type in input box
        e.stopImmediatePropagation()
        e.stopPropagation();
        if(e.keyCode === 27) {
          searchBar.blur();
        }
        if(e.keyCode === 13) {
          searchBar.blur();
        } 
      };
      searchBar.onkeyup = (e) => {
        console.log(currentFilter)
        console.log(searchBar.value)
        cardsList = searchMods(searchBar.value, currentFilter);
        filterCards = document.getElementById("cards-div").children;
        while(filterCards.length > 0) { //clear all cards
          filterCards[0].remove();
        }
        cardsDiv = document.getElementById("cards-div");
        console.log(cardsDiv)
        cardsList.forEach((card) => {
          cardsDiv.appendChild(card);
        });
      }
      


     
      buttonContainer.appendChild(modsButton);
      buttonContainer.appendChild(settingsButton);
      buttonContainer.appendChild(profilesButton);
      buttonContainer.appendChild(skinsButton);
      buttonContainer.appendChild(addmodButton);
      buttonContainer.appendChild(searchBar);



      //////////////////////////button navbar ^^



      //////////////////////////below crap


      filtersAndCards = document.createElement("div");
      filtersAndCards.id = "filters-and-cards-div";
      c = {
        display: "flex",
        flex: "1",
        alignItems: "start",
        overflow: "hidden",
        // scrollbarGutter: "stable",
        // height: "100%",
        // backgroundColor: "blue",
        // justifyContent: "space-between",
        // flexDirection: "row",

      }
      Object.keys(c).forEach(function (a) {
          filtersAndCards.style[a] = c[a];
      });
      filtersDiv = document.createElement("div");
      filtersDiv.id = "filters-div";
      filtersDiv.addEventListener('wheel', (e) => {
        // console.log("hello)")
        e.stopImmediatePropagation()
        e.stopPropagation();
        // e.preventDefault();
        filtersDiv.focus();
      });
      


      ////


      


    


      
      cardsDiv = document.createElement("div");
      cardsDiv.addEventListener('wheel', (e) => {
        // console.log("hello)")
        e.stopImmediatePropagation()
        e.stopPropagation();
        // e.preventDefault();
        cardsDiv.focus();
      });
      
      cardsDiv.id = "cards-div";


      //default menu, when users open the modmenu
      renderModsMenu(filtersDiv, cardsDiv)


      filtersAndCards.appendChild(filtersDiv);
      filtersAndCards.appendChild(cardsDiv);


      


      

      menuBg.appendChild(navbar);
      menuBg.appendChild(buttonContainer);
      menuBg.appendChild(filtersAndCards);
      document.body.appendChild(menuBg);

      
      
      

    } 

    let renderModsMenu = (filtersDiv, cardsDiv) => {
      c = {
        display: "flex",
        // flex: "1",
        alignItems: "left",
        justifyContent: "space-between",
        padding: "10px",
        flexDirection: "column",
        // width: "10%",
        borderTop: "solid 3px black",

        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",

        scrollbarGutter: "stable",
        scrollbarWidth: "thin",
        // backgroundColor: "red",
        // position: "sticky",
        // marginRight: "2%",
      }
      Object.keys(c).forEach(function (a) {
          filtersDiv.style[a] = c[a];
      });

      c = {
        display: "grid",
        padding: "10px",
        paddingBottom: "30px",
        // marginBottom: "20px",
        gridTemplateColumns: "repeat(4, 0.25fr)", 
        columnGap: "5%",
        rowGap: "6%",
        // gridTemplateRows: "1fr 1fr 1fr 1fr",

        borderLeft: "solid 3px black",
        borderTop: "solid 3px black",
        width: "83%",
        height: "93%",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarGutter: "stable",
        scrollbarWidth: "thin",
      }
      Object.keys(c).forEach(function (a) {
          cardsDiv.style[a] = c[a];
      });
      
      while (filtersDiv.firstChild) {
        filtersDiv.removeChild(filtersDiv.lastChild);
      }

      while (cardsDiv.firstChild) {
        cardsDiv.removeChild(cardsDiv.lastChild);
      }

      // filterArr = Array.from(filters)
      for(const filter of filters) {
        console.log(filter)
        if(filter === 'favorite') {
          filterButton = createFilterButton(filter + "-filter-btn", "Favorites", "13vw");
        } else {
          filterButton = createFilterButton(filter + "-filter-btn", filter.charAt(0).toUpperCase() + filter.slice(1), "13vw");

        }
        if(filter === 'all') { //set initial filter to all
          filterButton.style.backgroundColor = "lightblue";
          currentFilter = 'all';

        }
        filtersDiv.appendChild(filterButton);
      }

      cardsList = [];
      console.log(this.backendConfig['mods'])
      for (const [key] of Object.entries(this.backendConfig['mods'])) {
        if(key != "version" && key != "settings" && this.backendConfig['mods'][key]['version'].includes(version) && this.backendConfig['mods'][key]['platform'].includes(detectDeviceType())) {
          cardsList.push(createMenuCard(key + '-card', this.backendConfig['mods'][key]['name'], this.backendConfig['mods'][key]['icon'], JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['enabled']))
        }
      }
      for(const [key] of Object.entries(JSON.parse(localStorage.getItem('modSettings'))['mods'])) {
        if(key.startsWith("custom")) {
          cardsList.push(createMenuCard(key + '-card', JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['name'], JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['icon'], JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['enabled']));
        }
      }
      // Sort cardsList alphabetically by the 'name' property
      cardsList.sort((a, b) => a.children[1].innerHTML.localeCompare(b.children[1].innerHTML));
      // console.log(cardsList)

      // Add sorted cards to the cardsDiv
      for (const card of cardsList) {
        cardsDiv.appendChild(card);
      }
    }

    let renderAddModMenu = (filtersDiv, cardsDiv) => {

      c = {
        display: "flex",
        // flex: "1",
        alignItems: "left",
        justifyContent: "center",
        padding: "10px",
        flexDirection: "column",
        // width: "10%",
        borderTop: "solid 3px black",

        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",

        scrollbarGutter: "stable",
        scrollbarWidth: "thin",
        // backgroundColor: "red",
        // position: "sticky",
        // marginRight: "2%",
      }
      Object.keys(c).forEach(function (a) {
          filtersDiv.style[a] = c[a];
      });

      c = {
        display: "flex",
        padding: "10px",
        paddingBottom: "30px",
        flexDirection: "column",

        borderLeft: "solid 3px black",
        borderTop: "solid 3px black",
        width: "83%",
        height: "93%",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarGutter: "stable",
        scrollbarWidth: "thin",
      }
      Object.keys(c).forEach(function (a) {
          cardsDiv.style[a] = c[a];
      });
      
      while (filtersDiv.firstChild) {
        filtersDiv.removeChild(filtersDiv.lastChild);
      }
      while (cardsDiv.firstChild) {
        cardsDiv.removeChild(cardsDiv.lastChild);
      }

      

      let saveButtonCss = {
        fontFamily: "Retron2000",
        color: "black",
        fontSize: "2vw",
        cursor: "pointer",
        backgroundColor: "lightgreen",
        width: "13vw",
        textAlign: "center",
        verticalAlign: "middle",
        marginBottom: "15px",
        border: "solid 3px black",
        borderRadius: "10px",
      }

      let saveButton = document.createElement("button");
      saveButton.innerHTML = "Save Mod";
      Object.keys(saveButtonCss).forEach(function (a) {
        saveButton.style[a] = saveButtonCss[a];
      });

      saveButton.onclick = function() {
        if(addModName.value !== "" && addModCode.value !== "") {
          customModNum++;
          console.log("brand new mod")

          modSettings = JSON.parse(localStorage.getItem('modSettings'));
          customModConfig = {};
          customModConfig['author'] = null;
          customModConfig['icon'] = "https://cdn0.iconfinder.com/data/icons/web-development-47/64/feature-application-program-custom-512.png"
          customModConfig['platform'] = ["pc", "mobile"];
          customModConfig['version'] = ["1.4", "1.4.4", "CTLE"];
          customModConfig['tags'] = ['custom'];
          customModConfig['reload'] = true;
          customModConfig['settings'] = null;
          customModConfig['favorite'] = false;
          customModConfig['name'] = addModName.value;
          customModConfig['desc'] = addModDesc.value;
          customModConfig['enabled'] = false;
          customModConfig['url'] = addModCode.value;
          modSettings['mods']['customMod' + customModNum] = customModConfig;
          localStorage.setItem('modSettings', JSON.stringify(modSettings));

          document.getElementById("nav-mods-btn").click();


        } 
      }


      filtersDiv.appendChild(saveButton);

      let addModName = document.createElement("input");
      addModName.placeholder = "Mod Name";
      let d = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "13vw",
        height: "3vw",
        cursor: "pointer",
        backgroundColor: "white",
        verticalAlign: "middle",
        border: "solid 3px black",
        fontSize: "2vw",
        color: "black",
        fontFamily: "Retron2000",
        paddingLeft: "10px",
        borderRadius: "10px 10px 10px 10px",
        
      }
      Object.keys(d).forEach(function (a) {
        addModName.style[a] = d[a];
      });
      addModName.onclick = (e) => { //ensure that input box focus
        // console.log("please");
        e.stopImmediatePropagation()
        e.stopPropagation();
        e.preventDefault();
        addModName.focus()
      }
      document.getElementById('menu-bg').onclick = (e) => { //ensure that input box focus
        // console.log("please");
        addModName.blur()
      }
      addModName.onkeydown = (e) => { // ensures that user is able to type in input box
        e.stopImmediatePropagation()
        e.stopPropagation();
        if(e.keyCode === 27) {
          addModName.blur();
        }
        if(e.keyCode === 13) {
          addModName.blur();
        } 
      };

      let addModCode = document.createElement("textarea");
      addModCode.placeholder = "Mod Code";
      addModCode.rows = "10";
      addModCode.cols = "50";
      let e = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        height: "50%",
        cursor: "pointer",
        backgroundColor: "white",
        verticalAlign: "middle",
        border: "solid 3px black",
        fontSize: "2vw",
        color: "black",
        fontFamily: "Retron2000",
        paddingLeft: "10px",
        borderRadius: "10px 10px 10px 10px",
        
      }
      Object.keys(d).forEach(function (a) {
        addModCode.style[a] = e[a];
      });
      addModCode.onclick = (e) => { //ensure that input box focus
        // console.log("please");
        e.stopImmediatePropagation()
        e.stopPropagation();
        e.preventDefault();
        addModCode.focus()
      }
      document.getElementById('menu-bg').onclick = (e) => { //ensure that input box focus
        // console.log("please");
      }
      addModCode.onkeydown = (e) => { // ensures that user is able to type in input box
        e.stopImmediatePropagation()
        e.stopPropagation();
        if(e.keyCode === 27) {
          addModCode.blur();
        }
      };

      let addModDesc = document.createElement("textarea");
      addModDesc.placeholder = "Mod Description";
      addModDesc.rows = "10";
      addModDesc.cols = "50"; 
      let f = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "60%",
        height: "50%",
        cursor: "pointer",
        backgroundColor: "white",
        verticalAlign: "middle",
        border: "solid 3px black",
        fontSize: "2vw",
        color: "black",
        fontFamily: "Retron2000",
        paddingLeft: "10px",
        borderRadius: "10px 10px 10px 10px",
        
      }
      Object.keys(d).forEach(function (a) {
        addModDesc.style[a] = f[a];
      });
      addModDesc.onclick = (e) => { //ensure that input box focus
        // console.log("please");
        e.stopImmediatePropagation()
        e.stopPropagation();
        e.preventDefault();
        addModDesc.focus()
      }
      
      addModDesc.onkeydown = (e) => { // ensures that user is able to type in input box
        e.stopImmediatePropagation()
        e.stopPropagation();
        if(e.keyCode === 27) {
          addModDesc.blur();
        }
      };


      document.getElementById('menu-bg').onclick = (e) => { //ensure that input box focus
        // console.log("please");
        addModName.blur()
        addModCode.blur()
        addModDesc.blur()
      }

      cardsDiv.appendChild(addModName); 
      cardsDiv.appendChild(addModCode);
      cardsDiv.appendChild(addModDesc);

      


      
    }




    


    let cleanModLoader = {
        async init() {
            this.backendConfig = null;
            var b=document.createElement("div")
            c={backgroundColor:"rgba(150,10,1,0.8)",width:"5px",height:"5px",position:"absolute",bottom:"5px",right:"5px", zIndex:"2147483647", display:"none"}
            Object.keys(c).forEach(function(a){b.style[a]=c[a]})
            b.id = "cheat-indicator"
            document.body.appendChild(b)
            function addStyle(styleString) {
                const style = document.createElement('style');
                style.textContent = styleString;
                document.head.append(style);
              }
            addStyle(`
            #ovo-multiplayer-disconnected-container {
                pointer-events: none;
            }
            #ovo-multiplayer-other-container {
                pointer-events: none;
            }
            #ovo-multiplayer-container {
                pointer-events: none;
            }
            #ovo-multiplayer-tab-container {
                pointer-events: all;
            }
            .ovo-multiplayer-button-holder {
                pointer-events: all;
            }
            .ovo-multiplayer-tab {
                pointer-events: all;
            }
            .ovo-multiplayer-button {
                pointer-events: all;
            }
            
            `);

            backendConfig = await fetch('../src/mods/modloader/config/backend.json')
            .then((response) => response.json())
            .then(jsondata => {
                return jsondata;
            });
            changelog = await fetch('../src/mods/modloader/config/changelog.json')
            .then((response) => response.json())
            .then(jsondata => {
                return jsondata;
            });


            // localStorage.setItem('modSettings', JSON.stringify({}));
            
            // console.log(backendConfig['mods'])

            userConfig = JSON.parse(localStorage.getItem('modSettings'));
            // console.log(userConfig)
            this.backendConfig = backendConfig;
            if(userConfig === null) {
                //first time user
                freshUserConfig = {'mods': {}, 'settings': {}}
                for (const [key] of Object.entries(backendConfig['mods'])) {
                    freshUserConfig['mods'][key] = backendConfig["mods"][key]['defaultSettings'];

                }
                freshUserConfig['version'] = backendConfig['version'];
                freshUserConfig['settings'] = backendConfig['settings'];
                localStorage.setItem('modSettings', JSON.stringify(freshUserConfig));
            } else if(userConfig['version'] === undefined) {
                //using old save format
                freshUserConfig = {'mods': {}, 'settings': {}}
                for (const [key] of Object.entries(backendConfig['mods'])) {
                    freshUserConfig['mods'][key] = backendConfig["mods"][key]['defaultSettings'];
                    if(userConfig[key] !== undefined) { //old save format didn't show mods that werent on version
                        freshUserConfig['mods'][key]['enabled'] = userConfig[key]['enabled'];
                    }
                }
                //migrate old custom mods to current format
                for(const [key] of Object.entries(userConfig)) {
                    if(key.startsWith("custom")) { //custom mod
                        customModConfig = userConfig[key];
                        customModConfig['author'] = null;
                        customModConfig['icon'] = "https://cdn0.iconfinder.com/data/icons/web-development-47/64/feature-application-program-custom-512.png"
                        customModConfig['platform'] = ["pc", "mobile"];
                        customModConfig['version'] = ["1.4", "1.4.4", "CTLE"];
                        customModConfig['tags'] = ['custom'];
                        customModConfig['reload'] = true;
                        customModConfig['settings'] = null;
                        customModConfig['favorite'] = false;
                        freshUserConfig['mods'][key] = customModConfig;

                        customModNum++;
                    }
                }
                freshUserConfig['version'] = backendConfig['version'];
                freshUserConfig['settings'] = backendConfig['settings'];
                localStorage.setItem('modSettings', JSON.stringify(freshUserConfig));
            } else  { //
                //new version
                if(userConfig['version'] !== backendConfig['version']) {
                  // document.getElementById("c2canvasdiv").style.filter = "blur(1.2px)";
                  // map = disableClick();
                  createChangelogPopup(changelog, userConfig['version'], backendConfig['version']);
                }
                console.log("new version")
                freshUserConfig = {'mods': {}, 'settings': {}}
                for (const [key] of Object.entries(backendConfig['mods'])) {
                    if(userConfig['mods'][key] === undefined) {
                      freshUserConfig['mods'][key] = backendConfig["mods"][key]['defaultSettings'];
                    } else {
                      console.log(key)
                      if (backendConfig['mods'][key]['defaultSettings']['settings'] !== null) {
                        backendModSettings = Object.keys(backendConfig['mods'][key]['defaultSettings']['settings'])
                        userModSettings = Object.keys(userConfig['mods'][key]['settings'])
                        if(!arraysEqual(backendModSettings, userModSettings)) {
                          newMods = backendModSettings.filter(x => !userModSettings.includes(x))
                          badMods = userModSettings.filter(x => !backendModSettings.includes(x))
                          for(const mod of newMods) {
                            userConfig['mods'][key]['settings'][mod] = backendConfig['mods'][key]['defaultSettings']['settings'][mod]
                          }
                          for(const mod of badMods) {
                            delete userConfig['mods'][key]['settings'][mod]
                          }
                        }
                      }
                      freshUserConfig['mods'][key] = userConfig['mods'][key];
                    }
                }
                for(const [key] of Object.entries(userConfig['mods'])) {
                    if(key.startsWith("custom")) { //custom mod
                        freshUserConfig['mods'][key] = userConfig['mods'][key];
                    } else {
                      delete userConfig['mods'][key]; //if mod is not in backend, delete it
                    }
                  }
                for(const [key] of Object.entries(backendConfig['settings'])) {
                    if(userConfig['settings'][key] === undefined) {
                        freshUserConfig['settings'][key] = backendConfig['settings'][key];
                    } else {
                      // console.log('SDHUIOFASDHUO');
                        freshUserConfig['settings'][key] = userConfig['settings'][key];
                    }
                }
                freshUserConfig['version'] = backendConfig['version'];
                localStorage.setItem('modSettings', JSON.stringify(freshUserConfig));
            }
            userConfig = JSON.parse(localStorage.getItem('modSettings'));
            console.log(userConfig)
            console.log(backendConfig)


            //enable mods
            for (const [key] of Object.entries(userConfig['mods'])) {
              // console.log(version)
              // console.log(key)
              // console.log(backendConfig['mods'][key]['version'])
              if(!key.startsWith("custom") && userConfig['mods'][key]['enabled'] === true && backendConfig['mods'][key]['version'].includes(version) && backendConfig['mods'][key]['platform'].includes(detectDeviceType())) {
                  if(key.startsWith("custom") || !backendConfig['mods'][key]['tags'].includes('visual')) { 
                      //non visual mods or custom mods are considered 'cheats'
                      document.getElementById("cheat-indicator").style.display = "block";
                  }
                  js = document.createElement("script");
                  js.type = "application/javascript";
                  if(key.startsWith("customMod")) {
                      js.text = userConfig['mods'][key]["url"];
                  } else {

                      js.src = backendConfig['mods'][key]["url"];
                  }
                  js.id = key;
                  document.head.appendChild(js);
              } else if(key.startsWith("custom") && userConfig['mods'][key]['enabled'] === true) {
                  js = document.createElement("script");
                  js.type = "application/javascript";
                  js.src = userConfig['mods'][key]["url"];
                  js.id = key;
                  document.head.appendChild(js);
                  document.getElementById("cheat-indicator").style.display = "block";
              }
            }
            console.log(filters)
            filters.add('all');
            filters.add('favorite');
            filters.add('custom');
            for (const [key] of Object.entries(backendConfig['mods'])) {
              console.log(backendConfig["mods"][key]['tags'])
              for(var i = 0; i < backendConfig["mods"][key]['tags'].length; i++) {
                filters.add(backendConfig["mods"][key]['tags'][i]);
              }
            }
            console.log(filters)
            filters = Array.from(filters);
            
                        

            document.addEventListener("keydown", (event) => {
                this.keyDown(event)
                
            });


            
            
            createModLoaderMenuBtn();
            // document.getElementById("menu-button").click();
            runtime.tickMe(this);


            notify("QOL Modloader", "by Awesomeguy", "https://cdn3.iconfinder.com/data/icons/work-life-balance-glyph-1/64/quality-of-life-happiness-heart-512.png");


        },

        keyDown(event) {

            if(event.keyCode === 192) { //backtick
                if(document.getElementById("menu-bg") === null) { //menu doesnt exist
                    //create mod menu via tab
                    document.getElementById("menu-button").click();
                    // map = disableClick();
                    // createModLoaderMenu(); 
                } else { //menu exists
                    //remove mod menu via tab
                    if(document.getElementById("confirm-bg") === null) {
                        document.getElementById("x-button").click();
                    }         
                }
                 
            }
            
        },
        

        
      
        
        
        tick() {
            playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
            player = playerInstances[0];
            
            try {
              if(document.getElementById("menu-bg") === null) {
                if(!isInLevel() && document.getElementById("menu-button").style.top === "45%") {
                  document.getElementById("menu-button").style.top = "2px"
                  
                } else if(isPaused() && document.getElementById("menu-button").style.top === "2px"){
                    document.getElementById("menu-button").style.top = "45%"

                }
                if((!isInLevel() && document.getElementById("menu-button").style.display === "none") || (isPaused() && document.getElementById("menu-button").style.display === "none")) {
                    document.getElementById("menu-button").style.display = "block";
                    
                    console.log("hello")
                } else if((isInLevel() && document.getElementById("menu-button").style.display === "block") && (!isPaused() && document.getElementById("menu-button").style.display === "block")) {
                    document.getElementById("menu-button").style.display = "none";
                }
              }
                
                
            } catch (err) {
                console.log(err);
            }
        }
    };
  
    setTimeout(onFinishLoad, timers[0]);
})();