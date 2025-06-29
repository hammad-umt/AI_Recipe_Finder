document.addEventListener('DOMContentLoaded', function() {
  console.log("Script loaded ✅");

  const getRecipeForm = document.getElementById('getRecipeForm');

  getRecipeForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    console.log("Form submitted ✅");

    const dishname = document.getElementById('prompt').value;
    const recipeResult = document.getElementById('recipeResult');
    const loadingSpinner = document.getElementById('loadingSpinner');

    recipeResult.innerHTML = ''; // Clear previous results
    loadingSpinner.classList.remove('hidden'); // Show loading spinner
    recipeResult.classList.add('hidden'); // Hide result while loading

    fetch('/api/fetchRecipe', { // ✅ Corrected route
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dish_name: dishname }) // ✅ Corrected key
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      loadingSpinner.classList.add('hidden'); // Hide spinner
      recipeResult.classList.remove('hidden'); // Show result

      if (data.error) {
        recipeResult.innerHTML = `<p class="text-red-500">${data.error}</p>`;
      } else if (!data.recipe) {
        recipeResult.innerHTML = `<p class="text-yellow-500">No recipe found.</p>`;
      } else {
        const recipe = data.recipe;
        recipeResult.innerHTML = `
          <h3 class="text-lg font-semibold mb-2">${recipe.name}</h3>
          <p><strong>Prep time:</strong> ${recipe.prep_time}</p>
          <p><strong>Cook time:</strong> ${recipe.cook_time}</p>
          <p><strong>Servings:</strong> ${recipe.servings}</p>
          <h4 class="mt-4 font-semibold">Ingredients:</h4>
          <ul class="list-disc list-inside">
            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
          </ul>
          <h4 class="mt-4 font-semibold">Instructions:</h4>
          <ol class="list-decimal list-inside">
            ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
          </ol>
          <h4 class="mt-4 font-semibold">Tips:</h4>
          <ul class="list-disc list-inside">
            ${recipe.tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        `;
      }
    })
    .catch(error => {
      loadingSpinner.classList.add('hidden'); // Hide spinner
      recipeResult.classList.remove('hidden');
      recipeResult.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    });
  });
});
