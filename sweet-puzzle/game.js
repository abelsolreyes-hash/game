const puzzleContainer = document.getElementById("puzzleContainer");
const difficultySelect = document.getElementById("difficulty");

let gridSize = 3;
let tiles = [];
let emptyTile = {row: 0, col: 0};
let moves = 0;

// Lista de imágenes posibles
const images = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg"];
let fullImage = new Image();

// Record máximo
let bestScore = parseInt(localStorage.getItem("puzzleBest") || "0");

/* ===================== INICIAR JUEGO ===================== */
function iniciarJuego() {
    gridSize = parseInt(difficultySelect.value);
    document.getElementById("startScreen").classList.add("hidden");
    puzzleContainer.innerHTML = "";
    tiles = [];
    moves = 0;

    const selectedImage = images[Math.floor(Math.random() * images.length)];
    fullImage.src = selectedImage;

    fullImage.onload = () => {
        crearPuzzle();
        mezclarPuzzle();
    };
}

/* ===================== CREAR PUZZLE ===================== */
function crearPuzzle() {
    const containerSize = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7);
    puzzleContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    puzzleContainer.style.width = containerSize + "px";
    puzzleContainer.style.height = containerSize + "px";

    const tileWidth = containerSize / gridSize;
    const tileHeight = containerSize / gridSize;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (row === gridSize - 1 && col === gridSize - 1) {
                emptyTile = {row, col};
                const emptyDiv = document.createElement("div");
                emptyDiv.classList.add("tile", "empty");
                puzzleContainer.appendChild(emptyDiv);
                continue;
            }

            const canvasTile = document.createElement("canvas");
            canvasTile.width = fullImage.width / gridSize;
            canvasTile.height = fullImage.height / gridSize;
            const ctxTile = canvasTile.getContext("2d");
            ctxTile.drawImage(
                fullImage,
                col * fullImage.width / gridSize,
                row * fullImage.height / gridSize,
                fullImage.width / gridSize,
                fullImage.height / gridSize,
                0,
                0,
                canvasTile.width,
                canvasTile.height
            );

            canvasTile.classList.add("tile");
            canvasTile.style.width = tileWidth + "px";
            canvasTile.style.height = tileHeight + "px";
            canvasTile.dataset.row = row;
            canvasTile.dataset.col = col;
            canvasTile.addEventListener("click", () => moverTile(canvasTile));
            puzzleContainer.appendChild(canvasTile);
            tiles.push(canvasTile);
        }
    }
}

/* ===================== MEZCLAR PUZZLE ===================== */
function mezclarPuzzle() {
    for (let i = 0; i < 1000; i++) {
        const neighbors = obtenerVecinosVacios();
        const randomTile = neighbors[Math.floor(Math.random() * neighbors.length)];
        moverTile(randomTile, true);
    }
}

/* ===================== VECINOS ===================== */
function obtenerVecinosVacios() {
    const neighbors = [];
    tiles.forEach(tile => {
        const row = parseInt(tile.dataset.row);
        const col = parseInt(tile.dataset.col);
        const dr = Math.abs(row - emptyTile.row);
        const dc = Math.abs(col - emptyTile.col);
        if (dr + dc === 1) neighbors.push(tile);
    });
    return neighbors;
}

/* ===================== MOVIMIENTO ===================== */
function moverTile(tile, skipMoveCount = false) {
    const row = parseInt(tile.dataset.row);
    const col = parseInt(tile.dataset.col);

    const dr = Math.abs(row - emptyTile.row);
    const dc = Math.abs(col - emptyTile.col);

    if (dr + dc === 1) {
        // Intercambiar posiciones visuales usando insertBefore
        const children = Array.from(puzzleContainer.children);
        const emptyIndex = children.findIndex(c => c.classList.contains("empty"));
        const tileIndex = children.indexOf(tile);
        if (tileIndex > emptyIndex) {
            puzzleContainer.insertBefore(tile, children[emptyIndex]);
        } else {
            puzzleContainer.insertBefore(tile, children[emptyIndex + 1]);
        }

        // Actualizar dataset de fila/col
        const tempRow = tile.dataset.row;
        const tempCol = tile.dataset.col;
        tile.dataset.row = emptyTile.row;
        tile.dataset.col = emptyTile.col;
        emptyTile.row = parseInt(tempRow);
        emptyTile.col = parseInt(tempCol);

        if (!skipMoveCount) moves++;

        if (checkCompletion()) finalizarJuego();
    }
}

/* ===================== COMPROBAR COMPLETADO ===================== */
function checkCompletion() {
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const expectedRow = Math.floor(i / gridSize);
        const expectedCol = i % gridSize;
        if (parseInt(tile.dataset.row) !== expectedRow || parseInt(tile.dataset.col) !== expectedCol) return false;
    }
    return true;
}

/* ===================== FINALIZAR JUEGO ===================== */
function finalizarJuego() {
    // Guardar récord
    if (moves > bestScore) {
        bestScore = moves;
        localStorage.setItem("puzzleBest", bestScore);
    }

    document.getElementById("finalScore").textContent = `Movimientos: ${moves}`;
    document.getElementById("bestScore").textContent = `Récord: ${bestScore}`;
    document.getElementById("gameOverScreen").classList.remove("hidden");
}

/* ===================== REINICIAR ===================== */
function reiniciar() {
    document.getElementById("gameOverScreen").classList.add("hidden");
    document.getElementById("startScreen").classList.remove("hidden");
    puzzleContainer.innerHTML = "";
    tiles = [];
    moves = 0;
}

/* ===================== VOLVER AL MENÚ ===================== */
function volverMenu() {
    window.location.href = "../../index.html";
}

// Actualizar tamaño si se cambia la pantalla
window.addEventListener("resize", () => {
    if (tiles.length > 0) {
        iniciarJuego();
    }
});