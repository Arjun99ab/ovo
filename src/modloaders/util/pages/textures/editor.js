import { createNotifyModal } from "../../modals.js";
import {
  createPackId,
  createPackZip,
  downloadBlob,
  downloadUrl,
  getGameTextures,
  readFileAsDataUrl,
  savePack,
} from "./utils.js";

export { renderCreateView };

const renderCreateView = (content, onSaved) => {
  while (content.firstChild) {
    content.removeChild(content.lastChild);
  }

  let replacements = new Map();

  let toolbar = document.createElement("div");
  let c = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    flexShrink: "0",
    flexWrap: "wrap",
  };
  Object.keys(c).forEach((a) => {
    toolbar.style[a] = c[a];
  });

  let nameInput = document.createElement("input");
  nameInput.id = "texture-pack-name";
  nameInput.placeholder = "Pack name";
  c = {
    fontFamily: "Retron2000",
    fontSize: "1.3vw",
    color: "black",
    backgroundColor: "white",
    padding: "8px 10px",
    border: "solid 3px black",
    borderRadius: "10px",
    minWidth: "18vw",
  };
  Object.keys(c).forEach((a) => {
    nameInput.style[a] = c[a];
  });
  nameInput.onkeydown = (event) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
  };
  nameInput.onkeyup = (event) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
  };

  let buttonGroup = document.createElement("div");
  c = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  };
  Object.keys(c).forEach((a) => {
    buttonGroup.style[a] = c[a];
  });

  let saveButton = createToolbarButton("textures-save-btn", "Save Pack");
  saveButton.onclick = async () => {
    let name = nameInput.value.trim();
    if (name === "") {
      createNotifyModal("Enter a name for the texture pack.");
      return;
    }
    if (replacements.size === 0) {
      createNotifyModal("Upload at least one replacement texture first.");
      return;
    }
    await savePack({
      id: createPackId(),
      name: name,
      author: "",
      textures: Object.fromEntries(replacements),
    });
    createNotifyModal("Saved " + name + " with " + replacements.size + " textures.");
    onSaved();
  };

  let downloadButton = createToolbarButton("textures-download-btn", "Download Zip");
  downloadButton.onclick = async () => {
    let name = nameInput.value.trim() || "Texture Pack";
    if (replacements.size === 0) {
      createNotifyModal("Upload at least one replacement texture first.");
      return;
    }
    try {
      let blob = await createPackZip(name, Object.fromEntries(replacements));
      downloadBlob(blob, name + ".zip");
    } catch (error) {
      createNotifyModal(error.message);
    }
  };

  let backButton = createToolbarButton("textures-back-btn", "Back");
  backButton.onclick = () => onSaved();

  buttonGroup.appendChild(saveButton);
  buttonGroup.appendChild(downloadButton);
  buttonGroup.appendChild(backButton);
  toolbar.appendChild(nameInput);
  toolbar.appendChild(buttonGroup);
  content.appendChild(toolbar);

  let list = document.createElement("div");
  c = {
    display: "flex",
    flexDirection: "column",
    flexShrink: "0",
    overflow: "hidden",
    border: "solid 2px black",
    borderRadius: "10px",
    backgroundColor: "white",
  };
  Object.keys(c).forEach((a) => {
    list.style[a] = c[a];
  });
  content.appendChild(list);

  let textures = getGameTextures();
  if (textures.length === 0) {
    let empty = document.createElement("span");
    empty.innerHTML = "No textures were found for this game version.";
    empty.style.fontFamily = "Retron2000";
    empty.style.fontSize = "1.1vw";
    empty.style.padding = "15px";
    list.appendChild(empty);
    return;
  }

  textures.forEach((texture) => {
    list.appendChild(createTextureRow(texture, replacements));
  });
};

const createToolbarButton = (id, text) => {
  let button = document.createElement("button");
  button.id = id;
  button.innerHTML = text;
  let c = {
    fontFamily: "Retron2000",
    color: "black",
    fontSize: "1.3vw",
    cursor: "pointer",
    backgroundColor: "white",
    padding: "8px 14px",
    border: "solid 3px black",
    borderRadius: "10px",
  };
  Object.keys(c).forEach((a) => {
    button.style[a] = c[a];
  });
  return button;
};

const createRowButton = (text) => {
  let button = document.createElement("button");
  button.innerHTML = text;
  let c = {
    fontFamily: "Retron2000",
    color: "black",
    fontSize: "0.9vw",
    cursor: "pointer",
    backgroundColor: "white",
    padding: "4px 8px",
    border: "solid 2px black",
    borderRadius: "8px",
    whiteSpace: "nowrap",
  };
  Object.keys(c).forEach((a) => {
    button.style[a] = c[a];
  });
  return button;
};

const createTextureRow = (texture, replacements) => {
  let row = document.createElement("div");
  row.id = "texture-row-" + texture.path;
  let c = {
    display: "grid",
    gridTemplateColumns: "56px minmax(0, 1fr) 150px max-content max-content",
    alignItems: "center",
    gap: "10px",
    padding: "6px 10px",
    borderBottom: "solid 1px #ccc",
    fontFamily: "Retron2000",
    color: "black",
  };
  Object.keys(c).forEach((a) => {
    row.style[a] = c[a];
  });

  let preview = document.createElement("img");
  preview.src = texture.path;
  c = {
    width: "48px",
    height: "48px",
    objectFit: "contain",
    imageRendering: "pixelated",
    border: "solid 1px #999",
    backgroundColor: "#eee",
  };
  Object.keys(c).forEach((a) => {
    preview.style[a] = c[a];
  });

  let label = document.createElement("span");
  label.innerHTML = texture.path;
  c = {
    fontSize: "1vw",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
  Object.keys(c).forEach((a) => {
    label.style[a] = c[a];
  });

  let status = document.createElement("span");
  status.innerHTML = "Original";
  c = {
    fontSize: "0.9vw",
    color: "#555",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
  Object.keys(c).forEach((a) => {
    status.style[a] = c[a];
  });

  let downloadButton = createRowButton("Download");
  downloadButton.onclick = () => {
    downloadUrl(texture.path, texture.name);
  };

  let uploadInput = document.createElement("input");
  uploadInput.type = "file";
  uploadInput.accept = "image/*";
  uploadInput.style.display = "none";

  let uploadButton = createRowButton("Upload");
  uploadButton.onclick = () => uploadInput.click();

  uploadInput.onchange = async () => {
    if (!uploadInput.files || uploadInput.files.length === 0) return;
    let file = uploadInput.files[0];
    try {
      let dataUrl = await readFileAsDataUrl(file);
      replacements.set(texture.path, dataUrl);
      preview.src = dataUrl;
      status.innerHTML = file.name;
      status.style.color = "rgb(45, 186, 47)";
      uploadButton.innerHTML = "Replace";
    } catch (error) {
      createNotifyModal("Could not read that image.");
    }
  };

  row.appendChild(preview);
  row.appendChild(label);
  row.appendChild(status);
  row.appendChild(downloadButton);
  row.appendChild(uploadButton);
  row.appendChild(uploadInput);
  return row;
};
