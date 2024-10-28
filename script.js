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
