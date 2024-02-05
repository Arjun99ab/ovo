let old = globalThis.sdk_runtime;
c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
let runtime = globalThis.sdk_runtime;
globalThis.sdk_runtime = old;

for(let i = 0; i < runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Sprite).length; i++) {
    try {
        console.log(runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Sprite)[i].instances[0].curFrame.texture_file, i)
    } catch (error) {
    }
}

runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.Sprite)[i].instances[0].curFrame.texture_file = 'images/skin8-sheet0.png'
cr.plugins_.skymen_skinsCore.prototype.cnds
line 42322
line 42176

able to swap values of these (meaning they are modifable 100%)
runtime.types_by_index.filter(x=>x.plugin instanceof cr.plugins_.skymen_skinsCore)[0].instances[0].skins

cr.behaviors.SkymenSkin.prototype
cr.behaviors.SkymenSkin.prototype.Instance.prototype.updateSkin()

let types = runtime.types_by_index.filter((x) =>
          x.behaviors.some(
            (y) => y.behavior instanceof cr.behaviors.SkymenSkin
          )
        );
        types.forEach((type) => {
          type.instances.forEach((inst) => {
            let behavior = inst.behavior_insts.find(
              (x) => x.behavior instanceof cr.behaviors.SkymenSkin
            );
            console.log(behavior)
            behavior.oldSkinTag = "dknight"
              behavior.skinTag = "dknight"
            for(let i = 0; i < behavior.skinBase.instances.length; i++) {
    try {
        behavior.skinBase.instances[i].oldSkinTag = "dknight"
        behavior.skinBase.instances[i].skinTag = "dknight"
    } catch (error) {
    }
}
            behavior.updateSkin()
          });
        });