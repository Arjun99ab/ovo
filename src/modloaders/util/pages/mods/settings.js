import { backendConfig } from "../../../modloader.js";

export {createModSettingsPopup, createModSettingsKeybind, createModSettingsSlider}

let keyboardMap = [
  "", // [0]
  "", // [1]
  "", // [2]
  "cancel", // [3]
  "", // [4]
  "", // [5]
  "help", // [6]
  "", // [7]
  "backspace", // [8]
  "tab", // [9]
  "", // [10]
  "", // [11]
  "clear", // [12]
  "enter", // [13]
  "enter_special", // [14]
  "", // [15]
  "shift", // [16]
  "control", // [17]
  "alt", // [18]
  "pause", // [19]
  "capslock", // [20]
  "kana", // [21]
  "eisu", // [22]
  "junja", // [23]
  "final", // [24]
  "hanja", // [25]
  "", // [26]
  "escape", // [27]
  "convert", // [28]
  "nonconvert", // [29]
  "accept", // [30]
  "modechange", // [31]
  " ", // [32]
  "pageup", // [33]
  "pagedown", // [34]
  "end", // [35]
  "home", // [36]
  "arrowleft", // [37]
  "arrowup", // [38]
  "arrowright", // [39]
  "arrowdown", // [40]
  "select", // [41]
  "print", // [42]
  "execute", // [43]
  "printscreen", // [44]
  "insert", // [45]
  "delete", // [46]
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
  "at", // [64]
  "a", // [65]
  "b", // [66]
  "c", // [67]
  "d", // [68]
  "e", // [69]
  "f", // [70]
  "g", // [71]
  "h", // [72]
  "i", // [73]
  "j", // [74]
  "k", // [75]
  "l", // [76]
  "m", // [77]
  "n", // [78]
  "o", // [79]
  "p", // [80]
  "q", // [81]
  "r", // [82]
  "s", // [83]
  "t", // [84]
  "u", // [85]
  "v", // [86]
  "w", // [87]
  "x", // [88]
  "y", // [89]
  "z", // [90]
  "meta", // [91] windows key (windows) or command key (mac)
  "meta", // [92]
  "contextmenu", // [93]
  "", // [94]
  "standby", // [95]
  "0", // [96]
  "1", // [97]
  "2", // [98]
  "3", // [99]
  "4", // [100]
  "5", // [101]
  "6", // [102]
  "7", // [103]
  "8", // [104]
  "9", // [105]
  "*", // [106]
  "+", // [107]
  ".", // [108]
  "-", // [109]
  ".", // [110]
  "/", // [111]
  "f1", // [112]
  "f2", // [113]
  "f3", // [114]
  "f4", // [115]
  "f5", // [116]
  "f6", // [117]
  "f7", // [118]
  "f8", // [119]
  "f9", // [120]
  "f10", // [121]
  "f11", // [122]
  "f12", // [123]
  "f13", // [124]
  "f14", // [125]
  "f15", // [126]
  "f16", // [127]
  "f17", // [128]
  "f18", // [129]
  "f19", // [130]
  "f20", // [131]
  "f21", // [132]
  "f22", // [133]
  "f23", // [134]
  "f24", // [135]
  "", // [136]
  "", // [137]
  "", // [138]
  "", // [139]
  "", // [140]
  "", // [141]
  "", // [142]
  "", // [143]
  "numlock", // [144]
  "scrolllock", // [145]
  "win_oem_fj_jisho", // [146]
  "win_oem_fj_masshou", // [147]
  "win_oem_fj_touroku", // [148]
  "win_oem_fj_loya", // [149]
  "win_oem_fj_roya", // [150]
  "", // [151]
  "", // [152]
  "", // [153]
  "", // [154]
  "", // [155]
  "", // [156]
  "", // [157]
  "", // [158]
  "", // [159]
  "circumflex", // [160]
  "exclamation", // [161]
  "double_quote", // [162]
  "hash", // [163]
  "dollar", // [164]
  "percent", // [165]
  "ampersand", // [166]
  "underscore", // [167]
  "open_paren", // [168]
  "close_paren", // [169]
  "asterisk", // [170]
  "plus", // [171]
  "pipe", // [172]
  "hyphen_minus", // [173]
  "open_curly_bracket", // [174]
  "close_curly_bracket", // [175]
  "tilde", // [176]
  "", // [177]
  "", // [178]
  "", // [179]
  "", // [180]
  "volume_mute", // [181]
  "volume_down", // [182]
  "volume_up", // [183]
  "", // [184]
  "", // [185]
  ";", // [186]
  "=", // [187]
  ",", // [188]
  "-", // [189]
  ".", // [190]
  "/", // [191]
  "`", // [192]
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
  "open_bracket", // [219]
  "back_slash", // [220]
  "close_bracket", // [221]
  "quote", // [222]
  "", // [223]
  "meta", // [224]
  "altgr", // [225]
  "", // [226]
  "win_ico_help", // [227]
  "win_ico_00", // [228]
  "", // [229]
  "win_ico_clear", // [230]
  "", // [231]
  "", // [232]
  "win_oem_reset", // [233]
  "win_oem_jump", // [234]
  "win_oem_pa1", // [235]
  "win_oem_pa2", // [236]
  "win_oem_pa3", // [237]
  "win_oem_wsctrl", // [238]
  "win_oem_cusel", // [239]
  "win_oem_attn", // [240]
  "win_oem_finish", // [241]
  "win_oem_copy", // [242]
  "win_oem_auto", // [243]
  "win_oem_enlw", // [244]
  "win_oem_backtab", // [245]
  "attn", // [246]
  "crsel", // [247]
  "exsel", // [248]
  "ereof", // [249]
  "play", // [250]
  "zoom", // [251]
  "", // [252]
  "pa1", // [253]
  "win_oem_clear", // [254]
  "" // [255]
];

let keybindWaiting = null;

let createModSettingsPopup = (modId) => {
  //Create background div
  let modSettingsPopup = document.createElement("div");
  modSettingsPopup.id = "modSettingsPopup-bg";
  modSettingsPopup.className = "modloader-popups"

  let c = {
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
      minWidth: "20%",
      height: "auto",
      overflow: "auto",
      margin: "0",
      maxHeight: "90%",
      zIndex: "1002",
      
      // padding: "10px",
      borderRadius: "10px",
  };
  Object.keys(c).forEach(function (a) {
    modSettingsPopup.style[a] = c[a];
  });

  modSettingsPopup.onclick = (e) => {
    console.log("womp wopm womp")
    // e.stopImmediatePropagation()
    // e.stopPropagation();
    document.activeElement.blur();
  }

  

  //Title
  let titleText = document.createElement("div");
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
  let newContent = document.createTextNode("Settings");
  titleText.appendChild(newContent);

  modSettingsPopup.appendChild(titleText);

  //X button CSS
  let xButton = document.createElement("button");
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
  xButton.id = "x-button-mod-settings";

  xButton.onclick = function() {

    //fix bad code
    console.log("asohdyasud")
    modSettingsPopup.remove();
    try {
      document.getElementById("x-button-moving-mode").remove();
    } catch(e) {}
    try {
      document.getElementById("menu-bg").style.pointerEvents = "auto";
      document.getElementById("menu-bg").style.filter = "none";
    } catch(e) {
      console.log("no menu bg")
    }
    try {
      globalThis[modId + "SettingsUpdate"]();
      globalThis[modId + "ToggleMoving"](false);
    } catch(e) {
      //if it works it works, if it doesnt, itll auto update when the mod is reloaded
    }
  }
  // navbar.appendChild(xButton);
  modSettingsPopup.appendChild(xButton);

  let modSettings = JSON.parse(localStorage.getItem('modSettings'));

  let settingsDiv = document.createElement("div");
  c = {
    display: "flex",
    // flex: "1",
    alignItems: "left",
    // justifyContent: "space-between",
    padding: "15px",
    // margin: "5px",
    flexDirection: "column",
    rowGap: "2vh",
    // width: "10%",
    borderTop: "solid 3px black",

    height: "100%",
    overflowY: "scroll",
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
  settingsDiv.addEventListener('wheel', (e) => {
    // console.log("hello)")
    e.stopImmediatePropagation()
    e.stopPropagation();
    // e.preventDefault();
    settingsDiv.focus();
  });
  modSettings = JSON.parse(localStorage.getItem('modSettings'));
  // console.log(backendConfig)
  // console.log(modId)
  Object.keys(backendConfig['mods'][modId]['settings']).forEach((setting) => {
    let settingRow;
    if(backendConfig['mods'][modId]['settings'][setting]['type'] === "slider") {
      settingRow = createModSettingsSlider(modId, setting, modSettingsPopup);
    } else if(backendConfig['mods'][modId]['settings'][setting]['type'] === "keybind") {
      settingRow = createModSettingsKeybind(modId, setting, modSettingsPopup);
    } else if(backendConfig['mods'][modId]['settings'][setting]['type'] === "guiPosition") {
      settingRow = createModSettingGuiPosition(modId, setting, modSettingsPopup);
    } else if(backendConfig['mods'][modId]['settings'][setting]['type'] === "checkbox") {
      settingRow = createModSettingCheckbox(modId, setting, modSettingsPopup);
    } else if(backendConfig['mods'][modId]['settings'][setting]['type'] === "color") {
      settingRow = createModSettingColor(modId, setting, modSettingsPopup);
    } else if(backendConfig['mods'][modId]['settings'][setting]['type'] === "font") {
      settingRow = createModSettingFont(modId, setting, modSettingsPopup);
    }
    settingsDiv.appendChild(settingRow);
  });
  
  modSettingsPopup.appendChild(settingsDiv);

  document.body.appendChild(modSettingsPopup);
}

let createModSettingsKeybind = (modId, setting, bg) => {
    let settingRow = document.createElement("div");
    settingRow.style.display = "flex";
    settingRow.style.flexDirection = "row";
    settingRow.style.justifyContent = "space-between";
    settingRow.style.alignItems = "center";
    settingRow.style.margin = "5px";
    settingRow.style.columnGap = "3vw";
    // settingRow.style.rowGap = "5vh";
  
  
    let settingText = document.createElement("p");
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
    let modSettings = JSON.parse(localStorage.getItem('modSettings'));
  
    
    let settingInput = document.createElement("div");
    console.log(setting)
    settingInput.innerHTML = modSettings['mods'][modId]['settings'][setting].join(" + ");
    settingInput.style.fontSize = "1.8vw";
    settingInput.style.margin = "0";
    settingInput.style.padding = "8px";
    settingInput.style.border = "1px solid black";
    settingInput.style.minWidth = "10vw";
    settingInput.style.width = "auto";
    settingInput.style.height = "auto";
    settingInput.style.display = "flex";
    settingInput.style.justifyContent = "center";
    settingInput.style.alignItems = "center";
    settingInput.style.cursor = "pointer";
    settingInput.style.userSelect = "none";
    settingInput.style.textAlign = "center";
    settingInput.style.borderRadius = "10px";

    let keyArray = modSettings['mods'][modId]['settings'][setting];

    settingInput.addEventListener('click', () => {
      if(keybindWaiting !== null) return;
      keybindWaiting = [];
      console.log(modId, setting)
      
      settingInput.innerHTML = "Waiting...";
      window.addEventListener('keydown', function keydown(e) {
        
          
        // });
        let keybind = keyboardMap[e.keyCode]; //keybinds are lowercase by defaults
        console.log(keybind)
        console.log(e.keyCode)

        if(keybind === "escape") {
          settingInput.innerHTML = "None"
          modSettings = JSON.parse(localStorage.getItem('modSettings'));
          modSettings['mods'][modId]['settings'][setting] = ["None"];
          localStorage.setItem('modSettings', JSON.stringify(modSettings));
          window.removeEventListener('keydown', keydown);
          keybindWaiting = null;
          
          return;
        }  
        
        

        // modSettings = JSON.parse(localStorage.getItem('modSettings'));
        // keyArray = modSettings['mods'][modId]['settings'][setting]
        keybindWaiting.push(keybind);

        if(!(keybind === "shift" || keybind === "control" || keybind === "alt" || keybind === "meta")) { //regular key
          settingInput.innerHTML = keybindWaiting.join(" + ");
          console.log(keybindWaiting)
          modSettings = JSON.parse(localStorage.getItem('modSettings'));
          modSettings['mods'][modId]['settings'][setting] = keybindWaiting;
          localStorage.setItem('modSettings', JSON.stringify(modSettings));
          window.removeEventListener('keydown', keydown);
          if(keybindWaiting.length == 1) { 
            keybindWaiting = null;

          }
          console.log("hola")
          return;

          
        } else {
          console.log(keybindWaiting)
          window.addEventListener('keyup', function keyup(e) {
            // if(!(e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)) return;
            console.log('msadfohsaudfhi')
            console.log(keybindWaiting)
            modSettings = JSON.parse(localStorage.getItem('modSettings'));
            modSettings['mods'][modId]['settings'][setting] = keybindWaiting;
            localStorage.setItem('modSettings', JSON.stringify(modSettings));
            window.removeEventListener('keydown', keydown);
            window.removeEventListener('keyup', keyup);
            keybindWaiting = null;

            return;
          });
          settingInput.innerHTML = keybindWaiting.join(" + ");
          console.log(keybind)
  
          if (keybindWaiting.length > 1) {
            console.log('ashod');
            console.log(keybindWaiting)
            modSettings = JSON.parse(localStorage.getItem('modSettings'));
            modSettings['mods'][modId]['settings'][setting] = keybindWaiting;
            localStorage.setItem('modSettings', JSON.stringify(modSettings));
            keybindWaiting = null;
            window.removeEventListener('keydown', keydown);
            

            return;
          }
        }

        
      });
      
    });

    // menuBg.onclick = (e) => { //ensure that input box focus
    //   // console.log("please");
    //   settingInput.blur()
    // }

    settingRow.appendChild(settingText);
    settingRow.appendChild(settingInput);
    return settingRow;
  }
  
  let createModSettingsSlider = (modId, setting, bg) => {
    let settingRow = document.createElement("div");
      settingRow.style.display = "flex";
      settingRow.style.flexDirection = "row";
      settingRow.style.justifyContent = "space-between";
      settingRow.style.alignItems = "center";
      settingRow.style.margin = "5px";
      settingRow.style.columnGap = "3vw";
      // settingRow.style.rowGap = "5vh";
  
  
      let settingText = document.createElement("p");
      settingText.innerHTML = backendConfig['mods'][modId]['settings'][setting]['name'] + ": ";
      settingText.style.fontSize = "1.8vw";
      settingText.style.margin = "0";
      settingText.style.padding = "0";
  
      let modSettings = JSON.parse(localStorage.getItem('modSettings'));
      let settingValue = document.createElement("p");
      settingValue.innerHTML = modSettings['mods'][modId]['settings'][setting];
      settingValue.style.fontSize = "1.8vw";
      settingValue.style.margin = "0";
      settingValue.style.padding = "0";
      settingRow.appendChild(settingText);
      settingRow.appendChild(settingValue);
  
      let settingLine = document.createElement("input");
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
      settingLine.step = backendConfig['mods'][modId]['settings'][setting]['increment'];
  
  
      
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
  
      // bg.onclick = (e) => { //ensure that input box focus
      //   // console.log("please");
      //   settingLine.blur()
      // }
      settingRow.appendChild(settingLine);
      return settingRow;
    }
    let createModSettingGuiPosition = (modId, setting, bg) => {
      let settingRow = document.createElement("div");
      settingRow.style.display = "flex";
      settingRow.style.flexDirection = "row";
      settingRow.style.justifyContent = "space-between";
      settingRow.style.alignItems = "center";
      settingRow.style.margin = "5px";
      settingRow.style.columnGap = "3vw";
      // settingRow.style.rowGap = "5vh";
  
  
      let settingText = document.createElement("p");
      settingText.innerHTML = backendConfig['mods'][modId]['settings'][setting]['name'] + ": ";
      settingText.style.fontSize = "1.8vw";
      settingText.style.margin = "0";
      settingText.style.padding = "0";
      
      settingRow.appendChild(settingText);
      
  
      let settingButton = document.createElement("div");
      console.log(setting)
      settingButton.innerHTML = "Move Element";
      settingButton.style.fontSize = "1.8vw";
      settingButton.style.margin = "0";
      settingButton.style.padding = "8px";
      settingButton.style.border = "1px solid black";
      settingButton.style.minWidth = "10vw";
      // settingButton.style.width = "auto";
      // settingButton.style.height = "auto";
      settingButton.style.display = "flex";
      settingButton.style.justifyContent = "center";
      settingButton.style.alignItems = "center";
      settingButton.style.cursor = "pointer";
      settingButton.style.userSelect = "none";
      settingButton.style.textAlign = "center";
      settingButton.style.borderRadius = "10px";

      
  
  
      
      settingButton.onclick = function() {
        console.log("move element")
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.display = "none";
        document.getElementById("modSettingsPopup-bg").style.pointerEvents = "none";
        document.getElementById("modSettingsPopup-bg").style.display = "none";

        let xButton = document.createElement("button");
        let c = {
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "white",
          border: "none",
          fontFamily: "Retron2000",
          color: "black",
          fontSize: "3.5vw",
          cursor: "pointer",
        };
        Object.keys(c).forEach(function (a) {
            xButton.style[a] = c[a];
        });

        xButton.innerHTML = "❌";
        xButton.id = "x-button-moving-mode";
        xButton.onclick = function() {
          console.log("asohdyasud")
          document.getElementById("menu-bg").style.pointerEvents = "auto";
          document.getElementById("menu-bg").style.display = "block";
          document.getElementById("modSettingsPopup-bg").style.pointerEvents = "auto";
          document.getElementById("modSettingsPopup-bg").style.display = "block";
          xButton.remove();
          globalThis[modId + "ToggleMoving"](false);
        }
        document.body.appendChild(xButton);

        globalThis[modId + "ToggleMoving"](true);
      }
      settingRow.appendChild(settingButton);
      return settingRow;
    }
    let createModSettingCheckbox = (modId, setting, bg) => {
      let settingRow = document.createElement("div");
      settingRow.style.display = "flex";
      settingRow.style.flexDirection = "row";
      settingRow.style.justifyContent = "space-between";
      settingRow.style.alignItems = "center";
      settingRow.style.margin = "5px";
      settingRow.style.columnGap = "3vw";
      // settingRow.style.rowGap = "5vh";
  
  
      let settingText = document.createElement("p");
      settingText.innerHTML = backendConfig['mods'][modId]['settings'][setting]['name'] + ": ";
      settingText.style.fontSize = "1.8vw";
      settingText.style.margin = "0";
      settingText.style.padding = "0";
  
      let modSettings = JSON.parse(localStorage.getItem('modSettings'));
      // let settingValue = document.createElement("p");
      // settingValue.innerHTML = modSettings['mods'][modId]['settings'][setting];
      // settingValue.style.fontSize = "1.8vw";
      // settingValue.style.margin = "0";
      // settingValue.style.padding = "0";
      settingRow.appendChild(settingText);
      // settingRow.appendChild(settingValue);
      
      let tempDiv = document.createElement("div");
      console.log(setting)
      // settingButton.innerHTML = modSettings['mods'][modId]['settings'][setting] ? "✅" : "⬜";
      tempDiv.style.fontSize = "1.8vw";
      tempDiv.style.margin = "0";
      tempDiv.style.paddingLeft = "8px";
      tempDiv.style.paddingRight = "8px";
      
      // tempDiv.style.border = "1px solid red";
      tempDiv.style.minWidth = "13vw";
      // tempDiv.style.width = "auto";
      // tempDiv.style.height = "auto";
      tempDiv.style.display = "flex";
      tempDiv.style.justifyContent = "center";
      tempDiv.style.alignItems = "center";
      tempDiv.style.cursor = "pointer";
      tempDiv.style.userSelect = "none";
      tempDiv.style.textAlign = "center";
      tempDiv.style.borderRadius = "20%";



      const customCheckbox = document.createElement('span');
      customCheckbox.id = "customCheckbox";
      let isChecked = modSettings['mods'][modId]['settings'][setting];

      // Set up the initial style for the checkbox
      Object.assign(customCheckbox.style, {
          display: 'inline-block',
          width: '20px',
          height: '20px',
          backgroundColor: '#f0f0f0',
          border: '2px solid #999',
          borderRadius: '4px',
          position: 'relative',
          cursor: 'pointer'
      });

      if (isChecked) {
          customCheckbox.style.backgroundColor = '#4caf50';
          customCheckbox.style.borderColor = '#4caf50';

          // Create and display the checkmark (if it doesn't exist)
          if (!customCheckbox.querySelector('.checkmark')) {
              const checkmark = document.createElement('div');
              checkmark.classList.add('checkmark');
              Object.assign(checkmark.style, {
                  content: '""',
                  position: 'absolute',
                  left: '6px',
                  top: '2px',
                  width: '6px',
                  height: '12px',
                  border: 'solid white',
                  borderWidth: '0 2px 2px 0',
                  transform: 'rotate(45deg)',
                  opacity: '1',
                  transition: 'opacity 0.2s'
              });
              customCheckbox.appendChild(checkmark);
          }
      } else {
          customCheckbox.style.backgroundColor = '#f0f0f0';
          customCheckbox.style.borderColor = '#999';

          // Remove the checkmark if unchecked
          const checkmark = customCheckbox.querySelector('.checkmark');
          if (checkmark) {
              customCheckbox.removeChild(checkmark);
          }
      }

      // Add the click event listener to toggle the checkbox state
      customCheckbox.addEventListener('click', function () {
          isChecked = !isChecked;

          modSettings = JSON.parse(localStorage.getItem('modSettings'));
          modSettings['mods'][modId]['settings'][setting] = isChecked;
          localStorage.setItem('modSettings', JSON.stringify(modSettings));



          if (isChecked) {
              customCheckbox.style.backgroundColor = '#4caf50';
              customCheckbox.style.borderColor = '#4caf50';

              // Create and display the checkmark (if it doesn't exist)
              if (!customCheckbox.querySelector('.checkmark')) {
                  const checkmark = document.createElement('div');
                  checkmark.classList.add('checkmark');
                  Object.assign(checkmark.style, {
                      content: '""',
                      position: 'absolute',
                      left: '6px',
                      top: '2px',
                      width: '6px',
                      height: '12px',
                      border: 'solid white',
                      borderWidth: '0 2px 2px 0',
                      transform: 'rotate(45deg)',
                      opacity: '1',
                      transition: 'opacity 0.2s'
                  });
                  customCheckbox.appendChild(checkmark);
              }
          } else {
              customCheckbox.style.backgroundColor = '#f0f0f0';
              customCheckbox.style.borderColor = '#999';

              // Remove the checkmark if unchecked
              const checkmark = customCheckbox.querySelector('.checkmark');
              if (checkmark) {
                  customCheckbox.removeChild(checkmark);
              }
          }

          // Log the state
          console.log('Checkbox is checked:', isChecked);
      });


      tempDiv.appendChild(customCheckbox);

      
  
  
      
      
      settingRow.appendChild(tempDiv);
      return settingRow;
    }
    let createModSettingColor = (modId, setting, bg) => {
      let settingRow = document.createElement("div");
      settingRow.style.display = "flex";
      settingRow.style.flexDirection = "row";
      settingRow.style.justifyContent = "space-between";
      settingRow.style.alignItems = "center";
      settingRow.style.margin = "5px";
      settingRow.style.columnGap = "3vw";
      // settingRow.style.rowGap = "5vh";
  
  
      let settingText = document.createElement("p");
      settingText.innerHTML = backendConfig['mods'][modId]['settings'][setting]['name'] + ": ";
      settingText.style.fontSize = "1.8vw";
      settingText.style.margin = "0";
      settingText.style.padding = "0";
  
      let modSettings = JSON.parse(localStorage.getItem('modSettings'));
      // let settingValue = document.createElement("p");
      // settingValue.innerHTML = modSettings['mods'][modId]['settings'][setting];
      // settingValue.style.fontSize = "1.8vw";
      // settingValue.style.margin = "0";
      // settingValue.style.padding = "0";
      settingRow.appendChild(settingText);
      // settingRow.appendChild(settingValue);

      let vertDiv = document.createElement("div");
      vertDiv.style.display = "flex";
      vertDiv.style.flexDirection = "column";
      vertDiv.style.justifyContent = "space-between";
      // vertDiv.style.alignItems = "center";


  
      let colorBar = document.createElement("input"); //could be colorBar.type = "color", but darkmode might make it confusing
      colorBar.placeholder = "Color...";
      colorBar.value = modSettings['mods'][modId]['settings'][setting];
      let d = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "13vw",
        height: "2.7vw",
        cursor: "pointer",
        backgroundColor: "white",
        verticalAlign: "middle",
        border: "solid 3px black",
        fontSize: "1.7vw",
        color: "black",
        fontFamily: "Retron2000",
        paddingLeft: "10px",
        borderRadius: "10px 10px 10px 10px",
        
      }
      Object.keys(d).forEach(function (a) {
        colorBar.style[a] = d[a];
      });
      colorBar.onclick = (e) => { //ensure that input box focus
        // console.log("please");
        e.stopImmediatePropagation()
        e.stopPropagation();
        e.preventDefault();
        colorBar.focus()
      }
      colorBar.onkeydown = (e) => { // ensures that user is able to type in input box
        e.stopImmediatePropagation()
        e.stopPropagation();
        if(e.keyCode === 27) {
          colorBar.blur();
        }
        if(e.keyCode === 13) {
          colorBar.blur();
        } 
      };
      colorBar.onkeyup = (e) => {
        console.log("color bar key up")
        if(CSS.supports('color', colorBar.value)) {
          console.log("valid color")
          errorText.innerHTML = "Valid color!";
          errorText.style.color = "rgb(45, 186, 47)";
          modSettings = JSON.parse(localStorage.getItem('modSettings'));
          modSettings['mods'][modId]['settings'][setting] = colorBar.value;
          localStorage.setItem('modSettings', JSON.stringify(modSettings));
        } else {
          console.log("invalid color")
          errorText.innerHTML = "Invalid CSS color / hex!";
          errorText.style.color = "rgb(222, 48, 51)";
        }
          
      }

      vertDiv.appendChild(colorBar);

      let errorText = document.createElement("p");
      errorText.innerHTML = "";
      errorText.style.color = "black";
      errorText.style.fontSize = "0.85vw";
      errorText.style.margin = "2px";
      errorText.style.padding = "1px";

      vertDiv.appendChild(errorText);

      settingRow.appendChild(vertDiv);
      return settingRow;
    }

    let createModSettingFont = (modId, setting, bg) => {
      let settingRow = document.createElement("div");
      settingRow.style.display = "flex";
      settingRow.style.flexDirection = "row";
      settingRow.style.justifyContent = "space-between";
      settingRow.style.alignItems = "center";
      settingRow.style.margin = "5px";
      settingRow.style.columnGap = "3vw";
      // settingRow.style.rowGap = "5vh";


      let settingText = document.createElement("p");
      settingText.innerHTML = backendConfig['mods'][modId]['settings'][setting]['name'] + ": ";
      settingText.style.fontSize = "1.8vw";
      settingText.style.margin = "0";
      settingText.style.padding = "0";

      let modSettings = JSON.parse(localStorage.getItem('modSettings'));
      // let settingValue = document.createElement("p");
      // settingValue.innerHTML = modSettings['mods'][modId]['settings'][setting];
      // settingValue.style.fontSize = "1.8vw";
      // settingValue.style.margin = "0";
      // settingValue.style.padding = "0";
      settingRow.appendChild(settingText);
      // settingRow.appendChild(settingValue);

      let vertDiv = document.createElement("div");
      vertDiv.style.display = "flex";
      vertDiv.style.flexDirection = "column";
      vertDiv.style.justifyContent = "space-between";
      // vertDiv.style.alignItems = "center";



      let colorBar = document.createElement("input");
      colorBar.placeholder = "Font...";
      colorBar.value = modSettings['mods'][modId]['settings'][setting];
      
      let d = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "13vw",
        height: "2.7vw",
        cursor: "pointer",
        backgroundColor: "white",
        verticalAlign: "middle",
        border: "solid 3px black",
        fontSize: "1.7vw",
        color: "black",
        fontFamily: "Retron2000",
        paddingLeft: "10px",
        borderRadius: "10px 10px 10px 10px",
        
      }
      Object.keys(d).forEach(function (a) {
        colorBar.style[a] = d[a];
      });
      colorBar.onclick = (e) => { //ensure that input box focus
        // console.log("please");
        e.stopImmediatePropagation()
        e.stopPropagation();
        e.preventDefault();
        colorBar.focus()
      }
      colorBar.onkeydown = (e) => { // ensures that user is able to type in input box
        e.stopImmediatePropagation()
        e.stopPropagation();
        if(e.keyCode === 27) {
          colorBar.blur();
        }
        if(e.keyCode === 13) {
          colorBar.blur();
        } 
      };
      colorBar.onkeyup = (e) => {
        if(CSS.supports(`font-family: ${colorBar.value}`) || colorBar.value.toLowerCase() === "retron2000") {
          errorText.innerHTML = "Valid font!";
          errorText.style.color = "rgb(45, 186, 47)";
          modSettings = JSON.parse(localStorage.getItem('modSettings'));
          modSettings['mods'][modId]['settings'][setting] = colorBar.value;
          localStorage.setItem('modSettings', JSON.stringify(modSettings));
        } else {
          errorText.innerHTML = "Invalid CSS font!";
          errorText.style.color = "rgb(222, 48, 51)";
        }
        
          
      }

      vertDiv.appendChild(colorBar);

      let errorText = document.createElement("p");
      errorText.innerHTML = "";
      errorText.style.color = "black";
      errorText.style.fontSize = "0.85vw";
      errorText.style.margin = "2px";
      errorText.style.padding = "1px";

      vertDiv.appendChild(errorText);

      settingRow.appendChild(vertDiv);
      return settingRow;
    }