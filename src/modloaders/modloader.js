import {createNotifyModal, createChangelogPopup, createConfirmDeleteModal, createConfirmReloadModal} from './util/modals.js';
import { isInLevel, isPaused, closePaused, disableClick, enableClick, notify, menuButtonHover, levelButtonHover} from './util/ovo.js';
import {sleep, arraysEqual, detectDeviceType} from './util/utils.js';
import {currentFilter, setFilter} from './util/pages/mods/filters.js';
import {renderModsMenu, renderAddModMenu, searchMods} from './util/pages/mods/render.js';
import { customModNum, incCustomModNum } from './util/pages/mods/utils.js';

//constants
export let version = VERSION.version();
export let filters = new Set();
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
          top: "60px",
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
          enableClick(map);
          if(inGame) {
            document.getElementById("menu-button").style.display = "none";
          } else {

            document.getElementById("menu-button").style.display = "block";
          }
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

                        incCustomModNum();
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
            
                        

            document.addEventListener("touchstart", (event) => {
              this.mouseend(event)
            });

            document.addEventListener("mouseup", (event) => {
                this.mouseend(event)
            });

            document.addEventListener("keydown", (event) => {

                this.keyDown(event)
            });


            
            
            createModLoaderMenuBtn();
            // document.getElementById("menu-button").click();
            // runtime.tickMe(this);


            notify("QOL Modloader", "by Awesomeguy", "https://cdn3.iconfinder.com/data/icons/work-life-balance-glyph-1/64/quality-of-life-happiness-heart-512.png");
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
            if(event.keyCode === 27) { //escape
              if (isInLevel()) {
                if(inGame) {
                  document.getElementById("menu-button").style.display = "block";
                  inGame = false;
                } else {
                  inGame = true;
                  document.getElementById("menu-button").style.display = "none";

                }
              }
                
            }
        },

        mouseend(event) {
          let mouse = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Mouse).instances[0]
          let buttonBehav = runtime.types_by_index.filter((x) =>
            x.behaviors.some(
              (y) => y.behavior instanceof cr.behaviors.aekiro_button)
            )[0].instances[0].behavior_insts[0];
            
            console.log(runtime.types_by_index.filter((x) =>
            x.behaviors.some(
              (y) => y.behavior instanceof cr.behaviors.aekiro_button)
            )[4].instances)
            let menuButtonClicked = menuButtonHover();
            let levelButtonClicked = levelButtonHover();

            if(levelButtonClicked !== null) {
              console.log("levelbutton")
              document.getElementById("menu-button").style.display = "none";
              inGame = true;
            }
            let uiButtons = runtime.types_by_index.filter((x) =>
                x.behaviors.some(
                (y) => y.behavior instanceof cr.behaviors.aekiro_button
                )
            )[0]
            console.log(uiButtons.instances)



            if(menuButtonClicked !== null) {
              console.log("apple pieee", menuButtonClicked.properties[1])
              console.log("playbutton")
              let buttonType = menuButtonClicked.properties[1];
              let hideButtons = ["Play", "Resume", "Reload", "Next", "Replay", "LoadReplay"]
              if (hideButtons.includes(buttonType)) {
                document.getElementById("menu-button").style.display = "none";
                inGame = true;
              } else if(buttonType === "Pause" || (buttonType === "Back" && isPaused())) {
                if (inGame) {
                  document.getElementById("menu-button").style.display = "block";
                  inGame = false;
                } else {
                  document.getElementById("menu-button").style.display = "none";
                  inGame = true;
                }
              } else {
                document.getElementById("menu-button").style.display = "block";
                inGame = false;
              }
            }



        },

        
        
    };
  
    setTimeout(onFinishLoad, timers[0]);
})();