let player1Score = 0; // Initialize score for player 1
let player2Score = 0; // Initialize score for player 2
let currentPlayer = 1; // Set the current player (1 for Player 1, 2 for Player 2)
let twoPlayerMode = false; // Flag to indicate if the game is in two-player mode
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

function selectMode(mode) { // Function to select game mode
    twoPlayerMode = (mode === 2); // Set twoPlayerMode based on the selected mode
    document.querySelector('main section').style.display = 'none'; // Hide the game mode selection section
    document.getElementById('playerNameSections').style.display = 'block'; // Show the player name input section
    document.getElementById('player2Name').style.display = twoPlayerMode ? 'block' : 'none'; // Show/hide Player 2 name input
}

function startGame() { // Function to start the game
    player1Score = 0; // Reset Player 1 score
    player2Score = 0; // Reset Player 2 score
    currentPlayer = 1; // Reset to Player 1

    document.getElementById('playerNameSections').style.display = 'none'; // Hide the player name section
    document.getElementById('scoreboard').style.display = 'block'; // Show the scoreboard
    document.getElementById('timer').style.display = 'block'; // Show the timer

    if (twoPlayerMode) { // Check if in two-player mode
        document.getElementById('scoreboard').innerText = "Player 1: 0 | Player 2: 0"; // Initialize scoreboard
    } else {
        document.getElementById('scoreboard').innerText = "Score: 0"; // Initialize scoreboard for single-player
    }

    startTimer(180); // Start the timer with a duration of 180 seconds
    setupGameBoard(); // Set up the game board with shuffled cards
}

function startTimer(duration) { // Function to start the countdown timer
    let timeRemaining = duration; // Set time remaining to the specified duration
    const timerElement = document.getElementById('timer'); // Get the timer element

    clearInterval(timerInterval); // Clear any existing timer interval

    timerInterval = setInterval(() => { // Start a new interval
        const minutes = Math.floor(timeRemaining / 60); // Calculate minutes
        const seconds = timeRemaining % 60; // Calculate seconds
        timerElement.innerText = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Update the timer display

        if (timeRemaining <= 0) { // Check if time has run out
            clearInterval(timerInterval); // Stop the timer
            endGame(); // Call the endGame function
        }
        timeRemaining--; // Decrease time remaining by 1 second
    }, 1000); // Execute every 1000 milliseconds (1 second)
}

function endGame() { // Function to end the game
    const winner = player1Score > player2Score ? "Player 1 wins!" // Determine the winner
                : player1Score < player2Score ? "Player 2 wins!" 
                : "It's a tie!"; // Determine if it's a tie
    document.getElementById('result').innerText = winner; // Display the result
    alert(winner); // Show an alert with the winner message
    document.getElementById('restartButton').style.display = 'block'; // Show the restart button
}

function setupGameBoard() { // Function to set up the game board
    const cardPairs = [...cardValues, ...cardValues]; // Create pairs of cards by duplicating cardValues
    cardPairs.sort(() => Math.random() - 0.5); // Shuffle the card pairs randomly
    gameBoard = cardPairs.map(value => ({ // Create the game board as an array of card objects
        value: value,
        flipped: false // Initially set all cards to not flipped
    }));
    renderBoard(); // Render the game board
}

function renderBoard() { // Function to render the game board
    const board = document.getElementById('gameBoard'); // Get the game board element
    board.innerHTML = ''; // Clear the board's inner HTML
    gameBoard.forEach((card, index) => { // Loop through each card
        const cardElement = document.createElement('span'); // Create a new span element for the card
        cardElement.innerText = card.flipped ? card.value : '🃏'; // Set text to card value if flipped, else show a placeholder
        cardElement.className = 'card'; // Set the class name for styling
        cardElement.onclick = () => flipCard(index); // Add click event to flip the card
        board.appendChild(cardElement); // Add the card element to the game board
    });
}

function flipCard(index) { // Function to flip a card at a given index
    if (gameBoard[index].flipped || selectedCards.length >= 2) return; // Prevent flipping if already flipped or two cards are selected
    gameBoard[index].flipped = true; // Mark the card as flipped
    selectedCards.push(index); // Add the index to the selected cards array
    renderBoard(); // Render the board to show the flipped card
    if (selectedCards.length === 2) { // Check if two cards are selected
        setTimeout(checkMatch, 1000); // Delay before checking for a match
    }
}

function checkMatch() { // Function to check if the selected cards match
    const [firstIndex, secondIndex] = selectedCards; // Get the indices of the selected cards
    if (gameBoard[firstIndex].value === gameBoard[secondIndex].value) { // Check if the values match
        if (animalSounds[gameBoard[firstIndex].value]) { // Check if the corresponding sound exists
            animalSounds[gameBoard[firstIndex].value].play(); // Play the sound for the matched card
        }
        if (twoPlayerMode) { // Update scores based on current player
            currentPlayer === 1 ? player1Score++ : player2Score++;
        } else {
            player1Score++; // Single-player mode
        }
    } else { // If the cards don’t match
        setTimeout(() => { // Delay before flipping the cards back
            gameBoard[firstIndex].flipped = false; // Unflip the first card
            gameBoard[secondIndex].flipped = false; // Unflip the second card
            if (twoPlayerMode) currentPlayer = currentPlayer === 1 ? 2 : 1; // Switch players in two-player mode
            renderBoard(); // Render the board
        }, 1000); // Delay for 1 second
    }

    selectedCards = []; // Clear the selected cards array
    document.getElementById('scoreboard').innerText = twoPlayerMode ? "Player 1: " + player1Score + " | Player 2: " + player2Score :
    "Score: " + player1Score; // Update the scoreboard with the current scores
    renderBoard(); // Render the board again
    checkGameOver(); // Check if the game is over
}

function checkGameOver() { // Function to check if the game is over
    if (gameBoard.every(card => card.flipped)) { // Check if all cards are flipped
        endGame(); // Call endGame if all cards are matched
    }
}

// Restart the game
function restartGame() { // Function to restart the game
    player1Score = 0; // Reset Player 1 score
    player2Score = 0; // Reset Player 2 score
    currentPlayer = 1; // Reset to Player 1
    selectedCards = []; // Clear the selected cards array
    gameBoard = []; // Clear the game board
    document.getElementById('result').innerText = ''; // Clear the result message
    document.getElementById('restartButton').style.display = 'none'; // Hide the restart button
    document.getElementById('scoreboard').style.display = 'block'; // Show the scoreboard
    document.getElementById('timer').style.display = 'block'; // Show the timer
    startTimer(180); // Start the timer with a duration of 180 seconds
    setupGameBoard(); // Set up the game board
}
