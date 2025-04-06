import { backendConfig } from "../../../modloader.js";
export {createDescPopup}

let createDescPopup = (modId) => {
    //Create background div
    let descPopup = document.createElement("div");
    descPopup.id = "descPopup-bg";
    descPopup.className = "modloader-popups"
  
    let c = {
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
        minWidth: "20%",
        height: "auto",
        overflow: "auto",
        margin: "0",
        padding: "10px",
        borderRadius: "10px",
        zIndex: "1002",
    };
    Object.keys(c).forEach(function (a) {
      descPopup.style[a] = c[a];
    });
  
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
  
    navbar.appendChild(document.createElement("div"));
  
    //Title
    let headerText = document.createElement("div");
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
      headerText.style[a] = c[a];
    });
  
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
        descPopup.remove();
        // enableClick(map);
        document.getElementById("menu-bg").style.pointerEvents = "auto";
        document.getElementById("menu-bg").style.filter = "none";
    }
    // navbar.appendChild(xButton);
    descPopup.appendChild(xButton);
  
    if(modId.startsWith("customMod")) {
      let modSettings = JSON.parse(localStorage.getItem('modSettings'));
      
      let titleText = document.createElement("p");
      titleText.style.fontSize = "2.3vw";
      titleText.style.textAlign = "center";
      titleText.innerHTML = modSettings['mods'][modId]['name'];
      headerText.appendChild(titleText);
      if(modSettings['mods'][modId]['author'] !== null) {
        let authorText = document.createElement("p");
        authorText.style.fontSize = "1.3vw";
        authorText.style.textAlign = "center";
        authorText.innerHTML = "by " + modSettings['mods'][modId]['author'];
        headerText.appendChild(authorText);
      }
      
      navbar.appendChild(headerText);
  
      
      descPopup.appendChild(navbar);
  
      let descText = document.createElement("div");
      descText.id = "descText";
      descText.innerHTML = modSettings['mods'][modId]['desc'];
      descText.style.fontSize = "1.5vw";
      descText.style.textAlign = "center";
      descText.style.margin = "15px";
  
      descPopup.appendChild(descText);
  
    } else {
      let titleText = document.createElement("p");
      titleText.style.fontSize = "2.3vw";
      titleText.style.textAlign = "center";
      titleText.innerHTML = backendConfig['mods'][modId]['name'];
      headerText.appendChild(titleText);
      if(backendConfig['mods'][modId]['author'] !== null) {
        let authorText = document.createElement("p");
        authorText.style.fontSize = "1.3vw";
        authorText.style.textAlign = "center";
        authorText.innerHTML = "by " + backendConfig['mods'][modId]['author'];
        headerText.appendChild(authorText);
      }
      
      navbar.appendChild(headerText);
  
      
      descPopup.appendChild(navbar);
  
      let descText = document.createElement("div");
      descText.id = "descText";
      descText.innerHTML = backendConfig['mods'][modId]['desc'];
      descText.style.fontSize = "1.5vw";
      descText.style.textAlign = "center";
      descText.style.margin = "15px";
  
      descPopup.appendChild(descText);
  
      if(modId === "taskeybinds") {
        let image = document.createElement("img");
        image.src = "../src/mods/modloader/taskeybinds.png";
        image.style.width = "50%";
        image.style.height = "auto";
        image.style.borderRadius = "10px";
        descPopup.appendChild(image);
      }
    }
  
    
  
    
  
    document.body.appendChild(descPopup);
  }