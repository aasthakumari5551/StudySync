/* ===== CIRCULAR PROGRESS ===== */
function drawCircularProgress(id, percent, color) {
    const c = document.getElementById(id);
    if (!c) return;

    const ctx = c.getContext("2d");
    const x = c.width / 2, y = c.height / 2;
    const r = 65, w = 14;

    ctx.clearRect(0,0,c.width,c.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.strokeStyle = document.body.classList.contains('dark') ? "#334155" : "#e2e8f0";
    ctx.lineWidth = w;
    ctx.stroke();

    // Progress circle
    if (percent > 0) {
        ctx.beginPath();
        ctx.arc(x,y,r,-Math.PI/2,(Math.PI*2*percent/100)-Math.PI/2);
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        ctx.lineCap = "round";
        ctx.stroke();
    }

    // Center text
    ctx.fillStyle = document.body.classList.contains('dark') ? "#e2e8f0" : "#1e293b";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(percent + "%", x, y);
}

/* ===== BAR CHART ===== */
function drawBarChart(id, data) {
    const c = document.getElementById(id);
    if (!c) return;

    const ctx = c.getContext("2d");
    const padding = 50;
    const max = Math.max(...data.map(d => d.value), 1);
    const barCount = data.length;
    const totalWidth = c.width - padding * 2;
    const barSpacing = 40;
    const barWidth = (totalWidth - barSpacing * (barCount - 1)) / barCount;

    ctx.clearRect(0,0,c.width,c.height);

    data.forEach((d,i) => {
        const barHeight = (d.value / max) * (c.height - padding * 2);
        const x = padding + i * (barWidth + barSpacing);
        const y = c.height - padding - barHeight;

        // Draw bar
        ctx.fillStyle = d.color;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw value on top
        ctx.fillStyle = document.body.classList.contains('dark') ? "#e2e8f0" : "#1e293b";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(d.value.toString(), x + barWidth/2, y - 10);

        // Draw label below
        ctx.fillStyle = document.body.classList.contains('dark') ? "#94a3b8" : "#64748b";
        ctx.font = "14px Arial";
        ctx.fillText(d.label, x + barWidth/2, c.height - padding + 25);
    });
}

/* ===== LOAD ANALYTICS ===== */
function loadAnalytics() {
    const subjects = getSubjects();
    const tasks = getTasks();
    const schedule = getSchedule();
    const today = new Date().toISOString().split("T")[0];

    const completed = tasks.filter(t=>t.completed).length;
    const pending = tasks.length - completed;
    const overdue = tasks.filter(t=>!t.completed && t.deadline < today).length;
    const percent = tasks.length ? Math.round(completed/tasks.length*100) : 0;

    const high = subjects.filter(s=>s.priority==="High").length;
    const mid = subjects.filter(s=>s.priority==="Medium").length;
    const low = subjects.filter(s=>s.priority==="Low").length;

    analyticsData.innerHTML = `
        <div class="analytics-stats">
            <div class="stat-card">
                <div class="stat-value">${subjects.length}</div>
                <div class="stat-label">Total Subjects</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${tasks.length}</div>
                <div class="stat-label">Total Tasks</div>
            </div>
            <div class="stat-card stat-success">
                <div class="stat-value">${completed}</div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-card stat-warning">
                <div class="stat-value">${pending}</div>
                <div class="stat-label">Pending</div>
            </div>
        </div>

        <div class="analytics-charts">
            <div class="chart-card">
                <h3>Task Completion Rate</h3>
                <div class="chart-container">
                    <canvas id="completionChart" width="200" height="200"></canvas>
                </div>
            </div>
            
            <div class="chart-card">
                <h3>Subject Priority Distribution</h3>
                <div class="chart-container">
                    <canvas id="priorityChart" width="400" height="240"></canvas>
                </div>
            </div>
        </div>

        <div class="analytics-insights">
            <div class="insight-card">
                <h3>Performance Status</h3>
                <p class="insight-text">${
                    tasks.length === 0 ? "Add tasks to track your progress" :
                    percent >= 70 ? "🎉 Excellent progress! Keep up the great work!" :
                    percent >= 40 ? "✓ Good progress, keep improving!" :
                    "⚠ Needs attention - focus on completing pending tasks"
                }</p>
            </div>

            <div class="insight-card">
                <h3>Schedule Overview</h3>
                <p class="insight-text">${
                    schedule.length === 0 ? "No study sessions planned yet" :
                    `${schedule.length} study session${schedule.length !== 1 ? 's' : ''} planned this week`
                }</p>
            </div>

            ${overdue > 0 ? `
            <div class="insight-card insight-danger">
                <h3>⚠ Attention Required</h3>
                <p class="insight-text">${overdue} task${overdue !== 1 ? 's' : ''} overdue - review and complete soon</p>
            </div>` : ""}
        </div>
    `;

    setTimeout(() => {
        drawCircularProgress("completionChart", percent, "#0891b2");
        drawBarChart("priorityChart", [
            { label:"High", value:high, color:"#ef4444" },
            { label:"Medium", value:mid, color:"#f59e0b" },
            { label:"Low", value:low, color:"#10b981" }
        ]);
    }, 50);
}
