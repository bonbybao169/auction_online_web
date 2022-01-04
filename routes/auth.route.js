import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment';

import userModel from '../models/auth.model.js';
const router = express.Router();

router.get('/register', async function (req, res) {
    res.render('vwAccount/register');
});

router.post('/register', async function (req, res) {
    const rawPassword = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(rawPassword, salt);

    const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

    const user = {
        username: req.body.username,
        password: hash,
        dob: dob,
        name: req.body.name,
        email: req.body.email,
        permission: 0
    }

    await userModel.add(user);
    res.render('vwAccount/register');
});

router.get('/login', async function (req, res) {
    res.render('vwAuth/login', {
        layout: false
    });
});

router.post('/login', async function (req, res) {
    const user = await userModel.findByUsername(req.body.username);
    if (user === null) {
        return res.render('vwAuth/login', {
            layout: false,
            err_message: 'Invalid username or password.'
        });
    }

    const ret = bcrypt.compareSync(req.body.password, user.Password);
    if (ret === false) {
        return res.render('vwAuth/login', {
            layout: false,
            err_message: 'Invalid username or password.'
        });
    }
    console.log(ret);

    if(user.Type == 1){
        return res.redirect("/admin");
    }
    else if(user.Type == 2){
        return res.redirect("/seller");
    }
    else{
        return res.redirect("/bidder");
    }
    delete user.password;

    req.session.auth = true;
    req.session.authUser = user;
    res.locals.username = req.session.authUser.Username;
    //const url = req.session.retUrl || '/';
    //res.redirect(url);
});



export default router;