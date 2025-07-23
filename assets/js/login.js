document.addEventListener('DOMContentLoaded', function () {
    // Password toggle functionality
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? '👁' : '👁‍🗨';
        });
    }

    // Form validation
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (event) {
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const mfa = document.getElementById('mfa')?.value.trim();

            if (!email || !password) {
                event.preventDefault();
                alert('Please fill in all required fields');
                return;
            }

            if (!validateEmail(email)) {
                event.preventDefault();
                alert('Please enter a valid email address');
                return;
            }

            // Allow form submission to server if validation passes
            console.log('Login form submitting:', { email, password, mfa });
        });
    }

    // Email validation helper function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Add visual feedback for required fields
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('focus', function () {
            this.style.borderColor = '#3498db';
            this.style.boxShadow = '0 0 0 2px rgba(52, 152, 219, 0.2)';
        });

        field.addEventListener('blur', function () {
            this.style.borderColor = '#ddd';
            this.style.boxShadow = 'none';
        });
    });
});