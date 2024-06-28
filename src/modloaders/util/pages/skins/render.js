import { version, filters, backendConfig } from "../../../modloader.js";
import { createNotifyModal } from "../../modals.js";
import { detectDeviceType } from "../../utils.js";
import { createMenuCard } from "./cards.js";
import { createFilterButton, currentFilter, setFilter } from "./filters.js";
import { toggleMod, customModNum, incCustomModNum } from "./utils.js";

export { renderSkinsMenu, searchMods };

let renderSkinsMenu = (filtersDiv, cardsDiv) => {
  let c = {
    display: "flex",
    // flex: "1",
    alignItems: "left",
    justifyContent: "space-between",
    padding: "10px",
    flexDirection: "column",
    // width: "10%",
    borderTop: "solid 3px black",

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
    borderTop: "solid 3px black",
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
