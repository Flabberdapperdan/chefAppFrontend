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
  let newElement = document.createElement("h4").innerHTML(`${data.name}`);
  displayElement.appendChild(newElement);
}

const onLoadCalls = () => {
  recipeGetDisplay();
}

window.onload = onLoadCalls;