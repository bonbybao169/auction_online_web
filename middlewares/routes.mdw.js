import {dirname} from "path";
import {fileURLToPath} from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import categoryAdminRoute from '../routes/category_admin.route.js';
import productAdminRoute from '../routes/product_admin.route.js';
import productRoute from '../routes/product.route.js';

export default function(app) {
    app.get('/', function (req, res) {
        res.render('home');
    })

    app.get('/err', function (req, res) {
        throw new Error('Something broke.')
    })

    app.use('/admin/categories', categoryAdminRoute);
    app.use('/admin/products', productAdminRoute);
    app.use('/products', productRoute);

    app.use(function (req, res, next) {
        res.render('404', {layout: false});
    })

    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.render('500', {layout: false});
    })
}