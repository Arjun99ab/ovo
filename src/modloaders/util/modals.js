import { notify } from "./ovo.js";
import { toggleMod } from "./pages/mods/utils.js";
import { enableClick } from "./ovo.js";
export {modsPendingReload};
let modsPendingReload = [];

function createNotifyModal (text) {
    //Create background div
    let notifyBg = document.createElement("div");
    notifyBg.id = "notify-bg";
    notifyBg.className = "modloader-popups";

    let c = {
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
        zIndex: "1002",
    };
    Object.keys(c).forEach(function (a) {
      notifyBg.style[a] = c[a];
    });

    let infoText = document.createElement("div");
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

    infoText.innerHTML = text;
    
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
    c = {
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
    Object.keys(c).forEach(function (a) {
      okButton.style[a] = c[a];

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
function createChangelogPopup(changelog, userVersion, currentVersion, map) {
  //Create background div
  let changelogPopup = document.createElement("div");
  changelogPopup.addEventListener('wheel', (e) => {
    // console.log("hello)")
    e.stopImmediatePropagation()
    e.stopPropagation();
    // e.preventDefault();
    changelogPopup.focus();
  });
  changelogPopup.id = "changelogPopup-bg";
  changelogPopup.className = "modloader-popups";

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
      width: "40%",
      height: "auto",
      maxHeight: "80%",
      overflow: "auto",
      margin: "0",
      padding: "10px",
      borderRadius: "10px",
      zIndex: "1002",
  };
  Object.keys(c).forEach(function (a) {
    changelogPopup.style[a] = c[a];
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
  let newContent = document.createTextNode("Changelog");
  titleText.appendChild(newContent);

  changelogPopup.appendChild(titleText);

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
    changelogPopup.remove();
    document.getElementById("c2canvasdiv").style.filter = "none";
    enableClick(map);
  }
  // navbar.appendChild(xButton);
  changelogPopup.appendChild(xButton);

  let modSettings = JSON.parse(localStorage.getItem('modSettings'));
 
  

  let descText = document.createElement("div");
  descText.id = "descText";
  descText.style.fontSize = "1.5vw";
  descText.style.textAlign = "left";
  descText.style.margin = "10px";
  let changelogVersions = Object.keys(changelog);
  let currentVersionIndex = changelogVersions.indexOf(currentVersion);
  let userVersionIndex = changelogVersions.indexOf(userVersion);
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
  for(let i = currentVersionIndex; i > userVersionIndex; i--) {
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

function createConfirmDeleteModal(modId) {
  //Create background div
  let confirmBg = document.createElement("div");
  confirmBg.id = "confirm-delete-bg";
  confirmBg.className = "modloader-popups";


  let c = {
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
      zIndex: "1002",
  };
  Object.keys(c).forEach(function (a) {
      confirmBg.style[a] = c[a];
  });

  let infoText = document.createElement("div");
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

  let content = document.createTextNode("Are you sure you want to delete this mod?");
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
  confirmButton.style.borderRadius = "10px";
  confirmButton.onclick = function() {
      let modSettings = JSON.parse(localStorage.getItem('modSettings'));
      
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
  cancelButton.style.borderRadius = "10px";
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



function createConfirmReloadModal(modId) {
  //Create background div
  let confirmBg = document.createElement("div");
  confirmBg.id = "confirm-bg";
  confirmBg.className = "modloader-popups";

  let c = {
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
      zIndex: "1002",
  };
  Object.keys(c).forEach(function (a) {
      confirmBg.style[a] = c[a];
  });

  let infoText = document.createElement("div");
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

  let content = document.createTextNode("This mod requires a reload to disable. Would you like to reload now?");
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
  confirmButton.style.borderRadius = "10px";
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
  cancelButton.style.borderRadius = "10px";
  cancelButton.onclick = function() {
      console.log("cancel");

      confirmBg.remove();
      document.getElementById("menu-bg").style.pointerEvents = "auto";
      document.getElementById("menu-bg").style.filter = "none";
      document.getElementById("c2canvasdiv").style.filter = "none";

      modsPendingReload.push(modId)
      console.log(modsPendingReload)
      let enabledButton = document.getElementById(modId + "-enable-button");
      enabledButton.style.backgroundColor = "rgb(255, 255, 0)";
      enabledButton.innerHTML = "Reload";

      
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




export { createNotifyModal, createChangelogPopup, createConfirmDeleteModal, createConfirmReloadModal}