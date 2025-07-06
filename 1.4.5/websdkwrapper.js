globalThis.WebSdkWrapper = (function () {
  function addScript(src, id, onload) {
    if (document.getElementById(id)) return;
    let fjs = document.getElementsByTagName("script")[0];
    let js = document.createElement("script");
    js.id = id;
    fjs.parentNode.insertBefore(js, fjs);
    js.onload = onload;
    js.src = src;
  }

  // prevent canvas from being selectable on IOS
  (() => {
    let style = document.createElement("style");
    style.innerHTML = `
  canvas {
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
  }
  `;
    document.head.appendChild(style);
  })();

  window.addEventListener("keydown", (ev) => {
    if (["ArrowDown", "ArrowUp", " "].includes(ev.key)) {
      ev.preventDefault();
    }
  });
  window.addEventListener("wheel", (ev) => ev.preventDefault(), {
    passive: false,
  });

  /*
  ==============  EVENT DISPATCHER  =================
  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  */
  const events = {};

  function listen(event, fn, { once = false } = {}) {
    events[event] = events[event] || [];
    events[event].push({
      fn,
      once,
    });
  }

  function listenOnce(event, fn) {
    listen(event, fn, { once: true });
  }

  function dispatch(event, ...data) {
    (events[event] || []).forEach((fnObj) => {
      fnObj.fn(...data);
    });
    events[event] = (events[event] || []).filter((fnObj) => !fnObj.once);
  }
  /*
  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ==============  EVENT DISPATCHER  =================
  */
  let sdk;
  const sdkContext = {};
  let supportedNetworks = [
    {
      name: "Poki",
      get sdk() {
        return globalThis.PokiSDK;
      },
      scriptSrc: "//game-cdn.poki.com/scripts/v2/poki-sdk.js",
      hasAds: true,
      noInterstitial: false,
      noRewarded: false,
      hasBanner: false,
      enableOnlyInProduction: false,
      implementation: {
        //async preInit(debug = false) {},
        init(debug = false, data) {
          return new Promise((resolve) => {
            sdk
              .init()
              .then(() => {
                sdkContext.hasAdblock = false;
                if (data.sitelock) eval(data.sitelock);
                resolve();
              })
              .catch(() => {
                sdkContext.hasAdblock = true;
                if (data.sitelock) eval(data.sitelock);
                resolve();
              });
            if (data.sitelock) eval(data.sitelock);
            sdk.setDebug(debug);
          });
        },
        setUpEventListeners() {
          listen("loadingStart", () => {
            sdk.gameLoadingStart();
          });
          listen("loadingEnd", () => {
            sdk.gameLoadingFinished();
          });
          listen("gameplayStart", () => {
            if (sdkContext.gameplayStarted) return;
            sdkContext.gameplayStarted = true;
            sdk.gameplayStart();
          });
          listen("gameplayStop", () => {
            if (!sdkContext.gameplayStarted) return;
            sdkContext.gameplayStarted = false;
            sdk.gameplayStop();
          });
          listen("interstitial", () => {
            dispatch("adStarted", sdkContext.lastRequestedAd);
            sdk.commercialBreak().then(() => {
              dispatch("interstitialEnd", true);
            });
          });
          listen("rewarded", () => {
            dispatch("adStarted", sdkContext.lastRequestedAd);
            sdk.rewardedBreak().then((success) => {
              dispatch("rewardedEnd", success);
            });
          });
          listen("happyTime", (scale) => {
            sdk.happyTime(scale);
          });
        },
        hasAdblock() {
          return !!sdkContext.hasAdblock;
        },
      },
    },
    {
      name: "Facebook",
      get sdk() {
        return globalThis.FBInstant;
      },
      scriptSrc: "//connect.facebook.net/en_US/sdk.js",
      hasAds: true,
      noInterstitial: false,
      noRewarded: false,
      hasBanner: true,
      enableOnlyInProduction: true,
      implementation: {
        async preInit(debug = false) {
          if (debug) {
            FBInstant.setLoadingProgress(100);
          }
          await FBInstant.initializeAsync();
          FBInstant.setLoadingProgress(100);
        },
        init(debug = false, data) {
          return new Promise((resolve) => {
            if (debug) {
              FBInstant.setLoadingProgress(100);
            }
            FBInstant.setLoadingProgress(100);
            resolve();
          });
        },
        setUpEventListeners() {
          listen("loadingStart", () => {
            FBInstant.setLoadingProgress(0);
          });
          listen("loadingEnd", () => {
            FBInstant.setLoadingProgress(100);
          });
          listen("gameplayStart", () => {
            if (sdkContext.gameplayStarted) return;
            sdkContext.gameplayStarted = true;
            FBInstant.startGamePlayRecording();
          });
          listen("gameplayStop", () => {
            if (!sdkContext.gameplayStarted) return;
            sdkContext.gameplayStarted = false;
            FBInstant.stopGamePlayRecording();
          });
          listen("interstitial", () => {
            dispatch("adStarted", sdkContext.lastRequestedAd);
            FBInstant.getRewardedVideoAsync(data.rewardedVideoId).then(
              (rewardedVideo) => {
                rewardedVideo.loadAsync().then(() => {
                  rewardedVideo.showAsync().then(() => {
                    dispatch("interstitialEnd", true);
                  });
                });
              }
            );
          });
          listen("rewarded", () => {
            dispatch("adStarted", sdkContext.lastRequestedAd);
            FBInstant.getRewardedVideoAsync(data.rewardedVideoId).then(
              (rewardedVideo) => {
                rewardedVideo.loadAsync().then(() => {
                  rewardedVideo.showAsync().then(() => {
                    dispatch("rewardedEnd", true);
                  });
                });
              }
            );
          });
          listen("happyTime", (scale) => {
            FBInstant.setHappyModeEnabled(scale);
          });
        },
      },
    },
    {
      name: "Snapchat",
      get sdk() {
        return globalThis.SnapSdk;
      },
      scriptSrc: "//js.snap.com/snap.js",
      hasAds: true,
      noInterstitial: false,
      noRewarded: false,
      hasBanner: true,
      enableOnlyInProduction: true,
      implementation: {
        async preInit(debug = false) {
          if (debug) {
            SnapSdk.setLoadingProgress(100);
          }
          await SnapSdk.initializeAsync();
          SnapSdk.setLoadingProgress(100);
        },
        init(debug = false, data) {
          return new Promise((resolve) => {
            if (debug) {
              SnapSdk.setLoadingProgress(100);
            }
            SnapSdk.setLoadingProgress(100);
            resolve();
          });
        },
        setUpEventListeners() {
          listen("loadingStart", () => {
            SnapSdk.setLoadingProgress(0);
          });
          listen("loadingEnd", () => {
            SnapSdk.setLoadingProgress(100);
          });
          listen("gameplayStart", () => {
            if (sdkContext.gameplayStarted) return;
            sdkContext.gameplayStarted = true;
            SnapSdk.startGamePlayRecording();
          });
          listen("gameplayStop", () => {
            if (!sdkContext.gameplayStarted) return;
            sdkContext.gameplayStarted = false;
            SnapSdk.stopGamePlayRecording();
          });
          listen("interstitial", () => {
            dispatch("adStarted", sdkContext.lastRequestedAd);
            SnapSdk.getRewardedVideoAsync(data.rewardedVideoId).then(
              (rewardedVideo) => {
                rewardedVideo.loadAsync().then(() => {
                  rewardedVideo.showAsync().then(() => {
                    dispatch("interstitialEnd", true);
                  });
                });
              }
            );
          });
          listen("rewarded", () => {
            dispatch("adStarted", sdkContext.lastRequestedAd);
            SnapSdk.getRewardedVideoAsync(data.rewardedVideoId).then(
              (rewardedVideo) => {
                rewardedVideo.loadAsync().then(() => {
                  rewardedVideo.showAsync().then(() => {
                    dispatch("rewardedEnd", true);
                  });
                });
              }
            );
          });
          listen("happyTime", (scale) => {
            SnapSdk.setHappyModeEnabled(scale);
          });
        },
      },
    },
    {
      name: "CrazyGames",
      get sdk() {
        if (!sdkContext.crazysdk)
          sdkContext.crazysdk = globalThis?.CrazyGames?.CrazySDK?.getInstance();
        return sdkContext.crazysdk;
      },
      scriptSrc: "//sdk.crazygames.com/crazygames-sdk-v1.js",
      hasAds: true,
      noInterstitial: false,
      noRewarded: false,
      enableOnlyInProduction: false,
      hasBanner: true,
      implementation: {
        //async preInit(debug = false) {},
        init() {
          return new Promise((resolve) => {
            sdk.addEventListener("adblockDetectionExecuted", (event) => {
              sdkContext.hasAdblock = event.hasAdblock;
              resolve();
            });
            sdk.init();
          });
        },
        setUpEventListeners() {
          sdk.addEventListener("adStarted", () => {
            dispatch("adStarted", sdkContext.lastRequestedAd);
          });
          sdk.addEventListener("adFinished", () => {
            if (sdkContext.lastRequestedAd === "interstitial")
              dispatch("interstitialEnd", true);
            else dispatch("rewardedEnd", true);
          });
          sdk.addEventListener("adFinished", () => {
            if (sdkContext.lastRequestedAd === "interstitial")
              dispatch("interstitialEnd", true);
            else dispatch("rewardedEnd", true);
          });
          sdk.addEventListener("adError", () => {
            if (sdkContext.lastRequestedAd === "interstitial")
              dispatch("interstitialEnd", false);
            else dispatch("rewardedEnd", false);
          });
          listen("gameplayStart", () => {
            if (sdkContext.gameplayStarted) return;
            sdkContext.gameplayStarted = true;
            sdk.gameplayStart();
          });
          listen("gameplayStop", () => {
            if (!sdkContext.gameplayStarted) return;
            sdkContext.gameplayStarted = false;
            sdk.gameplayStop();
          });
          listen("interstitial", () => {
            sdkContext.lastRequestedAd = "interstitial";
            sdk.requestAd("midgame");
          });
          listen("rewarded", () => {
            sdkContext.lastRequestedAd = "rewarded";
            sdk.requestAd("rewarded");
          });
          listen("happyTime", () => {
            sdk.happytime();
          });
          listen("banner", (data) => {
            sdk.requestBanner(data);
          });
        },
        hasAdblock() {
          return !!sdkContext.hasAdblock;
        },
      },
    },
    {
      name: "GamePix",
      get sdk() {
        return globalThis.GamePix;
      },
      scriptSrc: "//integration.gamepix.com/sdk/v3/gamepix.sdk.js",
      hasAds: true,
      noInterstitial: false,
      noRewarded: false,
      enableOnlyInProduction: true,
      hasBanner: false,
      implementation: {
        //async preInit(debug = false) {},
        //init() {},
        setUpEventListeners() {
          listen("loadingProgress", (progress) => {
            sdk.loading(progress);
          });
          listen("loadingEnd", () => {
            sdk.loaded();
          });
          sdk.pause = () => {
            dispatch("pause");
          };
          sdk.resume = () => {
            dispatch("resume");
          };
          listen("levelStart", (level) => {
            sdk.updateLevel(level);
          });
          listen("score", (score) => {
            sdk.updateScore(score);
          });
          listen("interstitial", () => {
            dispatch("adStarted", sdkContext.lastRequestedAd);
            sdk.interstitialAd().then(() => {
              dispatch("interstitialEnd", true);
            });
          });
          listen("rewarded", () => {
            dispatch("adStarted", sdkContext.lastRequestedAd);
            sdk.rewardAd().then((res) => {
              dispatch("rewardedEnd", res.success);
            });
          });
          listen("happyTime", () => {
            sdk.happyMoment();
          });
        },
        hasAdblock() {
          return false;
        },
      },
    },
    {
      name: "GameDistribution",
      get sdk() {
        return globalThis.gdsdk;
      },
      scriptSrc: "//html5.api.gamedistribution.com/main.min.js",
      hasAds: true,
      noInterstitial: false,
      noRewarded: false,
      enableOnlyInProduction: true,
      hasBanner: false,
      implementation: {
        async preInit(debug = false, data) {
          sdkContext.errors = 0;
          window["GD_OPTIONS"] = {
            gameId: data.gameId,
            debug,
            testing: debug,
            onEvent: function (event) {
              switch (event.name) {
                case "SDK_GAME_START":
                  sdkContext.errors = 0;
                  // if (sdkContext.lastRequestedAd === "interstitial")
                  //   dispatch("interstitialEnd", true);
                  // else dispatch("rewardedEnd", true);
                  break;
                case "SDK_GAME_PAUSE":
                  dispatch("pause");
                  break;
                case "SDK_GDPR_TRACKING":
                  // this event is triggered when your user doesn't want to be tracked
                  break;
                case "SDK_GDPR_TARGETING":
                  // this event is triggered when your user doesn't want personalised targeting of ads and such
                  break;
                case "AD_ERROR":
                  sdkContext.errors += 1;
                  // if (sdkContext.errors >= 2) {
                  //   if (sdkContext.lastRequestedAd === "interstitial")
                  //     dispatch("interstitialEnd", false);
                  //   else dispatch("rewardedEnd", false);
                  // } else {
                  //   dispatch(sdkContext.lastRequestedAd);
                  // }
                  break;
              }
            },
          };
        },
        //init() {},
        setUpEventListeners() {
          listen("interstitial", () => {
            sdkContext.lastRequestedAd = "interstitial";
            dispatch("adStarted", sdkContext.lastRequestedAd);
            sdk
              .showAd()
              .then((response) => {
                dispatch("interstitialEnd", true);
              })
              .catch((error) => {
                dispatch("interstitialEnd", false);
              });
          });
          listen("rewarded", () => {
            sdkContext.lastRequestedAd = "rewarded";
            dispatch("adStarted", sdkContext.lastRequestedAd);
            sdk
              .showAd("rewarded")
              .then((response) => {
                dispatch("rewardedEnd", true);
              })
              .catch((error) => {
                dispatch("rewardedEnd", false);
              });
          });
        },
        hasAdblock() {
          return false;
        },
      },
    },
    {
      name: "GameMonetize",
      get sdk() {
        return globalThis.sdk;
      },
      scriptSrc: "//html5.api.gamedistribution.com/main.min.js",
      hasAds: true,
      noInterstitial: false,
      noRewarded: false,
      enableOnlyInProduction: true,
      hasBanner: false,
      implementation: {
        async preInit(debug = false, data) {
          window["SDK_OPTIONS "] = {
            gameId: data.gameId,
            debug,
            testing: debug,
            onEvent: function (event) {
              switch (event.name) {
                case "SDK_GAME_START":
                  if (sdkContext.lastRequestedAd === "interstitial")
                    dispatch("interstitialEnd", true);
                  else dispatch("rewardedEnd", true);
                  break;
                case "SDK_GAME_PAUSE":
                  dispatch("pause");
                  break;
                case "SDK_GDPR_TRACKING":
                  // this event is triggered when your user doesn't want to be tracked
                  break;
                case "SDK_GDPR_TARGETING":
                  // this event is triggered when your user doesn't want personalised targeting of ads and such
                  break;
                case "AD_ERROR":
                  sdkContext.errors += 1;
                  if (sdkContext.errors >= 2) {
                    if (sdkContext.lastRequestedAd === "interstitial")
                      dispatch("interstitialEnd", false);
                    else dispatch("rewardedEnd", false);
                  } else {
                    dispatch(sdkContext.lastRequestedAd);
                  }
                  break;
              }
            },
          };
        },
        //init() {},
        setUpEventListeners() {
          listen("interstitial", () => {
            dispatch("adStarted", sdkContext.lastRequestedAd);
            sdk.showBanner();
          });
          listen("rewarded", () => {
            dispatch("adStarted", sdkContext.lastRequestedAd);
            sdk.showBanner();
          });
        },
        hasAdblock() {
          return false;
        },
      },
    },
    {
      name: "CoolMathGames",
      get sdk() {
        return null;
      },
      scriptSrc: [
        // "https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js",
        "https://www.coolmathgames.com/sites/default/files/cmg-ads.js",
      ],
      hasAds: true,
      noInterstitial: false,
      noRewarded: true,
      enableOnlyInProduction: true,
      hasBanner: false,
      implementation: {
        //async preInit(debug = false, data) {},
        init() {},
        setUpEventListeners() {
          listen("replayLevel", (level) => {
            parent.cmgGameEvent("replay", level.toString());
          });
          listen("gameplayStart", () => {
            parent.cmgGameEvent("start");
          });
          listen("levelStart", (level) => {
            parent.cmgGameEvent("start", level.toString());
          });

          // New event listeners for adBreakStart and adBreakComplete
          document.addEventListener("adBreakStart", () => {
            // Pause the game and sound here²
            dispatch("adStarted", sdkContext.lastRequestedAd);
          });
          document.addEventListener("adBreakComplete", () => {
            // Resume the game and sound here
            if (sdkContext.lastRequestedAd === "interstitial")
              dispatch("interstitialEnd", true);
            else dispatch("rewardedEnd", true);
          });

          // Interstitial and Rewarded events
          listen("interstitial", () => {
            window.cmgAdBreak();
          });

          // No equivalent for "rewarded" and "happyTime" in the CoolMathGames SDK
        },
        hasAdblock() {
          return false;
        },
      },
    },
    {
      name: "HoodaMath",
      get sdk() {
        return null;
      },
      scriptSrc: [],
      hasAds: false,
      noInterstitial: true,
      noRewarded: true,
      enableOnlyInProduction: false,
      hasBanner: false,
      implementation: {
        //async preInit(debug = false, data) {},
        init() {},
        setUpEventListeners() {},
        hasAdblock() {
          return false;
        },
      },
    },
    {
      name: "FreezeNova",
      get sdk() {
        return null;
      },
      scriptSrc: [
        "https://universal.wgplayer.com/tag/?lh=%22+window.location.hostname+%22&wp=%22+window.location.pathname+%22&ws=%22+window.location.search",
      ],
      hasAds: true,
      noInterstitial: false,
      noRewarded: false,
      enableOnlyInProduction: true,
      hasBanner: false,
      implementation: {
        // async preInit(debug = false, data) {
        // },
        // init() {
        // },
        setUpEventListeners(debug, data) {
          window.SubmitLeaderboardScore = function (newScore) {};

          window.InitExternEval = function () {
            console.log("InitExternEval");

            if (window.firstInit == undefined) {
              window.firstInit = 1;
            } else {
              ExternEval();
            }
          };

          window.TakeReward = function () {
            console.log("TakeReward");

            window.adReward = 0;
          };

          window.RewardErrorHandled = function () {
            console.log("RewardErrorHandled");

            window.rewardError = 0;
          };

          window.InitApi = function (_appId) {
            var dateNow = new Date();
            var secondsSinceEpoch = Math.round(dateNow.getTime() / 1000);

            console.log("InitApi");

            window.callTime = secondsSinceEpoch - 181;
          };

          window.ExternEval = function () {
            console.log("ExternEval");

            var dateNow = new Date();
            var secondsSinceEpoch = Math.round(dateNow.getTime() / 1000);

            if (
              window.callTime != undefined &&
              secondsSinceEpoch - window.callTime > 180
            ) {
              console.log("ExternEval 2");

              window.callTime = secondsSinceEpoch;

              if (typeof preroll !== "undefined") {
                if (window[preroll.config.loaderObjectName] != undefined) {
                  window.adRunning = 1;

                  try {
                    window[preroll.config.loaderObjectName].refetchAd(
                      ExternEvalResumeGame
                    );
                  } catch (err) {
                    console.log(err.message);
                    ExternEvalResumeGame();
                  }
                }
              }
            }
          };

          window.ExternEvalResumeGame = function () {
            console.log("ExternEvalResumeGame");

            window.adRunning = 0;
          };

          window.PreloadRewarded = function () {
            console.log("PreloadRewarded");

            if (window.rewardedCallbacks == undefined) {
              window.rewardedCallbacks = true;

              try {
                window[
                  window.preroll.config.loaderObjectName
                ].registerRewardCallbacks({
                  onReady: RewardedReady,
                  onSuccess: RewardedSuccess,
                  onFail: RewardedFail,
                });
              } catch (err) {
                console.log(err.message);
              }
            }
          };

          window.ShowRewarded = function () {
            console.log("ShowRewarded");

            if (typeof preroll !== "undefined") {
              if (window[preroll.config.loaderObjectName] != undefined) {
                window.canReward = 0;
                window.adRunning = 1;

                try {
                  window[preroll.config.loaderObjectName].showRewardAd();
                } catch (err) {
                  console.log(err.message);
                  window.adRunning = 0;
                }
              }
            }
          };

          window.RewardedReady = function () {
            console.log("RewardedReady");

            if (window.rewardedCount == undefined) {
              window.rewardedCount = 1;
              window.canReward = 1;
            } else {
              window.rewardedCount = window.rewardedCount + 1;
              setTimeout(function () {
                window.canReward = 1;
              }, 30000);
            }
          };

          window.RewardedSuccess = function () {
            console.log("RewardedSuccess");
            window.adRunning = 0;
            window.adReward = 1;

            // Resume the game and sound here
            if (sdkContext.lastRequestedAd === "interstitial")
              dispatch("interstitialEnd", true);
            else dispatch("rewardedEnd", true);
          };

          window.RewardedFail = function () {
            console.log("RewardedFail");
            window.adRunning = 0;

            // Resume the game and sound here
            if (sdkContext.lastRequestedAd === "interstitial")
              dispatch("interstitialEnd", true);
            else dispatch("rewardedEnd", false);
          };

          window.OpenLink = function () {};

          window.adRunning = 0;
          window.adRunningRewarded = 0;
          window.adReward = 0;
          window.rewardError = 0;
          window.canReward = 0;

          window.callTime = 0;
          window.adPlatform = 4;
          window.myLeaderboardScore = 0;
          window.gameLang = "en";

          window.InitApi(data.freezeNovaId || 0);

          listen("interstitial", () => {
            window.PreloadRewarded();
            dispatch("adStarted", sdkContext.lastRequestedAd);
            window.ShowRewarded();
          });
          listen("rewarded", () => {
            window.PreloadRewarded();
            dispatch("adStarted", sdkContext.lastRequestedAd);
            window.ShowRewarded();
          });
        },
        hasAdblock() {
          return false;
        },
      },
    },
    {
      name: "Xiaomi",
      get sdk() {
        return null;
      },
      scriptSrc: null,
      hasAds: true,
      noInterstitial: false,
      noRewarded: false,
      enableOnlyInProduction: true,
      hasBanner: false,
      implementation: {
        async preInit(debug = false, data) {
          // Create the first script tag with async attributes and other specified properties
          var script = document.createElement("script");
          script.async = true;
          script.setAttribute("data-ad-frequency-hint", "30s");
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${data.publisherId}`;
          script.setAttribute("crossorigin", "anonymous");
          if (debug) script.setAttribute("data-adbreak-test", "on");

          // Create the second script tag with inline script content
          window.adsbygoogle = window.adsbygoogle || [];
          window.adConfig = function (o) {
            adsbygoogle.push(o);
          };
          window.adBreak = window.adConfig;
          sdkContext.adBreak = window.adBreak;

          // Append both script tags to the head of the document
          document.body.appendChild(script);
          currentSdk.implementation.setUpEventListeners();

          let deferredResolve;
          let deferredPromise = new Promise((resolve) => {
            deferredResolve = resolve;
          });
          // Wait for the script to load
          script.onload = function () {
            // Create the ad container dynamically
            if (data.bannerEnabled) {
              var adContainer = document.createElement("ins");
              adContainer.className = "adsbygoogle";
              adContainer.style.display = "block";
              adContainer.setAttribute(
                "data-ad-client",
                `ca-${data.publisherId}`
              );
              adContainer.setAttribute("data-ad-slot", data.dataAdSlot);
              adContainer.setAttribute("data-ad-format", "auto");
              adContainer.setAttribute("data-full-width-responsive", "true");

              // Append the ad container to an existing element, e.g., an element with id 'adSpace'
              let bannerConainerId = data.bannerConainerId || "adSpace";
              var adSpace = document.getElementById(bannerConainerId);
              if (!adSpace) {
                adSpace = document.createElement("div");
                adSpace.id = bannerConainerId;
                document.body.appendChild(adSpace); // Append new ad space to the body if it doesn't exist
              }
              adSpace.appendChild(adContainer);
              // Request ads to be shown
              (adsbygoogle = window.adsbygoogle || []).push({});
            }
            if (deferredResolve) deferredResolve();
          };

          await deferredPromise;
        },
        //init(debug = false, data) {},
        setUpEventListeners() {
          listen("loadingStart", () => {
            try {
              if (funmax) funmax.loadStart();
              else console.error("funmax not found");
            } catch (e) {
              console.error("funmax not found");
            }
          });
          listen("loadingEnd", () => {
            try {
              if (funmax) funmax.loadReady();
              else console.error("funmax not found");
            } catch (e) {
              console.error("funmax not found");
            }
          });
          listen("interstitial", () => {
            sdkContext.adBreak({
              type: "next",
              name: "interstitial",
              beforeAd: () => {
                dispatch("adStarted", sdkContext.lastRequestedAd);
              },
              adBreakDone: (placementInfo) => {
                dispatch("interstitialEnd", true);
              },
            });
          });
          listen("rewarded", () => {
            sdkContext.lastRewardedSuccess = false;
            sdkContext.adBreak({
              type: "reward",
              name: "rewarded",
              beforeAd: () => {
                dispatch("adStarted", sdkContext.lastRequestedAd);
              },
              adBreakDone: (placementInfo) => {
                dispatch("rewardedEnd", sdkContext.lastRewardedSuccess);
              },
              beforeReward: (showFunc) => {
                showFunc();
              },
              adDismissed: () => {
                sdkContext.lastRewardedSuccess = false;
              },
              adViewed: () => {
                sdkContext.lastRewardedSuccess = true;
              },
            });
          });
        },
        hasAdblock() {
          return false;
        },
      },
    },
  ];

  let currentSdk = null;
  let enabled = false;
  const Wrapper = {
    get enabled() {
      return enabled;
    },
    get currentSdk() {
      return currentSdk;
    },
    async init(name, debug = false, data = {}) {
      return new Promise(async (resolve) => {
        currentSdk = supportedNetworks.find(
          (x) => x.name.toLowerCase() === name.toLowerCase()
        );
        if (currentSdk) {
          enabled = true;
          if (currentSdk.enableOnlyInProduction && debug) {
            enabled = false;
            resolve();
          } else {
            if (currentSdk.implementation.preInit)
              await currentSdk.implementation.preInit(debug, data);
            if (currentSdk.scriptSrc) {
              const onInit = async () => {
                sdk = currentSdk.sdk;
                currentSdk.implementation.setUpEventListeners(debug, data);
                if (currentSdk.implementation.init)
                  await currentSdk.implementation.init(debug, data);
                resolve();
              };

              if (currentSdk.scriptSrc instanceof Array) {
                await Promise.all(
                  currentSdk.scriptSrc.map(
                    (src) =>
                      new Promise((resolve) => {
                        addScript(src, currentSdk.name + "-jssdk", resolve);
                      })
                  )
                );
                onInit();
              } else {
                addScript(
                  currentSdk.scriptSrc,
                  currentSdk.name + "-jssdk",
                  onInit
                );
              }
            } else {
              resolve();
            }
          }
        } else {
          resolve();
        }
      });
    },
    onPause(fn) {
      listen("pause", fn);
    },
    pause() {
      dispatch("pause");
    },
    onResume(fn) {
      listen("resume", fn);
    },
    resume() {
      dispatch("resume");
    },
    onMute(fn) {
      listen("mute", fn);
    },
    mute() {
      dispatch("mute");
    },
    onUnmute(fn) {
      listen("unmute", fn);
    },
    unmute() {
      setTimeout(() => {
        dispatch("unmute");
      }, 500);
    },
    onUnlockAllLevels(fn) {
      window.unlockAllLevels = fn;
    },
    hasAdblock() {
      if (currentSdk && currentSdk.implementation.hasAdblock)
        return currentSdk.implementation.hasAdblock();
      return false;
    },
    loadingStart() {
      dispatch("loadingStart");
    },
    loadingProgress(progress) {
      progress = Math.min(Math.max(0, progress), 100);
      dispatch("loadingProgress", progress);
    },
    loadingEnd() {
      dispatch("loadingEnd");
    },
    gameplayStart() {
      dispatch("gameplayStart");
    },
    gameplayStop() {
      dispatch("gameplayStop");
    },
    happyTime() {
      dispatch("happyTime");
    },
    levelStart(level) {
      dispatch("levelStart", level);
    },
    replayLevel(level) {
      dispatch("replayLevel", level);
    },
    score(score) {
      dispatch("score", score);
    },
    banner(data) {
      dispatch("banner", data);
    },
    interstitial() {
      sdkContext.lastRequestedAd = "interstitial";
      if (!currentSdk || !currentSdk.hasAds || currentSdk.noInterstitial) {
        dispatch("adStarted", sdkContext.lastRequestedAd);
        return Promise.resolve(false);
      }
      return new Promise((resolve) => {
        let gameplayStarted = sdkContext.gameplayStarted;
        if (gameplayStarted) Wrapper.gameplayStop();
        Wrapper.mute();
        dispatch("interstitial");
        listenOnce("interstitialEnd", (...args) => {
          if (gameplayStarted) Wrapper.gameplayStart();
          Wrapper.unmute();
          resolve(...args);
        });
      });
    },
    rewarded() {
      sdkContext.lastRequestedAd = "rewarded";
      if (!currentSdk || !currentSdk.hasAds || currentSdk.noRewarded) {
        dispatch("adStarted", sdkContext.lastRequestedAd);
        return Promise.resolve(false);
      }
      return new Promise((resolve) => {
        let gameplayStarted = sdkContext.gameplayStarted;
        if (gameplayStarted) Wrapper.gameplayStop();
        Wrapper.mute();
        dispatch("rewarded");
        listenOnce("rewardedEnd", (...args) => {
          if (gameplayStarted) Wrapper.gameplayStart();
          Wrapper.unmute();
          resolve(...args);
        });
      });
    },
    onAdStarted(fn) {
      listen("adStarted", fn);
    },
    hasAds() {
      return currentSdk && currentSdk.hasAds ? 1 : 0;
    },
    hasInterstitialAds() {
      return currentSdk && currentSdk.hasAds && !currentSdk.noInterstitial
        ? 1
        : 0;
    },
    hasRewardedAds() {
      return currentSdk && currentSdk.hasAds && !currentSdk.noRewarded ? 1 : 0;
    },
  };
  return Wrapper;
})();
