
// Global file list for appending
let allFiles = [];

$(document).ready(function() {
    // Initialize tabs on page load
    openTab('manual');

    // Tab switching
    $('.tablinks').on('click', function() {
        const tabName = $(this).data('tab');
        openTab(tabName);
    });


    // Toggle sport details visibility
    $('.sport-checkbox').on('change', function() {
        const sport = $(this).val();
        const $details = $(`.${sport}-details`);
        if ($(this).is(':checked')) {
            $details.show();
        } else {
            $details.hide();
            // Clear fields when unchecked
            $details.find('input').val('');
        }
    });

    // Manual form submission
    $('#manualForm').on('submit', function(e) {
        e.preventDefault();
        $('#manualError').addClass('hidden');
        $('#manualSuccess').addClass('hidden');

        const date = $('#date').val();
        const sportsData = [];
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

        // Collect data for each selected sport
        $('input[name="sport"]:checked').each(function() {
            const sport = $(this).val();
            const distance = $(`#${sport}-distance`).val();
            const time = $(`#${sport}-time`).val();
            const heartRate = $(`#${sport}-heartRate`).val();

            // Validate time format
            if (!timeRegex.test(time)) {
                $('#manualError').text(`Please enter time for ${sport} in hh:mm:ss format (e.g., 01:30:00).`).removeClass('hidden');
                return false; // Break the loop
            }

            // Validate distance
            if (!distance || distance <= 0) {
                $('#manualError').text(`Please enter a valid distance for ${sport}.`).removeClass('hidden');
                return false; // Break the loop
            }

            sportsData.push({
                sport: sport,
                distance: distance,
                time: time,
                heartRate: heartRate || null
            });
        });

        // Check if at least one sport is selected
        if (sportsData.length === 0) {
            $('#manualError').text('Please select at least one sport.').removeClass('hidden');
            return;
        }

        // If there was an error, stop submission
        if ($('#manualError').is(':visible')) {
            return;
        }

        // Placeholder for server-side submission (e.g., via AJAX to Flask)
        console.log("Submitting:", { date, sportsData });
        $('#manualSuccess').removeClass('hidden');
        $('#manualForm')[0].reset();
        $('.sport-details').hide(); // Hide all sport details after reset
    });

    // CSV form submission
    $('#csvForm').on('submit', function(e) {
        e.preventDefault();
        $('#csvError').addClass('hidden');
        $('#csvSuccess').addClass('hidden');

        if (allFiles.length === 0) {
            $('#csvError').text('Please select at least one CSV file.').removeClass('hidden');
            return;
        }

        // Placeholder for CSV parsing (to be handled server-side with Flask/pandas)
        const fileNames = allFiles.map(file => file.name);
        console.log("Selected files:", fileNames);
        $('#csvSuccess').removeClass('hidden');
        $('#csvForm')[0].reset();
        allFiles = []; // Clear file list on successful submission
        $('#fileList').empty(); // Clear displayed file list
    });

    // File input change
    $('#csvFile').on('change', function(e) {
        const newFiles = Array.from(e.target.files);
        appendFiles(newFiles);
    });

    // Drag-and-drop functionality
    $('#dropArea')
    .on('dragover', function(e) {
        e.preventDefault();
        $(this).addClass('dragover');
    })
    .on('dragleave', function() {
        $(this).removeClass('dragover');
    })
    .on('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
        const newFiles = Array.from(e.originalEvent.dataTransfer.files);
        appendFiles(newFiles);
    });
});

function openTab(tabName) {
    $('.form-section').addClass('hidden');
    $('.tablinks').removeClass('active');
    $('#' + tabName).removeClass('hidden');
    $(`.tablinks[data-tab="${tabName}"]`).addClass('active');
}

function appendFiles(newFiles) {
    // Filter out duplicates by file name
    const existingFileNames = allFiles.map(file => file.name);
    const uniqueNewFiles = newFiles.filter(file => !existingFileNames.includes(file.name));

    // Append unique new files to the global list
    allFiles = allFiles.concat(uniqueNewFiles);

    // Update the file input with the cumulative list
    const fileInput = $('#csvFile')[0];
    const dataTransfer = new DataTransfer();
    allFiles.forEach(file => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;

    // Render the updated file list
    renderFileList();
}

function renderFileList() {
    const $fileList = $('#fileList');
    $fileList.empty(); // Clear previous list for re-rendering

    $.each(allFiles, function(index, file) {
        const $fileItem = $(`
            <div class="flex justify-between items-center p-2 bg-gray-100 rounded-md mt-2">
                <span class="text-gray-700">${file.name}</span>
                <button type="button" class="text-red-500 hover:text-red-700 remove-file" data-index="${index}">✕</button>
            </div>
        `);
        $fileList.append($fileItem);
    });

    // Attach remove file handler
    $('.remove-file').on('click', function() {
        const index = $(this).data('index');
        removeFile(index);
    });
}

function removeFile(index) {
    allFiles.splice(index, 1);

    // Update the file input with the remaining files
    const fileInput = $('#csvFile')[0];
    const dataTransfer = new DataTransfer();
    allFiles.forEach(file => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;

    // Re-render the file list
    renderFileList();
}
