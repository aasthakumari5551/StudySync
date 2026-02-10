/* ===== SECTION NAVIGATION ===== */
function showSection(id) {
    // Remove active from all sections
    document.querySelectorAll(".section")
        .forEach(sec => sec.classList.remove("active"));

    // Add active to selected section
    document.getElementById(id).classList.add("active");

    // Update sidebar button active state
    document.querySelectorAll(".sidebar-nav button")
        .forEach(btn => btn.classList.remove("active"));
    
    event.target.closest("button").classList.add("active");

    // Refresh data when switching sections
    if (id === "analytics") loadAnalytics();
    if (id === "dashboard") loadDashboard();
}

/* ===== THEME TOGGLE ===== */
function toggleTheme() {
    document.body.classList.toggle("dark");
    const dark = document.body.classList.contains("dark");
    saveTheme(dark ? "dark" : "light");
    updateThemeIcon(dark);
}

function toggleThemeIcon() {
    toggleTheme();
}

function updateThemeIcon(isDark) {
    const sunElements = document.querySelectorAll(".theme-toggle .sun");
    const moonElements = document.querySelectorAll(".theme-toggle .moon");
    
    sunElements.forEach(el => {
        el.style.display = isDark ? "none" : "block";
    });
    
    moonElements.forEach(el => {
        el.style.display = isDark ? "block" : "none";
    });
}

/* ===== LOAD SAVED THEME ===== */
function applySavedTheme() {
    const dark = loadTheme() === "dark";
    document.body.classList.toggle("dark", dark);
    updateThemeIcon(dark);
}

/* ===== LOAD DASHBOARD ===== */
function loadDashboard() {
    loadDashboardSubjects();
    loadDashboardDeadlines();
    loadDashboardSchedule();
}

function loadDashboardSubjects() {
    const container = document.getElementById("dashboardSubjects");
    const subjects = getSubjects();
    
    if (!subjects.length) {
        container.innerHTML = '<p class="empty-msg">No subjects added yet</p>';
        return;
    }
    
    container.innerHTML = subjects.slice(0, 5).map(s => `
        <div class="dashboard-item ${s.priority.toLowerCase()}">
            <strong>${s.name}</strong>
            <small>${s.priority} Priority</small>
        </div>
    `).join('');
    
    if (subjects.length > 5) {
        container.innerHTML += `<small style="text-align: center; color: var(--text-light); margin-top: 0.5rem; display: block;">+${subjects.length - 5} more subjects</small>`;
    }
}

function loadDashboardDeadlines() {
    const container = document.getElementById("dashboardDeadlines");
    const tasks = getTasks();
    const today = new Date().toISOString().split("T")[0];
    
    const upcoming = tasks
        .filter(t => !t.completed)
        .sort((a, b) => a.deadline.localeCompare(b.deadline))
        .slice(0, 5);
    
    if (!upcoming.length) {
        container.innerHTML = '<p class="empty-msg">No upcoming deadlines</p>';
        return;
    }
    
    container.innerHTML = upcoming.map(t => {
        let status = '';
        if (t.deadline < today) status = 'overdue';
        else if (t.deadline === today) status = 'today';
        
        const daysLeft = Math.ceil((new Date(t.deadline) - new Date(today)) / 86400000);
        let timeText = '';
        if (daysLeft < 0) timeText = `${Math.abs(daysLeft)} days overdue`;
        else if (daysLeft === 0) timeText = 'Due today';
        else if (daysLeft === 1) timeText = 'Due tomorrow';
        else timeText = `${daysLeft} days left`;
        
        return `
            <div class="dashboard-item ${status}">
                <strong>${t.title}</strong>
                <small>${t.type} • ${timeText}</small>
            </div>
        `;
    }).join('');
}

function loadDashboardSchedule() {
    const container = document.getElementById("dashboardSchedule");
    const schedule = getSchedule();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    
    const todaySchedule = schedule
        .filter(s => s.day === today)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    if (!todaySchedule.length) {
        container.innerHTML = '<p class="empty-msg">No classes scheduled today</p>';
        return;
    }
    
    container.innerHTML = todaySchedule.map(s => {
        const formatTime = (time) => {
            const [h, m] = time.split(':');
            const hour = parseInt(h);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${m} ${ampm}`;
        };
        
        return `
            <div class="dashboard-item">
                <strong>${s.subject}</strong>
                <small>${formatTime(s.startTime)} - ${formatTime(s.endTime)}</small>
            </div>
        `;
    }).join('');
}

/* ===== APP INIT ===== */
window.onload = () => {
    // Initialize first section
    document.getElementById("dashboard").classList.add("active");
    
    // Set first sidebar nav button as active
    const navButtons = document.querySelectorAll(".sidebar-nav button");
    if (navButtons.length > 0) {
        navButtons[0].classList.add("active");
    }
    
    // Load theme and data
    applySavedTheme();
    loadSubjects();
    loadSchedule();
    loadTasks();
    loadAnalytics();
    loadDashboard();
};
