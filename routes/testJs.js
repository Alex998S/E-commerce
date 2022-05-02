const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const {posts, products, categories} = require('../models/Post')

let productName;

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
    res.render('postProduct')
    
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

router.post('/product', async (req, res)=>{
    
    const post = new products({
        productName: req.body.name,
        description: defaultValue(req.body.description),
        price: req.body.price,
        category: req.body.option,
        images:{
            file: req.body.images,
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
    }catch(err){
        res.json({message: err})
    }
})

router.patch('/product/:id', async(req, res)=>{
    try{
        const updatedPost = await products.updateOne({_id: req.params.id}, {$push: {variants:{
            id: idGenerator(),
            color: req.body.color,
            size: req.body.size,
            width: req.body.width
        }}})
        res.json(updatedPost);
    }catch(err){
        res.json({message: err});
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