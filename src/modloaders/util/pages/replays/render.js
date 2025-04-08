import { runtime, version, filters, backendConfig } from "../../../modloader.js";
import { createNotifyModal } from "../../modals.js";
import { detectDeviceType } from "../../utils.js";
import { compareLevelQueue, setCompareLevelQueue, currentLevelObj, decompressWithStream, compressedToLZMA, decompressMultipleWithStream } from "./utils.js";
import { createEditPopup, createUploadPopup, createViewListPopup } from "./editmod.js";
import { loadReplayRows } from "./list.js";
import { createModSettingsPopup } from "./settings.js";

export { renderReplaysMenu, loadReplayDetails, loadReplayCompare };

function convert_formated_hex_to_bytes(hex_str) {
  var count = 0,
      hex_arr,
      hex_data = [],
      hex_len,
      i;
  
  if (hex_str.trim() === "") {
      return [];
  }
  
  /// Check for invalid hex characters.
  if (/[^0-9a-fA-F\s]/.test(hex_str)) {
      return false;
  }
  
  hex_arr = hex_str.split(/([0-9a-fA-F]+)/g);
  hex_len = hex_arr.length;
  
  for (i = 0; i < hex_len; ++i) {
      if (hex_arr[i].trim() === "") {
          continue;
      }
      hex_data[count++] = parseInt(hex_arr[i], 16);
  }
  
  return hex_data;
}

let renderReplaysMenu = (sectionDiv) => {

  while (sectionDiv.firstChild) {
    sectionDiv.removeChild(sectionDiv.lastChild);
  }

  let mainDiv = document.createElement("div");
  let c = {
    // border: "2px solid red",
    width: "60%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    // rowGap: "0px",
    // justifyContent: "space-between",
    alignItems: "center",
    overflowY: "auto",
    overflowX: "hidden",
    // borderTop: "2px solid black",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
  }
  Object.keys(c).forEach(function (a) {
    mainDiv.style[a] = c[a];
  });
      
  mainDiv.id = "main-div";
  


  let replayRightDiv = document.createElement("div");
  c = {
    // border: "2px solid red",
    width: "40%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderLeft: "2px solid black",
    // rowGap: "0px",
    // justifyContent: "space-between",
    // alignItems: "center",
  }

  Object.keys(c).forEach(function (a) {
    replayRightDiv.style[a] = c[a];
  });

  
      
  let replaysListDiv = document.createElement("div");
  replaysListDiv.addEventListener('wheel', (e) => {
    // console.log("hello)")
    e.stopImmediatePropagation()
    e.stopPropagation();
    // e.preventDefault();
    replaysListDiv.focus();
  });
  replaysListDiv.id = "replays-list-div";

  c = {
    display: "flex",
    flexWrap: "wrap",
    alignContent: "flex-start",
    // flexDirection: "column", 
    // width: "40%",
    height: "90%",
    // maxHeight: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    // borderTop: "2px solid black",
    // borderLeft: "2px solid black",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    rowGap: "0px"
  };
  Object.keys(c).forEach(function (a) {
    replaysListDiv.style[a] = c[a];
  });

  replayRightDiv.appendChild(replaysListDiv);

  let buttonContainer = document.createElement("div");
  buttonContainer.style.position = "sticky";
  buttonContainer.style.bottom = "0";
  buttonContainer.style.width = "100%";
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-around";
  buttonContainer.style.backgroundColor = "white";
  buttonContainer.style.padding = "5px 0";
  buttonContainer.style.borderTop = "2px solid black";
  buttonContainer.style.height = "15%";

  let uploadButtonDiv = document.createElement("div");
  uploadButtonDiv.style.display = "flex";
  uploadButtonDiv.style.flexDirection = "column";
  uploadButtonDiv.style.rowGap = "1px";
  uploadButtonDiv.style.alignItems = "center";
  uploadButtonDiv.style.justifyContent = "center";
  uploadButtonDiv.style.width = "100%";
  uploadButtonDiv.style.height = "100%";
  uploadButtonDiv.style.padding = "3px";
  uploadButtonDiv.style.borderRadius = "10px";

  let uploadButton = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    // fontSize: "3vh",
    // backgroundColor: "rgb(45, 186, 47)",
    color: "black",
    border: "none",
    // padding: "5px",
    cursor: "pointer",
    borderRadius: "10px",
    height: "7vh",
    width: "7vh",
    // border: "2px solid red",
    background: "url(../src/img/modloader/replay/upload.png)",
    backgroundSize: "contain", //i love contain omg 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
  Object.keys(c).forEach(function (a) {
    uploadButton.style[a] = c[a];
  });

  uploadButton.onclick = function() {
    document.getElementById("menu-bg").style.pointerEvents = "none";
    document.getElementById("menu-bg").style.filter = "blur(1.2px)";
    createUploadPopup();
  }
  

  let uploadButtonLabel = document.createElement("span");
  uploadButtonLabel.innerText = "Upload";
  uploadButtonLabel.style.fontFamily = "Retron2000";
  uploadButtonLabel.style.fontSize = "2vh";
  uploadButtonLabel.style.color = "black";

  uploadButtonDiv.appendChild(uploadButton);
  uploadButtonDiv.appendChild(uploadButtonLabel);



  let settingsButtonDiv = document.createElement("div");
  settingsButtonDiv.style.display = "flex";
  settingsButtonDiv.style.flexDirection = "column";
  settingsButtonDiv.style.rowGap = "1px";
  settingsButtonDiv.style.alignItems = "center";
  settingsButtonDiv.style.justifyContent = "center";
  settingsButtonDiv.style.width = "100%";
  settingsButtonDiv.style.height = "100%";
  settingsButtonDiv.style.padding = "3px";
  settingsButtonDiv.style.borderRadius = "10px";

  let settingsButton = document.createElement("button");
  c["background"] = "url(../src/img/modloader/replay/settings.png)";
  Object.keys(c).forEach(function (a) {
    settingsButton.style[a] = c[a];
  });

  settingsButton.onclick = function() {
    document.getElementById("menu-bg").style.pointerEvents = "none";
    document.getElementById("menu-bg").style.filter = "blur(1.2px)";
    // createModSettingsPopup("flymod");
    createNotifyModal("Settings are not available yet.");
  }

  let settingsButtonLabel = document.createElement("span");
  settingsButtonLabel.innerText = "Settings";
  settingsButtonLabel.style.fontFamily = "Retron2000";
  settingsButtonLabel.style.fontSize = "2vh";
  settingsButtonLabel.style.color = "black";

  settingsButtonDiv.appendChild(settingsButton);
  settingsButtonDiv.appendChild(settingsButtonLabel);


  buttonContainer.appendChild(uploadButtonDiv);
  buttonContainer.appendChild(settingsButtonDiv);

  replayRightDiv.appendChild(buttonContainer);


  let replayDetailsDiv = document.createElement("div");
  replayDetailsDiv.id = "replay-details-div";
  c = {
    display: "flex",
    flexDirection: "column",
    // rowGap: "0px",
    // justifyContent: "space-between",
    // alignItems: "center",
    // borderBottom: "2px solid blue",
    height: "65%",
    width: "100%",
  }
  Object.keys(c).forEach(function (a) {
    replayDetailsDiv.style[a] = c[a];
  });
  mainDiv.appendChild(replayDetailsDiv);



  let replayProgressDiv = document.createElement("div");
  replayProgressDiv.id = "replay-progress-div";
  c = {
    display: "flex",
    flexDirection: "column",
    // rowGap: "0px",
    justifyContent: "space-around",
    alignItems: "center",
    borderTop: "2px solid black",
    height: "35%",
    width: "100%",
  }
  Object.keys(c).forEach(function (a) {
    replayProgressDiv.style[a] = c[a];
  });
  // mainDiv.appendChild(replayProgressDiv);

  



  // let navbar = document.createElement("nav");
  
  // c = {
  //   display: "flex",
  //   // flex: "0 0 auto",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   padding: "5px",
  //   // position: "relative",
  //   // backgroundColor: "#f2f2f2",
  // }
  // Object.keys(c).forEach(function (a) {
  //     navbar.style[a] = c[a];
  // });
  // navbar.id = "navbar";

  // navbar.appendChild(document.createElement("div"));

  //Title
  

  // replayDetailsDiv.appendChild(navbar);

  let replayDetailsDivs = document.createElement("div");
  replayDetailsDivs.id = "replay-details-divs";
  c = {
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "row",
    // rowGap: "0px",
    // justifyContent: "space-between",
    alignItems: "center",
    // flexWrap: "wrap",
  }
  Object.keys(c).forEach(function (a) {
    replayDetailsDivs.style[a] = c[a];
  });
  
  

  

  let replayDetailsDescDiv = document.createElement("div");
  replayDetailsDescDiv.id = "replay-details-desc-div";

  





  let replayDetailsButtonsDiv = document.createElement("div");
  replayDetailsButtonsDiv.id = "replay-details-buttons-div";
  c = {
    display: "flex",
    // flex: "1 1 auto",
    flexDirection: "column",
    // rowGap: "0px",
    // justifyContent: "space-around",
    // padding: "10px",
    alignItems: "center",
    borderLeft: "2px solid black",
    borderTop: "2px solid black",
    borderRadiusTopLeft: "10px",
    
    height: "100%",
    width: "35%",
    color: "black",
  }
  Object.keys(c).forEach(function (a) {
    replayDetailsButtonsDiv.style[a] = c[a];
  });

  replayDetailsDivs.appendChild(replayDetailsDescDiv);
  

  let raceReplayContainer = document.createElement("div");
  c = {
    display: "flex",
    flexDirection: "row",
    // rowGap: "0px",
    // justifyContent: "space-around",
    // padding: "10px",
    alignItems: "center",
    // border: "2px solid orange",
    height: "33%",
    width: "100%",
    // color: "black",
  }
  Object.keys(c).forEach(function (a) {
    raceReplayContainer.style[a] = c[a];
  });

  let raceButtonDiv = document.createElement("div");
  let b = {
    display: "flex",
    flexDirection: "column",
    rowGap: "1px",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    padding: "3px",
    borderRadius: "10px",
    // border: "2px solid red",

  }
  Object.keys(b).forEach(function (a) {
    raceButtonDiv.style[a] = b[a];
  });

  let raceButton = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    // fontSize: "3vh",
    // backgroundColor: "rgb(45, 186, 47)",
    color: "black",
    border: "none",
    // padding: "5px",
    cursor: "pointer",
    // borderRadius: "10px",
    height: "7vh",
    width: "7vh",
    // border: "2px solid green",
    background: "url(../src/img/modloader/replay/race.png)",
    backgroundSize: "contain", //or 50% 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
  Object.keys(c).forEach(function (a) {
    raceButton.style[a] = c[a];
  });
  // raceButton.innerHTML = "Race";
  raceButton.onclick = function() {
    let replayData = currentLevelObj.replay;
    decompressWithStream(replayData).then((data) => {
        console.log(data);
        let replay = JSON.parse(data);
        let levelName = replay.data[replay.data.length - 1][1][1]
        //launch level in individual level mode
        runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[3] = 1
        runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[21] = 1
        // runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[22] = 1

        runtime.changelayout = runtime.layouts[levelName];
        window["beginRacing"](replay, currentLevelObj);
        // replay.play();
    }); //add error handling
    document.getElementById("x-button").click();
  }

  let raceButtonLabel = document.createElement("span");
  raceButtonLabel.innerText = "Race";
  raceButtonLabel.style.fontFamily = "Retron2000";
  raceButtonLabel.style.fontSize = "2vh";
  raceButtonLabel.style.color = "black";

  raceButtonDiv.appendChild(raceButton);
  raceButtonDiv.appendChild(raceButtonLabel);

  let downloadButtonDiv = document.createElement("div");
  
  Object.keys(b).forEach(function (a) {
    downloadButtonDiv.style[a] = b[a];
  });

  let downloadButton = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    // fontSize: "3vh",
    // backgroundColor: "rgb(45, 186, 47)",
    color: "black",
    border: "none",
    // padding: "5px",
    cursor: "pointer",
    // borderRadius: "10px",
    height: "7vh", //34%
    width: "7vh", //100%
    // borderBottom: "2px solid green",
    background: "url(../src/img/modloader/replay/download.png)",
    backgroundSize: "contain", //or 50% 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
  Object.keys(c).forEach(function (a) {
    downloadButton.style[a] = c[a];
  });
  // compareButton.innerHTML = "Compare";

  downloadButton.onclick = function() {
    // let currentQueue = compareLevelQueue;
    // currentQueue.push(currentLevelObj);
    // setCompareLevelQueue(currentQueue);
    
    // loadReplayCompare();
    compressedToLZMA(currentLevelObj.name, currentLevelObj.replay)
    
  }

  let downloadButtonLabel = document.createElement("span");
  downloadButtonLabel.innerText = "Download";
  downloadButtonLabel.style.fontFamily = "Retron2000";
  downloadButtonLabel.style.fontSize = "2vh";
  downloadButtonLabel.style.color = "black";

  downloadButtonDiv.appendChild(downloadButton);
  downloadButtonDiv.appendChild(downloadButtonLabel);



  

  raceReplayContainer.appendChild(raceButtonDiv);
  raceReplayContainer.appendChild(downloadButtonDiv);



  let replayButtonDiv = document.createElement("div");
  let b_add = {
    display: "flex",
    flexDirection: "column",
    rowGap: "1px",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "34%",
    padding: "3px",
    borderRadius: "10px",
    // border: "2px solid red",

  }
  Object.keys(b_add).forEach(function (a) {
    replayButtonDiv.style[a] = b_add[a];
  });

  let replayButton = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    fontSize: "3vh",
    // backgroundColor: "rgb(45, 186, 47)",
    color: "black",
    border: "none",
    // padding: "5px",
    cursor: "pointer",
    // borderRadius: "10px",
    height: "7vh",
    width: "7vh",
    // border: "2px solid green",
    background: "url(../src/img/modloader/replay/replay.png)",
    backgroundSize: "contain", //or 50% 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
  Object.keys(c).forEach(function (a) {
    replayButton.style[a] = c[a];
  });


  // replayButton.innerHTML = "Replay";

  replayButton.onclick = function() {
    let replayData = currentLevelObj.replay;
    decompressWithStream(replayData).then((data) => {
        // console.log(data);
        let replay = JSON.parse(data);
        let levelName = replay.data[replay.data.length - 1][1][1]
        //launch level in individual level mode
        runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[3] = 1
        // runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[18] = 1

        runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[21] = 1
        // runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[22] = 1
        // if(runtime.running_layout.name === replay.data[replay.data.length - 1][1][1]) {
        //   c2_callFunction("Menu > Transition", ['Level Menu']);
        // } 
        runtime.changelayout = runtime.layouts[levelName];
        // runtime.changelayout = runtime.running_layout;
        // var i, len, g;
        // for (i = 0, len = runtime.allGroups.length; i < len; i++)
        // {
        //   g = runtime.allGroups[i];
        //   g.setGroupActive(g.initially_activated);
        // }
        
        window["beginReplay"](replay);
        // replay.play();
    }); //add error handling
    document.getElementById("x-button").click();
  }

  let replayButtonLabel = document.createElement("span");
  replayButtonLabel.innerText = "Replay";
  replayButtonLabel.style.fontFamily = "Retron2000";
  replayButtonLabel.style.fontSize = "2vh";
  replayButtonLabel.style.color = "black";

  replayButtonDiv.appendChild(replayButton);
  replayButtonDiv.appendChild(replayButtonLabel);

  

  let replayActions = document.createElement("div");
  c = {
    display: "flex",
    flexDirection: "row",
    // rowGap: "0px",
    // justifyContent: "space-around",
    // padding: "10px",
    alignItems: "center",
    // border: "2px solid orange",
    height: "34%",
    width: "100%",
    // color: "black",
  }
  Object.keys(c).forEach(function (a) {
    replayActions.style[a] = c[a];
  });


  let editButtonDiv = document.createElement("div");
  Object.keys(b).forEach(function (a) {
    editButtonDiv.style[a] = b[a];
  });

  let editButton = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    // fontSize: "3vh",
    backgroundColor: "white",
    color: "black",
    border: "none",
    // padding: "5px",
    cursor: "pointer",
    // borderRadius: "10px",
    height: "7vh",
    width: "7vh",
    // border: "2px solid red",
    background: "url(../src/img/modloader/replay/edit.png)",
    backgroundSize: "contain", //or 50% 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
  Object.keys(c).forEach(function (a) {
    editButton.style[a] = c[a];
  });
  
  editButton.onclick = function() {
    document.getElementById("menu-bg").style.pointerEvents = "none";
    document.getElementById("menu-bg").style.filter = "blur(1.2px)";
    createEditPopup(currentLevelObj);
  }

  let editButtonLabel = document.createElement("span");
  editButtonLabel.innerText = "Edit";
  editButtonLabel.style.fontFamily = "Retron2000";
  editButtonLabel.style.fontSize = "2vh";
  editButtonLabel.style.color = "black";

  editButtonDiv.appendChild(editButton);
  editButtonDiv.appendChild(editButtonLabel);

  
  let deleteButtonDiv = document.createElement("div");
  Object.keys(b).forEach(function (a) {
    deleteButtonDiv.style[a] = b[a];
  });

  let deleteButton = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    // fontSize: "3vh",
    backgroundColor: "black",
    color: "black",
    border: "none",
    // padding: "5px",
    cursor: "pointer",
    // borderRadius: "10px",
    height: "7vh",
    width: "7vh",
    // border: "2px solid red",
    background: "url(../src/img/modloader/replay/delete.png)",
    backgroundSize: "contain", //or 50% 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
  Object.keys(c).forEach(function (a) {
    deleteButton.style[a] = c[a];
  });

  deleteButton.onclick = function() {
    let localforage = window.localforage;
    var replayStore = localforage.createInstance({
        name: "replays"
    });
    console.log(currentLevelObj);
    replayStore.removeItem(currentLevelObj.id).then(function() {
      console.log('Item was removed');
      loadReplayRows();
    }).catch(function(err) {
      console.log(err);
    });
  }

  let deleteButtonLabel = document.createElement("span");
  deleteButtonLabel.innerText = "Delete";
  deleteButtonLabel.style.fontFamily = "Retron2000";
  deleteButtonLabel.style.fontSize = "2vh";
  deleteButtonLabel.style.color = "black";

  deleteButtonDiv.appendChild(deleteButton);
  deleteButtonDiv.appendChild(deleteButtonLabel);



  replayActions.appendChild(editButtonDiv);
  replayActions.appendChild(deleteButtonDiv);

  replayDetailsButtonsDiv.appendChild(raceReplayContainer);
  replayDetailsButtonsDiv.appendChild(replayButtonDiv);
  replayDetailsButtonsDiv.appendChild(replayActions);


  replayDetailsDivs.appendChild(replayDetailsButtonsDiv);


  replayDetailsDiv.appendChild(replayDetailsDivs);





  

  // let playButton = document.createElement("button");
  // c = {
  //   fontFamily: "Retron2000",
  //   fontSize: "14pt",
  //   backgroundColor: "rgb(45, 186, 47)",
  //   color: "white",
  //   border: "none",
  //   padding: "5px 10px",
  //   cursor: "pointer",
  //   borderRadius: "10px",
  // }
  // Object.keys(c).forEach(function (a) {
  //   playButton.style[a] = c[a];
  // });
  // playButton.innerHTML = "Play";
  // // Create cancel button
  // let stopButton = document.createElement("button");
  // c = {
  //   fontFamily: "Retron2000",
  //   fontSize: "14pt",
  //   backgroundColor: "rgb(222, 48, 51)",
  //   color: "white",
  //   border: "none",
  //   padding: "5px 10px",
  //   cursor: "pointer",
  //   borderRadius: "10px",
  // }
  // Object.keys(c).forEach(function (a) {
  //   stopButton.style[a] = c[a];
  // });
  // stopButton.innerHTML = "Stop";


  // // Append buttons to the buttons container
  // // buttonsContainer.appendChild(playButton);
  // mainDiv.appendChild(stopButton);
  // // mainDiv.appendChild(buttonsContainer);


  // let buttonsContainer = document.createElement("div");
  // c = {
  //   display: "flex",
  //   flexWrap: "wrap",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: "15px",
  //   marginBottom: "10px",
  //   gap: "10px",
  // }
  // Object.keys(c).forEach(function (a) {
  //   buttonsContainer.style[a] = c[a];
  // });


  // let settingsButton = document.createElement("button");
  // c = {
  //   fontFamily: "Retron2000",
  //   fontSize: "14pt",
  //   backgroundColor: "rgb(45, 186, 47)",
  //   color: "white",
  //   border: "none",
  //   padding: "5px 10px",
  //   cursor: "pointer",
  //   borderRadius: "10px",
  // }
  // Object.keys(c).forEach(function (a) {
  //   settingsButton.style[a] = c[a];
  // });
  // settingsButton.innerHTML = "Settings";
  // // Create cancel button
  // buttonsContainer.appendChild(settingsButton);

  // let uploadButton = document.createElement("button");
  // c = {
  //   fontFamily: "Retron2000",
  //   fontSize: "14pt",
  //   backgroundColor: "rgb(45, 186, 47)",
  //   color: "white",
  //   border: "none",
  //   padding: "5px 10px",
  //   cursor: "pointer",
  //   borderRadius: "10px",
  //   // marginTop: "15px",
  //   // marginBottom: "10px",
  // }
  // Object.keys(c).forEach(function (a) {
  //   uploadButton.style[a] = c[a];
  // });
  // uploadButton.innerHTML = "Upload";

  // uploadButton.onclick = function() {
  //   document.getElementById("menu-bg").style.pointerEvents = "none";
  //   document.getElementById("menu-bg").style.filter = "blur(1.2px)";
  //   createUploadPopup("upload");
  // }

  // // Create cancel button
  // buttonsContainer.appendChild(uploadButton);

  // mainDiv.appendChild(buttonsContainer);


  let replayCompareDiv = document.createElement("div");
  replayCompareDiv.id = "replay-compare-div";
  c = {
    display: "flex",
    flexDirection: "row",
    // rowGap: "0px",
    // justifyContent: "space-between",
    // alignItems: "center",
    borderTop: "2px solid black",
    height: "35%",
    width: "100%",
  }
  Object.keys(c).forEach(function (a) {
    replayCompareDiv.style[a] = c[a];
  });

  let replayCompareContentDiv = document.createElement("div");
  replayCompareContentDiv.id = "replay-compare-content-div";
  replayCompareDiv.appendChild(replayCompareContentDiv);



  mainDiv.appendChild(replayCompareDiv);




  let replayCompareButtonsDiv = document.createElement("div");
  replayCompareButtonsDiv.id = "replay-compare-buttons-div";
  c = {
    display: "flex",
    // flex: "1 1 auto",
    flexDirection: "column",
    // rowGap: "0px",
    justifyContent: "center",
    // padding: "10px",
    alignItems: "center",
    borderLeft: "2px solid black",
    // borderTop: "2px solid red",
    // borderRadiusTopLeft: "10px",
    
    height: "100%",
    width: "35%",
    color: "black",
  }
  Object.keys(c).forEach(function (a) {
    replayCompareButtonsDiv.style[a] = c[a];
  });

  let compareActions = document.createElement("div");
  c = {
    display: "flex",
    flexDirection: "row",
    // rowGap: "0px",
    // justifyContent: "space-around",
    // padding: "10px",
    alignItems: "center",
    // border: "2px solid orange",
    height: "34%",
    width: "100%",
    // color: "black",
  }
  Object.keys(c).forEach(function (a) {
    compareActions.style[a] = c[a];
  });

  let compareAddBtnDiv = document.createElement("div");
  Object.keys(b).forEach(function (a) { 
    compareAddBtnDiv.style[a] = b[a];
  });

  let compareAddBtn = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    // fontSize: "3vh",
    backgroundColor: "white",
    color: "black",
    border: "none",
    // padding: "5px",
    cursor: "pointer",
    // borderRadius: "10px",
    height: "7vh",
    width: "7vh",
    // border: "2px solid red",
    background: "url(../src/img/modloader/replay/queue.png)",
    backgroundSize: "contain", //or 50% 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
  Object.keys(c).forEach(function (a) {
    compareAddBtn.style[a] = c[a];
  });
  // editLevel.innerHTML = "Race";

  compareAddBtn.onclick = function() {
    document.getElementById("menu-bg").style.pointerEvents = "none";
    document.getElementById("menu-bg").style.filter = "blur(1.2px)";
    createViewListPopup();
  }

  let compareAddBtnLabel = document.createElement("span");
  compareAddBtnLabel.innerText = "Queue";
  compareAddBtnLabel.style.fontFamily = "Retron2000";
  compareAddBtnLabel.style.fontSize = "2vh";
  compareAddBtnLabel.style.color = "black";

  compareAddBtnDiv.appendChild(compareAddBtn);
  compareAddBtnDiv.appendChild(compareAddBtnLabel);


  let compareCompareBtnDiv = document.createElement("div");
  Object.keys(b).forEach(function (a) {
    compareCompareBtnDiv.style[a] = b[a];
  });

  let compareCompareBtn = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    // fontSize: "3vh",
    backgroundColor: "black",
    color: "black",
    border: "none",
    // padding: "5px",
    cursor: "pointer",
    // borderRadius: "10px",
    height: "7vh",
    width: "7vh",
    // border: "2px solid red",
    background: "url(../src/img/modloader/replay/compare-old.png)",
    backgroundSize: "contain", //or 50% 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
  Object.keys(c).forEach(function (a) {
    compareCompareBtn.style[a] = c[a];
  });

  compareCompareBtn.onclick = function() {
    console.log("compare button clicked");
    console.log(compareLevelQueue);
    let queueIds = compareLevelQueue.map(level => level.id);

    if (!compareLevelQueue.every(level => level.levelNumber === compareLevelQueue[0].levelNumber)) {
      document.getElementById("menu-bg").style.pointerEvents = "none";
      document.getElementById("menu-bg").style.filter = "blur(1.2px)";
      createNotifyModal("All replays must be from the same level to compare.");
      return;
    }
    if(compareLevelQueue.length < 2) {
      document.getElementById("menu-bg").style.pointerEvents = "none";
      document.getElementById("menu-bg").style.filter = "blur(1.2px)";
      createNotifyModal("Please select at least 2 replays to compare.");
      return;
    }

    console.log(queueIds);

    let queueObjs = []

    let localforage = window.localforage;
    var replayStore = localforage.createInstance({
        name: "replays"
    });

    for(let i = 0; i < queueIds.length; i++) {
      replayStore.getItem(queueIds[i], function(err, value) {
        queueObjs.push(value.replay)
      }).catch(function(err) {
        console.error("Error retrieving replay for id: " + queueIds[i], err);
      });
    };

    replayStore.iterate(function(value, key, iterationNumber) {
        queueObjs.push({id: key, replay: value.replay});
    }).then(function() {
      console.log(queueObjs);

      queueObjs = queueObjs.filter(x => queueIds.includes(x.id)); 
      queueObjs = queueObjs.map(x => x.replay);
      console.log(queueObjs)

      decompressMultipleWithStream(queueObjs).then((dataArray) => {
        console.log(dataArray);
        let replays = dataArray.map((data) => {
            return JSON.parse(data);
        });
        console.log(replays);
        let replay = replays[0]; // use the first replay as the base for comparison
        let levelName = replay.data[replay.data.length - 1][1][1]
        //launch level in individual level mode
        runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[3] = 1
        runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[21] = 1
        // runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[22] = 1

        runtime.changelayout = runtime.layouts[levelName];
        window["beginComparing"](replays);
      })
    });
    document.getElementById("x-button").click();
  }

  let compareCompareBtnLabel = document.createElement("span");
  compareCompareBtnLabel.innerText = "Compare";
  compareCompareBtnLabel.style.fontFamily = "Retron2000";
  compareCompareBtnLabel.style.fontSize = "2vh";
  compareCompareBtnLabel.style.color = "black";

  compareCompareBtnDiv.appendChild(compareCompareBtn);
  compareCompareBtnDiv.appendChild(compareCompareBtnLabel);




  // deleteLevel.innerHTML = "Replay";

  compareActions.appendChild(compareAddBtnDiv);
  compareActions.appendChild(compareCompareBtnDiv);


  replayCompareButtonsDiv.appendChild(compareActions);

  replayCompareDiv.appendChild(replayCompareButtonsDiv);





  //Title
  // let header2Text = document.createElement("div");
  // c = {
  //     backgroundColor: "white",
  //     border: "none",
  //     fontFamily: "Retron2000",
  //     // position: "relative",
  //     // top: "2%",
  //     //left: "35%",
  //     color: "black",
  //     cursor: "default",
  //     // margin: "0",
  //     textAlign: "center",

  // };
  // Object.keys(c).forEach(function (a) {
  //   header2Text.style[a] = c[a];
  // });

  // let levelTitleText = document.createElement("p");
  // levelTitleText.style.fontSize = "3vh";
  // levelTitleText.style.textAlign = "center";
  // levelTitleText.innerHTML = "Compare Replays";
  // header2Text.appendChild(levelTitleText);

  // replayProgressDiv.appendChild(header2Text);







  // let c = {
  //   display: "flex",
  //   // flex: "1",
  //   alignItems: "left",
  //   justifyContent: "space-between",
  //   padding: "10px",
  //   flexDirection: "column",
  //   // width: "10%",
  //   // borderTop: "solid 3px black",

  //   height: "auto",
  //   maxHeight: "100%",
    
  //   overflowY: "scroll",
  //   overflowX: "hidden",

  //   scrollbarGutter: "stable",
  //   scrollbarWidth: "thin",
  //   // backgroundColor: "red",
  //   // position: "sticky",
  //   // marginRight: "2%",
  // };
  // Object.keys(c).forEach(function (a) {
  //   replaysListDiv.style[a] = c[a];
  // });

  // c = {
  //   display: "grid",
  //   padding: "10px",
  //   // marginBottom: "20px",
  //   gridTemplateColumns: "repeat(4, 0.25fr)",
  //   columnGap: "3%",
  //   rowGap: "4%",
  //   gridTemplateRows: "max-content",

  //   borderLeft: "solid 3px black",
  //   // borderTop: "solid 3px black",
  //   width: "83%",
  //   height: "calc(100% - 24px)",
  //   overflowY: "auto",
  //   overflowX: "hidden",
  //   scrollbarGutter: "stable",
  //   scrollbarWidth: "thin",
  //   justifyContent: "center",
  //   alignItems: "flex-start",
  // };
  // Object.keys(c).forEach(function (a) {
  //   cardsDiv.style[a] = c[a];
  // });

  sectionDiv.appendChild(mainDiv);
  sectionDiv.appendChild(replayRightDiv);

  loadReplayRows();
  loadReplayCompare();


};

let loadReplayDetails = (replayObj) => {
  let replayDetailsDescDiv = document.getElementById("replay-details-desc-div");

  while (replayDetailsDescDiv.firstChild) {
    console.log("removing child");
    replayDetailsDescDiv.removeChild(replayDetailsDescDiv.lastChild);
  }

  let c = {
    display: "flex",
    // flex: "1 1 auto",
    flexDirection: "column",
    // rowGap: "0px",
    justifyContent: "space-around",
    paddingLeft: "10px",
    alignItems: "left",
    // borderRight: "2px solid black",
    height: "100%",
    width: "65%",
  }
  Object.keys(c).forEach(function (a) {
    replayDetailsDescDiv.style[a] = c[a];
  });

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
      // padding: "5px",
      textAlign: "center",

  };
  Object.keys(c).forEach(function (a) {
    headerText.style[a] = c[a];
  });

  let titleText = document.createElement("p");
  titleText.style.fontSize = "4.5vh";
  titleText.style.textAlign = "center";
  titleText.style.textDecoration = "underline";
  titleText.innerHTML = replayObj.name;
  headerText.appendChild(titleText);

  replayDetailsDescDiv.appendChild(headerText);
  


  let versionText = document.createElement("div");
  versionText.id = "version-text";
  versionText.innerHTML = "Version: " + replayObj.version;
  versionText.style.fontSize = "3vh";
  // versionText.style.padding = "10px";

  let timeText = document.createElement("div");
  timeText.id = "time-text";
  timeText.innerHTML = "Time: " + replayObj.time;
  timeText.style.fontSize = "3vh";
  // timeText.style.padding = "10px";

  let levelText = document.createElement("div");
  levelText.id = "level-number-text";
  levelText.innerHTML = "Level: " + replayObj.levelNumber;
  levelText.style.fontSize = "3vh";
  // levelText.style.padding = "10px";

  let descText = document.createElement("div");
  descText.id = "desc-text";
  descText.innerHTML = replayObj.description;
  descText.style.fontSize = "3vh";
  // descText.style.padding = "10px";

  



  replayDetailsDescDiv.appendChild(versionText);
  replayDetailsDescDiv.appendChild(timeText);
  replayDetailsDescDiv.appendChild(levelText);
  replayDetailsDescDiv.appendChild(descText);


}

let loadReplayCompare = () => {
  let replayCompareContentDiv = document.getElementById("replay-compare-content-div");

  while (replayCompareContentDiv.firstChild) {
    replayCompareContentDiv.removeChild(replayCompareContentDiv.lastChild);
  }

  let c = {
    display: "flex",
    // flex: "1 1 auto",
    flexDirection: "column",
    // rowGap: "",
    justifyContent: "space-around",
    paddingLeft: "10px",
    alignItems: "left",
    // borderRight: "2px solid green",
    height: "100%",
    width: "65%",
  }
  Object.keys(c).forEach(function (a) {
    replayCompareContentDiv.style[a] = c[a];
  });

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
      padding: "5px",
      // marginTop: "10px",
      textAlign: "center",


  };
  Object.keys(c).forEach(function (a) {
    headerText.style[a] = c[a];
  });

  let titleText = document.createElement("p");
  titleText.style.fontSize = "3.5vh";
  titleText.style.textAlign = "center";
  titleText.style.textDecoration = "underline";
  titleText.innerHTML = "Compare Replays";
  headerText.appendChild(titleText);

  replayCompareContentDiv.appendChild(headerText);
  


  let versionText = document.createElement("div");
  versionText.id = "version-text";

  if (compareLevelQueue.length > 0) {
    console.log(compareLevelQueue);
    versionText.innerHTML = "Comparing " + compareLevelQueue.length + " replays";
    versionText.style.fontSize = "2.5vh";
    // versionText.style.marginTop = "10px";
    versionText.style.textAlign = "center";
    replayCompareContentDiv.appendChild(versionText);
  } else {
    versionText.innerHTML = "No replays selected";
    versionText.style.fontSize = "2.5vh";
    // versionText.style.marginTop = "10px";
    versionText.style.textAlign = "center";
    replayCompareContentDiv.appendChild(versionText);
  }

}