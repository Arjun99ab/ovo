import {toggleMod} from "./utils.js"
import {createDescPopup} from "./desc.js"
import { createNotifyModal, createConfirmDeleteModal } from "../../modals.js"
import {backendConfig} from "../../../modloader.js"
import {modsPendingReload} from "../../modals.js"
import { createEditModPopup } from "./editmod.js"
import { renderSettingsMenu } from "./render.js"

export {createModSettingsSlider}

let createModSettingsSlider = (settingId) => {
  let settingRow = document.createElement("div");
  settingRow.style.display = "flex";
  settingRow.style.flexDirection = "row";
  settingRow.style.justifyContent = "space-between";
  settingRow.style.alignItems = "center";
  settingRow.style.margin = "5px";
  settingRow.style.columnGap = "3vw";
  // settingRow.style.rowGap = "5vh";


  let settingText = document.createElement("p");
  settingText.innerHTML = backendConfig['settings'][settingId]['name'] + ": ";
  settingText.style.fontSize = "1.8vw";
  settingText.style.margin = "0";
  settingText.style.padding = "0";

  let modSettings = JSON.parse(localStorage.getItem('modSettings'));
  let settingValue = document.createElement("p");
  settingValue.innerHTML = modSettings['settings'][settingId]['value'];
  settingValue.style.fontSize = "1.8vw";
  settingValue.style.margin = "0";
  settingValue.style.padding = "0";
  settingRow.appendChild(settingText);
  settingRow.appendChild(settingValue);

  let settingLine = document.createElement("input");
  settingLine.type = "range";
  settingLine.style.alignItems = "center";
  settingLine.style.width = "20vw";
  settingLine.style.height = "2vh";
  settingLine.style.margin = "0";
  settingLine.style.padding = "0";
  settingLine.min = backendConfig['settings'][settingId]['setting']['min'];
  settingLine.max = backendConfig['settings'][settingId]['setting']['max'];
  settingLine.value = modSettings['settings'][settingId]['value'];
  settingLine.step = backendConfig['settings'][settingId]['setting']['increment'];


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
    modSettings['settings'][settingId]['value'] = settingLine.value;
    localStorage.setItem('modSettings', JSON.stringify(modSettings));
  });
  settingLine.addEventListener('change', (e) => {
    // console.log("please3")
    e.stopImmediatePropagation()
    e.stopPropagation();
    // e.preventDefault();
    settingLine.focus();
  });

  // bg.onclick = (e) => { //ensure that input box focus
  //   // console.log("please");
  //   settingLine.blur()
  // }
  settingRow.appendChild(settingLine);
  return settingRow;
};