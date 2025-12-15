window.onload = () => {
    mostrarPuntajes();
    actualizarDesbloqueo();
};

function mostrarPuntajes() {
    const score1 = parseInt(localStorage.getItem("cinnamoBest") || "0");
    const score2 = parseInt(localStorage.getItem("memoramaBest") || "0");
    const score3 = parseInt(localStorage.getItem("snoopyBest") || "0");
    const score4 = parseInt(localStorage.getItem("bubbleBest") || "0");

    document.getElementById("score1").textContent = "Récord: " + score1;
    document.getElementById("score2").textContent = "Récord: " + score2;
    document.getElementById("score3").textContent = "Récord: " + score3;
    document.getElementById("score4").textContent = "Récord: " + score4;
}

// 🔓 DESBLOQUEO DE SURPRISE LAND
function actualizarDesbloqueo() {
    const score3 = parseInt(localStorage.getItem("snoopyBest") || "0");
    const score4 = parseInt(localStorage.getItem("bubbleBest") || "0");

    const game6 = document.getElementById("game6");

    if (score3 >= 100 && score4 >= 100) {
        game6.classList.remove("locked");
        game6.querySelector("p").textContent = "¡Desbloqueado ✨!";
        game6.setAttribute("onclick", "irAJuego(6)");
    } else {
        game6.classList.add("locked");
        game6.querySelector("p").textContent = "Bloqueado 🔒";
        game6.removeAttribute("onclick");
    }
}

function irAJuego(numero) {
    switch (numero) {
        case 1:
            window.location.href = "cinnamo-fly/index.html";
            break;
        case 2:
            window.location.href = "memorama/index.html";
            break;
        case 3:
            window.location.href = "snoopy-car/index.html";
            break;
        case 4:
            window.location.href = "bubble-reflex/index.html";
            break;
        case 6:
            window.location.href = "surprise-land/index.html";
            break;
        default:
            alert("Juego bloqueado 🔒");
    }
}