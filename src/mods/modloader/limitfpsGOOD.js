let runtime = cr_getC2Runtime();

let maxFPS = 80;
let timerExists = false;

let lastTime = cr.performance_now();
const oldFn = runtime.tick.bind(runtime);
let raf = window["requestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["msRequestAnimationFrame"];

runtime.tick = async (...args) => {
    const now = args[1];
    let time = cr.performance_now();
    args[1] = time;
    let x = 0;
    for (let i = 0; i < 10000; i++) {
        x += i;
    }
    // JSON.stringify({ message: "This is a simulated log", value: 12345 });
    // if(!timerExists) {
    //     timerExists = true;
    //     console.time()
    // } else {
    //     console.timeEnd()
    //     timerExists = false;
    // }
    const timeDelta = now - lastTime;
    const frameTime = 1000 / maxFPS;
    if (maxFPS <= 0 || timeDelta >= frameTime) {
        lastTime = now;
        await oldFn(...args);
    } else {
        // raf((timestamp) => {
        //     args[1] = timestamp;
        //     runtime.raf_id = -1;
        //     runtime.timeout_id = -1;
        //     runtime.raf_id = runtime.tick(...args);
        // });
        args[1] = cr.performance_now();
        runtime.raf_id = -1;
        runtime.timeout_id = -1;
        runtime.tick(...args);
    }
};