import express from 'express';
import accountModel from "../models/account.model.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;

const router = express.Router();
router.get('/', async function(req, res) {
    if(req.session.auth!=false){
        const user = await accountModel.findByUsername(req.session.authUser.Username);
        delete user.Password;
        req.session.authUser=user;
    }
    res.redirect('/account/profile');
})
router.get('/profile', async function(req, res) {
    res.locals.user.Birthday= new Date(res.locals.user.Birthday);
    const user =  Object.assign({}, res.locals.user);
    user.birth = user.Birthday.getDate()+"/"+(user.Birthday.getMonth()+1)+"/"+user.Birthday.getFullYear();
        res.render('vwAccount/profile.hbs', {
        user,
        layout: false,
    })
})
router.get('/logout', async function (req, res) {
    req.session.auth = false;
    req.session.authUser = null;
    // res.render('vwAuth/login', {
    //     layout: false
    // });
    //const url = req.headers.referer || '/';
    req.session.isAdmin=false;
    req.session.isSeller=false;
    req.session.isBidder=false;
    res.redirect("/home");
});
router.post('/changeinfo', async function(req, res) {
    const user = res.locals.user;
    user.Email = req.body.email||res.locals.user.Email;
    user.Name = req.body.name||res.locals.user.Name;
    user.Address = req.body.address||res.locals.user.Address;
    user.Birthday = req.body.birthday || res.locals.user.Birthday;
    accountModel.patch(user);
    res.redirect('/account');
})
router.post('/changepass', async function(req, res) {
    const oldpass = req.body.oldpass;
    const newpass = req.body.newpass;
    const confirmpass = req.body.confirmpass;
    if (newpass !== confirmpass){
        res.locals.user.Birthday= new Date(res.locals.user.Birthday);
        const user =  Object.assign({}, res.locals.user);
        user.birth = user.Birthday.getDate()+"/"+(user.Birthday.getMonth()+1)+"/"+user.Birthday.getFullYear();
        res.render('vwAccount/profile.hbs', {
            err_message: "Confirm password is not true!",
            user,
            layout: false,
        })
    }
    const user = await userModel.findByUsername(res.locals.user.Username);
    const ret = bcrypt.compareSync(oldpass, user.Password);
    if (ret === false) {
        res.locals.user.Birthday= new Date(res.locals.user.Birthday);
        const user =  Object.assign({}, res.locals.user);
        user.birth = user.Birthday.getDate()+"/"+(user.Birthday.getMonth()+1)+"/"+user.Birthday.getFullYear();
        res.render('vwAccount/profile.hbs', {
            err_message: "Old password is not true!",
            user,
            layout: false,
        })
    }
    const hash = bcrypt.hashSync(newpass, saltRounds);
    user.Password = hash;
    accountModel.patch(user);
    res.redirect("/auth/login");
})
router.get('/request_seller', async function(req, res) {
    const user = res.locals.user;
    res.locals.temp =  Object.assign({}, res.locals.user);
    user.WantedSeller=1;
    accountModel.patch(user);
    const url = req.headers.referer || '/';
    res.redirect(url);
})
router.get('/cancel_request_seller', async function(req, res) {
    const user = res.locals.user;
    user.WantedSeller=0;
    console.log(res.locals.temp);
    accountModel.patch(user);
    const url = req.headers.referer || '/';
    res.redirect(url);
})
router.get('/rating', async function(req, res) {
    const user = res.locals.user;
    user.WantedSeller=0;
    console.log(res.locals.temp);
    accountModel.patch(user);
    const url = req.headers.referer || '/';
    res.render('vwAccount/rating.hbs', {
        user,
        layout: false,
    })
})
export default router;