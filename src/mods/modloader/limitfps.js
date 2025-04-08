let runtime = cr_getC2Runtime();

let maxFPS = 80;

let lastTime = cr.performance_now();
// console.log(lastTime)
const oldFn = runtime.tick.bind(runtime);
let raf = window["requestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["msRequestAnimationFrame"];

runtime.tick = async (...args) => {
    const now = args[1];
    // console.log(now)
    const timeDelta = now - lastTime;
    // console.log(timeDelta)
    const frameTime = 1000 / maxFPS;
    // let newNow = cr.performance_now();
    // console.log(newNow)
    if (maxFPS <= 0 || timeDelta >= frameTime) {
        lastTime = now;
        await oldFn(...args);
    } else {
        // let newNow = cr.performance_now();
        // console.log(newNow)
        // args[1] = newNow;
        args[1] = cr.performance_now();
        runtime.raf_id = -1;
        runtime.timeout_id = -1;
        runtime.tick(...args);
        // raf((timestamp) => {
        //     args[1] = newNow;
        //     // console.log(timestamp, )
        //     runtime.raf_id = -1;
        //     runtime.timeout_id = -1;
        //     runtime.tick(...args);
        // });
    }
};