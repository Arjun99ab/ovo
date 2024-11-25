import {backendConfig} from "../../../modloader.js";
import {createConfirmReloadModal, createNotifyModal} from "../../modals.js"
import { modsPendingReload } from "../../modals.js";
import { notify } from "../../ovo.js";
export {customModNum, incCustomModNum, compressWithStream, decompressWithStream, compressAndStoreInIndexedDB, convert_formated_hex_to_bytes}

let customModNum = 0;
function incCustomModNum() {
  customModNum++;
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

async function compressAndStoreInIndexedDB(data, replayName, replayDescription) {
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

  let saveObj = {
    name: replayName,
    description: replayDescription,
    replay: compressedArrayBuffer
  }
  
  replayStore.setItem('replay1', saveObj, function (err) {
    replayStore.getItem('replay1', function (err, value) {
      console.log(value);
    });
  });
  
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