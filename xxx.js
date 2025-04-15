

        $(document).ready(function() {
            // Mobile menu toggle
            $('#mobile-menu-btn').click(function() {
                $('#mobile-menu').toggleClass('hidden');
            });
            
            // Modal functionality
            $('#login-btn').click(function() {
                $('#modal-title').text('Log In');
                $('#login-form').show();
                $('#signup-form').hide();
                $('#form-switch-text').html('Don\'t have an account? <a href="#" id="form-switch" class="text-blue-600 hover:underline">Sign up</a>');
                $('#auth-modal').removeClass('hidden');
                bindFormSwitchEvent();
            });
            
            $('#signup-btn, #get-started-btn').click(function() {
                $('#modal-title').text('Create Account');
                $('#login-form').hide();
                $('#signup-form').show();
                $('#form-switch-text').html('Already have an account? <a href="#" id="form-switch" class="text-blue-600 hover:underline">Log in</a>');
                $('#auth-modal').removeClass('hidden');
                bindFormSwitchEvent();
            });
            
            $('#close-modal').click(function() {
                $('#auth-modal').addClass('hidden');
            });
            
            function bindFormSwitchEvent() {
                $('#form-switch').click(function(e) {
                    e.preventDefault();
                    if ($('#login-form').is(':visible')) {
                        $('#modal-title').text('Create Account');
                        $('#login-form').hide();
                        $('#signup-form').show();
                        $('#form-switch-text').html('Already have an account? <a href="#" id="form-switch" class="text-blue-600 hover:underline">Log in</a>');
                    } else {
                        $('#modal-title').text('Log In');
                        $('#signup-form').hide();
                        $('#login-form').show();
                        $('#form-switch-text').html('Don\'t have an account? <a href="#" id="form-switch" class="text-blue-600 hover:underline">Sign up</a>');
                    }
                    bindFormSwitchEvent();
                });
            }
            
            // Form submissions (just prevent default for this demo)
            $('#login-form, #signup-form').submit(function(e) {
                e.preventDefault();
                // In a real app, you would handle authentication here