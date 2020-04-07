const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('portal/role_select', {
        pageTitle: 'Team Project - Role Select',
    });
});

module.exports = router;

