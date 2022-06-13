import {keys} from "./keys.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

/*
Get (read) all ingredients
*/
const readObjects = async () => {
  let apiUrl = keys.url + "api/ingredients"

  const apiParams = [];
  for (const key of urlParams.keys())
  {
    apiParams.push(key + '=' + urlParams.get(key));
  }

  apiUrl += '?' + apiParams.join('&');

  let response = await fetch(apiUrl);
  console.log(response);
  let jsonObject = await response.json();
  let jsonArray = jsonObject["ingredients"];
  console.log(jsonArray);

  let headerTemplate = {'<>':'thead', 'html':[
    {'<>':'tr', 'html':[
      {'<>':'th', 'text':'Id'},
      {'<>':'th', 'text':'Code'},
      {'<>':'th', 'text':'Group'},
      {'<>':'th', 'text':'Name'},
      {'<>':'th', 'text':'Market Price'},
    ]}
  ]};

  let bodyTemplate = {'<>': 'tr', 'data-id':'${id}' ,'html':[
    {'<>':'td', 'text':'${id}'},
    {'<>':'td', 'text':'${code}'},
    {'<>':'td', 'text':'${group}'},
    {'<>':'td', 'text':'${name}'},
    {'<>':'td', 'text':'${marketPrice}'},
    /*{'<>': 'td', 'html':[
      {'<>': 'span', 'text': '${id}: ${code} x ${quantity}', '{}':function(){return(this.nutrients)}}
    ]},*/
    {'<>':'td', 'html':[
      {'<>':'button', 'html':'Edit', 'class':'object-edit','onclick':function(obj,index){
        editObject(obj);
      }},
    ]},
  ]};

  let footerTemplate = {'<>': 'tfoot', 'html':[
    {'<>': 'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'id'}]},
    {'<>': 'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'code'}]},
    {'<>': 'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'group'}]},
    {'<>': 'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'name'}]},
    {'<>': 'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'marketPrice'}]},
    {'<>': 'td', 'html':[{'<>':'button', 'id':'object-create', 'data-name':'marketPrice'}]},
  ]}
  
  $("#ingredient-table").json2html(jsonArray[0], headerTemplate);
  $("#ingredient-table").json2html(jsonArray, bodyTemplate);
  $("#ingredient-table").json2html(jsonArray[0], footerTemplate);
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
  let response = await fetch(keys.url + "api/ingredients", {
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
    let linkResponse = await fetch(keys.url + `api/ingredients/${newId}/nutrients`, {
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

function editObject(obj)
{
  console.log(obj.obj.id);
  return;
  let createElement = document.getElementById("object-create");
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
  let response = await fetch(keys.url + "api/ingredients/" + objectId, {
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
  let response = await fetch(keys.url + `api/ingredients/${objectId}`, {
    method: 'DELETE'
  });
  location.reload();
}

window.onload = readObjects;

// Via NPM of Nodeman hosten-inladen