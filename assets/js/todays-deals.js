document.addEventListener('DOMContentLoaded', function () {
    const sortSelect = document.getElementById('sort');
    const dealsGrid = document.querySelector('.deals-grid');
    let deals = [];

    // Store initial deals from server
    document.querySelectorAll('.deal-card').forEach(card => {
        const discountMatch = card.querySelector('.discounted-price').textContent.match(/\((\d+)% off\)/);
        const expiryMatch = card.querySelector('.expiry').textContent.match(/\d+/);
        deals.push({
            element: card,
            name: card.querySelector('h3').textContent,
            discount: discountMatch ? parseFloat(discountMatch[1]) : 0,
            expiryCountdown: expiryMatch ? parseInt(expiryMatch[0]) : 999,
            category: card.dataset.category || ''
        });
    });

    // Sort function
    function updateDeals() {
        const sortValue = sortSelect.value;

        // Sort deals
        deals.sort((a, b) => {
            if (sortValue === 'discount') {
                return b.discount - a.discount;
            } else {
                return a.expiryCountdown - b.expiryCountdown;
            }
        });

        // Update DOM
        dealsGrid.innerHTML = '';
        deals.forEach(deal => dealsGrid.appendChild(deal.element));
    }

    // Event listener for sort
    sortSelect.addEventListener('change', updateDeals);
});