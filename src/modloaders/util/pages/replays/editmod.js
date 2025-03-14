import { backendConfig } from "../../../modloader.js";
import { createConfirmDeleteModal } from "../../modals.js";
import { loadReplayCompare } from "./render.js";
import { compareLevelQueue, setCompareLevelQueue, compressAndStoreInIndexedDB, convert_formated_hex_to_bytes } from "./utils.js";
import { loadReplayRows } from "./list.js";

export { createUploadPopup, createViewListPopup }

let createUploadPopup = () => {
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
        // minHeight: "50%",
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
      
      // dropdownContent.style.display = "none";
      // dropdownButton.blur();

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


    let dropdownRow = document.createElement("div");

    Object.keys(rowStyle).forEach(function (a) {
      dropdownRow.style[a] = rowStyle[a];
    });

    let dropdownText = document.createElement("p");
    dropdownText.innerHTML = "Version: ";
    dropdownText.style.fontSize = "1.8vw";
    dropdownText.style.margin = "0";
    dropdownText.style.padding = "0";


    let dropdown = document.createElement("div");
    dropdown.style.position = "relative";
    dropdown.style.display = "inline-block";
    dropdown.style.cursor = "pointer";
    dropdown.style.padding = "5px 10px";
    dropdown.style.backgroundColor = "#007bff";
    dropdown.style.color = "white";
    dropdown.style.borderRadius = "10px";
    dropdown.style.width = "fit-content";


    let dropdownText2 = document.createElement("p");
    dropdownText2.style.margin = "0";
    dropdownText2.style.padding = "0";
    dropdownText2.style.fontSize = "1.5vw";
    dropdownText2.innerHTML = "Select &#9660;";
    dropdown.appendChild(dropdownText2);
    // dropdown.style.fontSize = "1.5vw";


    let menu = document.createElement("div");
    menu.style.display = "none";
    menu.style.position = "absolute";
    menu.style.top = "100%";
    menu.style.left = "0";
    menu.style.background = "white";
    menu.style.border = "1px solid #ccc";
    menu.style.borderRadius = "5px";
    menu.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    menu.style.width = "100%";
    menu.style.fontSize = "1.1vw";
    dropdown.appendChild(menu);

    // let options = ["Option 1", "Option 2", "Option 3", "Option 4"];
    let options = ["1.4", "1.4.4", "1.4.3", "1.4.2", "1.4.1"];
    let replayVersion = null;

    options.forEach(option => {
      let item = document.createElement("div");
      item.class = "dropdown-item";
      item.innerText = option;
      item.style.color = "black";
      item.style.padding = "10px";
      item.style.cursor = "pointer";
      item.addEventListener("mouseover", () => item.style.background = "#f1f1f1");
      item.addEventListener("mouseout", () => item.style.background = "white");
      item.addEventListener("click", function() {
        // dropdown.firstChild.nodeValue = option;
        dropdown.firstChild.innerHTML = option + " &#9660;";
        menu.style.display = "none";
        replayVersion = option;
        console.log("option", option);
      });
      menu.appendChild(item);
    });


    dropdown.addEventListener("click", function(event) {
      // console.log(event.target);
      if(!event.target.classList.contains("dropdown-item")) { //make sure click is on top of the dropdown
        console.log("dropdown clicked");
        menu.style.display = (menu.style.display === "block") ? "none" : "block";
      }
    });

    menu.addEventListener("click", function() {
      console.log("menu clicked");
      menu.style.display = (menu.style.display === "block") ? "none" : "block";
    });

    settingsDiv.addEventListener("click", function(event) {
      console.log("hi")
      if (!dropdown.contains(event.target)) {
          menu.style.display = "none";
      }
    });

    dropdownRow.appendChild(dropdownText);
    dropdownRow.appendChild(dropdown);

    
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
    customLabel.style.fontSize = "1.5vw";
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
          try {
            JSON.parse(contents);
            console.log("Valid JSON");
            replayContents = contents;
            return;
          } catch (e) {
            console.log("invalid json, decompressing first")
          }
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
      compressAndStoreInIndexedDB(replayContents, replayName.value, replayDesc.value, replayVersion, replayTime).then((result) => {
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
    settingsDiv.appendChild(dropdownRow);
    settingsDiv.appendChild(uploadRow);
    settingsDiv.appendChild(saveButton);
    
    uploadPopup.appendChild(settingsDiv);
  
    document.body.appendChild(uploadPopup);
  }


  let createViewListPopup = () => {
    //Create background div
    let viewListPopup = document.createElement("div");
    viewListPopup.id = "viewList-bg";
    viewListPopup.className = "modloader-popups"

  
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
      viewListPopup.style[a] = c[a];
    });
  
    viewListPopup.onclick = (e) => {
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
    let newContent = document.createTextNode("Saved Replays");
    titleText.appendChild(newContent);
  
    viewListPopup.appendChild(titleText);
  
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
      viewListPopup.remove();
        document.getElementById("menu-bg").style.pointerEvents = "auto";
        document.getElementById("menu-bg").style.filter = "none";
    }
    // navbar.appendChild(xButton);
    viewListPopup.appendChild(xButton);
  
  
    let settingsDiv = document.createElement("div");
    c = {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      borderTop: "solid 3px black",
      height: "100%",
      overflowY: "scroll",
      overflowX: "hidden",
      scrollbarGutter: "stable",
      scrollbarWidth: "thin",
      // padding: "10px",
    };
    Object.keys(c).forEach(function (a) {
      settingsDiv.style[a] = c[a];
    });

    let allRowsSection = document.createElement("div");
    allRowsSection.style.width = "100%"
    // allRowsSection.style.border = "solid 2px red";
    
    let allRowsSectionHeader = document.createElement("h3");
    allRowsSectionHeader.style = "font-size: 2.5vw; border-bottom: solid 3.5px black; padding: 4px; text-align: center;";
    allRowsSectionHeader.innerHTML = "All Replays";
    allRowsSection.appendChild(allRowsSectionHeader);
    
    // allRowsSection.innerHTML = "<h3>All Rows</h3>";

    let selectedRowsSection = document.createElement("div");
    selectedRowsSection.style.width = "100%"

    let selectedRowsSectionHeader = document.createElement("h3");
    selectedRowsSectionHeader.style = "font-size: 2.5vw; border-bottom: solid 3.5px black; padding: 4px; text-align: center;";
    selectedRowsSectionHeader.innerHTML = "Selected Replays";
    selectedRowsSection.appendChild(selectedRowsSectionHeader);

    let allRowsDropArea = document.createElement("div");
    allRowsDropArea.style = "border: 2px dashed #ccc; padding: 10px; text-align: center; color: #999; font-size: 1.5vw;";
    allRowsDropArea.innerHTML = "Drag replays here";
    allRowsSection.appendChild(allRowsDropArea);

    let selectedRowsDropArea = document.createElement("div");
    selectedRowsDropArea.style = "border: 2px dashed #ccc; padding: 10px; text-align: center; color: #999; font-size: 1.5vw;";
    selectedRowsDropArea.innerHTML = "Drag replays here";
    selectedRowsSection.appendChild(selectedRowsDropArea);

    settingsDiv.appendChild(allRowsSection);
    settingsDiv.appendChild(selectedRowsSection);

    // function createRow(text) {
    //   let row = document.createElement("div");
    //   row.textContent = text;
    //   row.style = "padding: 5px; margin: 5px; background: lightgray; cursor: grab; border: 1px solid black;";
    //   row.draggable = true;

    //   row.addEventListener("onclick", function (e) {
    //     e.preventDefault();
    //     e.stopImmediatePropagation()
    //     e.stopPropagation();
    //     row.focus();
    //   });
    //   row.addEventListener('mousedown', (e) => {
    //     // console.log("please0")
    //     // e.preventDefault();
    //     e.stopImmediatePropagation()
    //     e.stopPropagation();
    //     row.focus();
    //     // settingLine.select();
    //   });

    //   row.addEventListener("ontouch", function (e) {
    //     console.log("ontouch")
    //     // e.preventDefault();
    //     e.stopImmediatePropagation()
    //     e.stopPropagation();
    //     row.focus();
    //   });


    //   row.addEventListener("dragstart", function (e) {
    //     console.log("dragstart", text);
    //     e.dataTransfer.setData("text/plain", row.textContent);
    //     // row.style.opacity = "0.5";
    //   });

    //   row.addEventListener("dragend", function () {
    //     console.log("dragend", text);
        
    //     row.style.opacity = "1";
    //   });

    //   return row;
    // }

    function makeDroppable(section) {
      section.addEventListener("dragover", function (e) {
        console.log("dragover")
        e.preventDefault();
      });

      section.addEventListener("drop", function (e) {
        console.log("drop")
        e.preventDefault();
        let text = e.dataTransfer.getData("text/plain");

        let replayObj = JSON.parse(text)


        let oldElement = document.getElementById("levelbox-" + replayObj.id);
        if (oldElement) {
          oldElement.remove();
        }
        section.appendChild(createViewListReplayRow(replayObj, false));


        
        // if (![...section.children].some(child => child.textContent === text)) {
        //   section.appendChild(createRow(text));
        // }
      });
    }

    makeDroppable(allRowsSection);
    makeDroppable(selectedRowsSection);

    // ["Row 1", "Row 2", "Row 3", "Row 4"].forEach(text => {
    //   allRowsSection.appendChild(createRow(text));
    // });

    settingsDiv.addEventListener('wheel', (e) => {
      // console.log("hello)")
      e.stopImmediatePropagation()
      e.stopPropagation();
      // e.preventDefault();
      settingsDiv.focus();
    });

    let localforage = window.localforage;
    var replayStore = localforage.createInstance({
        name: "replays"
    });
    let replayObjs = []
    replayStore.iterate(function(value, key, iterationNumber) {
        value["id"] = "replay" + iterationNumber
        replayObjs.push(value);
    }).then(function() {
        console.log(replayObjs);
        replayObjs["id"] = replayObjs.length;
        for (let i = 0; i < replayObjs.length; i++) {
            let replayObj = replayObjs[i];
            let ids = compareLevelQueue.map(obj => obj.id);
            console.log(ids);
            let levelBox = createViewListReplayRow(replayObj, ids.includes(replayObj.id));
            let levelQueue = compareLevelQueue;
            
            allRowsSection.appendChild(levelBox);
        }

        

        // loadReplayDetails(currentLevelObj);
        
    }).catch(function(err) {
        console.log(err);
    });


    
    viewListPopup.appendChild(settingsDiv);

    let saveReplays = document.createElement("div");
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
      saveReplays.style[a] = c[a];
    });
    saveReplays.id = "save-replays-btn";

    let saveButton = document.createElement("button");
    saveButton.innerHTML = "Save Selected"
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
      let levelQueue = [];

      document.querySelectorAll('.custom-checkbox').forEach((checkbox) => {
        console.log(checkbox.style.backgroundColor);
        if(checkbox.style.backgroundColor === "rgb(76, 175, 80)") {
          console.log("hi guys", checkbox.id)
          let id = checkbox.id.split("-")[1];
          let replayStore = localforage.createInstance({
              name: "replays"
          });
          replayStore.iterate(function(value, key, iterationNumber) {
          value["id"] = "replay" + iterationNumber
            console.log(value.id, id);
            if(value.id === id) {
              levelQueue.push(value);
              setCompareLevelQueue(levelQueue);
            }
          }).then(function() {
              console.log("saved", compareLevelQueue);
              loadReplayCompare();
              viewListPopup.remove();
              document.getElementById("menu-bg").style.pointerEvents = "auto";
              document.getElementById("menu-bg").style.filter = "none";
          }).catch(function(err) {
              console.log(err);
          });
        } else {
          console.log("no")
          setCompareLevelQueue(levelQueue);
          loadReplayCompare();
          viewListPopup.remove();
          document.getElementById("menu-bg").style.pointerEvents = "auto";
          document.getElementById("menu-bg").style.filter = "none";

        }
      });
      
    }

    saveReplays.appendChild(saveButton);
  
    viewListPopup.appendChild(saveReplays);
  
    document.body.appendChild(viewListPopup);
  }


  let createViewListReplayRow = (replayObj, replayInQueue) => {
    var levelBox = document.createElement("div");
    levelBox.className = "levelbox";
    levelBox.id = "levelbox-" + replayObj.id;
    let c = {
        width: "100%",
        height: "20%",
        // alignSelf: "flex-start",
        // maxHeight: "20%",
        borderBottom: "solid 2px black",
        // position: "relative",
        padding: "5px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        
        padding: "5px",
        cursor: "pointer",
    }
    Object.keys(c).forEach(function (a) {
        levelBox.style[a] = c[a];
    });

        

    

    let levelTitleText = document.createElement("div");
    c = {
        fontFamily: "Retron2000",
        color: "black",
        fontSize: "4vh",
        // cursor: "default",
        // border: "2px solid red",
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        textWrap: "wrap",
        
    };
    Object.keys(c).forEach(function (a) {
        levelTitleText.style[a] = c[a];
    });

    let newContent = document.createTextNode(
        replayObj.name
    );
    levelTitleText.appendChild(newContent);
    levelBox.appendChild(levelTitleText);


    let levelVersionText = document.createElement("div");
    c = {
        fontFamily: "Retron2000",
        color: "black",
        fontSize: "3vh",
        // cursor: "default",
        // border: "2px solid blue",
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        color: "grey",
    };
    Object.keys(c).forEach(function (a) {
        levelVersionText.style[a] = c[a];
    });

    levelVersionText.innerHTML = replayObj.version;
    levelBox.appendChild(levelVersionText);

    let levelTimeText = document.createElement("div");
    c = {
        fontFamily: "Retron2000",
        color: "black",
        fontSize: "3vh",
        // cursor: "default",
        // border: "2px solid blue",
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        color: "grey",
    };
    Object.keys(c).forEach(function (a) {
        levelTimeText.style[a] = c[a];
    });

    levelTimeText.innerHTML = replayObj.time;
    levelBox.appendChild(levelTimeText);

    let checkboxDiv = document.createElement("div");
    c = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    }
    Object.keys(c).forEach(function (a) {
        checkboxDiv.style[a] = c[a];
    });

    const customCheckbox = document.createElement('span');
    customCheckbox.className = 'custom-checkbox';
    customCheckbox.id = "customCheckbox-" + replayObj.id;
    let isChecked = replayInQueue;

    // Set up the initial style for the checkbox
    Object.assign(customCheckbox.style, {
        display: 'inline-block',
        width: '20px',
        height: '20px',
        backgroundColor: '#f0f0f0',
        border: '2px solid #999',
        borderRadius: '4px',
        position: 'relative',
        cursor: 'pointer'
        // alignItems: "center",
    });

    if (isChecked) {
        customCheckbox.style.backgroundColor = '#4caf50';
        customCheckbox.style.borderColor = '#4caf50';

        // Create and display the checkmark (if it doesn't exist)
        if (!customCheckbox.querySelector('.checkmark')) {
            const checkmark = document.createElement('div');
            checkmark.classList.add('checkmark');
            Object.assign(checkmark.style, {
                content: '""',
                position: 'absolute',
                left: '6px',
                top: '2px',
                width: '6px',
                height: '12px',
                border: 'solid white',
                borderWidth: '0 2px 2px 0',
                transform: 'rotate(45deg)',
                opacity: '1',
                transition: 'opacity 0.2s'
            });
            customCheckbox.appendChild(checkmark);
        }
    } else {
        customCheckbox.style.backgroundColor = '#f0f0f0';
        customCheckbox.style.borderColor = '#999';

        // Remove the checkmark if unchecked
        const checkmark = customCheckbox.querySelector('.checkmark');
        if (checkmark) {
            customCheckbox.removeChild(checkmark);
        }
    }

    // Add the click event listener to toggle the checkbox state
    customCheckbox.addEventListener('click', function () {
      isChecked = !isChecked;



      if (isChecked) {
          customCheckbox.style.backgroundColor = '#4caf50';
          customCheckbox.style.borderColor = '#4caf50';

          // Create and display the checkmark (if it doesn't exist)
          if (!customCheckbox.querySelector('.checkmark')) {
              const checkmark = document.createElement('div');
              checkmark.classList.add('checkmark');
              Object.assign(checkmark.style, {
                  content: '""',
                  position: 'absolute',
                  left: '6px',
                  top: '2px',
                  width: '6px',
                  height: '12px',
                  border: 'solid white',
                  borderWidth: '0 2px 2px 0',
                  transform: 'rotate(45deg)',
                  opacity: '1',
                  transition: 'opacity 0.2s'
              });
              customCheckbox.appendChild(checkmark);
          }
      } else {
          customCheckbox.style.backgroundColor = '#f0f0f0';
          customCheckbox.style.borderColor = '#999';

          // Remove the checkmark if unchecked
          const checkmark = customCheckbox.querySelector('.checkmark');
          if (checkmark) {
              customCheckbox.removeChild(checkmark);
          }
      }

      // Log the state
      console.log('Checkbox is checked:', isChecked);
  });

  checkboxDiv.appendChild(customCheckbox);
  levelBox.appendChild(checkboxDiv);

  levelBox.draggable = true;

  levelBox.addEventListener("onclick", function (e) {
    e.preventDefault();
    e.stopImmediatePropagation()
    e.stopPropagation();
    levelBox.focus();
  });
  levelBox.addEventListener('mousedown', (e) => {
    // console.log("please0")
    // e.preventDefault();
    e.stopImmediatePropagation()
    e.stopPropagation();
    levelBox.focus();
    // settingLine.select();
  });

  levelBox.addEventListener("ontouch", function (e) {
    console.log("ontouch")
    // e.preventDefault();
    e.stopImmediatePropagation()
    e.stopPropagation();
    levelBox.focus();
  });


  levelBox.addEventListener("dragstart", function (e) {
    console.log("dragstart");
    e.dataTransfer.setData("text/plain", JSON.stringify(replayObj));
    // levelBox.style.opacity = "0.5";
  });

  levelBox.addEventListener("dragend", function () {
    console.log("dragend", levelBox);

    
    levelBox.style.opacity = "1";
  });
    

  return levelBox;  
}