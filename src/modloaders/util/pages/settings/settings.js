import { runtime, backendConfig } from "../../../modloader.js";

let modification_map_acts = new WeakMap()
let original_map_acts = new WeakMap()


function customSetMaxSpeed(...args) {
	let original = cr.behaviors.Platform.prototype.acts.SetMaxSpeed
	args[0] = customSetMaxSpeed.value;
	original.apply(this, args)
}

let settingToFunctionMap = {
  "maxspeed": {
    original: cr.behaviors.Platform.prototype.acts.SetMaxSpeed,
    new: customSetMaxSpeed
  }
}

let changeSetting = (settingId, value) => {
  //assume different
  modification_map_acts.set(settingToFunctionMap[settingId].original, function (action) {
    settingToFunctionMap[settingId].new.value = value;
    action.func = settingToFunctionMap[settingId].new;
  })

  for(const action of Object.values(runtime.actsBySid)) {
      if (modification_map_acts.has(action.func)) {
      console.log(modification_map_acts, action)
      modification_map_acts.get(action.func)(action)
    }
  }
}