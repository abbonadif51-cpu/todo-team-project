// ===== SÉLECTION DES ÉLÉMENTS =====
const taskInput   = document.getElementById("taskInput");
const addBtn      = document.getElementById("addBtn");
const taskList    = document.getElementById("taskList");
const taskCount   = document.getElementById("taskCount");
const clearDone   = document.getElementById("clearDone");
const filterBtns  = document.querySelectorAll(".filter-btn");

// ===== ÉTAT DE L'APPLICATION =====
let tasks = [];          // tableau des tâches
let currentFilter = "all"; // filtre actif

// ===== FONCTIONS PRINCIPALES =====

/**
 * Ajouter une nouvelle tâche
 */
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text: text,
    done: false,
  };

  tasks.push(newTask);
  taskInput.value = "";
  renderTasks();
}

/**
 * Supprimer une tâche par son id
 * @param {number} id
 */
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
}

/**
 * Basculer l'état terminé / en cours d'une tâche
 * @param {number} id
 */
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
  renderTasks();
}

/**
 * Supprimer toutes les tâches terminées
 */
function clearDoneTasks() {
  tasks = tasks.filter((task) => !task.done);
  renderTasks();
}

// ===== AFFICHAGE =====

/**
 * Afficher les tâches selon le filtre actif
 */
function renderTasks() {
  // Filtrage
  const filtered = tasks.filter((task) => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done")   return task.done;
    return true; // "all"
  });

  // Vider la liste
  taskList.innerHTML = "";

  // Message si vide
  if (filtered.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-msg";
    li.textContent = "Aucune tâche à afficher.";
    taskList.appendChild(li);
  } else {
    filtered.forEach((task) => {
      const li = document.createElement("li");
      li.className = task.done ? "done" : "";

      // Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", () => toggleTask(task.id));

      // Texte
      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = task.text;

      // Bouton supprimer
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-btn";
      deleteButton.textContent = "✕";
      deleteButton.title = "Supprimer";
      deleteButton.addEventListener("click", () => deleteTask(task.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteButton);
      taskList.appendChild(li);
    });
  }

  // Mise à jour du compteur
  const remaining = tasks.filter((t) => !t.done).length;
  taskCount.textContent = `${remaining} tâche(s) restante(s)`;
}

// ===== GESTION DES FILTRES =====
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ===== ÉVÉNEMENTS =====
addBtn.addEventListener("click", addTask);

// Ajouter avec la touche Entrée
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

clearDone.addEventListener("click", clearDoneTasks);

// ===== INITIALISATION =====
renderTasks();
