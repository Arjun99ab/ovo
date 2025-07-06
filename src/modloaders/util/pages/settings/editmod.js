import { backendConfig } from "../../../modloader.js";
import { createConfirmDeleteModal } from "../../modals.js";
import { renderSettingsMenu } from "./render.js";

export {createEditModPopup}


let createEditModPopup = (modId) => {
    //Create background div
    let editmodPopup = document.createElement("div");
    editmodPopup.id = "editmodPopup-bg";
    editmodPopup.className = "modloader-popups"

  
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
        width: "70%",
        minWidth: "20%",
        height: "80%",
        overflow: "auto",
        margin: "0",
        maxHeight: "90%",
        zIndex: "1002",
        
        // padding: "10px",
        borderRadius: "10px",
    };
    Object.keys(c).forEach(function (a) {
        editmodPopup.style[a] = c[a];
    });
  
    editmodPopup.onclick = (e) => {
      console.log("apple ^2")
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
  
    editmodPopup.appendChild(titleText);
  
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
        editmodPopup.remove();
        document.getElementById("menu-bg").style.pointerEvents = "auto";
        document.getElementById("menu-bg").style.filter = "none";
    }
    // navbar.appendChild(xButton);
    editmodPopup.appendChild(xButton);
  
    let modSettings = JSON.parse(localStorage.getItem('modSettings'));
  
    let settingsDiv = document.createElement("div");
    c = {
      display: "flex",
      // flex: "1",
      alignItems: "center",
      // justifyContent: "space-between",
      padding: "15px",
      // margin: "5px",
      flexDirection: "column",
      rowGap: "15px",
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

    
    let addModName = document.createElement("input");
    addModName.placeholder = "Mod Name";
    let d = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "90%",
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
    Object.keys(e).forEach(function (a) {
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
    addModDesc.rows = "7";
    addModDesc.cols = "50"; 
    let f = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "90%",
      height: "40%",
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
    Object.keys(f).forEach(function (a) {
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

    addModName.value = modSettings['mods'][modId].name;
    console.log(modSettings['mods'][modId])
    addModCode.value = modSettings['mods'][modId].url;
    addModDesc.value = modSettings['mods'][modId].desc.replace(/<br\/>/g, "\n");


    let buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    // buttonsContainer.style.flexWrap = "wrap";
    buttonsContainer.style.justifyContent = "space-around";
    buttonsContainer.style.alignItems = "center";
    // buttonsContainer.style.border = "solid 3px red";
    buttonsContainer.style.width = "100%";
    // buttonsContainer.style.alignItems = "center";
    
    // buttonsContainer.style.marginTop = "15px";
    // buttonsContainer.style.marginBottom = "10px";
    // buttonsContainer.style.gap = "10px";
    // buttonsContainer.style.position = "relative";

    // Create confirm button
    let saveButton = document.createElement("button");
    saveButton.innerHTML = "Save Settings";
    let g = {
        fontFamily: "Retron2000",
        fontSize: "14pt",
        backgroundColor: "rgb(45, 186, 47)",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
        borderRadius: "10px",
    }
    Object.keys(g).forEach(function (a) {
        saveButton.style[a] = g[a];
    });

    saveButton.onclick = function() {
        let modSettings = JSON.parse(localStorage.getItem('modSettings'));
        let modName = addModName.value;
        let modCode = addModCode.value;
        let modDesc = addModDesc.value;
        modSettings['mods'][modId].name = modName;
        modSettings['mods'][modId].url = modCode;
        modSettings['mods'][modId].desc = modDesc.replace(/\n/g, "<br/>");
        localStorage.setItem('modSettings', JSON.stringify(modSettings));
        editmodPopup.remove();
        // renderModsMenu(document.getElementById('filters-div'), document.getElementById('cards-div'));
        document.getElementById("menu-bg").style.pointerEvents = "auto";
        document.getElementById("menu-bg").style.filter = "none";
    }

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete Mod";
    let h = {
        fontFamily: "Retron2000",
        fontSize: "14pt",
        backgroundColor: "rgb(222, 48, 51)",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
        borderRadius: "10px",
    }
    Object.keys(h).forEach(function (a) {
        deleteButton.style[a] = h[a];
    });
    deleteButton.onclick = function() {
        createConfirmDeleteModal(modId);
        editmodPopup.remove();
    }


    // Append buttons to the buttons container
    buttonsContainer.appendChild(saveButton);
    buttonsContainer.appendChild(deleteButton);
    
    settingsDiv.appendChild(addModName); 
    settingsDiv.appendChild(addModCode);
    settingsDiv.appendChild(addModDesc);
    settingsDiv.appendChild(buttonsContainer);
    
    editmodPopup.appendChild(settingsDiv);
  
    document.body.appendChild(editmodPopup);
  }