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

  //display
  const ingredientResults = document.getElementById("ingredient-result-body");
  ingredientResults.innerHTML = '';
  data.forEach(recipeIngredient => {
    let id = recipeIngredient.recipeIngredientId;
    const newElementString = `
    <tr data-id="${id}" class="ingredient-row">
      <th>
        <button data-id="${id}" class="ingredient-button ingredient-delete-button">
          <span class="material-symbols-outlined">
            delete_forever
          </span>
        </button>
      </th>
      <th>${recipeIngredient.name}</th>
      <th id=${`ingredient-amount-edit-${id}`}">${recipeIngredient.amount}</th>
      <th>
        <button data-id="${id}" class="ingredient-button ingredient-edit-button">
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

  //attach edit-button functionality
  let editButtons = document.getElementsByClassName("ingredient-delete-button");
  let editButtonsArr = Array.from(editButtons);
  editButtonsArr.forEach(button => {
    button.addEventListener("click", () => {
      adjustUIForEdit(button.dataset.id);
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
    "ingredientId": 10,
    "amount": document.getElementById("ingredient-edit-input").value
  }

  //fetch
  let JSONResponse = await fetch(`${url}api/recipe-ingredient`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObject)
  });
  let data = await JSONResponse.json();
  console.log(data);

  ingredientsGetDisplay();
}

const adjustUIForEdit = (id) => {
  console.log(1);
  let amountElement = document.getElementById(`ingredient-amount-edit-${id}`);
  let newElement = docume.createElement('input');
  newElement.id = "ingredient-edit-input";
  //newElement.addEventListener("click", editIngredient);
  amountElement.innerHTML;
}

document.getElementById("add-ingredient-button").addEventListener("click", addIngredient);

const onLoadCalls = () => {
  recipeGetDisplay();
  ingredientsGetDisplay();
  ingredientsGetAll();
}

document.body.onload = onLoadCalls;