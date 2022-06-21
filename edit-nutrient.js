import {keys} from "./keys.js";

const nutrientId = localStorage.getItem("nutrientId");

const baseApiUrl = keys.url + 'api/nutrients';

let nutrientObject;

let nutrientArray = [];
let nutrientNutrientArray = [];
let nutrientNutrientIndex = 0;

let allergenArray = [];
let nutrientAllergenArray = [];
let nutrientAllergenIndex = 0;

let method = 'post';

const template = {
    "header":{'html':[
        {'<>':'h1', 'id':'nutrient-header', 'text':function(dataObject){
            if(dataObject.hasOwnProperty('name'))
            {
                return dataObject.name;
            }
            else
            {
                return "New Nutrient";
            }
        }},
    ]},
    "form":{'<>':'div', 'id':'nutrient-form', 'html':[
        {'<>':'label', 'text':'Code'},
        {'<>':'input', 'id':'code', 'value':function(dataObject){
            if(method == 'put' && dataObject.hasOwnProperty('code'))
            {
                return dataObject.code.toString();
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
        {'<>':'label', 'text':'Unit'},
        {'<>':'input', 'id':'unit', 'value':function(dataObject){
            if(method == 'put' && dataObject.hasOwnProperty('unit'))
            {
                return dataObject.unit.toString();
            }
        }},
        {'<>':'span', 'id':'unit-error'},
        {'<>':'button', 'text':'Save Nutrient', 'onclick':function(evObject){
            if(method == 'post')
            {
                createNutrient();
            }
            else if (method == 'put')
            {
                updateNutrient(evObject.obj.id);
            }
        }},
    ]},
};

function init()
{
    readNutrient(true);
}

/*
Get (read) nutrient by id
*/
const fetchNutrient = async() => {
    let apiUrl = baseApiUrl + `/${nutrientId}?nutrients=true`;
    let response = await fetch(apiUrl);
    return response.json();
}

const fetchNutrients = async() => {
    let apiUrl = keys.url + "api/nutrients";
    let response = await fetch(apiUrl);
    return response.json();
}

const fetchAllergens = async() => {
    let apiUrl = keys.url + "api/allergens";
    let response = await fetch(apiUrl);
    return response.json();
}

const readNutrient = async (fetch = false) => {
    if(nutrientId == null)
    {
        method = 'post';
        $("#nutrient-header").json2html({}, template.header, {method:"replace"});
        $("#nutrient-form").json2html({}, template.form, {method:"replace"});
    }
    else
    {
        method = 'put';
        if(fetch)
        {
          nutrientObject = await fetchNutrient();
        }
        console.log(nutrientObject);
        $("#nutrient-header").json2html(nutrientObject, template.header, {method:"replace"});
        $("#nutrient-form").json2html(nutrientObject, template.form, {method:"replace"});
    }
    if(fetch)
    {
        nutrientArray = await fetchNutrients();
        allergenArray = await fetchAllergens();
    }
    console.log(nutrientArray);
    console.log(allergenArray);
    $("#nutrient-datalist").json2html(nutrientArray, template.datalist);
    $("#allergen-datalist").json2html(allergenArray, template.datalist);
}

/*
Post (create) an nutrient
*/
const createNutrient = async () => {
    let nutrientBody = {};
    nutrientBody['code'] = document.getElementById('code').value;
    nutrientBody['group'] = document.getElementById('group').value;
    nutrientBody['name'] = document.getElementById('name').value;
    nutrientBody['unit'] = document.getElementById('unit').value;
    console.log(JSON.stringify(nutrientBody));
    let response = await fetch(baseApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nutrientBody)
    });
    let nutrientJson = await response.json();
    if(!response.ok)
    {
        let errorNodes = document.getElementsByClassName('error-message');
        console.log(errorNodes);
        for (let errorNode of errorNodes)
        {
            errorNode.innerHTML = '';
        }
        for (let entry of Object.entries(nutrientJson))
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
    window.location.href = 'nutrients.html';
}

/*
Put (update) an nutrient
*/
const updateNutrient = async (objectId) => {
    let nutrientBody = {};
    nutrientBody['code'] = document.getElementById('code').value;
    nutrientBody['group'] = document.getElementById('group').value;
    nutrientBody['name'] = document.getElementById('name').value;
    nutrientBody['unit'] = document.getElementById('unit').value;
    let response = await fetch(keys.url + "api/nutrients/" + objectId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nutrientBody)
    });
    let nutrientJson = await response.json();
    if(!response.ok)
    {
        let errorNodes = document.getElementsByClassName('error-message');
        console.log(errorNodes);
        for (let errorNode of errorNodes)
        {
            errorNode.innerHTML = '';
        }
        for (let entry of Object.entries(nutrientJson))
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
    for (const nutrientNutrient of nutrientNutrientArray)
    {
        if(nutrientNutrient.hasOwnProperty('id'))
        {
            if (nutrientNutrient.method == 'PUT')
            {
                let rowElement = $(`.nutrient-nutrient[data-index='${nutrientNutrient.index}']`)[0];
                let nutrientNutrientBody = {};
                nutrientNutrientBody['id'] = nutrientNutrient.id;
                nutrientNutrientBody['quantity'] = rowElement.querySelector('[data-name="quantity"]').value;
                let nutrientNutrientResponse = await fetch(baseApiUrl + `/${nutrientJson.id}/nutrients/${nutrientNutrient.nutrient.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nutrientNutrientBody)
                });
                await nutrientNutrientResponse.json();
            }
            else if (nutrientNutrient.method == 'DELETE')
            {
                let nutrientNutrientBody = {};
                nutrientNutrientBody['id'] = nutrientNutrient.id;
                let nutrientNutrientResponse = await fetch(baseApiUrl + `/${nutrientJson.id}/nutrients/${nutrientNutrient.nutrient.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nutrientNutrientBody)
                });
                await nutrientNutrientResponse.json();
            }
            else if (nutrientNutrient.method == 'POST')
            {
                let rowElement = $(`.nutrient-nutrient[data-index='${nutrientNutrient.index}']`)[0];
                let nutrientNutrientBody = {};
                nutrientNutrientBody['quantity'] = rowElement.querySelector('[data-name="quantity"]').value;
                let nutrientNutrientResponse = await fetch(baseApiUrl + `/${nutrientJson.id}/nutrients/${nutrientNutrient.nutrient.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nutrientNutrientBody)
                });
                await nutrientNutrientResponse.json();
            }
        }
        else if(nutrientNutrient.method == 'POST')
        {
            let rowElement = $(`.nutrient-nutrient[data-index='${nutrientNutrient.index}']`)[0];
            let nutrientNutrientBody = {};
            nutrientNutrientBody['quantity'] = rowElement.querySelector('[data-name="quantity"]').value;
            let nutrientNutrientResponse = await fetch(baseApiUrl + `/${nutrientJson.id}/nutrients/${nutrientNutrient.nutrient.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nutrientNutrientBody)
            });
            await nutrientNutrientResponse.json();
        }
    }
    for (const nutrientAllergen of nutrientAllergenArray)
    {
        if(nutrientAllergen.hasOwnProperty('id'))
        {
            if (nutrientAllergen.method == 'PUT')
            {
                let rowElement = $(`.nutrient-allergen[data-index='${nutrientAllergen.index}']`)[0];
                let nutrientAllergenBody = {};
                nutrientAllergenBody['id'] = nutrientAllergen.id;
                let nutrientAllergenResponse = await fetch(baseApiUrl + `/${nutrientJson.id}/allergens/${nutrientAllergen.allergen.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nutrientAllergenBody)
                });
                await nutrientAllergenResponse.json();
            }
            else if (nutrientAllergen.method == 'DELETE')
            {
                let nutrientAllergenBody = {};
                nutrientAllergenBody['id'] = nutrientAllergen.id;
                let nutrientAllergenResponse = await fetch(baseApiUrl + `/${nutrientJson.id}/allergens/${nutrientAllergen.allergen.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nutrientAllergenBody)
                });
                await nutrientAllergenResponse.json();
            }
            else if (nutrientAllergen.method == 'POST')
            {
                let rowElement = $(`.nutrient-allergen[data-index='${nutrientAllergen.index}']`)[0];
                let nutrientAllergenBody = {};
                let nutrientAllergenResponse = await fetch(baseApiUrl + `/${nutrientJson.id}/allergens/${nutrientAllergen.allergen.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nutrientAllergenBody)
                });
                await nutrientAllergenResponse.json();
            }
        }
        else if(nutrientAllergen.method == 'POST')
        {
            let rowElement = $(`.nutrient-allergen[data-index='${nutrientAllergen.index}']`)[0];
            let nutrientAllergenBody = {};
            let nutrientAllergenResponse = await fetch(baseApiUrl + `/${nutrientJson.id}/allergens/${nutrientAllergen.allergen.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nutrientAllergenBody)
            });
            await nutrientAllergenResponse.json();
        }
    }
    window.location.href = 'nutrients.html';
}

window.onload = init;