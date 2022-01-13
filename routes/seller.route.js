import express from 'express';

import productModel from "../models/product.model.js";
import myproductModel from "../models/product_seller.model.js"
import accountModel from "../models/account.model.js";
import auctionhistoryModel from "../models/auctionhistory.model.js";
import multer from 'multer';
import auctionModel from "../models/auction.model.js";
import * as fs from "fs";
import categoryModel from "../models/category.model.js";
import auctionHistoryModel from "../models/auctionhistory.model.js";
import mailingSystem from "../mailing_system/mailing.js";
const router = express.Router();
router.get('/', async function(req, res) {
    res.redirect('/seller/home');
})
router.get('/home', async function(req, res) {
    const listEE = await productModel.findFiveEarlyExpired();
    const listHP = await productModel.findFiveHighestPrice();
    const listHT = await productModel.findFiveHighestTurn();
    for (let i = 0; i < listEE.length; i++) {
        listEE[i].isExpired = false;
        if(productModel.timeDifference(listEE[i].DateExpired, new Date()) ==='Sản phẩm hết hạn'){
            listEE[i].isExpired = true;
        }
        listEE[i].isLoved = await accountModel.isLoved(res.locals.user.Username,listEE[i].ID);

        let date = new Date(listEE[i].DateUpload);
        listEE[i].DateUpload = date.toLocaleDateString('en-GB');

        if (productModel.timeDifference(listEE[i].DateExpired, new Date()) !== false) {
            listEE[i].DateExpired = productModel.timeDifference(listEE[i].DateExpired, new Date());
        }
        else {
            date = new Date(listEE[i].DateExpired);
            listEE[i].DateExpired = date.toLocaleDateString('en-GB');
        }
    }
    console.log(listEE);
    console.log(listEE[0]);
    for (let i = 0; i < listHP.length; i++) {
        listHP[i].isExpired = false;
        if(productModel.timeDifference(listHP[i].DateExpired, new Date()) ==='Sản phẩm hết hạn'){
            listHP[i].isExpired = true;
        }
        listHP[i].isLoved = await accountModel.isLoved(res.locals.user.Username,listHP[i].ID);

        let date = new Date(listHP[i].DateUpload);
        listHP[i].DateUpload = date.toLocaleDateString('en-GB');

        if (productModel.timeDifference(listHP[i].DateExpired, new Date()) !== false) {
            listHP[i].DateExpired = productModel.timeDifference(listHP[i].DateExpired, new Date());
        }
        else {
            date = new Date(listHP[i].DateExpired);
            listHP[i].DateExpired = date.toLocaleDateString('en-GB');
        }
    }
    for (let i = 0; i < listHT.length; i++) {
        listHT[i].isExpired = false;
        if(productModel.timeDifference(listHT[i].DateExpired, new Date()) ==='Sản phẩm hết hạn'){
            listHT[i].isExpired = true;
        }
        listHT[i].isLoved = await accountModel.isLoved(res.locals.user.Username,listHT[i].ID);

        let date = new Date(listHT[i].DateUpload);
        listHT[i].DateUpload = date.toLocaleDateString('en-GB');

        if (productModel.timeDifference(listHT[i].DateExpired, new Date()) !== false) {
            listHT[i].DateExpired = productModel.timeDifference(listHT[i].DateExpired, new Date());
        }
        else {
            date = new Date(listHT[i].DateExpired);
            listHT[i].DateExpired = date.toLocaleDateString('en-GB');
        }
    }

    res.render('homes/seller_home', {
        layout: "SellerLayout.hbs",
        productsEE: listEE,
        productsHP: listHP,
        productsHT: listHT
    })
})

router.get('/products', async function(req, res) {
    const page = req.query.page || 1;
    const limit = 6;
    const total = await productModel.countAll();
    let nPages = Math.floor(total / limit);
    if (total%limit > 0) nPages++;
    const pageNumbers = [];
    const offset = (page-1)*limit;
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    const list = await productModel.findAll(limit, offset);

    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = productModel.distance(date);
    }
    // console.log(list);
    res.render('vwProduct/byCat_seller', {
        layout: "SellerLayout.hbs",
        products: list,
        pageNumbers,
        empty: list.length === 0,
        page
    })
})



router.get('/products/byCat/:id', async function (req, res) {
    const catID = req.params.id || 0;

    const page = req.query.page || 1;
    const limit = 6;
    const total = await productModel.countByCatID(catID);
    let nPages = Math.floor(total / limit);
    if (total%limit > 0) nPages++;
    const pageNumbers = [];
    const offset = (page-1)*limit;
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    const list = await productModel.findByCatID(catID, limit, offset);
    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = productModel.distance(date);
    }
    // console.log(list);

    res.render('vwProduct/byCat_seller', {
        layout: "SellerLayout.hbs",
        products: list,
        empty: list.length === 0,
        pageNumbers,
        page
    });
})


router.get('/myproducts/byPostingList', async function(req, res) {
    const page = req.query.page || 1;
    const limit = 6;
    const username =res.locals.user.Username;
    const total = await myproductModel.countAllMyproductPosting(username);
    let nPages = Math.floor(total / limit);
    if (total%limit > 0) nPages++;
    const pageNumbers = [];
    const offset = (page-1)*limit;
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    const list = await myproductModel.findAllMyproductPosting(username,limit, offset);

    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = productModel.distance(date);
    }
    // console.log(list);
    res.render('vwProduct/byCat_mypostingpr', {
        layout: "MyPostingProductLayout.hbs",
        products: list,
        pageNumbers,
        empty: list.length === 0,
        page
    })
})



router.get('/myproducts/byPostingList/byCat/:id', async function (req, res) {
    const catID = req.params.id || 0;

    const page = req.query.page || 1;
    const limit = 6;
    const username =res.locals.user.Username;
    const total = await myproductModel.countByCatIDPosting(username,catID);
    let nPages = Math.floor(total / limit);
    if (total%limit > 0) nPages++;
    const pageNumbers = [];
    const offset = (page-1)*limit;
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    const list = await myproductModel.findByCatIDPosting(username,catID, limit, offset);
    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = productModel.distance(date);
    }
    // console.log(list);

    res.render('vwProduct/byCat_mypostingpr', {
        layout: "MyPostingProductLayout.hbs",
        products: list,
        empty: list.length === 0,
        pageNumbers,
        page
    });
})

router.get('/myproducts/bySuccessfulAuctionList', async function(req, res) {
    const page = req.query.page || 1;
    const limit = 6;
    const username =res.locals.user.Username;
    const total = await myproductModel.countAllMyproductAuction(username);
    let nPages = Math.floor(total / limit);
    if (total%limit > 0) nPages++;
    const pageNumbers = [];
    const offset = (page-1)*limit;
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    const list = await myproductModel.findAllMyproductAuction(username,limit, offset);

    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = productModel.distance(date);
        list[i].isCancel= await myproductModel.isCancel(list[i].ID);
    }
    // console.log(list);
    res.render('vwProduct/byCat_mysuccesspr', {
        layout: "MySuccessfulAuctionProductLayout.hbs",
        products: list,
        pageNumbers,
        empty: list.length === 0,
        page
    })
})



router.get('/myproducts/bySuccessfulAuctionList/byCat/:id', async function (req, res) {
    const catID = req.params.id || 0;

    const page = req.query.page || 1;
    const limit = 6;
    const username =res.locals.user.Username;
    const total = await myproductModel.countByCatIDAuction(username,catID);
    let nPages = Math.floor(total / limit);
    if (total%limit > 0) nPages++;
    const pageNumbers = [];
    const offset = (page-1)*limit;
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    const list = await myproductModel.findByCatIDAuction(username,catID, limit, offset);
    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = productModel.distance(date);
        list[i].isCancel= await myproductModel.isCancel(list[i].ID);
    }
    // console.log(list);

    res.render('vwProduct/byCat_mysuccesspr', {
        layout: "MySuccessfulAuctionProductLayout.hbs",
        products: list,
        empty: list.length === 0,
        pageNumbers,
        page
    });
})



router.get('/products/search', async function (req, res) {
    const ProName = req.query.keyword || 0;
    const page = req.query.page || 1;
    const DateExpiredDescend = req.query.DateExpiredDescend || 0;
    const PriceAscend = req.query.PriceAscend || 0;

    const limit = 6;
    const total = await productModel.countByProName(ProName);
    // console.log(total);
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

    const list = await productModel.findByProName(ProName, limit, offset, +DateExpiredDescend, +PriceAscend);
    for (let i = 0; i < list.length; i++) {
        list[i].isExpired = false;
        if(productModel.timeDifference(list[i].DateExpired, new Date()) ==='Sản phẩm hết hạn'){
            list[i].isExpired = true;
        }
        list[i].isLoved = await accountModel.isLoved(res.locals.user.Username,list[i].ID);

        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString('en-GB');

        if (productModel.timeDifference(list[i].DateExpired, new Date()) !== false) {
            list[i].DateExpired = productModel.timeDifference(list[i].DateExpired, new Date());
        }
        else {
            date = new Date(list[i].DateExpired);
            list[i].DateExpired = date.toLocaleDateString('en-GB');
        }
    }
    // console.log(list);
    res.render('vwProduct/byCat_seller', {
        layout: "BidderLayout.hbs",
        products: list,
        empty: list.length === 0,
        pageNumbers,
        firstPage: +page === 1,
        lastPage: +page === nPages,
        previousPage: +page - 1,
        nextPage: +page + 1,
        ProName,
        DateExpiredDescend,
        PriceAscend
    });
})
router.get('/products/byWatchList', async function(req, res) {
    const page = req.query.page || 1;
    const limit = 6;
    const total = await productModel.countByWatchList(res.locals.user.Username);
    let nPages = Math.floor(total / limit);
    if (total%limit > 0) nPages++;
    const pageNumbers = [];
    const offset = (page-1)*limit;
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    const list = await productModel.findByWatchList(res.locals.user.Username,limit, offset);
    for (let i = 0; i < list.length; i++) {
        list[i].isExpired = false;
        if(productModel.timeDifference(list[i].DateExpired, new Date()) ==='Sản phẩm hết hạn'){
            list[i].isExpired = true;
        }
        list[i].isLoved = await accountModel.isLoved(res.locals.user.Username,list[i].ID);

        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString('en-GB');

        if (productModel.timeDifference(list[i].DateExpired, new Date()) !== false) {
            list[i].DateExpired = productModel.timeDifference(list[i].DateExpired, new Date());
        }
        else {
            date = new Date(list[i].DateExpired);
            list[i].DateExpired = date.toLocaleDateString('en-GB');
        }
    }
    // console.log(list);
    res.render('vwProduct/byWatchList_seller', {
        layout: "SellerLayout.hbs",
        products: list,
        pageNumbers,
        empty: list.length === 0,
        page
    })
})
router.get('/products/byWinningList', async function(req, res) {
    const page = req.query.page || 1;
    const limit = 6;
    const total = await productModel.countByWinningList(res.locals.user.Username);
    let nPages = Math.floor(total / limit);
    if (total%limit > 0) nPages++;
    const pageNumbers = [];
    const offset = (page-1)*limit;
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    const list = await productModel.findByWinningList(res.locals.user.Username,limit, offset);
    for (let i = 0; i < list.length; i++) {
        list[i].isExpired = false;
        if(productModel.timeDifference(list[i].DateExpired, new Date()) ==='Sản phẩm hết hạn'){
            list[i].isExpired = true;
        }
        list[i].isLoved = await accountModel.isLoved(res.locals.user.Username,list[i].ID);

        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString('en-GB');

        if (productModel.timeDifference(list[i].DateExpired, new Date()) !== false) {
            list[i].DateExpired = productModel.timeDifference(list[i].DateExpired, new Date());
        }
        else {
            date = new Date(list[i].DateExpired);
            list[i].DateExpired = date.toLocaleDateString('en-GB');
        }
        list[i].isCommented = await accountModel.isCommented(res.locals.user.Username,list[i].ID);
        if(list[i].isCommented===true){
            list[i].Comment = await productModel.findRatebyEntity({"Username":res.locals.user.Username,"ProductID":list[i].ID});
        }
        console.log(list[i])
    }
    // console.log(list);
    res.render('vwProduct/byWinningList_seller', {
        layout: "SellerLayout.hbs",
        products: list,
        pageNumbers,
        empty: list.length === 0,
        page
    })
})
router.get('/products/byAuctionList', async function(req, res) {
    const page = req.query.page || 1;
    const limit = 6;
    const total = await productModel.countByAuctionList(res.locals.user.Username);
    let nPages = Math.floor(total / limit);
    if (total%limit > 0) nPages++;
    const pageNumbers = [];
    const offset = (page-1)*limit;
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    const list = await productModel.findByAuctionList(res.locals.user.Username,limit, offset);
    for (let i = 0; i < list.length; i++) {
        list[i].isExpired = false;
        if(productModel.timeDifference(list[i].DateExpired, new Date()) ==='Sản phẩm hết hạn'){
            list[i].isExpired = true;
        }
        list[i].isLoved = await accountModel.isLoved(res.locals.user.Username,list[i].ID);

        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString('en-GB');

        if (productModel.timeDifference(list[i].DateExpired, new Date()) !== false) {
            list[i].DateExpired = productModel.timeDifference(list[i].DateExpired, new Date());
        }
        else {
            date = new Date(list[i].DateExpired);
            list[i].DateExpired = date.toLocaleDateString('en-GB');
        }
        list[i].isCommented = await accountModel.isCommented(res.locals.user.Username,list[i].ID);
        list[i].isHighest =  await accountModel.isHighest(res.locals.user.Username,list[i].ID);
    }
    // console.log(list);
    res.render('vwProduct/byAuctionList_seller', {
        layout: "SellerLayout.hbs",
        products: list,
        pageNumbers,
        empty: list.length === 0,
        page
    })
})

router.get('/products/:id', async function (req, res) {
    const proID = req.params.id || 0;
    const product = await productModel.findByID(proID);
    const list = await productModel.findByCatIDExceptProID(product.ID, product.Category, 5);

    product.isExpired = false;
    if(productModel.timeDifference(product.DateExpired, new Date()) ==='Sản phẩm hết hạn'){
        product.isExpired = true;
    }
    product.isLoved = await accountModel.isLoved(res.locals.user.Username,product.ID);

    let date = new Date(product.DateUpload);
    product.DateUpload = date.toLocaleDateString('en-GB');

    product.Offer = product.PresentPrice + product.Step;


    if (productModel.timeDifference(product.DateExpired, new Date()) !== false) {
        product.DateExpired = productModel.timeDifference(product.DateExpired, new Date());
    }
    else {
        date = new Date(product.DateExpired);
        product.DateExpired = date.toLocaleDateString('en-GB');
    }

    product.SellerRate = Math.floor(await accountModel.RateofSb(product.Seller) * 10 );
    product.BidderRate = Math.floor(await accountModel.RateofSb(product.HighestBidder) * 10);

    const auctionhistory = await auctionhistoryModel.findByID(product.ID);
    for(let i=0;i<auctionhistory.length;i++){
        date = new Date(auctionhistory[i].AuctionTime);
        auctionhistory[i].AuctionTime = date.toLocaleString('en-GB');
        const words = auctionhistory[i].Name.split(' ');
        auctionhistory[i].Name="****"+words[words.length-1];
    }

    var User = await auctionModel.find(res.locals.user.Username, product.ID);
    if(typeof (User) ==="undefined"){
        User = {};
        User.HighestPrice=null;
    }else{
        User.AuctionTime = new Date(User.AuctionTime).toLocaleString('en-GB');
    }

    User.isEligibled = false;
    if((await accountModel.RateofSb(res.locals.user.Username))>=0.8||(product.BidderRate==0&&(await accountModel.RateofSb(res.locals.user.Username))==false)){
        User.isEligibled=true;
    }
    User.isBlocked = false;
    if ((await accountModel.isBlocked(res.locals.user.Username,product.ID)) === true){
        User.isBlocked = true;
    }
    console.log(User);
    res.render('vwProduct/detail_seller.hbs', {
        layout: false,
        product,
        sameproducts: list,
        auctionhistory,
        User,
        noBidder: product.HighestBidder === null,
    });
})

router.get('/myproducts/byPostingList/:id', async function (req, res) {
    const proID = req.params.id || 0;
    const product = await productModel.findByID(proID);
    const list = await myproductModel.findByCatIDPostingDif(res.locals.user.Username,product.ID, product.Category, 5);

    product.isExpired = false;
    if(productModel.timeDifference(product.DateExpired, new Date()) ==='Sản phẩm hết hạn'){
        product.isExpired = true;
    }
    product.isLoved = await accountModel.isLoved(res.locals.user.Username,product.ID);

    let date = new Date(product.DateUpload);
    product.DateUpload = date.toLocaleDateString('en-GB');

    product.Offer = product.PresentPrice + product.Step;


    if (productModel.timeDifference(product.DateExpired, new Date()) !== false) {
        product.DateExpired = productModel.timeDifference(product.DateExpired, new Date());
    }
    else {
        date = new Date(product.DateExpired);
        product.DateExpired = date.toLocaleDateString('en-GB');
    }

    product.SellerRate = Math.floor(await accountModel.RateofSb(product.Seller) * 10 );
    product.BidderRate = Math.floor(await accountModel.RateofSb(product.HighestBidder) * 10);

    const auctionhistory = await auctionhistoryModel.findByID(product.ID);
    for(let i=0;i<auctionhistory.length;i++){
        date = new Date(auctionhistory[i].AuctionTime);
        auctionhistory[i].AuctionTime = date.toLocaleString('en-GB');
        auctionhistory[i].isBlocked=await accountModel.isBlocked(auctionhistory[i].Username,proID);
        console.log(auctionhistory[i].isBlocked);
    }

    var User = await auctionModel.find(res.locals.user.Username, product.ID);
    if(typeof (User) ==="undefined"){
        User = {};
        User.HighestPrice=null;
    }else{
        User.AuctionTime = new Date(User.AuctionTime).toLocaleString('en-GB');
    }

    User.isEligibled = false;
    if((await accountModel.RateofSb(res.locals.user.Username))>=0.8||(product.BidderRate==0&&(await accountModel.RateofSb(res.locals.user.Username))==false)){
        User.isEligibled=true;
    }
    User.isBlocked = false;
    if ((await accountModel.isBlocked(res.locals.user.Username,product.ID)) === true){
        User.isBlocked = true;
    }
    console.log(User);
    const datenow = new Date();
    res.render('vwProduct/detail_posting_seller', {
        layout: false,
        product,
        sameproducts: list,
        auctionhistory,
        User,
        noBidder: product.HighestBidder === null,
        Now: datenow.toLocaleDateString('en-GB')
    });
})

router.get('/myproducts/bySuccessfulAuctionList/:id', async function (req, res) {
    const proID = req.params.id || 0;
    const product = await productModel.findByID(proID);
    const user=res.locals.user.Username;
    const list = await myproductModel.findByCatIDAuctionDif(user,proID, product.Category, 5);

    product.isExpired = false;
    if(productModel.timeDifference(product.DateExpired, new Date()) ==='Sản phẩm hết hạn'){
        product.isExpired = true;
    }
    product.isLoved = await accountModel.isLoved(res.locals.user.Username,product.ID);

    let date = new Date(product.DateUpload);
    product.DateUpload = date.toLocaleDateString('en-GB');

    product.Offer = product.PresentPrice + product.Step;


    if (productModel.timeDifference(product.DateExpired, new Date()) !== false) {
        product.DateExpired = productModel.timeDifference(product.DateExpired, new Date());
    }
    else {
        date = new Date(product.DateExpired);
        product.DateExpired = date.toLocaleDateString('en-GB');
    }

    product.SellerRate = Math.floor(await accountModel.RateofSb(product.Seller) * 10 );
    product.BidderRate = Math.floor(await accountModel.RateofSb(product.HighestBidder) * 10);
    product.isCancel= await myproductModel.isCancel(proID);
    console.log(product.isCancel);

    const auctionhistory = await auctionhistoryModel.findByID(product.ID);
    for(let i=0;i<auctionhistory.length;i++){
        date = new Date(auctionhistory[i].AuctionTime);
        auctionhistory[i].AuctionTime = date.toLocaleString('en-GB');
        auctionhistory[i].isBlocked= await accountModel.isBlocked(auctionhistory[i].Username,proID);
    }

    for(let i=0;i<list.length;i++){
        list[i].isCancel= await myproductModel.isCancel(list[i].ID)
    }

    var User = await auctionModel.find(res.locals.user.Username, product.ID);
    if(typeof (User) ==="undefined"){
        User = {};
        User.HighestPrice=null;
    }else{
        User.AuctionTime = new Date(User.AuctionTime).toLocaleString('en-GB');
    }

    User.isEligibled = false;
    if((await accountModel.RateofSb(res.locals.user.Username))>=0.8||(product.BidderRate==0&&(await accountModel.RateofSb(res.locals.user.Username))==false)){
        User.isEligibled=true;
    }
    User.isBlocked = false;
    if ((await accountModel.isBlocked(res.locals.user.Username,product.ID)) === true){
        User.isBlocked = true;
    }
    console.log(User);
    console.log(list)
    res.render('vwProduct/detail_successauction_seller.hbs', {
        layout: false,
        product,
        sameproducts: list,
        auctionhistory,
        User,
        noBidder: product.HighestBidder === null,
    });
})



router.get('/products/love/:id', async function (req, res) {
    const proID = req.params.id || 0;
    const url = req.headers.referer || '/';
    const product = await productModel.findByID(proID);
    if(product == null){
        res.redirect(url)
    }else{
        accountModel.Love(res.locals.user.Username,product.ID);
        res.redirect(url);
    }
})

router.get('/products/unlove/:id', async function (req, res) {
    const proID = req.params.id || 0;
    const product = await productModel.findByID(proID);
    const url = req.headers.referer || '/';
    if(product == null){
        res.redirect(url)
    }else{
        accountModel.Unlove(res.locals.user.Username,product.ID);
        res.redirect(url);
    }

})
router.post('/products/rate/:id', async function (req, res) {
    console.log(req.body);
    const proID = req.params.id || 0;
    const product = await productModel.findByID(proID);
    const rate = req.body.Rate;
    const description = req.body.Description;
    const seller = product.Seller;
    const date = new Date();
    const entity={
        Username: res.locals.user.Username,
        ProductID: proID,
        Rate: rate,
        Description: description,
        RatedPerson: seller,
        Date: date,
    }
    console.log(entity);
    const url = req.headers.referer || '/';
    if(product == null){
        res.redirect(url)
    }else{
        accountModel.rateSeller(entity);
        res.redirect(url);
    }
})

router.post('/myproducts/rateBidder/:id', async function (req, res) {
    console.log(req.body);
    const proID = req.params.id || 0;
    const product = await productModel.findByID(proID);
    const rate = req.body.Rate;
    const description = req.body.Description;
    const winner = product.Winner;
    const date = new Date();
    const entity={
        Username: res.locals.user.Username,
        ProductID: proID,
        Rate: rate,
        Description: description,
        RatedPerson: winner,
        Date: date,
    }
    console.log(entity);
    const url = req.headers.referer || '/';
    if(product == null){
        res.redirect(url)
    }else{
        accountModel.rateSeller(entity);
        res.redirect(url);
    }
})

router.get('/myproducts/canceltransaction/:id', async function (req, res) {
    console.log(req.body);
    const proID = req.params.id || 0;
    const product = await productModel.findByID(proID);
    const rate = 0;
    const description = "Người mua không chịu thanh toán";
    const winner = product.Winner;
    const date = new Date();
    const entity={
        Username: res.locals.user.Username,
        ProductID: proID,
        Rate: rate,
        Description: description,
        RatedPerson: winner,
        Date: date,
    }
    console.log(entity);
    const url = req.headers.referer || '/';
    if(product == null){
        res.redirect(url)
    }else{
        const cancel =await myproductModel.cancelTransaction(proID);
        accountModel.rateSeller(entity);
        res.redirect(url);
    }
})

router.get('/myproducts/blockBidder/:id', async function (req, res) {
    console.log(req.body);
    const username = req.query.user || 0;
    const proID = req.params.id || 0;


    const entity={
        BidderID: username,
        ProductID: proID
    }
    console.log(entity);
    const url = req.headers.referer || '/';
    const t = await  accountModel.addBlockBidder(entity);

    res.redirect(url);

})

router.post('/products/addnewprice/:id', async function (req, res) {
    req.body.AuctionTime = new Date();
    console.log(req.body);
    const highestPrice = req.body.HighestPrice;
    let presentPrice = await productModel.findPresentPriceByProID(req.body.ProductID);

    const highestBidder = await productModel.findHighestBidderByProID(req.body.ProductID);
    const stepPrice = await productModel.findStepByProID(req.body.ProductID);
    let turn = await productModel.findTurnByProID(req.body.ProductID);
    const requiredPrice = presentPrice+stepPrice;
    var User = await auctionModel.find(res.locals.user.Username, req.body.ProductID);
    const Seller = await productModel.findSellerIDByProID(req.body.ProductID);
    const ProName = await productModel.getProNameByProID(req.body.ProductID);
    // console.log(User);
    // console.log(Seller);
    if (req.body.HighestPrice >= (presentPrice+stepPrice) && (typeof (User) ==="undefined"||req.body.HighestPrice>= User.HighestPrice)) {
        await auctionModel.add(req.body);

        if (highestBidder.HighestBidder === null) {
            await productModel.updateHighestPriceAndBidderAndTurn(req.body.ProductID, presentPrice, req.body.BidderID,turn+1);
            await auctionHistoryModel.add({BidderID: req.body.BidderID, ProductID: req.body.ProductID, CurrentPrice: presentPrice, AuctionTime: req.body.AuctionTime});
            const AllNeededMails = await accountModel.getEmailByBidderID(req.body.BidderID) + ", " + await accountModel.getEmailByBidderID(Seller);
            // console.log(AllNeededMails);
            await mailingSystem.addPriceSuccess(req.body.BidderID, ProName, AllNeededMails);
        }else if (highestBidder.HighestBidder === req.body.BidderID) {

        }
        else {
            const anotherHighestPrice = await auctionModel.findHighestPrice(highestBidder.HighestBidder, req.body.ProductID);
            if (highestPrice >= anotherHighestPrice + stepPrice) {
                presentPrice = anotherHighestPrice + stepPrice;
                await productModel.updateHighestPriceAndBidderAndTurn(req.body.ProductID, presentPrice, req.body.BidderID, turn+1);
                await auctionHistoryModel.add({BidderID: req.body.BidderID, ProductID: req.body.ProductID, CurrentPrice: presentPrice, AuctionTime: req.body.AuctionTime});
                const AllNeededMails = await accountModel.getEmailByBidderID(req.body.BidderID) + ", " + await accountModel.getEmailByBidderID(Seller) + ", " + await accountModel.getEmailByBidderID(highestBidder.HighestBidder);
                // console.log(AllNeededMails);
                await mailingSystem.addPriceSuccess(req.body.BidderID, ProName, AllNeededMails);
            } else {
                presentPrice = highestPrice;
                await productModel.updateHighestPriceAndBidderAndTurn(req.body.ProductID, presentPrice, highestBidder.HighestBidder,turn+1);
                await auctionHistoryModel.add({BidderID: highestBidder.HighestBidder, ProductID: req.body.ProductID, CurrentPrice: presentPrice, AuctionTime: req.body.AuctionTime});
                const AllNeededMails = await accountModel.getEmailByBidderID(req.body.BidderID) + ", " + await accountModel.getEmailByBidderID(Seller) + ", " + await accountModel.getEmailByBidderID(highestBidder.HighestBidder);
                // console.log(AllNeededMails);
                await mailingSystem.addPriceSuccess(req.body.BidderID, ProName, AllNeededMails);
            }
        }
    }

    const url = req.headers.referer || '/';
    res.redirect(url);
})

router.get('/myproducts/add', async function(req, res) {

    res.render('vwProduct/add', {
        layout: "SellerLayout.hbs"
    })
})

router.post('/myproducts/add', async function(req, res) {
    console.log(req.body);
    const url = req.headers.referer || '/';
    req.body.DateExpired=new Date(req.body.DateExpired);
    //req.body.DateExpired.setHours(req.body.DateExpired.getHours()+7);
    req.body.DateUpload=new Date();
    //req.body.DateUpload.setHours(req.body.DateUpload.getHours()+7);
    req.body.PresentPrice=req.body.StartingPrice;
    req.body.Seller =res.locals.user.Username;
    const ret = await myproductModel.add(req.body);
    console.log(req.body);
    res.redirect(url);
})



router.post('/myproducts/byPostingList/editdescription', async function(req, res) {

    const url = req.headers.referer || '/';
    const proID=req.query.id;
    console.log(proID);
    console.log(req.body)
    const product = await productModel.findByID(proID);
    console.log(product.FullDes)

    if (product.FullDes!== null)
        req.body.Description=product.FullDes+req.body.Description;



    await myproductModel.editDescription(proID,req.body.Description);
    res.redirect(url);
})



router.post('/myproducts/add_mainimg', async function(req, res) {
    console.log(req.body);
    const ID= await productModel.findIDMax();
    const url = req.headers.referer || '/';
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './image/products')
        },
        filename: function (req, file, cb) {
            cb(null, ID+"-main.jpg");
        }
    });

    const upload = multer({ storage });
    upload.array('fuMain', 1)(req, res, function (err) {
        console.log(req.body);
        if (err) {
            console.error(err);
        } else {
            res.redirect(url);
        }
    });


})

router.post('/myproducts/add_thumbimg', async function(req, res) {
    console.log(req.body);
    const ID= await productModel.findIDMax();
    const url = req.headers.referer || '/';
    let i=1;
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './image/products')
        },
        filename: function (req, file, cb) {

                cb(null, ID+'-thumb'+i+'.jpg');
                i++;


        }
    });

    const upload = multer({ storage });

    upload.array('fuThumb', 3)(req, res, function (err) {
        console.log(req.body);
        if (err) {
            console.error(err);
        } else {
            res.redirect(url);
        }
    });

})

export default router;