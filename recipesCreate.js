import { keys } from './keys.js';
const { url } = keys;

const addRecipe = async () => {
  let bodyObject = {
    "name": document.getElementById("rfname").value,
    "cost": document.getElementById("rfcost").value,
    "saleprice": document.getElementById("rfsaleprice").value 
  }

  // fetch
  let JSONResponse = await fetch(`${url}api/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObject)
  });
  //redirect to recipes
  window.location.href = 'recipes.html';
}

const getRecipe = async () => {
  let recipeId = localStorage.getItem("recipeId");
  let JSONData = await fetch(`${url}api/recipes/${recipeId}`);
  let data = await JSONData.json();
  console.log(data);
  return data;
}

const updateRecipe = async () => {
  let bodyObject = {
    "name": document.getElementById("rfname").value,
    "cost": document.getElementById("rfcost").value,
    "salePrice": document.getElementById("rfsaleprice").value 
  }
  let recipeId = localStorage.getItem("recipeId");

  // fetch
  let JSONResponse = await fetch(`${url}api/recipes/${recipeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObject)
  });
  let data = JSONResponse.json();

  //redirect to recipes
  localStorage.setItem("recipeEdit", false);
  window.location.href = 'recipes.html';
}

const adjustUIForPost = async () => {
  let recipe = await getRecipe();
  document.getElementById("rfname").value = recipe.name;
  document.getElementById("rfcost").value = recipe.cost;
  document.getElementById("rfsaleprice").value = recipe.saleprice;
  document.getElementById("recipe-form-submit").value = "Recept Aanpassen";
  document.getElementById("recipe-form-submit").addEventListener("click", updateRecipe);
}

const onLoad = () => {
  let isEdit = localStorage.getItem("recipeEdit");
  if (isEdit === 'true') {
    adjustUIForPost();
  } else {
    document.getElementById("recipe-form-submit").addEventListener("click", addRecipe);
  }
}

document.body.onload = onLoad;
