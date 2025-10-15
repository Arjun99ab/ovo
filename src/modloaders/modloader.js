//todo: make all structures more reusable and organized

import {createNotifyModal, createChangelogPopup, createConfirmDeleteModal, createConfirmReloadModal} from './util/modals.js';
import { isInLevel, isPaused, closePaused, disableClick, enableClick, notify, menuButtonHover, levelButtonHover, addSkin, addModloaderButtonTexture } from './util/ovo.js';
import {sleep, arraysEqual, detectDeviceType} from './util/utils.js';

import {currentFilter, setFilter} from './util/pages/mods/filters.js';
import {renderModsMenu, renderAddModMenu, searchMods} from './util/pages/mods/render.js';
import { customModNum, incCustomModNum } from './util/pages/mods/utils.js';

import {renderSkinsMenu, searchSkins} from './util/pages/skins/render.js';
import {renderReplaysMenu} from './util/pages/replays/render.js';
import { useSkin } from './util/pages/skins/utils.js';

import { createChangeLayoutHook, createDialogOpenHook, createDialogCloseHook, createDialogShowOverlayHook, createSaveHook, createButtonClickHook, createCallFunctionHook } from './util/hooks.js';
import { renderSettingsMenu } from './util/pages/settings/render.js';

//constants constants!!!
export let version = VERSION.version();
export let skinVersion = VERSION.skinVersion();
export let filters = new Set();
export let skinFilters = new Set();
export let settingFilters = new Set();
export let backendConfig;
export let runtime;

(function() {
    // export let version = VERSION.version() //1.4, 1.4.4, or CTLE
    let timers;
    if(version === "1.4") {
        timers = [500, 5000]
    } else { //1.4.4 or CTLE
        timers = [100, 2000]
    }

    // let runtime;
    // let filters = new Set()
    // currentFilter = "apple";

    // let backendConfig;

    let menus = ["mods", "settings", "profiles", "skins", "addmod"];
    let inGame = false;

    

    

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
        background: "url(../src/img/modloader/menubutton.png)",
        backgroundSize: "80%", //or contain
        backgroundPosition: "48%",
        backgroundRepeat: "no-repeat",
        backgroundColor: "white",
        border: "2px solid black", //2p solid black
        position: "absolute",
        cursor: "pointer",
        left: "4px",
        top: "4px",
        width: "40px",
        height: "35px",
        borderRadius: "5px",
        display: "block",
        zIndex: "2147483647",
        display: "none"
      };
      Object.keys(c).forEach(function (a) {
        menuButton.style[a] = c[a];
      });
      menuButton.id = "menu-button";
  
      menuButton.onclick = function () {
        if (document.getElementById("menu-bg") === null) {
          //if menu doesnt exist, to avoid duplicates
          map = disableClick();
          createModLoaderMenu();
          document.getElementById("menu-button").style.display = "none";
          document.getElementById("c2canvasdiv").style.filter = "blur(1.2px)";
        }
      };
      document.body.appendChild(menuButton);
    };
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
          zIndex: "1001",
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
          const popups = document.getElementsByClassName("modloader-popups");
          for (let i = 0; i < popups.length; i++) {
            if(popups[i].id === "modSettingsPopup-bg") { //if mod settings menu is open, ensure settings are properly saved
              document.getElementById("x-button-mod-settings").click()
            } else {
              popups[i].remove();
            }
          }
          versionText.remove();
          enableClick(map);
          let modSettings = JSON.parse(localStorage.getItem('modSettings'));
          for(const [key] of Object.entries(modSettings['mods'])) {
              if(modSettings['mods'][key]['enabled'] === true) {
                if(key.startsWith("custom") || !backendConfig['mods'][key]['tags'].includes('visual')) {
                  document.getElementById("cheat-indicator").style.display = "block";
                  break;
                } else {
                  document.getElementById("cheat-indicator").style.display = "none";
                }
              }
          }
          // if(inGame) {
          //   document.getElementById("menu-button").style.display = "none";
          // } else {
          //   document.getElementById("menu-button").style.display = "block";
          // }
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
        setFilter("all");
        searchBar.disabled = false;
        searchBar.blur();
        let elements = document.getElementsByClassName('nav-button');
        for(let i = 0; i < elements.length; i++) {
          elements[i].style.backgroundColor = 'white';
        }
        modsButton.style.backgroundColor = "lightblue";
        renderModsMenu(sectionDiv);

      }
      let settingsButton = createNavButton("nav-settings-btn", "Settings", "13vw");
      settingsButton.onclick = function() {
        searchBar.blur()
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createNotifyModal("Settings are not available yet.");
        // setFilter("all");
        // searchBar.disabled = false;
        // searchBar.blur()
        // let elements = document.getElementsByClassName('nav-button');
        // for(let i = 0; i < elements.length; i++) {
        //   elements[i].style.backgroundColor = 'white';
        // }
        // settingsButton.style.backgroundColor = "lightblue";
        // renderSettingsMenu(sectionDiv);
      }

      let profilesButton = createNavButton("nav-profiles-btn", "Profiles", "13vw");
      profilesButton.onclick = function() {
        searchBar.blur()
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createNotifyModal("Profiles are not available yet.");
      }
      let skinsButton = createNavButton("nav-skins-btn", "Skins", "13vw");
      skinsButton.onclick = function() {
        setFilter("all");
        searchBar.disabled = false;
        searchBar.blur()
        let elements = document.getElementsByClassName('nav-button');
        for(let i = 0; i < elements.length; i++) {
          elements[i].style.backgroundColor = 'white';
        }
        skinsButton.style.backgroundColor = "lightblue";
        renderSkinsMenu(sectionDiv);
      }
      let addmodButton = createNavButton("nav-addmod-btn", "Add Mod", "13vw");
      addmodButton.onclick = function() {
        searchBar.disabled = true;
        searchBar.value = "";
        // searchBar.style.cursor = "not-allowed";
        let elements = document.getElementsByClassName('nav-button');
        for(let i = 0; i < elements.length; i++) {
          elements[i].style.backgroundColor = 'white';
        }
        addmodButton.style.backgroundColor = "lightblue";
        renderAddModMenu(sectionDiv);
        
      }

      let replaysButton = createNavButton("nav-replays-btn", "Replays", "13vw");
      replaysButton.onclick = function() {
        searchBar.disabled = true;
        searchBar.value = "";
        // searchBar.style.cursor = "not-allowed";
        let elements = document.getElementsByClassName('nav-button');
        for(let i = 0; i < elements.length; i++) {
          elements[i].style.backgroundColor = 'white';
        }
        replaysButton.style.backgroundColor = "lightblue";
        while (sectionDiv.firstChild) {
          sectionDiv.removeChild(sectionDiv.lastChild);
        }
        renderReplaysMenu(document.getElementById('filters-and-cards-div'));
        
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
        cursor: "text",
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
        console.log("please");
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
        let cardsList = [];
        if(modsButton.style.backgroundColor === "lightblue") {
          cardsList = searchMods(searchBar.value, currentFilter);
        }
        if(skinsButton.style.backgroundColor === "lightblue") {
          cardsList = searchSkins(searchBar.value, currentFilter);
        }
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
      // buttonContainer.appendChild(profilesButton);
      buttonContainer.appendChild(skinsButton);
      buttonContainer.appendChild(replaysButton);
      buttonContainer.appendChild(addmodButton);
      buttonContainer.appendChild(searchBar);



      //////////////////////////button navbar ^^



      //////////////////////////below crap


      let sectionDiv = document.createElement("div");
      sectionDiv.id = "filters-and-cards-div";
      c = {
        display: "flex",
        flex: "1",
        alignItems: "start",
        overflow: "hidden",
        borderTop: "solid 3px black",
        // scrollbarGutter: "stable",
        // height: "100%",
        // backgroundColor: "blue",
        // justifyContent: "space-between",
        // flexDirection: "row",

      }
      Object.keys(c).forEach(function (a) {
        sectionDiv.style[a] = c[a];
      });

      


      //default menu, when users open the modmenu
      renderModsMenu(sectionDiv)


      


      

      menuBg.appendChild(navbar);
      menuBg.appendChild(buttonContainer);
      menuBg.appendChild(sectionDiv);
      document.body.appendChild(menuBg);

      
      
      

    } 

    




    


    let cleanModLoader = {
        async init() {
          createChangeLayoutHook("LayoutChange");
          // window.addEventListener(
          //   "LayoutChange",
          //   (e) => {
          //     console.log(e.detail.layout.name)
          //     if(e.detail.layout.name.startsWith("Level") && e.detail.layout.name !== "Level Menu") {
          //       document.getElementById("menu-button").style.display = "none";
          //       inGame = true;
          //     } else {
          //       document.getElementById("menu-button").style.display = "block";
          //       inGame = false;
          //     }
          //   },
          //   false,
          // );

          createCallFunctionHook("CallFunction");
          window.addEventListener(
            "CallFunction",
            (e) => {
              // console.log(e.detail.name);
              if(e.detail.name === "Menu > Modloader") {
                document.getElementById("menu-button").click(); 
              }
            },
            false,
          );
          
          // createc2_callFunctionHook("c2_callFunction")
          // window.addEventListener(
          //   "c2_callFunction",
          //   (e) => {
          //     // console.log(e.detail.name);
          //     if(e.detail.name === "Menu > Modloader") {
          //       document.getElementById("menu-button").click(); 
          //     }
          //   },
          //   false,
          // );
          

          createDialogOpenHook("DialogOpen");
          // window.addEventListener(
          //   "DialogOpen",
          //   (e) => {
          //     if(e.detail.name === "PauseClose") {
          //       // console.log("Dialog open")
          //       // notify("Dialog Opened", "wow!", "./speedrunner.png");
          //       document.getElementById("menu-button").style.display = "block";
          //       inGame = false;
          //       console.log(isPaused())
          //       // console.log()
          //     }
              
          //   },
          //   false,
          // );

          createDialogCloseHook("DialogClose");
          // window.addEventListener(
          //   "DialogClose",
          //   (e) => {
          //     if(e.detail.name === "PauseClose") {
          //       // console.log("Dialog close")
          //       // notify("Dialog Closed", "wow!", "./speedrunner.png");
          //       document.getElementById("menu-button").style.display = "none";
          //       inGame = true;
          //     }
          //   },
          //   false,
          // );
          createSaveHook("SaveGame");
          window.addEventListener(
            "SaveGame",
            (e) => {
              // console.log("save game!")
              // notify("Save game", "wow!", "./speedrunner.png");
              if(runtime.running_layout.name === "Skins Menu") {
                console.log("skins menu")
                let modSettings = JSON.parse(localStorage.getItem('modSettings'));
                let saveObj = runtime.types_by_index.filter((x) => x.plugin instanceof cr.plugins_.SyncStorage)[0].instances[0]

                for(const [key] of Object.entries(modSettings['skins'])) {
                  console.log(key, modSettings['skins'][key]['using'])
                  if(modSettings['skins'][key]['using'] === true) {
                    modSettings['skins'][key]['using'] = false;
                  }
                }
                modSettings['skins'][saveObj.data.CurSkin]['using'] = true;
                localStorage.setItem('modSettings', JSON.stringify(modSettings));
              }
            },
            false,
          );

          createButtonClickHook("ButtonClick");
          window.addEventListener(
            "ButtonClick",
            (e) => {
              // console.log("save game!")
              // notify("Save game", "wow!", "./speedrunner.png");
              // console.log("button click!!")
              console.log("button click!!", e.detail.name, e.detail.params)
              if(e.detail.name === "Menu > Modloader") {
                document.getElementById("menu-button").click();
              }

            },
            false,
          );

          // createDialogShowOverlayHook("DialogShowOverlay");
          // window.addEventListener(
          //   "DialogShowOverlay",
          //   (e) => {
          //     console.log(isPaused())
          //     notify("Dialog Show Overlay", "wow!", "./speedrunner.png");
          //   },
          //   false,
          // );


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
              freshUserConfig = {'mods': {}, 'settings': {}, 'skins': {}}
              for (const [key] of Object.entries(backendConfig['mods'])) {
                  freshUserConfig['mods'][key] = backendConfig["mods"][key]['defaultSettings'];
              }

              for(const [key] of Object.entries(backendConfig['settings'])) {
                  freshUserConfig['settings'][key] = backendConfig["settings"][key]['defaultSettings'];

              }
              for(const [key] of Object.entries(backendConfig['skins'])) {
                  freshUserConfig['skins'][key] = backendConfig["skins"][key]['defaultSettings'];
              }
              freshUserConfig['version'] = backendConfig['version'];
              localStorage.setItem('modSettings', JSON.stringify(freshUserConfig));
          } else if(userConfig['version'] === undefined) {
              //using old save format
              freshUserConfig = {'mods': {}, 'settings': {}, 'skins': {}}
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
                      customModConfig['icon'] = "../src/img/mods/custommod.png"
                      customModConfig['platform'] = ["pc", "mobile"];
                      customModConfig['version'] = ["1.4", "1.4.4", "CTLE"];
                      customModConfig['tags'] = ['custom'];
                      customModConfig['reload'] = true;
                      customModConfig['settings'] = null;
                      customModConfig['favorite'] = false;
                      freshUserConfig['mods'][key] = customModConfig;

                      incCustomModNum();
                  }
              }
              for(const [key] of Object.entries(backendConfig['settings'])) {
                freshUserConfig['settings'][key] = backendConfig["settings"][key]['defaultSettings'];
              }
              for(const [key] of Object.entries(backendConfig['skins'])) {
                  freshUserConfig['skins'][key] = backendConfig["skins"][key]['defaultSettings'];
              }

              freshUserConfig['version'] = backendConfig['version'];
              localStorage.setItem('modSettings', JSON.stringify(freshUserConfig));
          } else  { //
              //new version
              if(userConfig['version'] !== backendConfig['version']) {
                document.getElementById("c2canvasdiv").style.filter = "blur(1.2px)";
                map = disableClick(runtime);
                createChangelogPopup(changelog, userConfig['version'], backendConfig['version'], map);
              }
              console.log("new version")
              userConfig['mods'] = userConfig['mods'] === undefined ? {} : userConfig['mods']
              userConfig['settings'] = userConfig['settings'] === undefined ? {} : userConfig['settings']
              userConfig['skins'] = userConfig['skins'] === undefined ? {} : userConfig['skins']
              console.log(userConfig['skins'])
              freshUserConfig = {'mods': {}, 'settings': {}, 'skins': {}}
              for (const [key] of Object.entries(backendConfig['mods'])) {
                  if(userConfig['mods'][key] === undefined) {
                    freshUserConfig['mods'][key] = backendConfig["mods"][key]['defaultSettings'];
                  } else {
                    console.log(key)
                    if (backendConfig['mods'][key]['defaultSettings']['settings'] !== null) {
                      let backendModSettings = Object.keys(backendConfig['mods'][key]['defaultSettings']['settings'])
                      if (userConfig['mods'][key]['settings'] === null) {
                        userConfig['mods'][key]['settings'] = {}
                      }
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

              for (const [key] of Object.entries(backendConfig['settings'])) {
                if(userConfig['settings'][key] === undefined) {
                  freshUserConfig['settings'][key] = backendConfig["settings"][key]['defaultSettings'];
                } else {
                  console.log(key)
                  if (backendConfig['settings'][key]['defaultSettings'] !== null) {
                    let backendSettingSettings = Object.keys(backendConfig['settings'][key]['defaultSettings'])
                    if (userConfig['settings'][key] === null) {
                      userConfig['settings'][key] = {}
                    }
                    let userSettingSettings = Object.keys(userConfig['settings'][key])
                    if(!arraysEqual(backendSettingSettings, userSettingSettings)) {
                      let newSettings = backendSettingSettings.filter(x => !userSettingSettings.includes(x))
                      let badSettings = userSettingSettings.filter(x => !backendSettingSettings.includes(x))
                      for(const setting of newSettings) {
                        userConfig['settings'][key] = backendConfig['settings'][key]['defaultSettings']
                      }
                      for(const setting of badSettings) {
                        delete userConfig['settings'][key]
                      }
                    }
                  }
                  freshUserConfig['settings'][key] = userConfig['settings'][key];
                }
            }

              for(const [key] of Object.entries(backendConfig['settings'])) {
                  if(userConfig['settings'][key] === undefined) {
                      freshUserConfig['settings'][key] = backendConfig['settings'][key]['defaultSettings'];
                  } else {
                    // console.log('SDHUIOFASDHUO');
                      freshUserConfig['settings'][key] = userConfig['settings'][key];
                  }
              }
              console.log(userConfig['skins'])
              console.log(backendConfig['skins'])
              for(const [key] of Object.entries(backendConfig['skins'])) {
                
                if(userConfig['skins'][key] === undefined) { // new skin
                    freshUserConfig['skins'][key] = backendConfig['skins'][key]['defaultSettings'];
                } else { //existing skin
                  // console.log('SDHUIOFASDHUO');
                    freshUserConfig['skins'][key] = userConfig['skins'][key];
                }
              }
              for(const [key] of Object.entries(userConfig['skins'])) {
                if(key.startsWith("custom")) { //custom skin
                  freshUserConfig['mods'][key] = userConfig['mods'][key];
                } else {
                  delete userConfig['mods'][key]; //if skin is not in backend, delete it
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

          

          // for(const[key] of Object.entries(backendConfig['skins'])) {
          //   if(!backendConfig['skins'][key]['tags'].includes("official")) { //community skin
          //     console.log(key)
          //     let replaces = backendConfig['skins'][key]['replaces']
          //     runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[key] = runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[replaces];
          //     // let skin = runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[key]
          //     let url = backendConfig['skins'][key]['url']
          //     for(let i = 0; i < 10; i++) {
          //       runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[key].head.type.all_frames[i].texture_file = url
          //       runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[key].head.type.all_frames[i].texture_filesize = 404
          //       //a = runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins.lknight.head.type.all_frames[i].texture_img
          //       //a.cr_src = 'http://127.0.0.1:5501/dev/images/skin8-sheet0.png'
          //       //a.cr_filesize = 404
          //       //a.currentSrc = 'http://127.0.0.1:5501/dev/images/skin8-sheet0.png'
          //       runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[key].head.type.all_frames[i].texture_img.cr_src = url
          //       runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[key].head.type.all_frames[i].texture_img.cr_filesize = 404
          //       // runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[key].head.type.all_frames[i].texture_img.currentSrc = url
          //       runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[key].head.type.all_frames[i].texture_img.src = url
          //       //runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins.apple.head.type.all_frames[i].webGL_texture.c2texkey = 'http://127.0.0.1:5501/dev/images/skin8-sheet0.png,false,false'
          //       // runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[key].head.type.name = "t" + (runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[key].head.type.index + 1000)
          //       // runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[key].head.type.index = runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[key].head.type.index + 1000
          //     }
          //   }
          // }
          let data_response = await fetch('data.js')
          .then((response) => response.json())
          .then(jsondata => {
              return jsondata;
          });
          for(const[key] of Object.entries(backendConfig['skins'])) {
            if(!backendConfig['skins'][key]['tags'].includes("official") && backendConfig['skins'][key]['version'].includes(skinVersion)) { //community skin
              console.log(key)
              let replaces = backendConfig['skins'][key]['replaces']
              let url = backendConfig['skins'][key]['url']
              addSkin(key, replaces, url, data_response)
              let entry = {
                "achievement": -1,
                "hidden": false,
                "icon":  backendConfig['skins'][key]['icon'],
                "lang": key,
                "name": backendConfig['skins'][key]['name'],
                "price": 0,
                "skin": key
              }
              runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.aekiro_model)[0].instances[0].hashtable.Skins.push(entry)
              runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.JSON)[1].instances[0].data.root.push(entry)
            }
          }
          let customSkin = false
          //enable skins, find skin that is using
          let foundSkin = false;
          for (const [key] of Object.entries(userConfig['skins'])) {
            if(userConfig['skins'][key]['using'] === true && backendConfig['skins'][key]['version'].includes(skinVersion) && !foundSkin && !backendConfig['skins'][key]['tags'].includes("official")) {
              customSkin = true
              console.log("set skin", key)
              userConfig['skins'][key]["using"] = true;
              console.log(1)
              runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Globals)[0].instances[0].instance_vars[8] = key;
              console.log(1)
              let saveObj = runtime.types_by_index.filter((x) => x.plugin instanceof cr.plugins_.SyncStorage)[0].instances[0];
              saveObj.data.CurSkin = key;
              cr.plugins_.SyncStorage.prototype.acts.SaveData.call(saveObj)
              console.log(1)
              
              let insts = runtime.types_by_index.filter((x) =>
                x.behaviors.some(
                  (y) => y.behavior instanceof cr.behaviors.SkymenSkin))[0].instances
              let collider = runtime.types_by_index
                .filter(
                  (x) =>
                    !!x.animations &&
                    x.animations[0].frames[0].texture_file.includes("collider")
                )[0]
                .instances[0];
                console.log(1)
              for(let i = 0; i < insts.length; i++) {
                  let cur = insts[i]
                  cur.width = cur.curFrame.width
                  cur.height = cur.curFrame.height
                  console.log(1, i)
                  cur.set_bbox_changed(); 
                  console.log(1, i)

                  let skymenskinbehav = cur.behaviorSkins[0]
                  skymenskinbehav.syncScale = true;
                  skymenskinbehav.syncSize = false;
                  console.log(1, i)
                  
                  cr.behaviors.SkymenSkin.prototype.acts.SetSkin.call(skymenskinbehav, key); // causes black skin bug
                  console.log(1, i)

                  cur.width = (collider.width / collider.curFrame.width) * cur.curFrame.width;
                  cur.height = (collider.height / collider.curFrame.height) * cur.curFrame.height;
                  cur.set_bbox_changed();            
              }
              console.log(1)
              foundSkin = true;
            } else {
              userConfig['skins'][key]['using'] = false
            }
          }
          if (!foundSkin) { //they are using official skin or something else is wrong
            let saveObj = runtime.types_by_index.filter((x) => x.plugin instanceof cr.plugins_.SyncStorage)[0].instances[0];
            let skin = saveObj.data.CurSkin === undefined ? "" : saveObj.data.CurSkin;
            console.log(saveObj)
            if(backendConfig['skins'][skin]['version'].includes(skinVersion)) { //skin loaded fine
              userConfig['skins'][skin]['using'] = true;
            } else {
              userConfig['skins'][""]["using"] = true;
              runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Globals)[0].instances[0].instance_vars[8] = "";
              
              saveObj.data.CurSkin = "";
              cr.plugins_.SyncStorage.prototype.acts.SaveData.call(saveObj)
              
              
              let insts = runtime.types_by_index.filter((x) =>
                x.behaviors.some(
                  (y) => y.behavior instanceof cr.behaviors.SkymenSkin))[0].instances
              let collider = runtime.types_by_index
                .filter(
                  (x) =>
                    !!x.animations &&
                    x.animations[0].frames[0].texture_file.includes("collider")
                )[0]
                .instances[0];
              for(let i = 0; i < insts.length; i++) {
                  let cur = insts[i]
                  cur.width = cur.curFrame.width
                  cur.height = cur.curFrame.height
                  cur.set_bbox_changed();    
                  let skymenskinbehav = cur.behaviorSkins[0]
                  skymenskinbehav.syncScale = true;
                  skymenskinbehav.syncSize = false;
                  cr.behaviors.SkymenSkin.prototype.acts.UseDefault.call(skymenskinbehav);

                  cur.width = (collider.width / collider.curFrame.width) * cur.curFrame.width;
                  cur.height = (collider.height / collider.curFrame.height) * cur.curFrame.height;
                  cur.set_bbox_changed();               
              }
              
            }
          }

          if (customSkin) {
            runtime.changelayout = runtime.running_layout
          }

          localStorage.setItem('modSettings', JSON.stringify(userConfig));
          


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

          skinFilters.add('all');
          skinFilters.add('favorite');
          skinFilters.add('custom');
          for (const [key] of Object.entries(backendConfig['skins'])) {
            for(let i = 0; i < backendConfig["skins"][key]['tags'].length; i++) {
              skinFilters.add(backendConfig["skins"][key]['tags'][i]);
            }
          }
          skinFilters = Array.from(skinFilters);

          settingFilters.add('all');
          for (const [key] of Object.entries(backendConfig['settings'])) {
            for(let i = 0; i < backendConfig["settings"][key]['tags'].length; i++) {
              settingFilters.add(backendConfig["settings"][key]['tags'][i]);
            }
          }
          settingFilters = Array.from(settingFilters);

          // for replay system
          let js = document.createElement("script");
          js.type = "application/javascript";
          js.src = '../src/modloaders/util/pages/replays/replayruntime.js';
          js.id = 'replayruntime';
          document.head.appendChild(js);
          
          
          document.addEventListener("keydown", (event) => {
            this.keyDown(event)
          });
          
          addModloaderButtonTexture();


    
          
          createModLoaderMenuBtn();
          // document.getElementById("menu-button").click();
          // runtime.tickMe(this);


          notify("QOL Modloader", "by Awesomeguy", "../src/img/modloader/modloader.png");
          // console.log(createNotifyModal)
          // createNotifyModal("appleapple");

        },

        keyDown(event) {
            if(event.keyCode === 192) { //backtick
                if(document.getElementById("menu-bg") === null) { //menu doesnt exist
                    //create mod menu
                    document.getElementById("menu-button").click();
                } else { //menu exists
                    //remove mod menu
                    if(document.getElementById("confirm-bg") === null) {
                        document.getElementById("x-button").click();
                        
                    }         
                }    
            }
        },

        toString() {
          return "modloader"
        }

        
        
    };
  
    setTimeout(onFinishLoad, timers[0]);
})();