// storage.js
// Handles app-level storage utilities

// Reset all stored data
function resetData() {
    if (confirm("Are you sure you want to reset all data?")) {
        localStorage.clear();
        location.reload();
    }
}

// Export data as JSON file
function exportData() {
    const data = {
        subjects: JSON.parse(localStorage.getItem("subjects")) || [],
        tasks: JSON.parse(localStorage.getItem("tasks")) || [],
        schedule: JSON.parse(localStorage.getItem("schedule")) || [],
        theme: localStorage.getItem("theme") || "light"
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "study_planner_data.json";
    link.click();
}

// Toggle dark / light theme with persistence
function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Apply saved theme on load
(function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }
})();
