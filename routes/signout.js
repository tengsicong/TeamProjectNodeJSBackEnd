const express = require('express');
const session = require('express-session');
const router = express.Router();
const mongoose = require('mongoose');
const clientModel = require('../models/client');
const studentModel = require('../models/student');
const staffModel = require('../models/staff');

router.get('/', function(req, res) {
    req.session.cookie.maxAge = 0;
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        }
    });

    //console.log(req.session);
    res.render('portal/signout', {
        pageTitle: 'Team Project - Signout',
    });
});

module.exports = router;
