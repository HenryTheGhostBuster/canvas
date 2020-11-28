
const gui = {
    currentScore: document.querySelector('#scorecrnt'),
    personalBestScore: document.querySelector('#scorepb'),
    button: document.querySelector('button'),
    gameScreen: document.querySelector('canvas')
};

const gameScreenContext = gui.gameScreen.getContext('2d');

class Wall {
    constructor(width, height, speed) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.thickness = 20;
    }

    update(deltaTime, thickness) {
        if (this.thickness < thickness)
            this.thickness += deltaTime * this.speed;
    }

    draw() {
        gameScreenContext.beginPath();
        gameScreenContext.lineWidth = String(this.thickness);
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
}

const textsButton = ['start', 'restart', 'new game'];

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
    updateGUI();
    updateGameData();
    clearFrame();
    drawFrame();

    window.requestAnimationFrame(frame);
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

    if (gameData.isPlayerMoving)
        gameData.objects.player.update(gameData.deltaTime, gameData.playerMoveDirection);
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
    gameData.objects.wall.draw();
    gameData.objects.token.draw();
    gameData.objects.player.draw();

    for (let o of gameData.objects.obstacles) {
        o.draw();
    }
}

// Clear game screen frame
function clearFrame() {
    gameScreenContext.clearRect(0, 0, gui.gameScreen.clientWidth, gui.gameScreen.clientHeight);
}

// Start running game
function startGame() {
    gameData.buttonText = textsButton[1];
    gameData.running = true;

    frame();
}

updateGUI();

gui.button.addEventListener('click', function() {
    if (this.innerHTML === 'start') {
        startGame();
        updateGUI();
    }
});

document.body.addEventListener('keydown', (e) => {
    let tempPlayerWidth = 0;

    switch (e.key) {
        case 'w':
            if (gameData.objects.player.width > gameData.objects.player.height) {
                tempPlayerWidth = gameData.objects.player.width;
                gameData.objects.player.width = gameData.objects.player.height;
                gameData.objects.player.height = tempPlayerWidth;
            }

            gameData.isPlayerMoving = true;
            gameData.playerMoveDirection = 'forwards';
            break;
        case 'a':
            if (gameData.objects.player.width < gameData.objects.player.height) {
                tempPlayerWidth = gameData.objects.player.width;
                gameData.objects.player.width = gameData.objects.player.height;
                gameData.objects.player.height = tempPlayerWidth;
            }
            
            gameData.isPlayerMoving = true;
            gameData.playerMoveDirection = 'left';
            break;
        case 's':
            if (gameData.objects.player.width > gameData.objects.player.height) {
                tempPlayerWidth = gameData.objects.player.width;
                gameData.objects.player.width = gameData.objects.player.height;
                gameData.objects.player.height = tempPlayerWidth;
            }
            
            gameData.isPlayerMoving = true;
            gameData.playerMoveDirection = 'backwards';
            break;
        case 'd':
            if (gameData.objects.player.width < gameData.objects.player.height) {
                tempPlayerWidth = gameData.objects.player.width;
                gameData.objects.player.width = gameData.objects.player.height;
                gameData.objects.player.height = tempPlayerWidth;
            }
            
            gameData.isPlayerMoving = true;
            gameData.playerMoveDirection = 'right';
            break;
    }
});

document.body.addEventListener('keyup', () => {
    gameData.isPlayerMoving = false;
});
