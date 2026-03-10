var PathGen = PathGen || {};

PathGen.shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

PathGen.walk = function(moves, start, stop, steps) {
    var distX = stop.x - start.x;
    var distY = stop.y - start.y;
    var walkSteps = [];

    for (var i = 0; i < Math.abs(distX); i++) {
        walkSteps.push(distX < 0 ? moves.l : moves.r);
    }
    for (var i = 0; i < Math.abs(distY); i++) {
        walkSteps.push(distY < 0 ? moves.u : moves.d);
    }

    //add a number of random pairs based on how big our grid is
    for (var i = 0; i < steps; i++) {
        if (Math.floor(Math.random() * 2) < 1) {
            walkSteps.push(moves.u);
            walkSteps.push(moves.d);
        } else {
            walkSteps.push(moves.l);
            walkSteps.push(moves.r);
        }
    }
    return PathGen.shuffle(walkSteps);
};
