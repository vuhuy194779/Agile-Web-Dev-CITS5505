/*  Part 1: Calendar  */
const calendarHeader = document.getElementById("calendar-month");
const calendarGrid = document.getElementById("day-grid");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");
let currentDate = new Date();

const mockMarkedDates = [
    "2025-04-01", "2025-04-03", "2025-04-06", "2025-04-07",
    "2025-04-09", "2025-04-11", "2025-04-12", "2025-04-17",
    "2025-04-19", "2025-04-25", "2025-04-26"];

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstWeekDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    calendarHeader.textContent = `${year}.${month + 1}`;
    calendarGrid.innerHTML = "";

    for (let i = 0; i < firstWeekDay; i++) {
        calendarGrid.innerHTML += '<div></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isoDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const div = document.createElement("div");
        div.className = "day";
        div.textContent = day;
        if (mockMarkedDates.includes(isoDate)) {
            div.classList.add("marked");
        }
        calendarGrid.appendChild(div);
    }
}

prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

renderCalendar(currentDate);

/*  Part 2: Chart  */
function clearCanvas(id) {
    const canvas = document.getElementById(id);
    const parent = canvas.parentNode;
    parent.removeChild(canvas);
    const newCanvas = document.createElement("canvas");
    newCanvas.id = id;
    parent.appendChild(newCanvas);
}

/* Render single-dataset bar  */
function renderChart(id, type, labels, label, data, color) {
    new Chart(document.getElementById(id), {
        type,
        data: {
            labels,
            datasets: [{
                label,
                data,
                backgroundColor: type === 'bar' ? color : undefined,
                borderWidth: 2,
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

/*  Render multi-line (speed + HR) charts  */
function renderMultiLineChart({ id, labels, datasets, useDualAxis = false }) {
    new Chart(document.getElementById(id), {
        type: "line",
        data: {
            labels,
            datasets
        },
        options: {
            responsive: true,
            interaction: {
                mode: "index",
                intersect: false
            },
            scales: {
                yLeft: {
                    type: "linear",
                    position: "left",
                    title: {
                        display: true,
                        text: "Speed (km/h) / HR (bpm)"
                    },
                    beginAtZero: true
                },
                ...(useDualAxis && {
                    yRight: {
                        type: "linear",
                        position: "right",
                        title: {
                            display: true,
                            text: "Swim Pace (min/100 m)"
                        },
                        grid: {
                            drawOnChartArea: false
                        },
                        beginAtZero: false
                    }
                })
            },
            plugins: {
                legend: { position: "top" }
            }
        }
    });
}

/*  Dummy Data  */
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weeksLabel = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

/*  swim,   bike,  run  */
const speedWeek = [[2.5, 32, 11], [2.6, 30, 12], [2.4, 33, 11.5], [2.7, 31, 12.2],
[2.5, 29, 0], [2.6, 34, 13], [2.55, 0, 12.8]];  // per day
const hrWeek = [[128, 145, 152], [130, 143, 150], [127, 148, 149], [129, 146, 151],
[128, 149, 0], [131, 147, 153], [129, 0, 150]];

const speedMonth = [[2.55, 31, 11.7], [2.6, 30, 11.9], [2.5, 32, 11.6], [2.6, 31, 12.1]];
const hrMonth = [[129, 144, 151], [130, 143, 150], [0, 140, 149], [131, 146, 152]];

/* distance & duration for each period (km / hours)  swim, bike, run */
const distanceDay = [1.5, 40, 10];
const durationDay = [0.7, 1.5, 0.9]; // hours
const distanceWeek = [16.2, 120, 32];
const durationWeek = [7.5, 6, 3.8];
const distanceMonth = [200, 520, 108];
const durationMonth = [92, 24, 13]; // hours


function updateCharts(period) {
    clearCanvas("distanceChart");
    clearCanvas("timeChart");
    clearCanvas("speedChart");
    clearCanvas("heartRateChart");


    let distanceData, timeData;
    if (period === "day") {
        distanceData = distanceDay;
        timeData = durationDay;
    } else if (period === "week") {
        distanceData = distanceWeek;
        timeData = durationWeek;
    } else {
        distanceData = distanceMonth;
        timeData = durationMonth;
    }

    renderChart("distanceChart", "bar", ['Swimming', 'Cycling', 'Running'], "Distance (km)", distanceData, ['#4dc9f6', '#00a8cc', '#2a917a']);
    renderChart("timeChart", "bar", ['Swimming', 'Cycling', 'Running'], "Duration (h)", timeData, ['#f9c80e', '#f86624', '#ea3546']);

    if (period === "day") {
        renderChart("speedChart", "bar", ['Swimming', 'Cycling', 'Running'], "Avg Speed (km/h)",
            [2.5, 30, 12], ['#f9c80e', '#f86624', '#ea3546']);
        renderChart("heartRateChart", "bar", ['Swimming', 'Cycling', 'Running'], "Avg Heart Rate (bpm)",
            [135, 145, 150], ['#9966ff', '#c9cbff', '#6f42c1']);
    } else {
        let labelSet, speedSrc, hrSrc;

        if (period === "week") {
            labelSet = days;
            speedSrc = speedWeek;
            hrSrc = hrWeek;
        } else if (period === "month") {
            labelSet = weeksLabel;
            speedSrc = speedMonth;
            hrSrc = hrMonth;
        }

        const speedDatasets = [
            {
                label: "Bike (km/h)",
                data: speedSrc.map(x => x[1]),
                borderColor: "#f86624",
                yAxisID: "yLeft",
                fill: false,
                tension: 0.3
            },
            {
                label: "Run (km/h)",
                data: speedSrc.map(x => x[2]),
                borderColor: "#2a917a",
                yAxisID: "yLeft",
                fill: false,
                tension: 0.3
            },
            {
                label: "Swim (min/100 m)",
                data: speedSrc.map(x => x[0]),
                borderColor: "#4dc9f6",
                yAxisID: "yRight",
                fill: false,
                tension: 0.3
            }
        ];

        const hrDatasets = [
            {
                label: "Bike HR",
                data: hrSrc.map(x => x[1]),
                borderColor: "#f86624",
                fill: false,
                tension: 0.3
            },
            {
                label: "Run HR",
                data: hrSrc.map(x => x[2]),
                borderColor: "#2a917a",
                fill: false,
                tension: 0.3
            },
            {
                label: "Swim HR",
                data: hrSrc.map(x => x[0]),
                borderColor: "#4dc9f6",
                fill: false,
                tension: 0.3
            }
        ];

        renderMultiLineChart({
            id: "speedChart",
            labels: labelSet,
            datasets: speedDatasets,
            useDualAxis: true
        });

        renderMultiLineChart({
            id: "heartRateChart",
            labels: labelSet,
            datasets: hrDatasets
        });
    }
}

document.getElementById("periodSelect").addEventListener("change", function () {
    updateCharts(this.value);
});

updateCharts("day");