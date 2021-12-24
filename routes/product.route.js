import productModel from "../models/product.model.js";
import express from 'express';

const router = express.Router();

router.get('/', async function(req, res) {
    const list = await productModel.findAll();
    res.render('vwProduct/index', {
        products: list
    })
})

router.get('/byCat/:id', async function (req, res) {
    // const catID = req.query.id || 0;
    const catID = req.params.id || 0;
    const list = await productModel.findByCatID(catID);
    // console.log(list);
    res.render('vwProduct/byCat', {
        products: list,
        empty: list.length === 0
    });
})

export default router;