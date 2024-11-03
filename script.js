// Initialize variables for player names, scores, and game mode
let player1Name, player2Name; // To hold player names
let player1Score = 0; // Player 1's score
let player2Score = 0; // Player 2's score
let currentPlayer = 1; // Track the current player (1 or 2)
let twoPlayerMode = false; // Flag to indicate if the game is in two-player mode
let gameBoard = []; // Array to hold the game cards
let selectedCards = []; // Array to hold the cards currently selected
let countdown; // Variable to hold the countdown timer
let timeLeft = 35; // Initial time left for the game (set to 35 seconds)

// Animal emoji and associated sound files for each card
const cardValues = ['🐶', '🐱', '🐰', '🦊', '🐼', '🐨', '🐸', '🦁']; // Emojis to represent animals
const sounds = {
    '🐶': new Audio('sounds/dog.mp3'),
    '🐱': new Audio('sounds/cat.mp3'),
    '🐰': new Audio('sounds/rabbit.mp3'),
    '🦊': new Audio('sounds/fox.mp3'),
    '🐼': new Audio('sounds/panda.mp3'),
    '🐨': new Audio('sounds/koala.mp3'),
    '🐸': new Audio('sounds/frog.mp3'),
    '🦁': new Audio('sounds/lion.mp3')
};

// Function to select the game mode (1 player or 2 players)
function selectMode(mode) {
    twoPlayerMode = (mode === 2); // Set `twoPlayerMode` to true if 2 players are selected
    document.querySelector("main section").style.display = "none"; // Hide the initial section
    document.getElementById("playerNameSections").style.display = "block"; // Show the name entry section
    document.getElementById("player2Name").style.display = twoPlayerMode ? "block" : "none"; // Show or hide Player 2 input based on mode
}

// Function to start the game
function startGame() {
    // Capture player names or use defaults if no names are provided
    player1Name = document.getElementById("player1Name").value || "Player 1"; 
    player2Name = document.getElementById("player2Name").value || "Player 2"; 

    // Reset scores and scoreboard display
    player1Score = 0; 
    player2Score = 0; 
    document.getElementById("scoreboard").innerText = twoPlayerMode 
        ? `${player1Name}: ${player1Score} | ${player2Name}: ${player2Score}` 
        : `Score: ${player1Score}`; 

    // Initialize the countdown timer
    countdown = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdown); // Stop the timer when time runs out
            endGame(); // Call `endGame` function to handle game end
        } else {
            document.getElementById("timer").textContent = `Time Left: ${timeLeft} seconds`; // Update timer display
            timeLeft--; // Decrease time left
        }
    }, 1000); // Update timer every second

    setupGameBoard(); // Initialize the game board
}

// Function to set up the game board
function setupGameBoard() {
    // Create an array with pairs of animal emojis
    const cardPairs = [...cardValues, ...cardValues]; 

    // Shuffle the cards randomly using the Fisher-Yates algorithm
    for (let i = cardPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
        [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]]; // Swap elements to shuffle
    }

    // Create card elements for the game board
    gameBoard = cardPairs.map(value => {
        const card = document.createElement("div"); // Create a card element
        card.classList.add("card"); // Add 'card' class for styling
        card.dataset.value = value; // Store the animal emoji in a data attribute
        card.onclick = flipCard; // Set up click event to flip the card
        return card; // Return the card element for the board
    });

    // Append the cards to the game board section in the HTML
    const gameBoardElement = document.getElementById("gameBoard");
    gameBoardElement.innerHTML = ""; // Clear any existing content
    gameBoard.forEach(card => gameBoardElement.appendChild(card)); // Add each card to the game board

    // Use a question mark to indicate face-down cards
    gameBoard.forEach(card => card.innerText = "❓"); 
}

// Function to flip a card and reveal its value
function flipCard() {
    // Prevent flipping matched or already selected cards
    if (selectedCards.includes(this) || this.classList.contains("matched")) return; 

    this.innerText = this.dataset.value; // Display the animal emoji on the card
    selectedCards.push(this); // Add the card to the selected cards array
    sounds[this.dataset.value].play(); // Play the corresponding animal sound

    // If two cards are selected, check for a match after a delay
    if (selectedCards.length === 2) {
        setTimeout(checkMatch, 1000); // Delay the match check to allow users to see the second card
    }
}

// Function to check if the selected cards match
function checkMatch() {
    const [firstCard, secondCard] = selectedCards; // Destructure selected cards

    if (firstCard.dataset.value === secondCard.dataset.value) {
        // Increment the score of the current player if they match
        if (currentPlayer === 1) {
            player1Score++; // Increment Player 1's score
        } else {
            player2Score++; // Increment Player 2's score
        }

        // Update scoreboard display after a successful match
        document.getElementById("scoreboard").innerText = twoPlayerMode 
            ? `${player1Name}: ${player1Score} | ${player2Name}: ${player2Score}` 
            : `Score: ${player1Score}`; // Display updated scores

        firstCard.classList.add("matched"); // Add 'matched' class to matched cards
        secondCard.classList.add("matched");
    } else {
        // Flip back if no match is found
        firstCard.innerText = "❓"; 
        secondCard.innerText = "❓";
        currentPlayer = currentPlayer === 1 ? 2 : 1; // Switch players if there's no match
    }

    selectedCards = []; // Clear the selected cards for the next turn
}

// Function to handle the end of the game
function endGame() {
    let winnerMessage = ''; // Variable to hold the winner message
    // Determine the winner based on scores
    if (player1Score > player2Score) {
        winnerMessage = `${player1Name} wins! 🎉`; // Player 1 wins
    } else if (player1Score < player2Score) {
        winnerMessage = `${player2Name} wins! 🎉`; // Player 2 wins
    } else {
        winnerMessage = "It's a tie! 🤝"; // No winner, game is tied
    }

    // Display final results and the restart button
    alert(`Time's up!\n${winnerMessage}\nFinal Scores:\n${player1Name}: ${player1Score}\n${player2Name}: ${player2Score}`);
    document.getElementById("restartButton").style.display = "block"; // Show restart button
}

// Function to restart the game
function restartGame() {
    clearInterval(countdown); // Stop the countdown timer
    timeLeft = 35; // Reset timer to 35 seconds
    player1Score = 0; // Reset Player 1 score
    player2Score = 0; // Reset Player 2 score
    selectedCards = []; // Clear selected cards array
    gameBoard = []; // Reset game board
    currentPlayer = 1; // Reset to Player 1
    document.getElementById("restartButton").style.display = "none"; // Hide restart button
    document.getElementById("timer").textContent = `Time Left: ${timeLeft} seconds`; // Reset timer display
    startGame(); // Start a new game
}
