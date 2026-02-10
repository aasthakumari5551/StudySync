// app.js
// Controls navigation and app initialization

// Show selected section and hide others
function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.add("hidden");
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.remove("hidden");
    }
}

// Initialize app when page loads
window.onload = function () {
    showSection("dashboard");

    if (typeof loadSubjects === "function") {
        loadSubjects();
    }

    if (typeof loadTasks === "function") {
        loadTasks();
    }

    if (typeof loadSchedule === "function") {
        loadSchedule();
    }

    if (typeof updateAnalytics === "function") {
        updateAnalytics();
    }
};
