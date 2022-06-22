import {keys} from "./keys.js";

const baseApiUrl = keys.url + 'api/ingredients';

const dataApiUrl = "https://yc2205pythondata.azurewebsites.net/ingredienten/deelnaam";

let idx = 0;

let ingredientList = [];

const template = {
    "form":{'<>':'div', 'id':'ingredient-form', 'html':[
        {'<>':'label', 'text':'Name'},
        {'<>':'br'},
        {'<>':'input', 'id':'name-input', 'type':'text', 'onkeyup':function(evObject){
            if (evObject.event.originalEvent.key === 'Enter' || evObject.event.originalEvent.keyCode === 13) {
                readIngredients(this[0].value);
            }
        }},
        {'<>':'table', 'id':'ingredient-table', 'html':[
            {'<>':'thead', 'id':'ingredient-table-head', 'html':[{'<>':'tr', html:[
                {'<>':'th', 'text':'Code'},
                {'<>':'th', 'text':'Group'},
                {'<>':'th', 'text':'Name'},
                {'<>':'th', 'text':'Market Price'},
            ]}]},
            {'<>':'tbody', 'id':'ingredient-table-body'},
        ]},
    ]},
    "tableBody":{'<>':'tr', 'data-index':function(){
        return idx++;
    }, 'html':[
        {'<>':'td', 'data-name':'code', 'text':function(dataObject){
            return dataObject['NEVO-code'];
        }},
        {'<>':'td', 'data-name':'group', 'text':function(dataObject){
            return dataObject['Voedingsmiddelgroep'];
        }},
        {'<>':'td', 'data-name':'name', 'text':function(dataObject){
            return dataObject['Voedingsmiddelnaam\/Dutch food name'];
        }},
        {'<>':'td', 'data-name':'marketprice', 'text':function(dataObject){
            return dataObject['Inkoopprijs'];
        }},
        {'<>':'td', 'html':[{'<>':'span', 'class':'create-button material-symbols-outlined', 'text':'add', 'onclick':function(){
            createIngredient(this[0].parentElement.parentElement);
        }}]}
    ],'{}':function(dataObject){
        return dataObject;
    }}
};

function init()
{
    $("#ingredient-form").json2html({}, template.form, {method:"replace"});
    //readIngredient(true);
}

/*
Get (read) ingredient from input
*/
const fetchIngredients = async(ingredientName) => {
    let apiUrl = dataApiUrl + `/${ingredientName}`;
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

const readIngredients = async (ingredientName) => {
    let ingredientObjects = await fetchIngredients(ingredientName);
    console.log($("#ingredient-table-body"));
    while($("#ingredient-table-body")[0].firstChild)
    {
        $("#ingredient-table-body")[0].lastChild.remove();
    }
    ingredientList = Object.values(ingredientObjects);
    console.log(ingredientList);
    $("#ingredient-table-body").json2html(ingredientList, template.tableBody);
    //console.log(ingredientObjects);
    //$("#ingredient-header").json2html(ingredientObject, template.header, {method:"replace"});
    //$("#ingredient-form").json2html(ingredientObject, template.form, {method:"replace"});
    // if(fetch)
    // {
    //     let nutrientsPage = await fetchNutrients();
    //     for(let nutrient of nutrientsPage.nutrients)
    //     {
    //         nutrientArray.push(nutrient);
    //     }
    //     allergenArray = await fetchAllergens();
    // }
}

/*
Post (create) an ingredient
*/
const createIngredient = async (ingredientRowElement) => {
    let ingredientBody = {};
    ingredientBody['code'] = ingredientRowElement.querySelector('[data-name="code"]').innerText;
    ingredientBody['group'] = ingredientRowElement.querySelector('[data-name="group"]').innerText;
    ingredientBody['name'] = ingredientRowElement.querySelector('[data-name="name"]').innerText;
    ingredientBody['marketprice'] = ingredientRowElement.querySelector('[data-name="marketprice"]').innerText;
    let response = await fetch(baseApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ingredientBody)
    });
    let ingredientJson = await response.json();
    if(response.ok)
    {
        let ingredientId = ingredientJson.id;
        let nutrientArray = (await fetchNutrients()).nutrients;
        let allergenArray = await fetchAllergens();
        let dataIdx = ingredientRowElement.getAttribute('data-index');
        let dataEntries = Object.entries(ingredientList[dataIdx]);
        for(let dataEntry of dataEntries)
        {
            if(dataEntry[0] == "Voedingsmiddelgroep"
            | dataEntry[0] == "Food group"
            | dataEntry[0] == "NEVO-code"
            | dataEntry[0] == "Voedingsmiddelnaam/Dutch food name"
            | dataEntry[0] == "Engelse naam/Food name"
            | dataEntry[0] == "Inkoopprijs")
            {
                continue;
            }
            else if (dataEntry[0] == "Allergenen")
            {
                let found = false;
                const splices = [];
                if(dataEntry[1])
                {
                    const matches = dataEntry[1].matchAll("[a-zA-Z ]{1,}");
                    for (const match of matches)
                    {
                        splices.push(match[0]);
                    }
                }
                else
                {
                    continue;
                }
                for(let value of splices)
                {
                    for(let allergen of allergenArray)
                    {
                        if(allergen.name == value)
                        {
                            let allergenId = allergen.id;
                            createIngredientAllergen(ingredientId, allergenId);
                            found = true;
                            break;
                        }
                    }
                }
                if(!found)
                {
                    let allergenBody = {};
                    allergenBody['code'] = splices[0].slice(0,3).toUpperCase();
                    allergenBody['name'] = splices[0];
                    let allergenJson = await createAllergen(allergenBody);
                    let allergenId = allergenJson.id;
                    createIngredientNutrient(ingredientId, allergenId);
                }
                console.log("it's an allergen!")
            }
            else
            {
                let found = false;
                const splices = [];
                const matches = dataEntry[0].matchAll("[a-zA-Z]{1,}");
                for (const match of matches)
                {
                    splices.push(match[0]);
                }
                let quantity = dataEntry[1];
                for(let nutrient of nutrientArray)
                {
                    if(nutrient.code == splices[0])
                    {
                        let nutrientId = nutrient.id;
                        createIngredientNutrient(ingredientId, nutrientId, quantity);
                        found = true;
                        break;
                    }
                }
                if(!found)
                {
                    let nutrientBody = {};
                    nutrientBody['code'] = splices[0];
                    nutrientBody['group'] = "Imported Data";
                    nutrientBody['name'] = splices[0];
                    nutrientBody['unit'] = splices[1];
                    let nutrientJson = await createNutrient(nutrientBody);
                    let nutrientId = nutrientJson.id;
                    createIngredientNutrient(ingredientId, nutrientId, quantity);
                }
            }
        }
        ingredientRowElement.remove();
    }
    // if(!response.ok)
    // {
    //     let errorNodes = document.getElementsByClassName('error-message');
    //     console.log(errorNodes);
    //     for (let errorNode of errorNodes)
    //     {
    //         errorNode.innerHTML = '';
    //     }
    //     for (let entry of Object.entries(ingredientJson))
    //     {
    //         let entryId = entry[0].toLowerCase() + "-error";
    //         let entryNode = document.createElement('span');
    //         entryNode.setAttribute('id', entryId);
    //         entryNode.classList.add("error-message");
    //         entryNode.append(document.createTextNode(entry[1]));
    //         entryNode.append(document.createElement('br'));
    //         console.log(entryId);
    //         document.getElementById(entryId).replaceWith(entryNode);
    //     }
    //     return;
    // }
    // for (const ingredientNutrient of ingredientNutrientArray)
    // {
    //     let rowElement = $(`.ingredient-nutrient[data-index='${ingredientNutrient.index}']`)[0];
    //     let ingredientNutrientBody = {};
    //     ingredientNutrientBody['quantity'] = rowElement.querySelector('[data-name="quantity"]').value;
    //     let ingredientNutrientResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/nutrients/${ingredientNutrient.nutrient.id}`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },= 
    //         body: JSON.stringify(ingredientNutrientBody)
    //     });
    //     await ingredientNutrientResponse.json();
    // }
    // for (const ingredientAllergen of ingredientAllergenArray)
    // {
    //     let rowElement = $(`.ingredient-allergen[data-index='${ingredientAllergen.index}']`)[0];
    //     let ingredientAllergenBody = {};
    //     let ingredientAllergenResponse = await fetch(baseApiUrl + `/${ingredientJson.id}/allergens/${ingredientAllergen.allergen.id}`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(ingredientAllergenBody)
    //     });
    //     await ingredientAllergenResponse.json();
    // }
    // window.location.href = 'ingredients.html';
}

const createNutrient = async (nutrientBody) => {
    let response = await fetch(keys.url + 'api/nutrients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nutrientBody)
    });
    let nutrientJson = await response.json();
    console.log(nutrientJson);
    return nutrientJson;
}

const createAllergen = async (allergenBody) => {
    let response = await fetch(keys.url + 'api/allergens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(allergenBody)
    });
    let allergenJson = await response.json();
    console.log(allergenJson);
    return allergenJson;
}

const createIngredientNutrient = async (ingredientId, nutrientId, quantity) => {
    let ingredientNutrientBody = {};
    ingredientNutrientBody['quantity'] = quantity;
    let ingredientNutrientResponse = await fetch(baseApiUrl + `/${ingredientId}/nutrients/${nutrientId}`, {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingredientNutrientBody)
    });
    await ingredientNutrientResponse.json();
}

const createIngredientAllergen = async (ingredientId, allergenId) => {
    let ingredientAllergenBody = {};
    let ingredinetAllergenResponse = await fetch(baseApiUrl + `/${ingredientId}/allergens/${allergenId}`, {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingredientAllergenBody)
    });
    await ingredinetAllergenResponse.json();
}

window.onload = init;