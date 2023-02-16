const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/list", (req, res) => {
  res.render('board/list', {title: 'list페이지'})
});
router.get("/write", (req, res) => {
  res.render('board/write', {title: 'write페이지'})
});
router.get("/view", (req, res) => {
  res.render('board/view', {title: 'view페이지'})
});

module.exports = router;
