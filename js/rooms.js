var PathGen = PathGen || {};

PathGen.createRoom = function(nodemap, roomlist, x, y, pw, ph) {
    var maxW = pw - x;
    var maxH = ph - y;

    var randw = maxW + 1;
    while (randw > maxW) {
        randw = Math.floor(Math.random() * (pw / 5) + 1);
    }
    var randh = maxH + 1;
    while (randh > maxH) {
        randh = Math.floor(Math.random() * (ph / 5) + 1);
    }

    for (var i = 0; i < randw; i++) {
        for (var j = 0; j < randh; j++) {
            nodemap[x + i][y + j].isRoom = 1;
        }
    }
    roomlist.push({ x: x, y: y, width: randw, height: randh, removed: 0 });
    return [randw, randh];
};

PathGen.removeRooms = function(nodemap, roomlist) {
    for (var i = 0; i < roomlist.length; i++) {
        var hasPath = false;
        var tempWidth = roomlist[i].width;
        var tempHeight = roomlist[i].height;

        for (var j = 0; j < tempWidth && !hasPath; j++) {
            for (var k = 0; k < tempHeight && !hasPath; k++) {
                if (nodemap[roomlist[i].x + j][roomlist[i].y + k].isVisited === PathGen.MAIN_PATH) {
                    hasPath = true;
                }
            }
        }

        if (hasPath) {
            for (var j = 0; j < tempWidth; j++) {
                for (var k = 0; k < tempHeight; k++) {
                    nodemap[roomlist[i].x + j][roomlist[i].y + k].isVisited = PathGen.MAIN_PATH;
                }
            }
        } else {
            roomlist[i].removed = 1;
        }
    }
};
