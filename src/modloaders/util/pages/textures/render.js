import { createNotifyModal } from "../../modals.js";
import { renderCreateView } from "./editor.js";
import {
  createDefaultTexturesZip,
  createPackZip,
  deletePack,
  downloadBlob,
  getActivePackId,
  getBuiltinPacks,
  getGameTextures,
  importPackFromFile,
  loadBuiltinPack,
  loadPacks,
  switchTexturePack,
} from "./utils.js";

export { renderTexturesMenu };

const renderTexturesMenu = (sectionDiv) => {
  while (sectionDiv.firstChild) {
    sectionDiv.removeChild(sectionDiv.lastChild);
  }

  let wrapper = document.createElement("div");
  wrapper.id = "textures-wrapper";
  let c = {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    height: "100%",
    boxSizing: "border-box",
    padding: "10px",
    gap: "10px",
    overflow: "hidden",
  };
  Object.keys(c).forEach((a) => {
    wrapper.style[a] = c[a];
  });
  sectionDiv.appendChild(wrapper);

  let content = document.createElement("div");
  content.id = "textures-content";
  content.addEventListener("wheel", (e) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    content.focus();
  });
  c = {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    minHeight: "0",
    gap: "10px",
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
  };
  Object.keys(c).forEach((a) => {
    content.style[a] = c[a];
  });

  wrapper.appendChild(content);

  renderPacksView(content);
};

const renderPacksView = async (content) => {
  while (content.firstChild) {
    content.removeChild(content.lastChild);
  }

  let refresh = () => renderPacksView(content);

  let toolbar = document.createElement("div");
  let c = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    flexShrink: "0",
  };
  Object.keys(c).forEach((a) => {
    toolbar.style[a] = c[a];
  });

  let title = document.createElement("span");
  title.innerHTML = "Texture Packs";
  c = {
    fontFamily: "Retron2000",
    color: "black",
    fontSize: "1.8vw",
  };
  Object.keys(c).forEach((a) => {
    title.style[a] = c[a];
  });

  toolbar.appendChild(title);
  content.appendChild(toolbar);

  let grid = document.createElement("div");
  c = {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "15px",
    alignContent: "start",
    flexShrink: "0",
  };
  Object.keys(c).forEach((a) => {
    grid.style[a] = c[a];
  });
  content.appendChild(grid);

  let newPackCard = createNewPackCard(refresh, () => renderCreateView(content, refresh));
  grid.appendChild(newPackCard);

  let activeId = null;
  try {
    activeId = await getActivePackId();
  } catch (error) {
    console.warn("could not load the active texture pack:", error);
  }
  grid.insertBefore(createDefaultCard(activeId, refresh), newPackCard);

  getBuiltinPacks().forEach((entry) => {
    grid.insertBefore(
      createBuiltinPackCard(entry, activeId === entry.id, refresh, async () => {
        try {
          let pack = await loadBuiltinPack(entry.id);
          renderCreateView(content, refresh, { ...pack, id: null, name: pack.name + " (copy)" });
        } catch (error) {
          createNotifyModal(error.message);
        }
      }),
      newPackCard
    );
  });

  try {
    let packs = await loadPacks();
    packs
      .sort((a, b) => String(a.name).localeCompare(String(b.name)))
      .forEach((pack) => {
        try {
          grid.insertBefore(
            createPackCard(
              pack,
              activeId === pack.id,
              refresh,
              () => renderCreateView(content, refresh, pack)
            ),
            newPackCard
          );
        } catch (error) {
          console.warn("could not render texture pack:", pack, error);
        }
      });
  } catch (error) {
    console.warn("wtf could not load texture packs:", error);
  }
};

const createCardButton = (text) => {
  let button = document.createElement("button");
  button.innerHTML = text;
  let c = {
    fontFamily: "Retron2000",
    color: "black",
    fontSize: "1vw",
    cursor: "pointer",
    backgroundColor: "white",
    padding: "5px 8px",
    border: "solid 2px black",
    borderRadius: "8px",
    flex: "1",
  };
  Object.keys(c).forEach((a) => {
    button.style[a] = c[a];
  });
  return button;
};

const appendAuthor = (name, author) => {
  if (!author) return;
  let by = document.createElement("span");
  by.innerText = " by " + author;
  by.style.fontSize = "0.9vw";
  by.style.color = "#777";
  name.appendChild(by);
};

const createPackCard = (pack, using, refresh, onEdit) => {
  let card = document.createElement("div");
  card.id = "texture-pack-" + pack.id;
  let c = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "8px",
    backgroundColor: "white",
    border: "solid 3px black",
    borderRadius: "10px",
    padding: "10px",
    fontFamily: "Retron2000",
    color: "black",
    minHeight: "9vw",
  };
  Object.keys(c).forEach((a) => {
    card.style[a] = c[a];
  });

  let name = document.createElement("span");
  name.innerHTML = pack.name;
  appendAuthor(name, pack.author);
  c = {
    fontSize: "1.4vw",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
  Object.keys(c).forEach((a) => {
    name.style[a] = c[a];
  });

  let info = document.createElement("span");
  info.innerHTML = Object.keys(pack.textures).length + " textures";
  c = {
    fontSize: "0.9vw",
    color: "#555",
  };
  Object.keys(c).forEach((a) => {
    info.style[a] = c[a];
  });

  let buttons = document.createElement("div");
  c = {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
  };
  Object.keys(c).forEach((a) => {
    buttons.style[a] = c[a];
  });

  let useButton = createCardButton(using ? "Using" : "Use");
  useButton.style.backgroundColor = using ? "rgb(45, 186, 47)" : "rgb(135, 206, 250)";
  useButton.onclick = async () => {
    await switchTexturePack(pack.id);
    refresh();
  };

  let editButton = createCardButton("Edit");
  editButton.onclick = onEdit;

  let downloadButton = createCardButton("Download");
  downloadButton.onclick = async () => {
    try {
      let blob = await createPackZip(pack.name, pack.textures);
      downloadBlob(blob, pack.name + ".zip");
    } catch (error) {
      createNotifyModal(error.message);
    }
  };

  let deleteButton = createCardButton("Delete");
  deleteButton.style.backgroundColor = "rgb(222, 48, 51)";
  deleteButton.style.color = "white";
  deleteButton.onclick = async () => {
    await deletePack(pack.id);
    if (await getActivePackId() === pack.id) {
      await switchTexturePack(null);
    }
    refresh();
  };

  buttons.appendChild(useButton);
  buttons.appendChild(editButton);
  buttons.appendChild(downloadButton);
  buttons.appendChild(deleteButton);
  card.appendChild(name);
  card.appendChild(info);
  card.appendChild(buttons);
  return card;
};

const createBuiltinPackCard = (entry, using, refresh, onCopy) => {
  let card = document.createElement("div");
  card.id = "texture-pack-" + entry.id;
  let c = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "8px",
    backgroundColor: "white",
    border: "solid 3px black",
    borderRadius: "10px",
    padding: "10px",
    fontFamily: "Retron2000",
    color: "black",
    minHeight: "9vw",
  };
  Object.keys(c).forEach((a) => {
    card.style[a] = c[a];
  });

  let name = document.createElement("span");
  name.innerText = entry.name;
  appendAuthor(name, entry.author);
  c = {
    fontSize: "1.4vw",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
  Object.keys(c).forEach((a) => {
    name.style[a] = c[a];
  });

  let info = document.createElement("span");
  info.innerText = entry.desc || "";
  c = {
    fontSize: "0.9vw",
    color: "#555",
  };
  Object.keys(c).forEach((a) => {
    info.style[a] = c[a];
  });

  let useButton = createCardButton(using ? "Using" : "Use");
  useButton.style.backgroundColor = using ? "rgb(45, 186, 47)" : "rgb(135, 206, 250)";
  useButton.onclick = async () => {
    useButton.disabled = true;
    useButton.innerHTML = "Loading...";
    try {
      await switchTexturePack(entry.id);
    } catch (error) {
      createNotifyModal(error.message);
    }
    refresh();
  };

  let copyButton = createCardButton("Copy");
  copyButton.onclick = onCopy;

  let buttons = document.createElement("div");
  c = {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
  };
  Object.keys(c).forEach((a) => {
    buttons.style[a] = c[a];
  });
  buttons.appendChild(useButton);
  buttons.appendChild(copyButton);

  card.appendChild(name);
  card.appendChild(info);
  card.appendChild(buttons);
  return card;
};

const createDefaultCard = (activeId, refresh) => {
  let card = document.createElement("div");
  card.id = "texture-pack-default";
  let c = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "8px",
    backgroundColor: "white",
    border: "solid 3px black",
    borderRadius: "10px",
    padding: "10px",
    fontFamily: "Retron2000",
    color: "black",
    minHeight: "9vw",
  };
  Object.keys(c).forEach((a) => {
    card.style[a] = c[a];
  });

  let name = document.createElement("span");
  name.innerHTML = "Default Textures";
  c = {
    fontSize: "1.4vw",
  };
  Object.keys(c).forEach((a) => {
    name.style[a] = c[a];
  });

  let info = document.createElement("span");
  info.innerHTML = "Original game textures";
  c = {
    fontSize: "0.9vw",
    color: "#555",
  };
  Object.keys(c).forEach((a) => {
    info.style[a] = c[a];
  });

  let using = activeId === null;
  let useButton = createCardButton(using ? "Using" : "Use");
  useButton.style.backgroundColor = using ? "rgb(45, 186, 47)" : "rgb(135, 206, 250)";
  useButton.onclick = async () => {
    await switchTexturePack(null);
    refresh();
  };

  let downloadAllButton = createCardButton("Download All");
  downloadAllButton.title = "Download all default textures";
  downloadAllButton.onclick = async () => {
    downloadAllButton.disabled = true;
    downloadAllButton.innerHTML = "Zipping...";
    try {
      let blob = await createDefaultTexturesZip(getGameTextures());
      downloadBlob(blob, "default-textures.zip");
    } catch (error) {
      createNotifyModal(error.message);
    } finally {
      downloadAllButton.disabled = false;
      downloadAllButton.innerHTML = "Download All";
    }
  };

  let buttons = document.createElement("div");
  c = {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
  };
  Object.keys(c).forEach((a) => {
    buttons.style[a] = c[a];
  });
  buttons.appendChild(useButton);
  buttons.appendChild(downloadAllButton);

  card.appendChild(name);
  card.appendChild(info);
  card.appendChild(buttons);
  return card;
};

const createNewPackCard = (refresh, onCreate) => {
  let card = document.createElement("div");
  card.id = "texture-pack-new";
  let c = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "8px",
    backgroundColor: "white",
    border: "dashed 3px black",
    borderRadius: "10px",
    padding: "10px",
    fontFamily: "Retron2000",
    color: "black",
    minHeight: "9vw",
  };
  Object.keys(c).forEach((a) => {
    card.style[a] = c[a];
  });

  let name = document.createElement("span");
  name.innerHTML = "New Textures";
  c = {
    fontSize: "1.4vw",
  };
  Object.keys(c).forEach((a) => {
    name.style[a] = c[a];
  });

  let buttons = document.createElement("div");
  c = {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
  };
  Object.keys(c).forEach((a) => {
    buttons.style[a] = c[a];
  });

  let importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = ".zip";
  importInput.style.display = "none";
  importInput.onchange = async () => {
    if (!importInput.files || importInput.files.length === 0) return;
    try {
      let pack = await importPackFromFile(importInput.files[0]);
      await refresh();
      createNotifyModal(
        "Imported " +
          pack.name +
          " with " +
          Object.keys(pack.textures).length +
          " textures."
      );
    } catch (error) {
      createNotifyModal(error.message);
    }
  };

  let importButton = createCardButton("Import");
  importButton.onclick = () => importInput.click();

  let createButton = createCardButton("Create Pack");
  createButton.onclick = onCreate;

  buttons.appendChild(createButton);
  buttons.appendChild(importButton);

  card.appendChild(name);
  card.appendChild(buttons);
  card.appendChild(importInput);
  return card;
};
