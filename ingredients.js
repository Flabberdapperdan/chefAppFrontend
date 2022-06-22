import {keys} from "./keys.js";

const queryString = window.location.search;
const queryParams = new URLSearchParams(queryString);

const baseApiUrl = keys.url + "api/ingredients";

let jsonObject;
let page = 0;
let size = 10;
let sortBy = "id";
let orderBy = "asc";

const template = {
  "header":{'<>':'thead', 'id':'ingredient-table-header', 'html':[
    {'<>':'tr', 'html':[
      {'<>':'td', 'html':[
        {'<>':'button', 'text':'Create Ingredient', 'onclick':function(){
          localStorage.removeItem("ingredientId");
          window.location.href = 'edit-ingredient.html';
        }}
      ]}
    ]},
    {'<>':'tr', 'html':[
      {'<>':'th', 'text':'Id', 'onclick':function(){
        applySortAndOrder("id");
        page = 0;
        readTableBody(true);
      }},
      {'<>':'th', 'text':'Code', 'onclick':function(){
        applySortAndOrder("code");
        page = 0;
        readTableBody(true);
      }},
      {'<>':'th', 'text':'Group', 'onclick':function(){
        applySortAndOrder("group");
        page = 0;
        readTableBody(true);
      }},
      {'<>':'th', 'text':'Name', 'onclick':function(){
        applySortAndOrder("name");
        page = 0;
        readTableBody(true);
      }, 'html':[
        {'<>':'span', 'class':'material-symbols-outlined', 'text':'arrow_upward'},
      ]},
      {'<>':'th', 'text':'Market Price', 'onclick':function(){
        applySortAndOrder("marketprice");
        page = 0;
        readTableBody(true);
      }},
      {'<>':'th', 'html':[{'<>':'select', 'html':[
          {'<>':'option', 'value':'10', 'text':'10'},
          {'<>':'option', 'value':'20', 'text':'20'},
          {'<>':'option', 'value':'30', 'text':'30'},
          {'<>':'option', 'value':'40', 'text':'40'},
          {'<>':'option', 'value':'50', 'text':'50'},
          {'<>':'option', 'value':'100', 'text':'100'},
      ], 'onchange':function(){
        page = 0;
        size = this.val();
        readTableBody(true);
      }}]},
    ]},
  ]},
  "body":{'<>':'tbody', 'id':'ingredient-table-body', 'html':[
    {'<>':'tr', 'data-id':'${id}', 'html':[
      {'<>':'td', 'text':'${id}'},
      {'<>':'td', 'text':'${code}'},
      {'<>':'td', 'text':'${group}'},
      {'<>':'td', html:[
        {'<>':'span', 'class':'select-button', 'text':'${name}', 'onclick':function(evObject){
          localStorage.setItem("ingredientId", evObject.obj.id);
          window.location.href = 'view-ingredient.html';
        }}
      ]},
      {'<>':'td', 'text':'${marketprice}'},
      {'<>':'td', 'html':[{'<>':'span', 'class':'edit-button material-symbols-outlined', 'text':'change_circle', 'onclick':function(evObject){
        localStorage.setItem("ingredientId", evObject.obj.id);
        window.location.href = 'edit-ingredient.html';
      }}]},
      {'<>':'td', 'html':[{'<>':'span', 'class':'delete-button material-symbols-outlined', 'text':'delete', 'onclick':function(evObject){
        deleteIngredient(evObject.obj.id);
      }}]},
    ], '{}':function(){return(this.ingredients)}},
  ]},
  "footer":{'<>':'tfoot', 'id':'ingredient-table-footer', 'html':[
    {'<>':'tr', 'html':[
      {'<>':'td'},
      {'<>':'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'code'}]},
      {'<>':'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'group'}]},
      {'<>':'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'name'}]},
      {'<>':'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'marketprice'}]},
      {'<>':'td', 'html':[{'<>':'span', 'class':'create-button material-symbols-outlined', 'text':'add', 'onclick':function(){
        createIngredient();
      }}]},
    ]},
    {'<>':'tr', 'html':[
      {'<>':'td', 'html':[{'<>':'span', 'class':'page-nav-button material-symbols-outlined', 'text':'keyboard_double_arrow_left', 'onclick':function(){
        page = 0;
        readTableBody(true);
      }, 'style':function(){
        if(page == 0)
        {
          return "visibility:hidden";
        }
      }}]},
      {'<>':'td', 'html':[{'<>':'span', 'class':'page-nav-button material-symbols-outlined', 'text':'chevron_left', 'onclick':function(){
        page--;
        readTableBody(true);
      }, 'style':function(){
        if(page == 0)
        {
          return "visibility:hidden";
        }
      }}]},
      {'<>':'td', 'text':'Page ${currentPage} of ${totalPages}'},
      {'<>':'td', 'html':[{'<>':'span', 'class':'page-nav-button material-symbols-outlined', 'text':'chevron_right', 'onclick':function(){
        page++;
        readTableBody(true);
      }, 'style':function(dataObject){
        if(page == dataObject.totalPages - 1)
        {
          return "visibility:hidden";
        }
      }}]},
      {'<>':'td', 'html':[{'<>':'span', 'class':'page-nav-button material-symbols-outlined', 'text':'keyboard_double_arrow_right', 'onclick':function(evObject){
        page = evObject.obj.totalPages - 1;
        readTableBody(true);
      }, 'style':function(dataObject){
        if(page == dataObject.totalPages - 1)
        {
          return "visibility:hidden";
        }
      }}]},
    ]}
  ]},
};

function init() {
  if (queryParams.has('page')) {
    page = queryParams.get('page');
  }
  if (queryParams.has('size')) {
    size = queryParams.get('size');
  }
  readIngredients(true);
}

/*
Get (read) all ingredients
*/
const fetchIngredients = async() => {
  let apiUrl = baseApiUrl + `?page=${page}&size=${size}&sort_by=${sortBy}&order_by=${orderBy}`;
  let response = await fetch(apiUrl);
  return response.json();
}

function applySortAndOrder(value) {
  if(sortBy == value) {
    if(orderBy == "asc") {
      orderBy = "desc";
    } else {
      orderBy = "asc";
    }
  } else {
    sortBy = value;
    orderBy = "asc";
  }
}

const readIngredients = async (fetch = false) => {
  if(fetch) {
    jsonObject = await fetchIngredients();
  }
  console.log(jsonObject);

  readTableHeader();
  readTableBody();
}

const readTableHeader = async (fetch = false) => {
  if (fetch) {
    jsonObject = await fetchIngredients();
  }
  
  $("#ingredient-table-header").json2html(jsonObject, template.header, { method: "replace" });
}

const readTableBody = async (fetch = false) => {
  if (fetch) {
    jsonObject = await fetchIngredients();
  }

  $("#ingredient-table-body").json2html(jsonObject, template.body, { method: "replace" });
  $("#ingredient-table-footer").json2html(jsonObject, template.footer, { method: "replace" });
}

/*
Post (create) an ingredient
*/

const createIngredient = async () => {
  let ingredientObject = {};
  ingredientObject['code'] = document.querySelector('[data-name="code"]').value;
  ingredientObject['group'] = document.querySelector('[data-name="group"]').value;
  ingredientObject['name'] = document.querySelector('[data-name="name"]').value;
  ingredientObject['marketprice'] = document.querySelector('[data-name="marketprice"]').value;
  console.log(ingredientObject);
  let response = await fetch(baseApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ingredientObject),
  });
  await response.json();
  readTableBody(true);
}

/*
Delete an ingredient
*/

const deleteIngredient = async (ingredientId) => {
  let response = await fetch(keys.url + `api/ingredients/${ingredientId}`, {
    method: 'DELETE'
  });
  readTableBody(true);
}

window.onload = init;