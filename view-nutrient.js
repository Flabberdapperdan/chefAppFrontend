import {keys} from "./keys.js";

const nutrientId = localStorage.getItem("nutrientId");

const baseApiUrl = keys.url + `api/nutrients/${nutrientId}`;

let nutrientObject;

const template = {
    "header":{'html':[
        {'<>':'h1', 'id':'nutrient-header', 'text':'${name}'},
        {'<>':'span', 'class':'edit-button material-symbols-outlined', 'text':'change_circle', 'onclick':function(evObject){
            localStorage.setItem("nutrientId", evObject.obj.id);
            window.location.href = 'edit-nutrient.html';
        }},
        {'<>':'span', 'class':'delete-button material-symbols-outlined', 'text':'delete', 'onclick':function(evObject){
            deleteNutrient(evObject.obj.id);
        }}
    ]},
    "table":{'<>':'table', 'id':'nutrient-table', 'html':[
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
            {'<>':'td', html:[{'<>':'label', 'text':'Unit'}]},
            {'<>':'td', html:[{'<>':'span', 'text':'${unit}'}]},
        ]},
    ]},
};

console.log(nutrientId);

function init()
{
    readNutrient(true);
}

/*
Get (read) nutrient by id
*/
const fetchNutrient = async() => {
    let apiUrl = baseApiUrl;
    let response = await fetch(apiUrl);
    return response.json();
}

const readNutrient = async (fetch = false) => {
    if(fetch)
    {
      nutrientObject = await fetchNutrient();
    }
    console.log(nutrientObject);

    $("#nutrient-header").json2html(nutrientObject, template.header, {method:"replace"});
    $("#nutrient-table").json2html(nutrientObject, template.table, {method:"replace"});
}

/*
Delete an nutrient
*/

const deleteNutrient = async (objectId) => {
    let response = await fetch(keys.url + `api/nutrients/${objectId}`, {
        method: 'DELETE'
    });
    window.location.href = 'nutrients.html';
}

window.onload = init;