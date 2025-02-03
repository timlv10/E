document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.stars');
    
    stars.forEach(starContainer => {
        starContainer.addEventListener('mousemove', (e) => {
            const rect = e.target.getBoundingClientRect();
            const width = rect.width;
            const x = e.clientX - rect.left;
            const percent = x / width;
            const rating = Math.ceil(percent * 5);
            
            highlightStars(starContainer, rating);
        });

        starContainer.addEventListener('mouseleave', (e) => {
            const currentRating = parseFloat(
                e.target.nextElementSibling.textContent
            );
            highlightStars(starContainer, currentRating);
        });

        starContainer.addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            const width = rect.width;
            const x = e.clientX - rect.left;
            const percent = x / width;
            const rating = Math.ceil(percent * 5);
            
            const brand = starContainer.dataset.brand;
            const flavor = starContainer.dataset.flavor;
            
            // Update the rating display
            starContainer.nextElementSibling.textContent = rating.toFixed(1);
            
            // Here you would typically send this data to a backend
            console.log(`Rating submitted: ${brand} ${flavor} - ${rating} stars`);
            
            // Save to localStorage for persistence
            saveRating(brand, flavor, rating);
        });
    });

    // Load saved ratings
    loadSavedRatings();

    // Add sorting functionality
    const sortSelect = document.getElementById('sortBy');
    sortSelect.addEventListener('change', sortDrinks);

    // Calculate and display average ratings
    calculateAverageRatings();
});

function highlightStars(container, rating) {
    const stars = '★'.repeat(Math.floor(rating)) + 
                 '☆'.repeat(5 - Math.floor(rating));
    container.textContent = stars;
}

function saveRating(brand, flavor, rating) {
    const key = `rating_${brand}_${flavor}`;
    localStorage.setItem(key, rating);
    calculateAverageRatings();
}

function loadSavedRatings() {
    const stars = document.querySelectorAll('.stars');
    
    stars.forEach(starContainer => {
        const brand = starContainer.dataset.brand;
        const flavor = starContainer.dataset.flavor;
        const key = `rating_${brand}_${flavor}`;
        const savedRating = localStorage.getItem(key);
        
        if (savedRating) {
            highlightStars(starContainer, savedRating);
            starContainer.nextElementSibling.textContent = savedRating;
        }
    });
}

function calculateAverageRatings() {
    const drinkCards = document.querySelectorAll('.drink-card');
    
    drinkCards.forEach(card => {
        const ratings = Array.from(card.querySelectorAll('.rating-value'))
            .map(span => parseFloat(span.textContent));
        
        const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        card.dataset.avgRating = average.toFixed(1);
    });
}

function sortDrinks() {
    const container = document.querySelector('.drinks-container');
    const cards = Array.from(container.querySelectorAll('.drink-card'));
    const sortBy = document.getElementById('sortBy').value;

    cards.sort((a, b) => {
        switch(sortBy) {
            case 'name':
                return a.querySelector('h2').textContent
                    .localeCompare(b.querySelector('h2').textContent);
            case 'rating':
                return parseFloat(b.dataset.avgRating) - parseFloat(a.dataset.avgRating);
            case 'price':
                return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
            case 'caffeine':
                return parseFloat(b.dataset.caffeine) - parseFloat(a.dataset.caffeine);
            default:
                return 0;
        }
    });

    // Clear and re-append sorted cards
    container.innerHTML = '';
    cards.forEach(card => container.appendChild(card));
} 