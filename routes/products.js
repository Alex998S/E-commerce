const express = require('express');
const router = express.Router();
const https = require('https');

const secretKey = "$2a$08$EnHlurAo729FiqMtWlY1YumuY088oZf5gWlkKBMgvGcmtd4tKQEzi";

let length;
let products;
let productID = [];
let productName = [];
let imageGroups;
let productImage = [];
let shortDescription = [];
let price = [];

function getData(theParameter){
    return new Promise(resolve=>{
        const request = https.get(`https://osf-digital-backend-academy.herokuapp.com/api/products/product_search?primary_category_id=${theParameter}&secretKey=$2a$08$EnHlurAo729FiqMtWlY1YumuY088oZf5gWlkKBMgvGcmtd4tKQEzi`, response=>{

            let body ="";
            response.on('data', data =>{
                body +=data.toString();
            });
        
            response.on('end', ()=>{
                products = JSON.parse(body);
                length = products.length;
                for(let i=0; i<products.length; i++){
                    productID[i] = products[i].id;
                    productName[i] = products[i].name;
                    imageGroups = products[i].image_groups;
                    shortDescription[i] = products[i].page_description;
                    price[i] = products[i].price;
                    for(let j=0; j<imageGroups.length; j++){
                        if (products[i].image_groups[j].view_type == "medium"){
                            productImage[i] = products[i].image_groups[j].images[0].link;
                        }
                    }
                }
                resolve('Done!');
            });
        });
    });
}

router.get('/:id/products', (req, res)=>{

    async function showProducts(){
        //console.log("before done");
        const result = await getData(req.params.id);
        res.render('products',{productID, price, shortDescription, length, productName, productImage});
        //console.log(result);
    }
    showProducts();
});

module.exports = router;