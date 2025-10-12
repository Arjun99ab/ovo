import { backendConfig } from "../../../modloader.js";
import { createConfirmReloadModal, createNotifyModal } from "../../modals.js"
import { modsPendingReload } from "../../modals.js";
import { notify } from "../../ovo.js";
export { compareLevelQueue, setCompareLevelQueue, currentLevelObj, setLevel, customModNum, incCustomModNum, compressWithStream, decompressWithStream, compressAndStoreInIndexedDB, convert_formated_hex_to_bytes, compressedToLZMA, saveToIndexedDB, decompressMultipleWithStream}

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

async function saveToIndexedDB(replayObj) {
  
  let localforage = window.localforage;
  var replayStore = localforage.createInstance({
    name: "replays"
  });
  replayStore.setItem(replayObj.id, replayObj, function (err) {
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

function uuidv4() { 
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

async function compressAndStoreInIndexedDB(data, replayName, replayDescription, replayVersion, replayTime, levelNumber) {
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
  let uuid = crypto.randomUUID();
  // let uuid = uuidv4(); // for local testing on ios
  let saveObj = {
    id: uuid,
    name: replayName,
    description: replayDescription,
    version: replayVersion,
    time: replayTime,
    replay: compressedArrayBuffer,
    uploadTimestamp: Date.now(),
    levelNumber: levelNumber
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

async function decompressMultipleWithStream(compressedDataArray) {
  const decompressionPromises = compressedDataArray.map(async (compressedData) => {
    try {
      console.log(compressedData)
      const decompressionStream = new DecompressionStream('deflate-raw');
      const compressedBlob = new Blob([compressedData]); 
      const decompressedStream = compressedBlob.stream().pipeThrough(decompressionStream);

      const decompressedArrayBuffer = await new Response(decompressedStream).arrayBuffer();

      const decoder = new TextDecoder();
      return decoder.decode(decompressedArrayBuffer);
    } catch (error) {
      console.error("Decompression error: ", error);
      throw error;
    }
  });

  return Promise.all(decompressionPromises);
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

function compressedToLZMA(name, compressedData) {
  decompressWithStream(compressedData).then((decompressedData) => {
    let LZMA_WORKER = window.LZMA_WORKER;
    LZMA_WORKER.compress(decompressedData, 1, function(result) {
      console.log("Compressed data: ", result);
      let hexString = Array.from(new Uint8Array(result))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join(' ');
      hexString = hexString.replace(/((?:[0-9a-fA-F]{2} ){16})/g, '$1\n');
      console.log("Hex string: ", hexString);
      const blob = new Blob([hexString], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name.trim().replace(/\s+/g, '-') + '.ovo';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
  ).catch((error) => {
    notify("Decompression error: " + error);
  });
}