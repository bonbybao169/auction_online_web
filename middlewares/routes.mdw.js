import {dirname} from "path";
import {fileURLToPath} from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import categoryRoute from '../routes/category.route.js';
import productRoute from '../routes/product.route.js';

export default function(app) {
    app.get('/', function (req, res) {
        res.redirect('/products');
    })

    app.use('/categories', categoryRoute);
    app.use('/products', productRoute);
}