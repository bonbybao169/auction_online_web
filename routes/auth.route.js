import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment';

import accountModel from '../models/account.model.js';
const router = express.Router();
import nodemailer from 'nodemailer';
const temp = {};


router.get('/register', async function (req, res) {
    res.render('vwAuth/register',{
        layout:false,
    });
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
    res.render('vwAuth/login');
});

router.get('/login', async function (req, res) {
    res.render('vwAuth/login', {
        layout: false
    });
});

router.post('/login', async function (req, res) {
    const user = await accountModel.findByUsername(req.body.username);
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
    delete user.Password;
    req.session.auth = ret;
    req.session.authUser = user;
    //console.log(req.session.authUser);
    //res.locals.user = req.session.authUser;
    //res.locals.auth = req.session.auth;

    if(user.Type == 1){
        return res.redirect("/admin");
    }
    else if(user.Type == 2){
        return res.redirect("/seller");
    }
    else{
        return res.redirect("/bidder");
    }


    //const url = req.session.retUrl || '/';
    //res.redirect(url);
});

router.get('/forgotpassword', async function (req, res) {
    res.render('vwAuth/forgotpassword.hbs', {
        layout: false
    });
});

router.post('/forgotpassword', async function (req, res) {
    const username = req.body.username;
    const user = await accountModel.findByUsername(req.body.username);
    delete user.Password;
    if (user === null) {
        return res.render('vwAuth/forgotpassword', {
            layout: false,
            err_message: 'Invalid username.'
        });
    }

    const OTP = Math.floor(Math.random() * 1000000) + 100000;;
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ltdat192@clc.fitus.edu.vn',
            pass: 'sttffsuck@13579'
        }
    });

    transporter.sendMail({
        from: 'ltdat192@clc.fitus.edu.vn',
        to: user.Email,
        subject: 'E-Commerce Web App Notification!',
        text: 'Your OTP is '+OTP,
    });
    temp.user = user;
    temp.OTP=OTP;
    res.render('vwAuth/confirmotp.hbs', {
        layout: false,
        user,
    });
});

router.post('/confirmotp', async function (req, res) {
    const confirmotp = req.body.confirmotp;
    if(confirmotp !== temp.OTP){
        res.render('vwAuth/forgotpassword.hbs', {
            layout: false,
            err_message: "Invalid OTP",
        });
    }
    if(req.body.newpassword !== req.body.confirmpassword){
        res.render('vwAuth/forgotpassword.hbs', {
            layout: false,
            err_message: "Invalid confirm password",
        });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.newpassword, salt);
    temp.user.Password = hash;
    accountModel.patch(temp.user);
    res.redirect("/auth/login");
});

export default router;