/*
Template initialization for construction
*/
const nutrientTemplate = {
  children: [
    {key: 'id', type: 'number'},
    {key: 'name', type: 'text'},
  ],
  concat: "${id}: ${name}; ",
  create: false,
  edit: false
}
const nutrientArrayTemplate = {
  ref: nutrientTemplate,
  tag: 'td'
}

const ingredientTemplate = {
  children: [
    {key: 'id', type: 'number', tag: 'td'},
    {key: 'code', type: 'text', tag: 'td'},
    {key: 'group', type: 'text', tag: 'td'},
    {key: 'name', type: 'text', tag: 'td'},
    {key: 'marketPrice', type: 'number', tag: 'td'},
    {key: 'nutrients', type: 'ref', ref: nutrientArrayTemplate},
  ],
  tag: 'tr',
  create: true,
  edit: true
}
const ingredientArrayTemplate = {
  ref: ingredientTemplate,
  tag: 'table'
}

let editMode = false;
/*
Get (read) all ingredients
*/
const readObjects = async () => {
  let response = await fetch("http://localhost:8080/api/ingredients?nutrients=true");
  console.log(response);
  let jsonArray = await response.json();
  console.log(jsonArray);
  document.getElementById("ingredient-list").appendChild(jsonArrayToHtml(jsonArray, ingredientArrayTemplate, true));
/*   response = await fetch("http://localhost:8080/api/nutrients");
  jsonArray = await response.json();
  console.log(jsonArray);
  let dataList = document.createElement('datalist');
  dataList.id = 'nutrients';
  for (let i in jsonArray)
  {
    let jsonObject = jsonArray[i];
    let option = document.createElement('option');
    option.value = jsonObject.name;
    option.setAttribute("data-id", jsonObject.id);
    dataList.appendChild(option);
  }
  document.getElementById("ingredient-list").appendChild(dataList);
  console.log(template);
  template.id.name = "bla";
  alert(template[0]);
  alert(template[id]); */
}

function jsonArrayToHtml(jsonArray, template, header = false)
{
  let baseElement = document.createElement(template.tag);
  console.log(jsonArray);
  for (let i in jsonArray)
  {
    // this is definitely not ideal, figure out a better way later
    if (i == 0 && header)
    {
      let parentElement = document.createElement(template.ref.tag);
      for (let j in template.ref.children)
      {
        let childElement = document.createElement(template.ref.children[j].tag);
        childElement.innerText = template.ref.children[j].key;
        parentElement.appendChild(childElement);
      }
      baseElement.appendChild(parentElement);
    }
    baseElement.appendChild(jsonObjectToHtml(jsonArray[i], template.ref));
  }
  if(template.ref.create)
  {
    let parentElement = document.createElement(template.ref.tag);
    parentElement.id = "new-object";
    for (let i in template.ref.children)
    {
      let child = template.ref.children[i];
      let childElement = document.createElement(child.tag);
      if(child.key == "id")
      {
        // do nothing
      }
      else
      {
        let inputElement = document.createElement('input');
        inputElement.type = child.type;
        inputElement.id = child.key;
        childElement.appendChild(inputElement);
      }
      parentElement.appendChild(childElement);
    }
    let cellElement = document.createElement(template.ref.children[0].tag);
    let inputElement = document.createElement('input');
    inputElement.type = "submit";
    inputElement.id = "object-create";
    inputElement.value = "Submit";
    inputElement.addEventListener("click", () => createObject(template.ref));
    cellElement.appendChild(inputElement);
    parentElement.appendChild(cellElement);
    baseElement.appendChild(parentElement);
  }
  console.log(baseElement);
  return baseElement;
}

function jsonObjectToHtml(jsonObject, objectTemplate)
{
  if(objectTemplate.concat)
  {
    let text = objectTemplate.concat;
    for (let i in objectTemplate.children)
    {
      let child = objectTemplate.children[i];
      let literal = `${child.key}`;
      text = text.replace("${" + literal + "}", jsonObject[child.key]);
    }
    let textElement = document.createElement('text');
    textElement.innerText = text;
    return textElement;
  }
  let parentElement = document.createElement(objectTemplate.tag);
  parentElement.setAttribute('data-id', jsonObject["id"]);
  for (let i in objectTemplate.children)
  {
    let child = objectTemplate.children[i];
    if(child.type == "ref")
    {
      let childElement = document.createElement(child.ref.tag);
      childElement.appendChild(jsonArrayToHtml(jsonObject[child.key], child.ref));
      parentElement.appendChild(childElement);
    }
    else
    {
      let childElement = document.createElement(child.tag);
      childElement.innerText = jsonObject[child.key];
      parentElement.appendChild(childElement);
    }
  }
  console.log(parentElement);
  if(objectTemplate.edit)
  {
    let cellElement = document.createElement(objectTemplate.children[0].tag);
    if(!editMode)
    {
      let inputElement = document.createElement('input');
      inputElement.type = "submit";
      inputElement.classList.add("object-edit");
      inputElement.value = "Edit";
      inputElement.addEventListener("click", () => editObject(jsonObject["id"], objectTemplate));
      cellElement.appendChild(inputElement);
    }
    parentElement.appendChild(cellElement);
  }
  return parentElement;
}

function multiselect()
{
  let newEntry = document.createElement('div');
  newEntry.innerText = this.value;
  newEntry.setAttribute("data-id", this.getAttribute("data-id"));
  this.appendChild(newEntry);
}

/*
Post (create) an ingredient
*/

const createObject = async (objectTemplate) => {
  let body = {};
  let nutrientIds = [];
  for(let i in objectTemplate.children)
  {
    let child = objectTemplate.children[i];
    if(child.key == "id")
    {
      continue;
    }
    if(child.type == "ref")
    {
      let arr = document.getElementById(child.key).value.split(';');
      for(let j in arr)
      {
        nutrientIds.push(arr[j]);
      }
      continue;
    }
    body[child.key] = document.getElementById(child.key).value;
  }
  let response = await fetch("http://localhost:8080/api/ingredients", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
  });
  let jsonObject = await response.json();
  let newId = jsonObject["id"];
  let linkBody = {};
  console.log(nutrientIds);
  for(let i in nutrientIds)
  {
    linkBody["nutrientId"] = nutrientIds[i];
    console.log(linkBody);
    let linkResponse = await fetch(`http://localhost:8080/api/ingredients/${newId}/nutrients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(linkBody),
    });
    let jsonObject2 = await linkResponse.json();
  }
  //location.reload();
}

/*
Put (update) an ingredient
*/

function editObject(objectId, objectTemplate)
{
  let createElement = document.getElementById("new-object");
  createElement.remove();
  const editElements = document.getElementsByClassName("object-edit");
  for(const element of editElements)
  {
    element.parentElement.replaceWith(document.createElement('td'));
  }
  let rowElement = document.querySelector("[data-id=\"" + objectId + "\"]");
  //construct update form
  let newRowElement = document.createElement('tr');
  for(let i in objectTemplate.children)
  {
    let child = objectTemplate.children[i];
    let cellElement = document.createElement('td');
    if(child.key == "id")
    {
      cellElement.innerText = rowElement.children[i].innerText;
    }
    else
    {
      let inputElement = document.createElement('input');
      inputElement.type = child.type;
      inputElement.id = child.key;
      inputElement.value = rowElement.children[i].innerText;
      cellElement.appendChild(inputElement);
    }
    newRowElement.appendChild(cellElement);
  }
  let cellElement = document.createElement('td');
  let inputElement = document.createElement('input');
  inputElement.type = "submit";
  inputElement.id = "object-update";
  inputElement.value = "Update";
  inputElement.addEventListener("click", () => updateObject(objectId, objectTemplate));
  cellElement.appendChild(inputElement);
  inputElement = document.createElement('input');
  inputElement.type = "submit";
  inputElement.id = "object-delete";
  inputElement.value = "Delete";
  inputElement.addEventListener("click", () => deleteObject(objectId));
  cellElement.appendChild(inputElement);
  newRowElement.appendChild(cellElement);
  rowElement.replaceWith(newRowElement);
}

const updateObject = async (objectId, objectTemplate) => {
  let body = {};
  for(let i in objectTemplate.children)
  {
    let child = objectTemplate.children[i];
    if(child.key == "id")
    {
      continue;
    }
    if(child.type == "ref")
    {
      continue;
    }
    body[child.key] = document.getElementById(child.key).value;
  }
  let response = await fetch("http://localhost:8080/api/ingredients/" + objectId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  });
  let jsonObject = await response.json();
  location.reload();
}
/*
Delete an ingredient
*/

const deleteObject = async (objectId) => {
  let response = await fetch(`http://localhost:8080/api/ingredients/${objectId}`, {
    method: 'DELETE'
  });
  location.reload();
}

window.onload = readObjects;

// Via NPM of Nodeman hosten-inladen