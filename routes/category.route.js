import categoryModel from "../models/category.model.js";
import express from 'express';

const router = express.Router();

router.get('/', async function(req, res) {
    const list = await categoryModel.findAll();
    res.render('vwCategory/index', {
        categories: list
    })
})

export default router;