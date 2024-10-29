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










function checkGameOver() {  
