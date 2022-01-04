import express from 'express';
import productModel from "../models/product.model.js";
const router = express.Router();
router.get('/', async function(req, res) {
    res.redirect('/bidder/home');
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
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = date.toLocaleDateString();
    }
    // console.log(list);
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
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = date.toLocaleDateString();
    }
    // console.log(list);
    console.log(pageNumbers);

    res.render('vwProduct/byCat_bidder', {
        layout: "BidderLayout.hbs",
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
        list[i].DateExpired = date.toLocaleDateString();
    }
    console.log("p:",page);

    console.log("o:",offset);
    // console.log(list);
    res.render('vwProduct/byProName_bidder', {
        layout: "BidderLayout.hbs",
        products: list,
        empty: list.length === 0,
        pageNumbers,
        page
    });
})
export default router;