// tasks.js
// Handles task management logic + deadline alerts

let tasks = [];

// Add a new task
function addTask() {
    const taskNameInput = document.getElementById("taskName");
    const taskDateInput = document.getElementById("taskDate");

    const name = taskNameInput.value.trim();
    const date = taskDateInput.value;

    if (name === "" || date === "") {
        alert("Please enter task name and date");
        return;
    }

    const task = {
        id: Date.now(),
        name: name,
        date: date,
        completed: false
    };

    tasks.push(task);

    taskNameInput.value = "";
    taskDateInput.value = "";

    saveTasks();
    renderTasks();
    updatePendingTasks();
    updateAnalytics();
}

// Render task list
function renderTasks() {
    const list = document.getElementById("taskList");
    if (!list) return;

    list.innerHTML = "";

    const today = new Date().toISOString().split("T")[0];

    tasks.forEach(task => {
        const li = document.createElement("li");

        // Completed task style
        if (task.completed) {
            li.style.textDecoration = "line-through";
            li.style.opacity = "0.6";
        }

        // Overdue task style
        if (!task.completed && task.date < today) {
            li.style.borderLeft = "5px solid red";
        }

        li.innerHTML = `
            <span>
                <input type="checkbox" ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})">
                ${task.name} (Due: ${task.date})
            </span>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;

        list.appendChild(li);
    });
}

// Toggle task completion
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });

    saveTasks();
    renderTasks();
    updatePendingTasks();
    updateAnalytics();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
    updatePendingTasks();
    updateAnalytics();
}

// Save tasks to LocalStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from LocalStorage
function loadTasks() {
    const data = localStorage.getItem("tasks");
    if (data) {
        tasks = JSON.parse(data);
        renderTasks();
        updatePendingTasks();
        updateAnalytics();
        checkDeadlineAlerts();
    }
}

// Update pending task count on dashboard
function updatePendingTasks() {
    const pending = tasks.filter(task => !task.completed).length;
    const element = document.getElementById("pendingTasks");

    if (element) {
        element.textContent = pending;
    }
}

// Deadline alerts (due today)
function checkDeadlineAlerts() {
    const today = new Date().toISOString().split("T")[0];

    tasks.forEach(task => {
        if (!task.completed && task.date === today) {
            alert(`Reminder: "${task.name}" is due today!`);
        }
    });
}
