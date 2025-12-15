const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bubbles = [];
let score = 0;
let escaped = 0;
let bestScore = parseInt(localStorage.getItem("bubbleBest") || "0");
let speed = 1.5;
let gameOver = false;

function createBubble() {
    const radius = 20 + Math.random() * 20;
    bubbles.push({
        x: Math.random() * (canvas.width - radius*2) + radius,
        y: canvas.height + radius,
        radius
    });
}

canvas.addEventListener("click", e => {
    bubbles.forEach((b, i) => {
        const dx = e.offsetX - b.x;
        const dy = e.offsetY - b.y;
        if (dx*dx + dy*dy < b.radius*b.radius) {
            bubbles.splice(i,1);
            score++;
            speed += 0.05;
            updateBestScore();
        }
    });
});

function updateBestScore() {
    if(score > bestScore){
        bestScore = score;
        localStorage.setItem("bubbleBest", bestScore);
    }
}

function update() {
    if(gameOver) return;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(Math.random() < 0.02) createBubble();

    bubbles.forEach((b, i) => {
        b.y -= speed;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
        ctx.fillStyle = "#ff9de1";
        ctx.fill();
        ctx.closePath();

        if(b.y + b.radius < 0){
            bubbles.splice(i,1);
            escaped++;
            if(escaped >= 3){
                endGame();
            }
        }
    });

    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText("Puntaje: " + score, 10, 20);
    ctx.fillText("Récord: " + bestScore, 10, 40);

    requestAnimationFrame(update);
}

function endGame(){
    gameOver = true;
    alert("Game Over 😢");
    if(score > bestScore){
        bestScore = score;
        localStorage.setItem("bubbleBest", bestScore);
    }
}

// Inicialización
update();