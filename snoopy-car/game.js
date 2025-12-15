const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* =====================
   TAMAÑO BASE
===================== */
const BASE_WIDTH = 360;
const BASE_HEIGHT = 500;
canvas.width = BASE_WIDTH;
canvas.height = BASE_HEIGHT;

/* =====================
   IMÁGENES
===================== */
const carImg = new Image();
carImg.src = "snoopy_car.png";

const enemyImgs = ["enemy_car1.png", "enemy_car2.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

/* =====================
   SONIDOS
===================== */
const moveSound = new Audio("move.wav");
const crashSound = new Audio("crash.wav");
const bgMusic = new Audio("bg-music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.2;

/* =====================
   VARIABLES
===================== */
const lanes = [60, 155, 250];
let enemies = [];
let speed = 4;
let score = 0;
let bestScore = localStorage.getItem("snoopyBest") || 0;

let started = false;
let paused = false;
let gameOver = false;
let nightMode = false;
let animationId = null;
let enemyTimer = 0;

const car = {
    lane: 1,
    x: lanes[1],
    y: 380,
    width: 50,
    height: 80
};

/* =====================
   FUNCIONES DE CARRILES
===================== */
function dibujarCarriles() {
    ctx.strokeStyle = "#d8c7ff";
    ctx.lineWidth = 2;
    lanes.forEach(x => {
        ctx.beginPath();
        ctx.moveTo(x + 25, 0);
        ctx.lineTo(x + 25, BASE_HEIGHT);
        ctx.stroke();
    });
}

/* =====================
   CONTROLES
===================== */
document.addEventListener("keydown", e => {
    if (!started || paused || gameOver) return;

    if (e.key === "ArrowLeft") moverIzquierda();
    if (e.key === "ArrowRight") moverDerecha();
    if (e.key === "Escape") togglePause();
});

function moverIzquierda() {
    if (car.lane > 0) {
        car.lane--;
        car.x = lanes[car.lane];
        moveSound.currentTime = 0;
        moveSound.play();
    }
}

function moverDerecha() {
    if (car.lane < lanes.length - 1) {
        car.lane++;
        car.x = lanes[car.lane];
        moveSound.currentTime = 0;
        moveSound.play();
    }
}

/* =====================
   CONTROLES TÁCTILES
===================== */
canvas.addEventListener("touchstart", e => {
    if (!started || paused || gameOver) return;

    const touchX = e.touches[0].clientX;
    const rect = canvas.getBoundingClientRect();
    const mid = rect.left + rect.width / 2;

    if (touchX < mid) moverIzquierda();
    else moverDerecha();
});

let lastTap = 0;
canvas.addEventListener("touchend", () => {
    const now = Date.now();
    if (now - lastTap < 300) togglePause();
    lastTap = now;
});

/* =====================
   ENEMIGOS
===================== */
function crearEnemigo() {
    const lane = Math.floor(Math.random() * lanes.length);
    const img = enemyImgs[Math.floor(Math.random() * enemyImgs.length)];

    enemies.push({
        x: lanes[lane],
        y: -100,
        width: 50,
        height: 80,
        img
    });
}

/* =====================
   LOOP PRINCIPAL
===================== */
function update() {
    if (!started || paused || gameOver) return;

    ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    dibujarCarriles(); // líneas visibles

    enemyTimer++;
    if (enemyTimer > 80) {
        crearEnemigo();
        enemyTimer = 0;
    }

    // enemigos y puntaje
    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        e.y += speed;
        ctx.drawImage(e.img, e.x, e.y, e.width, e.height);

        // colisión
        if (
            car.x < e.x + e.width &&
            car.x + car.width > e.x &&
            car.y < e.y + e.height &&
            car.y + car.height > e.y
        ) {
            finalizarJuego();
        }

        // si salió de pantalla → sumar puntaje y eliminar
        if (e.y > BASE_HEIGHT) {
            score++;
            enemies.splice(i, 1);
        }
    }

    ctx.drawImage(carImg, car.x, car.y, car.width, car.height);

    ctx.fillStyle = nightMode ? "#fff" : "#6A5ACD";
    ctx.font = "16px Arial";
    ctx.fillText("Puntaje: " + score, 10, 20);
    ctx.fillText("Récord: " + bestScore, 10, 40);

    animationId = requestAnimationFrame(update);
}

/* =====================
   ESTADOS
===================== */
function iniciarJuego() {
    document.getElementById("startScreen").classList.add("hidden");
    started = true;
    paused = false;
    gameOver = false;
    enemies = [];
    enemyTimer = 0;
    score = 0;
    speed = 4;
    bgMusic.currentTime = 0;
    bgMusic.play();
    update();
}

function togglePause() {
    if (!started || gameOver) return;
    paused = !paused;
    if (!paused) update();
}

/* =====================
   GAME OVER
===================== */
function finalizarJuego() {
    crashSound.play();
    gameOver = true;
    bgMusic.pause();
    cancelAnimationFrame(animationId);

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("snoopyBest", bestScore);
    }

    document.getElementById("finalScore").textContent = "Puntaje: " + score;
    document.getElementById("bestScore").textContent = "Récord: " + bestScore;
    document.getElementById("gameOverScreen").classList.remove("hidden");
}

/* =====================
   REINICIAR
===================== */
function reiniciar() {
    enemies = [];
    score = 0;
    speed = 4;
    enemyTimer = 0;
    gameOver = false;
    paused = false;
    started = false;
    car.lane = 1;
    car.x = lanes[1];

    document.getElementById("gameOverScreen").classList.add("hidden");
    document.getElementById("startScreen").classList.remove("hidden");
}

/* =====================
   BOTONES
===================== */
function volverMenu() {
    window.location.href = "../../index.html";
}