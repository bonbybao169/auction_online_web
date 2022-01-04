//import categoryModel from '../models/category.model.js';

export default function(app) {
    app.use(async function (req, res, next) {
        if (typeof(req.session) != 'object') {
            req.session = {auth : false, authUser: null};
            console.log(typeof (req.session));
        }
        res.locals.auth = req.session.auth;
        res.locals.user = req.session.authUser;
        next();
    });
}