const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let gameOver = false;

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(e) {
    if (gameOver) return;

    const cell = e.target;
    if (cell.innerHTML !== '') return;

    cell.innerHTML = currentPlayer;
    cell.classList.add(currentPlayer);

    if (checkWin(currentPlayer)) {
        endGame(currentPlayer + ' wins!');
        return;
    }

    if (checkDraw()) {
        endGame("It's a draw!");
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (currentPlayer === 'O') {
        makeAIMove();
    }
}

function makeAIMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].innerHTML === '') {
            cells[i].innerHTML = 'O';
            let score = minimax(cells, 0, false);
            cells[i].innerHTML = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    cells[move].innerHTML = 'O';
    cells[move].classList.add('O');

    if (checkWin('O')) {
        endGame('O wins!');
        return;
    }

    if (checkDraw()) {
        endGame("It's a draw!");
        return;
    }

    currentPlayer = 'X';
}

function minimax(cells, depth, isMaximizingPlayer) {
    if (checkWin('X')) {
        return -1;
    }
    if (checkWin('O')) {
        return 1;
    }
    if (checkDraw()) {
        return 0;
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].innerHTML === '') {
                cells[i].innerHTML = 'O';
                let score = minimax(cells, depth + 1, false);
                cells[i].innerHTML = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].innerHTML === '') {
                cells[i].innerHTML = 'X';
                let score = minimax(cells, depth + 1, true);
                cells[i].innerHTML = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin(player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let combination of winningCombinations) {
        if (
            cells[combination[0]].innerHTML === player &&
            cells[combination[1]].innerHTML === player &&
            cells[combination[2]].innerHTML === player
        ) {
            return true;
        }
    }

    return false;
}

function checkDraw() {
    for (let cell of cells) {
        if (cell.innerHTML === '') {
            return false;
        }
    }
    return true;
}

function endGame(message) {
    gameOver = true;
    alert(message);
    resetGame();
}

function resetGame() {
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('X', 'O');
    });

    currentPlayer = 'X';
    gameOver = false;
}
