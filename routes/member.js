const express = require("express");
const router = express.Router();
const Member = require("../models/Member");

router.get("/join", (req, res) => {
  res.render("join", { title: "회원가입" });
});
router.post("/join", (req, res, next) => {
  let { uid, pwd, pwd2, name, email } = req.body;

  // 데이터베이스 처리  - member 테이블에 insert
  new Member(uid, pwd, name, email).insert();

  res.redirect(302, "/member/login");
});

router.get("/login", (req, res) => {
  res.render("login", { title: "로그인" });
});
router.post("/login", async (req, res) => {
  // bodyparser 모듈덕에 req.body로 submit된 데이터에 접근 가능
  let { uid, pwd } = req.body;
  let viewName = "/member/loginfail";

  let isLogin = new Member().Login(uid, pwd).then((result) => result);

  // console.log(await isLogin);
  if ((await isLogin) > 0) {
    viewName = "/member/myinfo";
    // 아이디를 세션변수로 등록
    req.session.userid = uid;
  }

  res.redirect(303, viewName);
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect(303, "/");
});

router.get("/myinfo", async (req, res) => {
  // 세션변수 userid가 존재한다면
  if (req.session.userid) {
    let member = new Member().selectOne(req.session.userid)
        .then((mb) => mb);
    res.render("myinfo", { title: "회원정보", mb: await member });
  } else {
    res.redirect(303, "/member/login");
  }
});

module.exports = router;
