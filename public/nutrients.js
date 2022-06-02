const properties = ["id", "code", "group", "name", "unit"];
let editMode = false;
/*
Get (read) all ingredients
*/
const readObjects = async () => {
  let response = await fetch("http://localhost:8080/api/nutrients");
  console.log(response);
  let jsonArray = await response.json();
  console.log(jsonArray);
  document.getElementById("nutrient-list").innerHTML = arrayToTable(jsonArray);
  populateEventListeners();
}

function arrayToTable(jsonArray)
{
  let htmlText = "<table>";
  htmlText += "<tr>";
  for(let i in properties)
  {
    htmlText += "<td>" + properties[i] + "</td>";
  }
  htmlText += "</tr>";
  for(let i in jsonArray)
  {
    let jsonObject = jsonArray[i];
    htmlText += "<tr id=" + jsonObject["id"] + " + >";
    console.log(jsonObject);
    for(let i in properties)
    {
      console.log(properties[i]);
      htmlText += "<td>" + jsonObject[properties[i]] + "</td>";
    }
    if(editMode)
    {
      htmlText += "<td></td>";
    }
    else
    {
      htmlText += "<td><input type=\"submit\" class=\"object-edit\" value=\"Edit\"></td>";
    }
    htmlText += "</tr>";
  }
  htmlText += "<tr id=\"new-object\"><form>";
  for(let i in properties)
  {
    if(properties[i] == "id")
    {
      htmlText += "<td></td>";
    }
    else
    {
      htmlText += "<td><input type=\"text\" id=\"" + properties[i] + "\"></td>";
    }
  }
  htmlText += "<td><input type=\"submit\" id=\"object-create\" value=\"Create\"></td>";
  htmlText += "</form></tr>";
  htmlText += "</table>";
  return htmlText;
}

function populateEventListeners()
{
  let createButton = document.getElementById("object-create");
  createButton.addEventListener("click", createObject);
  const editButtons = document.getElementsByClassName("object-edit");
  Array.prototype.forEach.call(editButtons, function(editButton) {
    editButton.addEventListener("click", editObject);
  });
}

/*
Post (create) an ingredient
*/

const createObject = async () => {
  //alert(this.parentElement.parentElement.id);
  let body = "{";
  const propertyValues = [];
  for(let i in properties)
  {
    if(properties[i] == "id")
    {
      continue;
    }
    let propertyValue = "\"" + properties[i] + "\":\"" + document.getElementById(properties[i]).value + "\"";
    propertyValues.push(propertyValue);
  }
  body += propertyValues.toString();
  body += "}";
  let response = await fetch("http://localhost:8080/api/nutrients", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body,
  });
  let jsonObject = await response.json();
  location.reload();
}

/*
Put (update) an ingredient
*/

function editObject()
{
  //alert(this.parentElement.parentElement.id);
  let rowElement = this.parentElement.parentElement;
  //remove the other buttons for now
  document.getElementById("new-object").remove();
  const rowElements = rowElement.parentElement.children;
  for(let i = 0; i < rowElements.length; i++)
  {
    rowElements[i].lastElementChild.innerHTML = "<td></td>";
  }
  //construct update form
  let htmlText = "<form>";
  for(i in properties)
  {
    if(properties[i] == "id")
    {
      htmlText += "<td>" + rowElement.children[i].innerHTML + "</td>";
    }
    else
    {
      htmlText += "<td><input type=\"text\" id=\"" + properties[i] + "\" value=\"" + rowElement.children[i].innerHTML + "\"></td>";
    }
  }
  htmlText += "<td><input type=\"submit\" id=\"object-update\" value=\"Update\">";
  htmlText += "</form><input type=\"button\" id=\"object-delete\" value=\"Delete\"></td>";
  rowElement.innerHTML = htmlText;
  let updateButton = document.getElementById("object-update");
  updateButton.addEventListener("click", () => updateObject(updateButton.parentElement.parentElement.id));
  let deleteButton = document.getElementById("object-delete");
  deleteButton.addEventListener("click", () => deleteObject(deleteButton.parentElement.parentElement.id));
}

const updateObject = async (objectId) => {
  let body = "{";
  const propertyValues = [];
  for(let i in properties)
  {
    if(properties[i] == "id")
    {
      continue;
    }
    let propertyValue = "\"" + properties[i] + "\":\"" + document.getElementById(properties[i]).value + "\"";
    propertyValues.push(propertyValue);
  }
  body += propertyValues.toString();
  body += "}";
  let response = await fetch("http://localhost:8080/api/nutrients/" + objectId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body,
  });
  let jsonObject = await response.json();
  location.reload();
}
/*
Delete an ingredient
*/

const deleteObject = async (objectId) => {
  let response = await fetch(`http://localhost:8080/api/nutrients/${objectId}`, {
    method: 'DELETE'
  });
  location.reload();
}

window.onload = readObjects;