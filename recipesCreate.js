import { keys } from './keys.js';
const { url } = keys;

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
  let JSONResponse = await fetch(`${url}api/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObject)
  });
  window.location.href = 'recipes.html'; //redirect to recipes
}

const submitButton = document.getElementById("recipe-form-submit");
submitButton.addEventListener("click", addRecipe);