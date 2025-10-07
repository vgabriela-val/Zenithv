// ==========================
// 🎯 VARIABLES PRINCIPALES
// ==========================
let timeLeft = 25 * 60; // 25 minutos
let timer;
let points = 0;
let isRunning = false;
let username = "";
let users = JSON.parse(localStorage.getItem("zenithv_users")) || [];

// ==========================
// 🧍 INICIO Y NOMBRE
// ==========================
const namePrompt = document.getElementById("namePrompt");
const startAppBtn = document.getElementById("startApp");
const usernameInput = document.getElementById("usernameInput");

startAppBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (username === "") {
    alert("Por favor, escribe tu nombre para continuar.");
    return;
  }
  namePrompt.style.display = "none";
  document.querySelector(".app").style.display = "block";
  initBaseUsers();
  initUser(username);
  renderRanking();
});

// ==========================
// 🕒 BOTONES PRINCIPALES
// ==========================
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const timeDisplay = document.getElementById("time");
const pointsDisplay = document.getElementById("points");
const rankingList = document.getElementById("rankingList");

// ==========================
// 👥 USUARIOS BASE
// ==========================
function initBaseUsers() {
  const baseUsers = [
    { name: "Luna", points: 120 },
    { name: "Joaquin", points: 95 },
  ];

  baseUsers.forEach((baseUser) => {
    const exists = users.find((u) => u.name === baseUser.name);
    if (!exists) users.push(baseUser);
  });
  saveUsers();
}

// ==========================
// 👤 INICIALIZAR USUARIO
// ==========================
function initUser(name) {
  let user = users.find((u) => u.name === name);
  if (!user) {
    user = { name, points: 0 };
    users.push(user);
    saveUsers();
  }
  points = user.points;
  pointsDisplay.textContent = points;
}

// ==========================
// 💾 GUARDAR USUARIOS
// ==========================
function saveUsers() {
  localStorage.setItem("zenithv_users", JSON.stringify(users));
}

// ==========================
// ⏱️ TEMPORIZADOR
// ==========================
startBtn.addEventListener("click", () => {
  if (isRunning) {
    clearInterval(timer);
    startBtn.textContent = "Iniciar";
  } else {
    startTimer();
    startBtn.textContent = "Pausar";
  }
  isRunning = !isRunning;
});

resetBtn.addEventListener("click", resetTimer);

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      completePomodoro();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 25 * 60;
  updateDisplay();
  startBtn.textContent = "Iniciar";
  isRunning = false;
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// ==========================
// 🎉 CUANDO TERMINA UN POMODORO
// ==========================
function completePomodoro() {
  points += 10;
  const user = users.find((u) => u.name === username);
  if (user) user.points = points;
  saveUsers();
  renderRanking();

  playRewardSound();
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

  alert("🎉 ¡Sesión completada! +10 puntos 🌟");
  resetTimer();
}

// 🎵 SONIDO DE RECOMPENSA
function playRewardSound() {
  const audio = new Audio(
    "https://cdn.pixabay.com/download/audio/2021/08/09/audio_2b52d5d9c2.mp3?filename=success-fanfare-trumpets-6185.mp3"
  );
  audio.volume = 0.6;
  audio.play();
}

// ==========================
// 🏆 MOSTRAR RANKING
// ==========================
function renderRanking() {
  users.sort((a, b) => b.points - a.points);
  rankingList.innerHTML = "";
  users.forEach((u) => {
    const li = document.createElement("li");
    li.innerHTML = `${u.name === username ? "🔥 " : ""}${u.name} — ${u.points} pts`;
    rankingList.appendChild(li);
  });
  pointsDisplay.textContent = points;
}

// ==========================
// ⚠️ DETECTAR DISTRACCIÓN
// ==========================
document.addEventListener("visibilitychange", () => {
  if (document.hidden && isRunning) {
    points = Math.max(0, points - 5);
    const user = users.find((u) => u.name === username);
    if (user) user.points = points;
    saveUsers();
    renderRanking();

    playPenaltySound();
    if (navigator.vibrate) navigator.vibrate(300);
    alert("⚠️ ¡Ups! Te distrajiste y perdiste 5 puntos");
  }
});

// 🔊 SONIDO DE PENALIZACIÓN (más corto)
function playPenaltySound() {
  const audio = new Audio(
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_fdc9c6f7b1.mp3?filename=error-short-beep-125111.mp3"
  );
  audio.volume = 0.5;
  audio.play();
}

