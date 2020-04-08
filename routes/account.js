const express = require('express');
const session = require('express-session');
const router = express.Router();
const mongoose = require('mongoose');
const clientModel = require('../models/client');
const studentModel = require('../models/student');
const staffModel = require('../models/staff');

router.get('/forgot_password', function(req, res) {
    //console.log(req.session);
    res.render('portal/forgot_password', {
        pageTitle: 'Forgot Password',
    });
});

router.get('/reset_password', function(req, res) {
    if(req.session.role !== undefined) {
        //console.log(req.session);
        res.render('portal/reset_password', {
            pageTitle: 'Reset Password',
        });
    } else {
        res.redirect('/role_select');
    }
});

module.exports = router;
