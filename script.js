let player1Score = 0; // Initialize score for Player 1
let player2Score = 0; // Initialize score for Player 2
let currentPlayer = 1; // Set the current player (1 for Player 1, 2 for Player 2)
let twoPlayerMode = false; // Flag to indicate if the game is in two-player mode
let player1Name = "Player 1"; // Default name for Player 1
let player2Name = "Player 2"; // Default name for Player 2
let cardValues = ["🐸", "🐶", "🐻", "🦊", "🐰", "🐱"]; // Array of animal emojis used as card values
let selectedCards = []; // Array to keep track of the selected card indices
let gameBoard = []; // Array to represent the game board with card objects
let timerInterval; // Variable to hold the timer interval ID

// Load animal sounds associated with each card value
const animalSounds = {
    "🐸": new Audio("sounds/Frog.mp3"),
    "🐶": new Audio("sounds/Dog.mp3"),
    "🐻": new Audio("sounds/Bear.mp3"),
    "🦊": new Audio("sounds/Fox.mp3"),
    "🐰": new Audio("sounds/Rabbit.mp3"),
    "🐱": new Audio("sounds/Cat.mp3")
};

function selectMode(mode) {
    twoPlayerMode = (mode === 2); // Set twoPlayerMode based on whether the selected mode is 2-player
    document.querySelector("main section").style.display = "none"; // Hide game mode selection section
    document.getElementById("playerNameSections").style.display = "block"; // Show player name input section
    document.getElementById("player2Name").style.display = twoPlayerMode ? "block" : "none"; // Show Player 2 name input if in two-player mode
}

function startGame() {
    player1Score = 0; // Reset Player 1 score
    player2Score = 0; // Reset Player 2 score
    currentPlayer = 1; // Set current player to Player 1

    // Capture player names from input fields or use default names if input is empty
    player1Name = document.getElementById("player1Name").value || "Player 1";
    player2Name = document.getElementById("player2Name").value || "Player 2";

    document.getElementById("playerNameSections").style.display = "none"; // Hide player name input section
    document.getElementById("scoreboard").style.display = "block"; // Show scoreboard
    document.getElementById("timer").style.display = "block"; // Show timer

    // Update scoreboard text with player names and initial scores
    document.getElementById("scoreboard").innerText = twoPlayerMode 
        ? player1Name + ": 0 | " + player2Name + ": 0"
        : "Score: 0";

    startTimer(180); // Start timer for 180 seconds
    setupGameBoard(); // Set up the game board with shuffled cards
}

function startTimer(duration) {
    let timeRemaining = duration; // Initialize remaining time to the specified duration
    const timerElement = document.getElementById("timer"); // Get timer element

    clearInterval(timerInterval); // Clear any existing timer interval

    // Start new interval for countdown timer
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60); // Calculate minutes
        const seconds = timeRemaining % 60; // Calculate seconds
        // Update timer display with formatted time
        timerElement.innerText = "Time Left: " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

        if (timeRemaining <= 0) { // When time runs out
            clearInterval(timerInterval); // Stop the timer
            endGame(); // End the game
        }
        timeRemaining--; // Decrement remaining time by 1 second
    }, 1000); // Repeat every 1 second
}

function endGame() {
    // Determine winner based on scores or declare a tie
    const winner = player1Score > player2Score ? player1Name + " wins!" 
                : player1Score < player2Score ? player2Name + " wins!" 
                : "It's a tie!";
    
    document.getElementById("result").innerText = winner; // Display result on the page
    alert(winner); // Show an alert with the winner message
    document.getElementById("restartButton").style.display = "block"; // Show restart button
}

function setupGameBoard() {
    const cardPairs = [...cardValues, ...cardValues]; // Create pairs of cards by duplicating card values
    cardPairs.sort(() => Math.random() - 0.5); // Randomly shuffle card pairs
    gameBoard = cardPairs.map(value => ({
        value: value,
        flipped: false // Initialize all cards as unflipped
    }));
    renderBoard(); // Render the game board on the page
}

function renderBoard() {
    const board = document.getElementById("gameBoard"); // Get game board element
    board.innerHTML = ""; // Clear existing board content
    gameBoard.forEach((card, index) => {
        const cardElement = document.createElement("span"); // Create a span element for each card
        cardElement.innerText = card.flipped ? card.value : "🃏"; // Show card value if flipped, otherwise show a placeholder
        cardElement.className = "card"; // Assign a CSS class for styling
        cardElement.onclick = () => flipCard(index); // Set click event to flip card
        board.appendChild(cardElement); // Add card element to the game board
    });
}

function flipCard(index) {
    if (gameBoard[index].flipped || selectedCards.length >= 2) return; // If card is already flipped or 2 cards are selected, ignore click
    gameBoard[index].flipped = true; // Flip the selected card
    selectedCards.push(index); // Add selected card index to the array
    renderBoard(); // Update the board to show the flipped card
    if (selectedCards.length === 2) {
        setTimeout(checkMatch, 1000); // After 1 second, check for a match
    }
}

function checkMatch() {
    const [firstIndex, secondIndex] = selectedCards; // Retrieve indices of selected cards
    if (gameBoard[firstIndex].value === gameBoard[secondIndex].value) { // If card values match
        if (animalSounds[gameBoard[firstIndex].value]) { // Check if there's a sound for this card
            animalSounds[gameBoard[firstIndex].value].play(); // Play sound for the matched card
        }
        if (twoPlayerMode) { // Update score based on current player
            currentPlayer === 1 ? player1Score++ : player2Score++;
        } else {
            player1Score++; // Single-player mode
        }
    } else { // If cards don’t match
        setTimeout(() => { // Delay for 1 second before flipping cards back
            gameBoard[firstIndex].flipped = false; // Unflip first card
            gameBoard[secondIndex].flipped = false; // Unflip second card
            if (twoPlayerMode) currentPlayer = currentPlayer === 1 ? 2 : 1; // Switch players in two-player mode
            renderBoard(); // Update board
        }, 1000);
    }

    selectedCards = []; // Clear selected cards
    document.getElementById("scoreboard").innerText = twoPlayerMode 
        ? player1Name + ": " + player1Score + " | " + player2Name + ": " + player2Score
        : "Score: " + player1Score; // Update scoreboard
    renderBoard(); // Refresh board
    checkGameOver(); // Check if game is over
}

function checkGameOver() {
    if (gameBoard.every(card => card.flipped)) { // If all cards are flipped
        endGame(); // End game
    }
}

function restartGame() {
    player1Score = 0; // Reset Player 1 score
    player2Score = 0; // Reset Player 2 score
    currentPlayer = 1; // Set current player to Player 1
    selectedCards = []; // Clear selected cards
    gameBoard = []; // Reset game board
    document.getElementById("result").innerText = ""; // Clear result message
    document.getElementById("restartButton").style.display = "none"; // Hide restart button
    document.getElementById("scoreboard").style.display = "block"; // Show scoreboard
    document.getElementById("timer").style.display = "block"; // Show timer
    startTimer(180); // Start timer for 180 seconds
    setupGameBoard(); // Set up new game board
}
