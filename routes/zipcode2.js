// CCR은 SSR에 비해 코드가 간단함
const express = require("express");
const router = express.Router();
const Zipcode = require("../models/Zipcode");

router.get("/", async (req, res) => {
  res.render('zipcode2', {title: '시구군동 찾기 v2'});
});
router.get("/sido", async (req, res) => {
  let sidos = new Zipcode().getSido().then((sido) => sido);

  res.send(JSON.stringify(await sidos));  // 조회결과를 JSON 문자열 형태로 전송
});

// path variable
// REST API에서 사용하는 방식으로 경로를 변수처럼 사용하는 기법
// express 프레임워크에서 /:변수명 형식으로 사용하고
// 변수의 값을 가져오려면 req.params.변수명
router.get("/gugun/:sido", async (req, res) => {
  // url로 요청한 sido값을 가져옴
  let sido = req.params.sido;
  // Zipcode 클래스의 새로운 객체를 만들고 클래스 내 포함된 getGugun 함수에
  // sido값을 파라미터로 넣어서 실행하고 그 결과를 guguns 변수에 저장
  let guguns = new Zipcode().getGugun(sido).then((gugun) => gugun);

  // guguns 변수에 저장된 select 조회결과를 JSON 문자열로 변환한 후 HTTP 응답으로 클라이언트에게 보냄
  res.send(JSON.stringify(await guguns));
});

router.get("/dong/:sido/:gugun", async (req, res) => {
  let sido = req.params.sido;
  let gugun = req.params.gugun;
  let dongs = new Zipcode().getDong(sido, gugun).then((dong) => dong);

  res.send(JSON.stringify(await dongs));
});

router.get("/zipcode/:sido/:gugun/:dong", async (req, res) => {
  let sido = req.params.sido;
  let gugun = req.params.gugun;
  let dong = req.params.dong;
  let zips = new Zipcode().getZipcode(sido, gugun, dong).then((zip) => zip);

  res.send(JSON.stringify(await zips));
});

module.exports = router;
