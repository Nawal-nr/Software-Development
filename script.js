let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;
let twoPlayerMode = false;
let player1Name = "Player 1";
let player2Name = "Player 2";
let cardValues = ["🐸", "🐶", "🐻", "🦊", "🐰", "🐱"];
let selectedCards = [];
let gameBoard = [];
let countdown;
let timeLeft = 35; // Timer set to 35 seconds

function selectMode(mode) {
    twoPlayerMode = (mode === 2);
    document.querySelector("main section").style.display = "none";
    document.getElementById("playerNameSections").style.display = "block";
    document.getElementById("player2Name").style.display = twoPlayerMode ? "block" : "none";
}

function startGame() {
    player1Name = document.getElementById("player1Name").value || "Player 1";
    player2Name = document.getElementById("player2Name").value || "Player 2";
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    
    document.getElementById("playerNameSections").style.display = "none";
    document.getElementById("scoreboard").style.display = "block";
    document.getElementById("timer").style.display = "block";
    document.getElementById("scoreboard").innerText = twoPlayerMode 
        ? `${player1Name}: 0 | ${player2Name}: 0`
        : "Score: 0";

    countdown = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdown);
            endGame();
        } else {
            document.getElementById("timer").textContent = `Time Left: ${timeLeft} seconds`;
            timeLeft--;
        }
    }, 1000);

    setupGameBoard();
}

function setupGameBoard() {
    const cardPairs = [...cardValues, ...cardValues];
    cardPairs.sort(() => Math.random() - 0.5);
    gameBoard = cardPairs.map(value => ({
        value: value,
        flipped: false
    }));
    renderBoard();
}

function renderBoard() {
    const board = document.getElementById("gameBoard");
    board.innerHTML = "";
    gameBoard.forEach((card, index) => {
        const cardElement = document.createElement("span");
        cardElement.innerText = card.flipped ? card.value : "🃏";
        cardElement.className = "card";
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
        currentPlayer = twoPlayerMode ? (currentPlayer === 1 ? 2 : 1) : currentPlayer;
    }

    selectedCards = [];
    updateScoreboard();
    renderBoard();
}

function updateScoreboard() {
    if (twoPlayerMode) {
        document.getElementById("scoreboard").innerText = `${player1Name}: ${player1Score} | ${player2Name}: ${player2Score}`;
    } else {
        document.getElementById("scoreboard").innerText = `Score: ${player1Score}`;
    }
}

function endGame() {
    document.getElementById("timer").textContent = "Time's up!";
    document.getElementById("restartButton").style.display = "block";
    // Add logic to display the winner in two-player mode or score in single-player mode
}

function restartGame() {
    clearInterval(countdown);
    timeLeft = 35; // Reset timer to 35 seconds
    player1Score = 0;
    player2Score = 0;
    selectedCards = [];
    gameBoard = [];
    currentPlayer = 1;
    document.getElementById("restartButton").style.display = "none";
    document.getElementById("timer").textContent = `Time Left: ${timeLeft} seconds`;
    startGame();
}
