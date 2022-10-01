(function() {
    let old = globalThis.sdk_runtime;
    c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    let runtime = globalThis.sdk_runtime;
    globalThis.sdk_runtime = old;
  
    let getPlayer = () => {
        return runtime.types_by_index
            .filter(
                (x) =>
                !!x.animations &&
                x.animations[0].frames[0].texture_file.includes("collider")
            )[0]
            .instances.filter(
                (x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
            )[0];
    }
    
    let notify = (title, text, image = "./speedrunner.png") => {
        cr.plugins_.sirg_notifications.prototype.acts.AddSimpleNotification.call(
            runtime.types_by_index.find(
                (type) => type.plugin instanceof cr.plugins_.sirg_notifications
            ).instances[0],
            title,
            text,
            image
        );
    };
    let isInLevel = () => {
        return runtime.running_layout.name.startsWith("Level")
    };
    // let test = () => {
    //     console.log("hi");
    // };
    
    let isPaused = () => {
        if (isInLevel()) return runtime.running_layout.layers.find(function(a) {
            return "Pause" === a.name
        }).visible
    };

    let createGuiElement = (id1, bottom, right) => {
        b = document.createElement("input")
        //b.style.bottom = bottom.toString() + "px";
        //b.style.right = right.toString() + "px";
        c = {
            backgroundColor: "white",
            border: "solid",
            borderColor: "black",
            borderWidth: "2px",
            fontFamily: "Retron2000",
            position: "absolute",
            bottom: bottom.toString() + "px",
            right: right.toString() + "px",
            padding: "5px",
            color: "black",
            fontSize: "10pt",
            display: "block",
            height: "50%",
            width: "20%"
        };
        Object.keys(c).forEach(function (a) {
            b.style[a] = c[a];
        });
        b.id = id1;
        //const newContent = document.createTextNode("N/A");

        

        //b.appendChild(input);

        // add the text node to the newly created div
        //b.appendChild(newContent);

        document.body.appendChild(b);

        //document.getElementById(b.id).className = 'menuItems';



    };

    let createButton = (id1) => {

        btn = document.createElement("button");
        btn.innerHTML = "Clickasdaws Me";
        // btn.onclick = function () {
        //     alert("Button is clicked");
        //     console.log("clicked");
        // };

        btn.style.position = "absolute";
        btn.style.bottom = "300px";
        btn.style.right = "50px";

        // function test() {
        //     console.log("hi");
        //     //alert("hi");
        // }
        // btn.setAttribute(onclick, test());

        
        btn.id = "btn1";
        btn.onclick = function what(){
            console.log('dog');
        }
        document.body.appendChild(btn);

        


    }
    

    let pauseMenuMod = {
        init() {
           
            runtime.tickMe(this);


            function addStyle(styleString) {
                const style = document.createElement('style');
                style.textContent = styleString;
                document.head.append(style);
              }
            addStyle(`
            #ovo-multiplayer-disconnected-container {
                pointer-events: none;
            }
            #ovo-multiplayer-other-container {
                pointer-events: none;
            }
            #ovo-multiplayer-container {
                pointer-events: none;
            }
            #ovo-multiplayer-tab-container {
                pointer-events: all;
            }
            .ovo-multiplayer-button-holder {
                pointer-events: all;
            }
            .ovo-multiplayer-tab {
                pointer-events: all;
            }
            .ovo-multiplayer-button {
                pointer-events: all;
            }
            `);



            //createGuiElement("board", 300, 150); //create position element
            //createButton("btn1");

            const btn = document.createElement("button");
            btn.innerHTML = "Clickasdaws Me";

            btn.style.position = "absolute";
            btn.style.bottom = "300px";
            btn.style.right = "50px";

            
            btn.id = "btn1";
            btn.onclick = function test(){
                console.log('dog');
            }
            document.body.appendChild(btn);
            


            
            
            
                





        },

        
        
        tick() {
            let playerInstances = runtime.types_by_index.filter((x) =>!!x.animations &&x.animations[0].frames[0].texture_file.includes("collider"))[0].instances.filter((x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled);
            let player = playerInstances[0];
            //const elements = document.querySelectorAll('.menuItems');
            
            // document.getElementById('button').onclick = function() {
            //     alert("button was clicked");
            // };

            try {
                
                //document.getElementById("btn1").innerHTML = runtime.fps;
                // elements.forEach(element => {
                //     element.style.display = "block";
                // });
                // if(isPaused()) {
                
                // //console.log("paused");




                // } else {
                // elements.forEach(element => {
                //     element.style.display = "block";
                // });
                // }    

                
            } catch (err) {}
        }
    };
  
    pauseMenuMod.init();
})();