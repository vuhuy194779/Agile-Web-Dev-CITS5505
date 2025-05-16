$(document).ready(function() {
    // Initialize selected items
    let selectedWorkouts = new Set();
    let selectedUsers = new Set();

    // Update selected items display and hidden select
    function updateSelectedItems(selectId, displayId, set) {
        $(`#${displayId}`).empty();
        set.forEach(item => {
            const label = $(`#${selectId} option[value="${item}"]`).text();
            $(`#${displayId}`).append(`
                <span class="selected-item">
                    ${label} <span class="remove-item" data-value="${item}">×</span>
                </span>
            `);
        });
        // Sync with hidden select
        const $select = $(`#${selectId}`);
        $select.val(Array.from(set)).trigger('change');
    }

    // Toggle dropdown visibility
    $('.search-input').on('click', function() {
        const dropdownId = $(this).attr('id').replace('-search', '-dropdown');
        $(`#${dropdownId}`).toggleClass('open');
        // Reset search input and show all items
        $(this).val('');
        $(`#${dropdownId} .dropdown-item`).show();
    });

    // Close dropdown when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.search-box').length) {
            $('.dropdown-form').removeClass('open');
        }
    });

    // Filter dropdown items based on search input
    $('.search-input').on('input', function() {
        const dropdownId = $(this).attr('id').replace('-search', '-dropdown');
        const searchTerm = $(this).val().toLowerCase();

        $(`#${dropdownId} .dropdown-item`).each(function() {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(searchTerm));
        });

        // Ensure dropdown remains open while typing
        $(`#${dropdownId}`).addClass('open');
    });

    // Handle dropdown item selection
    $('.dropdown-item').on('click', function() {
        const value = $(this).data('value');
        const dropdownId = $(this).parent().attr('id');
        const selectId = dropdownId.replace('-dropdown', '');
        const set = (selectId === 'workouts') ? selectedWorkouts : selectedUsers;

        if (!set.has(String(value))) {
            set.add(String(value));
            updateSelectedItems(selectId, `selected-${selectId}`, set);
        }
        $(`#${dropdownId}`).removeClass('open');
        $(`#${selectId}-search`).val('');
    });

    // Remove selected item
    $('.selected-items').on('click', '.remove-item', function() {
        const value = $(this).data('value');
        const selectId = $(this).closest('.selected-items').attr('id').replace('selected-', '');
        const set = (selectId === 'workouts') ? selectedWorkouts : selectedUsers;

        set.delete(String(value));
        updateSelectedItems(selectId, `selected-${selectId}`, set);
    });

    // Initial population (if any pre-selected values exist from form)
    $('select[multiple]').each(function() {
        const selectId = $(this).attr('id');
        const set = (selectId === 'workouts') ? selectedWorkouts : selectedUsers;
        $(this).find('option:selected').each(function() {
            set.add($(this).val());
        });
        updateSelectedItems(selectId, `selected-${selectId}`, set);
    });
});
