const express = require('express');
const router = express.Router();
const https = require('https');

let parentCategories;
let parentName = [];
let parentImage = [];
let parentDescription = [];
let parentID = [];
let rootID = [];
const columnNumber = 3;

const secretKey = "$2a$08$EnHlurAo729FiqMtWlY1YumuY088oZf5gWlkKBMgvGcmtd4tKQEzi";

//get all parentCategories
function getParentCategories(parameter){
    return new Promise(resolve=>{
        const reqq = https.get(`https://osf-digital-backend-academy.herokuapp.com/api/categories/parent/${parameter}?secretKey=${secretKey}`, response=>{
            let body ="";
            response.on('data', data =>{
            body +=data.toString();
            });

            response.on('end', ()=>{
            parentCategories = JSON.parse(body);
            for(let i=0; i<parentCategories.length; i++){
                parentName[i] = parentCategories[i].name;
                parentImage[i] = parentCategories[i].image;
                parentDescription[i] = parentCategories[i].page_description;
                parentID[i] = parentCategories[i].id;
                rootID[i] = parentCategories[i].parent_category_id;
                }
                resolve("Done");
            });
        });
    });
}
router.get('/:id/categories', (req, res)=>{
    async function showParentCategories(){
        const result = await getParentCategories(req.params.id);
        res.render('parentCategories', {categ: parentCategories.length, name: parentName, columnNumber, image: parentImage, description: parentDescription, id: parentID});
    }

    showParentCategories();
});


module.exports = router;