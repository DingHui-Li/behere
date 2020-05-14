import Vue from 'vue'

Vue.directive('longpress',{
    bind: function (el, binding, vNode) {
        // Make sure expression provided is a function
        if (typeof binding.value !== 'function') {
            // Fetch name of component
            const compName = vNode.context.name
            // pass warning to console
            let warn = `[longpress:] provided expression '${binding.expression}' is not a function, but has to be`
            if (compName) { warn += `Found in component '${compName}' ` }

            console.warn(warn)
        }

        // Define variable
        let pressTimer = null

        // Define funtion handlers
        // Create timeout ( run function after 1s )
        let start = (e) => {

            if (e.type === 'click' && e.button !== 0) {
                return;
            }

            if (pressTimer === null) {
                pressTimer = setTimeout(() => {
                    // Run function
                    handler()
                }, 1000)
            }
        }

        // Cancel Timeout
        let cancel = () => {
            // Check if timer has a value or not
            if (pressTimer !== null) {
                clearTimeout(pressTimer)
                pressTimer = null
            }
        }
        // Run Function
        const handler = (e) => {
            binding.value(e)
        }

        // Add Event listeners
        el.addEventListener("mousedown", start);
        el.addEventListener("touchstart", start);
        // Cancel timeouts if this events happen
        el.addEventListener("click", cancel);
        el.addEventListener("mouseout", cancel);
        el.addEventListener("touchend", cancel);
        el.addEventListener("touchcancel", cancel);
    }
})
Vue.directive('drag',{
    bind:function(el,binding){
        if(!binding.value) return;
        let dragBox = el; //获取当前元素
        dragBox.onmousedown = e => {
            //算出鼠标相对元素的位置
            let disX = e.clientX - dragBox.offsetLeft;
            let disY = e.clientY - dragBox.offsetTop;
            document.onmousemove = e => {
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                let left = e.clientX - disX;
                let top = e.clientY - disY;
                //if(left<=0||left>=window.innerWidth||top<=0||top>=window.innerHeight) return
                //移动当前元素
                dragBox.style.left = left + "px";
                dragBox.style.top = top + "px";
            };
            document.onmouseup = () => {
                    //鼠标弹起来的时候不再移动
                document.onmousemove = null;
                    //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）  
                document.onmouseup = null;
            };
        };
    }
})