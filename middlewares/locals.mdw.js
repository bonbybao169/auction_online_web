

export default function(app) {
    app.use(async function (req, res, next) {
        if (typeof(req.session) != 'object') {
            req.session = {auth : false, authUser: null};
        }
        res.locals.auth = req.session.auth;
        res.locals.user = req.session.authUser;
        res.locals.isAdmin=false;
        res.locals.isSeller=false;
        res.locals.isBidder=false;
        if(req.session.auth!=false){
            if (req.session.isAdmin)
                res.locals.isAdmin=true;
            if (req.session.isSeller)
                res.locals.isSeller=true;
            if (req.session.isBidder)
                res.locals.isBidder=true;
        }
        next();
    });
}