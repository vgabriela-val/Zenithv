let timer;
let timeLeft = 25 * 60; // 25 minutos
let isRunning = false;
let points = 0;

const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const pointsDisplay = document.getElementById("points");
const yourPointsDisplay = document.getElementById("yourPoints");

function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timeDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      points += 10;
      pointsDisplay.textContent = points;
      yourPointsDisplay.textContent = points;
      alert("¡Bien hecho! Has completado un Pomodoro 🎉 Ganas 10 puntos.");
      timeLeft = 5 * 60; // descanso de 5 minutos
      updateDisplay();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 25 * 60;
  updateDisplay();
}

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();
