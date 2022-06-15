import {keys} from "./keys.js";

const baseApiUrl = keys.url + `api/ingredients`;

const template = {
    "form":{'<>':'div', 'id':'result-form', 'html':[
        {'<>':'label', 'text':'Code'},
        {'<>':'input', 'id':'code'},
        {'<>':'label', 'text':'Group'},
        {'<>':'input', 'id':'group'},
        {'<>':'label', 'text':'Name'},
        {'<>':'input', 'id':'name'},
        {'<>':'label', 'text':'Market Price'},
        {'<>':'input', 'id':'marketPrice'},
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
        {'<>':'button', 'text':'Create Ingredient', 'onclick':function(){
            createObject();
        }},
    ]},
};

function init()
{
    readObject();
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
    //if(fetch)
    //{
    //  jsonObject = await fetchObject();
    //}
    //console.log(jsonObject);

    $("#result-form").json2html({}, template.form, {method:"replace"});
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
    body['marketPrice'] = document.getElementById('marketPrice').value;
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
}

window.onload = init;