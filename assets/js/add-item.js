document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-item-form');
    const priceInput = document.getElementById('price');
    const quantityInput = document.getElementById('quantity');
    const expiryDateInput = document.getElementById('expiryDate');
    const photoInput = document.getElementById('photo');
    const categoryInput = document.getElementById('category');

    form.addEventListener('submit', function (event) {
        let errors = [];

        // Validate price
        if (priceInput.value <= 0) {
            errors.push('Price must be greater than 0.');
        }

        // Validate quantity
        if (quantityInput.value < 1) {
            errors.push('Quantity must be at least 1.');
        }

        // Validate expiry date
        const today = new Date().toISOString().split('T')[0];
        if (expiryDateInput.value < today) {
            errors.push('Expiry date must be today or in the future.');
        }

        // Validate photo
        if (photoInput.files.length > 0) {
            const file = photoInput.files[0];
            const validTypes = ['image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                errors.push('Photo must be a JPG or PNG file.');
            }
        }

        // Validate category
        if (!categoryInput.value) {
            errors.push('Please select a category.');
        }

        if (errors.length > 0) {
            event.preventDefault();
            alert(errors.join('\n'));
        }
    });
});