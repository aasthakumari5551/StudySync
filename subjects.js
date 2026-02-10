// subjects.js
// Handles subject management logic

let subjects = [];

// Add new subject
function addSubject() {
    const nameInput = document.getElementById("subjectName");
    const priorityInput = document.getElementById("subjectPriority");

    const name = nameInput.value.trim();
    const priority = priorityInput.value;

    if (name === "") {
        alert("Please enter subject name");
        return;
    }

    const subject = {
        id: Date.now(),
        name: name,
        priority: priority
    };

    subjects.push(subject);
    nameInput.value = "";

    saveSubjects();
    renderSubjects();
    updateDashboardSubjects();
}

// Render subjects
function renderSubjects() {
    const list = document.getElementById("subjectList");
    list.innerHTML = "";

    subjects.forEach(subject => {
        const li = document.createElement("li");

        let color = "gray";
        if (subject.priority === "High") color = "red";
        if (subject.priority === "Medium") color = "orange";
        if (subject.priority === "Low") color = "green";

        li.style.borderLeft = `5px solid ${color}`;

        li.innerHTML = `
            <span>${subject.name} (${subject.priority})</span>
            <div>
                <button onclick="editSubject(${subject.id})">Edit</button>
                <button onclick="deleteSubject(${subject.id})">Delete</button>
            </div>
        `;

        list.appendChild(li);
    });
}

// Edit subject
function editSubject(id) {
    const subject = subjects.find(s => s.id === id);
    if (!subject) return;

    const newName = prompt("Edit subject name:", subject.name);
    if (!newName || newName.trim() === "") return;

    const newPriority = prompt(
        "Edit priority (High / Medium / Low):",
        subject.priority
    );

    subject.name = newName.trim();
    subject.priority = ["High", "Medium", "Low"].includes(newPriority)
        ? newPriority
        : subject.priority;

    saveSubjects();
    renderSubjects();
    updateDashboardSubjects();
}

// Delete subject
function deleteSubject(id) {
    subjects = subjects.filter(subject => subject.id !== id);
    saveSubjects();
    renderSubjects();
    updateDashboardSubjects();
}

// Save to LocalStorage
function saveSubjects() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
}

// Load from LocalStorage
function loadSubjects() {
    const data = localStorage.getItem("subjects");
    if (data) {
        subjects = JSON.parse(data);
        renderSubjects();
        updateDashboardSubjects();
    }
}

// Update dashboard count
function updateDashboardSubjects() {
    const el = document.getElementById("totalSubjects");
    if (el) {
        el.textContent = subjects.length;
    }
}
