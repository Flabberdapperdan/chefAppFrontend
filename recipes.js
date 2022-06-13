import { keys } from './keys.js';
const { url } = keys;

// RECIPE SECTION \\
const deleteRecipe = async (id) => {
  let JSONResponse = await fetch(`${url}api/recipes/${id}`, {
    method: 'DELETE'
  });
  let data = JSONResponse.json();
  getAllRecipes();
}

const getAllRecipes = async () => {
  //fetch
  let JSONData = await fetch(`${url}api/recipes`, {
    method: 'GET',
    mode: 'cors'
  });
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
      <th>
        <button data-id="${element.id}" class="recipes-button recipe-delete-button">
          <span class="material-symbols-outlined">
            delete_forever
          </span>
        </button>
      </th>
      <th>${element.name}</th>
      <th>${element.cost}</th>
      <th>${element.salePrice}</th>
      <th>
        <button data-id="${element.id}" class="recipes-button recipe-add-button">
          <span class="material-symbols-outlined">
            library_add
          </span>
        </button>
      </th>  
    </tr>
    `;
    newRow.innerHTML = newString;
    resultsTable.appendChild(newRow);
  }

  //attach delete-event
  let deleteButtons = document.getElementsByClassName("recipe-delete-button");
  let deleteButtonsArr = Array.from(deleteButtons);
  deleteButtonsArr.forEach(button => {
    button.addEventListener("click", () => {
      deleteRecipe(button.dataset.id);
    });
  })

  //attach add-ingredient-event
  let addButtons = document.getElementsByClassName("recipe-add-button");
  let addButtonsArr = Array.from(addButtons);
  addButtonsArr.forEach(button => {
    button.addEventListener("click", () => {
      localStorage.setItem("recipeId", button.dataset.id);
      window.location.href = 'recipesAddIngredients.html';
    })
  })
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

// DOM-MANIPULATION \\
const onLoadCalls = () => {
  getAllRecipes();
}
window.onload = onLoadCalls;
