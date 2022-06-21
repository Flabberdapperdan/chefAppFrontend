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
      <th id=${`ingredient-amount-edit-${id}`}>${recipeIngredient.amount}</th>
      <th>
        <button
          data-id="${id}" 
          data-recipe-id=${recipeId}
          id=${`ingredient-edit-button-${id}`} 
          class="ingredient-button ingredient-edit-button">
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
  let editButtons = document.getElementsByClassName("ingredient-edit-button");
  let editButtonsArr = Array.from(editButtons);
  editButtonsArr.forEach(button => {
    button.addEventListener("click", () => {
      adjustUIForEdit(button.dataset.id, button.dataset.recipeId);
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
    "ingredientId": 1,
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

const editIngredient = async (recipeIngredientId, recipeId) => {
  let bodyObject = {
    "recipeId": recipeId,
    "ingredientId": 10,
    "amount": localStorage.getItem("ingredientAmount")
  }

  //fetch
  let JSONResponse = await fetch(`${url}api/recipe-ingredient/${recipeIngredientId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObject)
  });
  let data = await JSONResponse.json();

  ingredientsGetDisplay();
}

const adjustUIForEdit = (id, recipeId) => {
  let amountElement = document.getElementById(`ingredient-amount-edit-${id}`);
  let currentValue = amountElement.innerText;

  //change number to inputfield
  let newElement = document.createElement('input');
  newElement.id = `ingredient-edit-input-${id}`;
  newElement.value = currentValue;
  amountElement.innerHTML = '';
  amountElement.appendChild(newElement);
  
  //change icon and add events
  let button = document.getElementById(`ingredient-edit-button-${id}`);
  button.children[0].innerHTML = 'check_circle';
  button.addEventListener("click", () => {
    editIngredient(id, recipeId);
  });
  let input = document.getElementById(`ingredient-edit-input-${id}`);
  input.addEventListener("keyup", () => {
    localStorage.setItem("ingredientAmount", input.value);
  });
}

document.getElementById("add-ingredient-button").addEventListener("click", addIngredient);

const onLoadCalls = () => {
  recipeGetDisplay();
  ingredientsGetDisplay();
  //ingredientsGetAll();
}

document.body.onload = onLoadCalls;