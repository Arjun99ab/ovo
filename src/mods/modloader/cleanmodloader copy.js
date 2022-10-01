(function() {
    let old = globalThis.sdk_runtime;
    c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    let runtime = globalThis.sdk_runtime;
    globalThis.sdk_runtime = old;

    var map = null;

    var customModNum = 0; // 

    var guiEnabledElements = []



    
    var modPreSettings = {
        "flymod": {
            "name": "Fly Mod",
            "desc": "Use 'shift' + your controls to fly around!",
            "enabled": false,
            "url": "/public/projections3d/ModLoader/V1/flymod.js",
        },
        "chaos": {
            "name": "Chaos Mod",
            "desc": "Pure chaos. Use at your own risk.",
            "enabled": false,
            "url": "/public/projections3d/ModLoader/V1/chaos.js",
        },
        "gui": {
            "name": "Gui Mod",
            "desc": "Customize your HUD! Move around elements, right click to edit them, pause the game to enable/disable and add custom text nodes!",
            "enabled": false,
            "url": "/public/projections3d/ModLoader/V1/gui.js",
        },
        "hurricane": {
            "name": "Hurricane Mod",
            "desc": "Creates random wind for you to suffer in.",
            "enabled": false,
            "url": "/public/projections3d/ModLoader/V1/hurricane.js",
        }, 
        "levelselector": {
            "name": "Level Selector Mod",
            "desc": "Pick from all the levels and more!",
            "enabled": false,
            "url": "/public/projections3d/ModLoader/V1/levelselector.js",
        },
        "multiplayer": {
            "name": "Multiplayer Mod",
            "desc": "Play or speedrun against your friends!",
            "enabled": false,
            "url": "/public/projections3d/ModLoader/V1/multiplayerREALSKY.js",
        }, 
        "randomlevel": {
            "name": "Random Level Mod",
            "desc": "Use 'shift + y' to be taken to a random level.",
            "enabled": false,
            "url": "/public/projections3d/ModLoader/V1/randomlevel.js",
        }, 
        "savestate": {
            "name": "Save State Mod",
            "desc": "'Shift + s': Create Checkpoint <br/>'Shift + r': Return to Original Spawn<br/>'Shift + n': Bypass to next level<br/>'Shift + b': Bypass to previous level<br/>'Shift + m': Move to end flag<br/>'Shift + c': Move to coin",
            "enabled": false,
            "url": "/public/projections3d/ModLoader/V1/savestate.js",
        },  
        "customMod1": {
            "name": "who",
            "desc": "asked",
            "enabled": false,
            "url": "/public/projections3d/ModLoader/V1/savestate.js",
        },  
               
    }



    let isInLevel = () => {
        return runtime.running_layout.name.startsWith("Level")
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

    let styleMenuText = (textDiv, top, text) => {
        c = {
            backgroundColor: "white",
            border: "none",
            fontFamily: "Retron2000",
            position: "relative",
            top: top,
            //left: left.toString() + "px",
            //padding: "5px",
            color: "black",
            fontSize: "12pt",
            cursor: "default",
        };
        Object.keys(c).forEach(function (a) {
            textDiv.style[a] = c[a];
        });

        newContent = document.createTextNode(text);
        textDiv.appendChild(newContent);
    }

    let styleMenuButton = (button, left, top) => {
        c = {
            backgroundColor: "#00d26a",
            border: "solid",
            borderColor: "black",
            borderWidth: "2px",
            position: "relative",
            fontFamily: "Retron2000",
            color: "black",
            fontSize: "10pt",
            cursor: "pointer",
            left: left,
            top: top,
        };
        Object.keys(c).forEach(function (a) {
            button.style[a] = c[a];
        });

        button.innerHTML = "✅";
    }

    let editCustomMod = (editing=null, name="", code="", desc="") => {
        menuAddBg = document.createElement("div")
        c = {
            backgroundColor: "white",
            border: "solid",
            borderColor: "black",
            borderWidth: "2px",
            fontFamily: "Retron2000",
            position: "absolute",
            cursor: "default",
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
            menuAddBg.style[a] = c[a];
        });

        //X button CSS
        xAddingButton = document.createElement("button");
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
            xAddingButton.style[a] = c[a];
        });

        xAddingButton.innerHTML = "❌";

        xAddingButton.onclick = function() {
            menuAddBg.remove();
            enableClick(map);
        }

        //Title
        titleText = document.createElement("div");
        c = {
            backgroundColor: "white",
            border: "none",
            fontFamily: "Retron2000",
            position: "absolute",
            top: "2%",
            left: "25%",
            color: "black",
            fontSize: "22pt",
            cursor: "default",
            textAlign: "center",
        };
        Object.keys(c).forEach(function (a) {
            titleText.style[a] = c[a];
        });

        newContent = document.createTextNode("Edit Custom Mod");
        titleText.appendChild(newContent);

        modName = document.createElement("div");
        
        styleMenuText(modName, "15%", "Mod Name: ")
        modName.style.position = "absolute";


        modNameInput = document.createElement("input");
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
            width: "80px",
            top: "15%",
            left: "20%",
        };
        Object.keys(c).forEach(function (a) {
            modNameInput.style[a] = c[a];
        });
        modNameInput.value = name;

        modNameInput.onclick = (e) => {
            console.log("please");
            e.stopImmediatePropagation()
            e.stopPropagation();
            e.preventDefault();
            modNameInput.focus()
        }
        modNameInput.onkeydown = (e) => {
            console.log("pleasev2");
            e.stopImmediatePropagation()
            e.stopPropagation();
        };




        modSrcText = document.createElement("div");
        console.log(menuAddBg.offsetHeight)
        styleMenuText(modSrcText, "23%", "Mod Code: ")
        modSrcText.style.position = "absolute";

        modSrc = document.createElement("TEXTAREA");
        modSrc.rows = "7";
        modSrc.cols = "30";
        modSrc.value = code;

        c = {
            fontFamily: "Retron2000",
            position: "absolute",
            top: "28%",
            color: "black",
            fontSize: "10pt",
            cursor: "text",
        };
        Object.keys(c).forEach(function (a) {
            modSrc.style[a] = c[a];
        });
        modSrc.onclick = (e) => {
            console.log("please");
            e.stopImmediatePropagation()
            e.stopPropagation();
            e.preventDefault();
            modSrc.focus()
        }
        modSrc.onkeydown = (e) => {
            console.log("pleasev2");
            e.stopImmediatePropagation()
            e.stopPropagation();
        };



        modDescText = document.createElement("div");

        styleMenuText(modDescText, "58%", "Mod Description: ")
        modDescText.style.position = "absolute";

        modDesc = document.createElement("TEXTAREA");
        modDesc.rows = "4";
        modDesc.cols = "20";
        modDesc.value = desc;
        c = {
            fontFamily: "Retron2000",
            position: "absolute",
            top: "63%",
            color: "black",
            fontSize: "10pt",
            cursor: "text",
        };
        Object.keys(c).forEach(function (a) {
            modDesc.style[a] = c[a];
        });
        modDesc.onclick = (e) => {
            console.log("please");
            e.stopImmediatePropagation()
            e.stopPropagation();
            e.preventDefault();
            modDesc.focus()
        }
        modDesc.onkeydown = (e) => {
            console.log("pleasev2");
            e.stopImmediatePropagation()
            e.stopPropagation();
        };


        saveModButton = document.createElement("button");
        c = {
            backgroundColor: "lawngreen",
            borderRadius: "25px",
            border: "lawngreen",
            padding: "8px",
            position: "absolute",
            fontFamily: "Retron2000",
            color: "white",
            fontSize: "10pt",
            cursor: "pointer",
            left: "50%",
            bottom: "2%",

        };
        Object.keys(c).forEach(function (a) {
            saveModButton.style[a] = c[a];
        });

        saveModButton.innerHTML = "Save";
        saveModButton.id = "add-mod-btn";

        saveModButton.onclick = function() {

            if(editing === null) {
                if(modNameInput.value !== "" && modSrc.value !== "") {
                    customModNum++;
    
                    // let js = document.createElement("script");
                    // js.type = "application/javascript";
                    // tpl = eval('`' + modSrc.value + '`');
        
                    // js.text = tpl;
                    // document.head.appendChild(js);
        
                    modSettings = JSON.parse(localStorage.getItem('modSettings'));
                    modSettings["customMod" + customModNum] = {
                        "name": modNameInput.value,
                        "desc": modDesc.value,
                        "enabled": false,
                        "url": eval('`' + modSrc.value + '`'),
                    }
                    localStorage.setItem('modSettings', JSON.stringify(modSettings));
        
                    menuAddBg.remove();
                    createModLoaderMenu();
        
                    document.getElementById("customMod" + customModNum + "List").click();

                }
            
            
            } else {
                modSettings = JSON.parse(localStorage.getItem('modSettings'));
                modSettings[editing] = {
                    "name": modNameInput.value,
                    "desc": modDesc.value,
                    "enabled": modSettings[editing]["enabled"],
                    "url": eval('`' + modSrc.value + '`'),
                }
                localStorage.setItem('modSettings', JSON.stringify(modSettings));
    
                menuAddBg.remove();
                createModLoaderMenu();
    
                document.getElementById(editing + "List").click();

            }

            

        }

        // enableButton = document.createElement("button");
        // styleMenuButton(enableButton, "90%", "25%");
        // enableButton.style.position = "absolute";
        // enableButton.onclick = function() {
        //     console.log("clicked")
        //     console.log(modSrc.value);
        //     let js = document.createElement("script");
        //     js.type = "application/javascript";
        //     tpl = eval('`' + modSrc.value + '`');

        //     js.text = tpl;
        //     document.head.appendChild(js);
        // }

        
        menuAddBg.appendChild(titleText);
        menuAddBg.appendChild(xAddingButton);
        menuAddBg.appendChild(saveModButton)

        menuAddBg.appendChild(modSrc)
        menuAddBg.appendChild(modSrcText)

        menuAddBg.appendChild(modName)
        menuAddBg.appendChild(modNameInput)

        menuAddBg.appendChild(modDescText)
        menuAddBg.appendChild(modDesc)




        document.body.append(menuAddBg);


    }




    let createModLoaderMenu = () => {
        //Create background div
        menuBg = document.createElement("div")
        c = {
            backgroundColor: "white",
            border: "solid",
            borderColor: "black",
            borderWidth: "2px",
            fontFamily: "Retron2000",
            position: "absolute",
            cursor: "default",
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
            menuBg.style[a] = c[a];
        });

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
            menuBg.remove();
            enableClick(map);
        }

        modInfo = document.createElement("div")
        c = {
            backgroundColor: "white",
            border: "solid",
            borderColor: "black",
            borderWidth: "2px",
            fontFamily: "Retron2000",
            position: "absolute",
            cursor: "default",
            top: "-1px",
            left: "20%",
            padding: "0px",
            color: "black",
            fontSize: "12pt",
            display: "block",
            width: "80%",
            height: "99.5%",
            
        };
        Object.keys(c).forEach(function (a) {
            modInfo.style[a] = c[a];
        });

        //Title
        titleText = document.createElement("div");
        c = {
            backgroundColor: "white",
            border: "none",
            fontFamily: "Retron2000",
            position: "relative",
            top: "2%",
            //left: "35%",
            color: "black",
            fontSize: "22pt",
            cursor: "default",
            textAlign: "center",
        };
        Object.keys(c).forEach(function (a) {
            titleText.style[a] = c[a];
        });
        titleText.id = "title-text";
        newContent = document.createTextNode("Mod Menu");
        titleText.appendChild(newContent);


        addModButton = document.createElement("button");
        c = {
            backgroundColor: "lawngreen",
            borderRadius: "25px",
            border: "lawngreen",
            padding: "8px",
            position: "absolute",
            fontFamily: "Retron2000",
            color: "white",
            fontSize: "10pt",
            cursor: "pointer",
            left: "40%",
            bottom: "2%",

        };
        Object.keys(c).forEach(function (a) {
            addModButton.style[a] = c[a];
        });

        addModButton.innerHTML = "Add Mod";
        addModButton.id = "add-mod-btn";

        addModButton.onclick = function() {
            menuBg.remove();
            editCustomMod();
        }

        editModButton = document.createElement("button");
        c = {
            backgroundColor: "blue",
            borderRadius: "25px",
            border: "blue",
            padding: "8px",
            position: "absolute",
            fontFamily: "Retron2000",
            color: "white",
            fontSize: "10pt",
            cursor: "pointer",
            left: "5%",
            bottom: "2%",
            display: "none",

        };
        Object.keys(c).forEach(function (a) {
            editModButton.style[a] = c[a];
        });

        editModButton.innerHTML = "Edit Mod";
        editModButton.id = "edit-mod-btn";

        

        deleteModButton = document.createElement("button");
        c = {
            backgroundColor: "red",
            borderRadius: "25px",
            border: "red",
            padding: "8px",
            position: "absolute",
            fontFamily: "Retron2000",
            color: "white",
            fontSize: "10pt",
            cursor: "pointer",
            right: "5%",
            bottom: "2%",
            display: "none",

        };
        Object.keys(c).forEach(function (a) {
            deleteModButton.style[a] = c[a];
        });

        deleteModButton.innerHTML = "Delete Mod";
        deleteModButton.id = "delete-mod-btn";

        deleteModButton.onclick = function() {
            menuBg.remove();
            editCustomMod(); //fix this
        }


        
        //Create mod scroll div
        modScroll = document.createElement("div")
        c = {
            backgroundColor: "white",
            border: "solid",
            borderColor: "black",
            borderWidth: "2px",
            fontFamily: "Retron2000",
            position: "absolute",
            cursor: "default",
            top: "-1px",
            left: "-1px",
            padding: "0px",
            color: "black",
            fontSize: "12pt",
            display: "block",
            width: "20%",
            height: "99.5%",
        };
        Object.keys(c).forEach(function (a) {
            modScroll.style[a] = c[a];
        });




        modsList = document.createElement('ul');
        c = {
            listStyleType: "none",
            fontFamily: "Retron2000",
            position: "absolute",
            cursor: "default",
            color: "black",
            fontSize: "10pt",
            
            
        };
        Object.keys(c).forEach(function (a) {
            modsList.style[a] = c[a];
        });
        modInfo.appendChild(titleText);
        modInfo.appendChild(addModButton);
        modInfo.appendChild(editModButton);
        modInfo.appendChild(deleteModButton);




        modSettings = JSON.parse(localStorage.getItem('modSettings'));
        for (const [key] of Object.entries(modSettings)) {
            console.log(key)
            li = document.createElement("li");
            li.style.border = "1px solid black";
            li.style.borderLeftStyle = "none";
            li.style.cursor = "pointer"
            li.id = key + "List";
            // li.style.listStylePosition = "inside"; 
            li.innerText = modSettings[key]["name"];
            modsList.appendChild(li);
            li.onclick = function() {
                console.log("hi")
                //li.style.backgroundColor = "#d3d3d3"
                try {
                    modInfo.removeChild(document.getElementById("desc-text"));
                    modInfo.removeChild(document.getElementById("enable-text"));
                    modInfo.removeChild(document.getElementById("enable-btn"));
                } catch (err) {
                    console.log(err);
                }

                editModButton.style.display = "none"
                deleteModButton.style.display = "none"
                if(key.startsWith("customMod")) {
                    editModButton.style.display = "block"
                    deleteModButton.style.display = "block"

                    editModButton.onclick = function() {
                        menuBg.remove();
                        editCustomMod(key, modSettings[key]["name"], modSettings[key]["url"], modSettings[key]["desc"]);
                    }

                    deleteModButton.onclick = function() {

                        modSettings = JSON.parse(localStorage.getItem('modSettings'));
                        if(modSettings[key]["enabled"]) {
                            delete modSettings[key];
                            localStorage.setItem('modSettings', JSON.stringify(modSettings));
                            location.reload()
                        } else {
                            delete modSettings[key];
                            localStorage.setItem('modSettings', JSON.stringify(modSettings));
                        }
                        menuBg.remove();
                        
                        
                    }
                } 
                



                titleText.innerHTML = modSettings[key]["name"];
                
                descText = document.createElement("div");
                descText.id = "desc-text";
                styleMenuText(descText, "10%", modSettings[key]["desc"])
                descText.innerHTML = modSettings[key]["desc"];
                //descText.style.position = "relative";
                descText.style.textAlign = "center";
                modInfo.appendChild(descText);

                enableText = document.createElement("div");
                enableText.id = "enable-text";
                console.log((parseFloat(descText.style.top) / 100), modInfo.offsetHeight, descText.offsetHeight)

                styleMenuText(enableText, (((parseFloat(descText.style.top) / 100) * modInfo.offsetHeight) + 20) + "px", "Enabled:") // + descText.offsetHeight
                enableText.style.width = "70px";
                //enableText.style.position = "relative";
                enableText.style.left = "30%";
                modInfo.appendChild(enableText);

                enableButton = document.createElement("button");
                enableButton.id = "enable-btn";

                styleMenuButton(enableButton, (((parseFloat(enableText.style.left) / 100) * modInfo.offsetWidth) + enableText.offsetWidth + 10) + "px", (parseInt(enableText.style.top) - 20) + "px");
                modSettings = JSON.parse(localStorage.getItem('modSettings'));
                if(!modSettings[key]["enabled"]) { //false
                    enableButton.style.backgroundColor = "white";
                    enableButton.innerHTML = "⬜";
                } else {
                    enableButton.style.backgroundColor = "#00d26a";
                    enableButton.innerHTML = "✅";
                }

                enableButton.onclick = function() {
                    if(enableButton.style.backgroundColor === "white") {

                        console.log(!!!document.getElementById(key))
                        enableButton.style.backgroundColor = "#00d26a";
                        enableButton.innerHTML = "✅";
                        if(!!!document.getElementById(key)) { // mod hasnt been put in mem
                            console.log('sadghyfisatdgifuygasdyifg')
                            modSettings = JSON.parse(localStorage.getItem('modSettings'));
                            js = document.createElement("script");
                            js.type = "application/javascript";
                            if(key.startsWith("customMod")) {
                                js.text = modSettings[key]["url"];
                            } else {
                                js.src = modSettings[key]["url"];
                            }
                            js.id = key;
                            document.head.appendChild(js);
            
    
                            modSettings = JSON.parse(localStorage.getItem('modSettings'));
                            modSettings[key]["enabled"] = true;
                            localStorage.setItem('modSettings', JSON.stringify(modSettings));
                        } else {
                            modSettings = JSON.parse(localStorage.getItem('modSettings'));
                            modSettings[key]["enabled"] = true;
                            localStorage.setItem('modSettings', JSON.stringify(modSettings));

                            
                            notify("Mod Enabled")
                            
                            
                            // TODO - PUT ENABLI NG MOD STUFF HERE

                            if(key === "gui") {
                                document.querySelectorAll('.gui').forEach(element => {
                                    element.style.display = "block";
                                    if(guiEnabledElements.includes(element)) { // mods that user disabled
                                        element.style.display = "none";
                                    }
                                });
                            }
                            else if(key === "levelselector") {
                                document.getElementById("ovo-levelselector-toggle-button").style.display = "block"
                            }

                            else if(key === "multiplayer") {
                                document.getElementById("ovo-multiplayer-container").style.display = "block";
                                document.getElementById("ovo-multiplayer-toggle-button").style.display = "block";
                                if(runtime.running_layout.name == "Main Menu") {
                                    runtime.changelayout = runtime.layouts["Main Menu"];
                                }
                            }
                        }

                        
                    } else {
                        enableButton.style.backgroundColor = "white";
                        enableButton.innerHTML = "⬜";

                        modSettings = JSON.parse(localStorage.getItem('modSettings'));
                        modSettings[key]["enabled"] = false;
                        localStorage.setItem('modSettings', JSON.stringify(modSettings));
                        
                        


                        if(key.startsWith("customMod") || key === "chaos") {
                            console.log(document.getElementById(key))
                            window[document.getElementById(key)] = undefined;

                            document.getElementById(key).remove();
                            console.log(document.getElementById(key))
                            

                            location.reload(true);

                        } else {
                            // TODO - PUT DISABLING MOD STUFF HERE
                            console.log(key)

                            if(key === "gui") {
                                document.querySelectorAll('.gui').forEach(element => {
                                    if(element.style.display === "none") { // mods that user disabled
                                        guiEnabledElements.push(element)
                                    }
                                    element.style.display = "none";
                                });
                                //document.getElementById("toggle-elements-btn").style.display = "none";
                            }

                            else if(key === "levelselector") {
                                document.getElementById("ovo-dummy-div").click();
                            }
                            else if(key === "multiplayer") {
                                document.getElementById("ovo-multiplayer-container").style.display = "none";
                                document.getElementById("ovo-multiplayer-toggle-button").style.display = "none";
                                console.log(runtime.running_layout.name)
                                if(runtime.running_layout.name == "Main Menu") {
                                    runtime.changelayout = runtime.layouts["Main Menu"];
                                }
                            }
                        }
                        
                        
                        


                        
                        notify("Mod disabled")


                        
                    }
                }
                    
                modInfo.appendChild(enableButton);

                

                    //styleMenuText(document.getElementById("enable-text"), (((parseFloat(descText.style.top) / 100) * modInfo.offsetHeight) + descText.offsetHeight) + "px", "Enabled:")

                    //document.getElementById("enable-text").innerHTML = modSettings[key]["enable"];
                }
                

            }
        
        


        
        
        menuBg.appendChild(modScroll);
        modScroll.appendChild(modsList);

        menuBg.appendChild(modInfo);



        menuBg.appendChild(xButton);
        document.body.appendChild(menuBg);
        

    }




    let createModLoaderMenuBtn = () => {
        menuButton = document.createElement("button");
        c = {
            background: "url(https://cdn-icons-png.flaticon.com/512/2099/2099192.png)",
            backgroundSize: "cover", //or contain
            border: "none", //2p solid black
            position: "absolute",
            cursor: "pointer",
            left: "8px",
            top: "4px",
            width: "75px",
            height: "75px",
            display: "block",
        };
        Object.keys(c).forEach(function (a) {
            menuButton.style[a] = c[a];
        });
        menuButton.id = "menu-button";


        menuButton.onclick = function() {
            map = disableClick();
            createModLoaderMenu();
            //console.log(document.getElementById('mod-menu-bg'))
        }
        document.body.appendChild(menuButton);
    
    }

    


    let cleanModLoader = {
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
            localStorage.removeItem('modSettings');
            if(localStorage.getItem('modSettings') === null) {
                localStorage.setItem('modSettings', JSON.stringify(modPreSettings));
            }
            modSettings = JSON.parse(localStorage.getItem('modSettings'));
            for (const [key] of Object.entries(modSettings)) {
                console.log(key)
                if(modSettings[key]["enabled"]) {
                    js = document.createElement("script");
                    js.type = "application/javascript";
                    js.src = modSettings[key]["url"];
                    js.id = key;
                    document.head.appendChild(js);
                }
            }

            createModLoaderMenuBtn();


            
            
            
            
                



            runtime.tickMe(this);

            notify("QOL Loader", "by Awesomeguy & chas", "https://cdn3.iconfinder.com/data/icons/work-life-balance-glyph-1/64/quality-of-life-happiness-heart-512.png");


        },

        

        
      
        
        
        tick() {
            //let playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
            //let player = playerInstances[0];
            
            try {
                if(!isInLevel() && document.getElementById("menu-button").style.display === "none") {
                    document.getElementById("menu-button").style.display = "block";
                    console.log("hello")
                } else if(isInLevel() && document.getElementById("menu-button").style.display === "block") {
                    document.getElementById("menu-button").style.display = "none";
                }
                
                
                
                

                

                
                

                
            } catch (err) {
                console.log(err);
            }
        }
    };
  
    cleanModLoader.init();
})();