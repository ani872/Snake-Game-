let board = document.getElementById('board');
let foodX;
let foodY;
let SnakeBody = [];
let SnakeX = 3;
let SnakeY = 5;
let velocityX = 0;
let velocityY = 0;
let gameOver = false;
let SetIntervalId;
let score = 0;
let bestScore = localStorage.getItem('snakeBest') || 0;


let gameOverSound = new Audio('assets/gameOver.mp3');
let eatSound = new Audio('assets/eat.mp3');
let turnSound = new Audio('assets/turn.mp3');

// Update score display
document.getElementById('best-score').textContent = bestScore;

function randomFoodPosition() {
    foodX = Math.floor(Math.random() * 14) + 1;
    foodY = Math.floor(Math.random() * 14) + 1;
}

// BUG FIX: movesnake should only change direction, NOT call main()

function movesnake(e) {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
        turnSound.currentTime = 0;
        turnSound.play();
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
        turnSound.currentTime = 0;
        turnSound.play();
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
        turnSound.currentTime = 0;
        turnSound.play();
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
        turnSound.currentTime = 0;
        turnSound.play();
    }
  
}


let ctrlBtns = document.querySelectorAll('.ctrl-btn');
ctrlBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        if (btn.dataset.key === 'reset') {
            reset();
            return;
        }
        movesnake({ key: btn.dataset.key });
    });
});

function showGameOver() {
    clearInterval(SetIntervalId);
    gameOver = true;
    gameOverSound.play();
    document.removeEventListener('keydown', movesnake);
    turnSound.pause();

    // Save best score
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('snakeBest', bestScore);
        document.getElementById('best-score').textContent = bestScore;
    }

    document.getElementById('final-score').textContent = score;
    document.getElementById('gameOverOverlay').classList.add('show');
}

function main() {
    if (gameOver) {
        return showGameOver();
    }

    // Food eaten
    if (SnakeX === foodX && SnakeY === foodY) {
        randomFoodPosition();
        eatSound.currentTime = 0;
        eatSound.play();
        SnakeBody.push([foodY, foodX]);
        score++;
        document.getElementById('score').textContent = score;
    }

  
    for (let i = SnakeBody.length - 1; i > 0; i--) {
        SnakeBody[i] = SnakeBody[i - 1];
    }

   
    SnakeX += velocityX;
    SnakeY += velocityY;


    if (SnakeX <= 0 || SnakeX > 14 || SnakeY <= 0 || SnakeY > 14) {
        gameOver = true;
        return showGameOver();
    }

    SnakeBody[0] = [SnakeY, SnakeX];


    for (let i = 1; i < SnakeBody.length; i++) {
        if (SnakeBody[0][0] === SnakeBody[i][0] && SnakeBody[0][1] === SnakeBody[i][1]) {
            gameOver = true;
        }
    }

 
    let setHtml = `<div class="food" style="grid-area: ${foodY}/${foodX};"></div>`;

    for (let i = 0; i < SnakeBody.length; i++) {
        setHtml += `<div class="${i === 0 ? 'snake-head' : 'snake-body'}" 
                         id="div-${i}" 
                         style="grid-area: ${SnakeBody[i][0]}/${SnakeBody[i][1]};"></div>`;
    }

    board.innerHTML = setHtml;
}


randomFoodPosition();
main();
SetIntervalId = setInterval(main, 200);
document.addEventListener('keydown', movesnake);

function reset() {
    location.reload();
}
