document.addEventListener('DOMContentLoaded', function () {
    const categorySelect = document.getElementById('categories');
    const searchInput = document.querySelector('.search-box input');
    const searchForm = document.querySelector('.search-box form');

    // Trigger form submission on category change
    categorySelect.addEventListener('change', function () {
        const category = categorySelect.value;
        const query = searchInput.value;
        const url = new URL('/home', window.location.origin);
        if (category) url.searchParams.set('category', category);
        if (query) url.searchParams.set('query', query);
        window.location.href = url.toString();
    });

    // Ensure form submission includes category
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const category = categorySelect.value;
        const query = searchInput.value;
        const url = new URL('/home', window.location.origin);
        if (category) url.searchParams.set('category', category);
        if (query) url.searchParams.set('query', query);
        window.location.href = url.toString();
    });
});