import {backendConfig, runtime} from "../../../modloader.js";
import {createConfirmReloadModal, createNotifyModal} from "../../modals.js"
import { modsPendingReload } from "../../modals.js";
import { notify } from "../../ovo.js";

export {useSkin, customModNum, incCustomModNum}

let customModNum = 0;
function incCustomModNum() {
  customModNum++;
}

let globalHandler = null;

function errorOccur(modId, event) {
  let modSettings = JSON.parse(localStorage.getItem('modSettings'));
  console.log(event)
  console.log(event.error.name)
  modSettings = JSON.parse(localStorage.getItem('modSettings'));
  modSettings['mods'][modId]["enabled"] = false;
  localStorage.setItem('modSettings', JSON.stringify(modSettings));
  document.getElementById(modId + '-enable-button').innerHTML = "Reload";
  document.getElementById(modId + '-enable-button').style.backgroundColor = "rgb(255, 255, 0)";
  modsPendingReload.push(modId);

  window.removeEventListener('error', globalHandler, true);
  console.error('Error caught when loading custom script', event);
  document.getElementById("menu-bg").style.pointerEvents = "none";
  document.getElementById("menu-bg").style.filter = "blur(1.2px)";
  createNotifyModal("<u><b>Error: " + event.error.name + "</b></u><br/>" + event.error.message + "<br/>Line: " + event.lineno)
}


function errorOccurHandler(modId) {
  return function(event) {
    errorOccur(modId, event);
  }
}

let useSkin = (skinId) => {
  console.log(skinId)
  let skinSettings = JSON.parse(localStorage.getItem('modSettings'));
  let currentSkin = runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Globals)[0].instances[0].instance_vars[8];
  
  try {
    if (currentSkin !== skinId) {
      let currentSkinUseButton = document.getElementById(currentSkin + "-use-button");
      currentSkinUseButton.innerHTML = "Use";
      currentSkinUseButton.style.backgroundColor = "rgb(135, 206, 250)";
      skinSettings['skins'][currentSkin]["using"] = false;
    }

  } catch (e) {}
  

  //LIKELY NEED TO CHANGE THESE REV CALLS TO BE MORE GENERALIZED?
  if(Object.keys(runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins).includes(skinId) || skinId === "") {
    console.log("skin exists")
    skinSettings['skins'][skinId]["using"] = true;
    runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Globals)[0].instances[0].instance_vars[8] = skinId;
    
    let saveObj = runtime.types_by_index.filter((x) => x.plugin instanceof cr.plugins_.SyncStorage)[0].instances[0];
    saveObj.data.CurSkin = skinId;
    cr.plugins_.SyncStorage.prototype.acts.SaveData.call(saveObj)
    
    
    let insts = runtime.types_by_index.filter((x) =>
      x.behaviors.some(
        (y) => y.behavior instanceof cr.behaviors.SkymenSkin))[0].instances
    let collider = runtime.types_by_index
      .filter(
        (x) =>
          !!x.animations &&
          x.animations[0].frames[0].texture_file.includes("collider")
      )[0]
      .instances[0];
    for(let i = 0; i < insts.length; i++) {
        let cur = insts[i]
        cur.width = cur.curFrame.width
        cur.height = cur.curFrame.height
        cur.set_bbox_changed();    
        let skymenskinbehav = cur.behaviorSkins[0]
        skymenskinbehav.syncScale = true;
        skymenskinbehav.syncSize = false;
        if(skinId === "") {
          cr.behaviors.SkymenSkin.prototype.acts.UseDefault.call(skymenskinbehav);
        } else {
          cr.behaviors.SkymenSkin.prototype.acts.SetSkin.call(skymenskinbehav, skinId);
        }

        cur.width = (collider.width / collider.curFrame.width) * cur.curFrame.width;
        cur.height = (collider.height / collider.curFrame.height) * cur.curFrame.height;
        cur.set_bbox_changed();               
    }
    // runtime.changelayout = runtime.running_layout //reload screen to apply skin, maybe find a way to like set the skin on the fly?
  } 
  localStorage.setItem('modSettings', JSON.stringify(skinSettings));

}

let toggleMod = (modId, enable) => {
    console.log(modId)
    if (enable) { //want to enable
      console.log(document.getElementById(modId))
      console.log(!document.getElementById(modId), !document.getElementById(modId))
      if(!document.getElementById(modId)) { // custom mods or mods that aren't in memory
        let modSettings = JSON.parse(localStorage.getItem('modSettings'));
        let handler = errorOccurHandler(modId);
        window.addEventListener('error', handler, true);
        globalHandler = handler;

        let js = document.createElement("script");
        js.type = "application/javascript";
        if(modId.startsWith("customMod")) {
            // js.text = modSettings['mods'][modId]["url"];
            js.text = `
                try {
                    // Your script code that may throw an error
                    code that throws an error;
                } catch (error) {
                    console.error('Error in dynamically added script:', error);

                    // Dispatch a custom event with error details
                    let errorEvent = new CustomEvent('dynamicallyAddedScriptError', { detail: error.message });
                    window.dispatchEvent(errorEvent);
                }
            `;
        } else {
            console.log(backendConfig['mods'][modId]["url"])
            js.src = backendConfig['mods'][modId]["url"];
        }
        js.id = modId;

        js.onload = function() {
          if(modId.startsWith("customMod")) {
            notify("Mod loaded successfully");
          }
          modSettings['mods'][modId]["enabled"] = true;
          localStorage.setItem('modSettings', JSON.stringify(modSettings));
          window.removeEventListener('error', globalHandler, true);
        }

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