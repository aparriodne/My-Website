// Global variables
var ball = document.getElementById("ball");
var paddle = document.getElementById("paddle");
var scoreDisplay = document.getElementById("score");
var startButton = document.getElementById("startButton");
var initialsModal = document.getElementById("initialsModal");
var initialsInput = document.getElementById("initialsInput");
var submitInitialsBtn = document.getElementById("submitInitials");
var highScoresList = document.getElementById("scoreList");
var highScores = []; // Array to store high scores
var ballX, ballY, ballSpeedX = 2, ballSpeedY = 2;
var paddleX;
var score = 0;
var gameInterval;
var gameRunning = false;
var resetScoreboardBtn = document.getElementById("resetScoreboardBtn");

function updatePaddlePosition(event) {
  var rect = document.querySelector(".container").getBoundingClientRect();
  paddleX = event.clientX - rect.left - (paddle.offsetWidth / 2);
  paddleX = Math.max(0, Math.min(paddleX, rect.width - paddle.offsetWidth));
  paddle.style.left = paddleX + "px";
}

function updateBallPosition() {
  if (!gameRunning) return;

  var containerWidth = document.querySelector(".container").clientWidth;
  var containerHeight = document.querySelector(".container").clientHeight;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX <= 0 || ballX >= containerWidth - ball.offsetWidth) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballY <= 0) {
    ballSpeedY = -ballSpeedY;
  }

  if (
    ballY + ball.offsetHeight >= containerHeight - paddle.offsetHeight &&
    ballX + ball.offsetWidth >= paddleX &&
    ballX <= paddleX + paddle.offsetWidth
  ) {
    ballSpeedY = -ballSpeedY;
    score++;
    scoreDisplay.textContent = score;
    // Increase ball speed by 3% after each paddle bounce
    ballSpeedX *= 1.03;
    ballSpeedY *= 1.03;
  }

  if (ballY + ball.offsetHeight >= containerHeight) {
    paddleMiss();
  }

  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}

function paddleMiss() {
  clearInterval(gameInterval);
  gameRunning = false;
  console.log("Paddle missed. Showing modal.");
  initialsInput.value = ""; // Clear the initials input field
  console.log("Initials input cleared:", initialsInput.value);
  initialsModal.style.display = "block";
  resetBall(); // Reset the ball position when the paddle misses
  // Reset ball speed
  ballSpeedX = 2;
  ballSpeedY = 2;
}

function submitInitials() {
  var initials = initialsInput.value.toUpperCase();
  if (!initials || initials.length !== 3) {
    alert("Please enter three initials.");
    return;
  }

  highScores.push({ initials: initials, score: score });
  highScores.sort((a, b) => b.score - a.score);
  updateHighScores();

  score = 0;
  scoreDisplay.textContent = score;
  initialsModal.style.display = "none";
}

function updateHighScores() {
  highScoresList.innerHTML = "";
  for (var i = 0; i < Math.min(highScores.length, 5); i++) {
    var li = document.createElement("li");
    li.textContent = highScores[i].initials + ": " + highScores[i].score;
    highScoresList.appendChild(li);
  }
}

function startGame() {
  resetBall(); // Ensure the ball is centered at the start of the game
  ballSpeedX = 2;
  ballSpeedY = 2;

  score = 0;
  scoreDisplay.textContent = score;

  if (!gameRunning) {
    gameRunning = true;
    gameInterval = setInterval(updateBallPosition, 10);
  }
}

function resetBall() {
  var container = document.querySelector(".container");
  ballX = container.clientWidth / 2 - ball.offsetWidth / 2;
  ballY = container.clientHeight / 2 - ball.offsetHeight / 2;
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}

// Load high scores from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  resetBall();
  loadHighScores();
});

// Function to load high scores from localStorage
function loadHighScores() {
  var storedScores = localStorage.getItem("highScores");
  if (storedScores) {
    highScores = JSON.parse(storedScores);
    updateHighScores();
  }
}

// Function to save high scores to localStorage
function saveHighScores() {
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

// Function to submit initials
function submitInitials() {
  var initials = initialsInput.value.toUpperCase();
  if (!initials || initials.length !== 3) {
    alert("Please enter three initials.");
    return;
  }

  highScores.push({ initials: initials, score: score });
  highScores.sort((a, b) => b.score - a.score);
  updateHighScores();
  saveHighScores(); // Save high scores to localStorage

  score = 0;
  scoreDisplay.textContent = score;
  initialsModal.style.display = "none";
}

// Function to reset the scoreboard
function resetScoreboard() {
  highScores = [];
  updateHighScores();
  saveHighScores(); // Save the empty high scores to localStorage
}

resetScoreboardBtn.addEventListener("click", resetScoreboard);
document.addEventListener("mousemove", updatePaddlePosition);
startButton.addEventListener("click", startGame);
submitInitialsBtn.addEventListener("click", submitInitials);
document.getElementById('goToMain').addEventListener('click', function() {
  window.location.href = 'Main.html';
});
