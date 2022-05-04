const express = require('express');
const { default: mongoose } = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const router = express.Router();
const {posts, products, categories} = require('../models/Post')

let length;

router.get('/product', async(req, res)=>{
    try{
       const product = await categories.find();
       const ids = []
       for(let i=0; i<product.length; i++){
           ids[i] = product[i].id
       }
       res.render('postProduct', {ids})
        //res.json(product);
    }catch(err){
        res.json({message: err})
    }
})

router.get('/product/edit-products', async(req,res)=>{
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
        res.render('editProduct', {ids, image, productName, length: product.length});
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
    if(theArray.length > 10){
        array.push(theArray);
    }else{
        for(let i=0; i<theArray.length; i++){
            array.push(theArray[i]);
        }
    }
    array.push('404.jpg')
    return array;
}

router.post('/product', async (req, res)=>{
    
    const post = new products({
        productName: req.body.name,
        description: defaultValue(req.body.description),
        //description: req.body.description,
        price: req.body.price,
        category: req.body.option,
        images:{
            file: addExtraImage(req.body.images),
            color: req.body.imageColor
        }
        // variants: {
        //     id: idGenerator(),
        //     color: req.body.variants.color,
        //     size: req.body.variants.size,
        //     width: req.body.variants.width
        // }
    });
    try{
        const savedProduct = await post.save();
        res.json(savedProduct);
        console.log(req.body.images);
    }catch(err){
        res.json({message: err})
    }
})

router.get('/addVariable/:id', async(req, res)=>{
    console.log(req.body.color);
    try{
        const product = await products.find({_id: req.params.id})
        const name = product[0].productName;
        const image = product[0].images[0].file[0];
        const id = product[0].id;
        //res.json(product);
        res.render('addVariable', {name, image, id});
    }catch(err){
        throw new Error(err.message);
    }
})

router.patch('/addVariable/:id', async(req, res)=>{
    try{
        // const updatedPost = await products.updateOne({_id: req.params.id}, {$push: {variants:{
        //     id: idGenerator(),
        //     color: req.body.color,
        //     size: req.body.size,
        //     width: req.body.width
        // }}})

        const test = await products.updateOne({_id: req.params.id},{$set:{productName: req.body.color}})
        // const addImages = await products.updateOne({_id: req.params.id}, {$push: {images:{
        //     file: req.body.images,
        //     color: req.body.color
        // }}})
        console.log(req.body.color);
        res.json(test);
        console.log(test);
    }catch(err){
        res.json({message: err});
        console.log(err);
    }
})
    
function removeStrings(string){
    let str = string.toString()
    string = str.substring(str.lastIndexOf("-")+1, str.length);
    // string = string.replaceAll('-', '').replace('mens', '').replace('clothing','').replace('jewelry', '').replace('accessories','')
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