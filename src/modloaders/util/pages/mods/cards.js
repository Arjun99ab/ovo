import {toggleMod} from "./utils.js"
import {createDescPopup} from "./desc.js"
import {createModSettingsPopup} from "./settings.js"
import { createNotifyModal, createConfirmDeleteModal } from "../../modals.js"
import {backendConfig} from "../../../modloader.js"
import {modsPendingReload} from "../../modals.js"
import { createEditModPopup } from "./editmod.js"
import { renderModsMenu } from "./render.js"

export {createMenuCard, createCardButton, createToggleButton}

let createMenuCard = (id, name, iconurl, enabled) => {
    let menuCard = document.createElement("div");
    menuCard.id = id;
    console.log(menuCard.id)
    id = id.split("-")[0];
    // menuCard.innerHTML = text;
    let c = {
      
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      // alignItems: "center",
      // width: "100%",
      container: id + "/inline-size",

  
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
  
    
  
    let cardImage = document.createElement("img");
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
  
    let cardText = document.createElement("span");
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
      overflow: "hidden",
    }
    Object.keys(c).forEach(function (a) {
      cardText.style[a] = c[a];
    });

  
    let cardButtons = document.createElement("div");
    c = {
      display: "flex",
      flexWrap: "wrap",  
      justifyContent: "flex-end",
    }
    Object.keys(c).forEach(function (a) {
      cardButtons.style[a] = c[a];
    });
    
    let topCards = document.createElement("div"); 
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
    let editmodButton;
    let settingsButton;
    let infoButton = createCardButton(id + "-info-btn", "../src/img/modloader/card/info.png", "calc(100%/3)");
    if(id.startsWith("customMod")) {
      editmodButton = createCardButton(id + "-editmod-btn", "../src/img/modloader/card/settings.png", "calc(100%/3)");
    } else {
      settingsButton = createCardButton(id + "-settings-btn", "../src/img/modloader/card/settings.png", "calc(100%/3)");
      if(backendConfig['mods'][id]['settings'] === null) {
        settingsButton.style.background = "url(../src/img/modloader/card/settingsdisabled.png)";
        settingsButton.style.backgroundSize = "2.5vw"; //or 50% 
        settingsButton.style.backgroundRepeat = "no-repeat";
        settingsButton.style.backgroundPosition= "center";
        settingsButton.style.cursor = "not-allowed";
      }
    }
    let favoriteButton = createCardButton(id + "-favorites-btn", "../src/img/modloader/card/notfavorite.png", "calc(100%/3)");
    if(JSON.parse(localStorage.getItem('modSettings'))['mods'][id]['favorite']) {
      favoriteButton.style.background = "url(../src/img/modloader/card/favorite.png)";
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
      topCards.appendChild(editmodButton);
    } else {
      topCards.appendChild(settingsButton);
    }
    topCards.appendChild(favoriteButton);
    cardButtons.appendChild(topCards);
    
  
    let bottomCards = document.createElement("div"); 
    c = {
      display: "flex",
      flex: "1",
      // justifyContent: "space-between",
      // padding: "5px",
    }
    Object.keys(c).forEach(function (a) {
      bottomCards.style[a] = c[a];
    });
    let enabledButton;
    console.log(id, modsPendingReload)
    if(modsPendingReload.includes(id)) {
      enabledButton = createToggleButton("button4", "Reload", "100%");
      enabledButton.style.backgroundColor = "rgb(255, 255, 0)"; //yellow
    } else {
      if(enabled) {
        enabledButton = createToggleButton("button4", "Enabled", "100%");
        enabledButton.style.backgroundColor = "rgb(45, 186, 47)"; //lightgreen
      } else {
        enabledButton = createToggleButton("button4", "Disabled", "100%");
        enabledButton.style.backgroundColor = "rgb(222, 48, 51)";
      }
    }
    enabledButton.style.gridArea = "b4";
    enabledButton.style.border = "none";
    enabledButton.style.borderRadius = "0px 0px 10px 10px";
    enabledButton.id = id + "-enable-button";
    enabledButton.onclick = function() {
      
      console.log("clicked")
      // console.log(JSON.parse(localStorage.getItem('modSettings'))['mods'][id]['enabled'])
      if(modsPendingReload.includes(id)) {
        let modSettings = JSON.parse(localStorage.getItem('modSettings'));
        modSettings['mods'][id]["enabled"] = false;
        localStorage.setItem('modSettings', JSON.stringify(modSettings));
        location.reload()
      } else {
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
    }
    
    bottomCards.appendChild(enabledButton);
    cardButtons.appendChild(bottomCards);
  
    menuCard.appendChild(cardImage);
    menuCard.appendChild(cardText);
    menuCard.appendChild(cardButtons);  
  
    return menuCard;
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
      backgroundColor: "black",
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
    // if(backendConfig['mods'][id.split("-")[0]]['settings'] === null) {//no settings available
    //   cardButton.style.opacity = "0.5";
    // }
    cardButton.onclick = function() {
      let type = id.split("-")[1];
      if(type === "info") {
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createDescPopup(id.split("-")[0]);
      } else if(type === "settings") {
        if(backendConfig['mods'][id.split("-")[0]]['settings'] !== null) {
          document.getElementById("menu-bg").style.pointerEvents = "none";
          document.getElementById("menu-bg").style.filter = "blur(1.2px)";
          // console.log(id.split("-")[0])
          createModSettingsPopup(id.split("-")[0]);
        } else {
          document.getElementById("menu-bg").style.pointerEvents = "none";
          document.getElementById("menu-bg").style.filter = "blur(1.2px)";
          createNotifyModal("This mod doesn't have any settings.")
        }
      } else if(type === "favorites") {
        console.log(JSON.parse(localStorage.getItem('modSettings'))['mods'][id.split("-")[0]]['favorite'])
        if(!JSON.parse(localStorage.getItem('modSettings'))['mods'][id.split("-")[0]]['favorite']) {
          document.getElementById(id).style.background = "url(../src/img/modloader/card/favorite.png)";
          document.getElementById(id).style.backgroundSize = "2.5vw";
          document.getElementById(id).style.backgroundRepeat = "no-repeat";
          document.getElementById(id).style.backgroundPosition = "center";
          let modSettings = JSON.parse(localStorage.getItem('modSettings'));
          modSettings['mods'][id.split("-")[0]]["favorite"] = true;
          localStorage.setItem('modSettings', JSON.stringify(modSettings));

        } else {
          document.getElementById(id).style.background = "url(../src/img/modloader/card/notfavorite.png)";
          document.getElementById(id).style.backgroundSize = "2.5vw";
          document.getElementById(id).style.backgroundRepeat = "no-repeat";
          document.getElementById(id).style.backgroundPosition = "center";
          let modSettings = JSON.parse(localStorage.getItem('modSettings'));
          modSettings['mods'][id.split("-")[0]]["favorite"] = false;
          localStorage.setItem('modSettings', JSON.stringify(modSettings));

        }

      } else if(type === "editmod") {
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createEditModPopup(id.split("-")[0]);
      }
    }
    return cardButton;
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