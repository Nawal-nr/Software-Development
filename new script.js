let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;
let twoPlayerMode = false;
let cardValues = ["🐸", "🐶", "🐻", "🦊", "🐰", "🐱"];
let selectedCards = [];
let gameBoard = [];
let timer;
let timeLeft = 35;

function selectMode(mode) {
    twoPlayerMode = (mode === 2);
    document.querySelector('main section').style.display = 'none';
    document.getElementById('playerNameSections').style.display = 'block';
    document.getElementById('player2Name').style.display = twoPlayerMode ? 'block' : 'none';
}

function startGame() {
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    document.getElementById('playerNameSections').style.display = 'none';
    document.getElementById('scoreboard').style.display = 'block';
    document.getElementById('scoreboard').innerText = twoPlayerMode
        ? "Player 1: 0 | Player 2: 0"
        : "Score: 0";
    document.getElementById('result').innerText = '';
    document.getElementById('restartButton').style.display = 'none';
    startTimer();
    setupGameBoard();
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 35;
    document.getElementById('timer').innerText = `Timer: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Timer: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame("The timer ran out!");
        }
    }, 1000);
}

function endGame(message) {
    alert(message);
    document.getElementById('result').innerText = message;
    document.getElementById('gameBoard').innerHTML = '';
    document.getElementById('restartButton').style.display = 'block';
}

function restartGame() {
    document.getElementById('result').innerText = '';
    document.getElementById('restartButton').style.display = 'none';
    startGame();
}

function setupGameBoard() {
    const cardPairs = [...cardValues, ...cardValues];
    cardPairs.sort(() => Math.random() - 0.5);
    gameBoard = cardPairs.map(value => ({ value: value, flipped: false }));
    renderBoard();
}

function renderBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    gameBoard.forEach((card, index) => {
        const cardElement = document.createElement('span');
        cardElement.innerText = card.flipped ? card.value : '🃏';
        cardElement.className = 'card';
        cardElement.onclick = () => flipCard(index);
        board.appendChild(cardElement);
    });
}

function flipCard(index) {
    if (gameBoard[index].flipped || selectedCards.length >= 2) return;
    gameBoard[index].flipped = true;
    selectedCards.push(index);
    renderBoard();
    if (selectedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const [firstIndex, secondIndex] = selectedCards;
    if (gameBoard[firstIndex].value === gameBoard[secondIndex].value) {
        if (twoPlayerMode) {
            currentPlayer === 1 ? player1Score++ : player2Score++;
        } else {
            player1Score++;
        }
    } else {
        gameBoard[firstIndex].flipped = false;
        gameBoard[secondIndex].flipped = false;
        if (twoPlayerMode) currentPlayer = currentPlayer === 1 ? 2 : 1;
    }
    selectedCards = [];
    document.getElementById('scoreboard').innerText = twoPlayerMode
        ? `Player 1: ${player1Score} | Player 2: ${player2Score}`
        : `Score: ${player1Score}`;
    renderBoard();
    checkGameOver();
}

function checkGameOver() {
    if (gameBoard.every(card => card.flipped)) {
        clearInterval(timer);
        const winner = player1Score > player2Score
            ? "Player 1 wins!"
            : player1Score < player2Score
                ? "Player 2 wins!"
                : "It's a draw!";
        endGame(winner);
    }
}
