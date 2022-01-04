import categoryModel from "../models/category.model.js";
import express from 'express';

const router = express.Router();

router.get('/', async function(req, res) {
    const list = await categoryModel.findAll();
    res.render('vwCategory/index', {
        categories: list
    })
})

router.get('/add', async function (req, res) {
    const list = await categoryModel.findParentCat();
    res.render('vwCategory/add', {
        categories: list
    })
})

router.post('/add', async function (req, res) {
    if (req.body.ParentID === "null")
        req.body.ParentID = null;
    const ret = await categoryModel.add(req.body);
    console.log(ret);
    // res.render('vwCategory/add');
    res.redirect('/admin/categories');
})

router.get('/edit', async function (req, res) {
    const id = req.query.id || 0;
    const list = await categoryModel.findParentCat();
    const category = await categoryModel.findByID(id);
    if (category === null) {
        return res.redirect('/admin/categories');
    }
    res.render('vwCategory/edit', {
        category,
        categories: list
    });
})

router.post('/del', async function (req, res) {
    const ret = await categoryModel.delete(req.body.CategoryID);
    // console.log(ret);
    res.redirect("/admin/categories");
})

router.post('/patch', async function (req, res) {
    const ret = await categoryModel.patch(req.body);
    // console.log(ret);
    res.redirect("/admin/categories");
})

export default router;