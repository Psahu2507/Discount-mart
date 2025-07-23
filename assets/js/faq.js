document.addEventListener('DOMContentLoaded', function () {
    const faqQuestions = document.querySelectorAll('.faq-question');

    // Debugging: Log the number of FAQ questions found
    console.log(`Found ${faqQuestions.length} FAQ questions`);

    if (faqQuestions.length === 0) {
        console.warn('No elements with class .faq-question found. Check EJS rendering or class names.');
        return;
    }

    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const answer = this.nextElementSibling;

            // Safeguard: Check if answer exists
            if (!answer || !answer.classList.contains('faq-answer')) {
                console.warn('No valid .faq-answer found for question:', this);
                return;
            }

            // Toggle the show class and active state
            const isActive = answer.classList.contains('show');
            answer.classList.toggle('show', !isActive);
            this.classList.toggle('active', !isActive);

            // Set dynamic max-height for smooth transition
            if (!isActive) {
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            } else {
                answer.style.maxHeight = '0';
            }

            // Close other open answers
            faqQuestions.forEach(q => {
                if (q !== question) {
                    const otherAnswer = q.nextElementSibling;
                    if (otherAnswer && otherAnswer.classList.contains('faq-answer')) {
                        otherAnswer.classList.remove('show');
                        otherAnswer.style.maxHeight = '0';
                        q.classList.remove('active');
                    }
                }
            });
        });
    });
});