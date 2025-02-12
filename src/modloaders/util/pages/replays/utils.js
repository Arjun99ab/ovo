import { backendConfig } from "../../../modloader.js";
import { createConfirmReloadModal, createNotifyModal } from "../../modals.js"
import { modsPendingReload } from "../../modals.js";
import { notify } from "../../ovo.js";
export { compareLevelQueue, setCompareLevelQueue, currentLevelObj, setLevel, customModNum, incCustomModNum, compressWithStream, decompressWithStream, compressAndStoreInIndexedDB, convert_formated_hex_to_bytes}

let customModNum = 0;
function incCustomModNum() {
  customModNum++;
}

let currentLevelObj = null;
function setLevel(levelObj) {
  currentLevelObj = levelObj;
}

let compareLevelQueue = [];
function setCompareLevelQueue(queue) {
  compareLevelQueue = queue;
} 


async function compressWithStream(data) {
  const encoder = new TextEncoder();
  const compressionStream = new CompressionStream('deflate-raw'); 
  const readableStream = new Blob([encoder.encode(data)]).stream();
  const compressedStream = readableStream.pipeThrough(compressionStream);

  const compressedBlob = await new Response(compressedStream).blob();
  const compressedArrayBuffer = await compressedBlob.arrayBuffer();

  return compressedArrayBuffer;
}

async function compressAndStoreInIndexedDB(data, replayName, replayDescription, replayVersion, replayTime) {
  const encoder = new TextEncoder();
  const compressionStream = new CompressionStream('deflate-raw'); 
  const readableStream = new Blob([encoder.encode(data)]).stream();
  const compressedStream = readableStream.pipeThrough(compressionStream);

  const compressedBlob = await new Response(compressedStream).blob();
  const compressedArrayBuffer = await compressedBlob.arrayBuffer();
  let localforage = window.localforage;
  var replayStore = localforage.createInstance({
    name: "replays"
  });
  let uuid = self.crypto.randomUUID();
  let saveObj = {
    id: uuid,
    name: replayName,
    description: replayDescription,
    version: replayVersion,
    time: replayTime,
    replay: compressedArrayBuffer,
    uploadTimestamp: Date.now()
  }
  replayStore.setItem(uuid, saveObj, function (err) {
    if (err) {
      console.log(err);
    }
  });

  // await replayStore.length().then(function(length) {
  //   replayStore.setItem('replay' + (length + 1), saveObj, function (err) {
      
  //   });
  // })

  // replayStore.length().then(function(length) {
  //   replayStore.setItem('replay' + (length + 1), saveObj, function (err) {
      
  //   });
  // });
  
  
  
}

async function decompressWithStream(compressedData) {
  const decompressionStream = new DecompressionStream('deflate-raw');
  const compressedBlob = new Blob([compressedData]); 
  const decompressedStream = compressedBlob.stream().pipeThrough(decompressionStream);

  const decompressedArrayBuffer = await new Response(decompressedStream).arrayBuffer();

  const decoder = new TextDecoder();
  return decoder.decode(decompressedArrayBuffer);
}

function convert_formated_hex_to_bytes(hex_str) {
  var count = 0,
      hex_arr,
      hex_data = [],
      hex_len,
      i;
  
  if (hex_str.trim() === "") {
      return [];
  }
  
  if (/[^0-9a-fA-F\s]/.test(hex_str)) {
      return false;
  }
  
  hex_arr = hex_str.split(/([0-9a-fA-F]+)/g);
  hex_len = hex_arr.length;
  
  for (i = 0; i < hex_len; ++i) {
      if (hex_arr[i].trim() === "") {
          continue;
      }
      hex_data[count++] = parseInt(hex_arr[i], 16);
  }
  
  return hex_data;
}