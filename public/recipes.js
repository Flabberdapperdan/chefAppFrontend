const deleteRecipe = async (id) => {
  let JSONResponse = await fetch(`http://localhost:8080/api/recipes/${id}`, {
    method: 'DELETE'
  });
  getAllRecipes();
}

const getAllRecipes = async () => {
  //fetch
  let JSONData = await fetch("http://localhost:8080/api/recipes");
  let data = await JSONData.json();
  //display
  const resultsTable = document.getElementById("ingredient-result-body");
  resultsTable.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    let newRow = document.createElement("tr", {
      data : element.id
  });
    let newString = `
    <tr>
      <th>${element.name}</th>
      <th>${element.cost}</th>
      <th>${element.salePrice}</th>
      <th>
        <input data-id="${element.id}" class="recipes-button" type="button" value=->
      </th>
        <input class="recipes-button" type="button" value=+>
      <th>
      </th>
      <th>
        <input id="add-ingredient" class="recipes-button" type="button" value="Ingredienten Toevoegen">
      </th>    
    </tr>
    `;
    newRow.innerHTML = newString;
    resultsTable.appendChild(newRow);
  }

  //attach delete-event
  deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
      deleteRecipe(button.dataset.id);
    });
  })
}

const getAllIngredientsByRecipe = async () => {
  const id = 88; //this will be variable again eventually
  //fetch
  let JSONData = await fetch(`http://localhost:8080/api/recipe-ingredient/recipe/${id}`);
  let data = await JSONData.json();

  //display
  const ingredientsAll = document.getElementById("add-ingredient-all");
  ingredientsAll.innerHTML = '';
  data.forEach(ingredient => {
    const newElementString = `
    <div data-id="${ingredient.recipeIngredientId}" class="ingredient-tile">
      <p>${ingredient.name}</p>
      <p>${ingredient.amount}</p>
      <p>${ingredient.metric}</p>
      <p class="remove-ingredient">X</p>
    </div>
    `
    ingredientsAll.innerHTML += newElementString;
  });

  //add remove-button functionality
}

const addRecipe = async () => {
  const nameInput = document.getElementById("rfname");
  const costInput = document.getElementById("rfcost");
  const salePriceInput = document.getElementById("rfsaleprice");
  let bodyObject = {
    "name": nameInput.value,
    "cost": costInput.value,
    "salePrice": salePriceInput.value 
  }

  // fetch
  let JSONResponse = await fetch("http://localhost:8080/api/recipes", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObject)
  });
  let response = await JSONResponse.json();

  //clear and display recipes
  getAllRecipes();
  nameInput.value = "";
  costInput.value = "";
  salePriceInput.value = "";
}

const addIngredientToRecipe = async () => {
  let ingredient = document.getElementById('rfingredient').value;
  let bodyObject = {
    "recipeId": 88,
    "ingredientId": 60,
    "amount": 5,
    "metric": "g"
  }

  //fetch
  let JSONResponse = await fetch("http://localhost:8080/api/recipe-ingredient", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObject)
  });
  let response = await JSONResponse.json();

}

// DOM-manipulation
const submitButton = document.getElementById("recipe-form-submit");
submitButton.addEventListener("click", addRecipe);

const onLoadCalls = () => {
  getAllRecipes();
  getAllIngredientsByRecipe();
}
window.onload = onLoadCalls;