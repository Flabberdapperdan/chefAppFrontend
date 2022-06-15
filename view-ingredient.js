import {keys} from "./keys.js";

const ingredientId = localStorage.getItem("ingredientId");

const baseApiUrl = keys.url + `api/ingredients/${ingredientId}?nutrients=true`;

let jsonObject;

const template = {
    "header":{'html':[
        {'<>':'h1', 'id':'result-header', 'text':'${name}'},
        {'<>':'span', 'class':'edit-button material-symbols-outlined', 'text':'change_circle', 'onclick':function(evObject){
            localStorage.setItem("ingredientId", evObject.obj.id);
            window.location.href = 'edit-ingredient.html';
        }},
        {'<>':'span', 'class':'delete-button material-symbols-outlined', 'text':'delete', 'onclick':function(evObject){
            deleteObject(evObject.obj.id);
        }}
    ]},
    "table":{'<>':'table', 'id':'result-table', 'html':[
        {'<>':'tr', 'html':[
            {'<>':'td', html:[{'<>':'label', 'text':'Id'}]},
            {'<>':'td', html:[{'<>':'span', 'text':'${id}'}]},
        ]},
        {'<>':'tr', 'html':[
            {'<>':'td', html:[{'<>':'label', 'text':'Code'}]},
            {'<>':'td', html:[{'<>':'span', 'text':'${code}'}]},
        ]},
        {'<>':'tr', 'html':[
            {'<>':'td', html:[{'<>':'label', 'text':'Group'}]},
            {'<>':'td', html:[{'<>':'span', 'text':'${group}'}]},
        ]},
        {'<>':'tr', 'html':[
            {'<>':'td', html:[{'<>':'label', 'text':'Name'}]},
            {'<>':'td', html:[{'<>':'span', 'text':'${name}'}]},
        ]},
        {'<>':'tr', 'html':[
            {'<>':'td', html:[{'<>':'label', 'text':'Market Price'}]},
            {'<>':'td', html:[{'<>':'span', 'text':'${marketPrice}'}]},
        ]},
        {'<>':'tr', 'html':[{'<>':'td', html:[{'<>':'label', 'text':'Nutrients'}]}]},
        {'<>':'tr', 'html':[
            {'<>':'td', 'text':'${quantity}${unit}'},
            {'<>':'td', 'text':'${code}'},
            {'<>':'td', 'text':'${name}'},
        ], '{}':function(){
            const filteredNutrients = [];
            for(let i in this.nutrients)
            {
                if(this.nutrients[i].quantity > 0)
                {
                    filteredNutrients.push(this.nutrients[i]);
                }
            }
            return filteredNutrients;
        }},
    ]},
};

console.log(ingredientId);

function init()
{
    readObject(true);
}

/*
Get (read) ingredient by id
*/
const fetchObject = async() => {
    let apiUrl = baseApiUrl;
    let response = await fetch(apiUrl);
    return response.json();
}

const readObject = async (fetch = false) => {
    if(fetch)
    {
      jsonObject = await fetchObject();
    }
    console.log(jsonObject);

    $("#result-header").json2html(jsonObject, template.header, {method:"replace"});
    $("#result-table").json2html(jsonObject, template.table, {method:"replace"});
}

/*
Delete an ingredient
*/

const deleteObject = async (objectId) => {
    let response = await fetch(keys.url + `api/ingredients/${objectId}`, {
        method: 'DELETE'
    });
    window.location.href = 'ingredients.html';
}

window.onload = init;