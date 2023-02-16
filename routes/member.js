const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/join", (req, res) => {
  res.render('join', {title: 'join페이지'})
});

router.get("/login", (req, res) => {
  res.render('login', {title: 'login페이지'})
});
router.get("/myinfo", (req, res) => {
  res.render('myinfo', {title: 'myinfo페이지'})
});

module.exports = router;
