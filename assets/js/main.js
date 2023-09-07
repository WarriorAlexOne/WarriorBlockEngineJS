console.log(("b" + "a" + + "a" + "a").toLowerCase());
const can = document.getElementById("main");
const ctx = can.getContext("2d");
const canX = can.width;
const canY = can.height;

document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);

//Player1
let p1SizeX = 32;
let p1SizeY = 32;
let p1X = p1SizeX/2;
let p1Y = canY/2;
let p1TrueCoordX = p1X-p1SizeX/2;
let p1TrueCoordY = p1Y-p1SizeY/2;
//Player1 Controls
let p1UpPressed = false;
let p1LeftPressed = false;
let p1DownPressed = false;
let p1RightPressed = false;
let p1SprintPressed = false;
//Player1 Stats
let p1Speed = 8;
let p1SprintSpeed = p1Speed*2;
let p1FrameTimer = 0;
let p1SprintCooldown = 0;

//On/Off
let clearCanvas = true;
let growthShrink = false;

//Other
let controlText = true;

function keyDown (input) { //Key Press
    //General
    if (input.code == "KeyO") { //Clear Canvas Button
        clearCanvas = !clearCanvas;
        console.log("Clear Canvas: "+clearCanvas);
    }
    if (input.code == "KeyG") { //Grow/Shrink Button
        growthShrink = !growthShrink;
        console.log("GrowthShrink: "+growthShrink);
    }
    if (input.code == "Escape") { //Reset Button
        p1SizeX=32,p1SizeY=32,p1TrueCoordX=0+(p1SizeX/2),p1TrueCoordY=canY/2,p1Speed=8;
        clearCanvas=true,growthShrink=false,p1SprintPressed=false,p1SprintPressed=false;
        console.log("Map Reset")
    }
    if (input.code == "F2") {
        controlText = !controlText;
    }
    //P1
    if (input.code == "KeyW") { //Up
        p1UpPressed = true;
    }
    if (input.code == "KeyA") { //Left
        p1LeftPressed = true;
    }
    if (input.code == "KeyS") { //Down
        p1DownPressed = true;
    }
    if (input.code == "KeyD") { //Right
        p1RightPressed = true;
    }
    if (input.code == "Space") { //Sprint Key
        p1SprintPressed = true;
    }
    if (input.code == "Equal") { //Speed Up
        p1Speed += 1;
    }
    if (input.code == "Minus") { //Slow Down
        p1Speed -= 1;
    }
    if (input.code == "Backspace") { //Speed Reset
        p1Speed = 8;
    }
}
function keyUp (input) { //Key Unpress
    //P1
    if (input.code == "KeyW") { //Up
        p1UpPressed = false;
    }
    if (input.code == "KeyA") { //Left
        p1LeftPressed = false;
    }
    if (input.code == "KeyS") { //Down
        p1DownPressed = false;
    }
    if (input.code == "KeyD") { //Right
        p1RightPressed = false;
    }
    if (input.code == "Space") { //Sprint
        p1SprintPressed = false;
    }
}
function draw () { //Drawing Elements
    //P1
    ctx.fillStyle = "red";
    ctx.fillRect(p1TrueCoordX,p1TrueCoordY,p1SizeX,p1SizeY);
}
function particleSystem () { //Particle Logic
    ctx.fillStyle = "green";
    ctx.fillRect(p1TrueCoordX,p1TrueCoordY,p1SizeX,p1SizeY);
}
function playerLoop () { //Player Features
    //General
    if (clearCanvas) {
        ctx.clearRect(canX-canX,canY-canY,canX,canY);
    }
    if (controlText) {
        ctx.font = "25px Consolas";
        ctx.fillStyle = "white";
        ctx.fillText("              Press F2 To See Controls",canX-535,25,2000);
    }
    else {
        ctx.font = "25px Consolas";
        ctx.fillStyle = "white";
        ctx.fillText("              Controls",canX-535,25,2000);
        ctx.fillText("         Player1   Player2",canX-535,50,2000);
        ctx.fillText("     WASD = Move   Arrow Keys = Move",canX-535,75,2000);
        ctx.fillText("  SPACE = Sprint   Right CTRL = Sprint",canX-535,100,2000);
        ctx.fillText("               General",canX-535,150,2000);
        ctx.fillText("  O = Paint Mode   ESC = Reset",canX-535,175,2000);
        ctx.fillText("   G - Size Mode   F2 = Control Guide",canX-535,200,2000);
    }
    //P1 Sprint Logic
    if (p1SprintPressed) {
        p1FrameTimer ++;
    }
    if (p1FrameTimer >= 120) {
        p1SprintCooldown += (Math.round(p1FrameTimer*1.30));
        p1FrameTimer = 0;
    }
    if (p1SprintCooldown >= 1) {
        p1FrameTimer = 0;
        p1SprintCooldown --;
        p1SprintPressed = false;
    }
    if (!p1SprintPressed && p1FrameTimer > 0) {
        p1FrameTimer -= 0.8;
    }
    if (p1FrameTimer < 0) {
        p1FrameTimer = 0;
    }
    if (p1SprintCooldown < 0) {
        p1SprintCooldown = 0;
    }
    //P1 Walk Logic
    p1SprintSpeed = p1Speed*2;
    if (p1UpPressed) { //Up
        if (p1SprintPressed) {
            p1TrueCoordY -= p1SprintSpeed;
        }
        else {
            p1TrueCoordY -= p1Speed;
        }
    }
    if (p1LeftPressed) { //Left
        if (p1SprintPressed) {
            p1TrueCoordX -= p1SprintSpeed;
        }
        else {
            p1TrueCoordX -= p1Speed;
        }
    }
    if (p1DownPressed) { //Down
        if (p1SprintPressed) {
            p1TrueCoordY += p1SprintSpeed;
        }
        else {
            p1TrueCoordY += p1Speed;
        }
    }
    if (p1RightPressed) { //Right
        if (p1SprintPressed) {
            p1TrueCoordX += p1SprintSpeed;
        }
        else {
            p1TrueCoordX += p1Speed;
        }
    }
    if (p1Speed >= 32) { //Speed Cap
        p1Speed = 32;
    }
    if (p1Speed <= 1) { //Slow Cap
        p1Speed = 1;
    }
    if (p1SprintCooldown == 2) {
        p1SprintPressed = false;
        p1SprintCooldown = 0;
    }
    //Edge Wrapping Logic Regular
    if (growthShrink == false) {
        //P1
        if (p1TrueCoordX > canX+(p1SizeX/2)) { //Right to left
            p1TrueCoordX = (canX-canX)-(p1SizeX/2);
        }
        if (p1TrueCoordY > canY+(p1SizeX/2)) { //Down to up
            p1TrueCoordY = (canY-canY)-(p1SizeX/2);
        }
        if (p1TrueCoordX < (canX-canX)-(p1SizeX/2)) { //Left to right
            p1TrueCoordX = canX+(p1SizeX/2);
        }
        if (p1TrueCoordY < (canY-canY)-(p1SizeX/2)) { //Up to down
            p1TrueCoordY = canY+(p1SizeX/2);
        }
    }
    //Edge Wrapping Logic Grow/Shrink
    if (growthShrink == true) {
        //P1
        if (p1TrueCoordX > canX+(p1SizeX/2)) { //Right to left
            p1TrueCoordX = (canX-canX)-(p1SizeX/2);
        }
        if (p1TrueCoordY > canY+(p1SizeX/2)) { //Down to up
            p1SizeX /= 2, p1SizeY /= 2; //Shrink
            p1TrueCoordY = (canY-canY)-(p1SizeX/2);
        }
        if (p1TrueCoordX < (canX-canX)-(p1SizeX/2)) { //Left to right
            p1TrueCoordX = canX+(p1SizeX/2);
        }
        if (p1TrueCoordY < (canY-canY)-(p1SizeX/2)) { //Up to down
            p1SizeX *= 2, p1SizeY *= 2; //Grow
            p1TrueCoordY = canY+(p1SizeX/2);
        }
        if (p1SizeX > 512,p1SizeY > 512) {
            p1SizeX = 512, p1SizeY = 512; //Limit Growth
        }
        if (p1SizeX < 8,p1SizeY < 8) {
            p1SizeX = 8, p1SizeY = 8; //Limit Shrink
        }
    }
}
function mainLoop () { //Frame Loop
    playerLoop();
    draw();
    particleSystem();
    console.log(
        "Am I Looping?"+
        "\nP1"+"  Size:"+p1SizeX+"  Speed:"+p1Speed+"  SprintSpeed:"+p1SprintSpeed+
        "  Sprint:"+p1FrameTimer+"  Cooldown:"+p1SprintCooldown+"  X:"+p1TrueCoordX+"  Y:"+p1TrueCoordY
        );
        ctx.font = "25px Consolas";
        ctx.fillStyle = "white";
        ctx.fillText("Block Game JS v0.0.13.6 Dev 3",5,25,2000);
    requestAnimationFrame(mainLoop);
}
console.log("Block Game JS v0.0.13.6 Dev 3     WarriorBlockEngine 0.1");
console.log("Resolution: " + canX + "x" + canY);
mainLoop();