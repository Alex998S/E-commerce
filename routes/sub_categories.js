const express = require('express');
const router = express.Router();
const https = require('https');

let categories;
let catName = [];
let catImage = [];
let catDescription = [];
let catID = [];
const columnNumber = 3;

const secretKey = "$2a$08$EnHlurAo729FiqMtWlY1YumuY088oZf5gWlkKBMgvGcmtd4tKQEzi";

//get all sub-categories
function getSubCategories(parameter){
    return new Promise(resolve=>{
        const reqq = https.get(`https://osf-digital-backend-academy.herokuapp.com/api/categories/parent/${parameter}?secretKey=${secretKey}`, response=>{
            let body ="";
            response.on('data', data =>{
            body +=data.toString();
            });

            response.on('end', ()=>{
            categories = JSON.parse(body);
                for(let i=0; i<categories.length; i++){
                catName[i] = categories[i].name;
                catImage[i] = categories[i].image;
                catDescription[i] = categories[i].page_description;
                catID[i] = categories[i].id;
                }
                resolve("done");
            });
        });
    })
}

router.get('/subcategory/:id', (req, res)=>{
    async function showSubCategories(){
        const result = await getSubCategories(req.params.id);
        res.render('subCategories', {categ: categories.length, name: catName, columnNumber, image: catImage, description: catDescription, id: catID});
    }

    showSubCategories();
});


module.exports = router;