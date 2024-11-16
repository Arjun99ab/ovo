import {backendConfig} from "../../../modloader.js";
import {createConfirmReloadModal, createNotifyModal} from "../../modals.js"
import { modsPendingReload } from "../../modals.js";
import { notify } from "../../ovo.js";
export {toggleMod, customModNum, incCustomModNum}

let customModNum = 0;
function incCustomModNum() {
  customModNum++;
}

let globalHandler = null;

function errorOccur(modId, event) {
  let modSettings = JSON.parse(localStorage.getItem('modSettings'));
  console.log(event)
  // console.log(event.detail.name)
  modSettings = JSON.parse(localStorage.getItem('modSettings'));
  modSettings['mods'][modId]["enabled"] = false;
  localStorage.setItem('modSettings', JSON.stringify(modSettings));
  document.getElementById(modId + '-enable-button').innerHTML = "Reload";
  document.getElementById(modId + '-enable-button').style.backgroundColor = "rgb(255, 255, 0)";
  modsPendingReload.push(modId);

  window.removeEventListener('dynamicallyAddedScriptError', globalHandler, true);
  console.error('Error caught when loading custom script', event.detail);
  document.getElementById("menu-bg").style.pointerEvents = "none";
  document.getElementById("menu-bg").style.filter = "blur(1.2px)";
  createNotifyModal("<u><b>Error: " + event.detail.name + "</b></u><br/>" + event.detail.message)
}


function errorOccurHandler(modId) {
  return function(event) {
    errorOccur(modId, event);
  }
}

let toggleMod = (modId, enable) => {
    console.log(modId, enable)

    if (enable) { //want to enable
      console.log(document.getElementById(modId))
      console.log(!document.getElementById(modId), !document.getElementById(modId))
      if(!document.getElementById(modId)) { // custom mods or mods that aren't in memory
        let modSettings = JSON.parse(localStorage.getItem('modSettings'));
        let handler = errorOccurHandler(modId);
        window.addEventListener('dynamicallyAddedScriptError', handler, true);
        globalHandler = handler;

        let js = document.createElement("script");
        js.type = "application/javascript";
        if(modId.startsWith("customMod")) {
            // js.text = modSettings['mods'][modId]["url"];
            console.log("custom mod")
            console.log(modId)
            js.text = `
                try {
                    // Your script code that may throw an error
                    // console.log("running custom mod")
                    ${modSettings['mods'][modId]["url"]};

                    let modSettings = JSON.parse(localStorage.getItem('modSettings'));
                    modSettings['mods']['${modId}']["enabled"] = true;
                    localStorage.setItem('modSettings', JSON.stringify(modSettings));
                    
                } catch (error) {
                    console.error('Error in dynamically added script:', error);
                    console.log(error)
                    console.log(error.message)
                    console.log(error.name)
                    console.log(error.lineNumber) 

                    // Dispatch a custom event with error details
                    let errorEvent = new CustomEvent('dynamicallyAddedScriptError', { detail: error });
                    window.dispatchEvent(errorEvent);
                }
            `;
        } else {
            console.log(backendConfig['mods'][modId]["url"])
            js.src = backendConfig['mods'][modId]["url"];
        }
        js.id = modId;

        //why doesnt this trigger i have no idea
        // pseudo resolve by doing this  stuff at the end of the try, bc by then nothign should be wrong
        js.addEventListener('load', function() {
          console.log("loaded")
          if(modId.startsWith("customMod")) {
            notify("Mod loaded successfully");
          }
          modSettings['mods'][modId]["enabled"] = true;
          localStorage.setItem('modSettings', JSON.stringify(modSettings));
          window.removeEventListener('error', globalHandler, true);
        });

        document.head.appendChild(js);    

        

      } else { //mods that have been loaded before
          let modSettings = JSON.parse(localStorage.getItem('modSettings'));
          modSettings['mods'][modId]["enabled"] = true;
          localStorage.setItem('modSettings', JSON.stringify(modSettings));            
          
          // TODO - use globalThis to toggle mod
          console.log(modId)
          globalThis[modId + "Toggle"](true); //true is to toggle

      }
    } else { //currently enabled, so we want to disable
      console.log("hewwo")
      let modSettings = JSON.parse(localStorage.getItem('modSettings'));
      modSettings['mods'][modId]["enabled"] = false;
      localStorage.setItem('modSettings', JSON.stringify(modSettings));
      if (modsPendingReload.includes(modId)) {
        location.reload();
      }
      if(modId.startsWith("custom") || backendConfig['mods'][modId]["reload"]) { //if mod requires reload
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createConfirmReloadModal(modId);
      }
      // TODO - use globalThis to toggle mod
      else {
        globalThis[modId + "Toggle"](false); //false
      }
    }
  }