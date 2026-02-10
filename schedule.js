// schedule.js
// Handles study schedule logic

let schedules = [];

// Add schedule with conflict check
function addSchedule() {
    const subjectInput = document.getElementById("scheduleSubject");
    const startInput = document.getElementById("startTime");
    const endInput = document.getElementById("endTime");

    const subject = subjectInput.value.trim();
    const startTime = startInput.value;
    const endTime = endInput.value;

    if (!subject || !startTime || !endTime) {
        alert("Please fill all fields");
        return;
    }

    if (startTime >= endTime) {
        alert("End time must be after start time");
        return;
    }

    // Conflict detection
    const conflict = schedules.some(s =>
        startTime < s.end && endTime > s.start
    );

    if (conflict) {
        alert("Schedule conflict detected!");
        return;
    }

    const schedule = {
        id: Date.now(),
        subject,
        start: startTime,
        end: endTime
    };

    schedules.push(schedule);

    subjectInput.value = "";
    startInput.value = "";
    endInput.value = "";

    saveSchedule();
    renderSchedule();
    updateTodaySchedule();
}

// Render schedules
function renderSchedule() {
    const list = document.getElementById("scheduleList");
    if (!list) return;

    list.innerHTML = "";

    schedules.forEach(item => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span>${item.subject} (${item.start} - ${item.end})</span>
            <button onclick="deleteSchedule(${item.id})">Delete</button>
        `;

        list.appendChild(li);
    });
}

// Delete schedule
function deleteSchedule(id) {
    schedules = schedules.filter(item => item.id !== id);
    saveSchedule();
    renderSchedule();
    updateTodaySchedule();
}

// Save to LocalStorage
function saveSchedule() {
    localStorage.setItem("schedule", JSON.stringify(schedules));
}

// Load from LocalStorage
function loadSchedule() {
    const data = localStorage.getItem("schedule");
    if (data) {
        schedules = JSON.parse(data);
        renderSchedule();
        updateTodaySchedule();
    }
}

// Update dashboard schedule
function updateTodaySchedule() {
    const list = document.getElementById("todaySchedule");
    if (!list) return;

    list.innerHTML = "";

    schedules.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.subject}: ${item.start} - ${item.end}`;
        list.appendChild(li);
    });
}
