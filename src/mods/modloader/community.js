
//unfinished mod
(function() {
    let old = globalThis.sdk_runtime;
    c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    let runtime = globalThis.sdk_runtime;
    globalThis.sdk_runtime = old;


    var map = null;
    var map2 = null;
    var namedOrdered = {};
    var idOrdered = {};
    fetch('../src/communitylevels/config/levels.json')
            .then((response) => response.json())
            .then(jsondata => {
                console.log(jsondata)
                for (var i = 0; i < jsondata.length; i++) {
                    namedOrdered[jsondata[i].name] = jsondata[i].id;
                    idOrdered[jsondata[i].id] = jsondata[i].name;
                }
            });
    
    
  
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
            map.push({
              inst,
              oldState: behavior.scroll.isEnabled,
            });
            behavior.scroll.isEnabled = 0;
          });
        });
        let layer = runtime.running_layout.layers.find((x) => x.name == "UI");
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
        return {
          map,
          mapUI,
        };
      };

      let enableScroll = ({ map, mapUI }) => {
        map.forEach((x) => {
          let inst = x.inst.behavior_insts.find(
            (x) => x.behavior instanceof cr.behaviors.aekiro_scrollView
          );
          inst.isEnabled = inst.isEnabled ? 1 : x.oldState;
        });
        mapUI.forEach((x) => {
          x.inst.width = x.oldState.width;
          x.inst.height = x.oldState.height;
          x.inst.set_bbox_changed();
        });
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
    

    let queryDatabase = (query) => {
        let db = "../src/communitylevels/config/data.json";
        var ids = [];
        fetch(db)
            .then((response) => response.json())
            .then(jsondata => {
                console.log(jsondata)
                for(var i = 0; i < jsondata.length; i++) {
                    if(jsondata[i].name.startsWith(query)) {
                        ids.push(jsondata[i].id);
                    }
                }
                
            });
        return ids;

    }

    async function getDatabase(numEntries = 3) { 
      return fetch('../src/communitylevels/config/data.json')
      .then((response)=>response.json())
      .then((responseJson)=>{return responseJson.slice(0, numEntries)});
    }

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
            enableScroll(map2);
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
            modNameInput.focus()
        }
        searchInput.onkeydown = (e) => { // ensures that user is able to type in input box
            console.log("pleasev2");
            e.stopImmediatePropagation()
            e.stopPropagation();
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
        searchBtn.onclick = function() {
            let query = searchInput.value;
            console.log("searching" + query);
            var levelIds = queryDatabase(query);
            levelIds.forEach((id) => {
                console.log(id);
            }
            
        )};



        // levelScroll = document.createElement("div")
        // c = {
        //     backgroundColor: "white",
        //     border: "solid",
        //     borderColor: "black",
        //     borderWidth: "2px",
        //     fontFamily: "Retron2000",
        //     position: "absolute",
        //     cursor: "default",
        //     top: "25%",
        //     left: "-1px",
        //     padding: "0px",
        //     color: "black",
        //     fontSize: "12pt",
        //     display: "block",
        //     width: "99.5%",
        //     height: "75%",
        // };
        // Object.keys(c).forEach(function (a) {
        //     levelScroll.style[a] = c[a];
        // });

        // levelsList = document.createElement('ul');
        // c = {
        //     listStyleType: "none",
        //     fontFamily: "Retron2000",
        //     position: "absolute",
        //     cursor: "default",
        //     color: "black",
        //     fontSize: "10pt",
        // };
        // Object.keys(c).forEach(function (a) {
        //     levelsList.style[a] = c[a];
        // });
        

        // for(var i = 0; i < 2; i++) {
        //   li = document.createElement("li");
        //   d1 = document.createElement("div");
        //   d1.style.width = "100%";
        //   d1.style.height = "100%";
        //   d1.style.border = "1px solid red";
        //   d1.style.flex = "none";
        //   li.appendChild(d1);

          
        //   li.style.border = "1px solid black";
        //   li.style.borderLeftStyle = "none";
        //   li.style.cursor = "pointer"
        //   // li.innerText = "apple1"
        //   levelsList.appendChild(li);
        // }

        var levelsList = document.createElement('div');

        // set the CSS properties of the parent element
        levelsList.style.display = 'flex';
        levelsList.style.flexWrap = 'wrap';
        levelsList.style.position = 'absolute';
        levelsList.style.top = '25%';
        levelsList.style.left = '0px';
        levelsList.style.width = '100%';
        levelsList.style.height = '75%';
        // levelsList.style.border = '1px solid black';
        levelsList.style.overflowY = 'auto';

        
        const data = await getDatabase();
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          console.log(i)
          var levelBox = document.createElement('div');

          levelTitleText = document.createElement("div");
          c = {
              backgroundColor: "white",
              border: "none",
              fontFamily: "Retron2000",
              position: "relative",
              top: "2%",
              left: "20%",
              //padding: "5px",
              color: "black",
              fontSize: "15pt",
              cursor: "default",
          };
          Object.keys(c).forEach(function (a) {
            levelTitleText.style[a] = c[a];
          });

          newContent = document.createTextNode(data[i]["levelname"]);
          levelTitleText.appendChild(newContent);
          levelBox.appendChild(levelTitleText);
          
          levelAuthorText = document.createElement("div");
          c = {
            backgroundColor: "white",
            border: "none",
            fontFamily: "Retron2000",
            position: "relative",
            top: "20%",
            left: "20%",
            //padding: "5px",
            color: "black",
            fontSize: "10pt",
            cursor: "default",
          };
          Object.keys(c).forEach(function (a) {
            levelAuthorText.style[a] = c[a];
          });

          newContent = document.createTextNode("by " + data[i]["username"]);
          levelAuthorText.appendChild(newContent);

          levelBox.appendChild(levelAuthorText);

          levelBox.style.width = '100%';
          levelBox.style.height = '100px';
          levelBox.style.borderTop = '2px solid black';
          levelsList.appendChild(levelBox);
        }

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
        init() {
           


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

            
            

            
            
                


            document.addEventListener("keydown", (event) => {this.keyDown(event)});

            notify("Community Levels Loaded", "by Awesomeguy")
            runtime.tickMe(this);

        },
        keyDown(event) {
            
            if (event.code === "KeyH") {
                fetch('../src/communitylevels/3D_OvO_1.json')
                .then((response) => response.json())
                .then((data) => {
                    ovoLevelEditor.startLevel(data);
                });
            }

            if (event.code === "KeyG" && document.getElementById("community-menu") === null) {
                map = disableClick();
                map2 = disableScroll();
                createCommunityMenu()
            }
            
            
            
        },

        
        
        tick() {
            let playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
            let player = playerInstances[0];
            

            try {
                //console.log(player.behavior_insts[0].leftkey)
               

                
            } catch (err) {}
        }
    };
  
    communityLevelsMod.init();
})();