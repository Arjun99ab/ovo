var niceNames = {
  "144": "1.4.4",
  "14": "1.4",
  "141": "1.4.1",
  "142": "1.4.2",
  "143": "1.4.3",
  "reverse": "Reverse",
  "kaizo": "Kaizo",
  "crashtestleveleditor": "CrashTestLevelEditor",
}

var versionsDict = {
  "144": "1.4.4",
  "14": "1.4",
  "141": "1.4.1",
  "142": "1.4.2",
  "143": "1.4.3",
}


window.onload = function () {
  if(localStorage.getItem("lastLaunchedVersion") === null) {
    document.getElementsByClassName("lastLaunchedBtn")[0].innerHTML = "None"
    document.getElementsByClassName("lastLaunchedBtn")[0].id = "none"
    
  } else {
    document.getElementsByClassName("lastLaunchedBtn")[0].innerHTML = "Launch " + niceNames[localStorage.getItem("lastLaunchedVersion")];
    document.getElementsByClassName("lastLaunchedBtn")[0].id = localStorage.getItem("lastLaunchedVersion");
  }
  
}



var styles = `
    .swal-text {
      background-color: #fff;
      padding: 17px;
      border: 1px solid #000;
      display: block;
      margin: 22px;
      text-align: center;
      color: #000;
    }
    .swal-modal {
      background-color: #3763f4;
      border: 2px solid white;
    }
    .swal-title {
      color: white;
    }
   
    
`
var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

document.querySelectorAll('.github').forEach(element => {
   element.onclick = function() { 
       window.open("https://github.com/Arjun99ab/ovo", "_blank");
   }
});

document.querySelectorAll('.discord').forEach(element => {
   element.onclick = function() { 
       navigator.clipboard.writeText("Awesomeguy#4997");
       swal({
           title: "Successfully Copied to Clipboard!",
           text: "Awesomeguy#4997",
       });
   }
});





document.querySelectorAll('.launch').forEach(element => {

  element.onclick = function() {
    if(element.id !== "none") {
      localStorage.setItem("lastLaunchedVersion", element.id)
      document.getElementsByClassName("lastLaunchedBtn")[0].innerHTML = "Launch " + niceNames[element.id];
      document.getElementsByClassName("lastLaunchedBtn")[0].id = element.id
  
      if(element.id in versionsDict) {
        window.open(`./${versionsDict[element.id]}/`,'_blank')
      } else {
        window.open(`./${element.id}/`,'_blank')
      }
    }
    
  };

});
