import productModel from "../models/product.model.js";
import express from 'express';

const router = express.Router();

router.get('/', async function(req, res) {
    const list = await productModel.findAll();

    for (let i = 0; i < list.length; i++) {
        let date1 = new Date(list[i].DateUpload);
        list[i].DateUpload = date1.toLocaleDateString();
        let date2 = new Date(list[i].DateExpired);
        list[i].DateExpired = productModel.distance(date2);
    }
    console.log(list);
    res.render('vwProduct/index_bidder', {
        products: list
    })
})

router.get('/byCat/:id', async function (req, res) {
    // const catID = req.query.id || 0;
    const catID = req.params.id || 0;
    const list = await productModel.findByCatID(catID);
    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        let date2 = new Date(list[i].DateExpired);
        list[i].DateExpired = productModel.distance(date2);
    }
    // console.log(list);
    res.render('vwProduct/byCat_bidder', {
        products: list,
        empty: list.length === 0
    });
})

router.post('/search', async function (req, res) {
    const ProName = req.body.Name || 0;
    const list = await productModel.findByProName(ProName);
    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        let date2 = new Date(list[i].DateExpired);
        list[i].DateExpired = productModel.distance(date2);
    }
    console.log(list);
    res.render('vwProduct/byProName_bidder', {
        products: list,
        empty: list.length === 0
    });
})

export default router;