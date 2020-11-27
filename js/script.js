
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

    // update(deltaTime, thickness) {
    //     if (this.thickness < thickness)
    //         this.thickness += deltaTime * this.speed;
    // }

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
    running: false
};

// const playerData = {};

// Update game gui
function updateGUI() {
    gui.button.innerHTML = gameData.buttonText;
    gui.currentScore.innerHTML = gameData.scoreCurrent;
    gui.personalBestScore.innerHTML = gameData.scorePersonalBest;
}

// Calculate and return delta time
function getDeltaTime() {
    const currentTime = Date.now();
    let deltaTime = (currentTime - gameData.previousFrameTime) / 1000;

    gameData.previousFrameTime = currentTime;

    return !gameData.previousFrameTime ? 0 : deltaTime;
}

// Clear game screen frame
function clearFrame() {
    gameScreenContext.clearRect(0, 0, gui.gameScreen.clientWidth, gui.gameScreen.clientHeight);
}

// Start running game
function startGame() {
    gameData.buttonText = textsButton[1];
    gameData.running = true;

    new Wall(gui.gameScreen.clientWidth, gui.gameScreen.clientHeight).draw();
    new Obstacle(40, 100, 50, 50).draw();
    new Obstacle(300, 450, 50, 50).draw();
    new Obstacle(550, 300, 50, 50).draw();
    new Token(90, 50, 25, 25).draw();
    new Player(30, 500, 50, 70).draw();
}

updateGUI();

gui.button.addEventListener('click', function() {
    if (this.innerHTML === 'start') {
        startGame();
        updateGUI();
    }
});
