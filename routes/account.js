const express = require('express');
const session = require('express-session');
const router = express.Router();
const mongoose = require('mongoose');
const clientModel = require('../models/client');
const studentModel = require('../models/student');
const staffModel = require('../models/staff');
const adminModel = require('../models/admin');

router.get('/forgot_password', function(req, res) {
    //console.log(req.session);
    const routePromise = adminModel.getAllAdmin();
    routePromise.then(function(result) {
        const admins = result;

        res.render('portal/forgot_password', {
            pageTitle: 'Forgot Password',
            admins: admins,
        });
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
