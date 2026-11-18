import { backendConfig, runtime, version } from "../../../modloader.js";

export {
  applyStoredTexturePack, applyTexturePack, baseName, createDefaultTexturesZip, createPackId, createPackZip, deletePack, downloadBlob, downloadUrl, getActivePackId, getBuiltinPacks, getGameTextures, importPackFromFile, loadBuiltinPack, loadPacks, loadZip, readFileAsDataUrl, savePack, setActivePackId, switchTexturePack, textureKey
};

const DB_NAME = "texturepacks";
const ACTIVE_KEY = "texturePackActive";
const ZIP_URL = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";

let zipPromise = null;

const textureKey = (path) => {
  if (!path || typeof path !== "string") return "";
  return path.split("?")[0].split("#")[0].replace(/^\.?\//, "");
};

const baseName = (path) => textureKey(path).split("/").pop();

const mimeFor = (path) => {
  let lower = path.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "image/png";
};

const createPackId = () => {
  return crypto.randomUUID();
};

const loadZip = () => {
  if (globalThis.JSZip) return Promise.resolve(globalThis.JSZip);
  if (zipPromise === null) {
    zipPromise = new Promise((resolve, reject) => {
      let script = document.createElement("script");
      script.src = ZIP_URL;
      script.onload = () => resolve(globalThis.JSZip);
      script.onerror = () => {
        zipPromise = null;
        reject(new Error("Could not load the zip library. Check your internet connection."));
      };
      document.head.appendChild(script);
    });
  }
  return zipPromise;
};

const getGameTextures = () => {
  let textures = new Map();
  let add = (path) => {
    let key = textureKey(path);
    if (!key) return;
    if (key.startsWith("..") || key.startsWith("http")) return;
    if (!textures.has(key)) {
      textures.set(key, { path: key, name: baseName(key) });
    }
  };
  if (!runtime) return [];
  (runtime.wait_for_textures || []).forEach((image) => add(image.cr_src));
  (runtime.all_frames || []).forEach((frame) => add(frame.texture_file));
  runtime.types_by_index.forEach((type) => {
    add(type.texture_file);
    (type.all_frames || []).forEach((frame) => add(frame.texture_file));
  });
  return Array.from(textures.values()).sort((a, b) => a.path.localeCompare(b.path));
};

let localforage = window.localforage
  ? window.localforage.createInstance({ name: DB_NAME })
  : null;

const loadPacks = async () => {
  if (!localforage) return [];
  const keys = await localforage.keys();
  const packs = [];
  for (const key of keys) {
    if (key === ACTIVE_KEY) continue;
    const pack = await localforage.getItem(key);
    if (
      pack &&
      typeof pack === "object" &&
      !Array.isArray(pack) &&
      pack.id &&
      pack.name &&
      pack.textures &&
      typeof pack.textures === "object" &&
      !Array.isArray(pack.textures)
    ) {
      packs.push(pack);
    }
  }
  return packs;
};

const savePack = async (pack) => {
  return localforage.setItem(pack.id, pack);
};

const deletePack = async (id) => {
  return localforage.removeItem(id);
};

const getActivePackId = () => localforage.getItem(ACTIVE_KEY);

const setActivePackId = async (id) => {
  if (id === null || id === undefined) {
    await localforage.removeItem(ACTIVE_KEY);
  } else {
    await localforage.setItem(ACTIVE_KEY, id);
  }
};

const buildLookup = (textures) => {
  let lookup = new Map();
  Object.entries(textures || {}).forEach(([path, dataUrl]) => {
    let key = textureKey(path);
    lookup.set(key, dataUrl);
    if (!lookup.has(baseName(key))) {
      lookup.set(baseName(key), dataUrl);
    }
  });
  return lookup;
};

const collectImages = () => {
  let images = new Set();
  if (!runtime) return images;
  (runtime.wait_for_textures || []).forEach((image) => images.add(image));
  runtime.types_by_index.forEach((type) => {
    if (type.texture_img) images.add(type.texture_img);
    (type.all_frames || []).forEach((frame) => {
      if (frame.texture_img) images.add(frame.texture_img);
    });
  });
  return images;
};

const refreshImageTextures = (image) => {
  if (!runtime) return;
  runtime.types_by_index.forEach((type) => {
    let updated = false;
    (type.all_frames || []).forEach((frame) => {
      if (frame.texture_img !== image) return;
      if (runtime.glwrap) {
        if (frame.webGL_texture) runtime.glwrap.deleteTexture(frame.webGL_texture);
        frame.webGL_texture = runtime.glwrap.loadTexture(
          image,
          false,
          runtime.linearSampling,
          frame.pixelformat
        );
      }
      updated = true;
    });
    if (updated && type.updateAllCurrentTexture) {
      type.updateAllCurrentTexture();
    }
  });
  runtime.redraw = true;
};

const setImageSource = (image, dataUrl) => {
  let originalWidth = image.width;
  let originalHeight = image.height;
  let replacement = new Image();
  replacement.onload = () => {
    let source = dataUrl;
    if (
      originalWidth &&
      originalHeight &&
      (replacement.width !== originalWidth || replacement.height !== originalHeight)
    ) {
      let canvas = document.createElement("canvas");
      canvas.width = originalWidth;
      canvas.height = originalHeight;
      canvas.getContext("2d").drawImage(replacement, 0, 0, originalWidth, originalHeight);
      source = canvas.toDataURL("image/png");
    }
    image.addEventListener("load", () => refreshImageTextures(image), { once: true });
    image.src = source;
  };
  replacement.src = dataUrl;
};

const restoreImageSource = (image) => {
  if (!image.cr_src || image.src === image.cr_src) return;
  if (!image.src.startsWith("data:") && !image.src.startsWith("blob:")) return;
  image.addEventListener("load", () => refreshImageTextures(image), { once: true });
  image.src = image.cr_src;
};

const applyTexturePack = (pack) => {
  if (!runtime) return;
  let lookup = buildLookup(pack ? pack.textures : {});
  collectImages().forEach((image) => {
    let key = textureKey(image.cr_src || image.src);
    if (!key) return;
    let replacement = lookup.get(key) || lookup.get(baseName(key));
    if (replacement) {
      setImageSource(image, replacement);
    } else {
      restoreImageSource(image);
    }
  });
  setActivePackId(pack ? pack.id : null);
};

const getBuiltinPacks = () =>
  Object.entries((backendConfig && backendConfig.texturepacks) || {})
    .filter(([, entry]) => !entry.version || entry.version.includes(version))
    .map(([id, entry]) => ({ ...entry, id }));

const builtinPackCache = new Map();

const loadBuiltinPack = (id) => {
  if (!builtinPackCache.has(id)) {
    let entry = getBuiltinPacks().find((candidate) => candidate.id === id);
    if (!entry) return Promise.reject(new Error("Unknown texture pack: " + id));
    let promise = fetch(entry.url)
      .then((response) => {
        if (!response.ok) throw new Error("Could not download " + entry.name + ".");
        return response.blob();
      })
      .then((blob) => parsePackZip(blob))
      .then((parsed) => ({
        ...parsed,
        id,
        name: entry.name,
        author: entry.author || parsed.author,
        desc: entry.desc || "",
      }));
    promise.catch(() => builtinPackCache.delete(id));
    builtinPackCache.set(id, promise);
  }
  return builtinPackCache.get(id);
};

const switchTexturePack = async (id) => {
  let pack = null;
  if (id) {
    pack = getBuiltinPacks().some((entry) => entry.id === id)
      ? await loadBuiltinPack(id)
      : await localforage.getItem(id);
  }
  applyTexturePack(pack);
};

const applyStoredTexturePack = async () => {
  try {
    let id = await getActivePackId();
    if (id) await switchTexturePack(id);
  } catch (error) {
    console.warn("couldnt apply stored texture pack:", error);
  }
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const parsePackZip = async (file) => {
  let JSZip = await loadZip();
  let zip = await JSZip.loadAsync(file);
  let textures = getGameTextures();
  let byPath = new Map();
  let byName = new Map();
  textures.forEach((texture) => {
    byPath.set(texture.path, texture.path);
    if (!byName.has(texture.name)) byName.set(texture.name, texture.path);
  });

  let manifest = {};
  let manifestFile = zip.file("pack.json");
  if (manifestFile) {
    manifest = JSON.parse(await manifestFile.async("string"));
  }

  let entries = [];
  if (manifest.textures && typeof manifest.textures === "object") {
    entries = Object.entries(manifest.textures).map(([target, source]) => ({
      target,
      source: typeof source === "string" ? source : source && source.file,
    }));
  } else {
    Object.values(zip.files).forEach((entry) => {
      if (entry.dir) return;
      if (!/\.(png|jpe?g|webp|gif)$/i.test(entry.name)) return;
      entries.push({ target: baseName(entry.name), source: entry.name });
    });
  }

  let replacements = {};
  for (let entry of entries) {
    if (!entry.source) continue;
    let target = byPath.get(textureKey(entry.target)) || byName.get(baseName(entry.target));
    if (!target) continue;
    let zipFile = zip.file(entry.source);
    if (!zipFile) continue;
    let base64 = await zipFile.async("base64");
    replacements[target] = "data:" + mimeFor(entry.source) + ";base64," + base64;
  }

  if (Object.keys(replacements).length === 0) {
    throw new Error("No matching textures were found in this pack.");
  }

  return {
    name: manifest.name || "Unknown",
    author: manifest.author || "",
    textures: replacements,
  };
};

const importPackFromFile = async (file) => {
  let parsed = await parsePackZip(file);
  let pack = { id: createPackId(), ...parsed };
  await savePack(pack);
  return pack;
};

const createDefaultTexturesZip = async (textures) => {
  if (textures.length === 0) {
    throw new Error("No default textures were found.");
  }
  let JSZip = await loadZip();
  let zip = new JSZip();
  let manifest = { name: "Default Textures", author: "", textures: {} };
  for (let texture of textures) {
    let response = await fetch(texture.path);
    if (!response.ok) {
      throw new Error("Could not download " + texture.path + ".");
    }
    zip.file(texture.path, await response.blob());
    manifest.textures[texture.path] = texture.path;
  }
  zip.file("pack.json", JSON.stringify(manifest, null, 2));
  return zip.generateAsync({ type: "blob" });
};

const createPackZip = async (name, textures) => {
  let JSZip = await loadZip();
  let zip = new JSZip();
  let manifest = { name, author: "", textures: {} };
  Object.entries(textures || {}).forEach(([path, dataUrl]) => {
    let entry = "textures/" + textureKey(path);
    manifest.textures[path] = entry;
    zip.file(entry, dataUrl.slice(dataUrl.indexOf(",") + 1), { base64: true });
  });
  zip.file("pack.json", JSON.stringify(manifest, null, 2));
  return zip.generateAsync({ type: "blob" });
};

const downloadUrl = (url, filename) => {
  let link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const downloadBlob = (blob, filename) => {
  let url = URL.createObjectURL(blob);
  downloadUrl(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};
