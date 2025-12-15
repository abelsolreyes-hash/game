const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* ===== IMÁGENES ===== */
const cinnamoImg = new Image();
cinnamoImg.src = "cinnamo.png";

/* ===== SONIDOS ===== */
const flapSound = new Audio("flap.wav");
const hitSound = new Audio("hit.wav");

/* ===== CONSTANTES ===== */
const gravity = 0.4;
const jump = -7;
const pipeWidth = 50;
const gap = 150;

/* ===== VARIABLES ===== */
let cinnamo;
let pipes;
let frame;
let score;
let speed;
let gameOver;
let animationId;
let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;

/* ===== INICIALIZAR ===== */
function init() {
    cinnamo = {
        x: 80,
        y: 200,
        width: 40,
        height: 40,
        velocity: 0,
        angle: 0
    };

    pipes = [];
    frame = 0;
    score = 0;
    speed = 2;
    gameOver = false;

    cancelAnimationFrame(animationId);
    update();
}

/* ===== CONTROLES ===== */
document.addEventListener("keydown", e => {
    if (e.code === "Space") volar();
});

canvas.addEventListener("click", volar);

function volar() {
    if (gameOver) return;

    cinnamo.velocity = jump;
    cinnamo.angle = -0.35;

    flapSound.currentTime = 0;
    flapSound.play();
}

/* ===== LOOP ===== */
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* PERSONAJE */
    cinnamo.velocity += gravity;
    cinnamo.y += cinnamo.velocity;
    cinnamo.angle += 0.04;

    ctx.save();
    ctx.translate(cinnamo.x + 20, cinnamo.y + 20);
    ctx.rotate(cinnamo.angle);
    ctx.drawImage(cinnamoImg, -20, -20, 40, 40);
    ctx.restore();

    /* TUBOS */
    if (frame % 90 === 0) {
        let topHeight = Math.random() * 200 + 40;
        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: topHeight + gap,
            passed: false
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= speed;

        ctx.fillStyle = "#B2EBF2";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height);

        // Colisión
        if (
            cinnamo.x + cinnamo.width > pipe.x &&
            cinnamo.x < pipe.x + pipeWidth &&
            (cinnamo.y < pipe.top ||
             cinnamo.y + cinnamo.height > pipe.bottom)
        ) {
            terminarJuego();
        }

        // Score
        if (!pipe.passed && pipe.x + pipeWidth < cinnamo.x) {
            score++;
            pipe.passed = true;
        }
    });

    /* LÍMITES */
    if (cinnamo.y + cinnamo.height > canvas.height || cinnamo.y < 0) {
        terminarJuego();
    }

    /* DIFICULTAD */
    if (frame % 300 === 0) speed += 0.2;

    /* UI */
    ctx.fillStyle = "#6A5ACD";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Best: ${bestScore}`, 10, 55);

    if (gameOver) {
        ctx.font = "26px Arial";
        ctx.fillText("Game Over 💔", 90, 240);
        return;
    }

    frame++;
    animationId = requestAnimationFrame(update);
}

/* ===== FIN ===== */
function terminarJuego() {
    if (gameOver) return;

    gameOver = true;

    hitSound.currentTime = 0;
    hitSound.play();

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
    }
}

/* ===== BOTONES ===== */
function reiniciar() {
    init();
}

function volverMenu() {
    window.location.href = "../../index.html";
}

/* ===== INICIAR ===== */
init();