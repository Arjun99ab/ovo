import { compressWithStream, decompressWithStream, compressAndStoreInIndexedDB, convert_formated_hex_to_bytes } from "./utils.js";
import { runtime } from "../../../modloader.js";

export {loadReplayRows}

let createReplayRow = (replayObj) => {
    var levelBox = document.createElement("div");
    levelBox.style.width = "100%";
    levelBox.style.height = "20%";
    levelBox.style.minHeight = "80px";
    levelBox.style.borderBottom = "2px solid black";
    // levelBox.style.position = "relative";
    levelBox.style.overflowY = "hidden";
    levelBox.style.overflowX = "hidden";
    levelBox.style.scrollbarGutter = "stable";
    levelBox.style.display = "flex";
    levelBox.style.flexDirection = "row";
    levelBox.style.padding = "5px";

    

    var levelInfo = document.createElement("div");
    levelInfo.style.display = "flex";
    levelInfo.style.flexDirection = "column";
    levelInfo.style.flex = "85%";
    levelInfo.style.justifyContent = "flex-start";
    levelInfo.style.paddingLeft = "20px";
    levelBox.appendChild(levelInfo);

    var levelActions = document.createElement("div");
    levelActions.style.display = "flex";
    levelActions.style.flexDirection = "row";
    levelActions.style.flex = "15%";
    levelActions.style.flexWrap = "wrap";
    levelActions.style.justifyContent = "flex-end";
    levelActions.style.alignContent = "center";
    levelActions.style.margin = "20px"
    levelBox.appendChild(levelActions);

    let levelTitleText = document.createElement("div");
    let c = {
        border: "none",
        fontFamily: "Retron2000",
        color: "black",
        fontSize: "15pt",
        cursor: "default",
        // margin: "10px",
    };
    Object.keys(c).forEach(function (a) {
        levelTitleText.style[a] = c[a];
    });

    let newContent = document.createTextNode(
        replayObj.name
    );
    levelTitleText.appendChild(newContent);
    levelInfo.appendChild(levelTitleText);


    let levelDescText = document.createElement("div");
    c = {
        border: "none",
        fontFamily: "Retron2000",
        color: "black",
        fontSize: "12pt",
        cursor: "default",
        width: "80%",
        flex: "1",
        marginTop: "7px",
        // alignContent: "space-around",
    };
    Object.keys(c).forEach(function (a) {
        levelDescText.style[a] = c[a];
    });

    levelDescText.innerHTML = "Version: " + replayObj.version + "<br>Time: " + replayObj.time + "<br><br>" + replayObj.description;
    levelInfo.appendChild(levelDescText);

    let levelPlayBtn = document.createElement("button");
    c = {
        backgroundColor: "#9268e3",
        borderRadius: "25px",
        border: "#9268e3",
        padding: "10px",
        margin: "10px",
        fontFamily: "Retron2000",
        color: "white",
        fontSize: "10pt",
        cursor: "pointer",
        flex: "100%",
    };
    Object.keys(c).forEach(function (a) {
        levelPlayBtn.style[a] = c[a];
    });

    levelPlayBtn.innerHTML = "Race";
    levelPlayBtn.onclick = function () {
        let replayData = replayObj.replay;
        decompressWithStream(replayData).then((data) => {
            console.log(data);
            let replay = JSON.parse(data);
            let levelName = replay.data[replay.data.length - 1][1][1]
            //launch level in individual level mode
            runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[3] = 1
            runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[21] = 1
            // runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals).instances[0].instance_vars[22] = 1

            runtime.changelayout = runtime.layouts[levelName];
            window["beginRacing"](replay, replayObj);
            // replay.play();
        }); //add error handling
        document.getElementById("x-button").click();
    };
    let levelReplayBtn = document.createElement("button");
    c = {
        backgroundColor: "#9268e3",
        borderRadius: "25px",
        border: "#9268e3",
        padding: "10px",
        margin: "10px",
        fontFamily: "Retron2000",
        color: "white",
        fontSize: "10pt",
        cursor: "pointer",
        flex: "100%",
    };
    Object.keys(c).forEach(function (a) {
        levelReplayBtn.style[a] = c[a];
    });

    levelReplayBtn.innerHTML = "Replay";
    levelActions.appendChild(levelPlayBtn);  
    levelActions.appendChild(levelReplayBtn);
    return levelBox;  
}

let loadReplayRows = () => {

    let replayListDiv = document.getElementById("replays-list-div");

    let localforage = window.localforage;
    var replayStore = localforage.createInstance({
        name: "replays"
    });
    let replayObjs = []
    replayStore.iterate(function(value, key, iterationNumber) {
        replayObjs.push(value);
    }).then(function() {
        while (replayListDiv.firstChild) {
            replayListDiv.removeChild(replayListDiv.lastChild);
        }
        console.log(replayObjs);
        for (let i = 0; i < replayObjs.length; i++) {
            let replayObj = replayObjs[i];
            let levelBox = createReplayRow(replayObj);
            replayListDiv.appendChild(levelBox);
        }
    }).catch(function(err) {
        console.log(err);
    });

    
}