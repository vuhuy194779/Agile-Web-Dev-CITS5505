$(document).ready(function() {
    // Mocked user list
    const users = ['runner123', 'swimmer456', 'cyclist789', 'triathlete101', 'fitfan202'];

    // Mocked chart data (from provided code)
    const chartData = {
        day: {
            distance: [1.5, 40, 10],
            speed: [7.2, 30, 12.5],
            heartRate: [135, 145, 150]
        },
        week: {
            distance: [16.2, 120, 32],
            speed: [7.2, 0, 7.0, 6.9, 0, 7.3, 7.1],
            heartRate: [135, 0, 138, 137, 0, 136, 139]
        },
        month: {
            distance: [200, 520, 108],
            speed: [7.1, 7.0, 6.9, 7.2],
            heartRate: [138, 139, 137, 140]
        },
        "6months": {
            distance: [800, 3100, 1280],
            speed: [6.9, 7.2, 6.8, 7.0, 6.7, 7.1],
            heartRate: [138, 140, 137, 136, 139, 141]
        }
    };

    // Initialize Chart.js instances
    let distanceChart, speedChart, heartRateChart;

    const distanceCanvas = document.getElementById('distanceCanvas').getContext('2d');
    const speedCanvas = document.getElementById('speedCanvas').getContext('2d');
    const heartRateCanvas = document.getElementById('heartRateCanvas').getContext('2d');

    // Common Chart.js options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#1e3c72',
                    font: {
                        size: 12
                    },
                    maxRotation: 45,
                    minRotation: 45
                },
                grid: {
                    display: false
                }
            },
            y: {
                ticks: {
                    color: '#1e3c72',
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: 'rgba(30, 60, 114, 0.1)'
                }
            }
        }
    };

    // Initialize charts with default period (Daily)
    function initializeCharts(period) {
        // Destroy existing charts if they exist
        if (distanceChart) distanceChart.destroy();
        if (speedChart) speedChart.destroy();
        if (heartRateChart) heartRateChart.destroy();

        // Distance Chart (Bar for all periods)
        const distanceLabels = ['Swimming', 'Cycling', 'Running'];
        distanceChart = new Chart(distanceCanvas, {
            type: 'bar',
            data: {
                labels: distanceLabels,
                datasets: [{
                    label: 'Distance',
                    data: chartData[period].distance,
                    backgroundColor: ['#4dc9f6', '#00a8cc', '#2a917a'],
                    borderWidth: 1
                }]
            },
            options: {
                ...commonOptions,
                scales: {
                    ...commonOptions.scales,
                    y: {
                        ...commonOptions.scales.y,
                        title: {
                            display: true,
                            text: 'Distance (km)',
                            color: '#1e3c72',
                            font: {
                                size: 12
                            }
                        },
                        beginAtZero: true
                    },
                    x: {
                        ...commonOptions.scales.x,
                        ticks: {
                            ...commonOptions.scales.x.ticks,
                            maxRotation: 0,
                            minRotation: 0
                        }
                    }
                }
            }
        });

        // Speed Chart (Bar for Daily, Line for others)
        const speedLabels = period === 'day' ? ['Swimming', 'Cycling', 'Running'] :
                           period === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
                           period === 'month' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                           ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
        speedChart = new Chart(speedCanvas, {
            type: period === 'day' ? 'bar' : 'line',
            data: {
                labels: speedLabels,
                datasets: [{
                    label: 'Avg Speed',
                    data: chartData[period].speed,
                    backgroundColor: period === 'day' ? ['#f9c80e', '#f86624', '#ea3546'] : 'rgba(0, 0, 0, 0)',
                    borderColor: '#f86624',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                ...commonOptions,
                scales: {
                    ...commonOptions.scales,
                    y: {
                        ...commonOptions.scales.y,
                        title: {
                            display: true,
                            text: 'Speed (km/h)',
                            color: '#1e3c72',
                            font: {
                                size: 12
                            }
                        },
                        beginAtZero: true,
                        max: period === 'day' ? 35 : undefined
                    },
                    x: {
                        ...commonOptions.scales.x,
                        ticks: {
                            ...commonOptions.scales.x.ticks,
                            maxRotation: period === 'day' ? 0 : 45,
                            minRotation: period === 'day' ? 0 : 45
                        }
                    }
                }
            }
        });

        // Heart Rate Chart (Bar for Daily, Line for others)
        const hrLabels = period === 'day' ? ['Swimming', 'Cycling', 'Running'] :
                         period === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
                         period === 'month' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                         ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
        heartRateChart = new Chart(heartRateCanvas, {
            type: period === 'day' ? 'bar' : 'line',
            data: {
                labels: hrLabels,
                datasets: [{
                    label: 'Avg Heart Rate',
                    data: chartData[period].heartRate,
                    backgroundColor: period === 'day' ? ['#9966ff', '#c9cbff', '#6f42c1'] : 'rgba(0, 0, 0, 0)',
                    borderColor: '#9966ff',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                ...commonOptions,
                scales: {
                    ...commonOptions.scales,
                    y: {
                        ...commonOptions.scales.y,
                        title: {
                            display: true,
                            text: 'Heart Rate (bpm)',
                            color: '#1e3c72',
                            font: {
                                size: 12
                            }
                        },
                        beginAtZero: false,
                        min: period === 'day' ? 120 : undefined,
                        max: period === 'day' ? 160 : undefined
                    },
                    x: {
                        ...commonOptions.scales.x,
                        ticks: {
                            ...commonOptions.scales.x.ticks,
                            maxRotation: period === 'day' ? 0 : 45,
                            minRotation: period === 'day' ? 0 : 45
                        }
                    }
                }
            }
        });
    }

    // Toggle sport details visibility when session is selected
    $('.session-checkbox').on('change', function() {
        const sessionId = $(this).data('session-id');
        const $sportDetails = $(this).closest('.workout-card').find('.sport-details');
        if ($(this).is(':checked')) {
            $sportDetails.removeClass('hidden');
        } else {
            $sportDetails.addClass('hidden');
            $sportDetails.find('.sport-checkbox').prop('checked', false);
        }
        updateShareButtonState();
    });

    // Toggle chart visibility
    $('.chart-checkbox').on('change', function() {
        const chartId = $(this).attr('id').replace('chart-', '');
        if ($(this).is(':checked')) {
            $(`#${chartId}-chart`).removeClass('hidden');
        } else {
            $(`#${chartId}-chart`).addClass('hidden');
        }
        updateShareButtonState();
    });

    // Update charts based on period
    $('#periodSelector').on('change', function() {
        const period = $(this).val();
        initializeCharts(period);
    });

    // Initialize charts with default period
    initializeCharts('day');

    // User search with dropdown
    $('#userSearch').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        const $dropdown = $('#userDropdown');
        $dropdown.empty().addClass('hidden');

        if (searchTerm) {
            const filteredUsers = users.filter(user => user.toLowerCase().includes(searchTerm));
            if (filteredUsers.length > 0) {
                filteredUsers.forEach(user => {
                    if (!$('#selectedUsers').find(`[data-username="${user}"]`).length) {
                        $dropdown.append(`<div class="user-option" data-username="${user}">${user}</div>`);
                    }
                });
                $dropdown.removeClass('hidden');
            }
        }
    });

    // Select user from dropdown
    $(document).on('click', '.user-option', function() {
        const username = $(this).data('username');
        const $selectedUsers = $('#selectedUsers');
        $selectedUsers.append(`
            <div class="user-tag" data-username="${username}">
                ${username}
                <span class="remove-user">✕</span>
            </div>
        `);
        $('#userSearch').val('');
        $('#userDropdown').addClass('hidden');
        updateShareButtonState();
    });

    // Remove selected user
    $(document).on('click', '.remove-user', function() {
        $(this).closest('.user-tag').remove();
        updateShareButtonState();
    });

    // Hide dropdown when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#userSearch, #userDropdown').length) {
            $('#userDropdown').addClass('hidden');
        }
    });

    // Update share button state
    function updateShareButtonState() {
        const anySessionSelected = $('.session-checkbox:checked').length > 0;
        const anyChartSelected = $('.chart-checkbox:checked').length > 0;
        const anyUserSelected = $('#selectedUsers .user-tag').length > 0;
        // Enable "Share Selected" if either a session or a chart is selected
        $('#shareSelectedBtn').prop('disabled', !(anySessionSelected || anyChartSelected));
        // Enable "Share" in modal if (sessions or charts) AND users are selected
        $('#shareBtn').prop('disabled', !((anySessionSelected || anyChartSelected) && anyUserSelected));
    }

    // Share selected button click
    $('#shareSelectedBtn').on('click', function() {
        const selectedData = [];
        $('.session-checkbox:checked').each(function() {
            const sessionId = $(this).data('session-id');
            const date = $(this).closest('.workout-card').find('h2').text().replace('Workout on ', '');
            const sportsData = [];
            $(`.sport-checkbox[data-session-id="${sessionId}"]:checked`).each(function() {
                const sport = $(this).data('sport');
                const sportData = {
                    sport: sport,
                    distance: $(this).closest('.border-l-4').find('p:eq(0)').text().replace('Distance: ', ''),
                    time: $(this).closest('.border-l-4').find('p:eq(1)').text().replace('Time: ', ''),
                    heartRate: $(this).closest('.border-l-4').find('p:eq(2)').text().replace('Heart Rate: ', '').replace(' bpm', '') || null
                };
                sportsData.push(sportData);
            });
            selectedData.push({ date: date, sportsData: sportsData.length > 0 ? sportsData : null });
        });

        const selectedCharts = [];
        $('.chart-checkbox:checked').each(function() {
            const chartType = $(this).attr('id').replace('chart-', '');
            const period = $('#periodSelector').val();
            selectedCharts.push({
                type: chartType,
                period: period,
                data: chartData[period][chartType]
            });
        });

        const shareData = {
            workouts: selectedData.length > 0 ? selectedData : null,
            charts: selectedCharts.length > 0 ? selectedCharts : null
        };

        console.log("Selected data to share:", shareData);
        $('#shareModal').show();
    });

    // Share button in modal
    $('#shareBtn').on('click', function() {
        const selectedUsers = [];
        $('#selectedUsers .user-tag').each(function() {
            selectedUsers.push($(this).data('username'));
        });
        console.log("Sharing with users:", selectedUsers);
        alert("Data shared with selected users! (Simulated)");
        $('#shareModal').hide();
    });

    // Close modal
    $('#closeModalBtn').on('click', function() {
        $('#shareModal').hide();
    });

    // Close modal when clicking outside
    $(document).on('click', function(e) {
        if ($(e.target).hasClass('modal-backdrop')) {
            $('#shareModal').hide();
        }
    });
});
