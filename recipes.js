import { keys } from './keys.js';
const { url } = keys;

// RECIPE SECTION \\
const deleteRecipe = async (id) => {
  let JSONResponse = await fetch(`${url}api/recipes/${id}`, {
    method: 'DELETE'
  });
  let data = await JSONResponse.json();
  getAllRecipes();
}

const getAllRecipes = async () => {
  //fetch
  let JSONData = await fetch(`${url}api/recipes`);
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
      <th>${element.saleprice}</th>
      <th>
        <button data-id="${element.id}" class="recipes-button recipe-add-button">
          <span class="material-symbols-outlined">
            library_add
          </span>
        </button>
        <button data-id="${element.id}" class="recipes-button recipe-edit-button">
          <span class="material-symbols-outlined">
            edit
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
    });
  });

  //attach edit-event
  let editButtons = document.getElementsByClassName("recipe-edit-button");
  let editButtonsArr = Array.from(editButtons);
  editButtonsArr.forEach(button => {
    button.addEventListener("click", () => {
      localStorage.setItem("recipeId", button.dataset.id);
      localStorage.setItem("recipeEdit", true);
      window.location.href = 'recipesCreate.html';
    });
  });
}

// DOM-MANIPULATION \\
const onLoadCalls = () => {
  localStorage.setItem("recipeEdit", false);
  getAllRecipes();
}
document.body.onload = onLoadCalls;
