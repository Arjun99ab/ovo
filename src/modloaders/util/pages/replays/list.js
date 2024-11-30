import { compressWithStream, decompressWithStream, compressAndStoreInIndexedDB, convert_formated_hex_to_bytes } from "./utils.js";
import { runtime } from "../../../modloader.js";

export {loadReplayRows}

let createReplayRow = (replayObj) => {
    var levelBox = document.createElement("div");
    levelBox.style.width = "100%";
    levelBox.style.height = "20%";
    // levelBox.style.alignSelf = "flex-start";
    // levelBox.style.maxHeight = "20%";

    // levelBox.style.minHeight = "80px";
    levelBox.style.borderBottom = "2px solid black";
    // levelBox.style.position = "relative";
    levelBox.style.display = "flex";
    levelBox.style.flexDirection = "row";
    levelBox.style.justifyContent = "space-around";
    levelBox.style.padding = "5px";
    levelBox.style.cursor = "pointer";
    levelBox.style.backgroundColor = "burlywood";


    

    let levelTitleText = document.createElement("div");
    let c = {
        fontFamily: "Retron2000",
        color: "black",
        fontSize: "4vh",
        cursor: "default",
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
        cursor: "default",
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
        cursor: "default",
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