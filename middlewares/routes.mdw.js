import {dirname} from "path";
import {fileURLToPath} from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import bidderRoute from '../routes/bidder.route.js';
import sellerRoute from '../routes/seller.route.js';
import productModel from '../models/product.model.js';
import categoryAdminRoute from '../routes/category_admin.route.js';
import productAdminRoute from '../routes/product_admin.route.js';
import accountAdminRoute from '../routes/account_admin.route.js';
import productRoute from '../routes/product.route.js';
import authRoute from "../routes/auth.route.js";
import accountRoute from "../routes/account.route.js";
import auctionRoute from "../routes/auction.route.js";

export default function(app) {
    app.get('/', async function (req, res) {
        res.redirect('/home');
    })

    app.get('/home', async function (req, res) {
        const listEE = await productModel.findFiveEarlyExpired();
        const listHP = await productModel.findFiveHighestPrice();
        const listHT = await productModel.findFiveHighestTurn();
        for (let i = 0; i < listEE.length; i++) {
            let date = new Date(listEE[i].DateUpload);
            listEE[i].DateUpload = date.toLocaleDateString('en-GB');
            date = new Date(listEE[i].DateExpired);
            listEE[i].DateExpired = productModel.timeDifference2(listEE[i].DateExpired, new Date());
        }
        for (let i = 0; i < listHP.length; i++) {
            let date = new Date(listHP[i].DateUpload);
            listHP[i].DateUpload = date.toLocaleDateString('en-GB');
            date = new Date(listHP[i].DateExpired);
            listHP[i].DateExpired = productModel.timeDifference2(listHP[i].DateExpired, new Date());
        }
        for (let i = 0; i < listHT.length; i++) {
            let date = new Date(listHT[i].DateUpload);
            listHT[i].DateUpload = date.toLocaleDateString('en-GB');
            date = new Date(listHT[i].DateExpired);
            listHT[i].DateExpired = productModel.timeDifference2(listHT[i].DateExpired, new Date());
        }
        // console.log(list);
        res.render('home', {
            productsEE: listEE,
            productsHP: listHP,
            productsHT: listHT
        })
    })
    app.get('/admin', async function (req, res) {
        const listEE = await productModel.findFiveEarlyExpired();
        const listHP = await productModel.findFiveHighestPrice();
        const listHT = await productModel.findFiveHighestTurn();
        for (let i = 0; i < listEE.length; i++) {
            let date = new Date(listEE[i].DateUpload);
            listEE[i].DateUpload = date.toLocaleDateString();
            date = new Date(listEE[i].DateExpired);
            listEE[i].DateExpired = date.toLocaleDateString();
        }
        for (let i = 0; i < listHP.length; i++) {
            let date = new Date(listHP[i].DateUpload);
            listHP[i].DateUpload = date.toLocaleDateString();
            date = new Date(listHP[i].DateExpired);
            listHP[i].DateExpired = date.toLocaleDateString();
        }
        for (let i = 0; i < listHT.length; i++) {
            let date = new Date(listHT[i].DateUpload);
            listHT[i].DateUpload = date.toLocaleDateString();
            date = new Date(listHT[i].DateExpired);
            listHT[i].DateExpired = date.toLocaleDateString();
        }
        // console.log(list);
        res.render('homes/AdminHome', {
            productsEE: listEE,
            productsHP: listHP,
            productsHT: listHT,
            layout: 'AdminLayout.hbs'
        })
    })

    app.get('/err', function (req, res) {
        throw new Error('Something broke.')
    })

    app.use('/admin/categories', categoryAdminRoute);
    app.use('/admin/products', productAdminRoute);
    app.use('/admin/accounts', accountAdminRoute);
    app.use('/products', productRoute);
    app.use("/auth",authRoute);
    app.use("/bidder",bidderRoute);
    app.use("/seller",sellerRoute);
    app.use("/account",accountRoute);

    app.use("/auction",auctionRoute);
    app.use(function (req, res, next) {
        res.render('404', {layout: false});
    })

    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.render('500', {layout: false});
    })
}