import { compressWithStream, decompressWithStream, compressAndStoreInIndexedDB, convert_formated_hex_to_bytes } from "./utils.js";
import { runtime, version } from "../../../modloader.js";
import { currentLevelObj, setLevel } from "./utils.js";
import { loadReplayDetails } from "./render.js";


export { loadReplayRows, createReplayRow }

let createReplayRow = (replayObj) => {
    var levelBox = document.createElement("div");
    levelBox.className = "levelbox";
    levelBox.id = "levelbox-" + replayObj.id;
    let c = {
        width: "100%",
        height: "20%",
        // alignSelf: "flex-start",
        // maxHeight: "20%",
        // minHeight: "80px",
        borderBottom: "2px solid black",
        // position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        
        padding: "5px",
        cursor: "pointer",
    }
    Object.keys(c).forEach(function (a) {
        levelBox.style[a] = c[a];
    });

    levelBox.onclick = function() {
        setLevel(replayObj);
        let elements = document.getElementsByClassName('levelbox');
        for(let i = 0; i < elements.length; i++) {
          elements[i].style.backgroundColor = 'white';
        }
        levelBox.style.backgroundColor = "lightblue";
        let replayDetailsDescDiv = document.getElementById("replay-details-desc-div");
        while (replayDetailsDescDiv.firstChild) {
            replayDetailsDescDiv.removeChild(replayDetailsDescDiv.lastChild);
        }
        loadReplayDetails(replayObj);

    }
        

    

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

    let levelLevelText = document.createElement("div");
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
        levelLevelText.style[a] = c[a];
    });

    levelLevelText.innerHTML = replayObj.levelNumber;
    levelBox.appendChild(levelLevelText);

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

    return levelBox;  
}

let loadReplayRows = () => {

    let replayListDiv = document.getElementById("replays-list-div");

    let localforage = window.localforage;
    var replayStore = localforage.createInstance({
        name: "replays"
    });
    let replayObjs = []
    console.log(replayStore)
    replayStore.iterate(function(value, key, iterationNumber) {
        replayObjs.push(value);
    }).then(function() {
        while (replayListDiv.firstChild) {
            replayListDiv.removeChild(replayListDiv.lastChild);
        }
        console.log(replayObjs);
        replayObjs.sort((a, b) => b.uploadTimestamp - a.uploadTimestamp);
        for (let i = 0; i < replayObjs.length; i++) {
            let replayObj = replayObjs[i];
            let levelBox = createReplayRow(replayObj);
            replayListDiv.appendChild(levelBox);
        }

        if (replayObjs.length === 0) {
            console.log("asyiudysaid")
            let replayDetailsDescDiv = document.getElementById("replay-details-desc-div");
            while (replayDetailsDescDiv.firstChild) {
                replayDetailsDescDiv.removeChild(replayDetailsDescDiv.lastChild);
            }
            let emptyReplayObj = {
                id: "",
                description: "",
                name: "No replays saved",
                version: "",
                time: "",
                replay: []
            }
            setLevel(emptyReplayObj);
            loadReplayDetails(emptyReplayObj);
        } else {
            document.getElementById("levelbox-" + replayObjs[0].id).click();
        }

        // loadReplayDetails(currentLevelObj);
        
    }).catch(function(err) {
        console.log(err);
    });

    

    
}