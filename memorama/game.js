document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const movesText = document.getElementById("moves");

    // 🔊 SONIDOS
    const flipSound = new Audio("flip.wav");
    const matchSound = new Audio("match.wav");

    flipSound.volume = 0.4;
    matchSound.volume = 0.5;

    let cards = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matches = 0;

    // IMÁGENES
    const images = [
        "snoopy.jpg",
        "cinnamon.png",
        "kuromi.png",
        "cat1.png",
        "cat2.png",
        "cat3.png",
        "cat4.png",
        "cat1.png"
    ];

    // 🔀 FISHER-YATES
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // 🧩 INICIAR
    function setupGame() {
        board.innerHTML = "";

        cards = [...images, ...images]; // duplicar para pares
        shuffle(cards);

        moves = 0;
        matches = 0;
        movesText.textContent = "Intentos: 0";

        cards.forEach(img => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <div class="front"></div>
                <div class="back" style="background-image:url('${img}')"></div>
            `;

            card.dataset.image = img;
            card.addEventListener("click", () => flipCard(card));
            board.appendChild(card);
        });
    }

    // 🃏 VOLTEAR
    function flipCard(card) {
        if (lockBoard || card === firstCard || card.classList.contains("matched")) return;

        flipSound.currentTime = 0;
        flipSound.play();

        card.classList.add("flipped");

        if (!firstCard) {
            firstCard = card;
            return;
        }

        secondCard = card;
        lockBoard = true;
        moves++;
        movesText.textContent = "Intentos: " + moves;

        checkMatch();
    }

    // ✅ COMPARAR
    function checkMatch() {
        if (firstCard.dataset.image === secondCard.dataset.image) {
            matchSound.currentTime = 0;
            matchSound.play();

            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            matches++;
            resetTurn();

            if (matches === images.length) {
                setTimeout(() => {
                    alert("🎉 ¡Ganaste!");
                    // Guardar mejor puntuación si quieres usarla en el menú
                    localStorage.setItem("memoramaBest", moves);
                }, 300);
            }
        } else {
            setTimeout(() => {
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                resetTurn();
            }, 800);
        }
    }

    function resetTurn() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    // 🔁 BOTONES
    window.reiniciar = () => {
        setupGame();
    };

    window.volverMenu = () => {
        window.location.href = "../../index.html";
    };

    // Inicializar juego
    setupGame();
});