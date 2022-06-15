import { keys } from './keys.js';
const { url } = keys;

const recipeGetDisplay = async () => {
  //fetch
  let recipeId = localStorage.getItem("recipeId");
  let JSONData = await fetch(`${url}api/recipes/${recipeId}`, {
    method: 'GET',
    mode: 'cors'
  });
  let data = await JSONData.json();
  console.log(data);

  //display
  let displayElement = document.getElementById("current-recipe");
  let newElement = document.createElement("h2")
  newElement.innerText = `${data.name}`;
  displayElement.appendChild(newElement);
}

const ingredientsGetDisplay = async () => {
  let recipeId = localStorage.getItem("recipeId");
  //fetch
  let JSONData = await fetch(`${url}api/recipe-ingredient/recipe/${recipeId}`);
  let data = await JSONData.json();
  console.log(data);

  //display
  const ingredientResults = document.getElementById("ingredient-result-body");
  ingredientResults.innerHTML = '';
  data.forEach(recipeIngredient => {
    const newElementString = `
    <tr data-id="${recipeIngredient.recipeIngredientId}" class="ingredient-row">
      <th>
        <button data-id="${recipeIngredient.recipeIngredientId}" class="ingredient-button ingredient-delete-button">
          <span class="material-symbols-outlined">
            delete_forever
          </span>
        </button>
      </th>
      <th>${recipeIngredient.name}</th>
      <th>${recipeIngredient.amount}</th>
      <th>
        <button data-id="${recipeIngredient.recipeIngredient}" class="ingredient-button ingredient-edit-button">
          <span class="material-symbols-outlined">edit</span>
        </button>
      </th>
    </tr>
    `
    ingredientResults.innerHTML += newElementString;
  });

  //attach remove-button functionality
  let deleteButtons = document.getElementsByClassName("ingredient-delete-button");
  let deleteButtonsArr = Array.from(deleteButtons);
  deleteButtonsArr.forEach(button => {
    button.addEventListener("click", () => {
      deleteIngredient(button.dataset.id);
    });
  });
}

const ingredientsGetAll = async () => {
  //fetch
  let JSONData = await fetch(`${url}api/ingredients`);
  let data = await JSONData.json();
  console.log(data);
}

const addIngredient = async () => {
  let bodyObject = {
    "recipeId": localStorage.getItem("recipeId"),
    "ingredientId": 5,
    "amount": document.getElementById("ingredient-amount").value
  }

  //fetch
  let JSONResponse = await fetch(`${url}api/recipe-ingredient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObject)
  });
  let data = await JSONResponse.json();
  console.log(data);

  // clean-up
  document.getElementById("ingredient-amount").value = "";
  document.getElementById("ingredient-name").value = "";
  ingredientsGetDisplay();
}

const deleteIngredient = async (ingredientId) => {
  //fetch
  let JSONResponse = await fetch(`${url}api/recipe-ingredient/${ingredientId}`, {
    method: 'DELETE'
  });
  let data = await JSONResponse.json();
  ingredientsGetDisplay();
}

const editIngredient = async () => {
  let bodyObject = {
    "recipeId": localStorage.getItem("recipeId"),
    "ingredientId": 10
  }

  //fetch
  let JSONResponse = await fetch("http://localhost:8080/api/recipe-ingredient", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObject)
  });
  let data = await JSONResponse.json();

  ingredientsGetDisplay();
}

document.getElementById("add-ingredient-button").addEventListener("click", addIngredient);

const onLoadCalls = () => {
  recipeGetDisplay();
  ingredientsGetDisplay();
  ingredientsGetAll();
}

document.body.onload = onLoadCalls;