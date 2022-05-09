const express = require('express');
const router = express.Router();
const https = require('https');

let product;
let theProduct;
let productID;
let productName;
let longDescription;
let price;

//images
let imageGroups;
let productImage;

let colorArray = [];
let sizeArray = [];
let widthArray = [];
//variants
global.variantArray = [];

function getVariants(){

    if(variantArray.length > 0){
        variantArray = [];
    }
    for(let i=0; i<product.variants.length; i++){
        const variantLength = product.variants.length;
        let variant = {
            color: product.variants[i].variation_values.color,
            size: product.variants[i].variation_values.size,
            width: product.variants[i].variation_values.width,
            id: product.variants[i].product_id
        }
        variantArray.splice(i, 0, variant)
    }
}

function getVariations(){

    if(colorArray.length > 0){
        colorArray = [];
        sizeArray = [];
        widthArray = [];
    }

    for(let i=0; i<product.variation_attributes.length; i++){

            //get color variations
            if(product.variation_attributes[i].id == "color"){
                for(let j=0; j<product.variation_attributes[i].values.length; j++){
                    let variationColor = {
                        name: product.variation_attributes[i].values[j].name,
                        value: product.variation_attributes[i].values[j].value
                    }
                    colorArray.splice(i, 0, variationColor);
                }
            }
    
            //get size variations
            if(product.variation_attributes[i].id == "size"){
                for(let j=0; j<product.variation_attributes[i].values.length; j++){
                    let variationSize = {
                        name: product.variation_attributes[i].values[j].name,
                        value: product.variation_attributes[i].values[j].value
                    }
                    sizeArray.splice(i, 0, variationSize);
                }
            }else if(product.variation_attributes[i].id == "accessorySize"){
                for(let j=0; j<product.variation_attributes[i].values.length; j++){
                    let variationSize = {
                        name: product.variation_attributes[i].values[j].name,
                        value: product.variation_attributes[i].values[j].value
                    }
                    sizeArray.splice(i, 0, variationSize);
                }
            }
    
            //get width variations
            if(product.variation_attributes[i].id == "width"){
                for(let j=0; j<product.variation_attributes[i].values.length; j++){
                    let variationWidth = {
                        name: product.variation_attributes[i].values[j].name,
                        value: product.variation_attributes[i].values[j].value
                    }
                    widthArray.splice(i, 0, variationWidth);
                }
            }
        }
        sizeArray.sort(function (a,b){
            return a.name - b.name;
        })
}

function getProductDetails(theParameter){
    return new Promise(resolve=>{
        const request = https.get(`https://osf-digital-backend-academy.herokuapp.com/api/products/product_search?id=${theParameter}&secretKey=${process.env.SECRET_KEY}`, response=>{

            let body ="";
            response.on('data', data =>{
                body +=data.toString();
            });
        
            response.on('end', ()=>{
                theProduct = JSON.parse(body);
                product = theProduct[0];
                productID = product.id;
                productName = product.name;
                imageGroups = product.image_groups;
                longDescription = product.page_description;
                price = product.price;
                
                getVariations();

                getVariants();

                for(let j=0; j<imageGroups.length; j++){
                    if (product.image_groups[j].view_type == "large"){
                        productImage = product.image_groups[j].images[0].link;
                        }
                } 
                resolve('Done!');
            });
        });
    });
}

router.get('/product/:id', (req, res)=>{

    async function showProductDetails(){
        //console.log("before done");
        const result = await getProductDetails(req.params.id);
        res.render('productDetail',{productID, price, longDescription, productName, productImage, colorArray, sizeArray, widthArray, variantArray});
        console.log(productID)
        console.log(variantArray.length)
        console.log(variantArray)
        console.log("Product token: " + req.cookies.tokenCookie);
    }
    showProductDetails();
});

module.exports = variantArray;
module.exports = router;
