var numberOfEmpty = 43;
var moveHistory = [];
var idxClicked = 0;
var initialBo = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];
const { solution, userWork, originalQuestion } = runMain();
let activeCol;
let activeRow;
//check valid
function isValid(bo, guess, row, col) {
  for (i = 0; i < 9; i++) {
    if (Number(bo[row][i]) == Number(guess)) {
      return false;
    }
  }

  for (i = 0; i < 9; i++) {
    if (Number(bo[i][col]) == Number(guess)) {
      return false;
    }
  }

  start_row = Math.floor(row / 3);
  start_col = Math.floor(col / 3);

  for (r = start_row * 3; r < start_row * 3 + 3; r++) {
    for (c = start_col * 3; c < start_col * 3 + 3; c++) {
      if (Number(bo[r][c]) == Number(guess)) {
        return false;
      }
    }
  }

  return true;
}

function fillGrid(data) {
  //fill number into the grid
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      if (Number(data[x][y]) == 0) {
        for (let count = 0; count < 45; count++) {
          guess = Math.floor(Math.random() * 9) + 1;
          if (isValid(data, guess, x, y)) {
            data[x][y] = guess;
            if (fillGrid(data)) {
              return true;
            }
            data[x][y] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

//////
function emptySquares(numberOfEmpty, bo) {
  const squares = document.querySelectorAll(".sudoku__squares");
  emptySquaresLocation = [];

  while (emptySquaresLocation.length < numberOfEmpty) {
    idx = Math.floor(Math.random() * 79) + 1;
    if (emptySquaresLocation.indexOf(idx) === -1) {
      emptySquaresLocation.push(idx);
    }
  }

  for (let z = 0; z < emptySquaresLocation.length; z++) {
    squares[emptySquaresLocation[z]].innerHTML = " ";
    x = Math.floor(emptySquaresLocation[z] / 9);
    y = emptySquaresLocation[z] - 9 * x;

    bo[x][y] = 0;
  }
}

//generate board
function generateBo(bo) {
  rows = document.querySelectorAll(".soduku__row");
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows.length; c++) {
      parseInt(bo[r][c]) == 0 ? (val = " ") : (val = bo[r][c]);
      rows[r].innerHTML += `<div class="sudoku__squares"> ${val} </div>`;
    }
  }

  const squares = document.querySelectorAll(".sudoku__squares");
  squares.forEach((square, idx) => {
    let y = Math.floor(idx / 9);
    let x = Math.floor(idx - y * 9);

    square.addEventListener("click", (e) => {
      activeSquare = document.querySelector(".sudoku__squares--active");
      if (activeSquare) {
        activeSquare.classList.remove("sudoku__squares--active");
      }
      idxClicked = idx;
      square.classList.add("sudoku__squares--active");

      row = Math.floor(idxClicked / 9);
      col = Math.floor(idxClicked - row * 9);

      activeRow = row;
      activeCol = col;

      delHighlightClass = document.querySelectorAll(".highlightSame");
      if (delHighlightClass) {
        for (i = 0; i < delHighlightClass.length; i++) {
          delHighlightClass[i].classList.remove("highlightSame");
        }
      }

      for (count = 0; count < 9; count++) {
        if (row * 9 + count !== idxClicked || col + 9 * count !== idxClicked) {
          squares[row * 9 + count].classList.add("highlightSame");
          squares[col + 9 * count].classList.add("highlightSame");
        }
      }

      square.classList.remove("highlightSame");
    });
  });
}

//
function record(row, col, guess, moveHistory) {
  var process = [row, col, guess];
  if (process.length > 0) {
    moveHistory.push(process);
  }
}

//handle input

function handle(row, col, guess) {
  if (originalQuestion[row][col] !== 0) {
    return;
  }
  index = col + row * 9;
  squares = document.querySelectorAll(".sudoku__squares");
  squares[index].classList.remove("wrong_red");

  if (!isValid(userWork, guess, row, col))
    squares[index].classList.add("wrong_red");

  squares[index].innerHTML = guess;
  squares[index].classList.add("guess_input");

  userWork[row][col] = Number(guess);
}

//main program
function runMain() {
  function genGrid(bo) {
    for (let i = 0; i < 100; i++) {
      if (fillGrid(bo)) {
        generateBo(bo);
        return bo;
      }
    }

    genGrid(bo);
  }

  const solution = genGrid(initialBo);
  var originalQuestion = [];
  for (let r = 0; r < rows.length; r++) {
    temp = [];
    for (let c = 0; c < rows.length; c++) {
      temp.push(solution[r][c]);
    }
    originalQuestion.push(temp);
  }

  emptySquares(numberOfEmpty, originalQuestion);

  var userWork = [];
  for (let r = 0; r < rows.length; r++) {
    temp = [];
    for (let c = 0; c < rows.length; c++) {
      temp.push(originalQuestion[r][c]);
    }
    userWork.push(temp);
  }

  return { solution, userWork, originalQuestion };
}

//////
numbers = document.querySelectorAll(".number-pad__item");
numbers.forEach((number) =>
  number.addEventListener("click", (e) => {
    if (document.querySelector(".sudoku__squares--active")) {
      activeSquare = document.querySelector(".sudoku__squares--active");

      row = Array.from(activeSquare.parentNode.parentNode.children).indexOf(
        activeSquare.parentNode
      );
      col = Array.from(activeSquare.parentNode.children).indexOf(activeSquare);

      handle(row, col, e.target.innerHTML);
      record(row, col, e.target.innerHTML, moveHistory);
    }
  })
);

//clear initialBO
function clearBoard() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      initialBo[i][j] = 0;
      userWork[i][j] = 0;
      originalQuestion[i][j] = 0;
    }
  }
}

//new game
new_game = document.querySelector(".control-pannel__btn");
new_game.addEventListener("click", () => {
  clearBoard();
  defaultBo = initialBo;
  //clear board
  rows = document.querySelectorAll(".soduku__row");
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows.length; c++) {
      parseInt(defaultBo[r][c]) == 0 ? (val = " ") : (val = defaultBo[r][c]);
      rows[r].innerHTML = ` `;
    }
  }
  runMain(numberOfEmpty);
});

//difficulty

difficulty = document.querySelector("select");
difficulty.addEventListener("change", (e) => {
  if (e.target.value == "Hard") {
    numberOfEmpty = 54;
  } else if (e.target.value == "Medium") {
    numberOfEmpty = 46;
  } else {
    numberOfEmpty = 43;
  }
});

//solution
sol = document.querySelector("#show-solution__btn");
sol.addEventListener("click", () => {
  confirm("Are you sure?");
  //clear board
  rows = document.querySelectorAll(".soduku__row");
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows.length; c++) {
      rows[r].innerHTML = ` `;
    }
  }

  generateBo(solution);
});

//submit

sub = document.querySelector("#submit__btn");
sub.addEventListener("click", () => {
  let correct = true;

  const squares = document.querySelectorAll(".sudoku__squares");

  for (let i = 0; i < squares.length; i++) {
    if (squares[i].innerHTML == " ") {
      // alert("You have not finish the sudoku yet! ");
      return;
    } else if (squares[i].classList.contains("wrong_red")) {
      alert("You have incorrect moves, please check again ");
      // let y = Math.floor(i / 9);
      // let x = Math.floor(i - y * 9);
      // if (
      //   !isValid(userWork, userWork[x][y], x, y) &&
      //   originalQuestion[x][y] == 0
      // ) {
      //   squares[i].classList.add("wrong_red");
      //   correct = false;
      // }
    }
  }

  if (!correct) return;

  confirm(
    "Congrats! You did it! Now, go and start a new game with a harder sudoku!"
  );
});

//undo
undoBtn = document.querySelector("#redo__btn");
undoBtn.addEventListener("click", () => {
  if (moveHistory.length == 0) return;
  if (moveHistory.length == 1) {
    squares[moveHistory[0][0] * 9 + moveHistory[0][1]].innerHTML = " ";
    userWork[moveHistory[0][0]][moveHistory[0][1]] = 0;
    moveHistory.pop();
    return;
  }

  lastMove = moveHistory[moveHistory.length - 1];
  lastRow = lastMove[0];
  lastCol = lastMove[1];
  lastGuess = lastMove[2];

  if (
    moveHistory[moveHistory.length - 1][0] ==
      moveHistory[moveHistory.length - 2][0] &&
    moveHistory[moveHistory.length - 1][1] ==
      moveHistory[moveHistory.length - 2][1]
  ) {
    squares[lastRow * 9 + lastCol].innerHTML =
      moveHistory[moveHistory.length - 2][2];

    userWork[lastRow][lastCol] = Number(moveHistory[moveHistory.length - 2][2]);
  } else {
    squares[lastRow * 9 + lastCol].innerHTML = " ";
    userWork[lastRow][lastCol] = 0;
  }

  moveHistory.pop();
});

//erase
eraseBtn = document.querySelector("#erase__btn");
eraseBtn.addEventListener("click", () => {
  activeGrid = document.querySelector(".sudoku__squares--active");
  eraseRow = Array.from(activeGrid.parentNode.parentNode.children).indexOf(
    activeGrid.parentNode
  );
  eraseCol = Array.from(activeGrid.parentNode.children).indexOf(activeGrid);
  if (originalQuestion[eraseRow][eraseCol] !== 0) {
    return;
  }
  record(eraseRow, eraseCol, activeGrid.innerHTML, moveHistory);
  activeGrid.innerHTML = " ";
  userWork[eraseRow][eraseCol] = 0;
});

document.onkeydown = function (e) {
  let number = e.code;
  let inputSquare = document.querySelector(".sudoku__squares--active");
  console.log("keydown");
  console.log(e.code);

  if (inputSquare) {
    switch (number) {
      case "Digit1":
        console.log(1);
        handle(activeRow, activeCol, 1);
        break;
      case "Digit2":
        handle(activeRow, activeCol, 2);
        break;
      case "Digit3":
        handle(activeRow, activeCol, 3);
        break;
      case "Digit4":
        handle(activeRow, activeCol, 4);
        break;
      case "Digit5":
        handle(activeRow, activeCol, 5);
        break;
      case "Digit6":
        handle(activeRow, activeCol, 6);
        break;
      case "Digit7":
        handle(activeRow, activeCol, 7);
        break;
      case "Digit8":
        handle(activeRow, activeCol, 8);
        break;
      case "Digit9":
        handle(activeRow, activeCol, 9);
        break;
      default:
        return;
    }
  }

  // use e.keyCode
};
