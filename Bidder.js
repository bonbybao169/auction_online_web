import express from 'express';
import morgan from 'morgan';
import asyncError from 'express-async-errors'

import activate_local_mdw from './middlewares/locals.mdw.js/';
import activate_view_mdw from './middlewares/BidderView.mdw.js';
import activate_route_mdw from './middlewares/BidderRoutes.mdw.js';

import categoryModel from './models/category.model.js'

const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: true
}));
app.use('/image', express.static('image'));

app.use(async function (req,res,next){
    res.locals.lcChildCat = await categoryModel.findChildCat();
    res.locals.lcParentCat = await categoryModel.findParentCat();
    res.locals.user = "thanhdat";
    next();
});

activate_view_mdw(app);
activate_route_mdw(app);

const port = 3002;

app.listen(port, function () {
    console.log(`Example app listening at http://localhost:${port}`)
});