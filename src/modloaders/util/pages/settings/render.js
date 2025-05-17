import { version, settingFilters, backendConfig } from "../../../modloader.js";
import { createNotifyModal } from "../../modals.js";
import { detectDeviceType } from "../../utils.js";
import { createModSettingsSlider } from "./rows.js";
import { createFilterButton, currentFilter, setFilter } from "./filters.js";
import { toggleMod, customModNum, incCustomModNum } from "./utils.js";

export { renderSettingsMenu, searchMods };





let renderSettingsMenu = (sectionDiv) => {

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
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    // marginBottom: "20px",

    borderLeft: "solid 3px black",
    // borderTop: "solid 3px black",
    width: "83%",
    height: "calc(100% - 24px)",
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    // justifyContent: "center",
    alignItems: "left",
    rowGap: "2vh", 
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
  for (const filter of settingFilters) {
    console.log(filter);
    let filterButton;
    filterButton = createFilterButton(
        filter + "-filter-btn",
        filter.charAt(0).toUpperCase() + filter.slice(1),
        "13vw"
    );

    if (filter === "all") {
      //set initial filter to all
      filterButton.style.backgroundColor = "lightblue";
      setFilter("all");
      // currentFilter = 'all';
    }
    filtersDiv.appendChild(filterButton);
  }

  for (const [key] of Object.entries(backendConfig["settings"])) {
    console.log(key);
    if (
      key != "version" &&
      key != "mods" &&
      backendConfig["settings"][key]["version"].includes(version) &&
      backendConfig["settings"][key]["platform"].includes(detectDeviceType())
    ) {
      let settingRow = createModSettingsSlider(key);
      settingRow.id = key + "-setting-row";
      cardsDiv.appendChild(settingRow);
    }
  };
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