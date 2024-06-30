import { runtime } from "../modloader.js"

export {createChangeLayoutHook, createDialogOpenHook, createDialogCloseHook, createDialogShowOverlayHook, createSaveHook}

let createChangeLayoutHook = (eventName) => {
    let funcCode = runtime.doChangeLayout.toString();
    let start = funcCode.indexOf('{') + 1;
    let end = funcCode.lastIndexOf('}');
    let body = funcCode.substring(start, end);


    runtime.doChangeLayout = new Function('changeToLayout', `
        console.log(changeToLayout)
        window.dispatchEvent(
            new CustomEvent("${eventName}",  {
                bubbles: true,
                detail: { layout: changeToLayout },
            })
        );
        this.doChangeLayout2(changeToLayout);`);
    
    runtime.doChangeLayout2 = new Function('changeToLayout', body);
}

let createDialogOpenHook = (eventName) => {
    let funcCode = cr.behaviors.aekiro_dialog.prototype.Instance.prototype.open.toString();
    // let params = 
    let start = funcCode.indexOf('{') + 1;
    let end = funcCode.lastIndexOf('}');
    let body = funcCode.substring(start, end);

    cr.behaviors.aekiro_dialog.prototype.Instance.prototype.open = new Function("_targetX","_targetY", "center", `
        console.log(_targetX,_targetY,center)
        event = new Event("${eventName}");
        window.dispatchEvent(event);
        this.open2(_targetX,_targetY,center);`);

    cr.behaviors.aekiro_dialog.prototype.Instance.prototype.open2 = new Function("_targetX","_targetY", "center", body);
}

let createDialogCloseHook = (eventName) => {
    let funcCode = cr.behaviors.aekiro_dialog.prototype.Instance.prototype.close.toString();
    let start = funcCode.indexOf('{') + 1;
    let end = funcCode.lastIndexOf('}');
    let body = funcCode.substring(start, end);

    cr.behaviors.aekiro_dialog.prototype.Instance.prototype.close = new Function(`
        event = new Event("${eventName}");
        window.dispatchEvent(event);
        this.close2();`);

    cr.behaviors.aekiro_dialog.prototype.Instance.prototype.close2 = new Function(body);
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