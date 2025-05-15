// --- utils: format a Date to YYYY-MM-DD using local time 
function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let currentDate = new Date();
let selectedDate = formatDate(currentDate);

const calendarHeader = document.getElementById("calendar-month");
const calendarGrid = document.getElementById("day-grid");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");
const periodSelect = document.getElementById("periodSelect");

// Prev/next month
prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    selectedDate = formatDate(currentDate);
    fetchAndRender(periodSelect.value);
});
nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    selectedDate = formatDate(currentDate);
    fetchAndRender(periodSelect.value);
});

// Switch period (day/week/month)
periodSelect.addEventListener("change", () => {
    fetchAndRender(periodSelect.value);
});

// Draw calendar for currentDate, mark and select
function renderCalendar(date) {
    const year = date.getFullYear();
    const monthIndex = date.getMonth();

    fetch(`/api/marked_dates?year=${year}&month=${monthIndex + 1}`)
        .then(res => res.json())
        .then(markedDates => {
            calendarHeader.textContent = `${monthNames[monthIndex]} ${year}`;
            calendarGrid.innerHTML = "";

            const firstDay = new Date(year, monthIndex, 1);
            const lastDay = new Date(year, monthIndex + 1, 0);
            const firstWeekday = firstDay.getDay();
            const daysInMonth = lastDay.getDate();

            // pad first week
            for (let i = 0; i < firstWeekday; i++) {
                calendarGrid.innerHTML += "<div></div>";
            }
            // each day
            for (let day = 1; day <= daysInMonth; day++) {
                const iso = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const div = document.createElement("div");
                div.className = "day";
                div.textContent = day;
                if (markedDates.includes(iso)) div.classList.add("marked");
                if (iso === selectedDate) div.classList.add("selected");
                div.addEventListener("click", () => {
                    selectedDate = iso;
                    fetchAndRender(periodSelect.value);
                });
                calendarGrid.appendChild(div);
            }
        });
}


function resetCanvas(id) {
    const old = document.getElementById(id),
        parent = old.parentNode;
    parent.removeChild(old);
    const canvas = document.createElement("canvas");
    canvas.id = id;
    parent.appendChild(canvas);
}

function drawChart(id, type, labels, label, data) {
    new Chart(document.getElementById(id), {
        type,
        data: {
            labels,
            datasets: [{
                label,
                data,
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

function drawMultiLine(id, labels, datasets, dualAxis = false) {
    const opts = {
        responsive: true,
        interaction: { mode: "index", intersect: false },
        scales: {
            yLeft: { type: "linear", position: "left", beginAtZero: true }
        },
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
        data: { labels, datasets },
        options: opts
    });
}

// Main loader
function fetchAndRender(period) {
    renderCalendar(currentDate);

    fetch(`/api/workouts?period=${period}&date=${selectedDate}`)
        .then(res => res.json())
        .then(data => {
            // clear old charts
            ["distanceChart", "timeChart", "speedChart", "heartRateChart"].forEach(resetCanvas);

            // --- Training Distance & Exercise Time (leave original logic)
            drawChart("distanceChart", "bar", data.labels, "Distance (km)", data.distance);
            drawChart("timeChart", "bar", data.labels, "Duration (h)", data.duration);

            // Speed & HR
            if (period === "day") {
                // day: bar for speed & HR
                drawChart("speedChart", "bar", data.labels, "Avg Speed (km/h)", data.speed);
                drawChart("heartRateChart", "bar", data.labels, "Avg Heart Rate (bpm)", data.heart_rate);
            } else {
                // week/month: multi-line for three sports
                // prepare 7 days or 4 weeks labels
                let labels;
                let count;
                if (period === "week") {
                    const end = new Date(selectedDate);
                    labels = [];
                    for (let i = 6; i >= 0; i--) {
                        const d = new Date(end);
                        d.setDate(end.getDate() - i);
                        labels.push(`${monthNames[d.getMonth()].slice(0, 3)} ${d.getDate()}`);
                    }
                    count = 7;
                } else {
                    labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
                    count = 4;
                }
                // ensure zeros when no data
                const rawSpeed = data.speed || [];
                const rawHR = data.heart_rate || [];
                const speedFilled = [], hrFilled = [];
                for (let i = 0; i < count; i++) {
                    speedFilled[i] = rawSpeed[i] || [0, 0, 0];
                    hrFilled[i] = rawHR[i] || [0, 0, 0];
                }

                const speedDs = [
                    { label: "Swim", data: speedFilled.map(r => r[0]), yAxisID: "yRight" },
                    { label: "Bike", data: speedFilled.map(r => r[1]), yAxisID: "yLeft" },
                    { label: "Run", data: speedFilled.map(r => r[2]), yAxisID: "yLeft" }
                ];
                drawMultiLine("speedChart", labels, speedDs, true);

                const hrDs = [
                    { label: "Swim HR", data: hrFilled.map(r => r[0]) },
                    { label: "Bike HR", data: hrFilled.map(r => r[1]) },
                    { label: "Run HR", data: hrFilled.map(r => r[2]) }
                ];
                drawMultiLine("heartRateChart", labels, hrDs);
            }
        });
}

// Initial render
document.addEventListener("DOMContentLoaded", () => {
    fetchAndRender(periodSelect.value);
});
