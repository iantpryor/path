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
        var nodemap = [];
        document.getElementById("paintbtn").onclick = paint;
        
        function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
        function toHex(n) {
            n = parseInt(n,10);
            if (isNaN(n)) return "00";
            n = Math.max(0,Math.min(n,255));
            return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
        }
        
        function floodfill(node, targetcolor, replacementcolor, pathWidth, pathHeight){
            var nodeimgdata = c.getImageData(node.x,node.y,1,1).data;
            var nodecolor = "#" + rgbToHex(nodeimgdata[0],nodeimgdata[1],nodeimgdata[2]);
            
            if(nodecolor == replacementcolor){
                return;
            }
            if(targetcolor == replacementcolor){
                return;
            }
            
            if(nodecolor != targetcolor){
                return;
            }
            if(node.x < 0 || node.x >= pathWidth * 30 || node.y < 0 || node.y >= pathHeight*30){
                return;
            }
            
            c.fillStyle = replacementcolor;
            c.fillRect(node.x, node.y, 8, 8);
            var westnode = {
                x:0,
                y:0
            };
            westnode.x = node.x - 8;
            westnode.y = node.y;
            var eastnode = {
                x:0,
                y:0
            };
            eastnode.x = node.x + 8;
            eastnode.y = node.y
            var northnode = {
                x:0,
                y:0
            };
            northnode.x = node.x;
            northnode.y = node.y - 8;
            var southnode = {
                x:0,
                y:0
            };
            southnode.x = node.x;
            southnode.y = node.y + 8;
            floodfill(westnode, targetcolor, replacementcolor, pathWidth, pathHeight);
            floodfill(eastnode, targetcolor, replacementcolor, pathWidth, pathHeight);
            floodfill(northnode, targetcolor, replacementcolor, pathWidth, pathHeight);
            floodfill(southnode, targetcolor, replacementcolor, pathWidth, pathHeight);
            return;
            
        }
        
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
            nodemap = [];
        }
        
        function walk(start, stop, steps){
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
            
            
            //add a number of random pairs based on how big our grid is
            for(var i = 0; i< steps; i++){
                var rand = Math.floor(Math.random() * 2);
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
            var randw = Math.floor((Math.random() * (pw/2) + 1) );
            var randh = Math.floor((Math.random() * (ph/2) + 1) );
            //alert(randw + ", " + randh);
            
            return [randw, randh];
        }
    
        function paint(){
            reset();
            
            var widthSelect = document.getElementById("width");
            var pathWidth = parseInt(widthSelect.options[widthSelect.selectedIndex].value);
            
            var heightSelect = document.getElementById("height");
            var pathHeight = parseInt(heightSelect.options[heightSelect.selectedIndex].value);
            //alert(pathWidth + ", " + pathHeight);
            
            //create a start and endpoint based on the grid size
            var startpoint = {
               x: -1,
               y: -1
            }
           var endpoint = {
               x: -1,
               y: -1
            }
            startpoint.x = 0;
            startpoint.y = pathHeight - 1;
            
            endpoint.x = pathWidth - 1;
            endpoint.y = 0;
            
            //paint the base grid
            for(var i = 0; i< pathWidth; i++){
                nodemap.push([]);
                for(var j = 0; j< pathHeight; j++){
                    var node = {
                        isVisited: 0,
                        n:0,
                        s:0,
                        e:0,
                        w:0,
                        x:i,
                        y:j
                    };
                    nodemap[i].push(node);
               }
           }
           
           
           var randsteps = 2* Math.floor((pathWidth/2) * (pathHeight/2));
           
           //create a random path that we will walk
           var walkArray = walk(startpoint, endpoint, randsteps);
           
           //create two moving points representing where we are and where we were
           var movingpoint = {
               x: -1,
               y: -1
           };
           var movingpointold = {
               x: -1,
               y: -1
           };
           movingpoint.x = startpoint.x;
           movingpoint.y = startpoint.y;
           movingpointold.x = startpoint.x;
           movingpointold.y = startpoint.y;
           
           var branch = 0;
           var branchpoint = {
               x: -1,
               y: -1
           };
           //follow the path and paint along the way
           for (var i = 0; i< walkArray.length; i++){
               movingpoint.x = movingpoint.x + walkArray[i][0];
               movingpoint.y = movingpoint.y + walkArray[i][1];
               var oppcurrMoveX = -1 * walkArray[i][0];
               var oppcurrMoveY = -1 * walkArray[i][1];
               var index = -1;
               for(var j = i; j< walkArray.length; j++){
                   if(walkArray[j][0] == oppcurrMoveX && walkArray[j][1] == oppcurrMoveY){
                       index = j;
                       break;
                   }
               }
               if(movingpoint.x > pathWidth -1){
                   movingpoint.x = movingpoint.x - 1;
                   if (index > -1) {
                       walkArray.splice(index, 1);
                   }
                   
               }
               if(movingpoint.x < 0){
                   movingpoint.x = movingpoint.x + 1;
                   if (index > -1) {
                       walkArray.splice(index, 1);
                   }
                   
               }
               if(movingpoint.y > pathHeight -1){
                   movingpoint.y = movingpoint.y - 1;
                   if (index > -1) {
                       walkArray.splice(index, 1);
                   }
                   
               } 
               if( movingpoint.y < 0){
                   movingpoint.y = movingpoint.y + 1;
                   if (index > -1) {
                       walkArray.splice(index, 1);
                   }
                   
               }
               
               var movedirX = movingpoint.x - movingpointold.x;
               var movedirY = movingpoint.y - movingpointold.y;
               
               /*for(var l = 0; l< 30; l++){
                   c.fillStyle = "#FFFFFF";
                   c.fillRect(movingpointold.x*30 + movedirX*l + 8, movingpointold.y*30 + movedirY*l + 8, 6, 6);
               }*/
               if(movedirX < 0){
                   nodemap[movingpointold.x][movingpointold.y].w = 1;
                   nodemap[movingpoint.x][movingpoint.y].e = 1;
               }else if(movedirX > 0){
                   nodemap[movingpointold.x][movingpointold.y].e = 1;
                   nodemap[movingpoint.x][movingpoint.y].w = 1;
               }
               if(movedirY < 0){
                   nodemap[movingpointold.x][movingpointold.y].n =1;
                   nodemap[movingpoint.x][movingpoint.y].s = 1;
               }else if(movedirY >0){
                   nodemap[movingpointold.x][movingpointold.y].s = 1;
                   nodemap[movingpoint.x][movingpoint.y].n = 1;
               }
               nodemap[movingpoint.x][movingpoint.y].isVisited = 1
               
               //c.fillStyle = "#FFFFFF";
               //c.fillRect(movingpoint.x*30, movingpoint.y*30, 24, 24);
               
               if( i >= Math.floor(walkArray.length/2) && branch < 1){
                   branchpoint.x = movingpoint.x;
                   branchpoint.y = movingpoint.y;
                   branch++;
               }
               
               movingpointold.x = movingpoint.x;
               movingpointold.y = movingpoint.y;
           }
           
           
           //paint the map data
           for(var i = 0; i< nodemap.length; i++){
               for(var j = 0; j < nodemap[i].length; j++){
                   c.fillStyle = "#000000";
                   c.fillRect(i*30, j*30, 30, 30);
                   if(nodemap[i][j].isVisited == 1){
                       c.fillStyle = "#FFFFFF";
                       c.fillRect(i*30 + 6, j*30 + 6, 18, 18);
                       if(nodemap[i][j].n){
                           c.fillStyle = "#FFFFFF";
                           c.fillRect(i*30 + 12, j*30, 6, 6);
                       }
                       if(nodemap[i][j].s){
                           c.fillStyle = "#FFFFFF";
                           c.fillRect(i*30 + 12, j*30 + 24, 6, 6);
                       }
                       if(nodemap[i][j].e){
                           c.fillStyle = "#FFFFFF";
                           c.fillRect(i*30 + 24, j*30 + 12, 6, 6);
                       }
                       if(nodemap[i][j].w){
                           c.fillStyle = "#FFFFFF";
                           c.fillRect(i*30, j*30 + 12, 6, 6);
                       }
                   }
               }
           }
            
            /*for(var i = 0; i< Math.floor(pathWidth/2)+1; i++){
                for(var j = 0; j< Math.floor(pathHeight/2)+1; j++){
                    var randRoom = Math.floor((Math.random() * 9));
                    if(randRoom < 1){
                        roomDim = createRoom(i,j,pathWidth,pathHeight);
                        c.beginPath();
                        //c.lineWidth = 3;
                        c.fillStyle = "#FFFFFF";
                        c.fillRect(i*30 , j*30, roomDim[0]*30 - 6, roomDim[1]*30 - 6);
                        c.stroke();
                    }
                }
            }*/
            
            //paint the start and end points.
            //c.fillStyle = "#33CC33";
            //c.fillStyle = "#FFFFFF";
            //c.fillRect(startpoint.x*30, startpoint.y*30, 24, 24);
            //c.fillStyle = "#CC0000";
            //c.fillStyle = "#FFFFFF";
            //c.fillRect(endpoint.x*30, endpoint.y*30, 24 ,24);
            
            
            
            var startnode = {
                x:0,
                y:0
            };
            startnode.x = startpoint.x*30;
            startnode.y = startpoint.y*30;
            //floodfill(startnode,"#FFFFFF","#0099FF", pathWidth, pathHeight);
            var imgdata = c.getImageData(0,0,1,1).data;
            
            //paint the start and end points.
            c.fillStyle = "#33CC33";
            c.fillRect(startpoint.x*30 + 6, startpoint.y*30 + 6, 18, 18);
            c.fillStyle = "#CC0000";
            c.fillRect(endpoint.x*30 + 6, endpoint.y*30 + 6, 18, 18);
            c.fillStyle = "#CC66FF";
            c.fillRect(branchpoint.x*30 + 6, branchpoint.y*30 + 6, 18, 18);
            
        }
    }
})(window, document, undefined);
