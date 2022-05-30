const getAll = async () => {
  //fetch
  let JSONData = await fetch("http://localhost:8080/api/recipes");
  let data = await JSONData.json();
  console.log(data);
  
  //display
  const resultsTable = document.getElementById("ingredient-result-body");
  resultsTable.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    let newRow = document.createElement("tr", {
      data : element.id
  });
    let newString = `
    <tr >
      <th>${element.name}</th>
      <th>${element.cost}</th>
      <th>${element.salePrice}</th>
      <button>Delete</button>
      <button>Adjust</button>
    </tr>
    `;
    newRow.innerHTML = newString;
    resultsTable.appendChild(newRow);
  }
}

const handleSubmit = async () => {
  const nameInput = document.getElementById("rfname");
  const costInput = document.getElementById("rfcost");
  const salePriceInput = document.getElementById("rfsaleprice");
  let bodyObject = {
    "name": nameInput.value,
    "cost": costInput.value,
    "salePrice": salePriceInput.value 
  }

  let JSONResponse = await fetch("http://localhost:8080/api/recipes", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObject)
  });
  let response = await JSONResponse.json();
  console.log(response);

  getAll();
  nameInput.value = "";
  costInput.value = "";
  salePriceInput.value = "";
}


// DOM-manipulation
const submitButton = document.getElementById("recipe-form-submit");
submitButton.addEventListener("click", handleSubmit);
window.onload = getAll;