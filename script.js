const openGift = document.getElementById("openGift");
const hero = document.getElementById("hero");
const content = document.getElementById("content");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicText = document.getElementById("musicText");

const heartsContainer = document.getElementById("heartsContainer");

const slides = document.querySelectorAll(".slide");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const slideCounter = document.getElementById("slideCounter");
const progressHearts = document.querySelectorAll(".progress-heart");

const missionHearts = document.querySelectorAll(".mission-heart");
const heartMissionText = document.getElementById("heartMissionText");

const reasonCards = document.querySelectorAll(".reason-card");

const memoryCards = document.querySelectorAll(".memory-card");
const prevMemory = document.getElementById("prevMemory");
const nextMemory = document.getElementById("nextMemory");
const memoryCounter = document.getElementById("memoryCounter");

const openLetter = document.getElementById("openLetter");
const letterPaper = document.getElementById("letterPaper");
const letterLines = document.querySelectorAll(".letter-line");

const candleBtn = document.getElementById("candleBtn");
const finalMessage = document.getElementById("finalMessage");

let currentSlide = 0;
let memoryIndex = 0;
let touchedHearts = 0;

const completedSlides = new Set();
const nextSlideLabels = [
  "Abrir otro detalle ✨",
  "Ver nuestros recuerdos 📸",
  "Leer la carta 💌",
  "Ver mi mensajito 🎥",
  "Ir a la sorpresa final 🎂",
  "Cerrar con amor 💜",
  ""
];

if (bgMusic) {
  bgMusic.volume = 0.42;
}

async function playMusic() {
  if (!bgMusic) return;

  try {
    await bgMusic.play();
    document.body.classList.add("music-playing");

    if (musicToggle) {
      musicToggle.setAttribute("aria-pressed", "true");
    }

    if (musicText) {
      musicText.textContent = "Sonando";
    }
  } catch (error) {
    if (musicText) {
      musicText.textContent = "Agrega audio";
    }
  }
}

function pauseMusic() {
  if (!bgMusic) return;

  bgMusic.pause();
  document.body.classList.remove("music-playing");

  if (musicToggle) {
    musicToggle.setAttribute("aria-pressed", "false");
  }

  if (musicText) {
    musicText.textContent = "Música";
  }
}

if (musicToggle) {
  musicToggle.addEventListener("click", () => {
    if (!bgMusic || bgMusic.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });
}

async function openFullscreen() {
  const page = document.documentElement;

  if (!page.requestFullscreen) return;

  try {
    await page.requestFullscreen();
  } catch (error) {
    // Algunos navegadores móviles no permiten pantalla completa en páginas normales.
  }
}

/* Abrir regalo */
if (openGift) {
  openGift.addEventListener("click", () => {
    openFullscreen();

    hero.style.display = "none";
    content.classList.remove("hidden");
    document.body.classList.add("story-mode");

    showSlide(0);
    playMusic();
    createConfetti();
  });
}

/* Navegación principal */
if (nextSlide) {
  nextSlide.addEventListener("click", () => {
    if (nextSlide.classList.contains("locked")) {
      shakeButton(nextSlide);
      return;
    }

    if (currentSlide < slides.length - 1) {
      currentSlide++;
      showSlide(currentSlide);
    }
  });
}

if (prevSlide) {
  prevSlide.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide--;
      showSlide(currentSlide, true);
    }
  });
}

function showSlide(index, goingBack = false) {
  currentSlide = index;

  slides.forEach((slide) => {
    slide.classList.remove("active");
    slide.classList.remove("back");
  });

  if (goingBack) {
    slides[index].classList.add("back");
  }

  setTimeout(() => {
    slides[index].classList.add("active");
    slides[index].classList.remove("back");
  }, 30);

  if (slideCounter) {
    slideCounter.textContent = `${index + 1} / ${slides.length}`;
  }

  progressHearts.forEach((heart, heartIndex) => {
    heart.classList.toggle("active", heartIndex <= index);
    heart.classList.toggle("current", heartIndex === index);
  });

  if (prevSlide) {
    prevSlide.disabled = index === 0;
  }

  if (nextSlide) {
    nextSlide.disabled = index === slides.length - 1;
    nextSlide.style.display = index === slides.length - 1 ? "none" : "inline-flex";
    nextSlide.textContent = nextSlideLabels[index] || "Abrir otro detalle ✨";
  }

  checkSlideLock();
}

function checkSlideLock() {
  const slide = slides[currentSlide];

  if (!slide || !nextSlide) return;

  if (slide.dataset.lock === "true" && !completedSlides.has(currentSlide)) {
    nextSlide.classList.add("locked");
  } else {
    nextSlide.classList.remove("locked");
  }
}

function completeCurrentSlide() {
  completedSlides.add(currentSlide);

  if (nextSlide) {
    nextSlide.classList.remove("locked");
  }
}

/* Corazones interactivos */
missionHearts.forEach((heart) => {
  const unlockHeart = () => {
    if (heart.classList.contains("active")) return;

    heart.classList.add("active");
    touchedHearts++;

    if (touchedHearts === 1) {
      heartMissionText.textContent = "tu forma de ser me encanta 💜";
      createMiniConfetti();
    }

    if (touchedHearts === 2) {
      heartMissionText.textContent = "incluso lejos, te pienso muchísimo 💜";
      createMiniConfetti();
    }

    if (touchedHearts === 3) {
      heartMissionText.textContent = "eres increíblemente especial para mí ✨";
      completeCurrentSlide();
      createConfetti();
    }
  };

  heart.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    unlockHeart();
  });

  heart.addEventListener("click", () => {
    unlockHeart();
  });
});

/* Tarjetitas */
reasonCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
    completeCurrentSlide();
    createMiniConfetti();
  });
});

/* Galería */
if (nextMemory) {
  nextMemory.addEventListener("click", () => {
    memoryIndex++;

    if (memoryIndex >= memoryCards.length) {
      memoryIndex = 0;
    }

    showMemory(memoryIndex);
  });
}

if (prevMemory) {
  prevMemory.addEventListener("click", () => {
    memoryIndex--;

    if (memoryIndex < 0) {
      memoryIndex = memoryCards.length - 1;
    }

    showMemory(memoryIndex);
  });
}

function showMemory(index) {
  memoryCards.forEach((card) => {
    card.classList.remove("active");
  });

  if (memoryCards[index]) {
    memoryCards[index].classList.add("active");
  }

  if (memoryCounter) {
    memoryCounter.textContent = `${index + 1} / ${memoryCards.length}`;
  }

  createMiniConfetti();
}

/* Carta */
if (openLetter) {
  openLetter.addEventListener("click", () => {
    letterPaper.classList.remove("hidden");
    openLetter.style.display = "none";

    letterLines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add("visible");
      }, index * 420);
    });

    completeCurrentSlide();
    createConfetti();
  });
}

/* Final */
if (candleBtn) {
  candleBtn.addEventListener("click", () => {
    candleBtn.style.display = "none";
    finalMessage.classList.remove("hidden");

    createConfetti();
    createConfetti();
  });
}

/* Corazones flotantes */
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.innerHTML = "💜";

  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = Math.random() * 4 + 5 + "s";
  heart.style.fontSize = Math.random() * 16 + 14 + "px";

  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 9000);
}

setInterval(createHeart, 450);

/* Confeti grande */
function createConfetti() {
  const colors = ["#9f7aea", "#c7a6ff", "#fff4e8", "#7b4cff", "#ffd48a"];

  for (let i = 0; i < 90; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 3500);
  }
}

/* Confeti pequeño */
function createMiniConfetti() {
  const colors = ["#9f7aea", "#c7a6ff", "#fff4e8", "#7b4cff", "#ffd48a"];

  for (let i = 0; i < 25; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = Math.random() * 1.5 + 1.5 + "s";
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 2500);
  }
}

/* Efecto cuando intenta avanzar sin completar */
function shakeButton(button) {
  button.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(0)" }
    ],
    {
      duration: 300,
      iterations: 1
    }
  );
}
