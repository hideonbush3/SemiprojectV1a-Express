const express = require("express");
const router = express.Router();
const path = require('path');
const Board = require("../models/Board");

router.get("/list", (req, res) => {
  res.render('board/list', {title: '게시판'})
});

router.get("/write", (req, res) => {
  res.render('board/write', {title: '글쓰기'})
});
router.post("/write", async (req, res) => {
  let viewName = '/board/failWrite';
  let {title, uid, contents} = req.body;

  let rowcnt = new Board(null, title, uid, null, contents, null)
      .insert()
      .then((result) => result);

  if (await rowcnt > 0) viewName = '/board/list';

  res.redirect(302, viewName);
});

router.get("/view", (req, res) => {
  res.render('board/view', {title: '게시판 본문글'})
});

module.exports = router;
