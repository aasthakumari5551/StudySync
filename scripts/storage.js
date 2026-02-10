/* ================= LOCAL STORAGE KEYS ================= */
const SUBJECT_KEY = "subjects";
const TASK_KEY = "tasks";
const SCHEDULE_KEY = "schedule";
const THEME_KEY = "theme";

/* ================= GENERIC HELPERS ================= */
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

/* ================= SUBJECT STORAGE ================= */
function getSubjects() {
    return loadData(SUBJECT_KEY);
}

function saveSubjects(subjects) {
    saveData(SUBJECT_KEY, subjects);
}

/* ================= TASK STORAGE ================= */
function getTasks() {
    const tasks = loadData(TASK_KEY);
    // Add IDs to tasks that don't have them (for backward compatibility)
    let needsSave = false;
    tasks.forEach(task => {
        if (!task.id) {
            task.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            needsSave = true;
        }
    });
    if (needsSave) saveData(TASK_KEY, tasks);
    return tasks;
}

function saveTasks(tasks) {
    saveData(TASK_KEY, tasks);
}

/* ================= SCHEDULE STORAGE ================= */
function getSchedule() {
    return loadData(SCHEDULE_KEY);
}

function saveSchedule(schedule) {
    saveData(SCHEDULE_KEY, schedule);
}

/* ================= THEME STORAGE ================= */
function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
}

function loadTheme() {
    return localStorage.getItem(THEME_KEY);
}

/* ================= EXPORT DATA ================= */
function exportData() {
    const data = {
        subjects: getSubjects(),
        tasks: getTasks(),
        schedule: getSchedule()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "study_planner_data.json";
    link.click();
}

/* ================= RESET DATA ================= */
function resetData() {
    if (confirm("Are you sure you want to delete all data?")) {
        localStorage.clear();
        location.reload();
    }
}
