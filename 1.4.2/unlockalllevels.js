function unlockAllLevels() {
  c2_callFunction("unlockAllLevels");
}

document.getElementById("c2canvas").addEventListener("wheel", (e) => {
  e.preventDefault();
});

function execCode(code) {
  c2_callFunction("execCode", [code]);
}

function dumpSave() {
  c2_callFunction("dumpSave");
}

function loadScript(src, callback) {
  var s, r, t;
  r = false;
  s = document.createElement("script");
  s.type = "text/javascript";
  s.src = src;
  s.onload = s.onreadystatechange = function () {
    //console.log( this.readyState ); //uncomment this line to see which ready states are called.
    if (!r && (!this.readyState || this.readyState == "complete")) {
      r = true;
      callback();
    }
  };
  t = document.getElementsByTagName("script")[0];
  t.parentNode.insertBefore(s, t);
}

var crazysdk;
window.adblockIsEnabled = false;
function crazyGamesLoaded() {
  crazysdk = window.CrazyGames.CrazySDK.getInstance(); //Getting the SDK
  crazysdk.init();
  crazysdk.addEventListener("adblockDetectionExecuted", function () {
    window.adblockIsEnabled = crazysdk.hasAdblock;
  });
  crazysdk.addEventListener("adStarted", function () {
    c2_callFunction("muteSounds");
  }); // mute sound
  crazysdk.addEventListener("adFinished", function () {
    c2_callFunction("adOver");
  }); // reenable sound, enable ui
  crazysdk.addEventListener("adError", function () {
    c2_callFunction("adOverFail");
  }); // reenable sound, enable ui
  crazysdk.addEventListener("bannerRendered", (event) => {
    console.log(`Banner for container ${event.containerId} has been
    rendered!`);
  });
  crazysdk.addEventListener("bannerError", (event) => {
    console.log(`Banner render error: ${event.error}`);
  });
  // crazyMidRoll();
}

function crazyRemoveBanner(id) {
  //let div = document.getElementById(id);
  //div.innerHTML = "";
}

function crazyCreateBanner(id) {
  if (crazysdk)
    crazysdk.requestBanner([
      {
        containerId: id,
        size: "728x90",
      },
    ]);
}

function crazyHappyTime() {
  if (crazysdk) crazysdk.happytime();
}

function crazyMidRoll() {
  if (crazysdk) crazysdk.requestAd("midgame");
}

function crazyRewarded() {
  if (crazysdk) crazysdk.requestAd("rewarded");
}

function crazyGameplayStart() {
  if (crazysdk) crazysdk.gameplayStart();
}

function crazyGameplayStop() {
  if (crazysdk) crazysdk.gameplayStop();
}

function compressReplay(replay) {
  LZMA_WORKER.compress(replay, "1", function (result, error) {
    if (error) console.error(error);
    else c2_callFunction("replayCompressed", [convert_to_formated_hex(result)]);
  });
}

function decompressReplay(replay) {
  var byte_arr = convert_formated_hex_to_bytes(replay);
  if (byte_arr == false) {
    alert("invalid replay file");
    return false;
  }
  LZMA_WORKER.decompress(byte_arr, function (result, error) {
    if (error) console.error(error);
    else c2_callFunction("replayDecompressed", [result]);
  });
}

function convert_formated_hex_to_bytes(hex_str) {
  var count = 0,
    hex_arr,
    hex_data = [],
    hex_len,
    i;

  if (hex_str.trim() == "") return [];

  /// Check for invalid hex characters.
  if (/[^0-9a-fA-F\s]/.test(hex_str)) {
    return false;
  }

  hex_arr = hex_str.split(/([0-9a-fA-F]+)/g);
  hex_len = hex_arr.length;

  for (i = 0; i < hex_len; ++i) {
    if (hex_arr[i].trim() == "") {
      continue;
    }
    hex_data[count++] = parseInt(hex_arr[i], 16);
  }

  return hex_data;
}

function convert_formated_hex_to_string(s) {
  var byte_arr = convert_formated_hex_to_bytes(s);
  var res = "";
  for (var i = 0; i < byte_arr.length; i += 2) {
    res += String.fromCharCode(byte_arr[i] | (byte_arr[i + 1] << 8));
  }
  return res;
}
function convert_string_to_hex(s) {
  var byte_arr = [];
  for (var i = 0; i < s.length; i++) {
    var value = s.charCodeAt(i);
    byte_arr.push(value & 255);
    byte_arr.push((value >> 8) & 255);
  }
  return convert_to_formated_hex(byte_arr);
}

function is_array(input) {
  return typeof input === "object" && input instanceof Array;
}

function convert_to_formated_hex(byte_arr) {
  var hex_str = "",
    i,
    len,
    tmp_hex;

  if (!is_array(byte_arr)) {
    return false;
  }

  len = byte_arr.length;

  for (i = 0; i < len; ++i) {
    if (byte_arr[i] < 0) {
      byte_arr[i] = byte_arr[i] + 256;
    }
    if (byte_arr[i] === undefined) {
      alert("Boom " + i);
      byte_arr[i] = 0;
    }
    tmp_hex = byte_arr[i].toString(16);

    // Add leading zero.
    if (tmp_hex.length == 1) tmp_hex = "0" + tmp_hex;

    if ((i + 1) % 16 === 0) {
      tmp_hex += "\n";
    } else {
      tmp_hex += " ";
    }

    hex_str += tmp_hex;
  }

  return hex_str.trim();
}

loadScript("https://sdk.crazygames.com/crazygames-sdk-v1.js", crazyGamesLoaded);
