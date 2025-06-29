// static/script.js

// 🌟 Common ingredients list
const commonIngredients = [
    'Rice', 'Pasta', 'Bread', 'Eggs', 'Milk', 'Cheese', 'Butter', 'Oil', 'Salt', 'Pepper',
    'Onion', 'Garlic', 'Tomato', 'Potato', 'Carrot', 'Bell Pepper', 'Spinach', 'Lettuce',
    'Chicken', 'Beef', 'Pork', 'Fish', 'Shrimp', 'Beans', 'Lentils', 'Tofu',
    'Flour', 'Sugar', 'Honey', 'Lemon', 'Lime', 'Herbs', 'Spices', 'Ginger',
    'Mushrooms', 'Broccoli', 'Cucumber', 'Avocado', 'Banana', 'Apple', 'Orange'
];

let selectedIngredients = [];

// 🌟 Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    populateCommonIngredients();

    document.getElementById('custom-ingredient').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addCustomIngredient();
        }
    });
});

// 🌟 Show common ingredients as checkboxes
function populateCommonIngredients() {
    const container = document.getElementById('common-ingredient-list');
    if (!container) return;

    commonIngredients.forEach(ingredient => {
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-2';
        div.innerHTML = `
            <input type="checkbox" id="ingredient-${ingredient}" value="${ingredient}" 
                   onchange="toggleIngredient('${ingredient}')"
                   class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2">
            <label for="ingredient-${ingredient}" class="text-sm text-gray-700 cursor-pointer">${ingredient}</label>
        `;
        container.appendChild(div);
    });
}

// 🌟 Add or remove ingredient from selection
function toggleIngredient(ingredient) {
    const checkbox = document.getElementById(`ingredient-${ingredient}`);
    if (checkbox.checked && !selectedIngredients.includes(ingredient)) {
        selectedIngredients.push(ingredient);
    } else if (!checkbox.checked) {
        selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
    }

    updateSelectedList();
    updateFindButton();
}

// 🌟 Add custom ingredient
function addCustomIngredient() {
    const input = document.getElementById('custom-ingredient');
    const ingredient = input.value.trim();
    if (ingredient && !selectedIngredients.includes(ingredient)) {
        selectedIngredients.push(ingredient);
        input.value = '';
        updateSelectedList();
        updateFindButton();
    }
}

// 🌟 Update selected ingredients display
function updateSelectedList() {
    const container = document.getElementById('selected-list');
    container.innerHTML = '';

    if (selectedIngredients.length === 0) {
        container.innerHTML = '<p class="text-gray-500 italic">No ingredients selected yet...</p>';
        return;
    }

    selectedIngredients.forEach(ingredient => {
        const span = document.createElement('span');
        span.className = 'inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary text-white';
        span.innerHTML = `
            ${ingredient}
            <button onclick="removeIngredient('${ingredient}')" class="ml-2 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(span);
    });
}

// 🌟 Remove ingredient
function removeIngredient(ingredient) {
    selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
    const checkbox = document.getElementById(`ingredient-${ingredient}`);
    if (checkbox) checkbox.checked = false;
    updateSelectedList();
    updateFindButton();
}

// 🌟 Enable or disable Find Cuisines button
function updateFindButton() {
    document.getElementById('find-cuisines-btn').disabled = selectedIngredients.length === 0;
}

// 🔥 FIND CUISINES FUNCTION
async function findCuisines() {
    if (selectedIngredients.length === 0) return;

    const cuisineSection = document.getElementById('cuisine-section');
    const loadingCuisines = document.getElementById('loading-cuisines');
    const cuisineGrid = document.getElementById('cuisine-grid');

    cuisineSection.classList.remove('hidden');
    loadingCuisines.classList.remove('hidden');
    cuisineGrid.innerHTML = '';

    try {
        const response = await fetch('/api/suggest-cuisines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients: selectedIngredients }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch cuisines');
        }

        displayCuisines(data.cuisines);
    } catch (error) {
        cuisineGrid.innerHTML = `
            <div class="col-span-full text-center text-red-600 font-semibold">
                ${error.message}
            </div>
        `;
        console.error(error);
    } finally {
        loadingCuisines.classList.add('hidden');
    }
}

// 🌟 Display cuisines as cards
function displayCuisines(cuisines) {
    const cuisineGrid = document.getElementById('cuisine-grid');
    cuisineGrid.innerHTML = '';
    cuisines.forEach(cuisine => {
        const div = document.createElement('div');
        div.className = 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-primary';
        div.onclick = () => getRecipe(cuisine.name); // Fetch recipe on click

        div.innerHTML = `
            <h3 class="font-bold text-lg text-gray-800">${cuisine.name}</h3>
            <p class="text-sm text-gray-600 mb-1">${cuisine.cuisine_type}</p>
            <p class="text-sm text-gray-700">${cuisine.description}</p>
        `;
        cuisineGrid.appendChild(div);
    });
}

// 🔥 GET RECIPE FUNCTION
async function getRecipe(dishName) {
    const recipeSection = document.getElementById('recipe-section');
    const loadingRecipe = document.getElementById('loading-recipe');
    const recipeContent = document.getElementById('recipe-content');

    recipeSection.classList.remove('hidden');
    loadingRecipe.classList.remove('hidden');
    recipeContent.innerHTML = '';

    try {
        const response = await fetch('/api/get-recipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dish_name: dishName, ingredients: selectedIngredients }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch recipe');
        }

        displayRecipe(data.recipe);
    } catch (error) {
        recipeContent.innerHTML = `
            <div class="text-center text-red-600 font-semibold">
                ${error.message}
            </div>
        `;
        console.error(error);
    } finally {
        loadingRecipe.classList.add('hidden');
    }
}

// 🌟 Display recipe details
function displayRecipe(recipe) {
    const recipeContent = document.getElementById('recipe-content');
    recipeContent.innerHTML = `
        <h3 class="text-2xl font-bold mb-2">${recipe.name}</h3>
        <p><strong>Prep Time:</strong> ${recipe.prep_time}</p>
        <p><strong>Cook Time:</strong> ${recipe.cook_time}</p>
        <p><strong>Servings:</strong> ${recipe.servings}</p>

        <h4 class="text-xl font-semibold mt-4 mb-2">Ingredients</h4>
        <ul class="list-disc list-inside">
            ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
        </ul>

        <h4 class="text-xl font-semibold mt-4 mb-2">Instructions</h4>
        <ol class="list-decimal list-inside">
            ${recipe.instructions.map(s => `<li>${s}</li>`).join('')}
        </ol>

        <h4 class="text-xl font-semibold mt-4 mb-2">Tips</h4>
        <ul class="list-disc list-inside">
            ${recipe.tips.map(t => `<li>${t}</li>`).join('')}
        </ul>
    `;
}
function loginUser() {
  document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        alert('Login successful!');
        window.location.href = '/index.html'; 
      } else {
        alert('Login failed: ' + data.message);
      }
    } else {
      alert('Server error. Please try again later.');
    }
  });
}

function signupUser(){
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name  = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
    });
}

function logoutUser(){
    document.getElementById('logout-btn').addEventListener('click', function() {
        fetch('/api/logout', {
            method: 'GET',
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/login'; // Redirect to login page
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => console.error('Error:', error));
    });
}
// 🔄 Start Over
function startOver() {
    window.location.reload();
}

