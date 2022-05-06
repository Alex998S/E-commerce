const express = require('express');
const { default: mongoose } = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const router = express.Router();
const {products, categories} = require('../models/Post')

let length;

router.get('/edit-products/editor', async(req,res)=>{
    try{
        let product = await products.find();
        const ids = [];
        let image = [];
        const productName = []
        for(let i=0; i<product.length; i++){
            ids[i] = product[i].id
            image[i] = product[i].images[0].file[0];
            productName[i] = product[i].productName;
        }
        res.render('dashboard', {ids, image, productName, length: product.length});
    }catch(err){
        //res.json({message: err});
        throw new Error(err.message);
    }
})

router.get('/category', async(req, res)=>{
    try{
        const post = await categories.find();
        //res.json(post);
    }catch(err){
        res({message: err})
    }
    res.render('postCategory');
})

router.post('/', (req, res)=>{
    const post = new posts({
        title: req.body.title,
        description: req.body.description
    });

    post.save()
    .then(data =>{
        res.json(data);
    })
    .catch(err =>{
        res.json({message: err});
    })
})

function defaultValue(value){
    if(value.length == 0){
        value = "This is a description"
    }
    return value;
}

function idGenerator(){
    let id = mongoose.Types.ObjectId();
    return id;
}

function addExtraImage(theArray){
    let array = [];
    if(!Array.isArray(theArray)){  
        array[0] = theArray;
            return array;
    }else{
        console.log("nothing changed");
        return theArray;
    }
    
}

function removeStrings(string){
    let str = string.toString()
    string = str.substring(str.lastIndexOf("-")+1, str.length);
    string = string.charAt(0).toUpperCase() + string.slice(1);
    return string;
    
}

router.post('/category', async(req, res)=>{
    const post = new categories({
        id: req.body.id,
        name: removeStrings(req.body.id),
        parentCategoryId: req.body.parentCategoryId,
        image:'images/categories/' + req.body.image 
    })
    try{
        const savedCategory = await post.save();
        res.render('postCategory');
    }catch(err){
        res.json({message: err})
    }
})

module.exports = router;