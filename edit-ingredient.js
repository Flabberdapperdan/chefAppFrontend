import {keys} from "./keys.js";

const ingredientId = localStorage.getItem("ingredientId");

const baseApiUrl = keys.url + 'api/ingredients';

let ingredientObject;

let nutrientArray = [];
let ingredientNutrientArray = [];
let ingredientNutrientIndex = 0;

let allergenArray = [];
let ingredientAllergenArray = [];
let ingredientAllergenIndex = 0;

let method = 'post';

const template = {
    "header":{'html':[
        {'<>':'h1', 'id':'ingredient-header', 'text':function(dataObject){
            if(dataObject.hasOwnProperty('name'))
            {
                return dataObject.name;
            }
            else
            {
                return "New Ingredient";
            }
        }},
    ]},
    "form":{'<>':'div', 'id':'ingredient-form', 'html':[
        {'<>':'label', 'text':'Code'},
        {'<>':'input', 'id':'code', 'type':'number', 'value':function(dataObject){
            if(method == 'put' && dataObject.hasOwnProperty('code'))
            {
                return dataObject.code.toString();
            }
            else
            {
                return (0).toString();
            }
        }},
        {'<>':'span', 'id':'code-error'},
        {'<>':'label', 'text':'Group*'},
        {'<>':'input', 'id':'group', 'value':function(dataObject){
            if(method == 'put' && dataObject.hasOwnProperty('group'))
            {
                return dataObject.group;
            }
        }},
        {'<>':'span', 'id':'group-error'},
        {'<>':'label', 'text':'Name*'},
        {'<>':'input', 'id':'name', 'value':function(dataObject){
            if(method == 'put' && dataObject.hasOwnProperty('name'))
            {
                return dataObject.name;
            }
        }},
        {'<>':'span', 'id':'name-error'},
        {'<>':'label', 'text':'Market Price*'},
        {'<>':'input', 'id':'marketprice', 'type':'number', 'step':'.01', 'value':function(dataObject){
            if(method == 'put' && dataObject.hasOwnProperty('marketprice'))
            {
                return dataObject.marketprice.toString();
            }
            else
            {
                return (0).toFixed(2).toString();
            }
        }},
        {'<>':'span', 'id':'marketprice-error'},
        {'<>':'label', 'text':'Nutrients'},
        {'<>':'br'},
        {'<>':'input', 'id':'add-nutrient-input', 'list':'nutrient-datalist', 'type':'text'},
        {'<>':'span', 'class':'add-nutrient-button material-symbols-outlined', 'text':'add', 'onclick':function(){
            let nutrientValue = $("#add-nutrient-input").val();
            let nutrientId = $(`#nutrient-datalist option[value='${nutrientValue}']`).attr('data-id');
            let nutrientObject = nutrientArray.find(obj => obj.id == nutrientId);
            if(nutrientObject)
            {
                let errorNode = document.createElement('span');
                errorNode.id = 'add-nutrient-error';
                $("#add-nutrient-error").replaceWith(errorNode);
                let ingredientNutrientObject = {};
                ingredientNutrientObject['index'] = ingredientNutrientIndex++;
                ingredientNutrientObject['nutrient'] = nutrientObject;
                ingredientNutrientObject['method'] = 'POST';
                ingredientNutrientArray.push(ingredientNutrientObject);
                $("#nutrients-table").json2html(ingredientNutrientObject, template.ingredientNutrient);
            }
            else
            {
                let errorNode = document.createElement('span');
                errorNode.id = 'add-nutrient-error';
                errorNode.classList.add('error-message');
                errorNode.append(document.createElement('br'));
                errorNode.append(`${nutrientValue} is an invalid nutrient.`);
                $("#add-nutrient-error").replaceWith(errorNode);
            }
        }},
        {'<>':'span', 'id':'add-nutrient-error'},
        {'<>':'table', 'id':'nutrients-table', 'html':function(dataObject)
        {
            if(method == 'put' && dataObject.hasOwnProperty('nutrients'))
            {
                for (let ingredientNutrientObject of dataObject.nutrients)
                {
                    ingredientNutrientObject['index'] = ingredientNutrientIndex++;
                    ingredientNutrientObject['method'] = 'PUT';
                    ingredientNutrientArray.push(ingredientNutrientObject);
                }
                return $.json2html(ingredientNutrientArray, template.ingredientNutrient);
            }
        }},
        {'<>':'label', 'text':'Allergens'},
        {'<>':'br'},
        {'<>':'input', 'id':'add-allergen-input', 'list':'allergen-datalist', 'type':'text'},
        {'<>':'span', 'class':'add-allergen-button material-symbols-outlined', 'text':'add', 'onclick':function(){
            let allergenValue = $("#add-allergen-input").val();
            let allergenId = $(`#allergen-datalist option[value='${allergenValue}']`).attr('data-id');
            let allergenObject = allergenArray.find(obj => obj.id == allergenId);
            if(allergenObject)
            {
                let errorNode = document.createElement('span');
                errorNode.id = 'add-allergen-error';
                $("#add-allergen-error").replaceWith(errorNode);
                let ingredientAllergenObject = {};
                ingredientAllergenObject['index'] = ingredientAllergenIndex++;
                ingredientAllergenObject['allergen'] = allergenObject;
                ingredientAllergenObject['method'] = 'POST';
                ingredientAllergenArray.push(ingredientAllergenObject);
                $("#allergens-table").json2html(ingredientAllergenObject, template.ingredientAllergen);
                console.log(ingredientAllergenArray);
            }
            else
            {
                let errorNode = document.createElement('span');
                errorNode.id = 'add-allergen-error';
                errorNode.classList.add('error-message');
                errorNode.append(document.createElement('br'));
                errorNode.append(`${allergenValue} is an invalid allergen.`);
                $("#add-allergen-error").replaceWith(errorNode);
            }
        }},
        {'<>':'span', 'id':'add-allergen-error'},
        {'<>':'table', 'id':'allergens-table', 'html':function(dataObject)
        {
            if(method == 'put' && dataObject.hasOwnProperty('allergens'))
            {
                for (let ingredientAllergenObject of dataObject.allergens)
                {
                    ingredientAllergenObject['index'] = ingredientAllergenIndex++;
                    ingredientAllergenObject['method'] = 'PUT';
                    ingredientAllergenArray.push(ingredientAllergenObject);
                }
                return $.json2html(ingredientAllergenArray, template.ingredientAllergen);
            }
        }},
        {'<>':'button', 'text':'Save Ingredient', 'onclick':function(evObject){
            if(method == 'post')
            {
                createIngredient();
            }
            else if (method == 'put')
            {
                updateIngredient(evObject.obj.id);
            }
        }},
    ]},
    "datalist":{'<>':'option', 'data-id':'${id}', 'value':'${name} (${code})', '{}':function(){
            return(this);
        }, 'onchange':function(){
            console.log(this.value);
    }},
    "ingredientNutrient":{'<>':'tr', 'class':'ingredient-nutrient', 'data-index':'${index}', 'data-id':'${id}', 'html':[
        {'<>':'td', 'data-name':'id', 'text':'${nutrient.id}'},
        {'<>':'td', html:[{'<>':'input', 'type':'number', 'data-name':'quantity', 'value':'${quantity}'}]},
        {'<>':'td', 'text':'${nutrient.unit}'},
        {'<>':'td', 'text':'${nutrient.code}'},
        {'<>':'td', 'text':'${nutrient.name}'},
        {'<>':'td', 'html':[{'<>':'span', 'class':'delete-button material-symbols-outlined', 'text':'delete', 'onclick':function(evObject){
            let rowElement = this[0].parentElement.parentElement;
            let ingredientNutrientObject = ingredientNutrientArray.find(obj => obj.index == rowElement.getAttribute('data-index'));
            ingredientNutrientObject['method'] = 'DELETE';
            (this[0].parentElement.parentElement).remove();
          }}]},
    ]},
    "ingredientAllergen":{'<>':'tr', 'class':'ingredient-allergen', 'data-index':'${index}', 'data-id':'${id}', 'html':[
        {'<>':'td', 'data-name':'id', 'text':'${allergen.id}'},
        {'<>':'td', 'text':'${allergen.code}'},
        {'<>':'td', 'text':'${allergen.name}'},
        {'<>':'td', 'html':[{'<>':'span', 'class':'delete-button material-symbols-outlined', 'text':'delete', 'onclick':function(evObject){
            let rowElement = this[0].parentElement.parentElement;
            let ingredientAllergenObject = ingredientAllergenArray.find(obj => obj.index == rowElement.getAttribute('data-index'));
            ingredientAllergenObject['method'] = 'DELETE';
            (this[0].parentElement.parentElement).remove();
            console.log(ingredientAllergenArray);
          }}]},
    ]}
};

function init()
{
    readIngredient(true);
}

/*
Get (read) ingredient by id
*/
const fetchIngredient = async() => {
    let apiUrl = baseApiUrl + `/${ingredientId}?nutrients=true`;
    let response = await fetch(apiUrl);
    return response.json();
}

// currently uses a workaround to avoid having a special endpoint interaction for ALL nutrients
const fetchNutrients = async() => {
    let apiUrl = keys.url + "api/nutrients?size=1000";
    let response = await fetch(apiUrl);
    return response.json();
}

const fetchAllergens = async() => {
    let apiUrl = keys.url + "api/allergens";
    let response = await fetch(apiUrl);
    return response.json();
}

const readIngredient = async (fetch = false) => {
    if(ingredientId == null)
    {
        method = 'post';
        $("#ingredient-header").json2html({}, template.header, {method:"replace"});
        $("#ingredient-form").json2html({}, template.form, {method:"replace"});
    }
    else
    {
        method = 'put';
        if(fetch)
        {
          ingredientObject = await fetchIngredient();
        }
        console.log(ingredientObject);
        $("#ingredient-header").json2html(ingredientObject, template.header, {method:"replace"});
        $("#ingredient-form").json2html(ingredientObject, template.form, {method:"replace"});
    }
    if(fetch)
    {
        let nutrientsPage = await fetchNutrients();
        for(let nutrient of nutrientsPage.nutrients)
        {
            nutrientArray.push(nutrient);
        }
        allergenArray = await fetchAllergens();
    }
    console.log(nutrientArray);
    console.log(allergenArray);
    $("#nutrient-datalist").json2html(nutrientArray, template.datalist);
    $("#allergen-datalist").json2html(allergenArray, template.datalist);
}

/*
Post (create) an ingredient
*/
const createIngredient = async () => {
    let ingredientBody = {};
    ingredientBody['code'] = document.getElementById('code').value;
    ingredientBody['group'] = document.getElementById('group').value;
    ingredientBody['name'] = document.getElementById('name').value;
    ingredientBody['marketprice'] = document.getElementById('marketprice').value;
    console.log(JSON.stringify(ingredientBody));
    let response = await fetch(baseApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ingredientBody)
    });
    let ingredientJson = await response.json();
    if(!response.ok)
    {
        let errorNodes = document.getElementsByClassName('error-message');
        console.log(errorNodes);
        for (let errorNode of errorNodes)
        {
            errorNode.innerHTML = '';
        }
        for (let entry of Object.entries(ingredientJson))
        {
            let entryId = entry[0].toLowerCase() + "-error";
            let entryNode = document.createElement('span');
            entryNode.setAttribute('id', entryId);
            entryNode.classList.add("error-message");
            entryNode.append(document.createTextNode(entry[1]));
            entryNode.append(document.createElement('br'));
            console.log(entryId);
            document.getElementById(entryId).replaceWith(entryNode);
        }
        return;
    }
    for (const ingredientNutrient of ingredientNutrientArray)
    {
        let rowElement = $(`.ingredient-nutrient[data-index='${ingredientNutrient.index}']`)[0];
        let ingredientNutrientBody = {};
        ingredientNutrientBody['quantity'] = rowElement.querySelector('[data-name="quantity"]').value;
        let ingredientNutrientResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/nutrients/${ingredientNutrient.nutrient.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingredientNutrientBody)
        });
        await ingredientNutrientResponse.json();
    }
    for (const ingredientAllergen of ingredientAllergenArray)
    {
        let rowElement = $(`.ingredient-allergen[data-index='${ingredientAllergen.index}']`)[0];
        let ingredientAllergenBody = {};
        let ingredientAllergenResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/allergens/${ingredientAllergen.allergen.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingredientAllergenBody)
        });
        await ingredientAllergenResponse.json();
    }
    window.location.href = 'ingredients.html';
}

/*
Put (update) an ingredient
*/
const updateIngredient = async (objectId) => {
    let ingredientBody = {};
    ingredientBody['code'] = document.getElementById('code').value;
    ingredientBody['group'] = document.getElementById('group').value;
    ingredientBody['name'] = document.getElementById('name').value;
    ingredientBody['marketprice'] = document.getElementById('marketprice').value;
    let response = await fetch(keys.url + "api/ingredients/" + objectId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ingredientBody)
    });
    let ingredientJson = await response.json();
    if(!response.ok)
    {
        let errorNodes = document.getElementsByClassName('error-message');
        for (let errorNode of errorNodes)
        {
            errorNode.innerHTML = '';
        }
        for (let entry of Object.entries(ingredientJson))
        {
            let entryId = entry[0] + "-error";
            let entryNode = document.createElement('span');
            entryNode.setAttribute('id', entryId);
            entryNode.classList.add("error-message");
            entryNode.append(document.createTextNode(entry[1]));
            entryNode.append(document.createElement('br'));
            document.getElementById(entryId).replaceWith(entryNode);
        }
        return;
    }
    for (const ingredientNutrient of ingredientNutrientArray)
    {
        if(ingredientNutrient.hasOwnProperty('id'))
        {
            if (ingredientNutrient.method == 'PUT')
            {
                let rowElement = $(`.ingredient-nutrient[data-index='${ingredientNutrient.index}']`)[0];
                let ingredientNutrientBody = {};
                ingredientNutrientBody['id'] = ingredientNutrient.id;
                ingredientNutrientBody['quantity'] = rowElement.querySelector('[data-name="quantity"]').value;
                let ingredientNutrientResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/nutrients/${ingredientNutrient.nutrient.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ingredientNutrientBody)
                });
                await ingredientNutrientResponse.json();
            }
            else if (ingredientNutrient.method == 'DELETE')
            {
                let ingredientNutrientBody = {};
                ingredientNutrientBody['id'] = ingredientNutrient.id;
                let ingredientNutrientResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/nutrients/${ingredientNutrient.nutrient.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ingredientNutrientBody)
                });
                await ingredientNutrientResponse.json();
            }
            else if (ingredientNutrient.method == 'POST')
            {
                let rowElement = $(`.ingredient-nutrient[data-index='${ingredientNutrient.index}']`)[0];
                let ingredientNutrientBody = {};
                ingredientNutrientBody['quantity'] = rowElement.querySelector('[data-name="quantity"]').value;
                let ingredientNutrientResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/nutrients/${ingredientNutrient.nutrient.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ingredientNutrientBody)
                });
                await ingredientNutrientResponse.json();
            }
        }
        else if(ingredientNutrient.method == 'POST')
        {
            let rowElement = $(`.ingredient-nutrient[data-index='${ingredientNutrient.index}']`)[0];
            let ingredientNutrientBody = {};
            ingredientNutrientBody['quantity'] = rowElement.querySelector('[data-name="quantity"]').value;
            let ingredientNutrientResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/nutrients/${ingredientNutrient.nutrient.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ingredientNutrientBody)
            });
            await ingredientNutrientResponse.json();
        }
    }
    for (const ingredientAllergen of ingredientAllergenArray)
    {
        if(ingredientAllergen.hasOwnProperty('id'))
        {
            if (ingredientAllergen.method == 'PUT')
            {
                let rowElement = $(`.ingredient-allergen[data-index='${ingredientAllergen.index}']`)[0];
                let ingredientAllergenBody = {};
                ingredientAllergenBody['id'] = ingredientAllergen.id;
                let ingredientAllergenResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/allergens/${ingredientAllergen.allergen.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ingredientAllergenBody)
                });
                await ingredientAllergenResponse.json();
            }
            else if (ingredientAllergen.method == 'DELETE')
            {
                let ingredientAllergenBody = {};
                ingredientAllergenBody['id'] = ingredientAllergen.id;
                let ingredientAllergenResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/allergens/${ingredientAllergen.allergen.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ingredientAllergenBody)
                });
                await ingredientAllergenResponse.json();
            }
            else if (ingredientAllergen.method == 'POST')
            {
                let rowElement = $(`.ingredient-allergen[data-index='${ingredientAllergen.index}']`)[0];
                let ingredientAllergenBody = {};
                let ingredientAllergenResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/allergens/${ingredientAllergen.allergen.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ingredientAllergenBody)
                });
                await ingredientAllergenResponse.json();
            }
        }
        else if(ingredientAllergen.method == 'POST')
        {
            let rowElement = $(`.ingredient-allergen[data-index='${ingredientAllergen.index}']`)[0];
            let ingredientAllergenBody = {};
            let ingredientAllergenResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/allergens/${ingredientAllergen.allergen.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ingredientAllergenBody)
            });
            await ingredientAllergenResponse.json();
        }
    }
    window.location.href = 'ingredients.html';
}

window.onload = init;