import {keys} from "./keys.js";

const baseApiUrl = keys.url + "api/allergens";

const deletOne = async (id) => {
    let JSONResponse = await fetch(`${baseApiUrl}/${id}`, {
      method: 'DELETE'
    });
    getAll();
  }
  
  const getAll = async () => {
    //fetch
    let JSONData = await fetch(baseApiUrl);
    let data = await JSONData.json();
    
    //display
    const resultsTable = document.getElementById("allergen-result-body");
    resultsTable.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      let newRow = document.createElement("tr", {
        data : element.id
    });
      let newString = `
      <tr>
        <th>${element.name}</th>
        <button data-id="${element.id}" class="allergen-delete-button">Delete</button>
        <button>Adjust</button>
      </tr>
      `;
      newRow.innerHTML = newString;
      resultsTable.appendChild(newRow);
    }
  
    //attach delete-event
    let deleteButtons = document.getElementsByClassName("allergen-delete-button");
    for (let j = 0; j < deleteButtons.length; j++) {
      const button = deleteButtons[j];
      button.addEventListener("click", () => {
        deletOne(button.dataset.id);
      })
    }
  }
  
  const handleSubmit = async () => {
    const nameInput = document.getElementById("alname");
    const codeInput = "test";

    let bodyObject = {
      "name": nameInput.value,
      "code": codeInput
    }
  
    let JSONResponse = await fetch(baseApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyObject)
    });
    let response = await JSONResponse.json();
  
    getAll();
    nameInput.value = "";
  }
  
  
  // DOM-manipulation
  const submitButton = document.getElementById("allergen-form-submit");
  submitButton.addEventListener("click", handleSubmit);
  window.onload = getAll;