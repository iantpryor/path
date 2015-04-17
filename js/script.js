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
        var origroomlist = [];
        var roomlist = [];
        var removelist = [];
        document.getElementById("paintbtn").onclick = paint;
        
        function removeRooms(){
            origroomlist = roomlist.slice(0);
            removelist = [];
            for(var i = 0; i< roomlist.length; i++){
                var remove = 1;
                var tempHeight = roomlist[i].height;
                var tempWidth = roomlist[i].width;
                for(var j = 0; j< tempWidth; j++){
                    for(var k = 0; k< tempHeight; k++){
                        if(nodemap[roomlist[i].x + j][roomlist[i].y + k].isVisited == 1){
                            remove = 0;
                            break;
                        }
                    }
                }
                
                if(remove ==1 ){
                    roomlist[i].removed = 1;
                }
            }
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
            roomlist = [];
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
            
            for(i = 0; i< randw; i++){
                for(j = 0; j< randh; j++){
                    nodemap[x+i][y+j].isRoom = 1;
                }
            }
            var room = {
              x:x,
              y:y,
              width: randw,
              height: randh,
              removed: 0
            };
            roomlist.push(room);
            return [randw, randh];
        }
    
        function paint(){
            reset();
            
            var widthSelect = document.getElementById("width");
            var pathWidth = parseInt(widthSelect.options[widthSelect.selectedIndex].value);
            
            var heightSelect = document.getElementById("height");
            var pathHeight = parseInt(heightSelect.options[heightSelect.selectedIndex].value);
            
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
                        isRoom:0,
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
           
           //create a random path that we will walk
           var randsteps = 2* Math.floor((pathWidth/2) * (pathHeight/2));
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

           //set the start node as visited in the beginning
           nodemap[startpoint.x][startpoint.y].isVisited = 1;
           
           //loop through the walk
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
               
               
              
               movingpointold.x = movingpoint.x;
               movingpointold.y = movingpoint.y;
           }
           
           //create a branch point
           var branchpoints = [];
           for(var i = 0; i< nodemap.length; i++){
               for(var j = 0; j< nodemap[i].length; j++){
                   var neighboorcount = 0;
                   if(typeof nodemap[i][j - 1] !== "undefined"){
                       if(nodemap[i][j-1].isVisited == 1){
                           neighboorcount++;
                       }
                   } else{
                       neighboorcount++;
                   }
                   if(typeof nodemap[i][j + 1] !== "undefined"){
                       if(nodemap[i][j+1].isVisited == 1){
                           neighboorcount++;
                       }
                   }else{
                       neighboorcount++;
                   }
                   if(typeof nodemap[i - 1][j] !== "undefined"){
                       if(nodemap[i-1][j].isVisited == 1){
                           neighboorcount++;
                       }
                   }else{
                       neighboorcount++;
                   }
                   if(typeof nodemap[i + 1][j] !== "undefined"){
                       if(nodemap[i +1][j].isVisited == 1){
                           neighboorcount++;
                       }
                   }else{
                       neighboorcount++;
                   }
               
                   if(neighboorcount <=2 && neighboorcount > 0){
                       branchpoints.push(nodemap[i][j]);
                   }
               }
           }
           
           
           
           
           //create random rooms
           for(var i = 0; i< Math.floor(pathWidth/2)+1; i++){
                for(var j = 0; j< Math.floor(pathHeight/2)+1; j++){
                    var randRoom = Math.floor((Math.random() * 9));
                    if(randRoom < 1){
                        roomDim = createRoom(i,j,pathWidth,pathHeight);
                        //c.beginPath();
                        //c.fillStyle = "#FFFFFF";
                        //c.fillRect(i*30 + 6, j*30 + 6, roomDim[0]*30 - 6*2, roomDim[1]*30 - 6*2);
                        //c.stroke();
                    }
                }
            }
            
            //get rid of rooms that aren't attached
            removeRooms();
            
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
                   if(nodemap[i][j].isRoom == 1){
                       //c.fillStyle = "#FFFFFF";
                       //c.fillRect(i*30, j*30, 30, 30);
                       
                   }
               }
           }
           
           //paint the original rooms
           /*for(var i = 0; i< origroomlist.length; i++){
                c.beginPath();
                c.fillStyle = "#33CCFF";
                c.fillRect(origroomlist[i].x*30 + 6, origroomlist[i].y*30 + 6, origroomlist[i].width*30 - 6*2, origroomlist[i].height*30 - 6*2);
                c.stroke();
            }*/
           
           //paint the rooms so they look nice
           for(var i = 0; i< roomlist.length; i++){
               if(roomlist[i].removed == 0){
                   c.beginPath();
                   c.fillStyle = "#FFFFFF";
                   c.fillRect(roomlist[i].x*30 + 6, roomlist[i].y*30 + 6, roomlist[i].width*30 - 6*2, roomlist[i].height*30 - 6*2);
                   c.stroke();
               }
            }
            
            for(var i = 0; i< branchpoints.length; i++){
                c.fillStyle = "#CC66FF";
                c.fillRect(branchpoints[i].x*30 + 6, branchpoints[i].y*30 + 6, 18, 18);
            }
            
            
            
            //paint the start, branch, and end points.
            c.fillStyle = "#33CC33";
            c.fillRect(startpoint.x*30 + 6, startpoint.y*30 + 6, 18, 18);
            c.fillStyle = "#CC0000";
            c.fillRect(endpoint.x*30 + 6, endpoint.y*30 + 6, 18, 18);
            
        }
    }
})(window, document, undefined);
