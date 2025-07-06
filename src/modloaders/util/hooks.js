import { runtime } from "../modloader.js"

export {createChangeLayoutHook, createDialogOpenHook, createDialogCloseHook, createDialogShowOverlayHook, createSaveHook, createButtonClickHook, createCallFunctionHook }

let createChangeLayoutHook = (eventName) => {
    let funcCode = runtime.doChangeLayout.toString();
    let start = funcCode.indexOf('{') + 1;
    let end = funcCode.lastIndexOf('}');
    let body = funcCode.substring(start, end);


    runtime.doChangeLayout = new Function('changeToLayout', `
        window.dispatchEvent(
            new CustomEvent("${eventName}",  {
                bubbles: true,
                detail: { currentLayout: this.running_layout, layout: changeToLayout },
            })
        );
        this.doChangeLayout2(changeToLayout);`);
    
    runtime.doChangeLayout2 = new Function('changeToLayout', body);
}

let createDialogOpenHook = (eventName) => {
    let originalOpen = cr.behaviors.aekiro_dialog.prototype.Instance.prototype.open;

    cr.behaviors.aekiro_dialog.prototype.Instance.prototype.open = function(...args) {
        window.dispatchEvent(
            new CustomEvent(eventName,  {
                bubbles: true,
                detail: { name: this.closeButtonUID },
            })
        );
        originalOpen.apply(this, args);
    };
}

let createDialogCloseHook = (eventName) => {
    let originalClose = cr.behaviors.aekiro_dialog.prototype.Instance.prototype.close;

    cr.behaviors.aekiro_dialog.prototype.Instance.prototype.close = function(...args) {
        window.dispatchEvent(
            new CustomEvent(eventName,  {
                bubbles: true,
                detail: { name: this.closeButtonUID },
            })
        );
        originalClose.apply(this, args);
    };
}

let createDialogShowOverlayHook = (eventName) => {
    let funcCode = cr.behaviors.aekiro_dialog.prototype.Instance.prototype.showOverlay.toString();
    let start = funcCode.indexOf('{') + 1;
    let end = funcCode.lastIndexOf('}');
    let body = funcCode.substring(start, end);

    cr.behaviors.aekiro_dialog.prototype.Instance.prototype.showOverlay = new Function(`
        event = new Event("${eventName}");
        window.dispatchEvent(event);
        this.showOverlay2();`);

    cr.behaviors.aekiro_dialog.prototype.Instance.prototype.showOverlay2 = new Function(body);
}

let createButtonClickHook = (eventName) => {
    let originalButtonClick = cr.plugins_.aekiro_proui2.prototype.Instance.prototype.runCallback;

    cr.plugins_.aekiro_proui2.prototype.Instance.prototype.runCallback = function(...args) {
        window.dispatchEvent(
            new CustomEvent(eventName,  {
                bubbles: true,
                detail: { name: args[0], params: args[1] },
            })
        );
        originalButtonClick.apply(this, args);
    };
}

let createSaveHook = (eventName) => {
    let funcCode = cr.plugins_.SyncStorage.prototype.Instance.prototype.isLocalStorageReady.toString();
    let start = funcCode.indexOf('{') + 1;
    let end = funcCode.lastIndexOf('}');
    let body = funcCode.substring(start, end);

    cr.plugins_.SyncStorage.prototype.Instance.prototype.isLocalStorageReady = new Function(`
        event = new Event("${eventName}");
        window.dispatchEvent(event);
        return this.isLocalStorageReady2();`);

    cr.plugins_.SyncStorage.prototype.Instance.prototype.isLocalStorageReady2 = new Function(body);
}


let createCallFunctionHook = (eventName) => {
    let map = new WeakMap()
    map.set(cr.plugins_.Function.prototype.acts.CallFunction, function (action) {
    let old = action.func
    action.func = function (...args) {
        window.dispatchEvent(
            new CustomEvent(eventName,  {
                bubbles: true,
                detail: { name: args[0], params: args[1] },
            })
        );
        old.apply(this, args)
    }
    })
    for(const action of Object.values(runtime.actsBySid)) {
        if (map.has(action.func)) map.get(action.func)(action)
    }
    
    // let map = new WeakMap()
    // map.set(cr.plugins_.GameAnalytics.prototype.acts.addProgressionEvent, function (action) {
    // let old = action.func
    // action.func = function (...args) {
    //     console.log(args)
    //     if(args[0] === 3) { //death
    //         window.dispatchEvent(
    //             new CustomEvent(eventName,  {
    //                 bubbles: true,
    //                 detail: { layout: args[1] },
    //             })
    //         );
    //     }
    //     old.apply(this, args)
    // }
    // })
    // for(const action of Object.values(runtime.actsBySid)) {
    //     if (map.has(action.func)) map.get(action.func)(action)
    // }
}

//not a viable hook bc of stack overflow issues
// let createc2_callFunctionHook = (eventName) => {
//     let originalc2_callFunction = window["c2_callFunction"]

//     window["c2_callFunction"] = function(...args) {
//         window.dispatchEvent(
//             new CustomEvent(eventName,  {
//                 bubbles: true,
//                 detail: { name: args[0], params: args[1] },
//             })
//         );
//         window["c2_callFunction"].apply(this, args);
//     };

// }