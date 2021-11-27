a = document.getElementById("alpha");
b = document.getElementById("beta");
c = document.getElementById("gamma");
bool = document.getElementById("bool")
var check = false;

    function start() {
        if(check == false) {
            bool.innerHTML = "0";
        } else {
            bool.innerHTML = "1";
        }
        check = !check;
        while(check) {
            if (window.DeviceOrientationEvent) {
                window.addEventListener("deviceorientation", function(event) {
                    // alpha: rotation around z-axis
                    a.innerHTML = event.alpha;
                    // gamma: left to right
                    b.innerHTML = event.gamma;
                    // beta: front back motion
                    c.innerHTML = event.beta;
            
                }, true);
            }
        }
    }
