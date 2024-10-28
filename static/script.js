// script.js

document.addEventListener("DOMContentLoaded", function () {
  // Show flashcards section when the start button is clicked
  document
    .querySelector(".start-button")
    .addEventListener("click", function () {
      // Hide all sections
      document.querySelectorAll("main > section").forEach((section) => {
        section.style.display = "none";
      });

      // Show the flashcards section
      document.getElementById("flashcards").style.display = "block";
    });

  // Store flashcards and categories
  const flashcards = {};
  const categories = new Set(); // To keep track of unique categories

  // Function to update category buttons
  function updateCategories() {
    const categoryList = document.getElementById("category-list");
    categoryList.innerHTML = ""; // Clear existing categories

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = "category-button";
      button.textContent = category;
      button.addEventListener("click", () => displayCards(category));
      categoryList.appendChild(button);
    });
  }

  // Function to display cards
  function displayCards(selectedLanguage = null) {
    const cardList = document.getElementById("card-list");
    cardList.innerHTML = ""; // Clear existing cards
    const languagesToDisplay = selectedLanguage
      ? [selectedLanguage]
      : Object.keys(flashcards);

    languagesToDisplay.forEach((language) => {
      flashcards[language].forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.className = "flashcard";
        cardElement.innerHTML = `
          <div class="card-content">
            <h4>${card.front} (${language})</h4>
            <p>${card.back}</p>
          </div>
          <div class="card-actions">
            <button class="edit-card">Edit</button>
            <button class="delete-card">Delete</button>
          </div>
        `;
        cardList.appendChild(cardElement);
        animateCard(cardElement);

        // Add delete functionality
        cardElement
          .querySelector(".delete-card")
          .addEventListener("click", function () {
            const index = flashcards[language].indexOf(card);
            if (index > -1) {
              flashcards[language].splice(index, 1);
              if (flashcards[language].length === 0) {
                delete flashcards[language];
                categories.delete(language);
                updateCategories(); // Update categories
              }
            }
            cardList.removeChild(cardElement);
          });

        // Add edit functionality
        cardElement
          .querySelector(".edit-card")
          .addEventListener("click", function () {
            document.getElementById("front").value = card.front;
            document.getElementById("back").value = card.back;
            document.getElementById("language").value = card.language;
            cardList.removeChild(cardElement);
          });
      });
    });
  }

  // Function to animate card
  function animateCard(card) {
    card.classList.add("animate");
    setTimeout(() => {
      card.classList.remove("animate");
    }, 500); // Duration of the animation
  }
});

// Initialisiere die benötigten Variablen
let timeSpentToday = 0;
let daysTracked = localStorage.getItem("daysTracked")
  ? parseInt(localStorage.getItem("daysTracked"))
  : 0;
let weeksTracked = localStorage.getItem("weeksTracked")
  ? parseInt(localStorage.getItem("weeksTracked"))
  : 0;
let startTime = Date.now();

// Funktion zum Aktualisieren der Anzeige
function updateDisplay() {
  document.getElementById(
    "time-spent"
  ).innerText = `Time spent today: ${timeSpentToday} minutes`;
  document.getElementById(
    "days-count"
  ).innerText = `Days tracked: ${daysTracked}`;
  document.getElementById(
    "weeks-count"
  ).innerText = `Weeks tracked: ${weeksTracked}`;
}

// Funktion zum Zurücksetzen der täglichen Zeit und zur Aktualisierung der Statistiken
function resetDailyStats() {
  const currentDate = new Date().toDateString();
  const lastTrackedDate = localStorage.getItem("lastTrackedDate");

  // Überprüfen, ob es einen neuen Tag gibt
  if (currentDate !== lastTrackedDate) {
    daysTracked++;
    // Überprüfen, ob wir eine Woche erreicht haben
    if (daysTracked % 7 === 0) {
      weeksTracked++;
    }

    // Statistiken speichern
    localStorage.setItem("daysTracked", daysTracked);
    localStorage.setItem("weeksTracked", weeksTracked);
    localStorage.setItem("lastTrackedDate", currentDate);
    timeSpentToday = 0; // Zurücksetzen der täglichen Zeit
  }
}

// Funktion zum Aufzeichnen der verbrachten Zeit
function trackTime() {
  const currentTime = Date.now();
  const timeDiff = Math.floor((currentTime - startTime) / 60000); // Zeit in Minuten
  timeSpentToday += timeDiff;
  startTime = currentTime; // Startzeit aktualisieren
}

// Intervall für die Zeitverfolgung (alle Minute)
setInterval(() => {
  resetDailyStats();
  trackTime();
  updateDisplay();
}, 60000); // alle 60 Sekunden

document
  .getElementById("delete-language-button")
  .addEventListener("click", function () {
    const englishButton = document.getElementById("english-button");
    if (englishButton) {
      englishButton.remove(); // Entferne den „English“-Button
      this.remove(); // Entferne den „Delete Language“-Button
    }
  });

document
  .getElementById("add-language-button")
  .addEventListener("click", function () {
    const languageInput = document.getElementById("language");
    const language = languageInput.value.trim(); // Eingabe abrufen und Leerzeichen trimmen

    if (language) {
      // Erstelle ein neues Sprachelement
      const languageItem = document.createElement("div");
      languageItem.className = "language-item";

      const languageButton = document.createElement("button");
      languageButton.className = "language-button";
      languageButton.textContent = language; // Setze den Text des Buttons

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.innerHTML = "<i class='bx bx-trash'></i>"; // Mülltonne-Icon

      // Event-Listener für den neuen Löschen-Button
      deleteButton.addEventListener("click", function () {
        languageItem.remove(); // Entferne das gesamte Sprachelement
      });

      // Füge die Buttons zum Sprachelement hinzu
      languageItem.appendChild(languageButton);
      languageItem.appendChild(deleteButton);

      // Füge das neue Sprachelement zur Kategorie-Liste hinzu
      document.getElementById("category-list").appendChild(languageItem);

      // Leere das Eingabefeld nach dem Hinzufügen
      languageInput.value = "";
    } else {
      alert("Please enter a valid language name."); // Warnung, wenn das Eingabefeld leer ist
    }
  });
document
  .getElementById("english-button")
  .addEventListener("click", function () {
    const canvasContainer = document.getElementById("canvas-container");

    // Toggle die .hidden-Klasse, um den Canvas-Bereich anzuzeigen oder zu verbergen
    if (canvasContainer.classList.contains("hidden")) {
      canvasContainer.classList.remove("hidden"); // Zeigt den Canvas-Bereich an
    } else {
      canvasContainer.classList.add("hidden"); // Verbirgt den Canvas-Bereich
    }
  });
let timer;
let seconds = 0;
let isRunning = false;

const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

function updateDisplay() {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  display.textContent = `${String(minutes).padStart(2, "0")}:${String(
    secs
  ).padStart(2, "0")}`;
}

startBtn.addEventListener("click", () => {
  if (!isRunning) {
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;

    timer = setInterval(() => {
      seconds++;
      updateDisplay();
    }, 1000);
  }
});

pauseBtn.addEventListener("click", () => {
  if (isRunning) {
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;

    clearInterval(timer);
  }
});

resetBtn.addEventListener("click", () => {
  isRunning = false;
  clearInterval(timer);
  seconds = 0;
  updateDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
});
