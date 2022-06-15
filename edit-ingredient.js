import {keys} from "./keys.js";

const ingredientId = localStorage.getItem("ingredientId");

const baseApiUrl = keys.url + 'api/ingredients';

let jsonObject;

let method = 'post';

const template = {
    "form":{'<>':'div', 'id':'result-form', 'html':[
        {'<>':'label', 'text':'Code'},
        {'<>':'input', 'id':'code', 'value':function(dataObject){
            if(method == 'put' && jsonObject.hasOwnProperty('code'))
            {
                return dataObject.code;
            }
        }},
        {'<>':'label', 'text':'Group'},
        {'<>':'input', 'id':'group', 'value':function(dataObject){
            if(method == 'put' && jsonObject.hasOwnProperty('group'))
            {
                return dataObject.group;
            }
        }},
        {'<>':'label', 'text':'Name'},
        {'<>':'input', 'id':'name', 'value':function(dataObject){
            if(method == 'put' && jsonObject.hasOwnProperty('name'))
            {
                return dataObject.name;
            }
        }},
        {'<>':'label', 'text':'Market Price'},
        {'<>':'input', 'id':'marketprice', 'value':function(dataObject){
            if(method == 'put' && jsonObject.hasOwnProperty('marketprice'))
            {
                return dataObject.marketprice;
            }
        }},
        {'<>':'label', 'text':'Nutrients'},
        {'<>':'input', 'id':'add-nutrient-input', 'list':'nutrient-datalist', 'type':'text'},
        {'<>':'span', 'class':'add-nutrient-button material-symbols-outlined', 'text':'add', 'onclick':function(){
            console.log($("#add-nutrient-input"));
            console.log($("#add-nutrient-input")[0].value);
        }},
        {'<>':'ul', 'html':[
            {'<>':'li', 'text':'${name}', '{}':function(dataObject){
                if(method == 'put' && jsonObject.hasOwnProperty('nutrients'))
                {
                    return dataObject.nutrients;
                }
            }}
        ]},
        // {'<>':'tr', 'html':[{'<>':'td', html:[{'<>':'label', 'text':'Nutrients'}]}]},
        // {'<>':'tr', 'html':[
        //     {'<>':'td', 'text':'${quantity}${unit}'},
        //     {'<>':'td', 'text':'${code}'},
        //     {'<>':'td', 'text':'${name}'},
        // ], '{}':function(){
        //     const filteredNutrients = [];
        //     for(let i in this.nutrients)
        //     {
        //         if(this.nutrients[i].quantity > 0)
        //         {
        //             filteredNutrients.push(this.nutrients[i]);
        //         }
        //     }
        //     return filteredNutrients;
        // }},
        {'<>':'button', 'text':'Save Ingredient', 'onclick':function(evObject){
            if(method == 'post')
            {
                createObject();
            }
            else if (method == 'put')
            {
                updateObject(evObject.obj.id);
            }
        }},
    ]},
    "datalist":{'<>':'option', 'value':'${id}#${name}', '{}':function(){
            return(this);
        }, 'onchange':function(){
            console.log(this.value);
    }}
};

function init()
{
    readObject(true);
}

/*
Get (read) ingredient by id
*/
const fetchObject = async() => {
    let apiUrl = baseApiUrl + `/${ingredientId}?nutrients=true`;
    let response = await fetch(apiUrl);
    return response.json();
}

const fetchNutrients = async() => {
    let apiUrl = keys.url + "api/nutrients";
    let response = await fetch(apiUrl);
    return response.json();
}

const readObject = async (fetch = false) => {
    if(ingredientId == null)
    {
        method = 'post';
        $("#result-form").json2html({}, template.form, {method:"replace"});
    }
    else
    {
        method = 'put';
        if(fetch)
        {
          jsonObject = await fetchObject();
        }
        console.log(jsonObject);
        $("#result-form").json2html(jsonObject, template.form, {method:"replace"});
    }
    let nutrientsObject;
    if(fetch)
    {
        nutrientsObject = await fetchNutrients();
    }
    console.log(nutrientsObject);
    $("#nutrient-datalist").json2html(nutrientsObject, template.datalist);
}

/*
Post (create) an ingredient
*/
const createObject = async () => {
    //In case a form is used; please insert
    //event.preventDefault();
    console.log("hi");
    let body = {};
    body['code'] = document.getElementById('code').value;
    body['group'] = document.getElementById('group').value;
    body['name'] = document.getElementById('name').value;
    body['marketprice'] = document.getElementById('marketprice').value;
    console.log(body);
    console.log(baseApiUrl);
    console.log(JSON.stringify(body));
    let response = await fetch(baseApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    await response.json();
    window.location.href = 'ingredients.html';
}

/*
Put (update) an ingredient
*/
const updateObject = async (objectId) => {
    let body = {};
    body['code'] = document.getElementById('code').value;
    body['group'] = document.getElementById('group').value;
    body['name'] = document.getElementById('name').value;
    body['marketprice'] = document.getElementById('marketprice').value;
    console.log(body);
    console.log(baseApiUrl);
    console.log(JSON.stringify(body));
    let response = await fetch(keys.url + "api/ingredients/" + objectId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    await response.json();
    window.location.href = 'ingredients.html';
}

window.onload = init;