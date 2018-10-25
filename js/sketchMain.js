let buttons = {};

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.elt.style["align-self"] = "center";
    canvas.elt.style.margin = "auto";

    let mkbd = function() {
        let sqsize = min((windowWidth/2) * 1.5, (windowHeight/2) * 1.5);
        let gap = 20;
        let bdsize = 4; // grid is a 4x4 matrix
        let b = new SoundBoard(bdsize, bdsize, "1234qwerasdfzxcv", "½098765", "uiop", (windowWidth / 2) - (sqsize / 2), (windowHeight / 2) - (sqsize / 2), sqsize, sqsize, gap);

        return b;
        // you were making this much more efficient because you don't want the crap in the real code. it's benig made to be collapsable. :D
    };

    buttons.board = mkbd();
}

function draw() {
    colorMode(RGB);
    background(16);

    buttons.board.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    let sqsize = min((windowWidth/2) * 1.5, (windowHeight/2) * 1.5);
    buttons.board.sx = (windowWidth / 2) - (sqsize / 2);
    buttons.board.sy = (windowHeight / 2) - (sqsize / 2);
    buttons.board.bwidth = buttons.board.bheight = sqsize;
    
    buttons.board.adjustBoardSize();
}

function touchStarted() {
    buttons.board.loopThroughTouches(touches);
    return false;
}
function touchMoved() {
    buttons.board.loopThroughTouches(touches);
    return false;
}
function touchEnded() {
    buttons.board.loopThroughTouches(touches);
    return false;
}

function keyPressed() {
    let btn = buttons.board.getButton(key);
    if(btn) btn.onPressed(buttons.board);
    return false;
}
function keyReleased() {
    let btn = buttons.board.getButton(key);
    if(btn) btn.onReleased(buttons.board);
    return false;
}

function clamp(val, lower, upper) {
    return min(max(val, lower), upper);
}

// Highlight the scaled keys