// TypeRacer JavaScript

// Typing phrases arrays for different difficulty levels
const easyPhrases = [
  "The cat sat on the mat",
  "A dog runs in the park",
  "The sun is very bright today",
  "I like to eat pizza",
  "Birds fly high in the sky",
  "The red car is fast",
  "She has a nice smile",
  "We play games at home",
  "The book is on the table",
  "Rain falls from the clouds",
];

const intermediatePhrases = [
  "Technology has revolutionized the way we communicate",
  "The quick brown fox jumps over the lazy dog",
  "Success comes to those who work hard and never give up",
  "Learning new skills requires patience and dedication",
  "The beautiful sunset painted the sky in vibrant colors",
  "Programming languages help us create amazing applications",
  "Exercise and healthy eating contribute to a better lifestyle",
  "Music has the power to influence our emotions deeply",
  "Environmental conservation is crucial for future generations",
  "Creativity and innovation drive progress in every field",
];

const hardPhrases = [
  "Extraordinarily sophisticated algorithms can optimize complex computational processes efficiently",
  "The juxtaposition of contemporary philosophical paradigms creates unprecedented intellectual discourse",
  "Quantum entanglement phenomena demonstrate the inexplicable interconnectedness of subatomic particles",
  "Bioengineering methodologies facilitate revolutionary breakthroughs in pharmaceutical development strategies",
  "Psycholinguistic research illuminates the intricate relationships between cognition and language acquisition",
  "Entrepreneurial ventures necessitate comprehensive market analysis and strategic risk assessment protocols",
  "Meteorological fluctuations significantly impact agricultural productivity and economic sustainability patterns",
  "Cryptocurrency blockchain technologies revolutionize decentralized financial transaction verification systems",
  "Neuroplasticity mechanisms enable adaptive cognitive restructuring throughout human developmental stages",
  "Geopolitical ramifications of international trade agreements influence macroeconomic stability indicators",
];

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("TypeRacer loaded successfully!");

  // Initialize the application
  init();
});

// Game state variables
let currentPhrase = "";
let currentDifficulty = "easy";
let gameStartTime = null;
let gameEndTime = null;
let timerInterval = null;
let isGameRunning = false;

/**
 * Initialize the TypeRacer application
 */
function init() {
  console.log("Initializing TypeRacer...");

  // Load initial phrase
  loadRandomPhrase();

  // Set initial button states
  setInitialButtonStates();

  // Add your initialization code here
  setupEventListeners();
}

/**
 * Set initial button states
 */
function setInitialButtonStates() {
  const startBtn = getElementById("startBtn");
  const stopBtn = getElementById("stopBtn");

  if (startBtn) startBtn.disabled = false;
  if (stopBtn) stopBtn.disabled = true;
}

/**
 * Set up event listeners for the application
 */
function setupEventListeners() {
  // Instructions button
  const instructionsBtn = document.querySelector(".instructions-btn");
  if (instructionsBtn) {
    instructionsBtn.addEventListener("click", function () {
      const instructionsModal = new bootstrap.Modal(
        document.getElementById("instructionsModal")
      );
      instructionsModal.show();
    });
  }

  // Difficulty selector
  const difficultySelect = getElementById("difficultySelect");
  if (difficultySelect) {
    difficultySelect.addEventListener("change", function () {
      currentDifficulty = this.value;
      loadRandomPhrase();
      updateResultsLevel();
    });
  }

  // Start button
  const startBtn = getElementById("startBtn");
  if (startBtn) {
    startBtn.addEventListener("click", startGame);
  }

  // Stop button
  const stopBtn = getElementById("stopBtn");
  if (stopBtn) {
    stopBtn.addEventListener("click", stopGame);
  }

  // Retry button
  const retryBtn = getElementById("retryBtn");
  if (retryBtn) {
    retryBtn.addEventListener("click", retryGame);
  }

  // Text input - listen for Enter key to stop game
  const textInput = getElementById("textInput");
  if (textInput) {
    textInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && isGameRunning) {
        event.preventDefault();
        stopGame();
        textInput.blur(); // Unfocus the textarea
      }
    });

    // Listen for input changes to highlight text in real-time and auto-start
    textInput.addEventListener("input", function () {
      // Auto-start game when user begins typing
      if (!isGameRunning && this.value.length === 1 && !gameStartTime) {
        autoStartGame();
      }

      if (isGameRunning) {
        highlightText();
      }
    });
  }

  console.log("Event listeners set up");
}

/**
 * Get phrases array based on difficulty level
 * @param {string} difficulty - The difficulty level (easy, intermediate, hard)
 * @returns {Array} Array of phrases for the specified difficulty
 */
function getPhrasesForDifficulty(difficulty) {
  switch (difficulty) {
    case "easy":
      return easyPhrases;
    case "intermediate":
      return intermediatePhrases;
    case "hard":
      return hardPhrases;
    default:
      return easyPhrases;
  }
}

/**
 * Get a random phrase from the specified difficulty level
 * @param {string} difficulty - The difficulty level
 * @returns {string} A random phrase
 */
function getRandomPhrase(difficulty = "easy") {
  const phrases = getPhrasesForDifficulty(difficulty);
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
}

/**
 * Load and display a random phrase based on current difficulty
 */
function loadRandomPhrase() {
  currentPhrase = getRandomPhrase(currentDifficulty);
  const textToTypeElement = getElementById("textToType");

  if (textToTypeElement) {
    textToTypeElement.innerHTML = currentPhrase; // Use innerHTML to allow HTML highlighting
    console.log(`Loaded ${currentDifficulty} phrase: "${currentPhrase}"`);
  }
}

/**
 * Update the results level display
 */
function updateResultsLevel() {
  const resultLevel = getElementById("resultLevel");
  if (resultLevel) {
    // Capitalize first letter
    const capitalizedDifficulty =
      currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
    resultLevel.textContent = capitalizedDifficulty;
  }
}

/**
 * Start the typing game
 */
function startGame() {
  console.log("Starting game...");

  // Reset results box to normal state
  setResultsBoxState("success");

  // Enable the text input
  const textInput = getElementById("textInput");
  if (textInput) {
    textInput.disabled = false;
    textInput.placeholder = "Start typing to begin...";
    textInput.focus();
    textInput.value = ""; // Clear any previous text
  }

  // Reset text highlighting
  const textToTypeElement = getElementById("textToType");
  if (textToTypeElement) {
    textToTypeElement.innerHTML = escapeHtml(currentPhrase); // Reset to plain text
  }

  // Update UI state - but don't start timer yet
  const startBtn = getElementById("startBtn");
  const stopBtn = getElementById("stopBtn");

  if (startBtn) startBtn.disabled = true;
  if (stopBtn) stopBtn.disabled = false;

  // Set game ready state (not running until user types)
  isGameRunning = false;
  gameStartTime = null;
  gameEndTime = null;
}

/**
 * Auto-start the game when user begins typing
 */
function autoStartGame() {
  console.log("Auto-starting game on first keystroke...");

  // Start the timer now
  startTimer();

  // Set game running state
  isGameRunning = true;

  // Update placeholder
  const textInput = getElementById("textInput");
  if (textInput) {
    textInput.placeholder = "Keep typing...";
  }
}

/**
 * Stop the typing game
 */
function stopGame() {
  console.log("Stopping game...");

  // Stop the timer
  stopTimer();

  // Calculate accuracy and determine result
  const textInput = getElementById("textInput");
  const typedText = textInput ? textInput.value.trim() : ""; // Trim trailing spaces
  const targetText = currentPhrase;

  // Calculate accuracy percentage
  const accuracy = calculateAccuracy(typedText, targetText);

  // Calculate WPM and get time
  calculateAndDisplayWPM();
  updateFinalTime();

  // Get the calculated values for display
  const resultTime = getElementById("resultTime");
  const resultWPM = getElementById("resultWPM");
  const time = resultTime ? resultTime.textContent : "0.00";
  const wpm = resultWPM ? parseInt(resultWPM.textContent) : 0;

  // Check for capitalization-only error
  const isCapitalizationOnly = isOnlyCapitalizationError(targetText, typedText);

  // Determine result based on accuracy and error type
  if (accuracy === 100) {
    // Perfect accuracy
    setResultsBoxState("perfect", accuracy, time, wpm);
  } else if (isCapitalizationOnly) {
    // Only capitalization error - treat as special case
    setResultsBoxState("capitalization", accuracy, time, wpm);
  } else if (accuracy >= 90) {
    // Good accuracy
    setResultsBoxState("good", accuracy, time, wpm);
  } else {
    // Poor accuracy - try again
    setResultsBoxState("tryagain", accuracy);
    resetResults();
  }

  // Disable the text input
  if (textInput) {
    textInput.disabled = true;
    textInput.placeholder = "Click the start button to begin the test";
  }

  // Update UI state
  const startBtn = getElementById("startBtn");
  const stopBtn = getElementById("stopBtn");

  if (startBtn) startBtn.disabled = false;
  if (stopBtn) stopBtn.disabled = true;

  // Set game running state
  isGameRunning = false;
}

/**
 * Retry the current game
 */
function retryGame() {
  console.log("Retrying game...");

  // Stop any running timer
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // Clear the text input
  const textInput = getElementById("textInput");
  if (textInput) {
    textInput.value = "";
    textInput.disabled = true;
    textInput.placeholder = "Click the start button to begin the test";
  }

  // Load a new random phrase
  loadRandomPhrase();

  // Reset results
  resetResults();

  // Reset results box to normal state
  setResultsBoxState("success");

  // Reset button states to initial state
  const startBtn = getElementById("startBtn");
  const stopBtn = getElementById("stopBtn");

  if (startBtn) startBtn.disabled = false;
  if (stopBtn) stopBtn.disabled = true;

  // Reset game state
  isGameRunning = false;
  gameStartTime = null;
  gameEndTime = null;
}

/**
 * Reset the results display
 */
function resetResults() {
  const resultTime = getElementById("resultTime");
  const resultWPM = getElementById("resultWPM");

  if (resultTime) resultTime.textContent = "0.00";
  if (resultWPM) resultWPM.textContent = "0";
}

/**
 * Calculate typing accuracy as a percentage
 * @param {string} expectedText - The original text that should be typed
 * @param {string} userText - The text that the user actually typed
 * @returns {number} Accuracy percentage (0-100)
 */
function calculateAccuracy(expectedText, userText) {
  if (!expectedText || expectedText.length === 0) {
    return 0;
  }

  // If user hasn't typed anything, accuracy is 0
  if (!userText || userText.length === 0) {
    return 0;
  }

  // Trim trailing spaces from user input for fairer comparison
  const trimmedUserText = userText.trim();

  let correctCharacters = 0;
  const maxLength = Math.max(expectedText.length, trimmedUserText.length);

  // Compare character by character
  for (let i = 0; i < maxLength; i++) {
    const expectedChar = i < expectedText.length ? expectedText[i] : "";
    const userChar = i < trimmedUserText.length ? trimmedUserText[i] : "";

    if (expectedChar === userChar) {
      correctCharacters++;
    }
  }

  // Calculate accuracy as a percentage
  const accuracy = (correctCharacters / expectedText.length) * 100;

  // Round to 1 decimal place and ensure it doesn't exceed 100%
  return Math.min(Math.round(accuracy * 10) / 10, 100);
}

/**
 * Check if the only error is first letter capitalization
 * @param {string} expectedText - The original text that should be typed
 * @param {string} userText - The text that the user actually typed
 * @returns {boolean} True if only first letter capitalization is wrong
 */
function isOnlyCapitalizationError(expectedText, userText) {
  // Trim trailing spaces from user input for fairer comparison
  const trimmedUserText = userText.trim();

  if (
    !expectedText ||
    !trimmedUserText ||
    expectedText.length !== trimmedUserText.length
  ) {
    return false;
  }

  // Check if first character is the only difference (case-insensitive comparison)
  if (expectedText.toLowerCase() === trimmedUserText.toLowerCase()) {
    // Check if the first character is different but same letter
    return (
      expectedText[0] !== trimmedUserText[0] &&
      expectedText[0].toLowerCase() === trimmedUserText[0].toLowerCase()
    );
  }

  return false;
}

/**
 * Set the results box state based on accuracy
 * @param {string} state - "perfect", "good", "capitalization", or "tryagain"
 * @param {number} accuracy - Accuracy percentage (0-100)
 * @param {string} time - Formatted time string (optional)
 * @param {number} wpm - Words per minute (optional)
 */
function setResultsBoxState(state, accuracy = 0, time = "", wpm = 0) {
  const resultsBox = document.querySelector(".results-box");
  const resultsHeading = document.querySelector(".results-heading");
  const resultItems = document.querySelectorAll(".result-item");

  // Remove any existing message
  const existingMsg = document.querySelector(".accuracy-message");
  if (existingMsg) {
    existingMsg.remove();
  }

  if (state === "perfect") {
    // Perfect accuracy - green background
    if (resultsBox) {
      resultsBox.style.borderColor = "#28a745"; // Green
      resultsBox.style.backgroundColor = "#d4edda"; // Light green
    }

    // Hide the result items
    resultItems.forEach((item) => {
      item.style.display = "none";
    });

    // Add perfect message with time and WPM
    if (resultsBox && resultsHeading) {
      const message = document.createElement("div");
      message.className = "accuracy-message";
      message.style.color = "#155724";
      message.style.fontWeight = "600";
      message.style.fontSize = "0.95rem";
      message.style.textAlign = "center";
      message.style.marginTop = "2rem";
      message.style.lineHeight = "1.4";
      message.innerHTML = `🎉 Well done! You got a perfect score!<br>Completed in ${time} seconds at ${wpm} words per minute`;
      resultsHeading.insertAdjacentElement("afterend", message);
    }
  } else if (state === "good") {
    // Good accuracy - blue background
    if (resultsBox) {
      resultsBox.style.borderColor = "#007bff"; // Blue
      resultsBox.style.backgroundColor = "#d1ecf1"; // Light blue
    }

    // Hide the result items
    resultItems.forEach((item) => {
      item.style.display = "none";
    });

    // Add good message with time and WPM
    if (resultsBox && resultsHeading) {
      const message = document.createElement("div");
      message.className = "accuracy-message";
      message.style.color = "#004085";
      message.style.fontWeight = "600";
      message.style.fontSize = "0.95rem";
      message.style.textAlign = "center";
      message.style.marginTop = "2rem";
      message.style.lineHeight = "1.4";
      message.innerHTML = `👍 Great job! ${accuracy}% accuracy<br>Completed in ${time} seconds at ${wpm} words per minute`;
      resultsHeading.insertAdjacentElement("afterend", message);
    }
  } else if (state === "capitalization") {
    // Capitalization error only - yellow/orange background
    if (resultsBox) {
      resultsBox.style.borderColor = "#ffc107"; // Yellow
      resultsBox.style.backgroundColor = "#fff3cd"; // Light yellow
    }

    // Hide the result items
    resultItems.forEach((item) => {
      item.style.display = "none";
    });

    // Add capitalization message with time and WPM
    if (resultsBox && resultsHeading) {
      const message = document.createElement("div");
      message.className = "accuracy-message";
      message.style.color = "#856404";
      message.style.fontWeight = "600";
      message.style.fontSize = "0.95rem";
      message.style.textAlign = "center";
      message.style.marginTop = "2rem";
      message.style.lineHeight = "1.4";
      message.innerHTML = `📝 Almost perfect! Just watch your capitalization<br>Completed in ${time} seconds at ${wpm} words per minute`;
      resultsHeading.insertAdjacentElement("afterend", message);
    }
  } else if (state === "tryagain") {
    // Poor accuracy - red background
    if (resultsBox) {
      resultsBox.style.borderColor = "#dc3545"; // Red
      resultsBox.style.backgroundColor = "#f8d7da"; // Light red
    }

    // Hide the result items
    resultItems.forEach((item) => {
      item.style.display = "none";
    });

    // Add try again message
    if (resultsBox && resultsHeading) {
      const message = document.createElement("div");
      message.className = "accuracy-message";
      message.style.color = "#721c24";
      message.style.fontWeight = "600";
      message.style.fontSize = "1rem";
      message.style.textAlign = "center";
      message.style.marginTop = "2rem";
      message.textContent = `${accuracy}% accuracy - Try again!`;
      resultsHeading.insertAdjacentElement("afterend", message);
    }
  } else {
    // Reset to normal state (success)
    if (resultsBox) {
      resultsBox.style.borderColor = "#ff8400"; // Original orange
      resultsBox.style.backgroundColor = "white"; // Original white background
    }

    // Show the result items
    resultItems.forEach((item) => {
      item.style.display = "flex";
    });
  }
}

/**
 * Start the game timer
 */
function startTimer() {
  // Record start time
  gameStartTime = new Date();
  gameEndTime = null;

  // Clear any existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  // Start interval to update timer display every 10ms
  timerInterval = setInterval(updateTimerDisplay, 10);

  console.log("Timer started");
}

/**
 * Stop the game timer
 */
function stopTimer() {
  // Record end time
  gameEndTime = new Date();

  // Clear the timer interval
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  console.log("Timer stopped");
}

/**
 * Update the timer display in real-time
 */
function updateTimerDisplay() {
  if (!gameStartTime) return;

  const currentTime = new Date();
  const elapsedMs = currentTime - gameStartTime;
  const formattedTime = formatTime(elapsedMs);

  const resultTime = getElementById("resultTime");
  if (resultTime) {
    resultTime.textContent = formattedTime;
  }
}

/**
 * Update the final time display when game ends
 */
function updateFinalTime() {
  if (!gameStartTime || !gameEndTime) return;

  const elapsedMs = gameEndTime - gameStartTime;
  const formattedTime = formatTime(elapsedMs);

  const resultTime = getElementById("resultTime");
  if (resultTime) {
    resultTime.textContent = formattedTime;
  }

  console.log(`Game completed in: ${formattedTime}`);
}

/**
 * Format time from milliseconds to seconds with 2 decimal places
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string (SS.SS)
 */
function formatTime(milliseconds) {
  const totalSeconds = milliseconds / 1000;
  return totalSeconds.toFixed(2);
}

/**
 * Calculate and display WPM (Words Per Minute)
 */
function calculateAndDisplayWPM() {
  if (!gameStartTime || !gameEndTime) {
    console.log("Cannot calculate WPM: missing start or end time");
    return;
  }

  const textInput = getElementById("textInput");
  if (!textInput) {
    console.log("Cannot calculate WPM: text input not found");
    return;
  }

  const typedText = textInput.value;
  const targetText = currentPhrase;

  // Calculate elapsed time in minutes
  const elapsedMs = gameEndTime - gameStartTime;
  const elapsedMinutes = elapsedMs / (1000 * 60);

  // Calculate WPM using different methods
  const wpm = calculateWPM(typedText, targetText, elapsedMinutes);

  // Display WPM
  const resultWPM = getElementById("resultWPM");
  if (resultWPM) {
    resultWPM.textContent = Math.round(wpm);
  }

  console.log(`WPM calculated: ${Math.round(wpm)}`);
}

/**
 * Calculate WPM based on typed text, target text, and elapsed time
 * @param {string} typedText - The text that was typed by the user
 * @param {string} targetText - The target text that should be typed
 * @param {number} elapsedMinutes - Time elapsed in minutes
 * @returns {number} Words per minute
 */
function calculateWPM(typedText, targetText, elapsedMinutes) {
  if (elapsedMinutes === 0) return 0;

  // Method 1: Count correctly typed characters (more accurate for typing tests)
  const correctChars = countCorrectCharacters(typedText, targetText);

  // Standard WPM calculation: (correct characters / 5) / minutes
  // Dividing by 5 because average word length is considered 5 characters
  const wpm = correctChars / 5 / elapsedMinutes;

  return Math.max(0, wpm); // Ensure WPM is never negative
}

/**
 * Count the number of correctly typed characters
 * @param {string} typedText - The text that was typed
 * @param {string} targetText - The target text
 * @returns {number} Number of correct characters
 */
function countCorrectCharacters(typedText, targetText) {
  let correctCount = 0;
  const minLength = Math.min(typedText.length, targetText.length);

  for (let i = 0; i < minLength; i++) {
    if (typedText[i] === targetText[i]) {
      correctCount++;
    }
  }

  return correctCount;
}

/**
 * Highlight the text in real-time as user types
 */
function highlightText() {
  const textInput = getElementById("textInput");
  const textToTypeElement = getElementById("textToType");

  if (!textInput || !textToTypeElement || !currentPhrase) return;

  const typedText = textInput.value;
  const targetText = currentPhrase;
  let highlightedHTML = "";

  // Process each character in the target text
  for (let i = 0; i < targetText.length; i++) {
    const targetChar = targetText[i];

    if (i < typedText.length) {
      // User has typed this position
      const typedChar = typedText[i];

      if (typedChar === targetChar) {
        // Correct character - highlight blue
        highlightedHTML += `<span style="background-color: #007bff; color: white;">${escapeHtml(
          targetChar
        )}</span>`;
      } else {
        // Incorrect character - highlight red
        highlightedHTML += `<span style="background-color: #dc3545; color: white;">${escapeHtml(
          targetChar
        )}</span>`;
      }
    } else {
      // User hasn't typed this character yet - no highlighting
      highlightedHTML += escapeHtml(targetChar);
    }
  }

  textToTypeElement.innerHTML = highlightedHTML;
}

/**
 * Escape HTML characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Utility function to get element by ID
 * @param {string} id - The element ID
 * @returns {HTMLElement|null} The element or null if not found
 */
function getElementById(id) {
  return document.getElementById(id);
}

/**
 * Utility function to get elements by class name
 * @param {string} className - The class name
 * @returns {HTMLCollection} Collection of elements
 */
function getElementsByClassName(className) {
  return document.getElementsByClassName(className);
}

// Add your TypeRacer game logic here
