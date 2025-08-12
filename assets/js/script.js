// TypeRacer JavaScript

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("TypeRacer loaded successfully!");

  // Initialize the application
  init();
});

/**
 * Initialize the TypeRacer application
 */
function init() {
  console.log("Initializing TypeRacer...");

  // Add your initialization code here
  setupEventListeners();
}

/**
 * Set up event listeners for the application
 */
function setupEventListeners() {
  // Add event listeners here as needed
  console.log("Event listeners set up");
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
