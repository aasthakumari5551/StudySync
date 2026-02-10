/* ===== ELEMENTS ===== */
const scheduleForm = document.getElementById("scheduleForm");
const scheduleList = document.getElementById("scheduleList");

let currentView = "weekly";

/* ===== LOAD SCHEDULE ===== */
function loadSchedule() {
    const schedule = getSchedule();
    scheduleList.innerHTML = "";

    if (!schedule.length) {
        scheduleList.innerHTML = `<p class="empty-msg">No schedule added yet</p>`;
        return updateDashboardSchedule();
    }

    currentView === "weekly"
        ? displayWeeklyView(schedule)
        : displayDailyView(schedule);

    updateDashboardSchedule();
}

/* ===== WEEKLY VIEW ===== */
function displayWeeklyView(schedule) {
    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    scheduleList.innerHTML = `<h3 class="schedule-title">Weekly Timetable</h3>`;

    days.forEach(day => {
        const list = schedule.filter(s => s.day === day)
            .sort((a,b) => a.startTime.localeCompare(b.startTime));

        if (!list.length) return;

        const section = document.createElement("div");
        section.innerHTML = `<h4 class="day-title">${day}</h4>`;

        list.forEach(item =>
            section.appendChild(createScheduleCard(item, schedule.indexOf(item)))
        );

        scheduleList.appendChild(section);
    });
}

/* ===== DAILY VIEW ===== */
function displayDailyView(schedule) {
    const today = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
    const todayList = schedule.filter(s => s.day === today)
        .sort((a,b) => a.startTime.localeCompare(b.startTime));

    scheduleList.innerHTML = `<h3 class="schedule-title">Today (${today})</h3>`;

    if (!todayList.length)
        return scheduleList.innerHTML += `<p class="empty-msg">No classes today</p>`;

    todayList.forEach(item =>
        scheduleList.appendChild(createScheduleCard(item, schedule.indexOf(item)))
    );
}

/* ===== CREATE CARD ===== */
function createScheduleCard(item, index) {
    const card = document.createElement("div");
    card.className = "schedule-card";

    card.innerHTML = `
        <div>
            <h4>${item.subject}</h4>
            <small>${formatTime(item.startTime)} - ${formatTime(item.endTime)} • ${item.day}</small>
        </div>
        <div class="card-actions">
            <button onclick="editSchedule(${index})">Edit</button>
            <button class="danger" onclick="deleteSchedule(${index})">Delete</button>
        </div>
    `;
    return card;
}

/* ===== HELPERS ===== */
function formatTime(t) {
    let [h,m] = t.split(":");
    h = +h;
    return `${h % 12 || 12}:${m} ${h >= 12 ? "PM" : "AM"}`;
}

/* ===== SWITCH VIEW ===== */
function switchView(view) {
    currentView = view;
    document.querySelectorAll(".view-btn").forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");
    loadSchedule();
}

/* ===== ADD ===== */
scheduleForm.addEventListener("submit", e => {
    e.preventDefault();

    const day = scheduleDay.value;
    const subject = scheduleSubject.value.trim();
    const startTime = scheduleStartTime.value;
    const endTime = scheduleEndTime.value;

    if (!subject || startTime >= endTime)
        return alert("Invalid time range");

    const schedule = getSchedule();
    if (schedule.some(s => s.day === day && startTime < s.endTime && endTime > s.startTime))
        return alert("Time conflict!");

    schedule.push({ day, subject, startTime, endTime });
    saveSchedule(schedule);
    scheduleForm.reset();
    loadSchedule();
});

/* ===== EDIT ===== */
function editSchedule(i) {
    const schedule = getSchedule();
    const s = schedule[i];

    const subject = prompt("Edit subject:", s.subject);
    if (!subject) return;

    const start = prompt("Start time:", s.startTime);
    const end = prompt("End time:", s.endTime);
    if (!start || start >= end) return;

    if (schedule.some((x,j) => j !== i && x.day === s.day && start < x.endTime && end > x.startTime))
        return alert("Conflict detected");

    schedule[i] = { ...s, subject: subject.trim(), startTime: start, endTime: end };
    saveSchedule(schedule);
    loadSchedule();
}

/* ===== DELETE ===== */
function deleteSchedule(i) {
    const schedule = getSchedule();
    if (!confirm(`Delete "${schedule[i].subject}"?`)) return;
    schedule.splice(i,1);
    saveSchedule(schedule);
    loadSchedule();
}

/* ===== DASHBOARD ===== */
function updateDashboardSchedule() {
    const today = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
    todaySchedule.innerText = getSchedule().filter(s => s.day === today).length;
    if (typeof loadDashboard === 'function') loadDashboard();
}
