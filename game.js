/*
  Gameboard that displays the board
  The squares are represented by cells, that are defined later 
*/

const gameboard = (function () {
  const board = [];
  const cells = 9;

  // Fill the board with cell objects (defined afterwards)
  for (let i = 0; i < cells; i++) {
    board.push(cell());
  }

  // Print board to the console
  const printBoard = () => {
    const printedBoard = board.map((cell) => cell.getValue());
    console.log(printedBoard);
  };

  // Change cell's value according to the player
  const changeMark = (cell, player) => board[cell].changeValue(player);

  const getBoard = () => board;

  return {printBoard, changeMark, getBoard};
})();

function cell() {
  let value = 0;

  /*
    Change the value of a cell according to the player's mark
    0 : No value
    1 : Player 1's mark (X)
    2 : Player 2's mark (O)
  */

  const changeValue = (player) => value = player;

  const getValue = () => value;

  return {changeValue, getValue};
}

const gameController = (function () {
  let board = gameboard.getBoard();

  let win = false;

  let tie = false;

  const gameInfo = document.querySelector(".game-info");

  const players = [
    {
      name: "Player One",
      mark: 1
    },
    {
      name: "Player Two",
      mark: 2
    }
  ]

  let activePlayer = players[0];

  const setPlayer = (playerOne, playerTwo) => {
    players[0].name = playerOne;
    players[1].name = playerTwo;

    newRound();
  } 

  const switchPlayer = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];

  const getActivePlayer = () => activePlayer;

  const form = document.querySelector(".user-form");

  form.addEventListener("submit", startGame);

  const restartBtn = document.querySelector(".restart");

  restartBtn.addEventListener("click", restartGame);

  const newGameBtn = document.querySelector(".new-game");

  newGameBtn.addEventListener("click", function() {
    window.location.reload();
  })

  function startGame() {
    event.preventDefault();

    const start = document.querySelector(".start");

    start.style.display = "none";
    document.querySelector(".game").style.display = "flex";
  
    const playerOneName = document.getElementById("player-1-name").value || "Player One";
    const playerTwoName = document.getElementById("player-2-name").value || "Player Two";
  
    setPlayer(playerOneName, playerTwoName);

    form.textContent = '';
  
    const playerOneInfo = document.querySelector(".player-1");
    const playerTwoInfo = document.querySelector(".player-2");
  
    playerOneInfo.textContent = playerOneName;
    playerTwoInfo.textContent = playerTwoName;
  }
  
  function restartGame() {
    win = false;
    tie = false;

    restartBtn.style.display = "none";
    
    const gridItems = document.querySelectorAll(".grid-item");

    for (let i = 0; i < board.length; i++) board[i].changeValue(0);

    gridItems.forEach((gridItem) => gridItem.textContent = ``);

    activePlayer = players[0];

    newRound();
  }

  const newRound = () => {
    gameboard.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
    gameInfo.textContent = `${getActivePlayer().name}'s turn. `;
  }

  const playRound = (cell) => {
    if (!(board[cell].getValue() === 0)) return

    console.log(`Putting ${getActivePlayer().name}'s mark in cell ${cell}`);

    gameboard.changeMark(cell, getActivePlayer().mark);

    winVerification();

    if (win === true || tie === true) return;

    switchPlayer();

    newRound();
  }

  const winVerification = () => {
    const winConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]

    const gridItems = document.querySelectorAll(".grid-item");

    for (let i = 0; i < winConditions.length; i++) {
      let a = board[winConditions[i][0]].getValue();
      let b = board[winConditions[i][1]].getValue();
      let c = board[winConditions[i][2]].getValue();

      if (a === b && a === c && a != 0) {
        console.log(`${getActivePlayer().name} wins!`)
        gameInfo.textContent = `${getActivePlayer().name} wins!`;
        restartBtn.style.display = "block";
        win = true;
        return;
      }
    }

    // Tie verification
    for (let i = 0; i < board.length; i++) {
      if (board[i].getValue() === 0) return;
    }
    console.log("Tie!");
    gameInfo.textContent = "Tie!";
    restartBtn.style.display = "block";
    tie = true;
  }

  const checkWin = () => win;

  return {playRound, getActivePlayer, checkWin};
})();

const displayController = (function () {
  let board = gameboard.getBoard();

  const grid = document.querySelector(".gameboard");

  const createBoard = () => {
    let count = 0;
    for (let i = 0; i < board.length; i++) {
      const gridItem = document.createElement("div");

      gridItem.id = count;
      gridItem.className = "grid-item";
      gridItem.textContent = ``;
      gridItem.addEventListener("click", addMark);

      grid.appendChild(gridItem);
      count++;
    }
  }

  const addMark = (e) => { 
    if (gameController.checkWin() === true) return;

    if (e.target.classList.contains("cross") || e.target.classList.contains("circle")) return;

    const mark = document.createElement("div");

    if (gameController.getActivePlayer().mark === 1) mark.className = "cross";
    
    else mark.className = "circle";

    e.target.appendChild(mark);

    gameController.playRound(e.target.id);
  }

  createBoard();

  return {};
})();
