import { backendConfig } from "../../../modloader.js";
import { createConfirmDeleteModal } from "../../modals.js";
import { renderReplaysMenu } from "./render.js";
import { compressWithStream, decompressWithStream, compressAndStoreInIndexedDB, convert_formated_hex_to_bytes } from "./utils.js";

export {createUploadPopup}

let createUploadPopup = (modId) => {
    //Create background div
    let uploadPopup = document.createElement("div");
    uploadPopup.id = "uploadPopup-bg";
    uploadPopup.className = "modloader-popups"

  
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
        minWidth: "40%",
        height: "auto",
        overflow: "auto",
        margin: "0",
        maxHeight: "90%",
        zIndex: "1002",
        
        // padding: "10px",
        borderRadius: "10px",
    };
    Object.keys(c).forEach(function (a) {
      uploadPopup.style[a] = c[a];
    });
  
    uploadPopup.onclick = (e) => {
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
    let newContent = document.createTextNode("Upload Replay");
    titleText.appendChild(newContent);
  
    uploadPopup.appendChild(titleText);
  
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
      uploadPopup.remove();
        document.getElementById("menu-bg").style.pointerEvents = "auto";
        document.getElementById("menu-bg").style.filter = "none";
    }
    // navbar.appendChild(xButton);
    uploadPopup.appendChild(xButton);
  
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
      rowGap: "20px",
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
    addModName.placeholder = "Name";
    let d = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "55%",
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

    let addModDesc = document.createElement("input");
    addModDesc.placeholder = "Description";
    d = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "70%",
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
      addModDesc.style[a] = d[a];
    });
    addModDesc.onclick = (e) => { //ensure that input box focus
      // console.log("please");
      e.stopImmediatePropagation()
      e.stopPropagation();
      e.preventDefault();
      addModDesc.focus()
    }
    document.getElementById('menu-bg').onclick = (e) => { //ensure that input box focus
      // console.log("please");
      addModDesc.blur()
    }
    addModDesc.onkeydown = (e) => { // ensures that user is able to type in input box
      e.stopImmediatePropagation()
      e.stopPropagation();
      if(e.keyCode === 27) {
        addModDesc.blur();
      }
      if(e.keyCode === 13) {
        addModDesc.blur();
      } 
    };

    let replayContents = null;

    let uploadArea = document.createElement("input");
    uploadArea.type = "file";
    uploadArea.accept = ".ovo";
    c = {
      fontFamily: "Retron2000",
    }
    Object.keys(c).forEach(function (a) {
      uploadArea.style[a] = c[a];
    });
    
    uploadArea.addEventListener("change", (e) => {
      console.log(e.target.files[0]);
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = function(e) {
        let contents = e.target.result;
        console.log(contents);
        let hexList = convert_formated_hex_to_bytes(contents);
        console.log(hexList);
        let LZMA_WORKER = window.LZMA_WORKER;
        LZMA_WORKER.decompress(hexList, function on_decompress_complete(result) {
          console.log(result);
          replayContents = result;
          compressWithStream(result).then((result2) => {
            console.log(result2)
            for(let i = 0; i < result2.byteLength; i++) {
              console.log(result2[i]);
            }
            console.log(result2.byteLength);
            decompressWithStream(result2).then((result3) =>
              console.log(result3)
            )
          });
          compressAndStoreInIndexedDB(result, addModName.value, addModDesc.value).then((result) => {
            console.log(result);
          });

          // console.log(compressWithStream(result));
        });
        // LZMA_WORKER.compress("apple", 1, function(result) {
        //   console.log(result);
        //   LZMA_WORKER.decompress(result, function on_decompress_complete(result) {
        //     console.log(result);
        //   });
        // });
      }
      reader.readAsText(file);
    });

    // Create confirm button
    let saveButton = document.createElement("button");
    saveButton.innerHTML = "Save Replay";
    let g = {
        fontFamily: "Retron2000",
        fontSize: "14pt",
        backgroundColor: "rgb(45, 186, 47)",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
        borderRadius: "10px",
        alignItems: "center",
    }
    Object.keys(g).forEach(function (a) {
        saveButton.style[a] = g[a];
    });

    saveButton.onclick = function() {
      console.log("save replay");
      console.log(addModName.value);
      console.log(replayContents);
      // uploadPopup.remove();
      document.getElementById("menu-bg").style.pointerEvents = "auto";
      document.getElementById("menu-bg").style.filter = "none";
    }

    // let deleteButton = document.createElement("button");
    // deleteButton.innerHTML = "Delete Mod";
    // let h = {
    //     fontFamily: "Retron2000",
    //     fontSize: "14pt",
    //     backgroundColor: "rgb(222, 48, 51)",
    //     color: "white",
    //     border: "none",
    //     padding: "5px 10px",
    //     cursor: "pointer",
    //     borderRadius: "10px",
    // }
    // Object.keys(h).forEach(function (a) {
    //     deleteButton.style[a] = h[a];
    // });
    // deleteButton.onclick = function() {
    //     createConfirmDeleteModal(modId);
    //     uploadPopup.remove();
    // }


    // Append buttons to the buttons container
    // buttonsContainer.appendChild(saveButton);
    
    settingsDiv.appendChild(addModName); 
    settingsDiv.appendChild(addModDesc);
    settingsDiv.appendChild(uploadArea);
    settingsDiv.appendChild(saveButton);
    
    uploadPopup.appendChild(settingsDiv);
  
    document.body.appendChild(uploadPopup);
  }