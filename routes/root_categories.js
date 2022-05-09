const express = require('express');
const router = express.Router();
const https = require('https');

let rootCategories = [];
let rootName = [];
let rootDescription = [];
let rootID = [];
const columnNumber = 3;

//get all sub-categories
const reqq = https.get(`https://osf-digital-backend-academy.herokuapp.com/api/categories?secretKey=${process.env.SECRET_KEY}`, response=>{
    let body ="";
    response.on('data', data =>{
        body +=data.toString();
    });

    response.on('end', ()=>{
        rootCategories = JSON.parse(body);
        for(let i=0; i<rootCategories.length; i++){
            if(rootCategories[i].parent_category_id == "root"){
                rootName[i] = rootCategories[i].name;
                rootDescription[i] = rootCategories[i].page_description;
                rootID[i] = rootCategories[i].id;
            }
        }
    });
});

router.get('/', (req, res)=>{
    res.render('home', {categ: rootCategories.length, name: rootName, columnNumber, description: rootDescription, id: rootID});
});


module.exports = router;