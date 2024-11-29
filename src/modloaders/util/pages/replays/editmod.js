import { backendConfig } from "../../../modloader.js";
import { createConfirmDeleteModal } from "../../modals.js";
import { renderReplaysMenu } from "./render.js";
import { compressWithStream, decompressWithStream, compressAndStoreInIndexedDB, convert_formated_hex_to_bytes } from "./utils.js";
import { loadReplayRows } from "./list.js";

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
        minWidth: "50%",
        height: "auto",
        overflow: "auto",
        margin: "0",
        maxHeight: "85%",
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
      
      dropdownContent.style.display = "none";
      dropdownButton.blur();

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
  
  
    let settingsDiv = document.createElement("div");
    c = {
      display: "flex",
      // flex: "1",
      alignItems: "left",
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


    let replayNameRow = document.createElement("div");
    let rowStyle = {
      display: "flex",
      flexDirection: "row",
      // justifyContent: "space-between",
      alignItems: "center",
      margin: "5px",
      columnGap: "1.5vw",
      // rowGap: "5vh",
    }
    Object.keys(rowStyle).forEach(function (a) {
      replayNameRow.style[a] = rowStyle[a];
    });

    let replayNameText = document.createElement("p");
    replayNameText.innerHTML = "Name: ";
    replayNameText.style.fontSize = "1.8vw";
    replayNameText.style.margin = "0";
    replayNameText.style.padding = "0";
    
    let replayName = document.createElement("input");
    replayName.placeholder = "Name";
    let d = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "55%",
      height: "2.5vw",
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
      replayName.style[a] = d[a];
    });
    replayName.onclick = (e) => { //ensure that input box focus
      // console.log("please");
      e.stopImmediatePropagation()
      e.stopPropagation();
      e.preventDefault();
      replayName.focus()
    }
    document.getElementById('menu-bg').onclick = (e) => { //ensure that input box focus
      // console.log("please");
      replayName.blur()
    }
    replayName.onkeydown = (e) => { // ensures that user is able to type in input box
      e.stopImmediatePropagation()
      e.stopPropagation();
      if(e.keyCode === 27) {
        replayName.blur();
      }
      if(e.keyCode === 13) {
        replayName.blur();
      } 
    };

    replayNameRow.appendChild(replayNameText);
    replayNameRow.appendChild(replayName);


    let replayDescRow = document.createElement("div");
    Object.keys(rowStyle).forEach(function (a) {
      replayDescRow.style[a] = rowStyle[a];
    });

    let replayDescText = document.createElement("p");
    replayDescText.innerHTML = "Desc: ";
    replayDescText.style.fontSize = "1.8vw";
    replayDescText.style.margin = "0";
    replayDescText.style.padding = "0";

    let replayDesc = document.createElement("input");
    replayDesc.placeholder = "Description";
    d = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "70%",
      height: "2.5vw",
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
      replayDesc.style[a] = d[a];
    });
    replayDesc.onclick = (e) => { //ensure that input box focus
      // console.log("please");
      e.stopImmediatePropagation()
      e.stopPropagation();
      e.preventDefault();
      replayDesc.focus()
    }
    document.getElementById('menu-bg').onclick = (e) => { //ensure that input box focus
      // console.log("please");
      replayDesc.blur()

    }
    replayDesc.onkeydown = (e) => { // ensures that user is able to type in input box
      e.stopImmediatePropagation()
      e.stopPropagation();
      if(e.keyCode === 27) {
        replayDesc.blur();
      }
      if(e.keyCode === 13) {
        replayDesc.blur();
      } 
    };

    replayDescRow.appendChild(replayDescText);
    replayDescRow.appendChild(replayDesc);

    let versionDropdownRow = document.createElement("div");
    Object.keys(rowStyle).forEach(function (a) {
      versionDropdownRow.style[a] = rowStyle[a];
    });

    let versionDropdownText = document.createElement("p");
    versionDropdownText.innerHTML = "Version: ";
    versionDropdownText.style.fontSize = "1.8vw";
    versionDropdownText.style.margin = "0";
    versionDropdownText.style.padding = "0";

    // let versionDropdown = document.createElement("select");

    // let versionOption = document.createElement("option");
    // versionOption.value = "1.4.4";
    // versionOption.text = "1.4.4";
    // versionDropdown.appendChild(versionOption);
    // let versionOption2 = document.createElement("option");
    // versionOption2.value = "1.0.1";
    // versionOption2.text = "1.0.1";
    // versionDropdown.appendChild(versionOption2);

    // versionDropdown.onclick = (e) => { //ensure that input box focus
    //   console.log("please");
    //   e.stopImmediatePropagation()
    //   e.stopPropagation();
    //   e.preventDefault();
    //   versionDropdown.focus()
    // }

    let dropdownDiv = document.createElement("div");
    dropdownDiv.className = "dropdown";
    dropdownDiv.style.display = "inline-block";
    
    let dropdownButton = document.createElement("button");
    dropdownButton.className = "dropbtn";
    dropdownButton.innerHTML = "Dropdown";
    dropdownButton.onclick = (e) => {
      console.log("please")
      e.stopImmediatePropagation()
      e.stopPropagation();
      e.preventDefault();

      // document.getElementById("myDropdown").classList.toggle("show");
      document.getElementById("myDropdown").focus();
      document.getElementById("myDropdown").style.display = "block";
    }

    c = {
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
    Object.keys(c).forEach(function (a) {
      dropdownButton.style[a] = c[a];
    });

    let dropdownContent = document.createElement("div");
    dropdownContent.id = "myDropdown";
    dropdownContent.className = "dropdown-content";

    c = {
      display: "none",
      position: "absolute",
      backgroundColor: "#f1f1f1",
      minWidth: "160px",
      boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
      zIndex: "2000"
    }
    Object.keys(c).forEach(function (a) {
      dropdownContent.style[a] = c[a];
    });

    let versionOption = document.createElement("a");
    versionOption.innerHTML = "1.4.4";
    versionOption.onclick = (e) => {
      console.log("please")
      
      e.stopImmediatePropagation()
      e.stopPropagation();
      e.preventDefault();
      dropdownButton.innerHTML = "1.4.4";
      dropdownContent.style.display = "none";
    }


    let versionOption2 = document.createElement("a");
    versionOption2.innerHTML = "1.0.1";
    versionOption2.onclick = (e) => {
      console.log("please")
      
      e.stopImmediatePropagation()
      e.stopPropagation();
      e.preventDefault();
      dropdownButton.innerHTML = "1.0.1";
      dropdownContent.style.display = "none";
    }
    dropdownContent.appendChild(versionOption);
    dropdownContent.appendChild(versionOption2);

    c = {
      color: "black",
      padding: "12px 16px",
      textDecoration: "none",
      display: "block",
      cursor: "pointer",
    }
    Object.keys(c).forEach(function (a) {
      versionOption.style[a] = c[a];
      versionOption2.style[a] = c[a];
    });

    dropdownDiv.appendChild(dropdownButton);
    dropdownDiv.appendChild(dropdownContent);



    versionDropdownRow.appendChild(versionDropdownText);
    versionDropdownRow.appendChild(dropdownDiv);

    
    let uploadRow = document.createElement("div");
    Object.keys(rowStyle).forEach(function (a) {
      uploadRow.style[a] = rowStyle[a];
    });

    let uploadText = document.createElement("p");
    uploadText.innerHTML = "Replay File: ";
    uploadText.style.fontSize = "1.8vw";
    uploadText.style.margin = "0";
    uploadText.style.padding = "0";


    let uploadArea = document.createElement("input");
    uploadArea.type = "file";
    uploadArea.id = "uploadArea";
    uploadArea.accept = ".ovo";

    uploadArea.style.display = "none"; // Hide the input itself

    // Create the label
    let customLabel = document.createElement("label");
    customLabel.setAttribute("for", "uploadArea");
    customLabel.innerText = "Choose";

    // Apply styles to the label
    customLabel.style.display = "inline-block";
    customLabel.style.padding = "5px 10px";
    customLabel.style.fontSize = "14pt";
    // customLabel.style.fontWeight = "bold";
    customLabel.style.color = "#fff";
    customLabel.style.backgroundColor = "#007bff";
    customLabel.style.borderRadius = "10px";
    customLabel.style.cursor = "pointer";
    customLabel.style.textAlign = "center";
    customLabel.style.transition = "background-color 0.3s ease";
    // customLabel.style.border = "2px solid transparent";

    customLabel.addEventListener("mouseover", () => {
        customLabel.style.backgroundColor = "#0056b3";
    });

    customLabel.addEventListener("mouseout", () => {
        customLabel.style.backgroundColor = "#007bff";
    });

    customLabel.addEventListener("mousedown", () => {
        customLabel.style.backgroundColor = "#004085";
    });

    customLabel.addEventListener("mouseup", () => {
        customLabel.style.backgroundColor = "#0056b3";
    });

    // Add focus styles
    customLabel.addEventListener("focus", () => {
        customLabel.style.outline = "none";
        customLabel.style.borderColor = "#80bdff";
        customLabel.style.boxShadow = "0 0 5px rgba(0, 123, 255, 0.5)";
    });

    customLabel.addEventListener("blur", () => {
        customLabel.style.outline = "none";
        customLabel.style.borderColor = "transparent";
        customLabel.style.boxShadow = "none";
    });

    let fileInfo = document.createElement("div");
    fileInfo.id = "fileInfo";
    fileInfo.style.marginTop = "10px";
    fileInfo.style.fontSize = "12px";
    fileInfo.style.fontWeight = "bold";
    fileInfo.style.textAlign = "center";


    let replayContents = null;
    let replayTime = null;

    

    
    uploadArea.addEventListener("change", (e) => {
      console.log(e.target.files[0]);
      let file = e.target.files[0];
      if (file) {
        fileInfo.innerText = `${file.name}\n(${(file.size / 1024).toFixed(2)} KB)`;
        let reader = new FileReader();
        reader.onload = function(e) {
          let contents = e.target.result;
          console.log(contents);
          let hexList = convert_formated_hex_to_bytes(contents);
          console.log(hexList);
          let LZMA_WORKER = window.LZMA_WORKER;
          LZMA_WORKER.decompress(hexList, function on_decompress_complete(result) {
            console.log(result);
            let jsoned = JSON.parse(result);
            console.log(jsoned.data.at(-1));
            replayTime = jsoned.data.at(-1)[0][1];
            replayContents = result;
            // compressWithStream(result).then((result2) => {
            //   console.log(result2)
            //   for(let i = 0; i < result2.byteLength; i++) {
            //     console.log(result2[i]);
            //   }
            //   console.log(result2.byteLength);
            //   decompressWithStream(result2).then((result3) =>
            //     console.log(result3)
            //   )
            // });
            // compressAndStoreInIndexedDB(result, replayName.value, replayDesc.value).then((result) => {
            //   console.log(result);
            // });

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
      } else {
        fileInfo.innerText = "No file selected.";
      }
    });

    uploadRow.appendChild(uploadText);
    uploadRow.appendChild(uploadArea);
    uploadRow.appendChild(customLabel);
    uploadRow.appendChild(fileInfo);


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
        margin: "auto"
    }
    Object.keys(g).forEach(function (a) {
        saveButton.style[a] = g[a];
    });

    saveButton.onclick = function() {
      console.log("save replay");
      console.log(replayName.value);
      console.log(replayContents);
      compressAndStoreInIndexedDB(replayContents, replayName.value, replayDesc.value, "1.4.4", replayTime).then((result) => {
        console.log(result);
        loadReplayRows();
      });

      uploadPopup.remove();
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
    
    settingsDiv.appendChild(replayNameRow); 
    settingsDiv.appendChild(replayDescRow);
    settingsDiv.appendChild(versionDropdownRow);
    settingsDiv.appendChild(uploadRow);
    settingsDiv.appendChild(saveButton);
    
    uploadPopup.appendChild(settingsDiv);
  
    document.body.appendChild(uploadPopup);
  }