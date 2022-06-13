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

const addIngredient = () => {

}

const onLoadCalls = () => {
  recipeGetDisplay();
  ingredientsGetDisplay()
}

window.onload = onLoadCalls;