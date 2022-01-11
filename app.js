import express from 'express';
import morgan from 'morgan';
import asyncError from 'express-async-errors'
import session from "express-session";
import mySqlSessionStore from "express-mysql-session";
import activate_local_mdw from './middlewares/locals.mdw.js/';
import activate_view_mdw from './middlewares/view.mdw.js';
import activate_route_mdw from './middlewares/routes.mdw.js';
import categoryModel from './models/category.model.js';
import { connectionInfo } from './utils/db.js';

const MySqlSession = mySqlSessionStore(session);
const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: true
}));
app.use('/image', express.static('image'));
app.use(express.static('public'));
app.set('trust proxy', 1)
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        store: new MySqlSession(connectionInfo),
        cookie: {
            // secure: true
        }
    })
);
app.use(async function (req,res,next){
    res.locals.lcChildCat = await categoryModel.findChildCat();
    res.locals.lcParentCat = await categoryModel.findParentCat();
    next();
});

activate_local_mdw(app);
activate_view_mdw(app);
activate_route_mdw(app);

const port = 3000;

app.listen(port, function () {
    console.log(`Example app listening at http://localhost:${port}`)
});