document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.querySelector('form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Client-side validation
            if (!name || !email || !subject || !message) {
                e.preventDefault();
                alert('Please fill in all required fields (Name, Email, Subject, and Message).');
                return;
            }

            if (!validateEmail(email)) {
                e.preventDefault();
                alert('Please enter a valid email address.');
                return;
            }

            // Form will submit to server; no need to prevent default
            console.log('Form submitting:', { name, email, subject, message });
        });
    }

    // Email validation helper function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});