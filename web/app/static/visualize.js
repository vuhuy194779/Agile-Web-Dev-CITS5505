let currentDate = new Date();
let selectedDate = currentDate.toISOString().slice(0, 10);

const calendarHeader = document.getElementById("calendar-month");
const calendarGrid = document.getElementById("day-grid");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");
const periodSelect = document.getElementById("periodSelect");

// Navigate to previous month
prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    selectedDate = currentDate.toISOString().slice(0, 10);
    fetchAndRender(periodSelect.value);
});

// Navigate to next month
nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    selectedDate = currentDate.toISOString().slice(0, 10);
    fetchAndRender(periodSelect.value);
});

// Change data period (day/week/month)
periodSelect.addEventListener("change", () => {
    fetchAndRender(periodSelect.value);
});

// Display calendar for given date
function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    fetch(`/api/marked_dates?year=${year}&month=${month}`)
        .then(res => res.json())
        .then(markedDates => {
            calendarGrid.innerHTML = "";  // clear previous days

            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);
            const daysInMonth = lastDay.getDate();
            const firstWeekday = firstDay.getDay();

            // Fill empty slots for first week
            for (let i = 0; i < firstWeekday; i++) {
                calendarGrid.innerHTML += '<div></div>';
            }

            // Render each day
            for (let day = 1; day <= daysInMonth; day++) {
                const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const div = document.createElement("div");
                div.className = "day";
                div.textContent = day;

                if (markedDates.includes(iso)) div.classList.add("marked");
                if (iso === selectedDate) div.classList.add("selected");

                div.addEventListener("click", () => {
                    selectedDate = iso;
                    fetchAndRender("day");
                });

                calendarGrid.appendChild(div);
            }
        });
}

// Remove old canvas and create a new one
function resetCanvas(id) {
    const old = document.getElementById(id);
    const parent = old.parentNode;
    parent.removeChild(old);
    const canvas = document.createElement("canvas");
    canvas.id = id;
    parent.appendChild(canvas);
}

// Draw single dataset chart (bar or line)
function drawChart(id, type, labels, label, data) {
    new Chart(document.getElementById(id), {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderWidth: 2,
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Draw multi-line chart with optional dual axis
function drawMultiLine(id, labels, datasets, dualAxis = false) {
    const opts = {
        responsive: true,
        interaction: { mode: "index", intersect: false },
        scales: { yLeft: { type: "linear", position: "left", beginAtZero: true } },
        plugins: { legend: { position: "top" } }
    };
    if (dualAxis) {
        opts.scales.yRight = {
            type: "linear",
            position: "right",
            beginAtZero: false,
            grid: { drawOnChartArea: false }
        };
    }
    new Chart(document.getElementById(id), {
        type: "line",
        data: { labels: labels, datasets: datasets },
        options: opts
    });
}

// Main function: load calendar and workout charts
function fetchAndRender(period) {
    renderCalendar(currentDate);  // update calendar

    fetch(`/api/workouts?period=${period}&date=${selectedDate}`)
        .then(res => res.json())
        .then(data => {
            // Reset all chart canvases
            ["distanceChart", "timeChart", "speedChart", "heartRateChart"].forEach(resetCanvas);

            // Always draw distance and time
            drawChart("distanceChart", "bar", data.labels, "Distance (km)", data.distance);
            drawChart("timeChart", "bar", data.labels, "Duration (h)", data.duration);

            if (period === "day") {
                // Day view: bar charts for speed and heart rate
                drawChart("speedChart", "bar", data.labels, "Avg Speed (km/h)", data.speed);
                drawChart("heartRateChart", "bar", data.labels, "Avg Heart Rate (bpm)", data.heart_rate);
            } else {
                // Week/month view: multi-line charts
                const speedDs = [
                    { label: "Swim", data: data.speed.map(r => r[0]), yAxisID: "yRight" },
                    { label: "Bike", data: data.speed.map(r => r[1]), yAxisID: "yLeft" },
                    { label: "Run", data: data.speed.map(r => r[2]), yAxisID: "yLeft" }
                ];
                drawMultiLine("speedChart", data.labels, speedDs, true);

                const hrDs = [
                    { label: "Swim HR", data: data.heart_rate.map(r => r[0]) },
                    { label: "Bike HR", data: data.heart_rate.map(r => r[1]) },
                    { label: "Run HR", data: data.heart_rate.map(r => r[2]) }
                ];
                drawMultiLine("heartRateChart", data.labels, hrDs);
            }
        });
}

// Load default view (day)
fetchAndRender("day");