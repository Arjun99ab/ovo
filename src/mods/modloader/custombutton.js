let runtime = cr_getC2Runtime();


let types = runtime.types_by_index.filter((x) =>
    x.behaviors.some(
      (y) => y.behavior instanceof cr.behaviors.aekiro_button
    )
  );

let inst = runtime.createInstance(types[0], runtime.layouts["Level 1"].layers[7], 228, -61);
inst.width = 64;
inst.height = 64;
inst.set_bbox_changed();
inst.instance_vars[4] = 'Custom'
inst.properties[1] = 'Custom'
inst.behavior_insts[0].callbackName = "Menu > Pause"

inst.curFrame.texture_file = "../src/img/modloader/menubutton.png";
inst.curFrame.offx = 0;
inst.curFrame.offy = 0;
inst.curFrame.width = 64;
inst.curFrame.height = 64;
inst.curFrame.texture_filesize = 2438;

inst.curFrame.texture_img.cr_filesize = 2438;
inst.curFrame.texture_img.cr_src = "../src/img/modloader/menubutton.png";
inst.curFrame.texture_img.currentSrc = "http://127.0.0.1:5501/src/img/modloader/menubutton.png"
//good until here
// inst.curFrame.texture_img.height = 64; // these break it
// inst.curFrame.texture_img.width = 64;
inst.curFrame.texture_img.naturalHeight = 64;
inst.curFrame.texture_img.naturalWidth = 64;
// inst.curFrame.texture_img.outerHTML = '<img crossorigin="anonymous" src="../src/img/modloader/menubutton.png">'
inst.curFrame.texture_img.src = "http://127.0.0.1:5501/src/img/modloader/menubutton.png"

inst.curFrame.webGL_texture.c2height = 64;
inst.curFrame.webGL_texture.c2width = 64;
inst.curFrame.webGL_texture.c2textkey = "http://127.0.0.1:5501/src/img/modloader/menubutton.png,false,false";

inst.curWebGLTexture.c2height = 64;
inst.curWebGLTexture.c2width = 64;
inst.curWebGLTexture.c2textkey = "http://127.0.0.1:5501/src/img/modloader/menubutton.png,false,false"

inst.cur_animation.frames[1] = inst.cur_animation.frames[0]
inst.cur_animation.frames[2] = inst.cur_animation.frames[0]
inst.cur_animation.name = "Custom"

runtime.trigger(inst.type.plugin.cnds.OnCreated, inst);
runtime.trigger(inst.type.plugin.cnds., inst);
runtime.redraw = true;
// runtime.trigger(inst.type.plugin.cnds.OnFrameChanged, inst);
// runtime.trigger(inst.type.plugin.cnds.OnFrameChanged, inst);
// runtime.trigger(inst.type.plugin.cnds.OnAnimFinished, inst);


