import {backendConfig, skinFilters, skinVersion} from '../../../modloader.js';
import {detectDeviceType} from "../../utils.js";
import {createMenuCard} from './cards.js';

export {createFilterButton, currentFilter, setFilter}

let currentFilter = 'all';
function setFilter(filter) {
    currentFilter = filter;
}

let createFilterButton = (id, text, width) => {
    let menuButton = document.createElement("button");
    menuButton.id = id;
    menuButton.innerHTML = text;

    let c = {
      fontFamily: "Retron2000",
      color: "black",
      fontSize: "2vw",
      cursor: "pointer",
      backgroundColor: "white",
      width: width,
      textAlign: "center",
      verticalAlign: "middle",
      marginBottom: "15px",
      border: "solid 3px black",
      borderRadius: "10px",

      // height: "auto",
    }
    Object.keys(c).forEach(function (a) {
      menuButton.style[a] = c[a];
    });

    menuButton.onclick = function() {
      if(document.getElementById(id).style.backgroundColor === "white") {
        skinFilters.forEach((filter) => { //set all other filters to white
          document.getElementById(filter + "-filter-btn").style.backgroundColor = "white";
        });
        setFilter(id.split("-")[0]); //set currentFilter to this filter
        console.log(currentFilter)
        document.getElementById(id).style.backgroundColor = "lightblue";
        let filterCards = document.getElementById("cards-div").children;
        while(filterCards.length > 0) { //clear all cards
          filterCards[0].remove();
        }
        let cardsList = [];
        let cardsDiv = document.getElementById("cards-div");
        for (const [key] of Object.entries(backendConfig['skins'])) {
          if(key != "version" && key != "settings" && backendConfig['skins'][key]['version'].includes(skinVersion)) {
            if(currentFilter === 'all') {
              cardsList.push(createMenuCard(key + '-card', backendConfig['skins'][key]['name'], backendConfig['skins'][key]['icon'], JSON.parse(localStorage.getItem('modSettings'))['skins'][key]['using']));
            } else if(currentFilter === 'favorite') {
              // console.log(JSON.parse(localStorage.getItem('modSettings'))['skins'][key]['favorite'])
              if(JSON.parse(localStorage.getItem('modSettings'))['skins'][key]['favorite']) {
                let b = createMenuCard(key + '-card', backendConfig['skins'][key]['name'], backendConfig['skins'][key]['icon'], JSON.parse(localStorage.getItem('modSettings'))['skins'][key]['using']);
                cardsDiv.appendChild(b);
              }
            } else {
              if(backendConfig['skins'][key]['tags'].includes(currentFilter)) {
                cardsList.push(createMenuCard(key + '-card', backendConfig['skins'][key]['name'], backendConfig['skins'][key]['icon'], JSON.parse(localStorage.getItem('modSettings'))['skins'][key]['using']));
                // cardsDiv.appendChild(b);
              }
            }
          }
        }
        console.log("???/")
        let userConfig = JSON.parse(localStorage.getItem('modSettings'));
        console.log(userConfig['skins'])
        Object.keys(userConfig['skins']).forEach(function (key) {          
          console.log(key)
          if(key.startsWith("custom")) {
            console.log(currentFilter)
            if(currentFilter === 'all') {
              cardsList.push(createMenuCard(key + '-card', userConfig['skins'][key]['name'], userConfig['skins'][key]['icon'], userConfig['skins'][key]['using']));
              // cardsDiv.appendChild(b);
            } else if(currentFilter === 'favorite') {
              console.log(userConfig['skins'][key]['favorite'])
              if(userConfig['skins'][key]['favorite']) {
                cardsList.push(createMenuCard(key + '-card', userConfig['skins'][key]['name'], userConfig['skins'][key]['icon'], userConfig['skins'][key]['using']));
                // cardsDiv.appendChild(b);
              }
            } else {
              if(userConfig['skins'][key]['tags'].includes(currentFilter)) {
                cardsList.push(createMenuCard(key + '-card', userConfig['skins'][key]['name'], userConfig['skins'][key]['icon'], userConfig['skins'][key]['using']));
                // cardsDiv.appendChild(b);
              }
            }
          }
        }
        );
      cardsList.sort((a, b) => a.children[1].innerHTML.localeCompare(b.children[1].innerHTML));
      cardsList.forEach((card) => {
        cardsDiv.appendChild(card);
      });
      



      } 
    }
    return menuButton;
  }