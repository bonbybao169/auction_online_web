import {dirname} from "path";
import {fileURLToPath} from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import categoryRoute from '../routes/category.route.js';
import productRoute from '../routes/product.route.js';

export default function(app) {
    app.get('/', function (req, res) {
        res.render('home');
    })

    app.get('/err', function (req, res) {
        throw new Error('Something broke.')
    })

    app.use('/admin/categories', categoryRoute);
    app.use('/products', productRoute);

    app.use(function (req, res, next) {
        res.render('404', {layout: false});
    })

    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.render('500', {layout: false});
    })
}