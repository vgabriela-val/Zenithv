// ================================
// 🔹 VARIABLES PRINCIPALES
// ================================
let timeLeft = 25 * 60; // 25 minutos
let timer;
let points = 0;
let isRunning = false;
let username = "";
let users = JSON.parse(localStorage.getItem("zenithv_users")) || [];

// Agregar jugadores base solo una vez
if (!users.find(u => u.name === "Luna")) users.push({ name: "Luna", points: 120 });
if (!users.find(u => u.name === "Joaquin")) users.push({ name: "Joaquin", points: 95 });
saveUsers();

// ================================
// 🔹 CAPTURA DE ELEMENTOS
// ================================
const namePrompt = document.getElementById("namePrompt");
const startAppBtn = document.getElementById("startApp");
const usernameInput = document.getElementById("usernameInput");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const timeDisplay = document.getElementById("time");
const pointsDisplay = document.getElementById("points");
const rankingList = document.getElementById("rankingList");

// ================================
// 🔹 INICIO DE SESIÓN DE USUARIO
// ================================
startAppBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (username === "") {
    alert("Por favor, escribe tu nombre para continuar.");
    return;
  }
  namePrompt.style.display = "none";
  document.querySelector(".app").style.display = "block";
  initUser(username);
  renderRanking();
});

// ================================
// 🔹 FUNCIONES DE USUARIO
// ================================
function initUser(name) {
  const existing = users.find((u) => u.name === name);
  if (!existing) {
    users.push({ name, points: 0 });
    saveUsers();
  }
  points = users.find((u) => u.name === name).points;
  pointsDisplay.textContent = points;
}

function saveUsers() {
  localStorage.setItem("zenithv_users", JSON.stringify(users));
}

// ================================
// 🔹 TEMPORIZADOR PRINCIPAL
// ================================
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

// ================================
// 🔹 COMPLETAR SESIÓN (+10 puntos)
// ================================
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

// 🎵 Sonido de victoria
function playRewardSound() {
  const audio = new Audio(
    "https://cdn.pixabay.com/download/audio/2021/08/09/audio_2b52d5d9c2.mp3?filename=success-fanfare-trumpets-6185.mp3"
  );
  audio.volume = 0.6;
  audio.play();
}

// ================================
// 🔹 SONIDO Y VIBRACIÓN AL ELIMINAR
// ================================
function playDeleteSound() {
  const audio = new Audio(
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_5b0eb14cf3.mp3?filename=delete-item-14874.mp3"
  );
  audio.volume = 0.6;
  audio.play();
  if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
}

// ================================
// 🔹 RANKING (solo tú ves los botones borrar)
// ================================
function renderRanking() {
  users.sort((a, b) => b.points - a.points);
  rankingList.innerHTML = "";
  users.forEach((u) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${u.name === username ? "🔥 " : ""}${u.name} — ${u.points} pts
      ${username.toLowerCase() === "valery" ? `<button class="deleteBtn" data-name="${u.name}" style="margin-left:8px; background:#ff6961; border:none; border-radius:6px; color:white; cursor:pointer;">❌</button>` : ""}
    `;
    rankingList.appendChild(li);
  });
  pointsDisplay.textContent = points;

  // Escuchar clics solo si eres tú (Valery 💅)
  if (username.toLowerCase() === "valery") {
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const nameToDelete = e.target.dataset.name;
        if (confirm(`¿Seguro que quieres borrar a ${nameToDelete}?`)) {
          deleteUser(nameToDelete);
          playDeleteSound();
          renderRanking();
        }
      });
    });
  }
}

// 🗑️ Borrar usuario
function deleteUser(name) {
  users = users.filter(u => u.name.toLowerCase() !== name.toLowerCase());
  saveUsers();
}

// ================================
// 🔹 DISTRACCIÓN (−5 puntos)
// ================================
function playPenaltySound() {
  const audio = new Audio(
    "https://cdn.pixabay.com/download/audio/2024/04/24/audio_84fba6a1a2.mp3?filename=negative-beep-155480.mp3"
  ); // versión más corta
  audio.volume = 0.5;
  audio.play();
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden && isRunning) {
    points = Math.max(0, points - 5);
    const user = users.find((u) => u.name === username);
    if (user) user.points = points;
    saveUsers();
    renderRanking();

    playPenaltySound();
    if (navigator.vibrate) navigator.vibrate(150);
    alert("⚠️ ¡Ups! Te distrajiste y perdiste 5 puntos");
  }
});


