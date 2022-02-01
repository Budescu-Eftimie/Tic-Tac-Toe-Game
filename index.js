const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];
let gameBoardArr;

const human = "X";
const robot = "O";

let resetBtn = document.querySelector(".reset");
let game = document.querySelector(".game-container");
let cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  gameBoardArr = Array.from(Array(9).keys());

  game.addEventListener("click", turnClick);
}

resetBtn.onclick = () => {
  console.log("btn pressed");
  cells.forEach((cell) => {
    cell.style.removeProperty("background-color");
    cell.textContent = "";
  });
  startGame();
};

function turnClick(e) {
  let cellId = e.target.dataset.id;
  if (typeof gameBoardArr[cellId] == "number") {
    turn(cellId, human);
    if (!checkTie()) turn(bestPlay(), robot);
  }
}

function turn(cellId, player) {
  gameBoardArr[cellId] = player;
  document.querySelector(`[data-id="${cellId}"]`).textContent = player;
  let gameWon = checkWin(gameBoardArr, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  //----change backgroundColor of winning cells----//
  for (let index of winCombos[gameWon.index]) {
    document.querySelector(`[data-id="${index}"]`).style.backgroundColor =
      gameWon.player == human ? "blue" : "red";
  }
  //----remove eventListener from all gameboardCells----//
  game.removeEventListener("click", turnClick);
  declareWinner(gameWon.player == human ? "You winn" : "You lose");
}

function declareWinner(who) {
  document.querySelector(".endgame").textContent = who;
}

function emtyCells() {
  return gameBoardArr.filter((cell) => typeof cell == "number");
}

function bestPlay() {
  return emtyCells()[Math.floor(Math.random()*emtyCells().length)];
}



function checkTie() {
  if (emtyCells().length == 0) {
    cells.forEach((cell) => {
      cell.style.backgroundColor = "yellow";
      cell.removeEventListener("click", turnClick);
    });
    declareWinner("It's a Tie!");
    return true;
  }
  return false;
}
