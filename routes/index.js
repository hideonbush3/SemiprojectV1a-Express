const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.render('index', {title: 'index페이지'})
});

module.exports = router;
