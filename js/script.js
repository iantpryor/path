(function(window, document) {
    // visit state constants
    PathGen.UNVISITED   = 0;
    PathGen.MAIN_PATH   = 1;
    PathGen.BRANCH_BASE = 2;

    var TILE_SIZE = 30;
    var moves = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };

    window.onload = function init() {
        var canvas = document.getElementById("mapcanvas");
        var c = canvas.getContext("2d");
        var nodemap = [];
        var roomlist = [];

        document.getElementById("paintbtn").onclick = paint;

        function paint() {
            nodemap = [];
            roomlist = [];

            var widthSelect = document.getElementById("width");
            var pathWidth = parseInt(widthSelect.options[widthSelect.selectedIndex].value);
            var heightSelect = document.getElementById("height");
            var pathHeight = parseInt(heightSelect.options[heightSelect.selectedIndex].value);

            // resize canvas to fit the grid exactly
            canvas.width  = pathWidth  * TILE_SIZE;
            canvas.height = pathHeight * TILE_SIZE;
            c.clearRect(0, 0, canvas.width, canvas.height);

            //create a start and endpoint based on the grid size
            var startpoint = { x: 0,             y: pathHeight - 1 };
            var endpoint   = { x: pathWidth - 1, y: 0             };

            //paint the base grid
            for (var i = 0; i < pathWidth; i++) {
                nodemap.push([]);
                for (var j = 0; j < pathHeight; j++) {
                    nodemap[i].push({
                        isVisited: PathGen.UNVISITED,
                        isRoom: 0,
                        n: 0, s: 0, e: 0, w: 0,
                        x: i, y: j
                    });
                }
            }

            //create a random path that we will walk
            var randsteps = 2 * Math.floor((pathWidth / 4) * (pathHeight / 4));
            var walkArray = PathGen.walk(moves, startpoint, endpoint, randsteps);

            //create two moving points representing where we are and where we were
            var movingpoint    = { x: startpoint.x, y: startpoint.y };
            var movingpointold = { x: startpoint.x, y: startpoint.y };

            //set the start node as visited in the beginning
            nodemap[startpoint.x][startpoint.y].isVisited = PathGen.MAIN_PATH;

            //loop through the walk
            for (var i = 0; i < walkArray.length; i++) {
                movingpoint.x += walkArray[i][0];
                movingpoint.y += walkArray[i][1];

                var oppcurrMoveX = -walkArray[i][0];
                var oppcurrMoveY = -walkArray[i][1];
                var index = -1;
                for (var j = i; j < walkArray.length; j++) {
                    if (walkArray[j][0] === oppcurrMoveX && walkArray[j][1] === oppcurrMoveY) {
                        index = j;
                        break;
                    }
                }

                if (movingpoint.x > pathWidth - 1) {
                    movingpoint.x--;
                    if (index > -1) { walkArray.splice(index, 1); }
                }
                if (movingpoint.x < 0) {
                    movingpoint.x++;
                    if (index > -1) { walkArray.splice(index, 1); }
                }
                if (movingpoint.y > pathHeight - 1) {
                    movingpoint.y--;
                    if (index > -1) { walkArray.splice(index, 1); }
                }
                if (movingpoint.y < 0) {
                    movingpoint.y++;
                    if (index > -1) { walkArray.splice(index, 1); }
                }

                var movedirX = movingpoint.x - movingpointold.x;
                var movedirY = movingpoint.y - movingpointold.y;
                if (movedirX < 0) {
                    nodemap[movingpointold.x][movingpointold.y].w = PathGen.MAIN_PATH;
                    nodemap[movingpoint.x][movingpoint.y].e = PathGen.MAIN_PATH;
                } else if (movedirX > 0) {
                    nodemap[movingpointold.x][movingpointold.y].e = PathGen.MAIN_PATH;
                    nodemap[movingpoint.x][movingpoint.y].w = PathGen.MAIN_PATH;
                }
                if (movedirY < 0) {
                    nodemap[movingpointold.x][movingpointold.y].n = PathGen.MAIN_PATH;
                    nodemap[movingpoint.x][movingpoint.y].s = PathGen.MAIN_PATH;
                } else if (movedirY > 0) {
                    nodemap[movingpointold.x][movingpointold.y].s = PathGen.MAIN_PATH;
                    nodemap[movingpoint.x][movingpoint.y].n = PathGen.MAIN_PATH;
                }

                nodemap[movingpoint.x][movingpoint.y].isVisited = PathGen.MAIN_PATH;
                movingpointold.x = movingpoint.x;
                movingpointold.y = movingpoint.y;
            }

            //if the walk didn't reach the endpoint, walk directly to it now
            if (nodemap[endpoint.x][endpoint.y].isVisited !== PathGen.MAIN_PATH) {
                while (movingpoint.x !== endpoint.x || movingpoint.y !== endpoint.y) {
                    movingpointold.x = movingpoint.x;
                    movingpointold.y = movingpoint.y;
                    if (movingpoint.x < endpoint.x) {
                        movingpoint.x++;
                        nodemap[movingpointold.x][movingpointold.y].e = PathGen.MAIN_PATH;
                        nodemap[movingpoint.x][movingpoint.y].w = PathGen.MAIN_PATH;
                    } else if (movingpoint.x > endpoint.x) {
                        movingpoint.x--;
                        nodemap[movingpointold.x][movingpointold.y].w = PathGen.MAIN_PATH;
                        nodemap[movingpoint.x][movingpoint.y].e = PathGen.MAIN_PATH;
                    } else if (movingpoint.y < endpoint.y) {
                        movingpoint.y++;
                        nodemap[movingpointold.x][movingpointold.y].s = PathGen.MAIN_PATH;
                        nodemap[movingpoint.x][movingpoint.y].n = PathGen.MAIN_PATH;
                    } else {
                        movingpoint.y--;
                        nodemap[movingpointold.x][movingpointold.y].n = PathGen.MAIN_PATH;
                        nodemap[movingpoint.x][movingpoint.y].s = PathGen.MAIN_PATH;
                    }
                    nodemap[movingpoint.x][movingpoint.y].isVisited = PathGen.MAIN_PATH;
                }
            }

            //create random rooms
            for (var i = 0; i < pathWidth; i++) {
                for (var j = 0; j < pathHeight; j++) {
                    if (Math.floor(Math.random() * 19) < 1) {
                        PathGen.createRoom(nodemap, roomlist, i, j, pathWidth, pathHeight);
                    }
                }
            }
            //get rid of rooms that aren't attached
            //doesn't get rid of room data, so they could be woken by a branch
            PathGen.removeRooms(nodemap, roomlist);

            //create a branch point
            var branchpoints = PathGen.findBranchPoints(nodemap);
            PathGen.walkBranches(nodemap, branchpoints, pathWidth, pathHeight);

            //paint the map data
            PathGen.render(c, nodemap, branchpoints, startpoint, endpoint, TILE_SIZE);
        }
    };
})(window, document);
