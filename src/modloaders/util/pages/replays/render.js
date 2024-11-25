import { version, filters, backendConfig } from "../../../modloader.js";
import { createNotifyModal } from "../../modals.js";
import { detectDeviceType } from "../../utils.js";
import { customModNum, incCustomModNum } from "./utils.js";
import { createUploadPopup } from "./editmod.js";
import { loadReplayRows } from "./list.js";


export { renderReplaysMenu };

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
      
  mainDiv.id = "main-div";
      
  let replaysListDiv = document.createElement("div");
  replaysListDiv.addEventListener('wheel', (e) => {
    // console.log("hello)")
    e.stopImmediatePropagation()
    e.stopPropagation();
    // e.preventDefault();
    replaysListDiv.focus();
  });
  replaysListDiv.id = "replays-list-div";

  let c = {
    display: "flex",
    flexWrap: "wrap",
    // alignContent: "flex-start",
    // flexDirection: "column", 
    width: "40%",
    height: "100%",
    // maxHeight: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    // borderTop: "2px solid black",
    border: "2px solid red",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
  };
  Object.keys(c).forEach(function (a) {
    replaysListDiv.style[a] = c[a];
  });

  let localforage = window.localforage;
  var replayStore = localforage.createInstance({
    name: "replays"
  });

  let replayObjs = []

  replayStore.iterate(function(value, key, iterationNumber) {
    replayObjs.push(value);
  }).then(function() {
    console.log('Iteration has completed');
    loadReplayRows(replaysListDiv, replayObjs);
  }).catch(function(err) {
    // This code runs if there were any errors
    console.log(err);
  });






  c = {
    border: "2px solid red",
    width: "60%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    // rowGap: "0px",
    // justifyContent: "space-between",
    alignItems: "center",
  }
  Object.keys(c).forEach(function (a) {
    mainDiv.style[a] = c[a];
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

  let titleText = document.createElement("p");
  titleText.style.fontSize = "2.3vw";
  titleText.style.textAlign = "center";
  titleText.innerHTML = "Replays";
  headerText.appendChild(titleText);

  navbar.appendChild(headerText);

  mainDiv.appendChild(navbar);

  let descText = document.createElement("div");
  descText.id = "descText";
  descText.innerHTML = "whats up";
  descText.style.fontSize = "1.5vw";
  descText.style.textAlign = "center";
  descText.style.margin = "15px"
  mainDiv.appendChild(descText);

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

  let playButton = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    fontSize: "14pt",
    backgroundColor: "rgb(45, 186, 47)",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "10px",
  }
  Object.keys(c).forEach(function (a) {
    playButton.style[a] = c[a];
  });
  playButton.innerHTML = "Play";
  // Create cancel button
  let stopButton = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    fontSize: "14pt",
    backgroundColor: "rgb(222, 48, 51)",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "10px",
  }
  Object.keys(c).forEach(function (a) {
    stopButton.style[a] = c[a];
  });
  stopButton.innerHTML = "Stop";


  // Append buttons to the buttons container
  buttonsContainer.appendChild(playButton);
  buttonsContainer.appendChild(stopButton);
  mainDiv.appendChild(buttonsContainer);


  let settingsButton = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    fontSize: "14pt",
    backgroundColor: "rgb(45, 186, 47)",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "10px",
  }
  Object.keys(c).forEach(function (a) {
    settingsButton.style[a] = c[a];
  });
  settingsButton.innerHTML = "Settings";
  // Create cancel button
  mainDiv.appendChild(settingsButton);

  let uploadButton = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    fontSize: "14pt",
    backgroundColor: "rgb(45, 186, 47)",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "10px",
    marginTop: "15px",
    marginBottom: "10px",
  }
  Object.keys(c).forEach(function (a) {
    uploadButton.style[a] = c[a];
  });
  uploadButton.innerHTML = "Upload";

  uploadButton.onclick = function() {
    document.getElementById("menu-bg").style.pointerEvents = "none";
    document.getElementById("menu-bg").style.filter = "blur(1.2px)";
    createUploadPopup("upload");
  }

  // Create cancel button
  mainDiv.appendChild(uploadButton);

  





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
  sectionDiv.appendChild(replaysListDiv);

};
