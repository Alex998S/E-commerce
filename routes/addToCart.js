const express = require('express');
const router = express.Router();
//const router = require('./root_categories');
const {token} = require('./authentication')

router.get('/home', (req, res)=>{
    res.render('home', {token: token})
    console.log(token);
})

module.exports = router;