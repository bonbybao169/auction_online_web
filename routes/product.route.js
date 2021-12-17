import productModel from "../models/product.model.js";
import express from 'express';

const router = express.Router();

router.get('/', async function(req, res) {
    const list = await productModel.findAll();
    res.render('vwProduct/index', {
        products: list
    })
})

export default router;