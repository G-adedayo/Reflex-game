let gameActive = false;
let score = 0;
let missed = 0;
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0; // Retrieve high score if it exists
let gameTimer;
let shapeTimeout;
let difficulty = "";

// Difficulty level timers
const difficultyTimers = {
  easy: 1200,   // 1.2 seconds per shape
  medium: 1000, // 1 second per shape
  hard: 800    // 0.8 seconds per shape
};

// Initialize high score display on load
document.getElementById("high-score").innerText = `High Score: ${highScore}`;

// Selects the difficulty level and displays the game screen
function selectDifficulty(level) {
  difficulty = level;
  document.getElementById("home-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
}

// Starts the game
function startGame() {
  if (!difficulty) {
    alert("Select a difficulty level.");
    return;
  }
  gameActive = true;
  score = 0;
  missed = 0;
  updateScore();
  updateMissed();
  gameTimer = setTimeout(endGame, 30 * 60 * 1000); // 30 minutes game end
  generateShapes();
}

// Stops the game
function stopGame() {
  gameActive = false;
  clearTimeout(shapeTimeout);
}

// Continues the game after stopping
function continueGame() {
  if (gameActive) return; // If game is active, ignore
  gameActive = true;
  generateShapes();
}

// Restarts the game
function restartGame() {
  stopGame();
  startGame();
}

// Quits the game, returns to the home screen, and updates high score
function quitGame() {
  stopGame();
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore); // Save new high score to localStorage
  }
  document.getElementById("high-score").innerText = `High Score: ${highScore}`;
  document.getElementById("home-screen").style.display = "block";
  document.getElementById("game-screen").style.display = "none";
}

// Ends the game after time limit
function endGame() {
  gameActive = false;
  clearTimeout(shapeTimeout);
  clearTimeout(gameTimer);
  alert(`Time up! Score: ${score} | Missed: ${missed}`);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore); // Save new high score to localStorage
  }
  document.getElementById("high-score").innerText = `High Score: ${highScore}`;
}

// Updates score display
function updateScore() {
  document.getElementById("score").innerText = `Score: ${score}`;
}

// Updates missed display
function updateMissed() {
  document.getElementById("missed").innerText = `Missed: ${missed}`;
}

// Generates shapes in the game area
function generateShapes() {
  if (!gameActive) return;

  const gameArea = document.getElementById("shape-container");
  gameArea.innerHTML = ""; // Clear existing shapes

  const shape = createRandomShape();
  gameArea.appendChild(shape);

  // Calculate the maximum allowable left and top positions for the shape
  const maxLeft = gameArea.clientWidth - shape.offsetWidth;
  const maxTop = gameArea.clientHeight - shape.offsetHeight;

  // Generate random positions within bounds
  const randomLeft = Math.floor(Math.random() * maxLeft);
  const randomTop = Math.floor(Math.random() * maxTop);

  // Set the shape's position
  shape.style.left = `${randomLeft}px`;
  shape.style.top = `${randomTop}px`;

  let shapeClicked = false;

  // Shape click event
  shape.addEventListener("click", () => {
    if (!shapeClicked && gameActive) {
      shapeClicked = true;
      score++;
      updateScore();
      shape.remove();
      generateShapes();
    }
  });

  // Shape timeout for missed shapes
  shapeTimeout = setTimeout(() => {
    if (!shapeClicked && gameActive) {
      missed++;
      updateMissed();
      showMissedMessage(); // Display "Missed!" message
      shape.remove();
      generateShapes();
    }
  }, difficultyTimers[difficulty]);
}

// Creates a random shape element
function createRandomShape() {
  const shapes = ["circle", "square", "rectangle", "rhombus", "kite", "parallelogram"];
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  const shape = document.createElement("div");
  shape.classList.add("shape", randomShape);
  return shape;
}

// Displays "Missed!" message
function showMissedMessage() {
  const gameArea = document.getElementById("shape-container");
  const missedMessage = document.createElement("div");
  missedMessage.innerText = "Missed!";
  missedMessage.classList.add("missed-message");

  gameArea.appendChild(missedMessage);

  setTimeout(() => {
    missedMessage.remove();
  }, 1000); // Display "Missed!" message for 1 second
}
