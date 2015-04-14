(function(window, document, undefined) { 
    window.onload = init;
    function init() {
        //get the canvas
        var canvas = document.getElementById("mapcanvas");
        var c = canvas.getContext("2d");
        var cwidth = 960;
        var cheight = 540;
        var moves = {
            u: [0,-1],
            d: [0,1],
            l: [-1,0],
            r: [1,0]
        };
        document.getElementById("paintbtn").onclick = paint;
        
        function shuffle(array) {
          var currentIndex = array.length, temporaryValue, randomIndex ;
        
          // While there remain elements to shuffle...
          while (0 !== currentIndex) {
        
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
        
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
          }
        
          return array;
        }
        
        function reset(){
            c.clearRect ( 0 , 0 , canvas.width, canvas.height );
            c.beginPath();
        }
        
        function walk(start, stop){
            var distX = stop.x - start.x;
            var distY = stop.y - start.y;
            
            
            
            var walkSteps = [];
            for(var i = 0; i< Math.abs(distX); i++){
                if(distX < 0){
                    walkSteps.push(moves.l);
                } else {
                    walkSteps.push(moves.r);
                }
            }
            for(var i = 0; i< Math.abs(distY); i++){
                if(distY < 0){
                    walkSteps.push(moves.u);
                } else {
                    walkSteps.push(moves.d);
                }
            }
            
            var randSteps = (Math.abs(distX) + Math.abs(distY));
            
            for(var i = 0; i< randSteps; i++){
                var rand =Math.floor(Math.random() * (2 - 1 + 1)) + 1;
                if(rand < 1){
                    walkSteps.push(moves.u);
                    walkSteps.push(moves.d);
                } else{
                    walkSteps.push(moves.l);
                    walkSteps.push(moves.r);
                }
            }
            
            return shuffle(walkSteps);
        }
        
        function createRoom(x, y, pw, ph){
            var randw = Math.floor((Math.random() * ((pw/2) - 1 + 1) + 1) );
            var randh = Math.floor((Math.random() * ((ph/2) - 1 + 1) + 1) );
            //alert(randw + ", " + randh);
            
            return [randw, randh];
        }
    
        function paint(){
            reset();
            
            var widthSelect = document.getElementById("width");
            var pathWidth = widthSelect.options[widthSelect.selectedIndex].value;
            
            var heightSelect = document.getElementById("height");
            var pathHeight = heightSelect.options[heightSelect.selectedIndex].value;
            //alert(pathWidth + ", " + pathHeight);
            for(var i = 0; i< pathWidth; i++){
                for(var j = 0; j< pathHeight; j++){
                    
                    c.beginPath();
                    //c.lineWidth = 1;
                    c.fillStyle = "#000000";
                    c.fillRect(i*30+0.5, j*30+0.5, 30, 30);
                    c.stroke();
               }
           }
           var startpoint = {
               x: 0,
               y: 0
           }
           var endpoint = {
               x: 5,
               y: 5
           }
           var walkArray = walk(startpoint, endpoint);
           c.fillStyle = "#33CC33";
           c.fillRect(startpoint.x*30 + 0.5, startpoint.y*30 + 0.5, 30, 30);
           
           for (var i = 0; i< walkArray.length; i++){
               startpoint.x = startpoint.x + walkArray[i][0];
               startpoint.y = startpoint.y + walkArray[i][1];
               c.fillStyle = "#FFFFFF";
               c.fillRect(startpoint.x*30 + 0.5, startpoint.y*30 + 0.5, 30, 30);
           }
           c.fillStyle = "#CC0000";
           c.fillRect(endpoint.x*30 +0.5, endpoint.y*30 +0.5, 30 ,30);
            /*
            for(var i = 0; i< Math.floor(pathWidth/2)+1; i++){
                for(var j = 0; j< Math.floor(pathHeight/2)+1; j++){
                    var randRoom = Math.floor((Math.random() * 9));
                    if(randRoom < 1){
                        roomDim = createRoom(i,j,pathWidth,pathHeight);
                        c.beginPath();
                        c.lineWidth = 3;
                        c.fillStyle = "#FFFFFF";
                        c.fillRect(i*30 + 0.5, j*30+ 0.5, roomDim[0]*30, roomDim[1]*30);
                        c.stroke();
                    }
                }
            }*/
        }
    }
})(window, document, undefined);
