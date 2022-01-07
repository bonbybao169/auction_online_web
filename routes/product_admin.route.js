import productModel from "../models/product.model.js";
import express from 'express';

const router = express.Router();

router.get('/', async function (req, res) {
    const page = req.query.page || 1;
    const limit = 6;
    const total = await productModel.countAll();
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

    const list = await productModel.findAll(limit, offset);

    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = date.toLocaleDateString();
    }
    // console.log(list);
    res.render('vwProduct/index_admin', {
        products: list,
        empty: list.length === 0,
        pageNumbers,
        firstPage: +page === 1,
        lastPage: +page === nPages,
        previousPage: +page - 1,
        nextPage: +page + 1,
        layout: 'AdminLayout.hbs'
    })
})

router.get('/edit', async function (req, res) {
    const id = req.query.id || 0;
    const product = await productModel.findByID(id);
    if (product === null) {
        return res.redirect('/admin/products');
    }
    res.render('vwProduct/del', {
        product,
        layout: 'AdminLayout.hbs'
    });
})

router.post('/del', async function (req, res) {
    console.log(req.body);
    const ret = await productModel.delete(req.body.ID);
    // console.log(ret);
    res.redirect("/admin/products");
})

router.get('/byCat/:id', async function (req, res) {
    // const catID = req.query.id || 0;
    const catID = req.params.id || 0;

    const page = req.query.page || 1;
    const limit = 6;
    const total = await productModel.countByCatID(catID);
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

    const list = await productModel.findByCatID(catID, limit, offset);
    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = date.toLocaleDateString();
    }
    // console.log(list);
    console.log(pageNumbers);

    res.render('vwProduct/byCat_admin', {
        products: list,
        empty: list.length === 0,
        pageNumbers,
        firstPage: +page === 1,
        lastPage: +page === nPages,
        previousPage: +page - 1,
        nextPage: +page + 1,
        layout: 'AdminLayout.hbs'
    });
})

router.get('/search', async function (req, res) {
    const ProName = req.query.keyword || 0;

    console.log(req.query.page);
    const page = req.query.page || 1;
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

    const list = await productModel.findByProName(ProName, limit, offset);
    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString();
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = date.toLocaleDateString();
    }
    // console.log(list);
    res.render('vwProduct/byProName_admin', {
        products: list,
        empty: list.length === 0,
        pageNumbers,
        firstPage: +page === 1,
        lastPage: +page === nPages,
        previousPage: +page - 1,
        nextPage: +page + 1,
        ProName,
        layout: 'AdminLayout.hbs'
    });
})

export default router;