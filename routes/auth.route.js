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
    for(let i = 0; i <  Object.keys(req.body).length; i++){
        if(Object.values(req.body)[i]===''){
            res.render('vwAuth/register',{
                layout:false,
                err_message: "Fill everything",
            });
        }
    }
    if(req.body.password !== req.body.confirmpassword){
        res.render('vwAuth/register',{
            layout:false,
            err_message: "Invalid confirm password",
        });
    }
    if(!accountModel.isAvailableUsername(req.body.username)){
        res.render('vwAuth/register',{
            layout:false,
            err_message: "Username already exists",
        });
    }
    if(!accountModel.isAvailableEmail(req.body.email)){
        res.render('vwAuth/register',{
            layout:false,
            err_message: "Email already exists",
        });
    }

    const rawPassword = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(rawPassword, salt);
    const dob = new Date(req.body.dob);
    const birthday = dob.toISOString().slice(0, 10).replace('T', ' ');
    const user = {
        Username: req.body.username,
        Password: hash,
        Type: 3,
        Name: req.body.name,
        Email: req.body.email,
        Birthday: birthday,
        Address: req.body.address,
        WantedSeller: 0,
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
    temp.OTP = OTP;
    res.render('vwAuth/confirmregister.hbs', {
        layout: false,
        user,
    });
});

router.post('/confirmregister', async function (req, res) {
    const confirmotp = req.body.confirmotp;
    if(confirmotp !== temp.OTP){
        res.render('vwAuth/confirmregister.hbs', {
            layout: false,
            err_message: "Invalid OTP",
        });
    }
    const user = temp.user;
    console.log(user);
    accountModel.add(user);
    res.redirect("/auth/login");
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
    console.log(user);
    delete user.Password;
    req.session.auth = ret;
    req.session.authUser = user;
    //console.log(req.session.authUser);
    //res.locals.user = req.session.authUser;
    //res.locals.auth = req.session.auth;

    if(user.Type == 1){
        req.session.isAdmin=true;
        return res.redirect("/admin");
    }
    else if(user.Type == 2){
        req.session.isSeller=true;
        return res.redirect("/seller");
    }
    else{
        req.session.isBidder=true;
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
    res.render('vwAuth/changepassword.hbs', {
        layout: false,
        user,
    });
});

router.post('/changepassword', async function (req, res) {
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