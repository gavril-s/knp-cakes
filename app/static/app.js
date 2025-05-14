document.addEventListener('DOMContentLoaded', function() {
    fetchCakes();
    setupContactForm();
});

async function fetchCakes() {
    try {
        const response = await fetch('/cakes');
        const cakes = await response.json();
        displayCakes(cakes);
    } catch (error) {
        console.error('Ошибка при получении данных о тортах:', error);
    }
}

function displayCakes(cakes) {
    const cakesList = document.getElementById('cakes-list');
    cakesList.innerHTML = '';

    cakes.forEach(cake => {
        const cakeCard = document.createElement('div');
        cakeCard.className = 'cake-card';
        cakeCard.innerHTML = `
            <i class="fas fa-birthday-cake"></i>
            <h3>${cake.name}</h3>
            <p>${cake.description}</p>
            <p class="price">${cake.price.toFixed(2)} ₽</p>
        `;
        cakesList.appendChild(cakeCard);
    });
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('Ваше сообщение успешно отправлено!');
                form.reset();
            } else {
                throw new Error('Ошибка при отправке сообщения');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте снова.');
        }
    });
}
