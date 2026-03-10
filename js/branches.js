var PathGen = PathGen || {};

PathGen.findBranchPoints = function(nodemap) {
    var branchpoints = [];
    for (var i = 0; i < nodemap.length; i++) {
        for (var j = 0; j < nodemap[i].length; j++) {
            if (nodemap[i][j].isVisited !== PathGen.MAIN_PATH) {
                continue;
            }

            var neighborcount = 0;
            if (j - 1 < 0 || nodemap[i][j-1].isVisited === PathGen.MAIN_PATH) {
                neighborcount++;
            }
            if (j + 1 >= nodemap[i].length || nodemap[i][j+1].isVisited === PathGen.MAIN_PATH) {
                neighborcount++;
            }
            if (i - 1 < 0 || nodemap[i-1][j].isVisited === PathGen.MAIN_PATH) {
                neighborcount++;
            }
            if (i + 1 >= nodemap.length || nodemap[i+1][j].isVisited === PathGen.MAIN_PATH) {
                neighborcount++;
            }

            if (neighborcount <= 2 && neighborcount > 0 && Math.floor(Math.random() * 9) < 1) {
                branchpoints.push(nodemap[i][j]);
            }
        }
    }
    return branchpoints;
};

// branch walk
// for each branch point
// do a random walk away
// avoid already visited locations
PathGen.walkBranches = function(nodemap, branchpoints, pathWidth, pathHeight) {
    for (var i = 0; i < branchpoints.length; i++) {
        var branchId = PathGen.BRANCH_BASE + i;
        var bx = branchpoints[i].x;
        var by = branchpoints[i].y;
        var branchLength = pathWidth + pathHeight;

        for (var j = 0; j < branchLength; j++) {
            var prevx = bx;
            var prevy = by;
            var randDir = Math.floor(Math.random() * 4);
            var backTrack = false;

            if (randDir === 0) {
                //up
                by--;
                if (by < 0 || (nodemap[bx][by].isVisited !== branchId && nodemap[bx][by].isVisited !== PathGen.UNVISITED)) {
                    by++;
                    backTrack = true;
                }
            } else if (randDir === 1) {
                //down
                by++;
                if (by >= pathHeight || (nodemap[bx][by].isVisited !== branchId && nodemap[bx][by].isVisited !== PathGen.UNVISITED)) {
                    by--;
                    backTrack = true;
                }
            } else if (randDir === 2) {
                //left
                bx--;
                if (bx < 0 || (nodemap[bx][by].isVisited !== branchId && nodemap[bx][by].isVisited !== PathGen.UNVISITED)) {
                    bx++;
                    backTrack = true;
                }
            } else {
                //right
                bx++;
                if (bx >= pathWidth || (nodemap[bx][by].isVisited !== branchId && nodemap[bx][by].isVisited !== PathGen.UNVISITED)) {
                    bx--;
                    backTrack = true;
                }
            }

            if (!backTrack) {
                nodemap[bx][by].isVisited = branchId;
                if (nodemap[prevx][prevy].isVisited !== PathGen.MAIN_PATH) {
                    nodemap[prevx][prevy].isVisited = branchId;
                }
                if (randDir === 0) {
                    nodemap[prevx][prevy].n = branchId;
                    nodemap[bx][by].s = branchId;
                } else if (randDir === 1) {
                    nodemap[prevx][prevy].s = branchId;
                    nodemap[bx][by].n = branchId;
                } else if (randDir === 2) {
                    nodemap[prevx][prevy].w = branchId;
                    nodemap[bx][by].e = branchId;
                } else {
                    nodemap[prevx][prevy].e = branchId;
                    nodemap[bx][by].w = branchId;
                }
            }
        }
    }
};
