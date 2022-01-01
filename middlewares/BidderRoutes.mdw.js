import {dirname} from "path";
import {fileURLToPath} from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import productModel from '../models/product.model.js';
import view from '../middlewares/BidderView.mdw.js'
//import categoryAdminRoute from '../routes/category_admin.route.js';
//import productAdminRoute from '../routes/product_admin.route.js';
import productRoute from '../routes/product_bidder.route.js';

export default function(app) {
    app.get('/', async function (req, res) {
        res.redirect('/BidderHome');
    })

    app.get('/BidderHome', async function (req, res) {
        const listEE = await productModel.findFiveEarlyExpired();
        const listHP = await productModel.findFiveHighestPrice();
        const listHT = await productModel.findFiveHighestTurn();
        for (let i = 0; i < listEE.length; i++) {
            let date1 = new Date(listEE[i].DateUpload);
            listEE[i].DateUpload = date1.toLocaleDateString();
            let date2 = new Date(listEE[i].DateExpired);
            listEE[i].DateExpired = productModel.distance(date2);
        }
        for (let i = 0; i < listHP.length; i++) {
            let date1 = new Date(listHP[i].DateUpload);
            listHP[i].DateUpload = date1.toLocaleDateString();
            let date2 = new Date(listHP[i].DateExpired);
            listHP[i].DateExpired = productModel.distance(date2);
        }
        for (let i = 0; i < listHT.length; i++) {
            let date1 = new Date(listHT[i].DateUpload);
            listHT[i].DateUpload = date1.toLocaleDateString();
            let date2 = new Date(listHT[i].DateExpired);
            listHT[i].DateExpired = productModel.distance(date2);
        }
        // console.log(list);
        res.render('homes/BidderHome', {
            productsEE: listEE,
            productsHP: listHP,
            productsHT: listHT
        })
    })

    app.get('/err', function (req, res) {
        throw new Error('Something broke.')
    })

    //app.use('/admin/categories', categoryAdminRoute);
    //app.use('/admin/products', productAdminRoute);
    app.use('/bidder/products', productRoute);

    app.use(function (req, res, next) {
        res.render('404', {layout: false});
    })

    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.render('500', {layout: false});
    })
}
