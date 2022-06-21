import {keys} from "./keys.js";

const queryString = window.location.search;
const queryParams = new URLSearchParams(queryString);

const baseApiUrl = keys.url + "api/nutrients";

let jsonObject;
let page = 0;
let size = 10;
let sortBy = "id";
let orderBy = "asc";

const template = {
  "header":{'<>':'thead', 'id':'nutrient-table-header', 'html':[
    {'<>':'tr', 'html':[
      {'<>':'td', 'html':[
        {'<>':'button', 'text':'Create Nutrient', 'onclick':function(){
          localStorage.removeItem("nutrientId");
          window.location.href = 'edit-nutrient.html';
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
      {'<>':'th', 'text':'Unit', 'onclick':function(){
        applySortAndOrder("unit");
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
  "body":{'<>':'tbody', 'id':'nutrient-table-body', 'html':[
    {'<>':'tr', 'data-id':'${id}', 'html':[
      {'<>':'td', 'text':'${id}'},
      {'<>':'td', 'text':'${code}'},
      {'<>':'td', 'text':'${group}'},
      {'<>':'td', html:[
        {'<>':'span', 'class':'select-button', 'text':'${name}', 'onclick':function(evObject){
          localStorage.setItem("nutrientId", evObject.obj.id);
          window.location.href = 'view-nutrient.html';
        }}
      ]},
      {'<>':'td', 'text':'${unit}'},
      {'<>':'td', 'html':[{'<>':'span', 'class':'edit-button material-symbols-outlined', 'text':'change_circle', 'onclick':function(evObject){
        localStorage.setItem("nutrientId", evObject.obj.id);
        window.location.href = 'edit-nutrient.html';
      }}]},
      {'<>':'td', 'html':[{'<>':'span', 'class':'delete-button material-symbols-outlined', 'text':'delete', 'onclick':function(evObject){
        deleteNutrient(evObject.obj.id);
      }}]},
    ], '{}':function(){return(this.nutrients)}},
  ]},
  "footer":{'<>':'tfoot', 'id':'nutrient-table-footer', 'html':[
/*     {'<>':'tr', 'html':[
      {'<>':'td'},
      {'<>':'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'code'}]},
      {'<>':'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'group'}]},
      {'<>':'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'name'}]},
      {'<>':'td', 'html':[{'<>':'input', 'type':'text', 'data-name':'unit'}]},
      {'<>':'td', 'html':[{'<>':'span', 'class':'create-button material-symbols-outlined', 'text':'add', 'onclick':function(){
        createNutrient();
      }}]},
    ]}, */
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
  readNutrients(true);
}

/*
Get (read) all nutrients
*/
const fetchNutrients = async() => {
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

const readNutrients = async (fetch = false) => {
  if(fetch)
  {
    jsonObject = await fetchNutrients();
  }
  console.log(jsonObject);

  readTableHeader();
  readTableBody();
}

const readTableHeader = async (fetch = false) => {
  if(fetch)
  {
    jsonObject = await fetchNutrients();
  }
  
  $("#nutrient-table-header").json2html(jsonObject, template.header, {method:"replace"});
}

const readTableBody = async (fetch = false) => {
  if(fetch)
  {
    jsonObject = await fetchNutrients();
  }

  $("#nutrient-table-body").json2html(jsonObject, template.body, {method:"replace"});
  $("#nutrient-table-footer").json2html(jsonObject, template.footer, {method:"replace"});
}

/*
Post (create) an nutrient
*/

const createNutrient = async () => {
  let nutrientObject = {};
  nutrientObject['code'] = document.querySelector('[data-name="code"]').value;
  nutrientObject['group'] = document.querySelector('[data-name="group"]').value;
  nutrientObject['name'] = document.querySelector('[data-name="name"]').value;
  nutrientObject['unit'] = document.querySelector('[data-name="unit"]').value;
  console.log(nutrientObject);
  let response = await fetch(baseApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nutrientObject),
  });
  await response.json();
  readTableBody(true);
}

/*
Delete an nutrient
*/

const deleteNutrient = async (nutrientId) => {
  let response = await fetch(keys.url + `api/nutrients/${nutrientId}`, {
    method: 'DELETE'
  });
  readTableBody(true);
}

window.onload = init;