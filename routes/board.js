const express = require("express");
const router = express.Router();
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

// list.hbs의 앵커태그를 클릭하면 URL 뒤에 쿼리 스트링이 붙은 GET
// 요청이 서버에 전달되어 해당 요청에 대한 처리가 이루어지게 됨
router.get("/view", async (req, res) => {
  // req.query는 URL의 쿼리 파라미터를 담고 있는 객체
  // req.query.bno은 GET 요청으로 전달된 bno라는 이름의
  // 쿼리 파라미터 값을 가져오는 것임
  let bno = req.query.bno;
  // 그 값을 가지고 selectOne()메소드를 호출해 게시글의 상세 내용을 가져옴
  let bds = new Board().selectOne(bno).then(async (result) => result);
  console.log(await bds);
  // 상세내용을 이용해서 board/view 뷰 템플릿을 렌더링해서 클라이언트에 응답
  res.render("board/view", { title: "게시글 상세내용", bds: await bds });
});
// router.get("/update", async (req, res) => {
//   let bds = new Board().select().then((bds) => bds);
//   // console.log(await bds)
//   res.render("board/list", { title: "게시판", bds: await bds }); // 템플릿 페이지에서 {{#bds}} 라고 쓰면됨
// });

module.exports = router;
