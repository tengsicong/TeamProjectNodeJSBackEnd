const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/:name', function (req, res) {
    res.render('users', {name: req.params.name})
})


module.exports = router;
