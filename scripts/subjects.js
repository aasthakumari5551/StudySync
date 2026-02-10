/* ===== ELEMENTS ===== */
const subjectForm = document.getElementById("subjectForm");
const subjectList = document.getElementById("subjectList");

/* ===== LOAD SUBJECTS ===== */
function loadSubjects() {
    const subjects = getSubjects();
    subjectList.innerHTML = "";

    if (!subjects.length) {
        subjectList.innerHTML = `<p class="empty-msg">No subjects added yet</p>`;
        return updateDashboard();
    }

    subjects.forEach((s, i) => {
        subjectList.innerHTML += `
            <div class="subject-card ${s.priority.toLowerCase()}">
                <div>
                    <h4>${s.name}</h4>
                    <small>${s.priority} Priority</small>
                </div>
                <div class="card-actions">
                    <button onclick="editSubject(${i})">Edit</button>
                    <button class="danger" onclick="deleteSubject(${i})">Delete</button>
                </div>
            </div>
        `;
    });

    updateDashboard();
}

/* ===== ADD SUBJECT ===== */
subjectForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = subjectName.value.trim();
    if (!name) return;

    const subjects = getSubjects();
    subjects.push({ name, priority: subjectPriority.value });

    saveSubjects(subjects);
    subjectForm.reset();
    loadSubjects();
});

/* ===== DELETE SUBJECT ===== */
function deleteSubject(i) {
    const subjects = getSubjects();
    if (!confirm(`Delete "${subjects[i].name}"?`)) return;

    subjects.splice(i, 1);
    saveSubjects(subjects);
    loadSubjects();
}

/* ===== EDIT SUBJECT ===== */
function editSubject(i) {
    const subjects = getSubjects();
    const s = subjects[i];

    const name = prompt("Edit subject name:", s.name);
    if (!name || !name.trim()) return alert("Name cannot be empty");

    const priority = prompt("Priority (High, Medium, Low):", s.priority);
    if (!priority) return;

    const p = priority[0].toUpperCase() + priority.slice(1).toLowerCase();
    if (!["High", "Medium", "Low"].includes(p))
        return alert("Invalid priority");

    subjects[i] = { name: name.trim(), priority: p };
    saveSubjects(subjects);
    loadSubjects();
}

/* ===== DASHBOARD ===== */
function updateDashboard() {
    totalSubjects.innerText = getSubjects().length;
    if (typeof loadDashboard === 'function') loadDashboard();
}
