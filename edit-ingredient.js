import {keys} from "./keys.js";

const ingredientId = localStorage.getItem("ingredientId");

const baseApiUrl = keys.url + 'api/ingredients';

let jsonObject;

let nutrientArray = [];
let ingredientNutrientArray = [];

let method = 'post';

const template = {
    "form":{'<>':'div', 'id':'result-form', 'html':[
        {'<>':'label', 'text':'Code'},
        {'<>':'input', 'id':'code', 'type':'number', 'value':function(dataObject){
            if(method == 'put' && jsonObject.hasOwnProperty('code'))
            {
                console.log(dataObject.code);
                return dataObject.code.toString();
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
        {'<>':'input', 'id':'marketprice', 'type':'number', 'step':'.01', 'value':function(dataObject){
            if(method == 'put' && jsonObject.hasOwnProperty('marketprice'))
            {
                console.log(dataObject.marketprice);
                return dataObject.marketprice.toString();
            }
        }},
        {'<>':'label', 'text':'Nutrients'},
        {'<>':'br'},
        {'<>':'input', 'id':'add-nutrient-input', 'list':'nutrient-datalist', 'type':'text'},
        {'<>':'span', 'class':'add-nutrient-button material-symbols-outlined', 'text':'add', 'onclick':function(){
            let nutrientId = $("#add-nutrient-input")[0].value.split("#")[0];
            console.log(nutrientId);
            let nutrientObject = nutrientArray.find(obj => obj.id == nutrientId);
            $("#nutrients-table").json2html(nutrientObject, template.nutrient);
        }},
        {'<>':'table', 'id':'nutrients-table', 'html':function(dataObject)
        {
            if(method == 'put' && jsonObject.hasOwnProperty('nutrients'))
            {
                for (let nutrient of dataObject.nutrients)
                {
                    ingredientNutrientArray.push(nutrient.joinId);
                }
                return $.json2html(dataObject.nutrients, template.nutrient);
            }
        }},
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
    }},
    "nutrient":{'<>':'tr', 'class':'ingredient-nutrient', 'data-id':'${joinId}', 'html':[
        {'<>':'td', 'data-name':'id', 'text':'${id}'},
        {'<>':'td', html:[{'<>':'input', 'type':'number', 'data-name':'quantity', 'value':'${quantity}'}]},
        {'<>':'td', 'text':'${unit}'},
        {'<>':'td', 'text':'${code}'},
        {'<>':'td', 'text':'${name}'},
        {'<>':'td', 'html':[{'<>':'span', 'class':'delete-button material-symbols-outlined', 'text':'delete', 'onclick':function(evObject){
            (this[0].parentElement.parentElement).remove();
          }}]},
    ]}
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
    if(fetch)
    {
        nutrientArray = await fetchNutrients();
    }
    console.log(nutrientArray);
    $("#nutrient-datalist").json2html(nutrientArray, template.datalist);
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
    console.log(JSON.stringify(body));
    let response = await fetch(baseApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    let ingredientJson = await response.json();
    let ingredientNutrients = document.querySelectorAll('.ingredient-nutrient');
    console.log(ingredientNutrients);
    for (const ingredientNutrient of ingredientNutrients)
    {
        let nutrientId = ingredientNutrient.querySelector('[data-name="id"]').innerText;
        let nutrientQuantity = ingredientNutrient.querySelector('[data-name="quantity"]').value;
        let ingredientNutrientBody = {};
        ingredientNutrientBody['nutrientId'] = nutrientId;
        ingredientNutrientBody['quantity'] = nutrientQuantity;
        let ingredientNutrientResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/` + "nutrients", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingredientNutrientBody)
        });
        await ingredientNutrientResponse.json();
    }
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
    console.log(objectId);
    console.log(body);
    let response = await fetch(keys.url + "api/ingredients/" + objectId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    let ingredientJson = await response.json();
    console.log(ingredientJson);
    let ingredientNutrients = document.querySelectorAll('.ingredient-nutrient');
    console.log(ingredientNutrients);
    let doneIngredientNutrientIds = [];
    for (const ingredientNutrient of ingredientNutrients)
    {
        console.log(ingredientNutrient);
        let ingredientNutrientId = ingredientNutrient.getAttribute('data-id');
        let submethod = 'POST';
        if(ingredientNutrientId.length > 0)
        {
            submethod = 'PUT'
            doneIngredientNutrientIds.push(parseInt(ingredientNutrientId));
        }
        console.log(ingredientNutrientId);
        let nutrientId = ingredientNutrient.querySelector('[data-name="id"]').innerText;
        let nutrientQuantity = ingredientNutrient.querySelector('[data-name="quantity"]').value;
        let ingredientNutrientBody = {};
        if(ingredientNutrientId.length > 0)
        {
            ingredientNutrientBody['joinId'] = ingredientNutrientId;
        }
        ingredientNutrientBody['nutrientId'] = nutrientId;
        ingredientNutrientBody['quantity'] = nutrientQuantity;
        console.log(ingredientNutrientBody);
        let ingredientNutrientResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/` + "nutrients", {
            method: submethod,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingredientNutrientBody)
        });
        await ingredientNutrientResponse.json();
    }
    console.log(doneIngredientNutrientIds);
    for (const ingredientNutrientId of ingredientNutrientArray)
    {
        console.log(ingredientNutrientArray);
        console.log(doneIngredientNutrientIds);
        console.log(doneIngredientNutrientIds.indexOf(ingredientNutrientId));
        // not in starting list
        if(doneIngredientNutrientIds.indexOf(ingredientNutrientId) < 0)
        {
            let ingredientNutrientBody = {};
            ingredientNutrientBody['joinId'] = ingredientNutrientId;
            let ingredientNutrientResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/` + "nutrients", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ingredientNutrientBody)
            });
            await ingredientNutrientResponse.json();
        }
    }
    //window.location.href = 'ingredients.html';
}

window.onload = init;