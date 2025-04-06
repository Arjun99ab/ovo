let map = new WeakMap()
let runtime = cr_getC2Runtime()
map.set(cr.plugins_.Touch.prototype.cnds.IsTouchingObject, function (action) {
  let old = action.func
  action.func = function (...args) {
    var touching1 = [];
    if (!args[0])
			return false;
		var sol = args[0].getCurrentSol();
		var instances = sol.getObjects();
		var px, py;
		var i, leni, j, lenj;
		for (i = 0, leni = instances.length; i < leni; i++)
		{
			var inst = instances[i];
			inst.update_bbox();
			for (j = 0, lenj = this.touches.length; j < lenj; j++)
			{
				var touch = this.touches[j];
				px = inst.layer.canvasToLayer(touch.x, touch.y, true);
				py = inst.layer.canvasToLayer(touch.x, touch.y, false);
				if (inst.contains_pt(px, py))
				{
					touching1.push(inst);
					break;
				}
			}
		}
		if (touching1.length)
		{
      console.log(touching1)
			sol.select_all = false;
			cr.shallowAssignArray(sol.instances, touching1);
			args[0].applySolToContainer();
			cr.clearArray(touching1);
      // let uiDirection = this.runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Sprite && x.all_frames && x.all_frames[0].texture_file.includes("uidirection"))
      console.log(sol.getObjects().map(x=>x.instance_vars[0]))
			return true;
		}
		else {
			return false;
    }
  }
})
for(const action of Object.values(runtime.cndsBySid)) {
    if (map.has(action.func)) map.get(action.func)(action)
}


let map = new WeakMap()
let runtime = cr_getC2Runtime()
map.set(cr.plugins_.Sprite.prototype.acts.SetAnimFrame, function (action) {
  let old = action.func
  action.func = function (...args) {
      console.log(args)
      old.apply(this, args)
  }
})
for(const action of Object.values(runtime.actsBySid)) {
    if (map.has(action.func)) map.get(action.func)(action)
}

let map = new WeakMap()
let runtime = cr_getC2Runtime()
map.set(cr.behaviors.Platform.prototype.acts.SetMaxSpeed, function (action) {
  let old = action.func
  action.func = function (...args) {
	args[0] = 10000;
	console.log("hi2")
	old.apply(this, args)
  }
})
for(const action of Object.values(runtime.actsBySid)) {
    if (map.has(action.func)) map.get(action.func)(action)
}

let map = new WeakMap()

for(const action of Object.values(runtime.actsBySid)) {
    if (map.has(action.func)) map.get(action.func)(action)
}


let map = new WeakMap()
let runtime = cr_getC2Runtime()
map.set(cr.plugins_.Function.prototype.acts.CallFunction, function (action) {
  let old = action.func
  action.func = function (...args) {
	console.log("CallFunction", args)
	old.apply(this, args)
  }
})
for(const action of Object.values(runtime.actsBySid)) {
    if (map.has(action.func)) map.get(action.func)(action)
}



tick() {
	let touch = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Touch).instances[0]
	let uiDirection = runtime.types_by_index.find(x=>x.plugin instanceof cr.plugins_.Sprite && x.all_frames && x.all_frames[0].texture_file.includes("uidirection"))
	if (cr.plugins_.Touch.prototype.cnds.IsTouchingObject.call(touch, uiDirection)) {
		console.log("touching")
	}
}