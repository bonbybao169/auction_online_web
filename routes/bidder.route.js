import express from 'express';
import productModel from "../models/product.model.js";
import accountModel from "../models/account.model.js";
import auctionhistoryModel from "../models/auctionhistory.model.js";
import auctionModel from "../models/auction.model.js";
import auctionHistoryModel from "../models/auctionhistory.model.js";
import mailingSystem from '../mailing_system/mailing.js';
const router = express.Router();

router.get('/', async function(req, res) {
    res.redirect('/bidder/home');
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

    res.render('homes/BidderHome', {
        layout: "BidderLayout.hbs",
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
    res.render('vwProduct/index_bidder', {
        layout: "BidderLayout.hbs",
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

    res.render('vwProduct/byCat_bidder', {
        layout: "BidderLayout.hbs",
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
    res.render('vwProduct/byProName_bidder', {
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
    res.render('vwProduct/byWatchList', {
        layout: "BidderLayout.hbs",
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
    res.render('vwProduct/byWinningList', {
        layout: "BidderLayout.hbs",
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
    res.render('vwProduct/byAuctionList', {
        layout: "BidderLayout.hbs",
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
    res.render('vwProduct/detail_bidder.hbs', {
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
            presentPrice = presentPrice + stepPrice;
            console.log(presentPrice);
            await productModel.updateHighestPriceAndBidderAndTurn(req.body.ProductID, presentPrice, req.body.BidderID,turn+1);
            await auctionHistoryModel.add({BidderID: req.body.BidderID, ProductID: req.body.ProductID, CurrentPrice: presentPrice, AuctionTime: req.body.AuctionTime});
            const AllNeededMails = await accountModel.getEmailByBidderID(req.body.BidderID) + ", " + await accountModel.getEmailByBidderID(Seller);
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

export default router;