var PathGen = PathGen || {};

PathGen.render = function(c, nodemap, branchpoints, startpoint, endpoint, tileSize) {
    var MAIN   = PathGen.MAIN_PATH;
    var BRANCH = PathGen.BRANCH_BASE;
    var bodyOffset = 6;
    var bodySize   = tileSize - 12;
    var doorSize   = 6;
    var doorMid    = Math.floor(tileSize / 2) - 3;

    for (var i = 0; i < nodemap.length; i++) {
        for (var j = 0; j < nodemap[i].length; j++) {
            var node = nodemap[i][j];
            var tx = i * tileSize;
            var ty = j * tileSize;

            // background
            c.fillStyle = "#000000";
            c.fillRect(tx, ty, tileSize, tileSize);

            // cell body
            if      (node.isVisited === MAIN)   { c.fillStyle = "#FFFFFF"; }
            else if (node.isVisited >= BRANCH)  { c.fillStyle = "#0099CC"; }
            else                                { c.fillStyle = "#000000"; }
            c.fillRect(tx + bodyOffset, ty + bodyOffset, bodySize, bodySize);

            //north door
            c.fillStyle = node.n === MAIN ? "#FFFFFF" : node.n >= BRANCH ? "#0099CC" : "#000000";
            c.fillRect(tx + doorMid, ty, doorSize, doorSize);

            //south door
            c.fillStyle = node.s === MAIN ? "#FFFFFF" : node.s >= BRANCH ? "#0099CC" : "#000000";
            c.fillRect(tx + doorMid, ty + tileSize - doorSize, doorSize, doorSize);

            //east door
            c.fillStyle = node.e === MAIN ? "#FFFFFF" : node.e >= BRANCH ? "#0099CC" : "#000000";
            c.fillRect(tx + tileSize - doorSize, ty + doorMid, doorSize, doorSize);

            //west door
            c.fillStyle = node.w === MAIN ? "#FFFFFF" : node.w >= BRANCH ? "#0099CC" : "#000000";
            c.fillRect(tx, ty + doorMid, doorSize, doorSize);

            //rooms
            if (node.isRoom === 1) {
                if      (node.isVisited === MAIN)  { c.fillStyle = "#FFFFFF"; }
                else if (node.isVisited >= BRANCH) { c.fillStyle = "#0099CC"; }
                else                               { c.fillStyle = "#000000"; }
                c.fillRect(tx, ty, tileSize, tileSize);
            }
        }
    }

    // branch point markers
    for (var i = 0; i < branchpoints.length; i++) {
        c.fillStyle = "#CC66FF";
        c.fillRect(branchpoints[i].x * tileSize + bodyOffset, branchpoints[i].y * tileSize + bodyOffset, bodySize, bodySize);
    }

    // start and end markers
    c.fillStyle = "#33CC33";
    c.fillRect(startpoint.x * tileSize + bodyOffset, startpoint.y * tileSize + bodyOffset, bodySize, bodySize);
    c.fillStyle = "#CC0000";
    c.fillRect(endpoint.x * tileSize + bodyOffset, endpoint.y * tileSize + bodyOffset, bodySize, bodySize);
};
