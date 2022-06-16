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
  "header":{'<>':'thead', 'id':'table-header', 'html':[
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
        readBody(true);
      }},
      {'<>':'th', 'text':'Code', 'onclick':function(){
        applySortAndOrder("code");
        page = 0;
        readBody(true);
      }},
      {'<>':'th', 'text':'Group', 'onclick':function(){
        applySortAndOrder("group");
        page = 0;
        readBody(true);
      }},
      {'<>':'th', 'text':'Name', 'onclick':function(){
        applySortAndOrder("name");
        page = 0;
        readBody(true);
      }, 'html':[
        {'<>':'span', 'class':'material-symbols-outlined', 'text':'arrow_upward'},
      ]},
      {'<>':'th', 'text':'Market Price', 'onclick':function(){
        applySortAndOrder("marketprice");
        page = 0;
        readBody(true);
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
        readBody(true);
      }}]},
    ]},
  ]},
  "body":{'<>':'tbody', 'id':'table-body', 'html':[
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
        deleteObject(evObject.obj.id);
      }}]},
    ], '{}':function(){return(this.ingredients)}},
  ]},
  "footer":{'<>':'tfoot', 'id':'table-footer', 'html':[
    {'<>':'tr', 'html':[
      {'<>':'td'},
      {'<>':'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'code'}]},
      {'<>':'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'group'}]},
      {'<>':'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'name'}]},
      {'<>':'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'marketprice'}]},
      {'<>':'td', 'html':[{'<>':'span', 'class':'create-button material-symbols-outlined', 'text':'add', 'onclick':function(){
        createObject();
      }}]},
    ]},
    {'<>':'tr', 'html':[
      {'<>':'td', 'html':[{'<>':'span', 'class':'page-nav-button material-symbols-outlined', 'text':'keyboard_double_arrow_left', 'onclick':function(){
        page = 0;
        readBody(true);
      }, 'style':function(){
        if(page == 0)
        {
          return "visibility:hidden";
        }
      }}]},
      {'<>':'td', 'html':[{'<>':'span', 'class':'page-nav-button material-symbols-outlined', 'text':'chevron_left', 'onclick':function(){
        page--;
        readBody(true);
      }, 'style':function(){
        if(page == 0)
        {
          return "visibility:hidden";
        }
      }}]},
      {'<>':'td', 'text':'Page ${currentPage} of ${totalPages}'},
      {'<>':'td', 'html':[{'<>':'span', 'class':'page-nav-button material-symbols-outlined', 'text':'chevron_right', 'onclick':function(){
        page++;
        readBody(true);
      }, 'style':function(dataObject){
        if(page == dataObject.totalPages - 1)
        {
          return "visibility:hidden";
        }
      }}]},
      {'<>':'td', 'html':[{'<>':'span', 'class':'page-nav-button material-symbols-outlined', 'text':'keyboard_double_arrow_right', 'onclick':function(evObject){
        page = evObject.obj.totalPages - 1;
        readBody(true);
      }, 'style':function(dataObject){
        if(page == dataObject.totalPages - 1)
        {
          return "visibility:hidden";
        }
      }}]},
    ]}
  ]},
};

function init()
{
  if(queryParams.has('page'))
  {
    page = queryParams.get('page');
  }
  if(queryParams.has('size'))
  {
    size = queryParams.get('size');
  }
  readTable(true);
}

/*
Get (read) all ingredients
*/
const fetchObject = async() => {
  let apiUrl = baseApiUrl + `?page=${page}&size=${size}&sort_by=${sortBy}&order_by=${orderBy}`;
  let response = await fetch(apiUrl);
  return response.json();
}

function applySortAndOrder(value)
{
  if(sortBy == value)
  {
    if(orderBy == "asc")
    {
      orderBy = "desc";
    }
    else
    {
      orderBy = "asc";
    }
  }
  else
  {
    sortBy = value;
    orderBy = "asc";
  }
}

const readTable = async (fetch = false) => {
  if(fetch)
  {
    jsonObject = await fetchObject();
  }
  console.log(jsonObject);

  readHeader();
  readBody();
}

const readHeader = async (fetch = false) => {
  if(fetch)
  {
    jsonObject = await fetchObject();
  }
  console.log(jsonObject);
  
  $("#table-header").json2html(jsonObject, template.header, {method:"replace"});
}

const readBody = async (fetch = false) => {
  if(fetch)
  {
    jsonObject = await fetchObject();
  }
  console.log(jsonObject);

  $("#table-body").json2html(jsonObject, template.body, {method:"replace"});
  $("#table-footer").json2html(jsonObject, template.footer, {method:"replace"});
}

/*
Post (create) an ingredient
*/

const createObject = async () => {
  let body = {};
  body['code'] = document.querySelector('[data-name="code"]').value;
  body['group'] = document.querySelector('[data-name="group"]').value;
  body['name'] = document.querySelector('[data-name="name"]').value;
  body['marketprice'] = document.querySelector('[data-name="marketprice"]').value;
  console.log(body);
  console.log(baseApiUrl);
  console.log(JSON.stringify(body));
  let response = await fetch(baseApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
  });
  let jsonObject = await response.json();
  readBody(true);
}

/*
Delete an ingredient
*/

const deleteObject = async (objectId) => {
  let response = await fetch(keys.url + `api/ingredients/${objectId}`, {
    method: 'DELETE'
  });
  readBody(true);
}

window.onload = init;