import accountModel from "../models/account.model.js";
import express from 'express';

const router = express.Router();

router.get('/', async function(req, res) {
    const list = await accountModel.findAll();
    res.render('vwAccount/index_admin', {
        accounts: list
    })
})

router.get('/add', async function (req, res) {
    res.render('vwAccount/add');
})

router.post('/add', async function (req, res) {
    const ret = await accountModel.add(req.body);
    console.log(ret);
    res.redirect('/admin/accounts')
})

// router.get('/edit', async function (req, res) {
//     const id = req.query.id || 0;
//     const list = await accountModel.findParentCat();
//     const category = await accountModel.findByID(id);
//     if (category === null) {
//         return res.redirect('/admin/categories');
//     }
//     res.render('vwCategory/edit', {
//         category,
//         accounts: list
//     });
// })
//
// router.post('/del', async function (req, res) {
//     const ret = await accountModel.delete(req.body.CategoryID);
//     // console.log(ret);
//     res.redirect("/admin/categories");
// })
//
// router.post('/patch', async function (req, res) {
//     const ret = await accountModel.patch(req.body);
//     // console.log(ret);
//     res.redirect("/admin/categories");
// })

export default router;