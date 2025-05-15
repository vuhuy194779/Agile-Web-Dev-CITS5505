
document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.getElementById("nav-menu");
  const userMenu = document.querySelector(".user-menu");
  const dropdown = document.getElementById("dropdown");

  // close all menus
  function closeAllMenus() {
    navMenu.classList.remove("show");
    if (dropdown) {
      dropdown.classList.add("hidden");
    }
  }

  menuBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // stop event bubbling
    navMenu.classList.toggle("show");
    if (dropdown) {
      dropdown.classList.add("hidden");
    }
  });

  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeAllMenus();
    });
  });

  // only for user menu
  if (userMenu) {
    userMenu.addEventListener("click", function (e) {
      e.stopPropagation();
      navMenu.classList.remove("show");
    });
  }

  // press other area, close all menus
  document.addEventListener("click", function (e) {
    if (!navMenu.contains(e.target) && (!userMenu || !userMenu.contains(e.target))) {
      closeAllMenus();
    }
  });

  // scroll event to close all menus
  window.addEventListener("scroll", function () {
    closeAllMenus();
  });
});

function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.classList.toggle("hidden");
}
window.toggleDropdown = toggleDropdown;

document.addEventListener("click", function (event) {
  const userMenu = document.querySelector(".user-menu");
  const dropdown = document.getElementById("dropdown");

  if (!userMenu.contains(event.target)) {
    dropdown.classList.add("hidden");
  }
});

$(document).ready(function() {
    // Toggle dropdown visibility
    $('#user-search').on('click', function(e) {
        e.preventDefault();
        $('#user-dropdown').toggleClass('open');
        if ($('#user-dropdown').hasClass('open') && $('#user-dropdown').children().length === 0) {
            fetchUsers('');
        }
    });

    // Close dropdown when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.search-container').length) {
            $('#user-dropdown').removeClass('open');
        }
    });

    // Fetch users via API on input
    $('#user-search').on('input', function() {
        const searchTerm = $(this).val();
        fetchUsers(searchTerm);
        $('#user-dropdown').addClass('open');
    });

    // Handle user selection and redirect
    $('#user-dropdown').on('click', '.dropdown-item-search', function() {
        const userId = $(this).data('value');
        window.location.href = `/dashboard/${userId}`;
    });

    // Prevent form submission on button click
    $('.search-button').on('click', function(e) {
        e.preventDefault();
        $('#user-dropdown').toggleClass('open');
        if ($('#user-dropdown').hasClass('open') && $('#user-dropdown').children().length === 0) {
            fetchUsers($('#user-search').val());
        }
    });

    // Function to fetch users from API
    function fetchUsers(searchTerm) {
        $.get('/api/users', { q: searchTerm }, function(data) {
            $('#user-dropdown').empty();
            data.forEach(user => {
                $('#user-dropdown').append(`
                    <div class="dropdown-item-search" data-value="${user.id}" data-label="${user.username}">
                        ${user.username}
                    </div>
                `);
            });
        });
    }
});
