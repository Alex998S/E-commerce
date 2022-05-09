const express = require('express');
require('dotenv').config()

const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const https = require('https');
const { response } = require('express');
const res = require('express/lib/response');

const app = express();
const mongoose = require('mongoose')

app.use(express.json());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); //new
app.use(cookieParser());
app.use('/static', express.static('public'));

app.set('view engine', 'pug');

//Connect to database

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true})

mongoose.connection.on('connected', function () {  
  console.log('Connected to Database');
}); 

mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

Sentry.init({
    dsn: process.env.DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
  
  app.get("/", function rootHandler(req, res) {
    res.render('home')
    //res.end("HelloWorld");
  });
  
  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler({
    shouldHandleError(error){
            if(error.status === 404 || error.status === 500){
                return true;
            }
        return false;
        }
    })
  );
  
  // Optional fallthrough error handler
  app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
  });

const rootRoutes = require('./routes/root_categories');
const parentRoutes = require('./routes/parent_categories');
const subRoutes = require('./routes/sub_categories');
const productsRoutes = require('./routes/products');
const detailsRoutes = require('./routes/productDetail');
const authRoutes = require('./routes/authentication.js');
const cartRoutes = require('./routes/addToCart');
const testJS = require('./routes/testJs');
const editPorducts = require('./routes/addVariable')

// app.use(rootRoutes);
// app.use(parentRoutes);
// app.use(subRoutes);
// app.use(productsRoutes);
// app.use(detailsRoutes);
// app.use(authRoutes);
// app.use(cartRoutes);
app.use(testJS);
app.use('/edit-products', editPorducts);

const { json } = require('express/lib/response');
const { resolve } = require('path');
const { error } = require('console');

app.listen(3000, ()=>{
    console.log('The application is running on localhost:3000')
});