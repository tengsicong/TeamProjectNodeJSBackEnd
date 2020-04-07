const express = require('express');
const session = require('express-session');
const router = express.Router();
const mongoose = require('mongoose');
const clientModel = require('../models/client');

router.get('/', function(req, res) {
    res.render('portal/signup', {
        pageTitle: 'Team Project - Signup',
    });
});

module.exports = router;