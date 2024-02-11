(function() {

    let version = VERSION.version() //1.4, 1.4.4, or CTLE
    if(version === "1.4") {
        timers = [500, 5000]
    } else { //1.4.4 or CTLE
        timers = [100, 2000]
    }

    var runtime;
    var filters = new Set();

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
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


    let createConfirmMenu = () => {
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
          width: "35%",
          // height: "15%",
          overflow: "auto",
          margin: "0",
          padding: "5px",
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

      content = document.createTextNode("This mod requires a reload to disable.");
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
      confirmButton.innerHTML = "Reload now";
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
      cancelButton.innerHTML = "Reload later";
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
        width: "35%",
        // height: "15%",
        overflow: "auto",
        margin: "0",
        padding: "10px",
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
          this.currentFilter = id.split("-")[0]; //set currentFilter to this filter
          document.getElementById(id).style.backgroundColor = "lightblue";
          filterCards = document.getElementById("cards-div").children;
          while(filterCards.length > 0) { //clear all cards
            filterCards[0].remove();
          }
          for (const [key] of Object.entries(backendConfig['mods'])) {
            if(key != "version" && key != "settings" && backendConfig['mods'][key]['version'].includes(version) && backendConfig['mods'][key]['platforms'].includes(detectDeviceType())) {
              if(this.currentFilter === 'all') {
                b = createMenuCard(key, backendConfig['mods'][key]['name'], backendConfig['mods'][key]['icon'], JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['enabled']);
                cardsDiv.appendChild(b);
              } else if(this.currentFilter === 'favorite') {
                console.log(JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['favorite'])
                if(JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['favorite']) {
                  b = createMenuCard(key, backendConfig['mods'][key]['name'], backendConfig['mods'][key]['icon'], JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['enabled']);
                  cardsDiv.appendChild(b);
                }
              } else {
                if(backendConfig['mods'][key]['tags'].includes(this.currentFilter)) {
                  b = createMenuCard(key, backendConfig['mods'][key]['name'], backendConfig['mods'][key]['icon'], JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['enabled']);
                  cardsDiv.appendChild(b);
                }
              }
            }
          }


        } 
      }
      return menuButton;
    }

    
    let createNavButton = (id, text, width) => {
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
        textAlign: "center",
        verticalAlign: "middle",
        border: "solid 3px black",
        borderRadius: "10px 10px 10px 10px",
        
      }
      Object.keys(d).forEach(function (a) {
        menuButton.style[a] = d[a];
      });
      
      menuButton.appendChild(p);

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
        // background: "url(https://cdn-icons-png.flaticon.com/128/1828/1828970.png)",
        // backgroundSize: "contain",
        // backgroundRepeat: "no-repeat",
        // backgroundPosition: "center",
        // borderRadius: "10px",

        // height: "auto",
      }
      Object.keys(c).forEach(function (a) {
        menuButton.style[a] = c[a];
      });
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
          console.log("info")
        } else if(id.includes("settings")) {
          document.getElementById("menu-bg").style.pointerEvents = "none";
          document.getElementById("menu-bg").style.filter = "blur(1.2px)";
          createNotifyModal("Settings are not available yet.");
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

        }
      }
      return cardButton;
    }

    let createMenuCard = (id, name, iconurl, enabled) => {
      let menuCard = document.createElement("div");
      menuCard.id = id;
      // menuCard.innerHTML = text;
      c = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        // alignItems: "center",
        width: "100%",
        flexGrow: "0",
        flexShrink: "0",

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
      c = {
        fontFamily: "Retron2000",
        color: "black",
        fontSize: "2vw",
        // maxWidth: "100%",
        // whiteSpace: "nowrap",
        // display: "block",
        // position: "relative",
        // margin: "0",
        // padding: "0",
        // backgroundColor: "red",
        // gridArea: "t",
      }
      Object.keys(c).forEach(function (a) {
        cardText.style[a] = c[a];
      });
      cardText.innerHTML = name;

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
      settingsButton = createCardButton(id + "-settings-btn", "https://cdn-icons-png.flaticon.com/128/2040/2040504.png", "calc(100%/3)");
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
      topCards.appendChild(settingsButton);
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
        enabledButton = createNavButton("button4", "Enabled", "100%");
        enabledButton.style.backgroundColor = "rgb(45, 186, 47)"; //lightgreen
      } else {
        enabledButton = createNavButton("button4", "Disabled", "100%");
        enabledButton.style.backgroundColor = "rgb(222, 48, 51)";
      }
      enabledButton.style.gridArea =  "b4";
      enabledButton.style.border = "none";
      enabledButton.style.borderRadius = "0px 0px 10px 10px";
      enabledButton.id = id + "-enable-button";
      enabledButton.onclick = function() {
        
        console.log("clicked")
        console.log(JSON.parse(localStorage.getItem('modSettings'))['mods'][id]['enabled'])
        if(JSON.parse(localStorage.getItem('modSettings'))['mods'][id]['enabled']) {
          console.log("disabled")
          modSettings = JSON.parse(localStorage.getItem('modSettings'));
          modSettings['mods'][id]["enabled"] = false;
          localStorage.setItem('modSettings', JSON.stringify(modSettings));
          document.getElementById(id + '-enable-button').innerHTML = "Disabled";
          document.getElementById(id + '-enable-button').style.backgroundColor = "rgb(222, 48, 51)";
        } else {
          console.log("enabled")

          modSettings = JSON.parse(localStorage.getItem('modSettings'));
          modSettings['mods'][id]["enabled"] = true;
          localStorage.setItem('modSettings', JSON.stringify(modSettings));
          document.getElementById(id + '-enable-button').innerHTML = "Enabled";
          document.getElementById(id + '-enable-button').style.backgroundColor = "rgb(45, 186, 47)";
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
          top: "3px",
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
          padding: "5px",
          color: "black",
          fontSize: "10pt",
          // display: "block",
          width: "90%",
          height: "90%",
          display: "flex",
          flexDirection: "column",
      };
      Object.keys(c).forEach(function (a) {
          menuBg.style[a] = c[a];
      });
      menuBg.id = "menu-bg";
      

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
      button1 = createNavButton("nav-mods-btn", "Mods", "13vw");
      button1.style.backgroundColor = "lightblue";
      button2 = createNavButton("nav-settings-btn", "Settings", "13vw");
      button2.onclick = function() {
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createNotifyModal("Settings are not available yet.");
      }

      button3 = createNavButton("nav-profiles-btn", "Profiles", "13vw");
      button3.onclick = function() {
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createNotifyModal("Profiles are not available yet.");
      }
      button4 = createNavButton("nav-skins-btn", "Skins", "13vw");
      button4.onclick = function() {
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createNotifyModal("Skins are not available yet.");
      }
      button5 = createNavButton("nav-addmod-btn", "Add Mod", "13vw");
      button5.onclick = function() {
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createNotifyModal("Custom mods are not available yet.");
      }
      button6 = createNavButton("nav-search-btn", "Search", "13vw");
      button6.onclick = function() {
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createNotifyModal("Searching is not available yet.");
      }


     
      buttonContainer.appendChild(button1);
      buttonContainer.appendChild(button2);
      buttonContainer.appendChild(button3);
      buttonContainer.appendChild(button4);
      buttonContainer.appendChild(button5);
      buttonContainer.appendChild(button6);


      filtersAndCards = document.createElement("div");
      filtersAndCards.id = "filters-and-cards-div";
      c = {
        display: "flex",
        flex: "1",
        alignItems: "start",
        overflow: "hidden",
        scrollbarGutter: "stable",
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


      console.log(filters)
      // allFilterButton = createFilterButton("all-filter-btn", "All", "13vw", 'all'); //fix so that font rescales
      // favFilterButton = createFilterButton("fav-filter-btn", "Favorites", "13vw", 'favorite');
      // customFilterButton = createFilterButton("custom-filter-btn", "Custom", "13vw", 'custom');
      // filtersDiv.appendChild(allFilterButton);
      // filtersDiv.appendChild(favFilterButton);
      // filtersDiv.appendChild(customFilterButton);

      for(const filter of filters) {
        console.log(filter)
        if(filter === 'favorite') {
          filterButton = createFilterButton(filter + "-filter-btn", "Favorites", "13vw");
        } else {
          filterButton = createFilterButton(filter + "-filter-btn", filter.charAt(0).toUpperCase() + filter.slice(1), "13vw");

        }
        if(filter === 'all') { //set initial filter to all
          filterButton.style.backgroundColor = "lightblue";
          this.currentFilter = 'all';

        }
        filtersDiv.appendChild(filterButton);
      }

      


    


      filtersAndCards.appendChild(filtersDiv);
      
      cardsDiv = document.createElement("div");
      cardsDiv.addEventListener('wheel', (e) => {
        // console.log("hello)")
        e.stopImmediatePropagation()
        e.stopPropagation();
        // e.preventDefault();
        cardsDiv.focus();
      });
      c = {
        display: "grid",
        padding: "10px",
        gridTemplateColumns: "repeat(4, 0.25fr)", 
        columnGap: "5%",
        rowGap: "6%",
        // gridTemplateRows: "1fr 1fr 1fr 1fr",

        borderLeft: "solid 3px black",
        borderTop: "solid 3px black",
        width: "83%",
        height: "100%",
        overflowY: "auto",
        scrollbarGutter: "stable",
        scrollbarWidth: "thin",
      }
      Object.keys(c).forEach(function (a) {
          cardsDiv.style[a] = c[a];
      });
      cardsDiv.id = "cards-div";



      console.log(this.backendConfig['mods'])
      for (const [key] of Object.entries(this.backendConfig['mods'])) {
        console.log(key)
        if(key != "version" && key != "settings" && this.backendConfig['mods'][key]['version'].includes(version) && this.backendConfig['mods'][key]['platforms'].includes(detectDeviceType())) {
          b = createMenuCard(key, this.backendConfig['mods'][key]['name'], this.backendConfig['mods'][key]['icon'], JSON.parse(localStorage.getItem('modSettings'))['mods'][key]['enabled']);
          cardsDiv.appendChild(b);
        }
      }



      filtersAndCards.appendChild(cardsDiv);


      


      

      menuBg.appendChild(navbar);
      menuBg.appendChild(buttonContainer);
      menuBg.appendChild(filtersAndCards);
      document.body.appendChild(menuBg);

      
      
      

    }



    


    let cleanModLoader = {
        async init() {
            this.backendConfig = null;
            this.currentFilter = null;
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

            backendConfig = await fetch('../src/mods/modloader/config/generalMods.json')
            .then((response) => response.json())
            .then(jsondata => {
                return jsondata;
            });


            localStorage.setItem('modSettings', JSON.stringify({}));
            
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
                    if(backendConfig['mods'][key] === undefined) { //custom mod
                        customModConfig = userConfig[key];
                        customModConfig['author'] = null;
                        customModConfig['icon'] = "https://cdn0.iconfinder.com/data/icons/web-development-47/64/feature-application-program-custom-512.png"
                        customModConfig['platform'] = ["pc", "mobile"];
                        customModConfig['version'] = ["1.4", "1.4.4", "CTLE"];
                        customModConfig['tags'] = ['custom'];
                        customModConfig['reload'] = true;
                        customModConfig['settings'] = null;
                        freshUserConfig['mods'][key] = customModConfig;
                        customModNum++;
                    }
                }
                freshUserConfig['version'] = backendConfig['version'];
                freshUserConfig['settings'] = backendConfig['settings'];
                localStorage.setItem('modSettings', JSON.stringify(freshUserConfig));
            } else if(userConfig['version'] !== backendConfig['version']) {
                //new version
                freshUserConfig = {'mods': {}, 'settings': {}}
                for (const [key] of Object.entries(backendConfig['mods'])) {
                    if(userConfig['mods'][key] === undefined) {
                        freshUserConfig['mods'][key] = backendConfig["mods"][key]['defaultSettings'];
                    } else {
                        freshUserConfig['mods'][key] = userConfig['mods'][key];
                    }
                }
                for(const [key] of Object.entries(backendConfig['settings'])) {
                    if(userConfig['settings'][key] === undefined) {
                        freshUserConfig['settings'][key] = backendConfig['settings'][key];
                    } else {
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
                // console.log(backendConfig['mods'][key])
                if(userConfig['mods'][key]['enabled'] === true && backendConfig['mods'][key]['version'].includes(version) && backendConfig['mods'][key]['platforms'].includes(detectDeviceType())) {
                    if(backendConfig['mods'][key] === undefined || !backendConfig['mods'][key]['tags'].includes('visual')) { 
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
            
                        

            document.addEventListener("keydown", (event) => {
                this.keyDown(event)
                
            });
            document.addEventListener("keyup", (event) => {
                this.keyUp(event)
            });


            
            
            createModLoaderMenuBtn();
            document.getElementById("menu-button").click();

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
      
        keyUp(event) {
            
            
        },

        

        
      
        
        
        tick() {
            playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
            player = playerInstances[0];
            
            try {

                
                
            } catch (err) {
                console.log(err);
            }
        }
    };
  
    setTimeout(onFinishLoad, timers[0]);
})();