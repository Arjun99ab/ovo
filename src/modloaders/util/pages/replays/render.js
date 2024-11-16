import { version, filters, backendConfig } from "../../../modloader.js";
import { createNotifyModal } from "../../modals.js";
import { detectDeviceType } from "../../utils.js";
import { createMenuCard } from "./cards.js";
import { createFilterButton, currentFilter, setFilter } from "./filters.js";
import { toggleMod, customModNum, incCustomModNum } from "./utils.js";

export { renderReplaysMenu, searchMods };

let renderReplaysMenu = (sectionDiv) => {

  while (sectionDiv.firstChild) {
    sectionDiv.removeChild(sectionDiv.lastChild);
  }

  let mainDiv = document.createElement("div");
      
  mainDiv.id = "main-div";
      
  let replaysListDiv = document.createElement("div");
  replaysListDiv.addEventListener('wheel', (e) => {
    // console.log("hello)")
    e.stopImmediatePropagation()
    e.stopPropagation();
    // e.preventDefault();
    replaysListDiv.focus();
  });
  replaysListDiv.id = "replays-list-div";


  sectionDiv.appendChild(mainDiv);
  sectionDiv.appendChild(replaysListDiv);

  let c = {
    display: "flex",
    flexWrap: "wrap",
    // alignContent: "flex-start",
    // flexDirection: "column", 
    width: "40%",
    height: "100%",
    // maxHeight: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    // borderTop: "2px solid black",
    border: "2px solid red",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
  };
  Object.keys(c).forEach(function (a) {
    replaysListDiv.style[a] = c[a];
  });

  c = {
    border: "2px solid red",
    width: "60%",
    height: "100%",
    // maxHeight: "100%",
  }
  Object.keys(c).forEach(function (a) {
    mainDiv.style[a] = c[a];
  });



  // let c = {
  //   display: "flex",
  //   // flex: "1",
  //   alignItems: "left",
  //   justifyContent: "space-between",
  //   padding: "10px",
  //   flexDirection: "column",
  //   // width: "10%",
  //   // borderTop: "solid 3px black",

  //   height: "auto",
  //   maxHeight: "100%",
    
  //   overflowY: "scroll",
  //   overflowX: "hidden",

  //   scrollbarGutter: "stable",
  //   scrollbarWidth: "thin",
  //   // backgroundColor: "red",
  //   // position: "sticky",
  //   // marginRight: "2%",
  // };
  // Object.keys(c).forEach(function (a) {
  //   replaysListDiv.style[a] = c[a];
  // });

  // c = {
  //   display: "grid",
  //   padding: "10px",
  //   // marginBottom: "20px",
  //   gridTemplateColumns: "repeat(4, 0.25fr)",
  //   columnGap: "3%",
  //   rowGap: "4%",
  //   gridTemplateRows: "max-content",

  //   borderLeft: "solid 3px black",
  //   // borderTop: "solid 3px black",
  //   width: "83%",
  //   height: "calc(100% - 24px)",
  //   overflowY: "auto",
  //   overflowX: "hidden",
  //   scrollbarGutter: "stable",
  //   scrollbarWidth: "thin",
  //   justifyContent: "center",
  //   alignItems: "flex-start",
  // };
  // Object.keys(c).forEach(function (a) {
  //   cardsDiv.style[a] = c[a];
  // });

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
