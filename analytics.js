// analytics.js
// Handles progress calculation, charts, and insights

function updateAnalytics() {
    const completedEl = document.getElementById("completedCount");
    const percentEl = document.getElementById("completionPercent");
    const progressFill = document.getElementById("progressFill");
    const insightEl = document.getElementById("progressInsight");

    if (typeof tasks === "undefined") return;

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    if (completedEl) completedEl.textContent = completed;
    if (percentEl) percentEl.textContent = percent + "%";
    if (progressFill) progressFill.style.width = percent + "%";

    // Insights
    if (insightEl) {
        if (total === 0) {
            insightEl.textContent = "No tasks added yet. Start planning!";
        } else if (percent === 100) {
            insightEl.textContent = "Excellent! All tasks completed 🎉";
        } else if (pending > completed) {
            insightEl.textContent = "You have more pending tasks than completed ones. Stay focused!";
        } else {
            insightEl.textContent = "Good progress! Keep it up 💪";
        }
    }
}
