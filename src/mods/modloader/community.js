(function () {
  let old = globalThis.sdk_runtime;
  c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
  let runtime = globalThis.sdk_runtime;
  globalThis.sdk_runtime = old;

  const state = {
    favorites: new Set(),
    hidden: new Set(),
    searchQuery: '',
    showFavorites: false,
    showHidden: false,
    map: null,
    map2: null,
    levelData: null
  };

  const utils = {
    getPlayer() {
      return runtime.types_by_index
        .filter(x => 
          !!x.animations && 
          x.animations[0].frames[0].texture_file.includes("collider")
        )[0]
        .instances.filter(x => 
          x.instance_vars[17] === "" && 
          x.behavior_insts[0].enabled
        )[0];
    },

    notify(title, text, image = "./speedrunner.png") {
      cr.plugins_.sirg_notifications.prototype.acts.AddSimpleNotification.call(
        runtime.types_by_index.find(
          type => type.plugin instanceof cr.plugins_.sirg_notifications
        ).instances[0],
        title,
        text,
        image
      );
    },

    isInLevel() {
      return runtime.running_layout.name.startsWith("Level");
    },

    isPaused() {
      if (this.isInLevel()) {
        return runtime.running_layout.layers.find(a => 
          a.name === "Pause"
        )?.visible;
      }
    },

    disableClick() {
      const map = [];
      const mapUI = [];
      
      const types = runtime.types_by_index.filter(x =>
        x.behaviors.some(y => y.behavior instanceof cr.behaviors.aekiro_button)
      );
      
      types.forEach(type => {
        type.instances.forEach(inst => {
          const behavior = inst.behavior_insts.find(
            x => x.behavior instanceof cr.behaviors.aekiro_button
          );
          map.push({ inst, oldState: behavior.isEnabled });
          behavior.isEnabled = 0;
        });
      });
      
      const layer = runtime.running_layout.layers.find(x => x.name === "UI");
      if (layer) {
        layer.instances.forEach(inst => {
          mapUI.push({
            inst,
            oldState: { width: inst.width, height: inst.height }
          });
          inst.width = 0;
          inst.height = 0;
          inst.set_bbox_changed();
        });
      }
      
      return { map, mapUI };
    },

    enableClick({ map, mapUI }) {
      map.forEach(x => {
        const inst = x.inst.behavior_insts.find(
          x => x.behavior instanceof cr.behaviors.aekiro_button
        );
        inst.isEnabled = inst.isEnabled ? 1 : x.oldState;
      });
      
      mapUI.forEach(x => {
        x.inst.width = x.oldState.width;
        x.inst.height = x.oldState.height;
        x.inst.set_bbox_changed();
      });
    },

    applyStyles(element, styles) {
      Object.entries(styles).forEach(([key, value]) => {
        element.style[key] = value;
      });
    },

    addButtonTexture() {
      let x = [
        "CommunityLevels", //name --
        0, //speed
        false, //loop
        1, //repeat count
        0, //repeat to
        false, //pingpong
        12341234214, //sid --
        [
            [
                "../src/img/mods/communitybuttonanim.png", //texture file --
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
                "../src/img/mods/communitybuttonanim.png", //texture file --
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
                "../src/img/mods/communitybuttonanim.png", //texture file --
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
                        runtime.layouts["Level 1"].layers.find(function(a) {return "Overlay" === a.name}).initial_instances.find(item => JSON.stringify(item).includes("Reload"))[0][0] + 140,
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
                            "Menu > CommunityLevels",
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
                        "CommunityLevels",
                        0,
                        1
                    ]
                ]
              
              let y1 = [
                  [
                      108,
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
                          "Menu > CommunityLevels",
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
                      "CommunityLevels",
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
    },

    async playLevel(level) {
      console.log("Playing level:", level);
      try {
        const levelJson = await fetch("../src/communitylevels/" + level.levelname)
          .then(res => res.json());
        ovoLevelEditor.startLevel(levelJson);
        document.getElementById("community-menu")?.remove();
        utils.enableClick(state.map);
        document.getElementById("c2canvasdiv").style.filter = "none";
      } catch (error) {
        console.error("Failed to load level:", error);
        utils.notify("Error", "Failed to load level", "./speedrunner.png");
      }
    }
  };

  const dataManager = {
    queryDatabase(query, showFavorites, showHidden) {
      const lowerQuery = query.toLowerCase();
      
      return state.levelData.filter(level => {
        const matchesQuery = 
          level.levelname.replace(/_/g, " ").toLowerCase().includes(lowerQuery) ||
          level.username.toLowerCase().includes(lowerQuery);
        
        const isFavourite = state.favorites.has(level.id);
        const isHidden = state.hidden.has(level.id);
        
        if (!showHidden && showFavorites && !isFavourite) return false;
        if (!showHidden && isHidden) return false;
        if (showHidden && !isHidden && (!showFavorites || !isFavourite)) return false;
        
        return matchesQuery;
      });
    },

    toggleFavourite(levelId) {
      if (state.favorites.has(levelId)) {
        state.favorites.delete(levelId);
        return false;
      } else {
        state.favorites.add(levelId);
        return true;
      }
    },

    toggleHidden(levelId) {
      if (state.hidden.has(levelId)) {
        state.hidden.delete(levelId);
        return false;
      } else {
        state.hidden.add(levelId);
        return true;
      }
    }
  };

  const UI = {
    createButton(text, styles, onClick) {
      const btn = document.createElement("button");
      const baseStyles = {
        fontFamily: "Retron2000",
        cursor: "pointer",
        border: "none",
        ...styles
      };
      utils.applyStyles(btn, baseStyles);
      btn.innerHTML = text;
      btn.onclick = onClick;
            
      return btn;
    },

    createLevelCard(level) {
      const card = document.createElement("div");
      utils.applyStyles(card, {
        minHeight: "250px",
        height: "auto",
        borderRadius: "15px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        border: "2px solid #e0e0e0",
        width: "auto",
        maxWidth: "100%",
        // maxHeight: "10vh",
        boxSizing: "border-box"
      });

      const updateGradient = () => {
        if (state.hidden.has(level.id)) {
          card.style.background = "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)";
          card.style.borderColor = "#ef5350";
        } else if (state.favorites.has(level.id)) {
          card.style.background = "linear-gradient(135deg, #fff8e1 0%, #ffe082 100%)";
          card.style.borderColor = "#ffa726";
        } else {
          card.style.background = "white";
          card.style.borderColor = "#e0e0e0";
        }
      };
      updateGradient();

      const header = document.createElement("div");
      utils.applyStyles(header, {
        flexShrink: "0",
        padding: "15px 20px",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
      });

      const title = document.createElement("div");
      utils.applyStyles(title, {
        fontFamily: "Retron2000",
        fontSize: "16pt",
        color: "black",
        marginBottom: "5px",
        fontWeight: "bold"
      });
      title.textContent = level.levelname.replace(/_/g, " ").slice(0, -5);

      const author = document.createElement("div");
      utils.applyStyles(author, {
        fontFamily: "Retron2000",
        fontSize: "10pt",
        color: "#7f8c8d",
        fontStyle: "italic"
      });
      author.textContent = "by " + level.username;

      header.appendChild(title);
      header.appendChild(author);

      const content = document.createElement("div");
      utils.applyStyles(content, {
        padding: "15px 20px",
        flex: "1",
        fontFamily: "Retron2000",
        fontSize: "11pt",
        color: "black",
        overflowY: "auto",
        textOverflow: "ellipsis"
      });
      content.innerHTML = level.content || "N/A";

      const actions = document.createElement("div");
      utils.applyStyles(actions, {
        padding: "15px 20px",
        display: "flex",
        gap: "10px",
        borderTop: "1px solid rgba(0, 0, 0, 0.1)"
      });

      const playBtn = this.createButton("▶ Play", {
        backgroundColor: "#9268e3",
        color: "white",
        padding: "12px 24px",
        borderRadius: "25px",
        fontSize: "11pt",
        flex: "1"
      }, async () => {
        await utils.playLevel(level);
      });

      const favBtn = this.createButton(
        state.favorites.has(level.id) ? "★" : "☆",
        {
          backgroundColor: "#ffa726",
          color: "white",
          padding: "12px 18px",
          borderRadius: "25px",
          fontSize: "14pt",
          minWidth: "50px"
        },
        () => {
          const isFav = dataManager.toggleFavourite(level.id);
          favBtn.innerHTML = isFav ? "★" : "☆";
          updateGradient();
        }
      );

      const hideBtn = this.createButton(
        state.hidden.has(level.id) ? "👁" : "🚫",
        {
          backgroundColor: "#ef5350",
          color: "white",
          padding: "12px 18px",
          borderRadius: "25px",
          fontSize: "12pt",
          minWidth: "50px"
        },
        () => {
          const isHidden = dataManager.toggleHidden(level.id);
          hideBtn.innerHTML = isHidden ? "👁" : "🚫";
          updateGradient();
        }
      );

      actions.appendChild(playBtn);
      actions.appendChild(favBtn);
      actions.appendChild(hideBtn);

      card.appendChild(header);
      card.appendChild(content);
      card.appendChild(actions);

      return card;
    },

    createLevelsList(levels) {
      const container = document.createElement("div");
      utils.applyStyles(container, {
        position: "relative",
        // top: "25%",
        // left: "0",
        width: "100%",
        height: "75%",
        overflowY: "auto",
        overflowX: "hidden",
        // padding: "10px",
        // margin: "10px",
        // paddingRight: "30px",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        // gridTemplateRows: "max-content",
        gap: "2%",
        // justifyContent: "space-between",
        // alignItems: "space-between",
        // alignContent: "center",
        // justifyContent: "center",
        backgroundColor: "white",
        scrollbarGutter: "stable", 
        scrollbarWidth: "thin",

        borderTop: "2px solid black",
        // boxSizing: "border-box"
      });
      container.id = "levels-list";

      container.addEventListener("wheel", (e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
      });

      if (levels.length === 0) {
        const noResults = document.createElement("div");
        utils.applyStyles(noResults, {
          gridColumn: "1 / -1",
          textAlign: "center",
          padding: "50px",
          fontFamily: "Retron2000",
          fontSize: "14pt",
          color: "#7f8c8d"
        });
        noResults.textContent = "No levels found";
        container.appendChild(noResults);
      } else {
        levels.forEach(level => {
          container.appendChild(this.createLevelCard(level));
        });
      }

      return container;
    },

    async createCommunityMenu() {
      const modal = document.createElement("div");
      modal.id = "community-menu";
      utils.applyStyles(modal, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        maxWidth: "1200px",
        height: "90%",
        backgroundColor: "white",
        borderRadius: "20px",
        // boxShadow: "0 10px 50px rgba(0, 0, 0, 0.3)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Retron2000",
        overflow: "hidden",
        border: "2px solid black",
        zIndex: 1000
      });

      const header = document.createElement("div");
      utils.applyStyles(header, {
        padding: "2.3vh 15px",
        color: "white",
        position: "relative",
        borderBottom: "2px solid black"
      });

      const title = document.createElement("div");
      utils.applyStyles(title, {
        color: "black",
        fontSize: "24pt",
        fontWeight: "bold",
        textAlign: "center"
      });
      title.textContent = "Community Levels";

      const closeBtn = this.createButton("❌", {
        position: "absolute",
        right: "20px",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "white",
        fontSize: "26pt"
      }, () => {
        modal.remove();
        utils.enableClick(state.map);
        document.getElementById("c2canvasdiv").style.filter = "none";
      });

      header.appendChild(title);
      header.appendChild(closeBtn);

      const searchBar = document.createElement("div");
      utils.applyStyles(searchBar, {
        padding: "1.5vh 20px",
        backgroundColor: "white",
        display: "flex",
        gap: "15px",
        alignItems: "center",
        flexWrap: "nowrap",
        borderBottom: "2px solid #e0e0e0",
        overflow: "hidden"
      });

      const searchInput = document.createElement("input");
      utils.applyStyles(searchInput, {
        flex: "1",
        minWidth: "20%",
        padding: "12px 20px",
        fontSize: "11pt",
        fontFamily: "Retron2000",
        border: "2px solid #e0e0e0",
        borderRadius: "25px",
        outline: "none",
      });
      searchInput.placeholder = "Search levels or authors...";
      searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = "#667eea";
        searchInput.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
      });
      searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = "#e0e0e0";
        searchInput.style.boxShadow = "none";
      });
      searchInput.addEventListener('keydown', (e) => {
        e.stopImmediatePropagation();
        if (e.key === 'Enter') performSearch();
        if (e.key === 'Escape') searchInput.blur();
      });
      searchInput.onclick = (e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        searchInput.focus();
      };

      const createCheckbox = (label, checked = false) => {
        const wrapper = document.createElement("label");
        utils.applyStyles(wrapper, {
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          fontSize: "10pt",
          color: "black",
          textWrap: "nowrap"
        });

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = checked;
        utils.applyStyles(checkbox, {
          width: "18px",
          height: "18px",
          cursor: "pointer"
        });

        wrapper.appendChild(checkbox);
        wrapper.appendChild(document.createTextNode(label));
        return { wrapper, checkbox };
      };

      const { wrapper: favWrapper, checkbox: favCheckbox } = createCheckbox("⭐ Favorites");
      const { wrapper: hiddenWrapper, checkbox: hiddenCheckbox } = createCheckbox("🚫 Hidden");

      const randomBtn = this.createButton("🎲", {
        backgroundColor: "#ea66e3ff",
        color: "white",
        padding: "1em",
        borderRadius: "50%",
        fontSize: "1.2em",
        width: "2.5em",
        height: "2.5em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, () => goToRandomLevel());

      const searchBtn = this.createButton("🔎 Search", {
        backgroundColor: "#667eea",
        color: "white",
        padding: "12px 20px",
        borderRadius: "25px",
        textWrap: "nowrap",
        fontSize: "1em"
      }, () => performSearch());

      const performSearch = async () => {
        const query = searchInput.value.trim().toLowerCase();
        const levels = dataManager.queryDatabase(
          query,
          favCheckbox.checked,
          hiddenCheckbox.checked
        );
        
        const oldList = document.getElementById("levels-list");
        if (oldList) oldList.remove();
        
        const newList = this.createLevelsList(levels);
        modal.appendChild(newList);
      };

      const goToRandomLevel = async () => {
        const levels = dataManager.queryDatabase(
          "",
          false,
          false
        );

        if (levels.length > 0) {
          const randomIndex = Math.floor(Math.random() * levels.length);
          const randomLevel = levels[randomIndex];

          await utils.playLevel(randomLevel);
        }
      };

      

      searchBar.appendChild(searchInput);
      searchBar.appendChild(favWrapper);
      searchBar.appendChild(hiddenWrapper);
      searchBar.appendChild(randomBtn);
      searchBar.appendChild(searchBtn);

      const initialLevels = dataManager.queryDatabase("", false, false);
      const levelsList = this.createLevelsList(initialLevels);

      modal.appendChild(header);
      modal.appendChild(searchBar);
      modal.appendChild(levelsList);

      document.body.appendChild(modal);
    }
  };

  const communityLevelsMod = {
    async init() {
      const style = document.createElement("style");
      style.textContent = `
        #ovo-multiplayer-disconnected-container,
        #ovo-multiplayer-other-container,
        #ovo-multiplayer-container {
          pointer-events: none;
        }
        #ovo-multiplayer-tab-container,
        .ovo-multiplayer-button-holder,
        .ovo-multiplayer-tab,
        .ovo-multiplayer-button {
          pointer-events: all;
        }
        
        /* Scrollbar styling */
        #levels-list::-webkit-scrollbar {
          width: 10px;
        }
        #levels-list::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        #levels-list::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 5px;
        }
        #levels-list::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `;
      document.head.appendChild(style);

      state.levelData = await fetch("../src/communitylevels/config/data.json")
        .then(res => res.json());

      document.addEventListener("keydown", this.keyDown);

      utils.addButtonTexture();
      window.addEventListener("ButtonClick", (e) => {
        // console.log(e.detail.name);
        if(e.detail.name === "Menu > CommunityLevels") {
          const menu = document.getElementById("community-menu");
          if (!menu) {
            state.map = utils.disableClick();
            UI.createCommunityMenu();
            document.getElementById("c2canvasdiv").style.filter = "blur(1.2px)";
          }
        }
      }, false);


      utils.notify(
        "Community Levels Loaded",
        "by Awesomeguy<br/>Press Shift + L to open",
        "../src/img/mods/community.png"
      );
    },

    keyDown(event) {
      if (event.shiftKey && event.code === "KeyL") {
        const menu = document.getElementById("community-menu");
        if (!menu) {
          state.map = utils.disableClick();
          document.getElementById("c2canvasdiv").style.filter = "blur(1.2px)";
          UI.createCommunityMenu();
        } else {
          menu.remove();
          utils.enableClick(state.map);
          document.getElementById("c2canvasdiv").style.filter = "none";
        }
      }
    }
  };

  globalThis.communityToggle = function (enable) {
    if (enable) {
      document.addEventListener("keydown", communityLevelsMod.keyDown);
      
    } else {
      const menu = document.getElementById("community-menu");
      if (menu) {
        menu.remove();
        utils.enableClick(state.map);
        document.getElementById("c2canvasdiv").style.filter = "none";
      }
      document.removeEventListener("keydown", communityLevelsMod.keyDown);
    }
  };

  communityLevelsMod.init();
})();