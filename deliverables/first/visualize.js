const distanceLabels = ['Swimming', 'Cycling', 'Running'];

const calendarHeader = document.getElementById("calendar-month");
const calendarGrid = document.getElementById("day-grid");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");
let currentDate = new Date();

const mockMarkedDates = ["2025-04-01", "2025-04-03", "2025-04-06", "2025-04-07",
    "2025-04-09", "2025-04-11", "2025-04-12", "2025-04-17", "2025-04-19", "2025-04-25", "2025-04-26"];

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

function clearCanvas(id) {
    const canvas = document.getElementById(id);
    const parent = canvas.parentNode;
    parent.removeChild(canvas);
    const newCanvas = document.createElement("canvas");
    newCanvas.id = id;
    parent.appendChild(newCanvas);
}

function renderChart(id, type, labels, label, data, color) {
    new Chart(document.getElementById(id), {
        type,
        data: {
            labels,
            datasets: [{
                label,
                data,
                backgroundColor: type === 'bar' ? color : undefined,
                borderColor: type === 'line' ? color : undefined,
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/* Data not for real*/
function updateCharts(period) {
    clearCanvas("distanceChart");
    clearCanvas("speedChart");
    clearCanvas("heartRateChart");

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const months6 = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

    const speedWeek = [7.2, 0, 7.0, 6.9, 0, 7.3, 7.1];
    const hrWeek = [135, 0, 138, 137, 0, 136, 139];

    const speedMonth = [7.1, 7.0, 6.9, 7.2];
    const hrMonth = [138, 139, 137, 140];

    const speed6Month = [6.9, 7.2, 6.8, 7.0, 6.7, 7.1];
    const hr6Month = [138, 140, 137, 136, 139, 141];

    const distanceDay = [1.5, 40, 10];
    const distanceWeek = [16.2, 120, 32];
    const distanceMonth = [200, 520, 108];
    const distance6Months = [800, 3100, 1280];

    let distanceData;
    if (period === "day") distanceData = distanceDay;
    else if (period === "week") distanceData = distanceWeek;
    else if (period === "month") distanceData = distanceMonth;
    else distanceData = distance6Months;

    renderChart("distanceChart", "bar", ['Swimming', 'Cycling', 'Running'], "Distance (km)", distanceData, ['#4dc9f6', '#00a8cc', '#2a917a']);

    if (period === "day") {
        renderChart("speedChart", "bar", ['Swimming', 'Cycling', 'Running'], "Avg Speed (km/h)", [7.2, 30, 12.5], ['#f9c80e', '#f86624', '#ea3546']);
        renderChart("heartRateChart", "bar", ['Swimming', 'Cycling', 'Running'], "Avg Heart Rate (bpm)", [135, 145, 150], ['#9966ff', '#c9cbff', '#6f42c1']);
    } else if (period === "week") {
        renderChart("speedChart", "line", days, "Avg Speed (km/h)", speedWeek, "#f86624");
        renderChart("heartRateChart", "line", days, "Avg Heart Rate (bpm)", hrWeek, "#9966ff");
    } else if (period === "month") {
        renderChart("speedChart", "line", weeks, "Avg Speed (km/h)", speedMonth, "#f86624");
        renderChart("heartRateChart", "line", weeks, "Avg Heart Rate (bpm)", hrMonth, "#9966ff");
    } else if (period === "6months") {
        renderChart("speedChart", "line", months6, "Avg Speed (km/h)", speed6Month, "#f86624");
        renderChart("heartRateChart", "line", months6, "Avg Heart Rate (bpm)", hr6Month, "#9966ff");
    }
}


document.getElementById("periodSelect").addEventListener("change", function () {
    updateCharts(this.value);
});

updateCharts("day");