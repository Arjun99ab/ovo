import { skinVersion, skinFilters, backendConfig } from "../../../modloader.js";
import { createNotifyModal } from "../../modals.js";
import { detectDeviceType } from "../../utils.js";
import { createMenuCard } from "./cards.js";
import { createFilterButton, currentFilter, setFilter } from "./filters.js";
// import { toggleMod, customModNum, incCustomModNum } from "./utils.js";

export { renderSkinsMenu, searchSkins };

let renderSkinsMenu = (sectionDiv) => {

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
  for (const filter of skinFilters) {
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
  console.log(backendConfig["skins"]);
  for (const [key] of Object.entries(backendConfig["skins"])) {
    console.log(key);
    if (
      key != "version" &&
      key != "settings" &&
      backendConfig["skins"][key]["version"].includes(skinVersion))
    {
      cardsList.push(
        createMenuCard(
          key + "-card",
          backendConfig["skins"][key]["name"],
          backendConfig["skins"][key]["icon"],
          JSON.parse(localStorage.getItem("modSettings"))["skins"][key][
            "using"
          ]
        )
      );
    }
  }
  for (const [key] of Object.entries(
    JSON.parse(localStorage.getItem("modSettings"))["skins"]
  )) {
    if (key.startsWith("custom")) {
      cardsList.push(
        createMenuCard(
          key + "-card",
          JSON.parse(localStorage.getItem("modSettings"))["skins"][key]["name"],
          JSON.parse(localStorage.getItem("modSettings"))["skins"][key]["icon"],
          JSON.parse(localStorage.getItem("modSettings"))["skins"][key][
            "using"
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


let searchSkins = (search, filter = "all") => {
  search = search.toLowerCase();
  console.log(filter);

  let filterCards = document.getElementById("cards-div").children;
  while (filterCards.length > 0) {
    //clear all cards
    filterCards[0].remove();
  }
  let cardsList = [];
  let userConfig = JSON.parse(localStorage.getItem("modSettings"));
  for (const [key] of Object.entries(backendConfig["skins"])) {
    if (
      backendConfig["skins"][key]["version"].includes(skinVersion) &&
      backendConfig["skins"][key]["name"].toLowerCase().includes(search) &&
      (backendConfig["skins"][key]["tags"].includes(filter) ||
        filter === "all" ||
        userConfig["skins"][key]["favorite"] === true)
    ) {
      cardsList.push(
        createMenuCard(
          key + "-card",
          backendConfig["skins"][key]["name"],
          backendConfig["skins"][key]["icon"],
          JSON.parse(localStorage.getItem("modSettings"))["skins"][key][
            "using"
          ]
        )
      );
    }
  }
  Object.keys(userConfig["skins"]).forEach(function (key) {
    if (key.startsWith("custom")) {
      console.log(userConfig["skins"][key]);
      if (
        userConfig["skins"][key]["name"].toLowerCase().includes(search) &&
        userConfig["skins"][key]["version"].includes(skinVersion) &&
        (userConfig["skins"][key]["tags"].includes(filter) ||
          filter === "all" ||
          userConfig["skins"][key]["favorite"] === true)
      ) {
        cardsList.push(
          createMenuCard(
            key + "-card",
            userConfig["skins"][key]["name"],
            userConfig["skins"][key]["icon"],
            userConfig["skins"][key]["using"]
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
