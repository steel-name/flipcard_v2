const allEmojis = ["🍕", "🐱", "🍓", "🌈", "👻", "⚽", "🚀", "🐸", "🐶", "🍔", "💎", "🎈", "🦄", "🍩", "🐼"];
const board = document.getElementById("game-board");
const levelDisplay = document.getElementById("level-display");
const scoreDisplay = document.getElementById("score-display");
const timerDisplay = document.getElementById("timer-display");
const resetBtn = document.getElementById("reset-btn");
const musicBtn = document.getElementById("music-btn");
const bgm = document.getElementById("bgm");

let level = 1;
const maxLevel = 7;
let score = 0;
let flippedCards = [];
let lock = false;
let timer;
let timeElapsed = 0;
let musicPlaying = false;

function startTimer() {
  clearInterval(timer);
  timeElapsed = 0;
  timer = setInterval(() => {
    timeElapsed++;
    timerDisplay.textContent = "Time: " + timeElapsed + "s";
  }, 1000);
}

function resetGame() {
  level = 1;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  startLevel();
}

resetBtn.addEventListener("click", resetGame);

musicBtn.addEventListener("click", () => {
  if (!musicPlaying) {
    bgm.play();
    musicBtn.textContent = "⏸ Pause Music";
  } else {
    bgm.pause();
    musicBtn.textContent = "🎵 Play Music";
  }
  musicPlaying = !musicPlaying;
});

function startLevel() {
  flippedCards = [];
  lock = false;
  board.innerHTML = "";
  startTimer();

  levelDisplay.textContent = "Level: " + level;

  const pairs = level + 1; // level 1 = 2 pasang, level 2 = 3 pasang, dst
  let emojis = allEmojis.slice(0, pairs);
  let cards = [...emojis, ...emojis];
  cards.sort(() => 0.5 - Math.random());

  const cols = Math.ceil(Math.sqrt(cards.length));
  board.style.gridTemplateColumns = `repeat(${cols}, 80px)`;

  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.innerText = emoji;

    card.addEventListener("click", () => {
      if (lock || card.classList.contains("flipped") || card.classList.contains("matched")) return;

      card.classList.add("flipped");
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        lock = true;
        const [first, second] = flippedCards;

        if (first.dataset.emoji === second.dataset.emoji) {
          first.classList.add("matched");
          second.classList.add("matched");
          flippedCards = [];
          score += Math.max(10, 30 - timeElapsed);
          scoreDisplay.textContent = "Score: " + score;

          if (document.querySelectorAll(".card.matched").length === cards.length) {
            setTimeout(() => {
              alert(`Level ${level} selesai!`);

              if (level >= maxLevel) {
                alert("🎉 Kamu menaklukkan semua level!");
                window.location.href = "ucapan.html";
              } else {
                level++;
                startLevel();
              }
            }, 500);
          } else {
            lock = false;
          }
        } else {
          setTimeout(() => {
            first.classList.remove("flipped");
            second.classList.remove("flipped");
            flippedCards = [];
            lock = false;
          }, 800);
        }
      }
    });

    board.appendChild(card);
  });
}

startLevel();
