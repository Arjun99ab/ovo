(function () {
  let old = globalThis.sdk_runtime;
  c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
  let runtime = globalThis.sdk_runtime;
  globalThis.sdk_runtime = old;

  var map = null;
  var map2 = null;
  var levelData;

  const loadLocalStorageData = () => {
    let favourites = JSON.parse(localStorage.getItem("favouriteLevels")) || [];
    let hidden = JSON.parse(localStorage.getItem("hiddenLevels")) || [];
    return { favourites, hidden };
  };

  const saveLocalStorageData = (favourites, hidden) => {
    localStorage.setItem("favouriteLevels", JSON.stringify(favourites));
    localStorage.setItem("hiddenLevels", JSON.stringify(hidden));
  };

  let { favourites, hidden } = loadLocalStorageData();

  globalThis.communityToggle = function (enable) {
    if (enable) {
      document.addEventListener("keydown", communityLevelsMod.keyDown);
    } else {
      if (document.getElementById("community-menu") !== null) {
        document.getElementById("community-menu").remove();
        enableClick(map);
      }
      document.removeEventListener("keydown", communityLevelsMod.keyDown);
    }
  };

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

  let isInLevel = () => {
    return runtime.running_layout.name.startsWith("Level");
  };

  let isPaused = () => {
    if (isInLevel())
      return runtime.running_layout.layers.find(function (a) {
        return "Pause" === a.name;
      }).visible;
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
        behavior.movement = 0;
      });
    });
    let layer = runtime.running_layout.layers.find((x) => x.name == "UI");
    if (layer) {
      layer.instances.forEach((inst) => {
        mapUI.push({
          inst,
          oldState: {
            width: inst.width,
            height: inst.height,
          },
        });
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

  let disableClick = () => {
    let map = [];
    let mapUI = [];
    let types = runtime.types_by_index.filter((x) =>
      x.behaviors.some((y) => y.behavior instanceof cr.behaviors.aekiro_button)
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
        mapUI.push({
          inst,
          oldState: {
            width: inst.width,
            height: inst.height,
          },
        });
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

  function queryDatabase(query, showFavourites, showHidden) {
    let { favourites, hidden } = loadLocalStorageData();
    let filteredData = levelData.filter((level) => {
      let matchesQuery =
        level.levelname.replace(/_/g, " ").toLowerCase().startsWith(query) ||
        level.username.toLowerCase().startsWith(query);
      let isFavourite = favourites.includes(level.id);
      let isHidden = hidden.includes(level.id);
      if (!showHidden && showFavourites && !isFavourite) return false;
      if (!showHidden && isHidden) return false;
      if (showHidden && !isHidden && (!showFavourites || !isFavourite))
        return false;
      return matchesQuery;
    });
    return filteredData;
  }

  function getDatabase(numEntries = 4) {
    return levelData.slice(0, numEntries);
  }

  let renderListLevels = (levelsQueried) => {
    var levelsList = document.createElement("div");
    levelsList.addEventListener("wheel", (e) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      levelsList.focus();
    });

    levelsList.id = "levels-list";
    levelsList.style.display = "flex";
    levelsList.style.flexWrap = "wrap";
    levelsList.style.alignContent = "flex-start";
    levelsList.style.position = "absolute";
    levelsList.style.top = "25%";
    levelsList.style.left = "0px";
    levelsList.style.width = "100%";
    levelsList.style.height = "75%";
    levelsList.style.overflowY = "auto";
    levelsList.style.overflowX = "hidden";
    levelsList.style.borderTop = "2px solid black";

    levelsQueried.forEach((level) => {
      var levelBox = document.createElement("div");
      levelBox.style.width = "100%";
      levelBox.style.minHeight = "100px";
      levelBox.style.borderBottom = "2px solid black";
      // levelBox.style.position = "relative";
      levelBox.style.overflowY = "hidden";
      levelBox.style.overflowX = "hidden";
      levelBox.style.scrollbarGutter = "stable";
      levelBox.style.display = "flex";
      levelBox.style.flexDirection = "row";

      function updateLevelGradient() {
        if (hidden.includes(level.id)) {
          levelBox.style.background =
            "linear-gradient(90deg, #ffffff38 50%, rgb(255 100 100 / 51%))";
        } else if (favourites.includes(level.id)) {
          levelBox.style.background =
            "linear-gradient(90deg, #ffffff38 50%, rgb(255 191 0 / 51%))";
        } else {
          levelBox.style.background = "";
        }
      }
      updateLevelGradient();

      var levelInfo = document.createElement("div");
      levelInfo.style.display = "flex";
      levelInfo.style.flexDirection = "column";
      levelInfo.style.flex = "75%";
      levelInfo.style.justifyContent = "flex-start";
      levelInfo.style.paddingLeft = "20px";
      levelBox.appendChild(levelInfo);

      var levelActions = document.createElement("div");
      levelActions.style.display = "flex";
      levelActions.style.flexDirection = "row";
      levelActions.style.flex = "25%";
      levelActions.style.flexWrap = "wrap";
      levelActions.style.justifyContent = "flex-end";
      levelActions.style.alignContent = "center";
      levelBox.appendChild(levelActions);

      levelTitleText = document.createElement("div");
      c = {
        border: "none",
        fontFamily: "Retron2000",
        color: "black",
        fontSize: "15pt",
        cursor: "default",
      };
      Object.keys(c).forEach(function (a) {
        levelTitleText.style[a] = c[a];
      });

      newContent = document.createTextNode(
        level.levelname.replace(/_/g, " ").slice(0, -5)
      );
      levelTitleText.appendChild(newContent);
      levelInfo.appendChild(levelTitleText);

      levelAuthorText = document.createElement("div");
      c = {
        border: "none",
        fontFamily: "Retron2000",
        color: "#5d5d5d",
        fontSize: "10pt",
        cursor: "default",
        fontStyle: "italic",
      };
      Object.keys(c).forEach(function (a) {
        levelAuthorText.style[a] = c[a];
      });

      newContent = document.createTextNode("by " + level.username);
      levelAuthorText.appendChild(newContent);
      levelInfo.appendChild(levelAuthorText);

      levelDescText = document.createElement("div");
      c = {
        border: "none",
        fontFamily: "Retron2000",
        color: "black",
        fontSize: "12pt",
        cursor: "default",
        width: "80%",
        flex: "1",
        alignContent: "space-around",
      };
      Object.keys(c).forEach(function (a) {
        levelDescText.style[a] = c[a];
      });

      levelDescText.innerHTML = level.content;
      levelInfo.appendChild(levelDescText);

      levelPlayBtn = document.createElement("button");
      c = {
        backgroundColor: "#9268e3",
        borderRadius: "25px",
        border: "#9268e3",
        padding: "10px",
        margin: "5px",
        fontFamily: "Retron2000",
        color: "white",
        fontSize: "10pt",
        cursor: "pointer",
        flex: "100%",
      };
      Object.keys(c).forEach(function (a) {
        levelPlayBtn.style[a] = c[a];
      });

      levelPlayBtn.innerHTML = "Play";
      levelPlayBtn.onclick = async function () {
        var levelJson = await fetch("../src/communitylevels/" + level.levelname)
          .then((response) => response.json())
          .then((data) => {
            return data;
          });
        ovoLevelEditor.startLevel(levelJson);
        xButton.click();
      };
      levelActions.appendChild(levelPlayBtn);

      let favouriteBtn = document.createElement("button");
      c = {
        backgroundColor: "#FFA500",
        borderRadius: "25px",
        border: "#FFA500",
        padding: "10px",
        margin: "5px",
        fontFamily: "Retron2000",
        color: "white",
        fontSize: "10pt",
        cursor: "pointer",
        flex: "0.7",
      };
      Object.keys(c).forEach(function (a) {
        favouriteBtn.style[a] = c[a];
      });

      favouriteBtn.innerHTML = favourites.includes(level.id)
        ? "Unfavourite"
        : "Favourite";
      favouriteBtn.onclick = function () {
        if (favourites.includes(level.id)) {
          favourites = favourites.filter((id) => id !== level.id);
          favouriteBtn.innerHTML = "Favourite";
        } else {
          favourites.push(level.id);
          favouriteBtn.innerHTML = "Unfavourite";
        }
        saveLocalStorageData(favourites, hidden);
        updateLevelGradient();
      };
      levelActions.appendChild(favouriteBtn);

      let hideBtn = document.createElement("button");
      c = {
        backgroundColor: "#FF0000",
        borderRadius: "25px",
        border: "#FF0000",
        padding: "10px",
        margin: "5px",
        fontFamily: "Retron2000",
        color: "white",
        fontSize: "10pt",
        cursor: "pointer",
        flex: "0.3",
      };
      Object.keys(c).forEach(function (a) {
        hideBtn.style[a] = c[a];
      });

      hideBtn.innerHTML = hidden.includes(level.id) ? "Unhide" : "Hide";
      hideBtn.onclick = function () {
        if (hidden.includes(level.id)) {
          hidden = hidden.filter((id) => id !== level.id);
          hideBtn.innerHTML = "Hide";
        } else {
          hidden.push(level.id);
          hideBtn.innerHTML = "Unhide";
        }
        saveLocalStorageData(favourites, hidden);
        updateLevelGradient();
      };
      levelActions.appendChild(hideBtn);

      levelsList.appendChild(levelBox);
    });

    return levelsList;
  };

  let createCommunityMenu = async () => {
    b = document.createElement("div");
    c = {
      backgroundColor: "white",
      border: "solid",
      borderColor: "black",
      borderRadius: "10px",
      borderWidth: "2px",
      fontFamily: "Retron2000",
      position: "absolute",
      top: "15%",
      padding: "5px",
      color: "black",
      fontSize: "10pt",
      display: "block",
      width: "calc(100vw - 300px)",
      marginLeft: "150px",
      height: "75%",
    };
    Object.keys(c).forEach(function (a) {
      b.style[a] = c[a];
    });
    b.id = "community-menu";

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

    xButton.onclick = function () {
      b.remove();
      enableClick(map);
    };

    titleText = document.createElement("div");

    c = {
      backgroundColor: "white",
      border: "none",
      fontFamily: "Retron2000",
      position: "relative",
      textAlign: "center",
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
      borderRadius: "5px",
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

    searchInput.onclick = (e) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      searchInput.focus();
    };

    searchInput.onkeydown = (e) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      if (e.keyCode === 13) {
        searchBtn.click();
      }
      if (e.keyCode === 27) {
        searchInput.blur();
      }
    };

    let showFavouritesCheckbox = document.createElement("input");
    showFavouritesCheckbox.type = "checkbox";
    showFavouritesCheckbox.id = "show-favourites-checkbox";

    let showFavouritesLabel = document.createElement("label");
    showFavouritesLabel.htmlFor = "show-favourites-checkbox";
    showFavouritesLabel.innerHTML = "Show Favourites";

    let showHiddenCheckbox = document.createElement("input");
    showHiddenCheckbox.type = "checkbox";
    showHiddenCheckbox.id = "show-hidden-checkbox";

    let showHiddenLabel = document.createElement("label");
    showHiddenLabel.htmlFor = "show-hidden-checkbox";
    showHiddenLabel.innerHTML = "Show Hidden";

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
    searchBtn.onclick = async function () {
      let query = searchInput.value;
      let showFavourites = showFavouritesCheckbox.checked;
      let showHidden = showHiddenCheckbox.checked;
      var levelsQueried = await queryDatabase(
        query,
        showFavourites,
        showHidden
      );
      if (document.getElementById("levels-list") !== null) {
        document.getElementById("levels-list").remove();
      }
      levelsList = renderListLevels(levelsQueried);
      b.appendChild(levelsList);
    };

    levelsQueried = await queryDatabase(
      "",
      showFavouritesCheckbox.checked,
      showHiddenCheckbox.checked
    );
    levelsList = renderListLevels(levelsQueried);

    b.appendChild(titleText);
    b.appendChild(xButton);
    let filterDiv = document.createElement("div");
    let filterDivContainer = document.createElement("div");
    filterDivContainer.style.display = "flex";
    filterDivContainer.style.alignItems = "flex-end";
    filterDivContainer.style.flexDirection = "column";
    filterDivContainer.style.paddingRight = "10px";
    let favDiv = document.createElement("div");
    let hiddenDiv = document.createElement("div");
    favDiv.appendChild(showFavouritesCheckbox);
    favDiv.appendChild(showFavouritesLabel);
    hiddenDiv.appendChild(showHiddenCheckbox);
    hiddenDiv.appendChild(showHiddenLabel);
    filterDiv.appendChild(favDiv);
    filterDiv.appendChild(hiddenDiv);
    filterDivContainer.appendChild(filterDiv);
    b.appendChild(filterDivContainer);
    b.appendChild(searchInput);
    b.appendChild(searchBtn);
    b.appendChild(levelsList);

    document.body.appendChild(b);
  };

  let createHome = () => {
    b = document.createElement("div");
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
      textAlign: "center",
    };
    Object.keys(c).forEach(function (a) {
      b.style[a] = c[a];
    });
    b.id = "home-menu";

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

    xButton.onclick = function () {
      b.remove();
      enableClick(map);
    };

    titleText = document.createElement("div");

    c = {
      backgroundColor: "white",
      border: "none",
      fontFamily: "Retron2000",
      position: "relative",
      textAlign: "center",
      color: "black",
      fontSize: "22pt",
      cursor: "default",
    };
    Object.keys(c).forEach(function (a) {
      titleText.style[a] = c[a];
    });

    newContent = document.createTextNode("Home");
    titleText.appendChild(newContent);

    menuIcons = document.createElement("div");
    menuIcons.style.display = "flex";
    menuIcons.style.flexWrap = "wrap";
    menuIcons.style.position = "relative";
    menuIcons.style.top = "5%";
    menuIcons.style.gap = "5px";
    menuIcons.style.width = "70%";
    menuIcons.style.margin = "auto";
    menuIcons.style.paddingLeft = "20px";
    menuIcons.style.height = "70%";
    menuIcons.style.border = "1px solid black";

    for (var i = 0; i < 4; i++) {
      var icon = document.createElement("div");
      icon.style.width = "40%";
      icon.style.height = "40%";
      icon.style.border = "1px solid red";
      icon.style.position = "relative";
      iconImg = document.createElement("img");
      iconImg.src = "https://static.thenounproject.com/png/17448-200.png";
      iconImg.style.flexShrink = "0";
      iconImg.style.width = "100%";
      iconImg.style.height = "100%";
      icon.appendChild(iconImg);
      menuIcons.appendChild(icon);
    }

    b.appendChild(titleText);
    b.appendChild(menuIcons);
    b.appendChild(xButton);

    document.body.appendChild(b);
  };

  let communityLevelsMod = {
    async init() {
      function addStyle(styleString) {
        const style = document.createElement("style");
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

      levelData = await fetch("../src/communitylevels/config/data.json")
        .then((response) => response.json())
        .then((jsondata) => {
          return jsondata;
        });

      document.addEventListener("keydown", this.keyDown);

      notify(
        "Community Levels Loaded",
        "by Awesomeguy<br/>Shift + L to open the levels menu",
        "../src/img/mods/community.png"
      );
    },
    keyDown(event) {
      if (event.shiftKey && event.code === "KeyL") {
        if (document.getElementById("community-menu") === null) {
          map = disableClick();
          createCommunityMenu();
        } else {
          document.getElementById("community-menu").remove();
          enableClick(map);
        }
      }
    },
  };

  communityLevelsMod.init();
})();
