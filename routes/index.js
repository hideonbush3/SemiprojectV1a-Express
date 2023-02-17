const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render('index', {title: '홈'})
});

module.exports = router;
