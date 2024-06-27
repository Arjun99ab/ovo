import { runtime } from "../modloader.js"

export {createChangeLayoutHook, createPauseOpenHook, createPauseCloseHook}

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

let createPauseOpenHook = (eventName) => {
    let funcCode = cr.behaviors.aekiro_dialog.prototype.Instance.prototype.open.toString();
    // let params = 
    let start = funcCode.indexOf('{') + 1;
    let end = funcCode.lastIndexOf('}');
    let body = funcCode.substring(start, end);

    cr.behaviors.aekiro_dialog.prototype.Instance.prototype.open = new Function("_targetX","_targetY", "center", `
        event = new Event("${eventName}");
        window.dispatchEvent(event);
        this.open2(_targetX,_targetY,center);`);

    cr.behaviors.aekiro_dialog.prototype.Instance.prototype.open2 = new Function("_targetX","_targetY", "center", body);
}

let createPauseCloseHook = (eventName) => {
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