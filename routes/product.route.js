import productModel from "../models/product.model.js";
import accountModel from "../models/account.model.js";
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
        list[i].DateUpload = date.toLocaleDateString('en-GB');
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = date.toLocaleDateString('en-GB');
    }
    // console.log(list);
    res.render('vwProduct/index', {
        products: list,
        empty: list.length === 0,
        pageNumbers,
        firstPage: +page === 1,
        lastPage: +page === nPages,
        previousPage: +page - 1,
        nextPage: +page + 1,
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
        list[i].DateUpload = date.toLocaleDateString('en-GB');
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = date.toLocaleDateString('en-GB');
    }
    // console.log(list);
    console.log(pageNumbers);

    res.render('vwProduct/byCat', {
        products: list,
        empty: list.length === 0,
        pageNumbers,
        firstPage: +page === 1,
        lastPage: +page === nPages,
        previousPage: +page - 1,
        nextPage: +page + 1
    });
})

router.get('/search', async function (req, res) {
    const ProName = req.query.keyword || 0;
    const page = req.query.page || 1;
    const DateExpiredDescend = req.query.DateExpiredDescend || 0;
    const PriceAscend = req.query.PriceAscend || 0;

    // Ph??n trang
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

    // Ki???m tra s???n ph???m m???i up l??n d?????i 31 ph??t
    for (let i = 0; i < list.length; i++) {
        if (productModel.timeDifferenceUnder31Min(new Date(), list[i].DateUpload)) {
            list[i].UploadRecently = true;
        } else {
            list[i].UploadRecently = false;
        }
    }

    // Chuy???n ?????nh d???ng ng??y ????? in ra
    for (let i = 0; i < list.length; i++) {
        let date = new Date(list[i].DateUpload);
        list[i].DateUpload = date.toLocaleDateString('en-GB');
        date = new Date(list[i].DateExpired);
        list[i].DateExpired = productModel.timeDifference2(list[i].DateExpired, new Date());
    }

    // console.log(list);
    res.render('vwProduct/byProName', {
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

function timeDifference(end, start) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = end - start;

    if (elapsed < 0) {
        return 'S???n ph???m h???t h???n';
    }
    else if (elapsed < msPerMinute) {
        return Math.round(elapsed/1000) + ' gi??y n???a';
    }
    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' ph??t n???a';
    }
    else if (elapsed < msPerDay ) {
        return Math.round(elapsed/msPerHour ) + ' gi??? n???a';
    }
    else if (elapsed < msPerMonth) {
        console.log(Math.round(elapsed/msPerDay));
         if (Math.round(elapsed/msPerDay) < 4) {
            return Math.round(elapsed / msPerDay) + ' ng??y n???a';
        }
        else {
            return false;
        }
    }
}

router.get('/:id', async function (req, res) {
    const proID = req.params.id || 0;

    const product = await productModel.findByID(proID);
    const list = await productModel.findByCatIDExceptProID(product.ID, product.Category, 5);

    // console.log(list);
    product.SellerRate = Math.floor(await accountModel.RateofSb(product.Seller) * 10 );
    product.BidderRate = Math.floor(await accountModel.RateofSb(product.HighestBidder) * 10);

    let date = new Date(product.DateUpload);
    product.DateUpload = date.toLocaleDateString('en-GB');

    if (timeDifference(product.DateExpired, new Date()) !== false) {
        product.DateExpired = timeDifference(product.DateExpired, new Date());
    }
    else {
        date = new Date(product.DateExpired);
        product.DateExpired = date.toLocaleDateString('en-GB');
    }
        
    res.render('vwProduct/detail', {
        layout: false,
        product,
        sameproducts: list,
        noBidder: product.HighestBidder === null
    });
})

export default router;