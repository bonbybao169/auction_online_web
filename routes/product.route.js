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
    res.render('vwProduct/index', {
        products: list,
        empty: list.length === 0,
        pageNumbers,
        page
    })
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

    res.render('vwProduct/byCat', {
        products: list,
        empty: list.length === 0,
        pageNumbers,
        page
    });
})

router.post('/search', async function (req, res) {
    const ProName = req.body.Name || 0;

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
    console.log("p:", page);

    console.log("o:", offset);
    // console.log(list);
    res.render('vwProduct/byProName', {
        products: list,
        empty: list.length === 0,
        pageNumbers,
        page
    });
})

function timeDifference(end, start) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = end - start;

    if (elapsed < 0) {
        return 'Sản phẩm hết hạn';
    }
    else if (elapsed < msPerMinute) {
        return Math.round(elapsed/1000) + ' giây nữa';
    }
    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' phút nữa';
    }
    else if (elapsed < msPerDay ) {
        return Math.round(elapsed/msPerHour ) + ' giờ nữa';
    }
    else if (elapsed < msPerMonth) {
        console.log(Math.round(elapsed/msPerDay));
         if (Math.round(elapsed/msPerDay) < 4) {
            return Math.round(elapsed / msPerDay) + ' ngày nữa';
        }
        else {
            return false;
        }
    }

}

router.get('/:id', async function (req, res) {
    const proID = req.params.id || 0;

    const list = await productModel.findByID(proID);

    // console.log(list);

    let date = new Date(list.DateUpload);
    list.DateUpload = date.toLocaleDateString('en-GB');

    if (timeDifference(list.DateExpired, new Date()) !== false) {
        list.DateExpired = timeDifference(list.DateExpired, new Date());
    }
    else {
        date = new Date(list.DateExpired);
        list.DateExpired = date.toLocaleDateString('en-GB');
    }
        
    res.render('vwProduct/detail', {
        layout: false,
        product: list
    });
})

export default router;