const express = require("express");
const router = express.Router();
const path = require("path");
const Board = require("../models/Board");

router.get("/list", async (req, res) => {
  let bds = new Board().select().then((bds) => bds);
  // console.log(await bds)
  res.render("board/list", { title: "게시판", bds: await bds }); // 템플릿 페이지에서 {{#bds}} 라고 쓰면됨
});

router.get("/write", (req, res) => {
  res.render("board/write", { title: "글쓰기" });
});
router.post("/write", async (req, res) => {
  let viewName = "/board/failWrite";
  let { title, uid, contents } = req.body;

  let rowcnt = new Board(null, title, uid, null, contents, null)
    .insert()
    .then((result) => result);

  if ((await rowcnt) > 0) viewName = "/board/list";

  res.redirect(302, viewName);
});

router.get("/view", async (req, res) => {
  let bno = req.query.bno;
  let bds = new Board().selectOne(bno).then(async (result) => {
    return result;
  });
  console.log(await bds);

  res.render("board/view", { title: "게시글 상세내용", bds: await bds });
});

module.exports = router;
