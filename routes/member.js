const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const Board = require("../models/Board");

router.get("/join", (req, res) => {
  res.render('join', {title: '회원가입'})
});
router.post("/join", (req, res, next) => {

  let { userid, passwd, name, email } = req.body;
  console.log(userid, passwd, name, email);

  // 데이터베이스 처리  - member 테이블에 insert
  new Member(userid, passwd, name, email).insert();

  res.redirect(302, "/member/login");
});


router.get("/login", (req, res) => {
  res.render('login', {title: '로그인'})
});
router.post("/login", async (req, res) => {
  let {uid, pwd} = req.body;
  let viewName = '/member/loginfail';

  let isLogin = new Member()
      .Login(uid, pwd)
      .then((result) => result);

  // console.log(await isLogin);
  if( await isLogin > 0) {
    viewName = '/member/myinfo';
    // 아이디를 세션변수로 등록
    req.session.userid = uid;
  }

  res.redirect(303, viewName)
});
router.get("/logout", (req, res) => {
  req.session.destroy(() => req.session);

  res.redirect(303, '/');
});


router.get("/myinfo", (req, res) => {
  res.render('myinfo', {title: '회원정보'})
});


module.exports = router;
