import express from 'express';

import productModel from "../models/product.model.js";
import accountModel from "../models/account.model.js";
import auctionhistoryModel from "../models/auctionhistory.model.js";
import auctionModel from "../models/auction.model.js";
const router = express.Router();
router.get('/', async function(req, res) {
    res.redirect('/seller/home');
})
router.get('/home', async function(req, res) {
    const listEE = await productModel.findFiveEarlyExpired();
    const listHP = await productModel.findFiveHighestPrice();
    const listHT = await productModel.findFiveHighestTurn();
    for (let i = 0; i < listEE.length; i++) {
        let date1 = new Date(listEE[i].DateUpload);
        listEE[i].DateUpload = date1.toLocaleDateString();
        let date2 = new Date(listEE[i].DateExpired);
        listEE[i].DateExpired = productModel.distance(date2);
    }
    for (let i = 0; i < listHP.length; i++) {
        let date1 = new Date(listHP[i].DateUpload);
        listHP[i].DateUpload = date1.toLocaleDateString();
        let date2 = new Date(listHP[i].DateExpired);
        listHP[i].DateExpired = productModel.distance(date2);
    }
    for (let i = 0; i < listHT.length; i++) {
        let date1 = new Date(listHT[i].DateUpload);
        listHT[i].DateUpload = date1.toLocaleDateString();
        let date2 = new Date(listHT[i].DateExpired);
        listHT[i].DateExpired = productModel.distance(date2);
    }
    // console.log(list);
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
    res.render('vwProduct/index_seller', {
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

    if (productModel.timeDifference(product.DateExpired, new Date()) !== false) {
        product.DateExpired = productModel.timeDifference(product.DateExpired, new Date());
    }
    else {
        date = new Date(product.DateExpired);
        product.DateExpired = date.toLocaleDateString('en-GB');
    }

    const auctionhistory = await auctionhistoryModel.findByID(product.ID);
    for(let i=0;i<auctionhistory.length;i++){
        date = new Date(auctionhistory[i].AuctionTime);
        auctionhistory[i].AuctionTime = date.toLocaleString('en-GB');
        const words = auctionhistory[i].Name.split(' ');
        auctionhistory[i].Name="****"+words[words.length-1];
    }

    var user = await auctionModel.find(res.locals.user.Username, product.ID);
    if(typeof (user) ==="undefined"){
        user = {};
        user.HighestPrice=null;
    }else{
        user.AuctionTime = new Date(user.AuctionTime).toLocaleString('en-GB');
    }

    user.isEligibled = false;
    if((await accountModel.RateofSb(res.locals.user.Username))>=0.8||(product.BidderRate==0&&(await accountModel.RateofSb(res.locals.user.Username))==false)){
        user.isEligibled=true;
    }
    console.log(user.isEligibled);
    res.render('vwProduct/detail_posting_seller', {
        layout: false,
        product,
        sameproducts: list,
        auctionhistory,
        noBidder: product.HighestBidder === null
    });
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

    res.render('vwProduct/byCat_bidder', {
        layout: "SellerLayout.hbs",
        products: list,
        empty: list.length === 0,
        pageNumbers,
        page
    });
})

router.post('/products/search', async function (req, res) {
    const ProName = req.body.Name || 0;

    const page = req.query.page || 1;
    const limit = 6;
    const total = await productModel.countByProName(ProName);
    // console.log(total);
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

    const list = await productModel.findByProName(ProName, limit, offset);
    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = productModel.distance(date);
    }
    console.log("p:",page);

    console.log("o:",offset);
    // console.log(list);
    res.render('vwProduct/byProName_bidder', {
        layout: "SellerLayout.hbs",
        products: list,
        empty: list.length === 0,
        pageNumbers,
        page
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
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = productModel.distance(date);
    }
    // console.log(list);
    res.render('vwProduct/byWatchList', {
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
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = productModel.distance(date);
    }
    // console.log(list);
    res.render('vwProduct/byWinningList', {
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
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = productModel.distance(date);
    }
    // console.log(list);
    res.render('vwProduct/byWinningList', {
        layout: "SellerLayout.hbs",
        products: list,
        pageNumbers,
        empty: list.length === 0,
        page
    })
})
export default router;