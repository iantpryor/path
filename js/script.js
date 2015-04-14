(function(window, document, undefined) { 
    window.onload = init;
    function init() {
        //get the canvas
        var canvas = document.getElementById("mapcanvas");
        var c = canvas.getContext("2d");
        var cwidth = 960;
        var cheight = 540;
        document.getElementById("paintbtn").onclick = paint;
        
        function reset(){
            c.clearRect ( 0 , 0 , canvas.width, canvas.height );
            c.beginPath();
        }
        
        function createRoom(x, y, pw, ph){
            var randw = Math.floor((Math.random() * ((pw/2) - 2 + 1) + 2) );
            var randh = Math.floor((Math.random() * ((ph/2) - 2 + 1) + 2) );
            //alert(randw + ", " + randh);
            
            return [randw, randh];
        }
    
        function paint(){
            reset();
            
            var widthSelect = document.getElementById("width");
            var pathWidth = widthSelect.options[widthSelect.selectedIndex].value;
            
            var heightSelect = document.getElementById("height");
            var pathHeight = heightSelect.options[heightSelect.selectedIndex].value;
            var nodeMap = [];
            //alert(pathWidth + ", " + pathHeight);
            for(var i = 0; i< pathWidth; i++){
                for(var j = 0; j< pathHeight; j++){
                    var node = {
                        n:1, 
                        s:1, 
                        e:1,
                        w:1
                    };
                    nodeMap.push(node);
                    c.beginPath();
                    //c.lineWidth = 1;
                    c.fillRect(i*30+0.5, j*30+0.5, 30, 30);
                    c.stroke();
               }
           }
           
            
            for(var i = 0; i< Math.floor(pathWidth/2)+1; i++){
                for(var j = 0; j< Math.floor(pathHeight/2)+1; j++){
                    var randRoom = Math.floor((Math.random() * 9));
                    if(randRoom < 1){
                        roomDim = createRoom(i,j,pathWidth,pathHeight);
                        c.beginPath();
                        c.lineWidth = 3;
                        c.fillStyle = "#FFFFFF"
                        c.fillRect(i*30 + 0.5, j*30+ 0.5, roomDim[0]*30, roomDim[1]*30);
                        c.stroke();
                    }
                }
            }
        }
    }
})(window, document, undefined);
