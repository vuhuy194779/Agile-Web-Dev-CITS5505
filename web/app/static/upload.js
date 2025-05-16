
let allFiles = [];

$(document).ready(function() {
    openTab('manual');

    $('.tablinks').on('click', function() {
        const tabName = $(this).data('tab');
        openTab(tabName);
    });


    $('.sport-checkbox').on('change', function() {
        const sport = $(this).attr('name');
        const $details = $(`.${sport}-details`);
        if ($(this).is(':checked')) {
            $details.show();
        } else {
            $details.hide();
            $details.find('input').val('');
        }
    });

    $('#manualForm').on('submit', function(e) {
        e.preventDefault();
        $('#manualError').addClass('hidden');
        $('#globalSuccessMessage').addClass('hidden');

        const date = $('#date').val();
        const sportsData = [];

        if (!date) {
            $('#manualError').text('Please select a date.').removeClass('hidden');
            return;
        }

        $('input[name="swimming"], input[name="cycling"], input[name="running"]').each(function() {
            const sport = $(this).attr('name');
            if ($(this).is(':checked')) {
                const distance = $(`#${sport}-distance`).val();
                const time = $(`#${sport}-time`).val();
                const heartRate = $(`#${sport}-heartRate`).val();

                if (!distance || !time) {
                    return false;
                }

                sportsData.push({
                    sport_type: sport.charAt(0).toUpperCase() + sport.slice(1),
                    time: time,
                    distance: parseFloat(distance),
                    heart_rate: heartRate || null
                });
            }
        });

        if (sportsData.length === 0) {
            $('#manualError').text('Please select at least one sport and fill in all required field for that sport.').removeClass('hidden');
            return;
        }

        $.ajax({
            url: '/upload',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ date, sportsData }),
            headers: {
                'X-CSRF-Token': $('input[name="csrf_token"]').val()
            },
            success: function(response) {
                $('#globalSuccessMessage').addClass('text-green-600').removeClass('text-red-600').removeClass('hidden').text(response.message);
                $('#manualForm')[0].reset();
                $('.sport-details').hide();
                $('input[name="swimming"], input[name="cycling"], input[name="running"]').prop('checked', false);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.error : 'An error occurred while uploading.';
                $('#globalSuccessMessage').removeClass('hidden').addClass('text-red-600').removeClass('text-green-600').text(error);
            }
        });
    });

    $('#csvForm').on('submit', function(e) {
        e.preventDefault();
        $('#csvError').addClass('hidden');
        $('#globalSuccessMessage').addClass('hidden');

        if (allFiles.length === 0) {
            $('#csvError').text('Please select at least one CSV file.').removeClass('hidden');
            return;
        }

        const formData = new FormData();
        allFiles.forEach(file => formData.append('csv_files', file));

        $.ajax({
            url: '/upload_csv',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-Token': $('#csvForm input[name="csrf_token"]').val()
            },
            success: function(response) {
                $('#globalSuccessMessage').addClass('text-green-600').removeClass('text-red-600').removeClass('hidden').text(response.message);
                $('#csvForm')[0].reset();
                allFiles = [];
                $('#fileList').empty();
                $('#uploadCsvBtn').prop('disabled', true);
            },
            error: function(xhr) {
                const error = xhr.responseJSON ? xhr.responseJSON.error : 'An error occurred while uploading CSV.';
                $('#globalSuccessMessage').removeClass('hidden').addClass('text-red-600').removeClass('text-green-600').text(error);
            }
        });
    });

    $('#csvFile').on('change', function(e) {
        const newFiles = Array.from(e.target.files);
        appendFiles(newFiles);
    });

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
    $('.tab-pane').removeClass('active');
    $('.tablinks').removeClass('active');
    $('#' + tabName).addClass('active');
    $(`.tablinks[data-tab="${tabName}"]`).addClass('active');
}

function appendFiles(newFiles) {
    const existingFileNames = allFiles.map(file => file.name);
    const uniqueNewFiles = newFiles.filter(file => !existingFileNames.includes(file.name));

    allFiles = allFiles.concat(uniqueNewFiles);

    const fileInput = $('#csvFile')[0];
    const dataTransfer = new DataTransfer();
    allFiles.forEach(file => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;

    renderFileList();
}

function renderFileList() {
    const $fileList = $('#fileList');
    $fileList.empty();

    $.each(allFiles, function(index, file) {
        const $fileItem = $(`
            <div class="flex justify-between items-center p-2 bg-gray-100 rounded-md mt-2">
                <span class="text-gray-700">${file.name}</span>
                <button type="button" class="text-red-500 hover:text-red-700 remove-file" data-index="${index}">✕</button>
            </div>
        `);
        $fileList.append($fileItem);
    });

    $('.remove-file').on('click', function() {
        const index = $(this).data('index');
        removeFile(index);
    });

    $('#uploadCsvBtn').prop('disabled', allFiles.length === 0);

}

function removeFile(index) {
    allFiles.splice(index, 1);

    const fileInput = $('#csvFile')[0];
    const dataTransfer = new DataTransfer();
    allFiles.forEach(file => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;

    renderFileList();
}
