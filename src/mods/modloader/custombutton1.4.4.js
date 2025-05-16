let runtime = cr_getC2Runtime();


let types = runtime.types_by_index.filter((x) =>
    x.behaviors.some(
      (y) => y.behavior instanceof cr.behaviors.aekiro_button
    )
  );

let inst = runtime.createInstance(types[0], runtime.layouts["Level 1"].layers[7], 180.5, 38); //228, -61
// inst.width = 64;
// inst.height = 64;
// inst.set_bbox_changed();
inst.instance_vars[4] = 'Modloader'
inst.properties[1] = 'Modloader'
inst.behavior_insts[0].callbackName = "Menu > Pause"
inst.onCreate();
// runtime.trigger(inst.type.plugin.cnds.OnCreated, inst);

inst.curFrame.texture_file = "../src/img/modloader/menubutton64.png" //"../src/img/modloader/menubutton.png";
inst.curFrame.offx = 0;
inst.curFrame.offy = 0;
inst.curFrame.width = 64;
inst.curFrame.height = 64;
inst.curFrame.texture_filesize = 2438;

inst.curFrame.texture_img.cr_filesize = 2438;
inst.curFrame.texture_img.cr_src = "../src/img/modloader/menubutton64.png" //"../src/img/modloader/menubutton.png";
inst.curFrame.texture_img.currentSrc = "http://127.0.0.1:5501/src/img/modloader/menubutton64.png"
//good until here
// // inst.curFrame.texture_img.height = 64; // these break it
// // inst.curFrame.texture_img.width = 64;
// inst.curFrame.texture_img.naturalHeight = 64;
// inst.curFrame.texture_img.naturalWidth = 64;
// // inst.curFrame.texture_img.outerHTML = '<img crossorigin="anonymous" src="../src/img/modloader/menubutton.png">'
// inst.curFrame.texture_img.src = "http://127.0.0.1:5501/src/img/modloader/menubutton64.png"

inst.curFrame.webGL_texture.c2height = 64;
inst.curFrame.webGL_texture.c2width = 64;
inst.curFrame.webGL_texture.c2texkey = "http://127.0.0.1:5501/src/img/modloader/menubutton64.png,false,false";

inst.curWebGLTexture.c2height = 64;
inst.curWebGLTexture.c2width = 64;
inst.curWebGLTexture.c2texkey = "http://127.0.0.1:5501/src/img/modloader/menubutton64.png,false,false"

inst.cur_animation.frames[1] = inst.cur_animation.frames[0]
inst.cur_animation.frames[2] = inst.cur_animation.frames[0]
inst.cur_animation.name = "Custom"

runtime.redraw = true;


runtime.trigger(inst.type.plugin.cnds.OnCreated, inst);
// runtime.trigger(inst.type.plugin.cnds., inst);
runtime.redraw = true;
// runtime.trigger(inst.type.plugin.cnds.OnFrameChanged, inst);
// runtime.trigger(inst.type.plugin.cnds.OnFrameChanged, inst);
// runtime.trigger(inst.type.plugin.cnds.OnAnimFinished, inst);






///BELOW HERE IS GOOD



runtime = cr_getC2Runtime();
let x = [
  "Modloader", //name --
  0, //speed
  false, //loop
  1, //repeat count
  0, //repeat to
  false, //pingpong
  12341234214, //sid --
  [
      [
          "../src/img/modloader/menubutton64.png", //texture file --
          176, //texture filesize --
          0, //offx --
          0, //offy --
          64, //width
          64, //height
          1, //duration
          0.5, //hotspotX
          0.5, //hotspotY
          [
            [
                "topLeft",
                0,
                0
            ]
          ], //image pts
          [], //poly pts
          0 // pixelformat
      ],
      [
          "../src/img/modloader/menubutton64.png", //texture file --
          176, //texture filesize --
          0, //offx --
          0, //offy --
          64, //width
          64, //height
          1, //duration
          0.5, //hotspotX
          0.5, //hotspotY
          [
            [
                "topLeft",
                0,
                0
            ]
          ], //image pts
          [], //poly pts
          0 // pixelformat
      ],
      [
          "../src/img/modloader/menubutton64.png", //texture file --
          176, //texture filesize --
          0, //offx --
          0, //offy --
          64, //width
          64, //height
          1, //duration
          0.5, //hotspotX
          0.5, //hotspotY
          [
            [
                "topLeft",
                0,
                0
            ]
          ], //image pts
          [
              0.5,
              0.5,
              -0.5,
              0.5,
              -0.5,
              -0.5,
              0.5,
              -0.5
          ], //poly pts
          0 // pixelformat
      ],
  ]
]



function frame_getDataUri()
{
  if (this.datauri.length === 0)
  {
    var tmpcanvas = document.createElement("canvas");
    tmpcanvas.width = this.width;
    tmpcanvas.height = this.height;
    var tmpctx = tmpcanvas.getContext("2d");
    if (this.spritesheeted)
    {
      tmpctx.drawImage(this.texture_img, this.offx, this.offy, this.width, this.height,
                    0, 0, this.width, this.height);
    }
    else
    {
      tmpctx.drawImage(this.texture_img, 0, 0, this.width, this.height);
    }
    this.datauri = tmpcanvas.toDataURL("image/png");
  }
  return this.datauri;
};

types = runtime.types_by_index.filter((x) =>
  x.behaviors.some(
    (y) => y.behavior instanceof cr.behaviors.aekiro_button
  )
);

var anim, frame, animobj, frameobj, wt, uv;
var i, leni, j, lenj;

let spritePlugin = types[0].instances[7].type; //probably find a better call for this bc of version differences

spritePlugin.animations.push({})

anim = x;
console.log(anim)
animobj = {};
animobj.name = anim[0];
animobj.speed = anim[1];
animobj.loop = anim[2];
animobj.repeatcount = anim[3];
animobj.repeatto = anim[4];
animobj.pingpong = anim[5];
animobj.sid = anim[6];
animobj.frames = [];
for (j = 0, lenj = anim[7].length; j < lenj; j++)
{
  frame = anim[7][j];
  frameobj = {};
  frameobj.texture_file = frame[0];
  frameobj.texture_filesize = frame[1];
  frameobj.offx = frame[2];
  frameobj.offy = frame[3];
  frameobj.width = frame[4];
  frameobj.height = frame[5];
  frameobj.duration = frame[6];
  frameobj.hotspotX = frame[7];
  frameobj.hotspotY = frame[8];
  frameobj.image_points = frame[9];
  frameobj.poly_pts = frame[10];
  frameobj.pixelformat = frame[11];
  frameobj.spritesheeted = (frameobj.width !== 0);
  frameobj.datauri = "";		// generated on demand and cached
  frameobj.getDataUri = frame_getDataUri;
  uv = {};
  uv.left = 0;
  uv.top = 0;
  uv.right = 1;
  uv.bottom = 1;
  frameobj.sheetTex = uv;
  frameobj.webGL_texture = null;
  wt = runtime.findWaitingTexture(frame[0]);
  if (wt)
  {
    frameobj.texture_img = wt;
  }
  else
  {
    frameobj.texture_img = new Image();
    frameobj.texture_img.cr_src = frame[0];
    frameobj.texture_img.cr_filesize = frame[1];
    frameobj.texture_img.c2webGL_texture = null;
    runtime.waitForImageLoad(frameobj.texture_img, frame[0]);
  }
  cr.seal(frameobj);
  animobj.frames.push(frameobj);
  spritePlugin.all_frames.push(frameobj);
}
cr.seal(animobj);
console.log(animobj)
spritePlugin.animations[33] = animobj;		// swap array data for object

spritePlugin.loadTextures()

//wait for all textures to load


// var i, len, frame;
// for (i = 0, len = spritePlugin.all_frames.length; i < len; ++i)
// {
//   frame = spritePlugin.all_frames[i];
//   frame.webGL_texture = runtime.glwrap.loadTexture(frame.texture_img, true, runtime.linearSampling, frame.pixelformat);
//   // if (i >= 104 && i <= 106) { //hardcode for now bc i have no idea why webgl doesnt populate the heights correctly
//   //   frame.webGL_texture.c2height = 64;
//   //   frame.webGL_texture.c2width = 64;
//   // }
// }
spritePlugin.loadTextures()
spritePlugin.updateAllCurrentTexture();

// spri

let inst = runtime.createInstance(types[0], runtime.layouts["Level 1"].layers[7], 180.5, 38); //228, -61
inst.width = 64;
inst.height = 64;
inst.set_bbox_changed();
inst.instance_vars[4] = 'Modloader'
inst.properties[1] = 'Modloader'
inst.behavior_insts[0].callbackName = "Menu > Pause"
inst.onCreate();
runtime.redraw = true
