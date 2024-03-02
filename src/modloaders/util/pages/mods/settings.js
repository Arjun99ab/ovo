import { backendConfig } from "../../../modloader.js";

export {createModSettingsPopup, createModSettingsKeybind, createModSettingsSlider}

let keyboardMap = [
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

let createModSettingsPopup = (modId) => {
  //Create background div
  let modSettingsPopup = document.createElement("div");
  modSettingsPopup.id = "modSettingsPopup-bg";

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
  xButton.id = "x-button";

  xButton.onclick = function() {
    modSettingsPopup.remove();
    document.getElementById("menu-bg").style.pointerEvents = "auto";
    document.getElementById("menu-bg").style.filter = "none";
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
    let settingRow
    if(backendConfig['mods'][modId]['settings'][setting]['type'] === "slider") {
      settingRow = createModSettingsSlider(modId, setting, modSettingsPopup);
    } else if(backendConfig['mods'][modId]['settings'][setting]['type'] === "keybind") {
      settingRow = createModSettingsSlider(modId, setting, modSettingsPopup);
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