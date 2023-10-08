
//unfinished mod
(function() {
    let old = globalThis.sdk_runtime;
    c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    let runtime = globalThis.sdk_runtime;
    globalThis.sdk_runtime = old;


    var map = null;
    var map2 = null;
    var levelData;
    
    
    
  
    let getPlayer = () => {
        return runtime.types_by_index
            .filter(
                (x) =>
                !!x.animations &&
                x.animations[0].frames[0].texture_file.includes("collider")
            )[0]
            .instances.filter(
                (x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
            )[0];
    }
    
    let notify = (title, text, image = "./speedrunner.png") => {
        cr.plugins_.sirg_notifications.prototype.acts.AddSimpleNotification.call(
            runtime.types_by_index.find(
                (type) => type.plugin instanceof cr.plugins_.sirg_notifications
            ).instances[0],
            title,
            text,
            image
        );
    };
    let isInLevel = () => {
        return runtime.running_layout.name.startsWith("Level")
    };
    // let test = () => {
    //     console.log("hi");
    // };
    
    let isPaused = () => {
        if (isInLevel()) return runtime.running_layout.layers.find(function(a) {
            return "Pause" === a.name
        }).visible
    };

    let disableScroll = () => {
        let map = [];
        let mapUI = [];
        let types = runtime.types_by_index.filter((x) =>
          x.behaviors.some(
            (y) => y.behavior instanceof cr.behaviors.aekiro_scrollView
          )
        );
        types.forEach((type) => {
          type.instances.forEach((inst) => {
            let behavior = inst.behavior_insts.find(
              (x) => x.behavior instanceof cr.behaviors.aekiro_scrollView
            );
            console.log(behavior)
            map.push({
              inst,
              oldState: behavior.scroll.isEnabled,
            });
            behavior.scroll.isEnabled = 0;
            behavior.movement = 0;
          });
        });
        let layer = runtime.running_layout.layers.find((x) => x.name == "UI");
        console.log(layer)
        if (layer) {
          layer.instances.forEach((inst) => {
            //save state to mapUI
            mapUI.push({
              inst,
              oldState: {
                width: inst.width,
                height: inst.height,
              },
            });
            // set size to 0
            console.log(inst)
            inst.width = 0;
            inst.height = 0;
            inst.set_bbox_changed();
          });
        }
        types.forEach((type) => {
          type.instances.forEach((inst) => {
            let behavior = inst.behavior_insts.find(
              (x) => x.behavior instanceof cr.behaviors.aekiro_scrollView
            );
            console.log(behavior)
          });
        });
        return {
          map,
          mapUI,
        };
      };

    let disableClick = () => {
        let map = [];
        let mapUI = [];
        let types = runtime.types_by_index.filter((x) =>
          x.behaviors.some(
            (y) => y.behavior instanceof cr.behaviors.aekiro_button
          )
        );
        types.forEach((type) => {
          console.log(type);
          type.instances.forEach((inst) => {
            let behavior = inst.behavior_insts.find(
              (x) => x.behavior instanceof cr.behaviors.aekiro_button
            );
            map.push({
              inst,
              oldState: behavior.isEnabled,
            });
            behavior.isEnabled = 0;
          });
        });
        let layer = runtime.running_layout.layers.find((x) => x.name == "UI");
        console.log(layer)
        if (layer) {
          layer.instances.forEach((inst) => {
            //save state to mapUI
            mapUI.push({
              inst,
              oldState: {
                width: inst.width,
                height: inst.height,
              },
            });
            // set size to 0
            inst.width = 0;
            inst.height = 0;
            inst.set_bbox_changed();
          });
        }
        types.forEach((type) => {
          type.instances.forEach((inst) => {
            let behavior = inst.behavior_insts.find(
              (x) => x.behavior instanceof cr.behaviors.aekiro_scrollView
            );
            console.log(behavior)
          });
        });
        return {
          map,
          mapUI,
        };
      };

      let enableClick = ({ map, mapUI }) => {
        map.forEach((x) => {
          let inst = x.inst.behavior_insts.find(
            (x) => x.behavior instanceof cr.behaviors.aekiro_button
          );
          inst.isEnabled = inst.isEnabled ? 1 : x.oldState;
        });
        mapUI.forEach((x) => {
          x.inst.width = x.oldState.width;
          x.inst.height = x.oldState.height;
          x.inst.set_bbox_changed();
        });
      };
    

    function queryDatabase(query) {
        var levelJsons = [];
        
        for(var i = 0; i < levelData.length; i++) {
            if(levelData[i]["levelname"].replace(/_/g, " ").toLowerCase().startsWith(query) || levelData[i]["username"].toLowerCase().startsWith(query)) {
                levelJsons.push(levelData[i]);
            }
        }
        return levelJsons;
    

    }

    function getDatabase(numEntries = 4) { 
      return levelData.slice(0, numEntries);
    }

    let renderListLevels = (levelsQueried) => {
      var levelsList = document.createElement('div');
      levelsList.addEventListener('wheel', (e) => {
        console.log("hello)")
        e.stopImmediatePropagation()
        e.stopPropagation();
        e.preventDefault();
        levelsList.focus();
      });
      
      // levelsList.style.zIndex = "2147483646";
      levelsList.id = 'levels-list';
      // levelsList.focus();

      levelsList.style.display = 'flex';
      levelsList.style.flexWrap = 'wrap';
      levelsList.style.position = 'absolute';
      levelsList.style.top = '25%';
      levelsList.style.left = '0px';
      levelsList.style.width = '100%';
      levelsList.style.height = '75%';
      // levelsList.style.border = '1px solid black';
      levelsList.style.overflowY = 'scroll';
      levelsList.style.overflowX = 'hidden';
      // levelsList.onscroll = function() {
      //     console.log("scrolling");
      //     levelsList.focus();
      // }

      // console.log(levelsQueried)
      levelsQueried.forEach((level) => {
          // console.log(level["levelname"])
          var levelBox = document.createElement('div');
          levelBox.style.width = '100%';
          levelBox.style.height = '100px';
          levelBox.style.borderTop = '2px solid black';
          levelBox.style.position = "relative";
          levelBox.style.overflowY = "auto";
          levelBox.style.overflowX = "hidden";


          levelTitleText = document.createElement("div");
          c = {
              backgroundColor: "white",
              border: "none",
              fontFamily: "Retron2000",
              position: "relative",
              top: "2%",
              left: "2%",
              //padding: "5px",
              color: "black",
              fontSize: "15pt",
              cursor: "default",
          };
          Object.keys(c).forEach(function (a) {
              levelTitleText.style[a] = c[a];
          });
          
          newContent = document.createTextNode(level["levelname"].replace(/_/g, " ").slice(0, -5));
          levelTitleText.appendChild(newContent);
          levelBox.appendChild(levelTitleText);
          
          levelAuthorText = document.createElement("div");
          c = {
              backgroundColor: "white",
              border: "none",
              fontFamily: "Retron2000",
              position: "relative",
              top: "10%",
              left: "2%",
              //padding: "5px",
              color: "black",
              fontSize: "10pt",
              cursor: "default",
          };
          Object.keys(c).forEach(function (a) {
              levelAuthorText.style[a] = c[a];
          });

          newContent = document.createTextNode("by " + level["username"]);
          levelAuthorText.appendChild(newContent);

          levelBox.appendChild(levelAuthorText);



          levelDescText = document.createElement("div");
          c = {
              backgroundColor: "white",
              border: "none",
              fontFamily: "Retron2000",
              position: "relative",
              top: "15%",
              left: "2%",
              //padding: "5px",
              color: "black",
              fontSize: "10pt",
              cursor: "default",
              width: "80%",

          };
          Object.keys(c).forEach(function (a) {
            levelDescText.style[a] = c[a];
          });

          newContent = document.createTextNode(level["content"]);
          levelDescText.appendChild(newContent);

          levelBox.appendChild(levelDescText);


          levelPlayBtn = document.createElement("button");
          c = {
              backgroundColor: "#9268e3",
              borderRadius: "25px",
              border: "#9268e3",
              padding: "10px",
              position: "absolute",
              fontFamily: "Retron2000",
              color: "white",
              fontSize: "10pt",
              cursor: "pointer",
              top: "30%",
              right: "5%",

          };
          Object.keys(c).forEach(function (a) {
              levelPlayBtn.style[a] = c[a];
          });
          
          levelPlayBtn.innerHTML = "Play";
          levelPlayBtn.onclick = async function() {
              var levelJson = await fetch("../src/communitylevels/" + level["levelname"])
                .then((response) => response.json())
                .then((data) => {
                    return data;
                });
              ovoLevelEditor.startLevel(levelJson);
              xButton.click()
          };

          levelBox.appendChild(levelPlayBtn);            
          levelsList.appendChild(levelBox);
      });
      
      return levelsList;
    };


    let createCommunityMenu = async () => {
        //Create background div
        b = document.createElement("div")
        c = {
            backgroundColor: "white",
            border: "solid",
            borderColor: "black",
            borderWidth: "2px",
            fontFamily: "Retron2000",
            position: "absolute",
            top: "17.5%",
            left: "32.5%",
            padding: "5px",
            color: "black",
            fontSize: "10pt",
            display: "block",
            width: "35%",
            height: "65%",
        };
        Object.keys(c).forEach(function (a) {
            b.style[a] = c[a];
        });
        b.id = "community-menu";
        b.focus();

        //X button CSS
        xButton = document.createElement("button");
        c = {
            backgroundColor: "white",
            border: "none",
            position: "absolute",
            fontFamily: "Retron2000",
            color: "black",
            fontSize: "10pt",
            cursor: "pointer",
            right: "1px",
            top: "1px",
        };
        Object.keys(c).forEach(function (a) {
            xButton.style[a] = c[a];
        });

        xButton.innerHTML = "❌";

        xButton.onclick = function() {
            b.remove();
            enableClick(map);
        }


        titleText = document.createElement("div");

        c = {
            backgroundColor: "white",
            border: "none",
            fontFamily: "Retron2000",
            position: "absolute",
            top: "2%",
            left: "25%",
            textAlign: "center",
            //padding: "5px",
            color: "black",
            fontSize: "22pt",
            cursor: "default",
        };
        Object.keys(c).forEach(function (a) {
            titleText.style[a] = c[a];
        });

        newContent = document.createTextNode("Community Levels");
        titleText.appendChild(newContent);

        searchInput = document.createElement("input");
        c = {
            backgroundColor: "white",
            border: "solid",
            borderColor: "black",
            borderWidth: "2px",
            position: "absolute",
            fontFamily: "Retron2000",
            color: "black",
            fontSize: "10pt",
            cursor: "text",
            width: "70%",
            top: "15.5%",
            left: "9%",
        };
        Object.keys(c).forEach(function (a) {
            searchInput.style[a] = c[a];
        });

        searchInput.onclick = (e) => { //ensure that input box focus
            console.log("please");
            e.stopImmediatePropagation()
            e.stopPropagation();
            e.preventDefault();
            searchInput.focus()
        }
        searchInput.onkeydown = (e) => { // ensures that user is able to type in input box
            console.log("pleasev2");
            e.stopImmediatePropagation()
            e.stopPropagation();
            if(e.keyCode === 13) {
                searchBtn.click();
            }
            if(e.keyCode === 27) {
                searchInput.blur();
            }
        };


        searchBtn = document.createElement("button");
        c = {
            backgroundColor: "#9268e3",
            borderRadius: "25px",
            border: "#9268e3",
            padding: "8px",
            position: "absolute",
            fontFamily: "Retron2000",
            color: "white",
            fontSize: "10pt",
            cursor: "pointer",
            right: "3%",
            top: "14%",

        };
        Object.keys(c).forEach(function (a) {
            searchBtn.style[a] = c[a];
        });

        
        searchBtn.innerHTML = "Search";
        searchBtn.id = "search-btn";
        searchBtn.onclick = async function() {
            let query = searchInput.value;
            console.log("searching" + query);
            var levelsQueried = await queryDatabase(query);
            console.log(levelsQueried);
            if(document.getElementById('levels-list') !== null) { //are there levels already displayed?
                document.getElementById('levels-list').remove(); //if so remove them
            }
            levelsList = renderListLevels(levelsQueried);
            b.appendChild(levelsList);
                       
            
        };
        
        levelsQueried = await getDatabase(numEntries = levelData.length);
        // console.log(levelsQueried);
        levelsList = renderListLevels(levelsQueried);
        b.appendChild(levelsList);

        // append the divList to the document body
        b.appendChild(levelsList);
        

        




        // levelScroll.appendChild(levelsList);

        b.appendChild(searchInput);
        b.appendChild(searchBtn);
        b.appendChild(xButton);
        b.appendChild(titleText);
        // b.appendChild(levelScroll);
        
        


        document.body.appendChild(b);
    }

    
    

    let communityLevelsMod = {
        async init() {
           


            function addStyle(styleString) {
                const style = document.createElement('style');
                style.textContent = styleString;
                document.head.append(style);
              }
            addStyle(`
            #ovo-multiplayer-disconnected-container {
                pointer-events: none;
            }
            #ovo-multiplayer-other-container {
                pointer-events: none;
            }
            #ovo-multiplayer-container {
                pointer-events: none;
            }
            #ovo-multiplayer-tab-container {
                pointer-events: all;
            }
            .ovo-multiplayer-button-holder {
                pointer-events: all;
            }
            .ovo-multiplayer-tab {
                pointer-events: all;
            }
            .ovo-multiplayer-button {
                pointer-events: all;
            }
            `);



            console.log(ovoLevelEditor)

            levelData = await fetch('../src/communitylevels/config/data.json')
              .then((response) => response.json())
              .then(jsondata => {
                  console.log(jsondata)
                  return jsondata;
              });
            console.log(levelData)

            
            

            document.addEventListener("keydown", (event) => {this.keyDown(event)});

            notify("Community Levels Loaded", "by Awesomeguy<br/>Shift + L to open the levels menu", "https://static.thenounproject.com/png/4306405-200.png")

        },
        keyDown(event) {
          if (event.shiftKey && event.code === "KeyL" ) {
            if (document.getElementById("community-menu") === null) { //if menu doesn't exist
              map = disableClick();
              // map2 = disableScroll();
              createCommunityMenu()
            } else { //if menu exists
              document.getElementById("community-menu").remove();
              enableClick(map);
            }
          }  
        },
    };
  
    communityLevelsMod.init();
})();