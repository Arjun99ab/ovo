(function () {
  let old = globalThis.sdk_runtime;
  c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
  let runtime = globalThis.sdk_runtime;
  globalThis.sdk_runtime = old;
  targetY = null;
  
  let showPosition = {
    tick() {
      let playerInstances = runtime.types_by_index
        .filter(
          (x) =>
            !!x.animations &&
            x.animations[0].frames[0].texture_file.includes("collider")
        )[0]
        .instances.filter(
          (x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
        );
      let player = playerInstances[0];
      // try {
      //   document.getElementById("pos").innerHTML =
      //     Math.round(player.x.toString()) +
      //     ", " +
      //     Math.round(player.y.toString());
      // } catch (err) {}
    },
  };

  let fly = {
    tick() {
      let playerInstances = runtime.types_by_index
        .filter(
          (x) =>
            !!x.animations &&
            x.animations[0].frames[0].texture_file.includes("collider")
        )[0]
        .instances.filter(
          (x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
        );
      let player = playerInstances[0];
      try {
        player.y = targetY;
      } catch (err) {}
    },
  };


  g = globalThis.ovoExplorer = {
    init: function () {
      runtime.tickMe(showPosition);
    },

    trackOvO: function (a) {
      a ? runtime.tickMe(showPosition) : runtime.untickMe(showPosition);
    },

    warp: function (x, y) {
      targetY = y;
      let playerInstances = runtime.types_by_index
        .filter(
          (x) =>
            !!x.animations &&
            x.animations[0].frames[0].texture_file.includes("collider")
        )[0]
        .instances.filter(
          (x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
        );
      let player = playerInstances[0];
      player.x = x;
      player.y = y;
    },

    levitate: function (a) {
      let playerInstances = runtime.types_by_index
        .filter(
          (x) =>
            !!x.animations &&
            x.animations[0].frames[0].texture_file.includes("collider")
        )[0]
        .instances.filter(
          (x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
        );
      let player = playerInstances[0];
      targetY = player.y;
      a ? runtime.tickMe(fly) : runtime.untickMe(fly);
    },
  };
  g.init();
})();

(function () {
  let old = globalThis.sdk_runtime;
  c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
  let runtime = globalThis.sdk_runtime;
  globalThis.sdk_runtime = old;


  //Get all valid players on the layout
  // Ghosts don't count as valid players, and replays don't count either

  let notify = (text, title = "Save state", image = "./speedrunner.png") => {
    cr.plugins_.sirg_notifications.prototype.acts.AddSimpleNotification.call(
      runtime.types_by_index.find(
        (type) => type.plugin instanceof cr.plugins_.sirg_notifications
      ).instances[0],
      title,
      text,
      image
    );
  };

  notify(
      "Read the mod description for more info",
      "Save State Mod Loaded", "../src/img/mods/savestate.png"
  );

  let getPlayer = () =>
    runtime.types_by_index
      .filter(
        (x) =>
          !!x.animations &&
          x.animations[0].frames[0].texture_file.includes("collider")
      )[0]
      .instances.filter(
        (x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
      )[0];
  let getFlag = () =>
    runtime.types_by_index.find(
      (x) =>
        x.name === "EndFlag" ||
        (x.plugin instanceof cr.plugins_.Sprite &&
          x.all_frames &&
          x.all_frames[0].texture_file.includes("endflag"))
    ).instances[0];
  let getCoin = () =>
      runtime.types_by_index.find(
          (x) =>
          x.name === "Coin" ||
          (x.plugin instanceof cr.plugins_.Sprite &&
              x.all_frames &&
              x.all_frames[0].texture_file.includes("coin"))
      ).instances[0];
  let curState = null;
  let curLayout = null;
  let saveState = () => {
    notify("Saved player state", "State Saved");
    let state = runtime.saveInstanceToJSON(getPlayer(), true);
    return state;
  };
  let loadState = (state) => {
    let player = getPlayer();
    player.y -= 10;
    player.set_bbox_changed();
    player.behavior_insts[0].lastFloorObject = null;
    notify("Loaded player state", "State Loaded");
    runtime.loadInstanceFromJSON(player, state, true);
  };
  // boundKeyDown = keyDown.bind();

  let settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['savestate']['settings'];
  
  let keybindDown = (event, type) => {
    // console.log(event.key, settings[type])
    // console.log(settings)
    if(settings[type].length === 2) { //special + regular
      if (event.key.toLowerCase() === settings[type][1]) {
        if ((event.shiftKey && settings[type][0] === "shift") || (event.ctrlKey && settings[type][0] === "control") || (event.altKey && settings[type][0] === "alt") || (event.metaKey && settings[type][0] === "meta")) {
          return true;
        }
      }
    } else { //regular (1 key)
      if (event.key.toLowerCase() === settings[type][0]) {
        return true;
      }
    }
    return false;
  }
    
  
  let keyDown = (event) => {
    if (!getFlag()) {
      return;
    }

    if (keybindDown(event, "createcheckpointkeybind")){
        // notify("Spawnpoint set", "State Saved");
        curState = saveState();
    }
    if (keybindDown(event, "resetcheckpointkeybind")) {
        curState = null;
        runtime.changeLayout = runtime.runningLayout;
        //runtime.attempts = runtime.attempts + 1;
        notify("State reset by soft level reset", "State Reset");
    }
    if (keybindDown(event, "nextlevelkeybind")) {
          runtime.changelayout = runtime.layouts["Level " + String(parseInt(runtime.running_layout.name.split(' ')[1]) + 1)]
          setTimeout(() => {
              notify("Going to next level bypass", "Next Level");
          }, 300);
    }
    if (keybindDown(event, "flagkeybind")) {
            let player = getPlayer();
            let flag = getFlag();
            player.x = flag.x;
            player.y = flag.y;
            player.set_bbox_changed();
            setTimeout(() => {
                notify("Going to next level", "Next Level");
            }, 300);
    }
    if (keybindDown(event, "prevlevelkeybind")) {
            runtime.changelayout = runtime.layouts["Level " + String(parseInt(runtime.running_layout.name.split(' ')[1]) - 1)]
            setTimeout(() => {
                notify("Going to previous level", "Previous Level");
            }, 300);
    }
    if (keybindDown(event, "coinkeybind")) {
            let player = getPlayer();
            let flag = getCoin();
            player.x = flag.x;
            player.y = flag.y;
            player.set_bbox_changed();
            setTimeout(() => {
                notify("Going to coin", "Coin");
            }, 300);
    }
    
  }

  globalThis.savestateToggle = function (enable) {
    if (enable) {
      document.addEventListener("keydown", keyDown);
    } else {
      document.removeEventListener("keydown", keyDown);
    }
  }

  globalThis.savestateSettingsUpdate = function () {
    settings = JSON.parse(localStorage.getItem("modSettings"))['mods']['savestate']['settings'];
  }
    
  
  document.addEventListener("keydown", keyDown);

  Object.values(runtime.layouts).forEach((layout) => {
    let oldFn = layout.startRunning.bind(layout);
    layout.startRunning = () => {
      oldFn();
      if (!getFlag()) {
        curLayout = layout.name;
        curState = null;
      } else {
        if (curState && curLayout === layout.name) loadState(curState);
        else curState = null;
        curLayout = layout.name;
      }
    };
  });
})();