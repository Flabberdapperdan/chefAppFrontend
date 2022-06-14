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
  let newElement = document.createElement("h4")
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
  const ingredientsAll = document.getElementById("display-ingredients");
  ingredientsAll.innerHTML = '';
  data.forEach(ingredient => {
    const newElementString = `
    <tr data-id="${ingredient.recipeIngredientId}" class="ingredient-tile">
      <th>
        <button data-id="${element.id}" class="ingredient-button ingredient-delete-button">
          <span class="material-symbols-outlined">
            delete_forever
          </span>
        </button>
      </th>
      <th>${ingredient.name}</th>
      <th>${ingredient.amount}</th>
      <p class="remove-ingredient">X</p>
    </tr>
    `
    ingredientsAll.innerHTML += newElementString;
  });

  //add remove-button functionality
  let deleteButtons = document.getElementsByClassName("ingredient-delete-button");
  let deleteButtonsArr = Array.from(deleteButtons);
  deleteButtonsArr.forEach(button => {
    button.addEventListener("click", () => {
      deleteIngredient(button.dataset.id);
    });
  })

}

const addIngredient = async () => {
  console.log(1);

  let name = document.getElementById("ingredient-name").value;
  let amount = document.getElementById("ingredient-amount").value;
  let bodyObject = {
    "recipeId": localStorage.getItem("recipeId"),
    "ingredientId": 60,
    "name": name,
    "amount": amount,
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
  let data = await JSONResponse.json();
  console.log(data);
  ingredientsGetDisplay();
}

const deleteIngredient = () => {

}

document.getElementById("add-ingredient-button").addEventListener("click", addIngredient);

const onLoadCalls = () => {
  recipeGetDisplay();
  ingredientsGetDisplay();
}

document.body.onload = onLoadCalls;