import express from 'express';
import morgan from 'morgan';
import {engine} from 'express-handlebars';

import {dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(morgan('dev'));
const port = 3000;

app.engine('hbs', engine({
    defaultLayout: 'layout.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/', function (req, res) {
    res.render('home');
})

app.listen(port, function () {
    console.log(`Example app listening at http://localhost:${port}`)
});