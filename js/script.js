
const gui = {
    currentScore: document.querySelector('#scorecrnt'),
    personalBestScore: document.querySelector('#scorepb'),
    button: document.querySelector('button'),
    gameScreen: document.querySelector('canvas'),
    overlay: document.querySelector('.overlay')
};

const gameScreenContext = gui.gameScreen.getContext('2d');

class Wall {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.thickness = 10;
    }

    draw() {
        gameScreenContext.beginPath();
        gameScreenContext.lineWidth = this.thickness;
        gameScreenContext.strokeStyle = "#000";
        gameScreenContext.rect(this.x, this.y, this.width, this.height);
        gameScreenContext.stroke();
    }
}

class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        gameScreenContext.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Token {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        gameScreenContext.fillStyle = '#f1c40f';
        gameScreenContext.fillRect(this.x, this.y, this.width, this.height);
        gameScreenContext.fillStyle = '#000';
    }

    spawnRandom(gameObjects) {

        // dejau
        let x = 0;
        let y = 0;

        x = Math.floor(Math.random() * gui.gameScreen.clientWidth);
        y = Math.floor(Math.random() * gui.gameScreen.clientHeight);
        
        if (x < 50 && x < gui.gameScreen.clientWidth)
            x = Math.floor(Math.random() * gui.gameScreen.clientWidth);
    
        if (y < 50 && y < gui.gameScreen.clientHeight)
            y = Math.floor(Math.random() * gui.gameScreen.clientHeight);

        this.x = x;
        this.y = y;
    }
}

class Player {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    update(deltaTime, direction) {
        switch (direction) {
            case 'left':
                this.x -= deltaTime * this.speed;
                break;
            case 'right':
                this.x += deltaTime * this.speed;
                break;
            case 'forwards':
                this.y -= deltaTime * this.speed;
                break;
            case 'backwards':
                this.y += deltaTime * this.speed;
                break;
        }
    }

    draw() {
        gameScreenContext.fillStyle = '#e74c3c';
        gameScreenContext.fillRect(this.x, this.y, this.width, this.height);
        gameScreenContext.fillStyle = '#000';
    }

    collidedWith(object) {
        return (
            this.x + this.width > object.x &&
            object.x + object.width > this.x &&
            this.y + this.height > object.y &&
            object.y + object.height > this.y
        );
    }
}

const textsButton = ['start', 'restart', 'new game'];

const startingPos = {
    player: { x: 30, y: 500 },
    token: { x: 90, y: 50 }
};

const gameData = {
    scoreCurrent: 0,
    scorePersonalBest: 0,
    buttonText: textsButton[0],
    previousFrameTime: 0,
    running: false,
    deltaTime: 0,

    objects: {
        wall: new Wall(gui.gameScreen.clientWidth, gui.gameScreen.clientHeight),
        obstacles: [
            new Obstacle(40, 100, 50, 50),
            new Obstacle(300, 450, 50, 50),
            new Obstacle(550, 300, 50, 50)
        ],
        token: new Token(90, 50, 25, 25),
        player: new Player(30, 500, 50, 70, 300)
    },

    isPlayerMoving: false,
    playerMoveDirection: ''
};

// const playerData = {};

// New game screen frame
function frame() {
    if (gameData.running) {
        updateGUI();
        updateGameData();
        clearFrame();
        drawFrame();

        window.requestAnimationFrame(frame);
    }
}

// Edit overlay text and color
function editOverlay(text, color) {
    gui.overlay.innerHTML = text;
    gui.overlay.style.color = color;
}

// Update game gui
function updateGUI() {
    gui.button.innerHTML = gameData.buttonText;
    gui.currentScore.innerHTML = gameData.scoreCurrent;
    gui.personalBestScore.innerHTML = gameData.scorePersonalBest;
}

// Update game data
function updateGameData() {
    getDeltaTime();

    if (gameData.isPlayerMoving && gameData.running) {
        gameData.objects.player.update(gameData.deltaTime, gameData.playerMoveDirection);

        if (gameData.objects.player.collidedWith(gameData.objects.token)) {
            let tokenSpawnAvoidObjects = [gameData.objects.player];

            for (let i = 0; i < gameData.objects.obstacles.length; i++)
                tokenSpawnAvoidObjects.push(gameData.objects.obstacles[i]);

            gameData.objects.token.spawnRandom(tokenSpawnAvoidObjects);

            gameData.scoreCurrent += 1;

            if (gameData.scorePersonalBest < gameData.scoreCurrent)
                gameData.scorePersonalBest = gameData.scoreCurrent;
        } else if (
            gameData.objects.player.collidedWith(gameData.objects.obstacles[0]) ||
            gameData.objects.player.collidedWith(gameData.objects.obstacles[1]) ||
            gameData.objects.player.collidedWith(gameData.objects.obstacles[2]) ||
            gameData.objects.player.collidedWith({x:0, y:0, width:10, height:gui.gameScreen.clientHeight}) ||
            gameData.objects.player.collidedWith({x:0, y:0, width:gui.gameScreen.clientHeight, height:10}) ||
            gameData.objects.player.collidedWith({x:gui.gameScreen.clientWidth - 10, y:0, width: 10, height: gui.gameScreen.clientHeight}) ||
            gameData.objects.player.collidedWith({x:0, y:gui.gameScreen.clientHeight - 10, width: gui.gameScreen.clientWidth, height: 10})
        ) {
            playerLost();
        }
    }
}

// Calculate and set delta time
function getDeltaTime() {
    const currentTime = Date.now();
    let deltaTime = (currentTime - gameData.previousFrameTime) / 1000;

    !gameData.previousFrameTime ? gameData.deltaTime = 0 : gameData.deltaTime = deltaTime;

    gameData.previousFrameTime = currentTime;
}

// Draw game screen frame
function drawFrame() {
    if (gameData.running) {
        gameData.objects.wall.draw();
        gameData.objects.token.draw();
        gameData.objects.player.draw();
    
        for (let o of gameData.objects.obstacles) {
            o.draw();
        }
    }
}

// Clear game screen frame
function clearFrame() {
    gameScreenContext.clearRect(0, 0, gui.gameScreen.clientWidth, gui.gameScreen.clientHeight);
}

// Start running game
function startGame() {
    if (gameData.running) {
        gameData.buttonText = textsButton[1];
    
        frame();
    }
}

// If player is being drawn horizontally - draw vertically, and vice versa
function changePlayerAxisDraw() {
    let tempPlayerWidth = 0;
    tempPlayerWidth = gameData.objects.player.width;
    gameData.objects.player.width = gameData.objects.player.height;
    gameData.objects.player.height = tempPlayerWidth;
}

// Move player
function playerMove(axis, direction) {
    if (axis === 'vertical' && gameData.objects.player.width > gameData.objects.player.height)
        changePlayerAxisDraw();
    else if (axis === 'horizontal' && gameData.objects.player.width < gameData.objects.player.height)
        changePlayerAxisDraw();

    gameData.isPlayerMoving = true;
    gameData.playerMoveDirection = direction;
}

function playerLost() {
    gameData.running = false;
    editOverlay('GAME OVER', '#e74c3c');
    gui.button.innerHTML = textsButton[2];
}

editOverlay('Movement: WASD / Arrow keys', '#bdc3c7');
updateGUI();

gui.button.addEventListener('click', function() {
    if (this.innerHTML === 'start') {
        gameData.objects.player.speed = 300;

        gameData.running = true;
        gui.overlay.innerHTML = '';
        startGame();
        updateGUI();
    } else if (this.innerHTML === 'new game' || this.innerHTML === 'restart') {
        gameData.objects.player.speed = 300;

        gameData.scoreCurrent = 0;
        gameData.objects.player.x = startingPos.player.x;
        gameData.objects.player.y = startingPos.player.y;
        gameData.objects.token.x = startingPos.token.x;
        gameData.objects.token.y = startingPos.token.y;

        gameData.running = true;
        gui.overlay.innerHTML = '';
        startGame();
        updateGUI();
    }
});

document.body.addEventListener('keydown', (e) => {
    if (gameData.running) {
        if (e.key === 'w' || e.key === 'ArrowUp')
            playerMove('vertical', 'forwards');
        else if (e.key === 'a' || e.key === 'ArrowLeft')
            playerMove('horizontal', 'left');
        else if (e.key === 's' || e.key === 'ArrowDown')
            playerMove('vertical', 'backwards');
        else if (e.key === 'd' || e.key === 'ArrowRight')
            playerMove('horizontal', 'right');
    }
});

document.body.addEventListener('keyup', () => {
    gameData.isPlayerMoving = false;
});

setInterval(() => { gameData.objects.player.speed += 5; }, 1000);
