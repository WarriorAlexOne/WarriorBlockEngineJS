console.log(("b" + "a" + + "a" + "a").toLowerCase());
const body = document.querySelector("body");
const can = document.getElementById("main");
const ctx = can.getContext("2d");
const canX = can.width;
const canY = can.height;
const gameVersion = "";
const engineVersion = "WarriorBlockEngine 0.1.13.6 Dev 50";

document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);
document.addEventListener("mousemove",cursorMove);
document.addEventListener("mousedown",cursorClickInput);
document.addEventListener("mouseup",cursorUnclickInput);

//Classes? (These might be objects? Both??)
let DefValues = { //Default Values For All Objects
    //Player Default Coordinate Values
    psizeX: 32,
    psizeY: 32,
    pspawnPointX: 0,
    pspawnPointY: 0,
    px: 0,
    py: 0,
    //Player Default Walk/Sprint Values
    pspeed: 8,
    pspeedMin: 1,
    pspeedMax: 32,
    psprintSpeed: 16,
    psprintTimer: 0,
    psprintCooldown: 0,
    //Player Default Health Values
    piFrames: 30,
    phealth: 8,
    phealthMin: 1,
    phealthMax: 8,
    prespawnTimer: 300,
    plives: 3,
    //Wall Coordinate Values
    wsizeX: 256,
    wsizeY: 64,
    wx: 816,
    wy: 416,
    //Enemy Coordinate Values
    esizeX: 32,
    esizeY: 32,
    ex: 416,
    ey: 416
}

let Player = { //Player Values
//Player Coordinates
    sizeX: 32,
    sizeY: 32,
    spawnPointX: 300,
    spawnPointY: 300,
    x: 300,
    y: 300,
//Player Speed
    momentumX: 0,
    momentumY: 0,
//Player Controls Buttons (Only used to determine if Controls Logic is true or false)
    upButton: "KeyW",
    leftButton: "KeyA",
    downButton: "KeyS",
    rightButton: "KeyD",
    sprintButton: "Space",
//Player Controls Logic
    controlsEnabled: false,
    //directional
    up: false,
    left: false,
    down: false,
    right: false,
    //general
    sprint: false,
//Player Walk/Sprint Logic
    canWalk: true,
    canSprint: true,
    isStill: true,
    isWalking: false,
    isSprinting: false,
    speed: 4,//0.0625,
    speedMin: 1,
    speedMax: 32,
    sprintSpeed: 8,//0.125
    sprintTimer: 120,
    sprintCooldown: 0,
//Player Health Logic
    takingDamage: false,
    iFrames: 30,
    health: 8,
    healthMin: 1,
    healthMax: 8,
    respawnTimer: 300,
    lives: 3,
    alive: true,
//Player Wall Collision Logic
    wallDetection: 32,
    nearTop: false,
    nearLeft: false,
    nearBottom: false,
    nearRight: false,
    collidedWithX: false,
    TopWallSpeed: 0,
    LeftWallSpeed: 0,
    BottomWallSpeed: 0,
    RightWallSpeed: 0,
//Miscellaneous
    dragPlayer: false,
    color: "#ff0000"
}

class Wall { //Wall Values
    sizeX;
    sizeY;
    x;
    y;
    constructor (sizeX,sizeY,x,y) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.x = x;
        this.y = y;
    }
}
let walls = [ //Walls
    new Wall(64,256,816,416),
    new Wall(64,256,956,416)
];

let Enemy = { //Enemy Values
    sizeX: 32,
    sizeY: 32,
    x: 416,
    y: 416
}

//Settings
let clearCanvas = true;
let growthShrink = false;

//Mouse Controls
let mouseClick = false;
let mouseUnclick = false;
let clickTimer = 0;
let unclickTimer = 0;
let mouseX = 0;
let mouseY = 0;
let offsetX = 0;
let offsetY = 0;

//Menu Buttons
let pressStart = true;
let menuStart = { //Start Button
    red: 0,
    green: 0,
    blue: 0,
    text: "Start Game"
}
//Quit
let pressQuit = false;

//Miscellaneous
let switchCase = 3;
let debugText = true;
let canvasScreenSide = [];
let changeScreenSide = 3;
let menuButtonColor = "#777777";

//Calculation Functions
function compareMax (a,b) { //Checks 2 numbers for the biggest number and returns it
    if (a > b) {
        return a;
    }
    return b;
}
function compareMin (a,b) { //Checks 2 numbers for the smallest number and returns it
    if (a < b) {
        return a;
    }
    return b;
}
function minMax (minNum,maxNum,input) { //Defines a minimum and maximum number for the input to abide by
    return compareMax(minNum,compareMin(maxNum,input));
}
function addition (a,b) {
    return a+b;
}
function ptCalc (a,b) { //Pythagorean Calculations
    return Math.sqrt(a**2 + b**2);
}
function getDistance (x1,x2,y1,y2) { //Get distance of C based on Pythagorean Calculation
    return ptCalc(x1-x2,y1-y2)
}
function cycleArray (arrayLength) {
    for (let i = 0; i < arrayLength; i++) {
        return i;
    }
}
function getMomentumX (entity) {
    return entity.x-entity.momentumX;
}
function getMomentumY (entity) {
    return entity.y-entity.momentumY;
}
//Keyboard Input
function keyDown (input) {
    keyDownInput(input,Player);
}
function keyUp (input) {
    keyUpInput(input,Player)
}
function keyDownInput (input,entity) { //KeyDown Input Logic
    if (input.code == "F4") {
        changeScreenSide++;
    }
    if (input.code == "F9") {
        debugText = !debugText;
    }
    if (!entity.controlsEnabled) return;
    if (input.code == entity.upButton) {
        entity.up = true;
    }
    if (input.code == entity.leftButton) {
        entity.left = true;
    }
    if (input.code == entity.downButton) {
        entity.down = true;
    }
    if (input.code == entity.rightButton) {
        entity.right = true;
    }
    if (input.code == entity.sprintButton) {
        entity.sprint = true;
    }
    if (input.code == "Equal") {
        Player.speed ++;
    }
    if (input.code == "Minus") {
        Player.speed --;
    }
    if (input.code == "KeyP") {
        menuButtonColor++;
    }
}
function keyUpInput (input,entity) { //KeyUp Input Logic
    if (!entity.controlsEnabled) return;
    if (input.code == entity.upButton) {
        entity.up = false;
    }
    if (input.code == entity.leftButton) {
        entity.left = false;
    }
    if (input.code == entity.downButton) {
        entity.down = false;
    }
    if (input.code == entity.rightButton) {
        entity.right = false;
    }
    if (input.code == entity.sprintButton) {
        entity.sprint = false;
    }
}
//Mouse Input
function cursorMove (input) {
    const rect = can.getBoundingClientRect();
    offsetX = rect.left;
    offsetY = rect.top;
    mouseX = Math.round(input.clientX - offsetX);
    mouseY = Math.round(input.clientY - offsetY);
}
function cursorClickInput (input) {
    if (input) {
        mouseClick = true;
        clickTimer = 1;
    }
}
function cursorUnclickInput (input) {
    if (input) {
        mouseUnclick = true;
        unclickTimer = 1;
    }
}
function mouseTimers () {
    if (clickTimer > 0) {
        clickTimer--;
    }
    if (!clickTimer) {
        mouseClick = false;
    }
    if (unclickTimer > 0) {
        unclickTimer--;
    }
    if (!unclickTimer) {
        mouseUnclick = false;
    }
}
function mousePointer () {
    ctx.fillStyle = "orange";
    ctx.fillRect(mouseX-5,mouseY-5,10,10);
}
//The Heart Of The Game
function startGame () {
    //AABB Wall Collision Logic
    function collision (entity,wall) {
        if (
            entity.y + entity.sizeY + entity.wallDetection > wall.y &&
            entity.y + entity.sizeY + entity.wallDetection < wall.y + wall.sizeY
        ) {
            entity.nearTop = true;
        }
        else {
            entity.nearTop = false;
        }
        if (
            entity.x + entity.sizeX + entity.wallDetection > wall.x &&
            entity.x + entity.sizeX + entity.wallDetection < wall.x + wall.sizeX
        ) {
            entity.nearLeft = true;
        }
        else {
            entity.nearLeft = false;
        }
        if (
            entity.y - entity.wallDetection > wall.y + wall.sizeY &&
            entity.y - entity.wallDetection < wall.y
        ) {
            entity.nearBottom = true;
        }
        else {
            entity.nearBottom = false;
        }
        if (
            entity.x - entity.wallDetection < wall.x + wall.sizeX &&
            entity.x - entity.wallDetection > wall.x
        ) {
            entity.nearRight = true;
        }
        else {
            entity.nearRight = false;
        }
    }

    function collisionX (walls) { //X Collision Logic
        if (
            Player.x < (walls.x+Player.sprintSpeed) + walls.sizeX &&
            (Player.x+Player.sprintSpeed) + Player.sizeX > walls.x &&
            Player.y < walls.y + walls.sizeY &&
            Player.y + Player.sizeY > walls.y
        ) {
            if (Player.collidedWithX) { //Left Wall
                if (Player.x < walls.x) {
                    Player.nearLeft = true;
                    Player.nearRight = false;
                }
                else if (Player.x + Player.sizeX > walls.x + walls.sizeX) { //Right Wall
                    Player.nearLeft = false;
                    Player.nearRight = true;
                }
                if (
                    Player.x < walls.x + walls.sizeX &&
                    Player.x + Player.sizeX > walls.x &&
                    Player.y < walls.y + walls.sizeY &&
                    Player.y + Player.sizeY > walls.y
                ) {
                    if (Player.nearLeft) { //Left Wall
                        Player.x = walls.x - Player.sizeX;
                        ctx.fillStyle = "magenta";
                        ctx.fillRect(walls.x, walls.y, 8, walls.sizeY)
                    }
                    else if (Player.nearRight) { //Right Wall
                        Player.x = walls.x + walls.sizeX;
                        ctx.fillStyle = "magenta";
                        ctx.fillRect(walls.x+(walls.sizeX-8), walls.y, 8, walls.sizeY)
                    }
                }
            }
        }
        else {
            Player.collidedWithX = false;
        }
    }
    function collisionY (walls) { //Y Collision Logic
        if (
            Player.x < walls.x + walls.sizeX &&
            Player.x + Player.sizeX > walls.x &&
            Player.y < (walls.y+Player.sprintSpeed) + walls.sizeY && //replace number with player speed
            (Player.y+Player.sprintSpeed) + Player.sizeY > walls.y
        ) {
            if (!Player.collidedWithX) { //Top Wall
                if (Player.y < walls.y) {
                    Player.nearTop = true;
                    Player.nearBottom = false;
                }
                else if (Player.y + Player.sizeY > walls.y + walls.sizeY) { //Bottom Wall
                    Player.nearTop = false;
                    Player.nearBottom = true;
                }
                if (
                    Player.x < walls.x + walls.sizeX &&
                    Player.x + Player.sizeX > walls.x &&
                    Player.y < walls.y + walls.sizeY &&
                    Player.y + Player.sizeY > walls.y
                ) {
                    if (Player.nearTop) { //Top Wall
                        Player.y = walls.y - Player.sizeY;
                        ctx.fillStyle = "magenta";
                        ctx.fillRect(walls.x, walls.y, walls.sizeX, 8)
                    }
                    else if (Player.nearBottom) { //Bottom Wall
                        Player.y = walls.y + walls.sizeY;
                        ctx.fillStyle = "magenta";
                        ctx.fillRect(walls.x, walls.y+(walls.sizeY-8), walls.sizeX, 8)
                    }
                }
            }
        }
        else {
            Player.collidedWithX = true;
        }
    }
    //Movement Logic
    function walk (entity) { //Walk Function (Can Be Used Without The Sprint Function)
        //Walk Logic
        if (entity.canWalk) {
            if (entity.up) {
                entity.y -= entity.speed;
                entity.isWalking = true;
            }
            if (entity.left) {
                entity.x -= entity.speed;
                entity.isWalking = true;
            }
            if (entity.down) {
                entity.y += entity.speed;
                entity.isWalking = true;
            }
            if (entity.right) {
                entity.x += entity.speed;
                entity.isWalking = true;
            }
            if (!getMomentumX(entity) && !getMomentumY(entity)) { //If no momentum, isWalking is false
                entity.isWalking = false;
            }
        }
        //Walk Limitations
        if (!entity.canWalk) { //If you can't Walk you can't Sprint.
            entity.canSprint = false;
        }
        if (!entity.sprint) {
            entity.isSprinting = false;
        }
    } //Objects that use this need: x, y, speed, up, left, down, right.
    function walkSprint (entity) { //Sprint Function (Enables Walk Function)
        //Sprint Logic
        if (entity.sprint) {
            entity.canWalk = false;
            entity.isWalking = false;
            if (entity.up && entity.sprint) {
                entity.y -= entity.sprintSpeed;
                entity.isSprinting = true;
            }
            if (entity.left && entity.sprint) {
                entity.x -= entity.sprintSpeed;
                entity.isSprinting = true;
            }
            if (entity.down && entity.sprint) {
                entity.y += entity.sprintSpeed;
                entity.isSprinting = true;
            }
            if (entity.right && entity.sprint) {
                entity.x += entity.sprintSpeed;
                entity.isSprinting = true;
            }
            if (!getMomentumX(entity) && !getMomentumY(entity)) { //If no momentum, isSprinting is false
                entity.isSprinting = false;
            }
        }
        else if (entity.canSprint) {
            entity.canWalk = true;
            walk(entity);
        }
        //Sprint Timer Logic
    
    } //Objects that use this need: x, y, canWalk, canSprint, isSprinting, sprintSpeed, up, left, down, right.
    //Loops
    function settingsLoop () { //Settings
        if (clearCanvas) {
            ctx.clearRect(canX-canX,canY-canY,canX,canY);
        }
    }
    function playerLoop () { //Player Features
        Player.momentumX = Player.x;
        Player.momentumY = Player.y;
        Player.sprintSpeed = Player.speed*2;
        walkSprint(Player); //Walking and Sprinting
        //Click & Drag Player Around
        if (
            mouseX > Player.x &&
            mouseX < Player.x + Player.sizeX &&
            mouseY > Player.y &&
            mouseY < Player.y + Player.sizeY &&
            mouseClick == true
        ) {
            Player.dragPlayer = true;
        }
        if (Player.dragPlayer) {
            Player.x = mouseX - Player.sizeX/2;
            Player.y = mouseY - Player.sizeY/2;
        }
        if (mouseUnclick) {
            Player.dragPlayer = false;
        }
        //Edge Wrapping Logic Regular
        if (growthShrink == false) {
            //P1
            if (Player.x > canX+(Player.sizeX/2)) { //Right to left
                Player.x = (canX-canX)-(Player.sizeX/2);
            }
            if (Player.y > canY+(Player.sizeX/2)) { //Down to up
                Player.y = (canY-canY)-(Player.sizeX/2);
            }
            if (Player.x < (canX-canX)-(Player.sizeX/2)) { //Left to right
                Player.x = canX+(Player.sizeX/2);
            }
            if (Player.y < (canY-canY)-(Player.sizeX/2)) { //Up to down
                Player.y = canY+(Player.sizeX/2);
            }
        }
        //Edge Wrapping Logic Grow/Shrink
        if (growthShrink == true) {
            //P1
            if (Player.x > canX+(Player.sizeX/2)) { //Right to left
                Player.x = (canX-canX)-(Player.sizeX/2);
            }
            if (Player.y > canY+(Player.sizeX/2)) { //Down to up
                Player.sizeX /= 2, Player.sizeY /= 2; //Shrink
                Player.y = (canY-canY)-(Player.sizeX/2);
            }
            if (Player.x < (canX-canX)-(Player.sizeX/2)) { //Left to right
                Player.x = canX+(Player.sizeX/2);
            }
            if (Player.y < (canY-canY)-(Player.sizeX/2)) { //Up to down
                Player.sizeX *= 2, Player.sizeY *= 2; //Grow
                Player.y = canY+(Player.sizeX/2);
            }
            if (Player.sizeX > 512,Player.sizeY > 512) {
                Player.sizeX = 512, Player.sizeY = 512; //Limit Growth
            }
            if (Player.sizeX < 8,Player.sizeY < 8) {
                Player.sizeX = 8, Player.sizeY = 8; //Limit Shrink
            }
        }
        //Health System
        if (Player.takingDamage) {
            Player.iFrames --;
        }
        if (Player.iFrames <= 0) {
            Player.iFrames = 30;
            Player.takingDamage = false;
        }
        if (Player.iFrames == 29) {
            Player.health --;
        }
        if (Player.health <= 0) {
            Player.alive = false;
            Player.health = 8;
        }
        //Lives/Respawn System
        if (Player.lives <= 0) return;
        if (Player.alive) {
            Player.controlsEnabled = true;
            //Health Color Indicators
            switch (Math.floor(Player.health)) { // done capish, easy peasy -R
                default:
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(Player.x,Player.y,Player.sizeX,Player.sizeY);
                    break;
                case 8: //Why are you using comments to write? Lol -A
                    ctx.fillStyle = Player.color;
                    ctx.fillRect(Player.x,Player.y,Player.sizeX,Player.sizeY);
                    break;
                case 7: // It's like irl talking -R
                    ctx.fillStyle = "#ff7f00";
                    ctx.fillRect(Player.x,Player.y,Player.sizeX,Player.sizeY);
                    break;
                case 6: //I guess. :P -A
                    ctx.fillStyle = "#ffff00";
                    ctx.fillRect(Player.x,Player.y,Player.sizeX,Player.sizeY);
                    break;
                case 5: // awesome, don't remove these comments -R
                    ctx.fillStyle = "#00ff00";
                    ctx.fillRect(Player.x,Player.y,Player.sizeX,Player.sizeY);
                    break;
                case 4: // I'll have to clean these up. Xd -A
                    ctx.fillStyle = "#00ffff";
                    ctx.fillRect(Player.x,Player.y,Player.sizeX,Player.sizeY);
                    break;
                case 3: // no you don't -R
                    ctx.fillStyle = "#007fff";
                    ctx.fillRect(Player.x,Player.y,Player.sizeX,Player.sizeY);
                    break;
                case 2: // Fine :P -A
                    ctx.fillStyle = "#0000ff";
                    ctx.fillRect(Player.x,Player.y,Player.sizeX,Player.sizeY);
                    break;
                case 1: //XD
                    ctx.fillStyle = "#7f00ff";
                    ctx.fillRect(Player.x,Player.y,Player.sizeX,Player.sizeY);
                    break;
            }
        }
        else {
            ctx.clearRect(Player.x,Player.y,Player.sizeX,Player.sizeY);
            Player.x = Player.spawnPointX, Player.y = Player.spawnPointY;
            Player.respawnTimer --;
            Player.controlsEnabled = false;
        }
        if (Player.respawnTimer == 299) {
            Player.lives --;
        }
        if (Player.respawnTimer == 0) {
            Player.respawnTimer = DefValues.prespawnTimer;
            Player.alive = true;
        }
        if (Player.lives <= -1) {
            Player.alive = false;
        }
    }
    function wallLoop (walls) { //Wall Features
        ctx.fillStyle = "purple";
        ctx.fillRect(walls.x,walls.y,walls.sizeX,walls.sizeY);
    }
    function enemyLoop () { //Enemy Features
        ctx.fillStyle = "green";
        ctx.fillRect(Enemy.x,Enemy.y,Enemy.sizeX,Enemy.sizeY);
        if (getDistance(
            Player.x+Player.sizeX/2,
            Enemy.x+Enemy.sizeX/2,
            Player.y+Player.sizeY/2,
            Enemy.y+Enemy.sizeY/2
            ) <= (Enemy.sizeX/2)+(Player.sizeX/2)
            ) {
            Player.takingDamage = true; //Player 1 enemy collision code
        }
    }
    function textLoop () { //Texts
        fontNewLine = 0;
        //Debug Stats
        if (!debugText) {
            ctx.font = "20px Consolas";
            ctx.fillStyle = "lightgray";
            ctx.fillText("Press F9 To Debug",5,50,2000);
        }
        else {
            ctx.font = "20px Consolas";
            ctx.fillStyle = "skyblue";
            fontNewLine  = 50; ctx.fillText("PLAYER STATS:",5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("X: "+Player.x,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("Y: "+Player.y,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("Size: "+Player.sizeY+"px",5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("Speed: "+Player.speed+" / "+Player.sprintSpeed,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("SprintTimer: "+Player.sprintTimer,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("SprintCooldown: "+Player.sprintCooldown,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("TakingDamage: "+Player.takingDamage,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("Health: "+Player.health,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("IFrames: "+Player.iFrames,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("ExtraLives: "+Player.lives,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("RespawnTimer: "+Player.respawnTimer,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillStyle = "green";
            fontNewLine += 20; ctx.fillText("PLAYER EXTRA:",5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("EnemyNear: "+Math.round(getDistance(Player.x+Player.sizeX/2,Enemy.x+Enemy.sizeX/2,Player.y+Player.sizeY/2,Enemy.y+Enemy.sizeY/2)),5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("IsWalking: "+Player.isWalking,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("IsSprinting: "+Player.isSprinting,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("ColTop: "+Player.nearTop,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("ColLeft: "+Player.nearLeft,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("ColBottom: "+Player.nearBottom,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("ColRight: "+Player.nearRight,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillStyle = "gray";
            fontNewLine += 20; ctx.fillText("MOUSE STATS:",5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("MouseX: "+mouseX,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("MouseY: "+mouseY,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("Click: "+mouseClick,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("Unclick: "+mouseUnclick,5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillStyle = "darkred";
            fontNewLine += 20; ctx.fillText("MISCELLANEOUS:",5,fontNewLine,2000);
            fontNewLine += 20; ctx.fillText("ScreenSide: "+canvasScreenSide,5,fontNewLine,2000);
          //fontNewLine += 20; ctx.fillText("",5,fontNewLine,2000);      <---Here to copy.
        }
    }
    settingsLoop();
    for (let i = 0; i < walls.length; i++) {
        collision(Player,walls[i]);
        wallLoop(walls[i]);
    }
    playerLoop();
    enemyLoop();
    textLoop();
}
//Loops
function menuLoop () { //Menu System
    //Draw Start Button
    if (!pressStart) {
        if (clearCanvas) {
            ctx.clearRect(canX-canX,canY-canY,canX,canY);
        }
        ctx.fillStyle = `rgb(${menuStart.red}, ${menuStart.green}, ${menuStart.blue})`; //`rgb(${})` allows for dynamic color changes
        ctx.fillRect((canX/2)-300,(canY/2)-50,600,100);
        ctx.font = "Bold 70px Consolas";
        ctx.fillStyle = "Green";
        ctx.fillText(menuStart.text,(canX/2)-192.5,(canY/2)+22,385);
    }
    //Start Button Click Logic
    if (
        !pressStart &&
        mouseX > (canX/2)-300 &&
        mouseX < (canX/2)+300 &&
        mouseY > (canY/2)-50 &&
        mouseY < (canY/2)+50 &&
        mouseClick == true
    ) {
        pressStart = true;
        console.log("Press!");
    }
    //Screen Side Changer
    if (changeScreenSide == 0) {
        canvasScreenSide = "center";
    }
    if (changeScreenSide == 1) {
        canvasScreenSide = "right";
    }
    if (changeScreenSide == 2) {
        canvasScreenSide = "center";
    }
    if (changeScreenSide == 3) {
        canvasScreenSide = "left";
    }
    if (changeScreenSide >= 4) {
        changeScreenSide = 0;
    }
    body.style.justifyContent = canvasScreenSide;
}
function mainLoop () { //Frame Loop
    if (pressStart) { //Start Game
        startGame();
    }
    menuLoop();
    mouseTimers();
    console.log("Am I Looping?" //Debug Area
    +"  PressStart:"+pressStart+
    "     NearLeftWall:"+Player.nearLeft+"  NearRightWall:"+Player.nearRight+
    "     WallX:"+walls[0].x+"  WallSize:"+(walls[0].x+walls[0].sizeX)+
    "     XMomentum:"+getMomentumX(Player)+"  YMomentum: "+getMomentumY(Player)
    );
    ctx.font = "25px Consolas";
    ctx.fillStyle = "lightgray";
    ctx.fillText(engineVersion,5,25,500);
    requestAnimationFrame(mainLoop);
}
console.log(engineVersion);
console.log("Resolution: " + canX + "x" + canY);
console.log(minMax(0,255,8000));
mainLoop();

/*Splash Texts
Powered By Milk And Tacos!

*/