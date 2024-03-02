import {backendConfig} from "../../../modloader.js";
import {createConfirmReloadModal} from "../../modals.js"

export {toggleMod, customModNum, incCustomModNum}

let customModNum = 0;
function incCustomModNum() {
  customModNum++;
}

let toggleMod = (modId, enable) => {
    console.log(modId)
    if (enable) { //want to enable
      console.log(document.getElementById(modId))
      console.log(!document.getElementById(modId), !document.getElementById(modId))
      if(!document.getElementById(modId)) { // custom mods or mods that aren't in memory
        console.log('sadghyfisatdgifuygasdyifg')
        let js = document.createElement("script");
        js.type = "application/javascript";
        let modSettings = JSON.parse(localStorage.getItem('modSettings'));
        if(modId.startsWith("customMod")) {
            js.text = modSettings['mods'][modId]["url"];
        } else {
            console.log(backendConfig['mods'][modId]["url"])
            js.src = backendConfig['mods'][modId]["url"];
        }
        js.id = modId;
        document.head.appendChild(js);    

        modSettings['mods'][modId]["enabled"] = true;
        localStorage.setItem('modSettings', JSON.stringify(modSettings));

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
      if(modId.startsWith("custom") || backendConfig['mods'][modId]["reload"]) { //if mod requires reload
        document.getElementById("menu-bg").style.pointerEvents = "none";
        document.getElementById("menu-bg").style.filter = "blur(1.2px)";
        createConfirmReloadModal();
      }
      // TODO - use globalThis to toggle mod
      else {
        globalThis[modId + "Toggle"](false); //false
      }
    }
  }