const express = require('express');
const hbs = require('express-handlebars');
const router = express.Router();
const Zipcode = require('../models/Zipcode');

router.get('/', (req, res) => {
    res.render('zipcode', {title: '타이틀'});
})

module.exports = router;