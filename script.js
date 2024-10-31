// Initialize scores and current player
let player1Score = 0;     // Player 1's score
let player2Score = 0;     // Player 2's score
let currentPlayer = 1;    // Tracks which player's turn it is (1 or 2)
let twoPlayerMode = false;
let cardValues = ["🐸", "🐶", "🐻", "🦊", "🐰", "🐱"]; // Array of card symbols for matching pairs
let selectedCards = [];   // Array to track selected cards for matching
let gameBoard = [];       // Array to represent the game board with cards

function selectMode(mode) {
  twoPlayerMode = (mode === 2)

  document.querySelector('main section').style.display = 'none';
  document.getElementById('playerNameSections').style.display = 'block';
  document.getElementById('player2Name').style.display = twoPlayerMode ? 'block' : 'none'; 
}


// Function to start the game and reset scores and player turn
function startGame() {
  player1Score = 0; // Reset Player 1's score
  player2Score = 0; // Reset Player 2's score
  currentPlayer = 1; // Set starting player to Player 1

document.getElementById('playerNameSections').style.display = 'none';
document.getElementById('scoreboard').style.display = 'block';
if (twoPlayerMode){
  document.getElementById('scoreboard').innerText = "Player 1: 0 | Player 2: 0"
} else {
  document.getElementById('scoreboard').innerText = "Score: 0"; 
}

  setupGameBoard(); // Call setup function to arrange the game board
}

// Function to set up and shuffle the game board
function setupGameBoard () {
  const cardPairs = [...cardValues, ...cardValues]; // Duplicate card values to create pairs
  cardPairs.sort(() => Math.random() - 0.5); // Shuffle the cards randomly
  // Create an array of card objects with a value and flipped status
  gameBoard = cardPairs.map(value => ({
    value: value,    // The symbol for each card
    flipped: false   // Whether the card is currently flipped
  }));
  renderBoard(); // Render the initial game board display
}

// Function to render the game board
function renderBoard() {
    const board = document.getElementById('gameBoard');   // Get the game board element
  board.innerHTML = ''; // Clear the board's current content
  // For each card, create a card element and append it to the game board
  gameBoard.forEach((card, index) => {
    const cardElement = document.createElement('span'); // Create a new span element for each card
    cardElement.innerText = card.flipped ? card.value : '🃏'; // Display card symbol if flipped, else a placeholder
    cardElement.className = 'card'; // Assign class for styling
    cardElement.onclick = () => flipCard(index); // Set click event to flip card on selection
    board.appendChild(cardElement); // Add card element to the game board
  });
}

// Function to handle card flip logic
function flipCard(index) {
  if (gameBoard[index].flipped || selectedCards.length >= 2) return; // If the card is already flipped, ignore further action
  gameBoard[index].flipped = true; // Set card as flipped
  selectedCards.push(index); // Add the card index to selected cards
  renderBoard(); // Update the board display to show flipped card
  if (selectedCards.length === 2) { // If two cards are selected
    setTimeout(checkMatch, 1000); // Wait a second and check if cards match
  }
}

// Function to check if selected cards are a match
function checkMatch() { 
  const [firstIndex, secondIndex] = selectedCards; // Get indices of the two selected cards
  if (gameBoard[firstIndex].value === gameBoard[secondIndex].value) { // If the cards match
    if (twoPlayerMode){
      currentPlayer === 1 ? player1Score++ : player2Score++
    } else {
      player1Score++;
    }
  } else {
    setTimeout(() => {
      gameBoard[firstIndex].flipped = false;
      gameBoard[secondIndex].flipped = false;
      if (twoPlayerMode) currentPlayer = currentPlayer === 1 ? 2 : 1;
      renderBoard();
    }, 1000);
  }



  selectedCards = []; // Reset selected cards for the next turn
  // Update the scoreboard display with current scores
  document.getElementById('scoreboard').innerText = twoPlayerMode ? "Player 1: " + player1Score + " | Player 2: " + player2Score :
  "Score: " + player1Score;
  renderBoard(); // Render the board to reflect changes
  checkGameOver(); // Check if the game is over after each match check
}

// Function to check if the game is over
function checkGameOver() {  
    if (gameBoard.every(card => card.flipped)) { // If all cards are flipped
      const winner = player1Score > player2Score ? "Player 1 wins!" 
                    : player1Score < player2Score ? "Player 2 wins!" 
                    : "It's a tie!"; // Determine the winner based on scores
      document.getElementById('result').innerText = winner; // Display the winner or tie result
      alert(winner); // Show a pop-up with the winner message
    }
  }
