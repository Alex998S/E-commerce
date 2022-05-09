const express = require('express');
const res = require('express/lib/response');
const { createSecureServer } = require('http2');
const router = express.Router();
const https = require('https');
const { resolve } = require('path');
const { route } = require('./root_categories');
require('dotenv').config()

const axios = require('axios');

global.token = "";
let theEmail;
let theName;
let thePassword;




router.get('/auth/signup', (req, res)=>{
    const name = req.cookies.name;
    if(name){
        res.redirect('/');
    }else{
        res.render('authentication');
    }
});

router.post('/auth/signup', (req, res)=>{

    // res.cookie('name', req.body.name);
    // res.cookie('email', req.body.email);
    // res.cookie('password', req.body.password);

    function setData(){
        return new Promise(resolve=>{
            theName = req.body.name;
            theEmail = req.body.email;
            thePassword = req.body.password;
            console.log(theName)
            resolve("done");
        })
    }

    async function submit(){

        const result = await setData();
        console.log(result);
        axios.post("https://osf-digital-backend-academy.herokuapp.com/api/auth/signup",{
        secretKey: process.env.SECRET_KEY,
        name: theName,
        email: theEmail,
        password: thePassword
    })
    .then(res=>{
        console.log(res)
    })
    .catch(error=>{
        console.log(error)
    })
   }

   submit();

   res.redirect('/');
})

router.get('/auth/signin', (req, res)=>{
    res.render('login')
})

router.post('/auth/signin', (req,res)=>{
    
    res.cookie('email', req.body.email);
    res.cookie('password', req.body.password);

    function setDataLogin(){
        return new Promise(resolve=>{
            theName = req.body.name;
            theEmail = req.body.email;
            thePassword = req.body.password;
            resolve("done");
        })
    }

    async function submitLogin(){
        
        const result = await setDataLogin();
        console.log(result);
        axios.post("https://osf-digital-backend-academy.herokuapp.com/api/auth/signin",{
            secretKey: process.env.SECRET_KEY,
            email: theEmail,
            password: thePassword
        })
        .then(res=>{
            token = res.data.token;
            //console.log("The token is: " +token);
            })
        .catch(error=>{
            console.log(error)
        })
    }

    res.cookie('tokenCookie', token);

    submitLogin();

   res.redirect('/');
})

module.exports = router;