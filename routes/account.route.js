import express from 'express';
import accountModel from "../models/account.model.js";
import bcrypt from "bcryptjs";
import productModel from "../models/product.model.js";
import nodemailer from "nodemailer";
const saltRounds = 10;

const router = express.Router();
const temp={};
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
    const USER = Object.assign({},res.locals.user);
    USER.Email = req.body.email||res.locals.user.Email;
    USER.Name = req.body.name||res.locals.user.Name;
    USER.Address = req.body.address||res.locals.user.Address;
    USER.Birthday = req.body.birthday || res.locals.user.Birthday;
    if(USER.Email !== res.locals.user.Email){
        if((await accountModel.isAvailableEmail(USER.Email))===false){
            res.locals.user.Birthday = new Date(res.locals.user.Birthday);
            const user =  Object.assign({}, res.locals.user);
            user.birth = user.Birthday.getDate()+"/"+(user.Birthday.getMonth()+1)+"/"+user.Birthday.getFullYear();
            res.render('vwAccount/profile.hbs', {
                err_message: "Email is not available!",
                user,
                layout: false,
            })
        }else{
            const OTP = Math.floor(Math.random() * (999999-100000)) + 100000;;
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'ltdat192@clc.fitus.edu.vn',
                    pass: 'sttffsuck@13579'
                }
            });

            transporter.sendMail({
                from: 'ltdat192@clc.fitus.edu.vn',
                to: USER.Email,
                subject: 'E-Commerce Web App Notification!',
                text: 'Your OTP is '+ OTP,
            });
            temp.user = USER;
            temp.OTP = OTP;
            res.render('vwAccount/confirmemail.hbs', {
                layout: false,
                user : temp.user,
            });
        }
    }else{
        accountModel.patch(USER);
        res.redirect('/account');

    }
})
router.post('/confirmemail', async function (req, res) {
    const confirmotp = req.body.confirmotp;
    console.log(confirmotp);
    console.log(temp.OTP);
    if(parseInt(confirmotp) !== temp.OTP){
        res.render('vwAccount/confirmemail.hbs', {
            layout: false,
            user : temp.user,
            err_message: "Invalid OTP",
        });
    }else{
        const user = temp.user;
        accountModel.patch(user);
        res.redirect("/account");
    }
});
router.post('/changepass', async function(req, res) {
    const oldpass = req.body.oldpass;
    const newpass = req.body.newpass;
    const confirmpass = req.body.confirmpass;
    if (newpass !== confirmpass){
        res.locals.user.Birthday = new Date(res.locals.user.Birthday);
        const user =  Object.assign({}, res.locals.user);
        user.birth = user.Birthday.getDate()+"/"+(user.Birthday.getMonth()+1)+"/"+user.Birthday.getFullYear();
        res.render('vwAccount/profile.hbs', {
            err_message: "Confirm password is not true!",
            user,
            layout: false,
        })
    }else{
        const user = await accountModel.findByUsername(res.locals.user.Username);
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
        }else{
            const hash = bcrypt.hashSync(newpass, saltRounds);
            user.Password = hash;
            accountModel.patch(user);
            res.redirect("/account/logout");
        }
    }
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
    const username = req.query.id || 0;
    const page = req.query.page || 1;
    const limit = 6;
    const total = await accountModel.countRatingbyUsername(username);
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    const pageNumbers = [];
    const offset = (page - 1) * limit;
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }
    const list = await accountModel.findRatingbyUsername(username, limit, offset);
    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].Date);
        list[i].Date = date.toLocaleDateString('en-GB');
        list[i].product = await productModel.findByID(list[i].ProductID);
    }
    var user ={};
    user.rate=Math.floor(await accountModel.RateofSb(username)*10);
    if(user.rate!==null){
        user.star=[];user.halfstar=[];user.nonstar=[];
        for (let i = 0; i < Math.floor(user.rate/2); i++) {
            user.star.push({});}
        for (let i = 0; i < ((10-user.rate)%2); i++) {
            user.halfstar.push({});}
        for (let i = 0; i < Math.floor((10-user.rate)/2); i++) {
            user.nonstar.push({});}
    }
    console.log(list);
    if (res.locals.user.Type===2){
        res.render('vwAccount/rating_seller.hbs', {
            layout: false,
            comments: list,
            empty: list.length === 0,
            pageNumbers,
            firstPage: +page === 1,
            lastPage: +page === nPages,
            previousPage: +page - 1,
            nextPage: +page + 1,
            username,
            user
        })
    }
    else if (res.locals.user.Type===3){
        res.render('vwAccount/rating.hbs', {
            layout: false,
            comments: list,
            empty: list.length === 0,
            pageNumbers,
            firstPage: +page === 1,
            lastPage: +page === nPages,
            previousPage: +page - 1,
            nextPage: +page + 1,
            username,
            user
        })
    }
})
export default router;