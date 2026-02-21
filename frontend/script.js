document.addEventListener('DOMContentLoaded', function() {
    loadRestaurants();

    document.getElementById('restaurant-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addRestaurant();
    });

    document.getElementById('dish-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addDish();
    });

    document.getElementById('restaurant-select').addEventListener('change', function() {
        loadDishes();
    });
});

function loadRestaurants() {
    fetch('/api/restaurants')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('restaurant-list');
            const select = document.getElementById('restaurant-select');
            list.innerHTML = '';
            select.innerHTML = '<option value="">Select Restaurant</option>';
            data.forEach(restaurant => {
                const li = document.createElement('li');
                li.textContent = `${restaurant.name} (Created: ${restaurant.created_at})`;
                list.appendChild(li);
                const option = document.createElement('option');
                option.value = restaurant.id;
                option.textContent = restaurant.name;
                select.appendChild(option);
            });
        });
}

function addRestaurant() {
    const name = document.getElementById('restaurant-name').value;
    fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            loadRestaurants();
            document.getElementById('restaurant-name').value = '';
        }
    });
}

function loadDishes() {
    const restaurantId = document.getElementById('restaurant-select').value;
    if (!restaurantId) {
        document.getElementById('dish-list').innerHTML = '';
        return;
    }
    fetch(`/api/restaurants/${restaurantId}/dishes`)
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('dish-list');
            list.innerHTML = '';
            data.forEach(dish => {
                const li = document.createElement('li');
                li.textContent = `${dish.name} - $${dish.price} (Order: ${dish.order_number}, Created: ${dish.created_at})`;
                list.appendChild(li);
            });
        });
}

function addDish() {
    const restaurantId = document.getElementById('restaurant-select').value;
    const name = document.getElementById('dish-name').value;
    const price = parseFloat(document.getElementById('dish-price').value);
    if (!restaurantId) {
        alert('Please select a restaurant');
        return;
    }
    fetch(`/api/restaurants/${restaurantId}/dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            loadDishes();
            document.getElementById('dish-name').value = '';
            document.getElementById('dish-price').value = '';
        }
    });
}
