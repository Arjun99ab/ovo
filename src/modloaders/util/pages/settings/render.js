import { version, filters, backendConfig } from "../../../modloader.js";
import { createNotifyModal } from "../../modals.js";
import { detectDeviceType } from "../../utils.js";
import { createMenuCard } from "./cards.js";
import { createFilterButton, currentFilter, setFilter } from "./filters.js";
import { toggleMod, customModNum, incCustomModNum } from "./utils.js";

export { renderModsMenu, renderAddModMenu, searchMods };

let renderModsMenu = (sectionDiv) => {

  while (sectionDiv.firstChild) {
    sectionDiv.removeChild(sectionDiv.lastChild);
  }

  let filtersDiv = document.createElement("div");
      filtersDiv.addEventListener('wheel', (e) => {
        // console.log("hello)")
        e.stopImmediatePropagation()
        e.stopPropagation();
        // e.preventDefault();
        filtersDiv.focus();
      });
      filtersDiv.id = "filters-div";
      
  let cardsDiv = document.createElement("div");
  cardsDiv.addEventListener('wheel', (e) => {
    // console.log("hello)")
    e.stopImmediatePropagation()
    e.stopPropagation();
    // e.preventDefault();
    cardsDiv.focus();
  });
  cardsDiv.id = "cards-div";


  sectionDiv.appendChild(filtersDiv);
  sectionDiv.appendChild(cardsDiv);

  let c = {
    display: "flex",
    // flex: "1",
    alignItems: "left",
    justifyContent: "space-between",
    padding: "10px",
    flexDirection: "column",
    // width: "10%",
    // borderTop: "solid 3px black",

    height: "auto",
    maxHeight: "100%",
    
    overflowY: "scroll",
    overflowX: "hidden",

    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    // backgroundColor: "red",
    // position: "sticky",
    // marginRight: "2%",
  };
  Object.keys(c).forEach(function (a) {
    filtersDiv.style[a] = c[a];
  });

  c = {
    display: "grid",
    padding: "10px",
    // marginBottom: "20px",
    gridTemplateColumns: "repeat(4, 0.25fr)",
    columnGap: "3%",
    rowGap: "4%",
    gridTemplateRows: "max-content",

    borderLeft: "solid 3px black",
    // borderTop: "solid 3px black",
    width: "83%",
    height: "calc(100% - 24px)",
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    justifyContent: "center",
    alignItems: "flex-start",
  };
  Object.keys(c).forEach(function (a) {
    cardsDiv.style[a] = c[a];
  });

  while (filtersDiv.firstChild) {
    filtersDiv.removeChild(filtersDiv.lastChild);
  }

  while (cardsDiv.firstChild) {
    cardsDiv.removeChild(cardsDiv.lastChild);
  }

  // filterArr = Array.from(filters)
  for (const filter of filters) {
    console.log(filter);
    let filterButton;
    if (filter === "favorite") {
      filterButton = createFilterButton(
        filter + "-filter-btn",
        "Favorites",
        "13vw"
      );
    } else {
      filterButton = createFilterButton(
        filter + "-filter-btn",
        filter.charAt(0).toUpperCase() + filter.slice(1),
        "13vw"
      );
    }
    if (filter === "all") {
      //set initial filter to all
      filterButton.style.backgroundColor = "lightblue";
      setFilter("all");
      // currentFilter = 'all';
    }
    filtersDiv.appendChild(filterButton);
  }

  let cardsList = [];
  console.log(backendConfig["mods"]);
  for (const [key] of Object.entries(backendConfig["mods"])) {
    if (
      key != "version" &&
      key != "settings" &&
      backendConfig["mods"][key]["version"].includes(version) &&
      backendConfig["mods"][key]["platform"].includes(detectDeviceType())
    ) {
      cardsList.push(
        createMenuCard(
          key + "-card",
          backendConfig["mods"][key]["name"],
          backendConfig["mods"][key]["icon"],
          JSON.parse(localStorage.getItem("modSettings"))["mods"][key][
            "enabled"
          ]
        )
      );
    }
  }
  for (const [key] of Object.entries(
    JSON.parse(localStorage.getItem("modSettings"))["mods"]
  )) {
    if (key.startsWith("custom")) {
      cardsList.push(
        createMenuCard(
          key + "-card",
          JSON.parse(localStorage.getItem("modSettings"))["mods"][key]["name"],
          JSON.parse(localStorage.getItem("modSettings"))["mods"][key]["icon"],
          JSON.parse(localStorage.getItem("modSettings"))["mods"][key][
            "enabled"
          ]
        )
      );
    }
  }
  // Sort cardsList alphabetically by the 'name' property
  cardsList.sort((a, b) =>
    a.children[1].innerHTML.localeCompare(b.children[1].innerHTML)
  );
  // console.log(cardsList)

  // Add sorted cards to the cardsDiv
  for (const card of cardsList) {
    cardsDiv.appendChild(card);
  }
};

let renderAddModMenu = (sectionDiv) => {

  while (sectionDiv.firstChild) {
    sectionDiv.removeChild(sectionDiv.lastChild);
  }

  let filtersDiv = document.createElement("div");
  filtersDiv.addEventListener('wheel', (e) => {
    // console.log("hello)")
    e.stopImmediatePropagation()
    e.stopPropagation();
    // e.preventDefault();
    filtersDiv.focus();
  });
  filtersDiv.id = "filters-div";  
      
  let cardsDiv = document.createElement("div");
  cardsDiv.addEventListener('wheel', (e) => {
    // console.log("hello)")
    e.stopImmediatePropagation()
    e.stopPropagation();
    // e.preventDefault();
    cardsDiv.focus();
  });
  cardsDiv.id = "cards-div";

  sectionDiv.appendChild(filtersDiv);
  sectionDiv.appendChild(cardsDiv);

  let c = {
    display: "flex",
    // flex: "1",
    alignItems: "left",
    justifyContent: "center",
    padding: "0px",
    flexDirection: "column",
    // width: "10%",
    borderTop: "solid 3px black",

    height: "calc(100% - 3px)",
    overflowY: "auto",
    overflowX: "auto",

    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    // backgroundColor: "red",
    // position: "sticky",
    // marginRight: "2%",
  };
  Object.keys(c).forEach(function (a) {
    filtersDiv.style[a] = c[a];
  });

  c = {
    display: "flex",
    padding: "10px 20px",
    flexDirection: "column",
    gap: "6% 4%",
    borderLeft: "solid 3px black",
    borderTop: "solid 3px black",
    width: "83%",
    height: "calc(100% - 24px)",
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    justifyContent: "center",
    alignItems: "center",
  };
  Object.keys(c).forEach(function (a) {
    cardsDiv.style[a] = c[a];
  });

  let saveButtonCss = {
    fontFamily: "Retron2000",
    color: "black",
    fontSize: "2vw",
    cursor: "pointer",
    backgroundColor: "lightgreen",
    width: "13vw",
    height: "100%",
    textAlign: "center",
    verticalAlign: "middle",
    // marginBottom: "15px",
    // border: "solid 3px black",
    borderRadius: "0 0 0 10px",
    // margin: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: "15px",
  };

  let saveButton = document.createElement("div");
  saveButton.innerHTML = "Save Mod";
  Object.keys(saveButtonCss).forEach(function (a) {
    saveButton.style[a] = saveButtonCss[a];
  });

  saveButton.onclick = function () {
    if (addModName.value !== "" && addModCode.value !== "") {
      incCustomModNum();
      console.log("brand new mod");

      let modSettings = JSON.parse(localStorage.getItem("modSettings"));
      let customModConfig = {};
      customModConfig["author"] = null;
      customModConfig["icon"] = "../src/img/mods/custommod.png";
      customModConfig["platform"] = ["pc", "mobile"];
      customModConfig["version"] = ["1.4", "1.4.4", "CTLE"];
      customModConfig["tags"] = ["custom"];
      customModConfig["reload"] = true;
      customModConfig["settings"] = null;
      customModConfig["favorite"] = false;
      customModConfig["name"] = addModName.value;
      customModConfig["desc"] = addModDesc.value.replace(/\n/g, "<br/>");
      customModConfig["enabled"] = false;
      customModConfig["url"] = addModCode.value;
      modSettings["mods"]["customMod" + customModNum] = customModConfig;
      localStorage.setItem("modSettings", JSON.stringify(modSettings));

      document.getElementById("nav-mods-btn").click();
    } else {
      document.getElementById("menu-bg").style.pointerEvents = "none";
      document.getElementById("menu-bg").style.filter = "blur(1.2px)";
      createNotifyModal(
        "Please fill out the name and code fields before saving."
      );
    }
  };

  filtersDiv.appendChild(saveButton);

  let addModName = document.createElement("input");
  addModName.placeholder = "Mod Name";
  let d = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "3vw",
    cursor: "text",
    backgroundColor: "white",
    verticalAlign: "middle",
    border: "solid 3px black",
    fontSize: "2vw",
    color: "black",
    fontFamily: "Retron2000",
    // paddingLeft: "10px",
    borderRadius: "10px 10px 10px 10px",
  };
  Object.keys(d).forEach(function (a) {
    addModName.style[a] = d[a];
  });
  addModName.onclick = (e) => {
    //ensure that input box focus
    // console.log("please");
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    addModName.focus();
  };
  document.getElementById("menu-bg").onclick = (e) => {
    //ensure that input box focus
    // console.log("please");
    addModName.blur();
  };
  addModName.onkeydown = (e) => {
    // ensures that user is able to type in input box
    e.stopImmediatePropagation();
    e.stopPropagation();
    if (e.keyCode === 27) {
      addModName.blur();
    }
    if (e.keyCode === 13) {
      addModName.blur();
    }
  };

  let addModCode = document.createElement("textarea");
  addModCode.placeholder = "Mod Code";
  addModCode.rows = "10";
  addModCode.cols = "50";
  let e = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "50%",
    cursor: "text",
    backgroundColor: "white",
    verticalAlign: "middle",
    border: "solid 3px black",
    fontSize: "2vw",
    color: "black",
    fontFamily: "Retron2000",
    // paddingLeft: "10px",
    borderRadius: "10px 10px 10px 10px",
  };
  Object.keys(d).forEach(function (a) {
    addModCode.style[a] = e[a];
  });
  addModCode.onclick = (e) => {
    //ensure that input box focus
    // console.log("please");
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    addModCode.focus();
  };
  document.getElementById("menu-bg").onclick = (e) => {
    //ensure that input box focus
    // console.log("please");
  };
  addModCode.onkeydown = (e) => {
    // ensures that user is able to type in input box
    e.stopImmediatePropagation();
    e.stopPropagation();
    if (e.keyCode === 27) {
      addModCode.blur();
    }
  };

  let addModDesc = document.createElement("textarea");
  addModDesc.placeholder = "Mod Description";
  addModDesc.rows = "10";
  addModDesc.cols = "50";
  let f = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "50%",
    cursor: "text",
    backgroundColor: "white",
    verticalAlign: "middle",
    border: "solid 3px black",
    fontSize: "2vw",
    color: "black",
    fontFamily: "Retron2000",
    // paddingLeft: "10px",
    borderRadius: "10px 10px 10px 10px",
  };
  Object.keys(d).forEach(function (a) {
    addModDesc.style[a] = f[a];
  });
  addModDesc.onclick = (e) => {
    //ensure that input box focus
    // console.log("please");
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    addModDesc.focus();
  };

  addModDesc.onkeydown = (e) => {
    // ensures that user is able to type in input box
    e.stopImmediatePropagation();
    e.stopPropagation();
    if (e.keyCode === 27) {
      addModDesc.blur();
    }
  };

  document.getElementById("menu-bg").onclick = (e) => {
    //ensure that input box focus
    // console.log("please");
    addModName.blur();
    addModCode.blur();
    addModDesc.blur();
  };

  cardsDiv.appendChild(addModName);
  cardsDiv.appendChild(addModCode);
  cardsDiv.appendChild(addModDesc);
};

let searchMods = (search, filter = "all") => {
  search = search.toLowerCase();
  console.log(filter);

  let filterCards = document.getElementById("cards-div").children;
  while (filterCards.length > 0) {
    //clear all cards
    filterCards[0].remove();
  }
  let cardsList = [];
  let userConfig = JSON.parse(localStorage.getItem("modSettings"));
  for (const [key] of Object.entries(backendConfig["mods"])) {
    if (
      key != "version" &&
      key != "settings" &&
      backendConfig["mods"][key]["version"].includes(version) &&
      backendConfig["mods"][key]["platform"].includes(detectDeviceType()) &&
      backendConfig["mods"][key]["name"].toLowerCase().includes(search) &&
      (backendConfig["mods"][key]["tags"].includes(filter) ||
        filter === "all" ||
        userConfig["mods"][key]["favorite"] === true)
    ) {
      cardsList.push(
        createMenuCard(
          key + "-card",
          backendConfig["mods"][key]["name"],
          backendConfig["mods"][key]["icon"],
          JSON.parse(localStorage.getItem("modSettings"))["mods"][key][
            "enabled"
          ]
        )
      );
    }
  }
  Object.keys(userConfig["mods"]).forEach(function (key) {
    if (key.startsWith("custom")) {
      console.log(userConfig["mods"][key]);
      if (
        userConfig["mods"][key]["name"].toLowerCase().includes(search) &&
        userConfig["mods"][key]["version"].includes(version) &&
        userConfig["mods"][key]["platform"].includes(detectDeviceType()) &&
        (userConfig["mods"][key]["tags"].includes(filter) ||
          filter === "all" ||
          userConfig["mods"][key]["favorite"] === true)
      ) {
        cardsList.push(
          createMenuCard(
            key + "-card",
            userConfig["mods"][key]["name"],
            userConfig["mods"][key]["icon"],
            userConfig["mods"][key]["enabled"]
          )
        );
      }
    }
  });
  console.log(cardsList);
  cardsList.sort((a, b) =>
    a.children[1].innerHTML.localeCompare(b.children[1].innerHTML)
  );

  return cardsList;
};
