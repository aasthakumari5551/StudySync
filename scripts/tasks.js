/* ===== ELEMENTS ===== */
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

let currentTaskFilter = "all";

/* ===== LOAD TASKS ===== */
function loadTasks() {
    const tasks = getTasks();
    const today = new Date().toISOString().split("T")[0];
    taskList.innerHTML = "";

    if (!tasks.length) {
        taskList.innerHTML = `<p class="empty-msg">No tasks yet</p>`;
        return updateTaskStats();
    }

    const filtered = filterTasks(tasks, today);
    if (!filtered.length) {
        taskList.innerHTML = `<p class="empty-msg">No tasks in this category</p>`;
        return updateTaskStats();
    }

    filtered
        .sort((a,b) => a.deadline.localeCompare(b.deadline))
        .forEach(t => taskList.appendChild(
            createTaskCard(t, today)
        ));

    updateTaskStats();
    updateDashboardAlerts();
}

/* ===== FILTER ===== */
function filterTasks(tasks, today) {
    if (currentTaskFilter === "pending") return tasks.filter(t => !t.completed);
    if (currentTaskFilter === "overdue") return tasks.filter(t => !t.completed && t.deadline < today);
    if (currentTaskFilter === "today") return tasks.filter(t => t.deadline === today);
    if (currentTaskFilter === "completed") return tasks.filter(t => t.completed);
    return tasks;
}

/* ===== CREATE CARD ===== */
function createTaskCard(task, today) {
    const card = document.createElement("div");

    let status = "normal";
    if (task.completed) status = "done";
    else if (task.deadline < today) status = "overdue";
    else if (task.deadline === today) status = "today";

    card.className = `task-card ${status}`;

    card.innerHTML = `
        <div class="task-main">
            <span class="task-type">${task.type}</span>
            <h4 class="${task.completed ? "strike" : ""}">${task.title}</h4>
            <small>${formatDate(task.deadline)} ${getDaysLeft(task.deadline, today)}</small>
        </div>

        <div class="card-actions">
            ${task.completed
                ? `<button onclick="markIncomplete('${task.id}')">Undo</button>`
                : `<button class="success" onclick="markComplete('${task.id}')">Done</button>`
            }
            <button onclick="editTask('${task.id}')">Edit</button>
            <button class="danger" onclick="deleteTask('${task.id}')">Delete</button>
        </div>
    `;
    return card;
}

/* ===== FILTER VIEW ===== */
function filterTaskView(filter) {
    currentTaskFilter = filter;
    document.querySelectorAll(".view-btn").forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");
    loadTasks();
}

/* ===== ADD TASK ===== */
taskForm.addEventListener("submit", e => {
    e.preventDefault();

    if (!taskTitle.value || !taskDeadline.value) return;

    const tasks = getTasks();
    tasks.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: taskTitle.value.trim(),
        type: taskType.value,
        deadline: taskDeadline.value,
        completed: false
    });

    saveTasks(tasks);
    taskForm.reset();
    loadTasks();
});

/* ===== ACTIONS ===== */
function markComplete(id) {
    const t = getTasks();
    const task = t.find(task => task.id === id);
    if (task) {
        task.completed = true;
        saveTasks(t);
        loadTasks();
    }
}

function markIncomplete(id) {
    const t = getTasks();
    const task = t.find(task => task.id === id);
    if (task) {
        task.completed = false;
        saveTasks(t);
        loadTasks();
    }
}

function editTask(id) {
    const t = getTasks();
    const task = t.find(task => task.id === id);
    if (!task) return;
    
    const title = prompt("Edit task:", task.title);
    if (title === null) return;
    const date = prompt("Edit deadline:", task.deadline);
    if (date === null) return;
    
    task.title = title.trim();
    task.deadline = date;
    saveTasks(t);
    loadTasks();
}

function deleteTask(id) {
    const t = getTasks();
    const taskIndex = t.findIndex(task => task.id === id);
    if (taskIndex === -1) return;
    
    if (!confirm(`Delete "${t[taskIndex].title}"?`)) return;
    t.splice(taskIndex, 1);
    saveTasks(t);
    loadTasks();
}

/* ===== HELPERS ===== */
function formatDate(d) {
    const t = new Date().toISOString().split("T")[0];
    if (d === t) return "Today";
    return new Date(d).toDateString();
}

function getDaysLeft(d, t) {
    const diff = Math.ceil((new Date(d) - new Date(t)) / 86400000);
    if (diff < 0) return `(${Math.abs(diff)} overdue)`;
    if (diff === 0) return "";
    return `(${diff} days left)`;
}

/* ===== STATS ===== */
function updateTaskStats() {
    pendingTasks.innerText = getTasks().filter(t => !t.completed).length;
    if (typeof loadDashboard === 'function') loadDashboard();
}

function updateDashboardAlerts() {
    // This function is kept for backward compatibility but now handled in loadDashboard
    if (typeof loadDashboard === 'function') loadDashboard();
}
