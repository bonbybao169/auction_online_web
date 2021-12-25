import categoryModel from "../models/category.model.js";
import express from 'express';

const router = express.Router();

router.get('/', async function(req, res) {
    const list = await categoryModel.findAll();
    res.render('vwCategory/index', {
        categories: list
    })
})

router.get('/add', function (req, res) {
    res.render('vwCategory/add');
})

router.post('/add', async function (req, res) {
    const ret = await categoryModel.add(req.body);
    console.log(ret);
    res.render('vwCategory/add');
})

router.get('/edit', async function (req, res) {
    const id = req.query.id || 0;
    const category = await categoryModel.findByID(id);
    if (category === null) {
        return res.redirect('/admin/categories');
    }
    res.render('vwCategory/edit', {
        category
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