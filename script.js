let prefillCount = 0;
const maxPrefill = 2;
let board = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];
const boardDiv = document.getElementById("board");

function allowPrefill() {
  boardDiv.addEventListener("click", (e) => {
    if (!e.target.classList.contains("cell")) return;
    const [_, r, c] = e.target.id.split("-").map(Number);
    if (board[r][c] !== 0) return; 
    if (prefillCount >= maxPrefill) return;

    const num = prompt("Enter a number (1-9):");
    const n = Number(num);
    if (n >= 1 && n <= 9 && isValid(r, c, n)) {
      board[r][c] = n;
      updateCell(r, c, n, "fixed");
      prefillCount++;
    } else {
      alert("Invalid number!");
    }
  });
}

allowPrefill();
drawBoard();

function drawBoard() {
  boardDiv.innerHTML = "";
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (board[r][c] !== 0) cell.classList.add("fixed");
      cell.id = `cell-${r}-${c}`;
      cell.textContent = board[r][c] !== 0 ? board[r][c] : "";
      boardDiv.appendChild(cell);
    }
  }
}

drawBoard();

document.getElementById("start").onclick = () => { solve(); };




// same vaild function wriiten during interview 

function isValid(r, c, num) {
  for (let i = 0; i < 9; i++) {

    if (board[r][i] === num) return false;
    if (board[i][c] === num) return false;

  }

  const sr = Math.floor(r / 3) * 3;
  const sc = Math.floor(c / 3) * 3;


  for (let i = sr; i < sr + 3; i++)
    for (let j = sc; j < sc + 3; j++)
      if (board[i][j] === num) return false;


  return true;
}


async function solve() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(r, c, num)) {
            board[r][c] = num;
            updateCell(r, c, num, "trying");
            await sleep(50); // step delay
            if (await solve()) return true;
            board[r][c] = 0;
            updateCell(r, c, "", "backtrack");
            await sleep(50);
          }
        }
        return false;
      }
    }
  }
  return true;
}

function updateCell(r, c, val, cls) {
  const cell = document.getElementById(`cell-${r}-${c}`);
  cell.textContent = val;
  cell.className = `cell ${cls}`;
}

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }