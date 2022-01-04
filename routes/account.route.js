import express from 'express';
import userModel from '../models/auth.model.js';

const router = express.Router();

router.post('/logout', async function (req, res) {
    req.session.auth = false;
    req.session.authUser = null;

    //const url = req.headers.referer || '/';
    //res.redirect(url);
});
