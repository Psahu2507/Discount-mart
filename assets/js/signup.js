document.addEventListener('DOMContentLoaded', function () {
    // Get form elements
    const form = document.querySelector('form');
    const passwordInput = document.getElementById('password');
    const phoneInput = document.getElementById('phone');
    const roleSelect = document.getElementById('role');
    const togglePassword = document.querySelector('.toggle-password');

    // Password toggle functionality
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? '👁' : '👁‍🗨';
        });
    }

    // Phone number formatting
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            let phoneNumber = this.value.replace(/\D/g, '');
            if (phoneNumber.length > 3 && phoneNumber.length <= 6) {
                phoneNumber = phoneNumber.replace(/(\d{3})(\d{1,3})/, '$1-$2');
            } else if (phoneNumber.length > 6) {
                phoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{1,4})/, '$1-$2-$3');
            }
            this.value = phoneNumber;
        });
    }

    // Form validation on submit
    if (form) {
        form.addEventListener('submit', function (event) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = passwordInput.value.trim();
            const phone = phoneInput.value.replace(/\D/g, '');
            const role = roleSelect.value;

            let isValid = true;

            if (!name || !email || !password || !phone || !role) {
                alert('Please fill in all required fields');
                isValid = false;
            }

            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                isValid = false;
            }

            if (password.length < 8) {
                alert('Password must be at least 8 characters long');
                passwordInput.focus();
                isValid = false;
            }

            if (phone.length < 10) {
                alert('Please enter a valid phone number with area code');
                phoneInput.focus();
                isValid = false;
            }

            if (!role) {
                alert('Please select your role');
                roleSelect.focus();
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault();
            } else {
                console.log('Signup form submitting:', { name, email, phone, role });
            }
        });
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

    // Email validation helper function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});