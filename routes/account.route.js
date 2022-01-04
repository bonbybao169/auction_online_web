import express from 'express';
import userModel from '../models/auth.model.js';

const router = express.Router();
router.get('/', async function(req, res) {
    res.redirect('/account/profile');
})
router.get('/profile', async function(req, res) {
    const user = res.locals.user;
    console.log(res.locals.user);
    res.render('vwAccount/profile.hbs', {
        user,
        layout: false,
    })
})
router.get('/logout', async function (req, res) {
    req.session.auth = false;
    req.session.authUser = null;
    res.render('vwAuth/login', {
        layout: false
    });
    //const url = req.headers.referer || '/';
    //res.redirect(url);
});
export default router;