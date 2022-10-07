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
    c2_callFunction("adStarted");
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

function mobileCheck() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function crazyCreateBanner(id) {
  let bannerSize = "728x90"
  if(mobileCheck() && window.innerHeight > window.innerWidth){
    bannerSize = "320x100"
  }
  if (crazysdk)
    crazysdk.requestBanner([
      {
        containerId: id,
        size: bannerSize,
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
