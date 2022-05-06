const { getEventDescription } = require('@sentry/utils');
const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    productName:{
        type: String,
        required: true
    },
    description:{
        type: String,
        default: 'I am a description'
    },
    price:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true,
        default: "mens"
    },
    images:{
        type: Array,
        required: true,
        file:{
            type: Array
        },
        color:{
            type: String
        }
    },
    variants:{
        type: Array,
        id:{
            type: String,
        },
        color:{
            type: String,
        },
        size:{
            type: String,
        },
        stock:{
            type: Number
        }
    }
},{
    collection: 'products'
});

const CategorySchema = mongoose.Schema({
    id:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    pageDescription:{
        type: String,
        default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    parentCategoryId:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    showInMenu:{
        type: Boolean,
        default: true
    }
})

const products = mongoose.model('Products', ProductSchema,'products');
const categories = mongoose.model('Categories', CategorySchema, 'categories');

module.exports = {products, categories}