import { runtime } from "../modloader.js"

export {isInLevel, isPaused, closePaused, disableClick, enableClick, notify} 

let isInLevel = () => {
    return runtime.running_layout.name.startsWith("Level") && runtime.running_layout.name !== "Level Menu"
};
let isPaused = () => {
    if (isInLevel()) return runtime.running_layout.layers.find(function(a) {
        return "Pause" === a.name
    }).visible
};

let closePaused = () => {
    if (isInLevel()) return runtime.running_layout.layers.find(function(a) {return "Pause" === a.name}).visible = false
}



// let disableScroll = () => {
//     let map = [];
//     let mapUI = [];
//     let types = runtime.types_by_index.filter((x) =>
//       x.behaviors.some(
//         (y) => y.behavior instanceof cr.behaviors.aekiro_scrollView
//       )
//     );
//     types.forEach((type) => {
//       type.instances.forEach((inst) => {
//         let behavior = inst.behavior_insts.find(
//           (x) => x.behavior instanceof cr.behaviors.aekiro_scrollView
//         );
//         console.log(behavior)
//         console.log(behavior.scroll.isEnabled)
//         map.push({
//           inst,
//           oldState: behavior.scroll.isEnabled,
//         });
//         behavior.scroll.isEnabled = false;
//       });
//     });
//     let layer = runtime.running_layout.layers.find((x) => x.name == "UI");
//     if (layer) {
//       layer.instances.forEach((inst) => {
//         //save state to mapUI
//         mapUI.push({
//           inst,
//           oldState: {
//             width: inst.width,
//             height: inst.height,
//           },
//         });
//         // set size to 0
//         inst.width = 0;
//         inst.height = 0;
//         inst.set_bbox_changed();
//       });
//     }
//     return {
//       map,
//       mapUI,
//     };
//   };

// let enableScroll = ({ map, mapUI }) => {
//     map.forEach((x) => {
//       let inst = x.inst.behavior_insts.find(
//         (x) => x.behavior instanceof cr.behaviors.aekiro_scrollView
//       );
//       inst.scroll.isEnabled = inst.scroll.isEnabled ? 1 : x.oldState;
//     });
//     mapUI.forEach((x) => {
//       x.inst.width = x.oldState.width;
//       x.inst.height = x.oldState.height;
//       x.inst.set_bbox_changed();
//     });
//   };


let disableClick = () => {
    let map = [];
    let mapUI = [];
    let types = runtime.types_by_index.filter((x) =>
      x.behaviors.some(
        (y) => y.behavior instanceof cr.behaviors.aekiro_button
      )
    );
    types.forEach((type) => {
      type.instances.forEach((inst) => {
        let behavior = inst.behavior_insts.find(
          (x) => x.behavior instanceof cr.behaviors.aekiro_button
        );
        // console.log(behavior)
        // console.log(behavior.isEnabled)
        map.push({
          inst,
          oldState: behavior.isEnabled,
        });
        behavior.isEnabled = 0;
      });
    });
    let layer = runtime.running_layout.layers.find((x) => x.name == "UI");
    if (layer) {
      layer.instances.forEach((inst) => {
        //save state to mapUI
        mapUI.push({
          inst,
          oldState: {
            width: inst.width,
            height: inst.height,
          },
        });
        // set size to 0
        inst.width = 0;
        inst.height = 0;
        inst.set_bbox_changed();
      });
    }
    return {
      map,
      mapUI,
    };
  };

  let enableClick = ({ map, mapUI }) => {
    map.forEach((x) => {
      let inst = x.inst.behavior_insts.find(
        (x) => x.behavior instanceof cr.behaviors.aekiro_button
      );
      inst.isEnabled = inst.isEnabled ? 1 : x.oldState;
    });
    mapUI.forEach((x) => {
      x.inst.width = x.oldState.width;
      x.inst.height = x.oldState.height;
      x.inst.set_bbox_changed();
    });
  };



let notify = (title, text, image = "./speedrunner.png") => {
    cr.plugins_.sirg_notifications.prototype.acts.AddSimpleNotification.call(
        runtime.types_by_index.find(
            (type) => type.plugin instanceof cr.plugins_.sirg_notifications
        ).instances[0],
        title,
        text,
        image
    );
};
