import {keys} from "./keys.js";

const ingredientId = localStorage.getItem("ingredientId");

const baseApiUrl = keys.url + `api/ingredients/${ingredientId}?nutrients=true&allergens=true`;

let ingredientObject;

const template = {
    "header":{'html':[
        {'<>':'h1', 'id':'ingredient-header', 'text':'${name}'},
        {'<>':'span', 'class':'edit-button material-symbols-outlined', 'text':'change_circle', 'onclick':function(evObject){
            localStorage.setItem("ingredientId", evObject.obj.id);
            window.location.href = 'edit-ingredient.html';
        }},
        {'<>':'span', 'class':'delete-button material-symbols-outlined', 'text':'delete', 'onclick':function(evObject){
            deleteIngredient(evObject.obj.id);
        }}
    ]},
    "table":{'<>':'table', 'id':'ingredient-table', 'html':[
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
            {'<>':'td', html:[{'<>':'span', 'text':'${marketprice}'}]},
        ]},
        {'<>':'tr', 'html':[{'<>':'td', html:[{'<>':'label', 'text':'Nutrients'}]}]},
        {'<>':'tr', 'html':[
            {'<>':'td', 'text':'${quantity}${nutrient.unit}'},
            {'<>':'td', 'text':'${nutrient.code}'},
            {'<>':'td', 'text':'${nutrient.name}'},
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
        {'<>':'tr', 'html':[{'<>':'td', html:[{'<>':'label', 'text':'Allergens'}]}]},
        {'<>':'tr', 'html':[
            {'<>':'td', 'text':'${allergen.code}'},
            {'<>':'td', 'text':'${allergen.name}'},
        ], '{}':function(){
            return this.allergens;
        }},
    ]},
};

console.log(ingredientId);

function init()
{
    readIngredient(true);
}

/*
Get (read) ingredient by id
*/
const fetchIngredient = async() => {
    let apiUrl = baseApiUrl;
    let response = await fetch(apiUrl);
    return response.json();
}

const readIngredient = async (fetch = false) => {
    if(fetch)
    {
      ingredientObject = await fetchIngredient();
    }
    console.log(ingredientObject);

    $("#ingredient-header").json2html(ingredientObject, template.header, {method:"replace"});
    $("#ingredient-table").json2html(ingredientObject, template.table, {method:"replace"});
}

/*
Delete an ingredient
*/

const deleteIngredient = async (objectId) => {
    let response = await fetch(keys.url + `api/ingredients/${objectId}`, {
        method: 'DELETE'
    });
    window.location.href = 'ingredients.html';
}

window.onload = init;