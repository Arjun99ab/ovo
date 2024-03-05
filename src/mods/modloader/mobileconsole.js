(function () { 
    var script = document.createElement('script'); 
    script.src="https://cdn.jsdelivr.net/npm/eruda"; 
    document.body.append(script); 
    script.onload = function () { 
        eruda.init(); 
        console.log("Eruda Loaded");
        

    } 
    // console.log(document.getElementsByClassName('eruda-entry-btn'))
})();