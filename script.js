let player1Score = 0;
let player2score = 0;
let currentPlayer = 1;
let cardValues = ["🐸","🐶","🐻","🦊","🐰","🐱"];
let selectedCards = [];
let gameBoard = [];


function starGame() {
  player1Score = 0;
  player2Score = 0;
  currentPlayer = 1;
  document.getElementById('scoreboard').innerText = "Player 1: " + player1Score + " | Player 2: " + player2Score;
  setupGameBoard();
}


function setupGameBoard () {
  const cardPairs = [...cardValues, ...cardValues];
  cardPairs.sort(() => Math.random() - 0.5);
  gameBoard = cardPairs.map(value => ({
    value: value,
    flipped: false
  }));
  renderBoard();
}


function renderBoard() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  gameBoard.forEach((card, index) => {
    const cardElement = document.creatElement('span');
    cardElement.innerText = card.flipped ? card.value : '🃏';
    cardElement.className = 'card';
    cardElement.onclick = () => flipCard(index);
    board.appendChild(cardElement);
  });
}


function flipCard(index) {
  if (gameBoard[index].flipped) return;
  gameBoard[index].flipped = true;
  selectedCards.push(index);
  renderBoard();
  if (selectedCards.length === 2) {
    setTimeout(checkMatch, 1000);
  }
}



function checkMatch() { 
const [firstIndex, secondIndex] = selectedCards;
  if (gameBoard[firstIndex].value ===
     gameBoard[secondIndex].value) {
    if (currentPlayer === 1){
      player1Score += 1;
    } else {
      player2Score += 1;
    }
  } else { 
    gameBoard[firstIndex].flipped = false;
    gameBoard[secondIndex].flipped = false;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
  }
  selectedCards = [];
  document.getElementById('scoreboard').innerText = "Player 1: " + player1Score + " | Player 2: " + player2Score;
  renderBoard();
  checkGameOver();
}



function checkGameOver() {  
  if (gameBoard.every(card => card.flipped)){
    const winner = player1Score ? "Player 1 wins!" : player1Score < player2Score ? "Player 2 wins!" : "It's a tie!";
    document.getElementById('result').innerText = winner;
  }
}
  
