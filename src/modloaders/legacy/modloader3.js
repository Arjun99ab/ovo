(function() {
    console.log(VERSION.version());

    let version = VERSION.version() //1.4, 1.4.4, or CTLE
    if(version === "1.4") {
        timers = [500, 5000]
    } else { //1.4.4 or CTLE
        timers = [100, 2000]
    }
    var runtime;

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    let onFinishLoad = () => {
        if ((cr_getC2Runtime() || {isloading: true}).isloading) {
            setTimeout(onFinishLoad, timers[0]);
        } else {
            if(version === "1.4") {
                var Retron2000 = new FontFace('Retron2000', 'url(./retron2000.ttf)');
                Retron2000.load().then(function(loaded_face) {
                    document.fonts.add(loaded_face);
                    document.body.style.fontFamily = '"Retron2000", Arial';
                console.log("123123")
                }).catch(function(error) {
                    console.log(error)
                });
                runtime = cr_getC2Runtime();

                let old = globalThis.sdk_runtime;
                c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
                //runtime = globalThis.sdk_runtime;
                globalThis.sdk_runtime = old;
            } else { //1.4.4 or CTLE
                runtime = cr_getC2Runtime();
            }
            sleep(timers[1]).then(() => {
                cleanModLoader.init();
            });
        }
    }

    //general 
    var map = null;
    var map2 = null;

    var customModNum = 0; 
    
    var speedy_boi = 1;

    var guiEnabledElements = []

    var globalModsEnabled = []
    

    
    
    



    let isInLevel = () => {
        return runtime.running_layout.name.startsWith("Level")
    };
    let isPaused = () => {
        if (isInLevel()) return runtime.running_layout.layers.find(function(a) {
            return "Pause" === a.name
        }).visible
    };
    
    let closePaused = () => {
        if (isInLevel()) return runtime.running_layout.layers.find(function(a) {return "Pause" === a.name}).visible = false
    }



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
            console.log(behavior.scroll.isEnabled)
            map.push({
              inst,
              oldState: behavior.scroll.isEnabled,
            });
            behavior.scroll.isEnabled = false;
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
          inst.scroll.isEnabled = inst.scroll.isEnabled ? 1 : x.oldState;
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
            // console.log(behavior)
            // console.log(behavior.isEnabled)
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
            backgroundColor: "rgb(45, 186, 47)",
            borderRadius: "25px",
            border: "rgb(45, 186, 47)",
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

            //map = disableClick()

            if(editing === null) {
                if(modNameInput.value !== "" && modSrc.value !== "") {
                    customModNum++;
                    console.log("brand new mod")
    
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
                        "url": modSrc.value, //eval('`' + modSrc.value + '`'),
                    }
                    localStorage.setItem('modSettings', JSON.stringify(modSettings));
        
                    menuAddBg.remove();
                    createModLoaderMenu();
        
                    document.getElementById("customMod" + customModNum + "List").click();

                }
            
            
            } else {
                console.log("editie mod")

                modSettings = JSON.parse(localStorage.getItem('modSettings'));
                modSettings[editing] = {
                    "name": modNameInput.value,
                    "desc": modDesc.value,
                    "enabled": modSettings[editing]["enabled"],
                    "url": modSrc.value,
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

    let createConfirmMenu = () => {
        //Create background div
        let confirmBg = document.createElement("div");
        confirmBg.id = "confirm-bg";

        c = {
            display: "block",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "solid",
            borderColor: "black",
            borderWidth: "2px",
            fontFamily: "Retron2000",
            cursor: "default",
            color: "black",
            fontSize: "10pt",
            width: "35%",
            // height: "15%",
            overflow: "auto",
            margin: "0",
            padding: "5px",
        };
        Object.keys(c).forEach(function (a) {
            confirmBg.style[a] = c[a];
        });

        infoText = document.createElement("div");
        infoText.id = "asd";

        c = {
            backgroundColor: "white",
            border: "none",
            fontFamily: "Retron2000",
            // position: "relative",
            // top: "2%",
            // left: "25%",
            textAlign: "center",
            //padding: "5px",
            color: "black",
            fontSize: "13pt",
            cursor: "default",
        };
        Object.keys(c).forEach(function (a) {
            infoText.style[a] = c[a];
        });

        content = document.createTextNode("This mod requires a reload to disable.");
        infoText.appendChild(content);
        
        // Create buttons container
        let buttonsContainer = document.createElement("div");
        buttonsContainer.style.display = "flex";
        buttonsContainer.style.flexWrap = "wrap";
        buttonsContainer.style.justifyContent = "center";
        buttonsContainer.style.alignItems = "center";
        buttonsContainer.style.marginTop = "15px";
        buttonsContainer.style.marginBottom = "10px";
        buttonsContainer.style.gap = "10px";
        // buttonsContainer.style.position = "relative";

        // Create confirm button
        let confirmButton = document.createElement("button");
        confirmButton.innerHTML = "Reload now";
        confirmButton.style.fontFamily = "Retron2000";
        confirmButton.style.fontSize = "14pt";
        confirmButton.style.backgroundColor = "rgb(45, 186, 47)";
        confirmButton.style.color = "white";
        confirmButton.style.border = "none";
        confirmButton.style.padding = "5px 10px";
        confirmButton.style.cursor = "pointer";
        confirmButton.onclick = function() {
            location.reload();
        };

        // Create cancel button
        let cancelButton = document.createElement("button");
        cancelButton.innerHTML = "Reload later";
        cancelButton.style.fontFamily = "Retron2000";
        cancelButton.style.fontSize = "14pt"
        cancelButton.style.backgroundColor = "rgb(222, 48, 51)";
        cancelButton.style.color = "white";
        cancelButton.style.border = "none";
        cancelButton.style.padding = "5px 10px";
        cancelButton.style.cursor = "pointer";
        cancelButton.onclick = function() {
            console.log("cancel");

            confirmBg.remove();
            document.getElementById("menu-bg").style.pointerEvents = "auto";
            document.getElementById("menu-bg").style.filter = "none";
            document.getElementById("c2canvasdiv").style.filter = "none";

            
            // enableClick(map);   
        };

        // Append buttons to the buttons container
        buttonsContainer.appendChild(confirmButton);
        buttonsContainer.appendChild(cancelButton);


        confirmBg.appendChild(infoText);
        confirmBg.appendChild(buttonsContainer);
        

        // confirmBg.appendChild(xButton);
        document.body.appendChild(confirmBg);
    }
    



    let createModLoaderMenu = () => {
        //Create background div
        menuBg = document.createElement("div")
        c = {
            justifyContent: "center",
            alignItems: "center",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "solid",
            borderColor: "black",
            borderWidth: "2px",
            fontFamily: "Retron2000",
            position: "absolute",
            cursor: "default",
            padding: "5px",
            color: "black",
            fontSize: "10pt",
            display: "block",
            width: "35%",
            height: "65%",
            overflowY: "auto",
            overflowX: "hidden",
        };
        Object.keys(c).forEach(function (a) {
            menuBg.style[a] = c[a];
        });
        menuBg.id = "menu-bg";

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
        xButton.id = "x-button";

        xButton.onclick = function() {
            menuBg.remove();
            enableClick(map);

            if(parseInt((playerXSpeedInput.value)) !== 1) {
                speedy_boi = parseInt((playerXSpeedInput.value))
                console.log(speedy_boi)

                globalModsEnabled.push("speed")
            } else {
                globalModsEnabled = globalModsEnabled.filter(e => e !== "speed")
            }
            tempGlobalModsEnabled = globalModsEnabled.filter(e => e !== "gui" && e !== "darkmode")
            console.log(tempGlobalModsEnabled)
            if(tempGlobalModsEnabled.length === 0) {
                document.getElementById("cheat-indicator").style.display = "none";
            } else {
                document.getElementById("cheat-indicator").style.display = "block";
            }

        }


        hubButton = document.createElement("button");
        c = {
            background: "url(https://cdn-icons-png.flaticon.com/512/826/826070.png)",
            backgroundSize: "cover", //or contain
            border: "none", //2p solid black
            position: "absolute",
            cursor: "pointer",
            left: "4px",
            top: "4px",
            width: "45px",
            height: "45px",
            display: "block",
        };
        Object.keys(c).forEach(function (a) {
            hubButton.style[a] = c[a];
        });


        hubButton.onclick = function() {
            window.location.href = '../';   
        }



        homeButton = document.createElement("button");
        c = {
            background: "url(https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Home-icon.svg/2048px-Home-icon.svg.png)",
            backgroundSize: "cover", //or contain
            border: "none", //2p solid black
            position: "absolute",
            cursor: "pointer",
            right: "24px",
            top: "4px",
            width: "40px",
            height: "40px",
            display: "block",
        };
        Object.keys(c).forEach(function (a) {
            homeButton.style[a] = c[a];
        });


        homeButton.onclick = function() {
            xButton.click()
            menuButton.click()
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

        modInfo.addEventListener('wheel', (e) => {
            console.log("hello)")
            e.stopImmediatePropagation()
            e.stopPropagation();
            // e.preventDefault();
            modInfo.focus();
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
            backgroundColor: "#065a82",
            borderRadius: "25px",
            border: "lawngreen",
            padding: "8px",
            position: "absolute",
            fontFamily: "Retron2000",
            color: "white",
            fontSize: "10pt",
            cursor: "pointer",
            left: "35%",
            bottom: "2%",

        };
        Object.keys(c).forEach(function (a) {
            addModButton.style[a] = c[a];
        });

        addModButton.innerHTML = "Add Custom Mod";
        addModButton.id = "add-mod-btn";

        addModButton.onclick = function() {
            menuBg.remove();
            editCustomMod();
            console.log(map)
            //map = disableClick();
        }

        editModButton = document.createElement("button");
        c = {
            backgroundColor: "#00ABE7",
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
            backgroundColor: "#DE3033",
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



        generalInfo = document.createElement("div")
        styleMenuText(generalInfo, "3%", "123");
        generalInfo.style.position = "relative"
        generalInfo.style.color = 'black';
        generalInfo.style.left = '0%';
        generalInfo.style.fontSize = "10pt" 
        generalInfo.innerHTML = "By Awesomeguy<br/><br/>Use '~' (above tab) to quickly open!<br/><br/><b><u>About</u></b><br/>A one of a kind UI based modloader<br/>Enable mods via the sidebar<br/>Add custom mods with the button below<br/>If you can, a star would be appreciated on <a href='https://github.com/Arjun99ab/ovo' target='_blank'>GitHub<a><br/>Have fun!"
        generalInfo.style.textAlign = "center";

        
        playerXSpeedText = document.createElement("div");
        
        styleMenuText(playerXSpeedText, "6%", "X Speed: ")
        playerXSpeedText.style.position = "relative";
        playerXSpeedText.style.left = "2px"

        playerXSpeedInput = document.createElement("input");
        c = {
            backgroundColor: "white",
            border: "solid",
            borderColor: "black",
            borderWidth: "2px",
            position: "relative",
            fontFamily: "Retron2000",
            color: "black",
            fontSize: "10pt",
            cursor: "text",
            width: "40px",
            top: "2%",
            left: "20%",
        };
        Object.keys(c).forEach(function (a) {
            playerXSpeedInput.style[a] = c[a];
        });

        playerXSpeedInput.onclick = (e) => {
            console.log("please");
            e.stopImmediatePropagation()
            e.stopPropagation();
            e.preventDefault();
            playerXSpeedInput.focus()
        }
        playerXSpeedInput.onkeydown = (e) => {
            console.log("pleasev2");
            e.stopImmediatePropagation()
            e.stopPropagation();
        };



        // playerYSpeedText = document.createElement("div");
        
        // styleMenuText(playerYSpeedText, "52%", "Y Speed: ")
        // playerYSpeedText.style.position = "absolute";
        // playerYSpeedText.style.left = "2px"

        // playerYSpeedInput = document.createElement("input");
        // c = {
        //     backgroundColor: "white",
        //     border: "solid",
        //     borderColor: "black",
        //     borderWidth: "2px",
        //     position: "absolute",
        //     fontFamily: "Retron2000",
        //     color: "black",
        //     fontSize: "10pt",
        //     cursor: "text",
        //     width: "40px",
        //     top: "52%",
        //     left: "23%",
        // };
        // Object.keys(c).forEach(function (a) {
        //     playerYSpeedInput.style[a] = c[a];
        // });

        // playerYSpeedInput.onclick = (e) => {
        //     console.log("please");
        //     e.stopImmediatePropagation()
        //     e.stopPropagation();
        //     e.preventDefault();
        //     playerYSpeedInput.focus()
        // }
        // playerYSpeedInput.onkeydown = (e) => {
        //     console.log("pleasev2");
        //     e.stopImmediatePropagation()
        //     e.stopPropagation();
        // };

        


        
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
            overflowY: "auto",
            // maxHeight: "150px",
        };
        Object.keys(c).forEach(function (a) {
            modScroll.style[a] = c[a];
        });

        modScroll.addEventListener('wheel', (e) => {
            console.log("hello)")
            e.stopImmediatePropagation()
            e.stopPropagation();
            // e.preventDefault();
            modScroll.focus();
          });




        modsList = document.createElement('ul');
        c = {
            listStyleType: "none",
            fontFamily: "Retron2000",
            position: "absolute",
            cursor: "default",
            color: "black",
            fontSize: "10pt",
            overflowY: "auto",
            // height: "100%",
            // maxHeight: "150px",

            
            
        };
        Object.keys(c).forEach(function (a) {
            modsList.style[a] = c[a];
        });
        modInfo.appendChild(titleText);
        modInfo.appendChild(addModButton);
        modInfo.appendChild(homeButton);
        modInfo.appendChild(hubButton);
        modInfo.appendChild(editModButton);
        modInfo.appendChild(deleteModButton);

        modInfo.appendChild(generalInfo)



        modInfo.appendChild(playerXSpeedText);
        modInfo.appendChild(playerXSpeedInput);

        playerXSpeedInput.value = speedy_boi


        // modInfo.appendChild(playerYSpeedText);
        // modInfo.appendChild(playerYSpeedInput);





        




        modSettings = JSON.parse(localStorage.getItem('modSettings'));
        for (const [key] of Object.entries(modSettings)) {
            console.log(key)
            li = document.createElement("li");
            li.style.border = "1px solid black";
            li.style.borderLeftStyle = "none";
            li.style.cursor = "pointer"
            li.id = key + "List";
            console.log(li.id);
            // li.style.listStylePosition = "inside"; 
            li.innerText = modSettings[key]["name"];
            modsList.appendChild(li);
            li.onclick = function() {
                console.log("hi")
                //li.style.backgroundColor = "#d3d3d3"
                try {
                    
                    modInfo.removeChild(document.getElementById("desc-text"));
                    // modInfo.removeChild(document.getElementById("enable-text"));
                    modInfo.removeChild(document.getElementById("enable-btn"));
                } catch (err) {
                    console.log(err);
                }

                try {
                    modInfo.removeChild(generalInfo);

                    modInfo.removeChild(playerXSpeedText);
                    modInfo.removeChild(playerXSpeedInput);

                    // modInfo.removeChild(playerYSpeedText);
                    // modInfo.removeChild(playerYSpeedInput);

                } catch (err) {
                    console.log(err);
                }

                editModButton.style.display = "none"
                deleteModButton.style.display = "none"
                addModButton.style.display = "none"
                if(key.startsWith("customMod")) {
                    editModButton.style.display = "block"
                    deleteModButton.style.display = "block"

                    editModButton.onclick = function() {
                        menuBg.remove();
                        editCustomMod(key, modSettings[key]["name"], modSettings[key]["url"], modSettings[key]["desc"]);
                    }

                    deleteModButton.onclick = function() { //only appears for custom mods
                        modSettings = JSON.parse(localStorage.getItem('modSettings'));
                        let modIndex = Object.keys(modSettings).indexOf(key);
                        if(modSettings[key]["enabled"]) {
                            delete modSettings[key];
                            localStorage.setItem('modSettings', JSON.stringify(modSettings));
                            location.reload()
                        } else {
                            delete modSettings[key];
                            localStorage.setItem('modSettings', JSON.stringify(modSettings));
                        }
                        menuBg.remove();
                        enableClick(map);
                        document.getElementById("menu-button").click();
                        document.getElementById(Object.keys(modSettings)[modIndex-1] + "List").click();
                        
                    }
                } 
                



                titleText.innerHTML = modSettings[key]["name"];
                
                descText = document.createElement("div");
                descText.id = "desc-text";
                styleMenuText(descText, "4%", modSettings[key]["desc"])
                descText.innerHTML = modSettings[key]["desc"];
                //descText.style.position = "relative";
                descText.style.textAlign = "center";
                modInfo.appendChild(descText);

                // enableText = document.createElement("div");
                // enableText.id = "enable-text";
                // console.log((parseFloat(descText.style.top) / 100), modInfo.offsetHeight, descText.offsetHeight)

                // styleMenuText(enableText, (((parseFloat(descText.style.top) / 100) * modInfo.offsetHeight) + 20) + "px", "Enabled:") // + descText.offsetHeight
                // enableText.style.width = "70px";
                // //enableText.style.position = "relative";
                // enableText.style.left = "30%";
                // modInfo.appendChild(enableText);

                enableButton = document.createElement("button");
                
                enableButton.id = "enable-btn";

                c = {
                    backgroundColor: "rgb(45, 186, 47)",
                    border: "solid",
                    borderColor: "black",
                    borderWidth: "2px",
                    borderRadius: "25px",
                    position: "relative",
                    fontFamily: "Retron2000",
                    color: "white",
                    fontSize: "10pt",
                    cursor: "pointer",
                    margin: "0 auto",
                    display: "block",
                    padding: "5px",

                    // left: left,
                    top: "8%",
                };
                Object.keys(c).forEach(function (a) {
                    enableButton.style[a] = c[a];
                });
        
                enableButton.innerHTML = "Disabled";

                // styleMenuButton(enableButton, (((parseFloat(enableText.style.left) / 100) * modInfo.offsetWidth) + enableText.offsetWidth + 10) + "px", (parseInt(enableText.style.top) - 20) + "px");
                modSettings = JSON.parse(localStorage.getItem('modSettings'));
                if(!modSettings[key]["enabled"]) { //false
                    enableButton.style.backgroundColor = "rgb(222, 48, 51)";
                    enableButton.innerHTML = "Disabled";
                    console.log(enableButton.style.backgroundColor)
                } else {
                    enableButton.style.backgroundColor = "rgb(45, 186, 47)";
                    enableButton.innerHTML = "Enabled";
                }

                enableButton.onclick = function() {

                    console.log(enableButton.style.backgroundColor === "rgb(222, 48, 51)")
                    if(enableButton.style.backgroundColor === "rgb(222, 48, 51)") { //if currently disabled
                        globalModsEnabled.push(key);
                        console.log(!!!document.getElementById(key))
                        enableButton.style.backgroundColor = "rgb(45, 186, 47)";
                        enableButton.innerHTML = "Enabled";
                        if(!!!document.getElementById(key)) { // mod hasnt been put in mem, custom mods are here by default
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

                            // if(key === "multiplayer") {
                            //     menuBg.remove();
                            //     enableClick(map);
                            // }
                        } else {
                            modSettings = JSON.parse(localStorage.getItem('modSettings'));
                            modSettings[key]["enabled"] = true;
                            localStorage.setItem('modSettings', JSON.stringify(modSettings));

                            
                            notify(modSettings[key]["name"] + " Enabled")
                            
                            
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
                                //menuBg.remove();
                                console.log("sduiygfguasyidgfdas???")
                                //enableClick(map);
                                // map = disableClick();
                            
                            } else if(key === "darkmode") {
                                document.getElementById("darkmode-div").style.display = "block";
                            }
                        }

                        
                    } else {
                        globalModsEnabled = globalModsEnabled.filter(e => e !== key);
                        enableButton.style.backgroundColor = "rgb(222, 48, 51)";
                        enableButton.innerHTML = "Disabled";

                        modSettings = JSON.parse(localStorage.getItem('modSettings'));
                        modSettings[key]["enabled"] = false;
                        localStorage.setItem('modSettings', JSON.stringify(modSettings));
                        
                        


                        if(key.startsWith("customMod") || key === "chaos" || key === "multiplayer" || key === "tas") {
                            //attempts to remove scripts from memory, but doesnt work
                            console.log(document.getElementById(key))
                            window[document.getElementById(key)] = undefined;

                            document.getElementById(key).remove();
                            console.log(document.getElementById(key))
                            
                            document.getElementById("menu-bg").style.pointerEvents = "none";
                            // document.getElementById("menu-bg").style.opacity = "0.75";
                            // document.getElementById("c2canvasdiv").style.opacity = "0.75";
                            document.getElementById("menu-bg").style.filter = "blur(1.2px)";
                            document.getElementById("c2canvasdiv").style.filter = "blur(1.2px)";
                            createConfirmMenu();
                            document.getElementById(key + "List").click();

                            // location.reload(true);

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
                                document.getElementById("toggle-elements-btn").style.display = "none";
                            }

                            else if(key === "levelselector") {
                                if(document.getElementById("ovo-dummy-div") !== null) {
                                    document.getElementById("ovo-dummy-div").click();
                                }
                            // }
                            // else if(key === "multiplayer") {
                            //     document.getElementById("ovo-multiplayer-container").style.display = "none";
                            //     document.getElementById("ovo-multiplayer-toggle-button").style.display = "none";
                            //     console.log(runtime.running_layout.name)
                            //     if(runtime.running_layout.name == "Main Menu") {
                            //         runtime.changelayout = runtime.layouts["Main Menu"];
                            //     }
                            //     menuBg.remove();
                            //     console.log("sduiygfguasyidgfdas???")
                            //     // enableClick(map);
                            //     document.getElementById("menu-button").click();
                            //     document.getElementById("multiplayerList").click();
                            //     // enableClick(map2);
                            //     // map = disableClick();
                            } else if(key === "darkmode") {
                                document.getElementById("darkmode-div").style.display = "none";
                            }
                            notify("Mod disabled")
                        }
                        
                        
                        


                        


                        
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
            backgroundColor: "white",
            border: "none", //2p solid black
            position: "absolute",
            cursor: "pointer",
            left: "4px",
            top: "2px",
            width: "100px",
            height: "100px",
            display: "block",
            zIndex: "2147483647",
        };
        Object.keys(c).forEach(function (a) {
            menuButton.style[a] = c[a];
        });
        menuButton.id = "menu-button";


        menuButton.onclick = function() {
            if(document.getElementById("menu-bg") === null) { //if menu doesnt exist, to avoid duplicates
                map = disableClick();
                createModLoaderMenu();
            }
        }
        document.body.appendChild(menuButton);
    
    }

    


    let cleanModLoader = {
        async init() {
            var b=document.createElement("div")
            c={backgroundColor:"rgba(150,10,1,0.8)",width:"5px",height:"5px",position:"absolute",bottom:"5px",right:"5px", zIndex:"2147483647", display:"none"}
            Object.keys(c).forEach(function(a){b.style[a]=c[a]})
            b.id = "cheat-indicator"
            document.body.appendChild(b)
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

            
            baseModsNames = []
            baseModsNames = await fetch('../src/mods/modloader/config/baseMods.json')
            .then((response) => response.json())
            .then(jsondata => {
                return jsondata;
            });
            if(version === "1.4.4" || version === "CTLE") {
                extra = await fetch('../src/mods/modloader/config/baseMods1.4.4.json')
                .then((response) => response.json())
                .then(jsondata => {
                    return jsondata;
                });
                if(version === "CTLE") {
                    extra = Object.assign({}, extra, await fetch('../src/mods/modloader/config/baseModsCTLE.json')
                    .then((response) => response.json())
                    .then(jsondata => {
                        return jsondata;
                    }));
                }
                baseModsNames = Object.assign({}, baseModsNames, extra)
            }
            
            console.log("baseMods")            
            console.log(baseModsNames) //VERSION SETTINGS

            //localStorage.removeItem('modSettings'); //reset settings

            if(localStorage.getItem('modSettings') === null) { //first time user, create default settings
                localStorage.setItem('modSettings', JSON.stringify(baseModsNames));
            }

            modSettings = JSON.parse(localStorage.getItem('modSettings')); //get USER settings
            console.log("modSettings real")
            console.log(modSettings) //USER SETTINGS

            

            //remove custom mods
            customMods = {}
            for (const [key] of Object.entries(modSettings)) {
                if(key.startsWith("customMod")) {
                    customMods[key] = modSettings[key];
                    delete modSettings[key];
                }
            }
            console.log("customMods")
            console.log(customMods)

            console.log("modSettings after removing custom mods")
            console.log(modSettings)
            console.log(Object.keys(modSettings).length + " " + Object.keys(baseModsNames).length)
            modsEnabled = []
            Object.keys(modSettings).forEach(function (modName) {
                if(modSettings[modName]["enabled"]) {
                    modsEnabled.push(modName)
                }
            });
            console.log("modsEnabled")
            console.log(modsEnabled)

            modSettings = baseModsNames;
            console.log("modSettings after adding/removing mods")
            console.log(modSettings)
            Object.keys(customMods).forEach(function (modName) {
                modSettings[modName] = customMods[modName];
                if(parseInt(modName.substring(9)) > customModNum) {
                    customModNum = parseInt(modName.substring(9)) + 1;
                    console.log(customModNum)
                }
            });
            console.log("modSettings after adding custom mods")
            console.log(modSettings)

            modsEnabled.forEach(function (modName) {
                if(modSettings[modName] !== undefined) { //make sure it exists in current version
                    modSettings[modName]["enabled"] = true;
                    globalModsEnabled.push(modName);
                }
            });
            console.log(globalModsEnabled)
            if(globalModsEnabled.filter(e => e !== "gui" && e !== "darkmode").length === 0) {
                document.getElementById("cheat-indicator").style.display = "none";
            } else {
                document.getElementById("cheat-indicator").style.display = "block";
            }

            //WALL OF FINAL SETTING
            //DONT MODIFY MODSETTINGS PAST THIS
            localStorage.setItem('modSettings', JSON.stringify(modSettings)); //set current mods, so it shows up correctly in menu
            for (const [key] of Object.entries(modSettings)) { // loading the mods in (create js), if the mod is said "enabled"
                console.log("hasdousd")
                if(modSettings[key]["enabled"]) {
                    console.log(key)
                    js = document.createElement("script");
                    js.type = "application/javascript";
                    if(key.startsWith("customMod")) {
                        js.text = modSettings[key]["url"];
                    } else {
                        js.src = modSettings[key]["url"];
                    }
                    js.id = key;
                    document.head.appendChild(js);
                    
                }
            }


            // for (const [key] of Object.entries(modSettings)) { // loading the mods in (create js), if the mod is said "enabled"
            //     console.log(key)
            //     if(!key.startsWith("customMod")) {
            //         currentModsNames.push(key)
            //     } else {
            //         if(parseInt(key.substring(9)) > customModNum) {
            //             customModNum = parseInt(key.substring(9)) + 1;
            //             console.log(customModNum)
            //         }
            //     }
            //     if(modSettings[key]["enabled"]) {
            //         // js = document.createElement("script");
            //         // js.type = "application/javascript";
            //         // if(key.startsWith("customMod")) {
            //         //     js.text = modSettings[key]["url"];
            //         // } else {
            //         //     js.src = modSettings[key]["url"];
            //         // }
            //         // js.id = key;
            //         // document.head.appendChild(js);
            //         modsEnabled.push(key)
            //     }
            // }

            // console.log(modsEnabled)

            // baseModsNames = []

            // //  data1 = null
            // console.log(version)
            // fetch('../src/mods/modloader/config/baseMods' + version + '.json')
            //     .then((response) => response.json())
            //     .then(jsondata => {
            //         console.log(jsondata) //version base mods by me
            //         for (const [key] of Object.entries(jsondata)) { //current global mods
            //             if(!key.startsWith("customMod")) {
            //                 baseModsNames.push(key);
            //             }
            //         }
            //         console.log(baseModsNames)
            //         console.log(currentModsNames)
            //         diffMods = baseModsNames
            //         .filter(x => !currentModsNames.includes(x))
            //         .concat(currentModsNames.filter(x => !baseModsNames.includes(x)));

            //         console.log(diffMods)

            //         diffMods.forEach(function (item) {
            //             if(currentModsNames.includes(item)) {
            //                 delete modSettings[item];
            //                 var index = currentModsNames.indexOf(item);
            //                 if (index !== -1) {
            //                     currentModsNames.splice(index, 1);
            //                 }
            //                 console.log(item)
            //             } 
            //             if(modsEnabled.includes(item)) {
            //                 var index = modsEnabled.indexOf(item);
            //                 if (index !== -1) {
            //                     modsEnabled.splice(index, 1);
            //                 }
            //                 delete modSettings[item];
            //             }
            //         });

            //         console.log(baseModsNames)
            //         console.log(modSettings)

            //         baseModsNames.forEach(function (item) {
            //             modSettings[item] = jsondata[item]
            //         });

            //         console.log(modSettings)

            //         console.log(currentModsNames)


            //         currentModsNames.forEach(function (item) {
            //             if(modsEnabled.includes(item)) {
            //                 modSettings[item]["enabled"] = true;  //TODO, PUT ANOTHER LOOP TO CREATE ALL OF THE SCRIPT ELEMENTS
            //             }
            //         });

            //         localStorage.setItem('modSettings', JSON.stringify(modSettings));

            //     });
            
            // modSettings = JSON.parse(localStorage.getItem('modSettings'));
            // console.log(modSettings)
            
            // for (const [key] of Object.entries(modSettings)) { // loading the mods in (create js), if the mod is said "enabled"
            //     console.log("hasdousd")
            //     if(modSettings[key]["enabled"]) {
            //         console.log(key)
            //         js = document.createElement("script");
            //         js.type = "application/javascript";
            //         if(key.startsWith("customMod")) {
            //             js.text = modSettings[key]["url"];
            //         } else {
            //             js.src = modSettings[key]["url"];
            //         }
            //         js.id = key;
            //         document.head.appendChild(js);
                    
            //     }
            // }
            
            
            createModLoaderMenuBtn();
            

            document.addEventListener("keydown", (event) => {
                this.keyDown(event)
                
            });
            document.addEventListener("keyup", (event) => {
                this.keyUp(event)
            });

            this.boolKeys = [false, false, false, false];



            

            let inputsObject = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Globals && x.instvar_sids.length === 6).instances[0];
            //inputsObject.instance_vars;
            console.log(inputsObject.instance_vars);
            this.movementKeys = (inputsObject.instance_vars).slice(0, 4); //Left, Up, Right, Down
            
            
            
                



            runtime.tickMe(this);

            notify("QOL Modloader", "by Awesomeguy", "https://cdn3.iconfinder.com/data/icons/work-life-balance-glyph-1/64/quality-of-life-happiness-heart-512.png");


        },

        keyDown(event) {
            
            // console.log(String.fromCharCode(event.keyCode));
            // console.log(cr.plugins_.Keyboard.prototype.cnds.OnKey() || cr.plugins_.Keyboard.prototype.cnds.OnKeyCode());
            // console.log(cr.plugins_.Keyboard.prototype.exps.StringFromKeyCode())
            // c2_callFunction("Controls > Buffer", ["Jump"]);
            if (this.movementKeys.includes(event.keyCode) && speedy_boi !== 1) {
                this.boolKeys[this.movementKeys.indexOf(event.keyCode)] = true
            }

            if(event.keyCode === 192) { //backtick
                if(document.getElementById("menu-bg") === null) { //menu doesnt exist
                    //create mod menu via tab
                    map = disableClick();
                    createModLoaderMenu(); 
                } else { //menu exists
                    //remove mod menu via tab
                    if(document.getElementById("confirm-bg") === null) {
                        document.getElementById("x-button").click();
                    }                
                    // menuBg.remove();
                    // enableClick(map);

                    // if(playerXSpeedInput.value !== 1) {
                    //     speedy_boi = parseInt((playerXSpeedInput.value))
                    //     console.log(speedy_boi)
                    //     globalModsEnabled.push("speed")
                    // } else {
                    //     globalModsEnabled = globalModsEnabled.filter(e => e !== "speed");
                    // }
                }
                 
            }
            
        },
      
        keyUp(event) {
            if (this.movementKeys.includes(event.keyCode)) {
                this.boolKeys[this.movementKeys.indexOf(event.keyCode)] = false
            }
            
        },

        

        
      
        
        
        tick() {
            playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
            player = playerInstances[0];
            
            try {

                if(this.boolKeys[2]) { // right key
                    player.x += speedy_boi
                } 
                if(this.boolKeys[0]) { // left key
                    player.x -= speedy_boi
                }

                if(!isInLevel() && document.getElementById("menu-button").style.top === "45%") {
                    document.getElementById("menu-button").style.top = "2px"
                    
                } else if(isPaused() && document.getElementById("menu-button").style.top === "2px"){
                    document.getElementById("menu-button").style.top = "45%"

                }
                if((!isInLevel() && document.getElementById("menu-button").style.display === "none") || (isPaused() && document.getElementById("menu-button").style.display === "none")) {
                    document.getElementById("menu-button").style.display = "block";
                    
                    console.log("hello")
                } else if((isInLevel() && document.getElementById("menu-button").style.display === "block") && (!isPaused() && document.getElementById("menu-button").style.display === "block")) {
                    document.getElementById("menu-button").style.display = "none";

                }
                
                
                
                

                

                
                

                
            } catch (err) {
                console.log(err);
            }
        }
    };
  
    setTimeout(onFinishLoad, timers[0]);
})();