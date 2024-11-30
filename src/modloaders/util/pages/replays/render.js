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

  let uploadButton = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    fontSize: "3vh",
    // backgroundColor: "rgb(45, 186, 47)",
    color: "black",
    border: "none",
    padding: "5px",
    cursor: "pointer",
    borderRadius: "10px",
    height: "100%",
    width: "100%",
    // border: "2px solid red",
    background: "url(../src/img/modloader/replay/upload.png)",
    backgroundSize: "7vh", //or 50% 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
  Object.keys(c).forEach(function (a) {
    uploadButton.style[a] = c[a];
  });
  // uploadButton.innerHTML = "Upload";

  let settingsButton = document.createElement("button");
  c["background"] = "url(../src/img/modloader/replay/settings.png)";
  Object.keys(c).forEach(function (a) {
    settingsButton.style[a] = c[a];
  });
  // settingsButton.innerHTML = "Settings";


  buttonContainer.appendChild(uploadButton);
  buttonContainer.appendChild(settingsButton);

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
    justifyContent: "space-evenly",
    alignItems: "center",
    borderTop: "2px solid black",
    height: "35%",
    width: "100%",
  }
  Object.keys(c).forEach(function (a) {
    replayProgressDiv.style[a] = c[a];
  });
  mainDiv.appendChild(replayProgressDiv);

  



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
  c = {
    display: "flex",
    // flex: "1 1 auto",
    flexDirection: "column",
    // rowGap: "0px",
    justifyContent: "space-around",
    paddingLeft: "10px",
    alignItems: "left",
    // border: "2px solid green",
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
  titleText.innerHTML = "level 5";
  headerText.appendChild(titleText);

  replayDetailsDescDiv.appendChild(headerText);
  


  let versionText = document.createElement("div");
  versionText.id = "version-text";
  versionText.innerHTML = "Version: 1.4.4";
  versionText.style.fontSize = "3vh";
  // versionText.style.padding = "10px";

  let timeText = document.createElement("div");
  timeText.id = "time-text";
  timeText.innerHTML = "Time: 00:04:37";
  timeText.style.fontSize = "3vh";
  // timeText.style.padding = "10px";


  let descText = document.createElement("div");
  descText.id = "desc-text";
  descText.innerHTML = "demo";
  descText.style.fontSize = "3vh";
  // descText.style.padding = "10px";



  replayDetailsDescDiv.appendChild(versionText);
  replayDetailsDescDiv.appendChild(timeText);
  replayDetailsDescDiv.appendChild(descText);





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


  let raceButton = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    fontSize: "3vh",
    // backgroundColor: "rgb(45, 186, 47)",
    color: "black",
    border: "none",
    padding: "5px",
    cursor: "pointer",
    // borderRadius: "10px",
    height: "100%",
    width: "100%",
    // border: "2px solid red",
    background: "url(../src/img/modloader/replay/race.png)",
    backgroundSize: "7vh", //or 50% 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
  Object.keys(c).forEach(function (a) {
    raceButton.style[a] = c[a];
  });
  // raceButton.innerHTML = "Race";


  let replayButton = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    fontSize: "3vh",
    // backgroundColor: "rgb(45, 186, 47)",
    color: "black",
    border: "none",
    padding: "5px",
    cursor: "pointer",
    // borderRadius: "10px",
    height: "100%",

    width: "100%",
    // border: "2px solid red",
    background: "url(../src/img/modloader/replay/replay.png)",
    backgroundSize: "7vh", //or 50% 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
  Object.keys(c).forEach(function (a) {
    replayButton.style[a] = c[a];
  });


  // replayButton.innerHTML = "Replay";

  replayButton.onclick = function() {
    document.getElementById("menu-bg").style.pointerEvents = "none";
    document.getElementById("menu-bg").style.filter = "blur(1.2px)";
    createUploadPopup("upload");
  }

  raceReplayContainer.appendChild(raceButton);
  raceReplayContainer.appendChild(replayButton);

  let compareButton = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    fontSize: "3vh",
    // backgroundColor: "rgb(45, 186, 47)",
    color: "black",
    border: "none",
    padding: "5px",
    cursor: "pointer",
    // borderRadius: "10px",
    height: "34%",

    width: "100%",
    // borderBottom: "2px solid red",
    background: "url(../src/img/modloader/replay/compare.png)",
    backgroundSize: "7vh", //or 50% 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
  Object.keys(c).forEach(function (a) {
    compareButton.style[a] = c[a];
  });
  // compareButton.innerHTML = "Compare";

  compareButton.onclick = function() {
    document.getElementById("menu-bg").style.pointerEvents = "none";
    document.getElementById("menu-bg").style.filter = "blur(1.2px)";
    createUploadPopup("upload");
  }

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


  let editLevel = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    fontSize: "3vh",
    backgroundColor: "white",
    color: "black",
    border: "none",
    padding: "5px",
    cursor: "pointer",
    // borderRadius: "10px",
    height: "100%",

    width: "100%",
    // border: "2px solid red",
    background: "url(../src/img/modloader/replay/edit.png)",
    backgroundSize: "7vh", //or 50% 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
  Object.keys(c).forEach(function (a) {
    editLevel.style[a] = c[a];
  });
  // editLevel.innerHTML = "Race";


  let deleteLevel = document.createElement("button");
  c = {
    fontFamily: "Retron2000",
    fontSize: "3vh",
    backgroundColor: "black",
    color: "black",
    border: "none",
    padding: "5px",
    cursor: "pointer",
    // borderRadius: "10px",
    height: "100%",


    width: "100%",
    // border: "2px solid red",
    background: "url(../src/img/modloader/replay/delete.png)",
    backgroundSize: "7vh", //or 50% 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
  Object.keys(c).forEach(function (a) {
    deleteLevel.style[a] = c[a];
  });


  // deleteLevel.innerHTML = "Replay";

  replayActions.appendChild(editLevel);
  replayActions.appendChild(deleteLevel);

  replayDetailsButtonsDiv.appendChild(raceReplayContainer);
  replayDetailsButtonsDiv.appendChild(compareButton);


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
  levelTitleText.style.fontSize = "1.8vw";
  levelTitleText.style.textAlign = "center";
  levelTitleText.innerHTML = (replaysInfo.replayInfo && "Replaying: " + replaysInfo.replayInfo.name) || "No replay playing";
  header2Text.appendChild(levelTitleText);

  replayProgressDiv.appendChild(header2Text);



  const progressWrapper = document.createElement('div');
  progressWrapper.style.display = 'flex';
  progressWrapper.style.alignItems = 'center';
  progressWrapper.style.justifyContent = 'space-between';
  progressWrapper.style.width = '80%';
  // progressWrapper.style.margin = '5px auto';
  replayProgressDiv.appendChild(progressWrapper);

  // Create and style the current progress text
  const currentProgressText = document.createElement('span');
  if (replaysInfo.frames.length == 0) {
    replaysInfo.frames = [0];
  }
  var closest = replaysInfo.frames.reduce(function(prev, curr) {
    return (Math.abs(curr - replaysInfo.replayIndex) < Math.abs(prev - replaysInfo.replayIndex) ? curr : prev);
  });
  let progress = 0;
  
  if(Number.isNaN((replaysInfo.frames.indexOf(closest)/(replaysInfo.frames.length - 1)))) {
    progress = 0;
  } else {
    progress = ((replaysInfo.frames.indexOf(closest) / (replaysInfo.frames.length - 1)) * 100).toFixed(2)
  }
  currentProgressText.textContent = progress + '%';
  currentProgressText.style.marginRight = '10px';
  progressWrapper.appendChild(currentProgressText);

  // Create and style the progress bar container
  const progressContainer = document.createElement('div');
  progressContainer.style.width = '100%';
  progressContainer.style.height = '2.5vh';
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
        console.log()
        if(Number.isNaN((replaysInfo.frames.indexOf(closest)/(replaysInfo.frames.length - 1)))) {
          progress = 0;
        } else {
          progress = ((replaysInfo.frames.indexOf(closest) / (replaysInfo.frames.length - 1)) * 100).toFixed(2)
        }
        progressBar.style.width = progress + '%';
        updateProgressText();
      }
    }, 100);
  }
  
  // Start the progress when the page loads
  startProgress();
  

  





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


};
