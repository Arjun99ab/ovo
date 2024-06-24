//layers a div over the game in order to essentially high contrast the game

(function () {
    let old = globalThis.sdk_runtime;
    c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    let runtime = globalThis.sdk_runtime;
    globalThis.sdk_runtime = old;
    let notify = (title, text, image = "./speedrunner.png") => {
        cr.plugins_.sirg_notifications.prototype.acts.AddSimpleNotification.call(
            runtime.types_by_index.find(
                (type) => type.plugin instanceof cr.plugins_.sirg_notifications
            ).instances[0],
            title,
            text,
            image
        );
    };

    // create a div element
    const div = document.createElement("div");
    div.id = "darkmode-div"; //for modloader

    // set styles for the div element
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.left = "0";
    div.style.mixBlendMode = "difference";
    div.style.backgroundColor = "white";
    div.style.zIndex = "2147483647"; // set to max int value to make sure it's on top of everything
    div.style.pointerEvents = "none"; // make the div pass events to the items below it

    // add the div element to the body of the webpage
    document.body.appendChild(div);
    console.log("Dark Mode Enabled")
    notify("Dark Mode Enabled", "", "../src/img/mods/darkmode.png");

    globalThis.darkmodeToggle = function (enable) {
        if (enable) {
            div.style.backgroundColor = "white";
            notify("Dark Mode Enabled", "", "../src/img/mods/darkmode.png");
        } else {
            div.style.backgroundColor = "black";
            notify("Dark Mode Disabled", "", "../src/img/mods/darkmode.png");
        }
    }
    

})();