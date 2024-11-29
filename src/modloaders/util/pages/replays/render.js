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

  let replaysInfo = globalThis.replaysInfo();
  console.log(replaysInfo);

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
    borderLeft: "2px solid black",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
  };
  Object.keys(c).forEach(function (a) {
    replaysListDiv.style[a] = c[a];
  });

  c = {
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
  titleText.style.fontSize = "2.5vw";
  titleText.style.textAlign = "center";
  titleText.style.textDecoration = "underline";
  titleText.innerHTML = "Replays";
  headerText.appendChild(titleText);

  navbar.appendChild(headerText);

  mainDiv.appendChild(navbar);



  let navbar2 = document.createElement("nav");
  
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
    navbar2.style[a] = c[a];
  });
  navbar2.id = "navbar2";

  navbar2.appendChild(document.createElement("div"));

  //Title
  let header2Text = document.createElement("div");
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
    header2Text.style[a] = c[a];
  });

  let levelTitleText = document.createElement("p");
  levelTitleText.style.fontSize = "1.5vw";
  levelTitleText.style.textAlign = "center";
  levelTitleText.innerHTML = (replaysInfo.replayInfo && "Replaying: " + replaysInfo.replayInfo.name) || "No replay playing";
  header2Text.appendChild(levelTitleText);

  navbar2.appendChild(header2Text);

  mainDiv.appendChild(navbar2);



  const progressWrapper = document.createElement('div');
  progressWrapper.style.display = 'flex';
  progressWrapper.style.alignItems = 'center';
  progressWrapper.style.justifyContent = 'space-between';
  progressWrapper.style.width = '80%';
  progressWrapper.style.margin = '20px auto';
  mainDiv.appendChild(progressWrapper);

  // Create and style the current progress text
  const currentProgressText = document.createElement('span');
  if (replaysInfo.frames.length == 0) {
    replaysInfo.frames = [0];
  }
  var closest = replaysInfo.frames.reduce(function(prev, curr) {
    return (Math.abs(curr - replaysInfo.replayIndex) < Math.abs(prev - replaysInfo.replayIndex) ? curr : prev);
  });
  let progress = ((replaysInfo.frames.indexOf(closest) / (replaysInfo.frames.length - 1)) * 100).toFixed(2)
  currentProgressText.textContent = progress + '%';
  currentProgressText.style.marginRight = '10px';
  progressWrapper.appendChild(currentProgressText);

  // Create and style the progress bar container
  const progressContainer = document.createElement('div');
  progressContainer.style.width = '100%';
  progressContainer.style.height = '20px';
  progressContainer.style.backgroundColor = '#ddd';
  progressContainer.style.borderRadius = '10px';
  progressContainer.style.overflow = 'hidden';
  progressWrapper.appendChild(progressContainer);

  // Create and style the progress bar
  const progressBar = document.createElement('div');
  progressBar.style.width = progress + '%';
  progressBar.style.height = '100%';
  progressBar.style.backgroundColor = 'orange';
  progressBar.style.transition = 'width 0.1s linear';
  progressContainer.appendChild(progressBar);

  // Create and style the total progress text
  const totalProgressText = document.createElement('span');
  totalProgressText.textContent = '100%';
  totalProgressText.style.marginLeft = '10px';
  progressWrapper.appendChild(totalProgressText);

  function updateProgressText() {
    currentProgressText.textContent = `${progress}%`;
  }

  let interval;

  function startProgress() {
    interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
      } else {
        replaysInfo = globalThis.replaysInfo();
        if (replaysInfo.frames.length == 0) {
          replaysInfo.frames = [0];
        }
        var closest = replaysInfo.frames.reduce(function(prev, curr) {
          return (Math.abs(curr - replaysInfo.replayIndex) < Math.abs(prev - replaysInfo.replayIndex) ? curr : prev);
        });
        progress = ((replaysInfo.frames.indexOf(closest) / (replaysInfo.frames.length - 1)) * 100).toFixed(2)
        progressBar.style.width = progress + '%';
        updateProgressText();
      }
    }, 100);
  }
  
  // Start the progress when the page loads
  startProgress();
  
  // Add an event listener to the stop button

  let descText = document.createElement("div");
  descText.id = "descText";
  descText.innerHTML = "whats up";
  descText.style.fontSize = "1.5vw";
  descText.style.textAlign = "center";
  descText.style.margin = "15px"
  // mainDiv.appendChild(descText);

  

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
  // buttonsContainer.appendChild(playButton);
  mainDiv.appendChild(stopButton);
  // mainDiv.appendChild(buttonsContainer);


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
  buttonsContainer.appendChild(settingsButton);

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
    // marginTop: "15px",
    // marginBottom: "10px",
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
  buttonsContainer.appendChild(uploadButton);

  mainDiv.appendChild(buttonsContainer);

  





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

  loadReplayRows();


};
