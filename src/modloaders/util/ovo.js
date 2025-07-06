import { runtime } from "../modloader.js"

export {isInLevel, isPaused, closePaused, getPlayer, disableClick, enableClick, notify, menuButtonHover, levelButtonHover, addSkin, addModloaderButtonTexture } 

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

let getPlayer = () => {
  return runtime.types_by_index
      .filter(
          (x) =>
          !!x.animations &&
          x.animations[0].frames[0].texture_file.includes("collider")
      )[0]
      .instances.filter(
          (x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
      )[0];
}

let menuButtonHover = () => {
  let presentButtons = runtime.types_by_index.filter((x) =>
  x.behaviors.some(
    (y) => y.behavior instanceof cr.behaviors.aekiro_button)
  )[0].instances;
  for(let i = 0; i < presentButtons.length; i++) {
    if(presentButtons[i].behavior_insts[0].isMouseOver() || presentButtons[i].behavior_insts[0].isInTouch()) {
        return presentButtons[i]
    }
  }
  return null;
}

let levelButtonHover = () => {
  let presentButtons = runtime.types_by_index.filter((x) =>
  x.behaviors.some(
    (y) => y.behavior instanceof cr.behaviors.aekiro_button)
  )[4].instances;
  for(let i = 0; i < presentButtons.length; i++) {
    if(presentButtons[i].behavior_insts[0].isMouseOver() || presentButtons[i].behavior_insts[0].isInTouch()) {
        return presentButtons[i]
    }
  }
  return null;
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
  document.getElementById("c2canvasdiv").style.pointerEvents = "none";
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
    document.getElementById("c2canvasdiv").style.pointerEvents = "auto";
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

let addSkin = (skinId, templateId, url, data_response) => {
  let templateIndex = runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[templateId].head.type.index

  let index = runtime.types_by_index.length;

  // let data_response = await fetch('data.js')
  //           .then((response) => response.json())
  //           .then(jsondata => {
  //               return jsondata;
  //           });
  let pm = data_response["project"]

  let m = structuredClone(pm[3][templateIndex]) // copy skin type
  // console.log(m)

  // console.log(pm)
  m[0] = "t" + index

  for (let i = 0, len = m[7].length; i < len; i++) {
      for (let j = 0, lenj = m[7][i][7].length; j < lenj; j++) {
          m[7][i][7][j][0] = url
      }
  }

  runtime.objectRefTable = cr.getObjectRefTable();
  var plugin_ctor = runtime.GetObjectReference(m[1]);

  var plugin = null;
  for (let j = 0, lenj = runtime.plugins.length; j < lenj; j++)
  {
      if (runtime.plugins[j] instanceof plugin_ctor)
      {
          plugin = runtime.plugins[j];
          break;
      }
  }


  // var plugin = runtime.plugins[17]
  var type_inst = new plugin.Type(plugin);

  type_inst.name = m[0];
  type_inst.is_family = m[2];
  type_inst.instvar_sids = [987654321987654321] //m[3].slice(0);
  type_inst.vars_count = m[3].length;
  type_inst.behs_count = m[4];
  type_inst.fx_count = m[5];
  type_inst.sid = [123456789123456789] //m[11];
  if (type_inst.is_family)
  {
      type_inst.members = [];				// types in runtime family
      type_inst.family_index = runtime.family_count++;
      type_inst.families = null;
  }
  else
  {
      type_inst.members = null;
      type_inst.family_index = -1;
      type_inst.families = [];			// families runtime type belongs to
  }
  type_inst.family_var_map = null;
  type_inst.family_beh_map = null;
  type_inst.family_fx_map = null;
  type_inst.is_contained = false;
  type_inst.container = null;
  if (m[6])
  {
      type_inst.texture_file = m[6][0];
      type_inst.texture_filesize = m[6][1];
      type_inst.texture_pixelformat = m[6][2];
  }
  else
  {
      type_inst.texture_file = null;
      type_inst.texture_filesize = 0;
      type_inst.texture_pixelformat = 0;		// rgba8
  }
  if (m[7])
  {
      type_inst.animations = m[7];
  }
  else
  {
      type_inst.animations = null;
  }
  type_inst.index = index;                                // save index in to types array in type
  type_inst.instances = [];                           // all instances of runtime type
  type_inst.deadCache = [];							// destroyed instances to recycle next create
  type_inst.solstack = [new cr.selection(type_inst)]; // initialise SOL stack with one empty SOL
  type_inst.cur_sol = 0;
  type_inst.default_instance = null;
  type_inst.default_layerindex = 0;
  type_inst.stale_iids = true;
  type_inst.updateIIDs = cr.type_updateIIDs;
  type_inst.getFirstPicked = cr.type_getFirstPicked;
  type_inst.getPairedInstance = cr.type_getPairedInstance;
  type_inst.getCurrentSol = cr.type_getCurrentSol;
  type_inst.pushCleanSol = cr.type_pushCleanSol;
  type_inst.pushCopySol = cr.type_pushCopySol;
  type_inst.popSol = cr.type_popSol;
  type_inst.getBehaviorByName = cr.type_getBehaviorByName;
  type_inst.getBehaviorIndexByName = cr.type_getBehaviorIndexByName;
  type_inst.getEffectIndexByName = cr.type_getEffectIndexByName;
  type_inst.applySolToContainer = cr.type_applySolToContainer;
  type_inst.getInstanceByIID = cr.type_getInstanceByIID;
  type_inst.collision_grid = new cr.SparseGrid(runtime.original_width, runtime.original_height);
  type_inst.any_cell_changed = true;
  type_inst.any_instance_parallaxed = false;
  type_inst.extra = {};
  type_inst.toString = cr.type_toString;
  type_inst.behaviors = [];
  for (let j = 0, lenj = m[8].length; j < lenj; j++)
  {
      console.log("g")
      let b = m[8][j];
      var behavior_ctor = runtime.GetObjectReference(b[1]);
      var behavior_plugin = null;
      for (let k = 0, lenk = runtime.behaviors.length; k < lenk; k++)
      {
          if (runtime.behaviors[k] instanceof behavior_ctor)
          {
              behavior_plugin = runtime.behaviors[k];
              break;
          }
      }
      if (!behavior_plugin)
      {
          behavior_plugin = new behavior_ctor(runtime);
          behavior_plugin.my_types = [];						// types using runtime behavior
          behavior_plugin.my_instances = new cr.ObjectSet(); 	// instances of runtime behavior
          if (behavior_plugin.onCreate)
              behavior_plugin.onCreate();
          cr.seal(behavior_plugin);
          runtime.behaviors.push(behavior_plugin);
          if (cr.behaviors.solid && behavior_plugin instanceof cr.behaviors.solid)
              runtime.solidBehavior = behavior_plugin;
          if (cr.behaviors.jumpthru && behavior_plugin instanceof cr.behaviors.jumpthru)
              runtime.jumpthruBehavior = behavior_plugin;
          if (cr.behaviors.shadowcaster && behavior_plugin instanceof cr.behaviors.shadowcaster)
              runtime.shadowcasterBehavior = behavior_plugin;
      }
      if (behavior_plugin.my_types.indexOf(type_inst) === -1)
          behavior_plugin.my_types.push(type_inst);
      var behavior_type = new behavior_plugin.Type(behavior_plugin, type_inst);
      behavior_type.name = b[0];
      behavior_type.sid = b[2];
      behavior_type.onCreate();
      cr.seal(behavior_type);
      type_inst.behaviors.push(behavior_type);
  }
  type_inst.global = m[9];
  type_inst.isOnLoaderLayout = m[10];
  type_inst.effect_types = [];
  for (let j = 0, lenj = m[12].length; j < lenj; j++)
  {
      type_inst.effect_types.push({
          id: m[12][j][0],
          name: m[12][j][1],
          shaderindex: -1,
          preservesOpaqueness: false,
          active: true,
          index: j
      });
  }
  type_inst.tile_poly_data = m[13];
  if (!runtime.uses_loader_layout || type_inst.is_family || type_inst.isOnLoaderLayout || !plugin.is_world || true)
  {
      type_inst.onCreate();
      cr.seal(type_inst);
  }
  if (type_inst.name) {
      runtime.types[type_inst.name] = type_inst;
  }
  runtime.types_by_index.push(type_inst);
  if (plugin.singleglobal)
  {
      var instance = new plugin.Instance(type_inst);
      instance.uid = runtime.next_uid++;
      instance.puid = runtime.next_puid++;
      instance.iid = 0;
      instance.get_iid = cr.inst_get_iid;
      instance.toString = cr.inst_toString;
      instance.properties = m[14];
      instance.onCreate();
      cr.seal(instance);
      type_inst.instances.push(instance);
      runtime.objectsByUid[instance.uid.toString()] = instance;
  }
  // i = 7
  // j = 15
  // var familydata = pm[4][i];
  // console.log(familydata)
  // var familytype = runtime.types_by_index[213]; //
  // var familymember;
  // familymember = runtime.types_by_index[index];
  // if(index === index || familydata[i] === 123) {
  //     console.log("LLLLLLLLLLLLLL")
  // }
  // familymember.families.push(familytype);
  // familytype.members.push(familymember);


  // for (let i = 0, len = pm[28].length; i < len; i++)
  // {
  //   console.log(pm[28][i])
  //     var containerdata = pm[28][i];
  //     var containertypes = [];
  //     for (let j = 0, lenj = containerdata.length; j < lenj; j++)
  //         containertypes.push(runtime.types_by_index[containerdata[j]]);
  //     for (let j = 0, lenj = containertypes.length; j < lenj; j++)
  //     {
  //         containertypes[j].is_contained = true;
  //         containertypes[j].container = containertypes;
  //     }
  // }


  let i = index
  let t = runtime.types_by_index[i];

  t.family_var_map = new Array(runtime.family_count);
  t.family_beh_map = new Array(runtime.family_count);
  t.family_fx_map = new Array(runtime.family_count);
  var all_fx = [];
  var varsum = 0;
  var behsum = 0;
  var fxsum = 0;
  for (let j = 0, lenj = t.families.length; j < lenj; j++)
  {
      let f = t.families[j];
      t.family_var_map[f.family_index] = varsum;
      varsum += f.vars_count;
      t.family_beh_map[f.family_index] = behsum;
      behsum += f.behs_count;
      t.family_fx_map[f.family_index] = fxsum;
      fxsum += f.fx_count;
      for (let k = 0, lenk = f.effect_types.length; k < lenk; k++)
          all_fx.push(cr.shallowCopy({}, f.effect_types[k]));
  }
  t.effect_types = all_fx.concat(t.effect_types);
  for (let j = 0, lenj = t.effect_types.length; j < lenj; j++)
      t.effect_types[j].index = j;

  // for (i = 0, len = pm[5].length; i < len; i++)
  // {
  //     m = pm[5][i];
  //     // console.log(m)
  //     var layout = new cr.layout(runtime, m);
  //     cr.seal(layout);
  //     runtime.layouts[layout.name] = layout;
  //     runtime.layouts_by_index.push(layout);
  // }



  // type_inst.default_instance = [
  //     [
  //         97.35780334472656,
  //         71.66355895996094,
  //         0,
  //         32,
  //         32,
  //         0,
  //         0,
  //         1,
  //         0.5,
  //         1,
  //         0,
  //         0,
  //         []
  //     ],
  //     index,
  //     58,
  //     [
  //         [
  //             skinId
  //         ]
  //     ],
  //     [],
  //     [
  //         0,
  //         "Default",
  //         0,
  //         1
  //     ]
  // ]

  let template_default_instance = structuredClone(runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins[templateId].head.type.default_instance) // copy skin type
  type_inst.default_instance = template_default_instance
  console.log(type_inst.default_instance)

  type_inst.default_instance[1] = index
  // type_inst.default_instance[3][0][0] = skinId;
  type_inst.default_instance[3] = [
      [
          skinId
      ]
  ];

  cr.plugins_.skymen_skinsCore.prototype.acts.AddSkin.call(runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0], type_inst, skinId, 0, '', '')

}

let addModloaderButtonTexture = () => {
  let x = [
    "Modloader", //name --
    0, //speed
    false, //loop
    1, //repeat count
    0, //repeat to
    false, //pingpong
    12341234214, //sid --
    [
        [
            "../src/img/modloader/menubuttonanim.png", //texture file --
            1796, //texture filesize --
            0, //offx --
            0, //offy --
            64, //width
            64, //height
            1, //duration
            0.5, //hotspotX
            0.5, //hotspotY
            [
              [
                  "topLeft",
                  0,
                  0
              ]
            ], //image pts
            [], //poly pts
            0 // pixelformat
        ],
        [
            "../src/img/modloader/menubuttonanim.png", //texture file --
            1796, //texture filesize --
            66, //offx --
            0, //offy --
            64, //width
            64, //height
            1, //duration
            0.5, //hotspotX
            0.5, //hotspotY
            [
              [
                  "topLeft",
                  0,
                  0
              ]
            ], //image pts
            [], //poly pts
            0 // pixelformat
        ],
        [
            "../src/img/modloader/menubuttonanim.png", //texture file --
            1796, //texture filesize --
            0, //offx --
            0, //offy --
            64, //width
            64, //height
            1, //duration
            0.5, //hotspotX
            0.5, //hotspotY
            [
              [
                  "topLeft",
                  0,
                  0
              ]
            ], //image pts
            [
                0.5,
                0.5,
                -0.5,
                0.5,
                -0.5,
                -0.5,
                0.5,
                -0.5
            ], //poly pts
            0 // pixelformat
        ],
    ]
  ]



  function frame_getDataUri()
  {
    if (this.datauri.length === 0)
    {
      var tmpcanvas = document.createElement("canvas");
      tmpcanvas.width = this.width;
      tmpcanvas.height = this.height;
      var tmpctx = tmpcanvas.getContext("2d");
      if (this.spritesheeted)
      {
        tmpctx.drawImage(this.texture_img, this.offx, this.offy, this.width, this.height,
                      0, 0, this.width, this.height);
      }
      else
      {
        tmpctx.drawImage(this.texture_img, 0, 0, this.width, this.height);
      }
      this.datauri = tmpcanvas.toDataURL("image/png");
    }
    return this.datauri;
  };

  // types = runtime.types_by_index.filter((x) =>
  //   x.behaviors.some(
  //     (y) => y.behavior instanceof cr.behaviors.aekiro_button
  //   )
  // );

  var anim, frame, animobj, frameobj, wt, uv;
  var i, leni, j, lenj;

  let spritePlugin = runtime.types_by_index.filter((x) =>
    x.plugin instanceof cr.plugins_.Sprite &&
    x.all_frames &&
    x.all_frames.some(frame => frame.texture_file && frame.texture_file.includes("menubutton")) &&
    x.instances.some(
      (y) => y.uiType === "button"
    )
  )[0];

  // let spritePlugin = types[0].instances[7].type; //probably find a better call for this bc of version differences

  spritePlugin.animations.push({})

  anim = x;
  console.log(anim)
  animobj = {};
  animobj.name = anim[0];
  animobj.speed = anim[1];
  animobj.loop = anim[2];
  animobj.repeatcount = anim[3];
  animobj.repeatto = anim[4];
  animobj.pingpong = anim[5];
  animobj.sid = anim[6];
  animobj.frames = [];
  for (j = 0, lenj = anim[7].length; j < lenj; j++)
  {
    frame = anim[7][j];
    frameobj = {};
    frameobj.texture_file = frame[0];
    frameobj.texture_filesize = frame[1];
    frameobj.offx = frame[2];
    frameobj.offy = frame[3];
    frameobj.width = frame[4];
    frameobj.height = frame[5];
    frameobj.duration = frame[6];
    frameobj.hotspotX = frame[7];
    frameobj.hotspotY = frame[8];
    frameobj.image_points = frame[9];
    frameobj.poly_pts = frame[10];
    frameobj.pixelformat = frame[11];
    frameobj.spritesheeted = (frameobj.width !== 0);
    frameobj.datauri = "";		// generated on demand and cached
    frameobj.getDataUri = frame_getDataUri;
    uv = {};
    uv.left = 0;
    uv.top = 0;
    uv.right = 1;
    uv.bottom = 1;
    frameobj.sheetTex = uv;
    frameobj.webGL_texture = null;
    wt = runtime.findWaitingTexture(frame[0]);
    if (wt)
    {
      frameobj.texture_img = wt;
    }
    else
    {
      frameobj.texture_img = new Image();
      frameobj.texture_img.cr_src = frame[0];
      frameobj.texture_img.cr_filesize = frame[1];
      frameobj.texture_img.c2webGL_texture = null;
      frameobj.texture_img.onload = (function(f) {
        return function() {
          f.webGL_texture = runtime.glwrap.loadTexture(f.texture_img, true, runtime.linearSampling, f.pixelformat);
          console.log("Loaded texture: " + f.texture_img.cr_src);
          let y = [
              [
                 //bascially find the x position of the Reload button in the Pause menu, and adjust relative to that
                  runtime.layouts["Level 1"].layers.find(function(a) {return "Overlay" === a.name}).initial_instances.find(item => JSON.stringify(item).includes("Reload"))[0][0] + 70,
                  38,
                  0,
                  64,
                  64,
                  0,
                  0,
                  1,
                  0.5,
                  0.5,
                  0,
                  0,
                  []
              ],
              spritePlugin.index,
              3104, // check this too maybe
              [
                  [
                      0
                  ],
                  [
                      1
                  ],
                  [
                      0
                  ],
                  [
                      0
                  ],
                  [
                      ""
                  ],
                  [
                      ""
                  ],
                  [
                      0
                  ],
                  [
                      0
                  ],
                  [
                      0
                  ],
                  [
                      0
                  ]
              ],
              [
                  [
                      1,
                      "1",
                      "2",
                      "",
                      "Click",
                      1,
                      "Hover",
                      1,
                      "Menu > Modloader",
                      ""
                  ],
                  [
                      ""
                  ],
                  [
                      0,
                      0,
                      0,
                      0,
                      1
                  ],
                  [
                      "",
                      ""
                  ]
              ],
              [
                  0,
                  "Modloader",
                  0,
                  1
              ]
          ]

          let y1 = [
              [
                  38,
                  38,
                  0,
                  64,
                  64,
                  0,
                  0,
                  1,
                  0.5,
                  0.5,
                  0,
                  0,
                  []
              ],
              spritePlugin.index,
              3104,
              [
                  [
                      0
                  ],
                  [
                      1
                  ],
                  [
                      0
                  ],
                  [
                      0
                  ],
                  [
                      ""
                  ],
                  [
                      ""
                  ],
                  [
                      0
                  ],
                  [
                      0
                  ],
                  [
                      0
                  ],
                  [
                      0
                  ]
              ],
              [
                  [
                      1,
                      "1",
                      "2",
                      "",
                      "Click",
                      1,
                      "Hover",
                      1,
                      "Menu > Modloader",
                      ""
                  ],
                  [
                      ""
                  ],
                  [
                      0,
                      0,
                      0,
                      0,
                      1
                  ],
                  [
                      "",
                      ""
                  ]
              ],
              [
                  0,
                  "Modloader",
                  0,
                  1
              ]
          ]

          // pauseLayer.startup_initial_instances.push(y);
          // pauseLayer.initial_instances.push(y);

          // runtime.trigger(inst.type.plugin.cnds.OnCreated, inst);
          // // inst.onCreate();
          // runtime.redraw = true

          runtime.layouts_by_index.forEach(layout => {
            layout.layers.forEach(layer => {
              if (layer.name === "Pause" || layer.name === "End Game" || layer.name === "End Card") {
                layer.startup_initial_instances.push(y);
                layer.initial_instances.push(y);
              }
            });
            if (layout.sheetname === "Main Menu") {
              layout.layers.forEach(layer => {
                if (layer.name === "Layer 1") {
                  layer.startup_initial_instances.push(y1);
                  layer.initial_instances.push(y1);
                }
                if(layout.name === "Level Menu" && layer.name === "Layer 0") {
                  layer.startup_initial_instances.push(y1);
                  layer.initial_instances.push(y1);
                }
              });
            }
          });
          runtime.changelayout = runtime.running_layout; //to fix not rendering
          // let pauseLayer = runtime.running_layout.layers.find(function(a) {return "Layer 1" === a.name})

          // let inst = runtime.createInstance(spritePlugin, pauseLayer, 38, 38); //228, -61
          // inst.width = 64;
          // inst.height = 64;
          // inst.instance_vars[4] = 'Modloader'
          // inst.properties[1] = 'Modloader'
          // inst.behavior_insts[0].callbackName = "Menu > Pause"
          // inst.behavior_insts[2].properties[4] = 1;

          // inst.set_bbox_changed();
          // cr.plugins_.Sprite.prototype.acts.SetAnim.call(inst, "Modloader"); // or specify animation name if needed


          
        };
      })(frameobj);

      frameobj.texture_img.onerror = function() {
        console.error("fail " + frame[0]);
      };

      frameobj.texture_img.src = frame[0];
      // runtime.waitForImageLoad(frameobj.texture_img, frame[0]);
    }
    cr.seal(frameobj);
    animobj.frames.push(frameobj);
    spritePlugin.all_frames.push(frameobj);
  }
  cr.seal(animobj);
  console.log(animobj)
  console.log(spritePlugin.animations.length)
  spritePlugin.animations[spritePlugin.animations.length - 1] = animobj;		// swap array data for object
}
