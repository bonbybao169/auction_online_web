import {dirname} from "path";
import {fileURLToPath} from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import categoryRoute from '../routes/category.route.js';

export default function(app) {
    app.get('/', function (req, res) {
        res.render('home');
    })

    app.use('/categories', categoryRoute);
}