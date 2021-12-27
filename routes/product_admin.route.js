import productModel from "../models/product.model.js";
import express from 'express';

const router = express.Router();

router.get('/', async function(req, res) {
    const list = await productModel.findAll();
    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = date.toLocaleDateString();
    }
    res.render('vwProduct/index_admin', {
        products: list
    })
})

router.get('/edit', async function (req, res) {
    const id = req.query.id || 0;
    const product = await productModel.findByID(id);
    if (product === null) {
        return res.redirect('/admin/products');
    }
    res.render('vwProduct/del', {
        product
    });
})

router.post('/del', async function (req, res) {
    console.log(req.body);
    const ret = await productModel.delete(req.body.ID);
    // console.log(ret);
    res.redirect("/admin/products");
})

export default router;