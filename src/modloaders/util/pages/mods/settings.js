let createModSettingsPopup = (backendConfig, modId) => {
  //Create background div
  let modSettingsPopup = document.createElement("div");
  modSettingsPopup.id = "modSettingsPopup-bg";

  let c = {
      display: "flex",
      flexDirection: "column",
      // justifyContent: "center",
      // alignItems: "center",
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
      width: "auto",
      height: "auto",
      overflow: "auto",
      margin: "0",
      // padding: "10px",
      borderRadius: "10px",
  };
  Object.keys(c).forEach(function (a) {
    modSettingsPopup.style[a] = c[a];
  });

  

  //Title
  let titleText = document.createElement("div");
  c = {
      backgroundColor: "white",
      border: "none",
      fontFamily: "Retron2000",
      // position: "relative",
      // top: "2%",
      //left: "35%",
      color: "black",
      fontSize: "2.3vw",
      textAlign: "center",
      cursor: "default",
      padding: "10px",
      // textAlign: "center",
  };
  Object.keys(c).forEach(function (a) {
      titleText.style[a] = c[a];
  });
  titleText.id = "title-text";
  let newContent = document.createTextNode("Settings");
  titleText.appendChild(newContent);

  modSettingsPopup.appendChild(titleText);

  //X button CSS
  let xButton = document.createElement("button");
  c = {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "white",
    border: "none",
    fontFamily: "Retron2000",
    color: "black",
    fontSize: "2.3vw",
    cursor: "pointer",
  };
  Object.keys(c).forEach(function (a) {
      xButton.style[a] = c[a];
  });

  xButton.innerHTML = "❌";
  xButton.id = "x-button";

  xButton.onclick = function() {
    modSettingsPopup.remove();
    document.getElementById("menu-bg").style.pointerEvents = "auto";
    document.getElementById("menu-bg").style.filter = "none";
  }
  // navbar.appendChild(xButton);
  modSettingsPopup.appendChild(xButton);

  let modSettings = JSON.parse(localStorage.getItem('modSettings'));

  let settingsDiv = document.createElement("div");
  c = {
    display: "flex",
    // flex: "1",
    alignItems: "left",
    // justifyContent: "space-between",
    padding: "15px",
    // margin: "5px",
    flexDirection: "column",
    rowGap: "10px",
    // width: "10%",
    borderTop: "solid 3px black",

    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    // backgroundColor: "red",

    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    // backgroundColor: "red",
    // position: "sticky",
    // marginRight: "2%",
  }
  Object.keys(c).forEach(function (a) {
    settingsDiv.style[a] = c[a];
  });
  modSettings = JSON.parse(localStorage.getItem('modSettings'));
  Object.keys(backendConfig['mods'][modId]['settings']).forEach((setting) => {
    let settingRow
    if(backendConfig['mods'][modId]['settings'][setting]['type'] === "slider") {
      settingRow = createModSettingsSlider(modId, setting, modSettingsPopup);
    } else if(backendConfig['mods'][modId]['settings'][setting]['type'] === "keybind") {
      settingRow = createModSettingsSlider(modId, setting, modSettingsPopup);
    }
    settingsDiv.appendChild(settingRow);
  });
  
  modSettingsPopup.appendChild(settingsDiv);

  document.body.appendChild(modSettingsPopup);
}

let createModSettingsKeybind = (backendConfig, modId, setting, bg) => {
    let settingRow = document.createElement("div");
    settingRow.style.display = "flex";
    settingRow.style.flexDirection = "row";
    settingRow.style.justifyContent = "space-between";
    settingRow.style.alignItems = "center";
    settingRow.style.margin = "5px";
    settingRow.style.columnGap = "3vw";
    // settingRow.style.rowGap = "5vh";
  
  
    let settingText = document.createElement("p");
    settingText.innerHTML = backendConfig['mods'][modId]['settings'][setting]['name'] + ": ";
    settingText.style.fontSize = "1.8vw";
    settingText.style.margin = "0";
    settingText.style.padding = "0";
  
    // settingValue = document.createElement("p");
    // settingValue.innerHTML = modSettings['mods'][modId]['settings'][setting];
    // settingValue.style.fontSize = "1.8vw";
    // settingValue.style.margin = "0";
    // settingValue.style.padding = "0";
    // settingRow.appendChild(settingText);
    // settingRow.appendChild(settingValue);
    let modSettings = JSON.parse(localStorage.getItem('modSettings'));
  
    
        let settingInput = document.createElement("div");
        settingInput.innerHTML = modSettings['mods'][modId]['settings'][setting];
        settingInput.style.fontSize = "1.8vw";
        settingInput.style.margin = "0";
        settingInput.style.padding = "0";
        settingInput.style.border = "1px solid black";
        settingInput.style.width = "10vw";
        settingInput.style.height = "2vh";
        settingInput.style.display = "flex";
        settingInput.style.justifyContent = "center";
        settingInput.style.alignItems = "center";
        settingInput.style.cursor = "pointer";
  
        let keybind = modSettings['mods'][modId]['settings'][setting];
  
        settingInput.addEventListener('click', () => {
          settingInput.innerHTML = "Press any key";
          window.addEventListener('keydown', function keydown(e) {
            keybind = e.code;
            settingInput.innerHTML = keybind;
            console.log(keybind)
            // modSettings['mods'][modId]['settings'][setting] = keybind;
            // localStorage.setItem('modSettings', JSON.stringify(modSettings));
            window.removeEventListener('keydown', keydown);
          });
        });
  
        settingRow.appendChild(settingText);
        settingRow.appendChild(settingInput);
      return settingRow;
    }
  
  let createModSettingsSlider = (backendConfig, modId, setting, bg) => {
    let settingRow = document.createElement("div");
      settingRow.style.display = "flex";
      settingRow.style.flexDirection = "row";
      settingRow.style.justifyContent = "space-between";
      settingRow.style.alignItems = "center";
      settingRow.style.margin = "5px";
      settingRow.style.columnGap = "3vw";
      // settingRow.style.rowGap = "5vh";
  
  
      let settingText = document.createElement("p");
      settingText.innerHTML = backendConfig['mods'][modId]['settings'][setting]['name'] + ": ";
      settingText.style.fontSize = "1.8vw";
      settingText.style.margin = "0";
      settingText.style.padding = "0";
  
      let modSettings = JSON.parse(localStorage.getItem('modSettings'));
      let settingValue = document.createElement("p");
      settingValue.innerHTML = modSettings['mods'][modId]['settings'][setting];
      settingValue.style.fontSize = "1.8vw";
      settingValue.style.margin = "0";
      settingValue.style.padding = "0";
      settingRow.appendChild(settingText);
      settingRow.appendChild(settingValue);
  
      let settingLine = document.createElement("input");
      settingLine.type = "range";
      settingLine.style.alignItems = "center";
      settingLine.style.width = "10vw";
      settingLine.style.height = "2vh";
      settingLine.style.margin = "0";
      settingLine.style.padding = "0";
      console.log(setting)
      settingLine.min = backendConfig['mods'][modId]['settings'][setting]['min'];
      settingLine.max = backendConfig['mods'][modId]['settings'][setting]['max'];
      settingLine.value = modSettings['mods'][modId]['settings'][setting];
  
  
      
      settingLine.addEventListener('click', (e) => {
        // console.log("please1")
        e.preventDefault();
        e.stopImmediatePropagation()
        e.stopPropagation();
        settingLine.focus();
        // settingLine.select();
        // settingLine.stepUp();
      });
      settingLine.addEventListener('mousedown', (e) => {
        // console.log("please0")
        // e.preventDefault();
        e.stopImmediatePropagation()
        e.stopPropagation();
        settingLine.focus();
        // settingLine.select();
      });
      settingLine.addEventListener('input', (e) => {
        // console.log("please2")
        e.stopImmediatePropagation()
        e.stopPropagation();
        // e.preventDefault();
        settingLine.focus();
        // console.log(settingLine.value)
        settingValue.innerHTML = settingLine.value;
        modSettings = JSON.parse(localStorage.getItem('modSettings'));
        modSettings['mods'][modId]['settings'][setting] = settingLine.value;
        localStorage.setItem('modSettings', JSON.stringify(modSettings));
      });
      settingLine.addEventListener('change', (e) => {
        // console.log("please3")
        e.stopImmediatePropagation()
        e.stopPropagation();
        // e.preventDefault();
        settingLine.focus();
      });
  
      bg.onclick = (e) => { //ensure that input box focus
        // console.log("please");
        settingLine.blur()
      }
      settingRow.appendChild(settingLine);
      return settingRow;
    }