const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const {products, categories} = require('../models/Post')

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

//Post product
router.get('/addProduct', async(req, res)=>{
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

router.post('/addProduct', async (req, res)=>{
    
    const post = new products({
        productName: req.body.name,
        description: defaultValue(req.body.description),
        price: req.body.price,
        category: req.body.option,
        images:{
            file: addExtraImage(req.body.images),
            color: req.body.imageColor
        }
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

router.post('/postVariable/:id', async(req, res)=>{
    try{
        const theProduct = await products.find({_id: req.params.id})
        const updatedPost = await products.updateOne({theProduct}, {$push: {variants:{
            id: idGenerator(),
            color: req.body.color,
            size: req.body.size,
            stock: req.body.stock
            }
        }})
            res.json(updatedPost);
    }catch(err){
        //res.json({message: err});
        console.log("error: "+err);
    }
})

router.post('/postImages/:id', async(req, res)=>{
    try{
        const addImage = await products.updateOne({_id:req.params.id}, {$push:{images:{
            file: addExtraImage(req.body.images),
            color: req.body.imageColor
        }}})
        res.json(addImage);
    }catch(err){
        console.log(err);
    }
})

router.post('/updateImages/:id', async(req, res)=>{
    try{
        const theProduct = await products.find({_id: req.params.id})
        const updatedPost = await products.updateOne(
            {'images.$.color': req.body.imageColor, _id: req.params.id}, {$set:{
               'images.$.file.': addExtraImage(req.body.images)
           }}
        )
        console.log(req.params.id)
        res.json(updatedPost);
    }catch(err){
        res.json({message: err});
        console.log("error: "+err);
    }
})

module.exports = router;