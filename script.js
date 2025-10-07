// Variables principales
let timeLeft = 25 * 60; // 25 minutos
let timer;
let points = 0;
let isRunning = false;
let username = "";
let users = JSON.parse(localStorage.getItem("zenithv_users")) || [];

// Mostrar pantalla de nombre
const namePrompt = document.getElementById("namePrompt");
const startAppBtn = document.getElementById("startApp");
const usernameInput = document.getElementById("usernameInput");

// Al hacer clic en "Comenzar"
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

// Botones principales
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const timeDisplay = document.getElementById("time");
const pointsDisplay = document.getElementById("points");
const rankingList = document.getElementById("rankingList");

// Inicializa usuario
function initUser(name) {
  if (!users.some((u) => u.name === "Luna"))
    users.push({ name: "Luna", points: 120 });
  if (!users.some((u) => u.name === "Joaquin"))
    users.push({ name: "Joaquin", points: 95 });

  const existing = users.find((u) => u.name === name);
  if (!existing) {
    users.push({ name, points: 0 });
    saveUsers();
  }
  points = users.find((u) => u.name === name).points;
  pointsDisplay.textContent = points;
}

// Guarda usuarios en localStorage
function saveUsers() {
  localStorage.setItem("zenithv_users", JSON.stringify(users));
}

// Iniciar / pausar temporizador
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

// Reiniciar
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

// Cuando termina un pomodoro
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

// 🔔 Sonido y vibración al completar sesión
function playRewardSound() {
  const audio = new Audio(
    "https://cdn.pixabay.com/download/audio/2021/08/09/audio_2b52d5d9c2.mp3?filename=success-fanfare-trumpets-6185.mp3"
  );
  audio.volume = 0.6;
  audio.play();
}

// 🔊 Sonido y vibración por distracción
function playPenaltySound() {
  const audio = new Audio(
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_9e0a8f2a61.mp3?filename=error-126627.mp3"
  );
  audio.volume = 0.4;
  audio.play();
}

// Detectar distracciones
document.addEventListener("visibilitychange", () => {
  if (document.hidden && isRunning) {
    points = Math.max(0, points - 5);
    const user = users.find((u) => u.name === username);
    if (user) user.points = points;
    saveUsers();
    renderRanking();

    playPenaltySound();
    if (navigator.vibrate) navigator.vibrate(200);

    alert("⚠️ ¡Ups! Te distrajiste y perdiste 5 puntos");
  }
});

// 🗑️ Eliminar usuario
function deleteUser(name) {
  users = users.filter((u) => u.name.toLowerCase() !== name.toLowerCase());
  saveUsers();
  renderRanking();
  showDeleteNotification(name);
}

// 🔔 Notificación flotante al borrar
function showDeleteNotification(name) {
  const notif = document.createElement("div");
  notif.className = "delete-notif";
  notif.textContent = `🗑️ Jugador ${name} eliminado`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2000);
}

// Mostrar ranking
function renderRanking() {
  users.sort((a, b) => b.points - a.points);
  rankingList.innerHTML = "";

  users.forEach((u) => {
    const li = document.createElement("li");
    li.innerHTML = `${u.name === username ? "🔥 " : ""}${u.name} — ${u.points} pts`;

    // Mostrar botón solo si tú eres Valery
    if (username.toLowerCase() === "valery" && u.name.toLowerCase() !== "valery") {
      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.className = "deleteBtn";
      delBtn.onclick = () => {
        if (confirm(`¿Seguro que quieres borrar a ${u.name}?`)) {
          deleteUser(u.name);
        }
      };
      li.appendChild(delBtn);
    }

    rankingList.appendChild(li);
  });

  pointsDisplay.textContent = points;
}
