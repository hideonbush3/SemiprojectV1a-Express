const express = require("express");
const router = express.Router();
const Board = require("../models/Board");
const ppg = 15;

// 페이징 기능 지원
// 현재 페이지를 의미하는 변수 : cpg
// 현재 페이지에 해당하는 게시물들을 조회하려면 해당범위의 시작값과 종료값 계산
// cpg : 1 => 1 ~ 5
// cpg : 2 => 6 ~ 10
// cpg : 3 => 11 ~ 15
// 페이지당 게시물 수 ppg : number
// stnum : (cpg - 1) * ppg + 1
// ednum : stnum + ppg

router.get('/list', async (req, res) => {
  let { cpg } = req.query;
  cpg = cpg ? cpg : 1;
  let stnum = (cpg - 1) * ppg + 1; // 지정한 페이지의 첫번째 글번호 계산
  let stpgn = parseInt((cpg - 1) / 10) * 10 + 1; // 페이지네이션 시작값 계산

  // 페이지네이션 블럭 생성
  let stpgns = [];
  for (let i = stpgn; i < stpgn + 10; ++i){
    let iscpg = (i == cpg) ? true : false;  // 현재페이지 표시
    let pgn = { 'num': i, 'iscpg': iscpg };
    stpgns.push(pgn);
  }
  let alpg = new Board().selectCount().then((cnt) => cnt);  // 총 게시물 수

  let isprev = (cpg - 1 > 0) ? true: false;
  let isnext = (cpg < alpg) ? true: false;
  let pgn = {'prev': stpgn - 1, 'next': stpgn + 9 + 1,
    'isprev': isprev, 'isnext': isnext};

  let bds = new Board().select(stnum).then((bds) => bds);
  console.log(cpg, stnum, stpgn);

  res.render("board/list", {
    title: "게시판",
    bds: await bds, // 템플릿 페이지에서 {{#bds}} 라고 쓰면됨
    stpgns: stpgns,
    pgn: pgn,
  });
});

router.get("/write", (req, res) => {
  if (!req.session.userid) {
    res.redirect(303, "/member/login");
  } else res.render("board/write", { title: "글쓰기" });
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

// 게시글 삭제
router.get("/delete", async (req, res) => {
  let { bno, uid } = req.query;
  let suid = req.session.userid;

  // 글 작성자 id와 삭제하는자의 id가 일치하는 경우
  // 외부에서 접근막기 위함
  if (suid && uid && suid == uid) {
    new Board().delete(bno).then((cnt) => cnt);
  }
  res.redirect(303, "/board/list");
});

// 게시글 수정
router.get("/update", async (req, res) => {
  let { bno, uid } = req.query;
  let suid = req.session.userid;

  if (uid && suid && uid == suid) {
    let bds = new Board().selectOne(bno).then((bds) => bds);
    res.render("board/update", { title: "게시글 수정", bds: await bds });
  } else {
    res.redirect(303, "board/list");
  }
});
router.post("/update", async (req, res) => {
  let { title, uid, contents } = req.body;
  let bno = req.query.bno;
  let suid = req.session.userid;

  if (uid && suid && uid == suid) {
    new Board(bno, title, uid, 0, contents, 0).updete(bno).then((cnt) => cnt);
    res.redirect(303, `/board/view?bno=${bno}`);
  } else res.redirect(303, "/board/list");
});

module.exports = router;
