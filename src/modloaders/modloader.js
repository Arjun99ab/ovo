import {createNotifyModal, createChangelogPopup, createConfirmDeleteModal, createConfirmReloadModal} from './util/modals.js';
import { isInLevel, isPaused, closePaused, disableClick, enableClick, notify } from './util/ovo.js';
import {detectDeviceType} from './util/utils.js';

export let version = VERSION.version();
(function() {
    // export let version = VERSION.version() //1.4, 1.4.4, or CTLE
    let timers;
    if(version === "1.4") {
        timers = [500, 5000]
    } else { //1.4.4 or CTLE
        timers = [100, 2000]
    }

    let runtime;
    let filters = new Set();
    let currentFilter = "all";

    let backendConfig;

    let menus = ["mods", "settings", "profiles", "skins", "addmod"];

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
    
      for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }

    let onFinishLoad = () => {
        if ((cr_getC2Runtime() || {isloading: true}).isloading) {
            setTimeout(onFinishLoad, timers[0]);
        } else {
            if(version === "1.4") {
                let Retron2000 = new FontFace('Retron2000', 'url(./retron2000.ttf)');
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
    let map = null;
    let map2 = null;

    let customModNum = 0;

      

    
    
    



    


    
    
    

    

    









  //Create background div
  
  


    

    

    
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

    

    



    let createModLoaderMenuBtn = () => {
      let menuButton = document.createElement("button");
      let c = {
          background: "url(https://cdn-icons-png.flaticon.com/512/2099/2099192.png)",
          backgroundSize: "cover", //or contain
          backgroundColor: "white",
          border: "none", //2p solid black
          position: "absolute",
          cursor: "pointer",
          left: "4px",
          top: "4px",
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
              map = disableClick(runtime);
              createModLoaderMenu();
              document.getElementById("menu-button").style.display = "none";
              document.getElementById("c2canvasdiv").style.filter = "blur(1.2px)";
          } 
      }
      document.body.appendChild(menuButton);

    }
    let createModLoaderMenu = () => {
      //Create background div
      

      let menuBg = document.createElement("div")
      let c = {
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

      let versionText = document.createElement("div");
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
      

      let navbar = document.createElement("nav");

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

      let logo = document.createElement("img");
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
      let titleText = document.createElement("div");
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
      let newContent = document.createTextNode("OvO Modloader");
      titleText.appendChild(newContent);
      navbar.appendChild(titleText);

      //X button CSS
      let xButton = document.createElement("button");
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
          enableClick(runtime, map);
          document.getElementById("menu-button").style.display = "block";
          document.getElementById("c2canvasdiv").style.filter = "none";
      }
      navbar.appendChild(xButton);

      let buttonContainer = document.createElement("div");
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
      let modsButton = createNavButton("nav-mods-btn", "Mods", "13vw");
      modsButton.style.backgroundColor = "lightblue"; //set default button to blue
      modsButton.onclick = function() {
        searchBar.disabled = false;
        let elements = document.getElementsByClassName('nav-button');
        for(let i = 0; i < elements.length; i++) {
          elements[i].style.backgroundColor = 'white';
        }
        modsButton.style.backgroundColor = "lightblue";
        renderModsMenu(document.getElementById('filters-div'), document.getElementById('cards-div'));

      }
      let settingsButton = createNavButton("nav-settings-btn", "Settings", "13vw");
      settingsButton.onclick = function() {
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createNotifyModal("Settings are not available yet.");
      }

      let profilesButton = createNavButton("nav-profiles-btn", "Profiles", "13vw");
      profilesButton.onclick = function() {
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createNotifyModal("Profiles are not available yet.");
      }
      let skinsButton = createNavButton("nav-skins-btn", "Skins", "13vw");
      skinsButton.onclick = function() {
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createNotifyModal("Skins are not available yet.");
      }
      let addmodButton = createNavButton("nav-addmod-btn", "Add Mod", "13vw");
      addmodButton.onclick = function() {
        searchBar.disabled = true;
        searchBar.value = "";
        let elements = document.getElementsByClassName('nav-button');
        for(let i = 0; i < elements.length; i++) {
          elements[i].style.backgroundColor = 'white';
        }
        addmodButton.style.backgroundColor = "lightblue";
        renderAddModMenu(document.getElementById('filters-div'), document.getElementById('cards-div'));
        
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
        let cardsList = searchMods(searchBar.value, currentFilter);
        let filterCards = document.getElementById("cards-div").children;
        while(filterCards.length > 0) { //clear all cards
          filterCards[0].remove();
        }
        let cardsDiv = document.getElementById("cards-div");
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


      let filtersAndCards = document.createElement("div");
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
      let filtersDiv = document.createElement("div");
      filtersDiv.id = "filters-div";
      filtersDiv.addEventListener('wheel', (e) => {
        // console.log("hello)")
        e.stopImmediatePropagation()
        e.stopPropagation();
        // e.preventDefault();
        filtersDiv.focus();
      });
      


      ////


      


    


      
      let cardsDiv = document.createElement("div");
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

    




    


    let cleanModLoader = {
        async init() {
            // backendConfig = null;
            let b=document.createElement("div")
            let c={backgroundColor:"rgba(150,10,1,0.8)",width:"5px",height:"5px",position:"absolute",bottom:"5px",right:"5px", zIndex:"2147483647", display:"none"}
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
            let changelog = await fetch('../src/mods/modloader/config/changelog.json')
            .then((response) => response.json())
            .then(jsondata => {
                return jsondata;
            });


            // localStorage.setItem('modSettings', JSON.stringify({}));
            
            // console.log(backendConfig['mods'])

            let userConfig = JSON.parse(localStorage.getItem('modSettings'));
            // console.log(userConfig)
            let freshUserConfig = {};
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
                        let customModConfig = userConfig[key];
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
                  // map = disableClick(runtime);
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
                        let backendModSettings = Object.keys(backendConfig['mods'][key]['defaultSettings']['settings'])
                        let userModSettings = Object.keys(userConfig['mods'][key]['settings'])
                        if(!arraysEqual(backendModSettings, userModSettings)) {
                          let newMods = backendModSettings.filter(x => !userModSettings.includes(x))
                          let badMods = userModSettings.filter(x => !backendModSettings.includes(x))
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
                  let js = document.createElement("script");
                  js.type = "application/javascript";
                  if(key.startsWith("customMod")) {
                      js.text = userConfig['mods'][key]["url"];
                  } else {

                      js.src = backendConfig['mods'][key]["url"];
                  }
                  js.id = key;
                  document.head.appendChild(js);
              } else if(key.startsWith("custom") && userConfig['mods'][key]['enabled'] === true) {
                  let js = document.createElement("script");
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
              for(let i = 0; i < backendConfig["mods"][key]['tags'].length; i++) {
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


            notify(runtime, "QOL Modloader", "by Awesomeguy", "https://cdn3.iconfinder.com/data/icons/work-life-balance-glyph-1/64/quality-of-life-happiness-heart-512.png");
            // console.log(createNotifyModal)
            // createNotifyModal("appleapple");

        },

        keyDown(event) {

            if(event.keyCode === 192) { //backtick
                if(document.getElementById("menu-bg") === null) { //menu doesnt exist
                    //create mod menu via tab
                    document.getElementById("menu-button").click();
                    // map = disableClick(runtime);
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
            try {
              if(document.getElementById("menu-bg") === null) {
                if(!isInLevel(runtime) && document.getElementById("menu-button").style.top === "45%") {
                  document.getElementById("menu-button").style.top = "2px"
                  
                } else if(isPaused(runtime) && document.getElementById("menu-button").style.top === "2px"){
                    document.getElementById("menu-button").style.top = "45%"

                }
                if((!isInLevel(runtime) && document.getElementById("menu-button").style.display === "none") || (isPaused(runtime) && document.getElementById("menu-button").style.display === "none")) {
                    document.getElementById("menu-button").style.display = "block";
                    
                    console.log("hello")
                } else if((isInLevel(runtime) && document.getElementById("menu-button").style.display === "block") && (!isPaused(runtime) && document.getElementById("menu-button").style.display === "block")) {
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