(function () {
  let old = globalThis.sdk_runtime;
  c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
  let runtime = globalThis.sdk_runtime;
  globalThis.sdk_runtime = old;

  // ===== STATE MANAGEMENT (In-Memory) =====
  const state = {
    favourites: new Set(),
    hidden: new Set(),
    searchQuery: '',
    showFavourites: false,
    showHidden: false,
    map: null,
    map2: null,
    levelData: null
  };

  // ===== UTILITY FUNCTIONS =====
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
    }
  };

  // ===== DATA MANAGEMENT =====
  const dataManager = {
    queryDatabase(query, showFavourites, showHidden) {
      const lowerQuery = query.toLowerCase();
      
      return state.levelData.filter(level => {
        const matchesQuery = 
          level.levelname.replace(/_/g, " ").toLowerCase().includes(lowerQuery) ||
          level.username.toLowerCase().includes(lowerQuery);
        
        const isFavourite = state.favourites.has(level.id);
        const isHidden = state.hidden.has(level.id);
        
        if (!showHidden && showFavourites && !isFavourite) return false;
        if (!showHidden && isHidden) return false;
        if (showHidden && !isHidden && (!showFavourites || !isFavourite)) return false;
        
        return matchesQuery;
      });
    },

    toggleFavourite(levelId) {
      if (state.favourites.has(levelId)) {
        state.favourites.delete(levelId);
        return false;
      } else {
        state.favourites.add(levelId);
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

  // ===== UI COMPONENTS =====
  const UI = {
    createButton(text, styles, onClick) {
      const btn = document.createElement("button");
      const baseStyles = {
        fontFamily: "Retron2000",
        cursor: "pointer",
        border: "none",
        // transition: "all 0.3s ease",
        ...styles
      };
      utils.applyStyles(btn, baseStyles);
      btn.innerHTML = text;
      btn.onclick = onClick;
      
      // Hover effect
      // btn.addEventListener('mouseenter', () => {
      //   btn.style.transform = 'scale(1.05)';
      //   btn.style.filter = 'brightness(1.1)';
      // });
      // btn.addEventListener('mouseleave', () => {
      //   btn.style.transform = 'scale(1)';
      //   btn.style.filter = 'brightness(1)';
      // });
      
      return btn;
    },

    createLevelCard(level) {
      const card = document.createElement("div");
      utils.applyStyles(card, {
        minHeight: "250px",
        height: "auto",
        borderRadius: "15px",
        overflow: "visible",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        backgroundColor: "white",
        border: "2px solid #e0e0e0"
      });

      // Update gradient based on state
      const updateGradient = () => {
        if (state.hidden.has(level.id)) {
          card.style.background = "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)";
          card.style.borderColor = "#ef5350";
        } else if (state.favourites.has(level.id)) {
          card.style.background = "linear-gradient(135deg, #fff8e1 0%, #ffe082 100%)";
          card.style.borderColor = "#ffa726";
        } else {
          card.style.background = "white";
          card.style.borderColor = "#e0e0e0";
        }
      };
      updateGradient();

      // Header section
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
        color: "#2c3e50",
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

      // Content section
      const content = document.createElement("div");
      utils.applyStyles(content, {
        padding: "15px 20px",
        flex: "1",
        fontFamily: "Retron2000",
        fontSize: "11pt",
        color: "#34495e",
        // overflow: "hidden",
        textOverflow: "ellipsis"
      });
      content.innerHTML = level.content || "No description available.";

      // Actions section
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
        try {
          const levelJson = await fetch("../src/communitylevels/" + level.levelname)
            .then(res => res.json());
          ovoLevelEditor.startLevel(levelJson);
          document.getElementById("community-menu")?.remove();
          utils.enableClick(state.map);
        } catch (error) {
          console.error("Failed to load level:", error);
          utils.notify("Error", "Failed to load level", "./speedrunner.png");
        }
      });

      const favBtn = this.createButton(
        state.favourites.has(level.id) ? "★" : "☆",
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
        position: "absolute",
        top: "25%",
        left: "0",
        width: "100%",
        height: "75%",
        overflowY: "scroll",
        overflowX: "hidden",
        padding: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "15px",
        alignContent: "start",
        backgroundColor: "white",
        scrollbarWidth: "thin",
        scrollbarColor: "#667eea #e0e0e0",
        borderTop: "2px solid black"
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
        boxShadow: "0 10px 50px rgba(0, 0, 0, 0.3)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Retron2000",
        overflow: "hidden",
        // animation: "slideIn 0.3s ease"
        border: "2px solid black"
      });

      // Add animation
      // const style = document.createElement("style");
      // style.textContent = `
      //   @keyframes slideIn {
      //     from {
      //       opacity: 0;
      //       transform: translate(-50%, -45%);
      //     }
      //     to {
      //       opacity: 1;
      //       transform: translate(-50%, -50%);
      //     }
      //   }
      // `;
      // document.head.appendChild(style);

      // Header
      const header = document.createElement("div");
      utils.applyStyles(header, {
        // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "25px 30px",
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
      });

      header.appendChild(title);
      header.appendChild(closeBtn);

      // Search bar
      const searchBar = document.createElement("div");
      utils.applyStyles(searchBar, {
        padding: "20px 30px",
        backgroundColor: "white",
        display: "flex",
        gap: "15px",
        alignItems: "center",
        flexWrap: "wrap",
        borderBottom: "2px solid #e0e0e0"
      });

      const searchInput = document.createElement("input");
      utils.applyStyles(searchInput, {
        flex: "1",
        minWidth: "250px",
        padding: "12px 20px",
        fontSize: "11pt",
        fontFamily: "Retron2000",
        border: "2px solid #e0e0e0",
        borderRadius: "25px",
        outline: "none",
        transition: "all 0.3s ease"
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

      const createCheckbox = (label, checked = false) => {
        const wrapper = document.createElement("label");
        utils.applyStyles(wrapper, {
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          fontSize: "10pt",
          color: "#34495e"
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

      const { wrapper: favWrapper, checkbox: favCheckbox } = createCheckbox("⭐ Favourites");
      const { wrapper: hiddenWrapper, checkbox: hiddenCheckbox } = createCheckbox("🚫 Hidden");

      const searchBtn = this.createButton("🔍 Search", {
        backgroundColor: "#667eea",
        color: "white",
        padding: "12px 30px",
        borderRadius: "25px",
        fontSize: "11pt"
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

      searchInput.addEventListener('keydown', (e) => {
        e.stopImmediatePropagation();
        if (e.key === 'Enter') performSearch();
        if (e.key === 'Escape') searchInput.blur();
      });

      searchBar.appendChild(searchInput);
      searchBar.appendChild(favWrapper);
      searchBar.appendChild(hiddenWrapper);
      searchBar.appendChild(searchBtn);

      // Initial levels list
      const initialLevels = dataManager.queryDatabase("", false, false);
      const levelsList = this.createLevelsList(initialLevels);

      modal.appendChild(header);
      modal.appendChild(searchBar);
      modal.appendChild(levelsList);

      document.body.appendChild(modal);
    }
  };

  // ===== MAIN MOD =====
  const communityLevelsMod = {
    async init() {
      // Add global styles
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

      try {
        state.levelData = await fetch("../src/communitylevels/config/data.json")
          .then(res => res.json());

        document.addEventListener("keydown", this.keyDown);

        utils.notify(
          "Community Levels Loaded",
          "by Awesomeguy<br/>Press Shift + L to open",
          "../src/img/mods/community.png"
        );
      } catch (error) {
        console.error("Failed to load community levels:", error);
        utils.notify(
          "Error Loading Levels",
          "Failed to load community levels data",
          "./speedrunner.png"
        );
      }
    },

    keyDown(event) {
      if (event.shiftKey && event.code === "KeyL") {
        const menu = document.getElementById("community-menu");
        if (!menu) {
          state.map = utils.disableClick();
          UI.createCommunityMenu();
        } else {
          menu.remove();
          utils.enableClick(state.map);
        }
      }
    }
  };

  // ===== GLOBAL TOGGLE =====
  globalThis.communityToggle = function (enable) {
    if (enable) {
      document.addEventListener("keydown", communityLevelsMod.keyDown);
    } else {
      const menu = document.getElementById("community-menu");
      if (menu) {
        menu.remove();
        utils.enableClick(state.map);
      }
      document.removeEventListener("keydown", communityLevelsMod.keyDown);
    }
  };

  // Initialize the mod
  communityLevelsMod.init();
})();