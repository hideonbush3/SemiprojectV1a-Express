const express = require("express");
const router = express.Router();

router.get("/list", (req, res) => {
  res.render('board/list', {title: '게시판'})
});
router.get("/write", (req, res) => {
  res.render('board/write', {title: '새글쓰기'})
});
router.get("/view", (req, res) => {
  res.render('board/view', {title: '게시판 본문글'})
});

module.exports = router;
