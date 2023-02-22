// 클라이언트 사이드 렌더링은 SSR에 비해 코드가 간단함
const express = require("express");
const router = express.Router();
const Zipcode = require("../models/Zipcode");

router.get("/", async (req, res) => {
  res.render('zipcode2', {title: '시구군동 찾기 v2'});
});
router.get("/sido", async (req, res) => {
  let sidos = new Zipcode().getSido().then((sido) => sido);

  res.send(JSON.stringify(await sidos));  // 조회결과를 JSON 형식으로 전송
});

router.get("/gugun/:sido", async (req, res) => {
  // url로 요청한 sido값을 가져옴
  let sido = req.params.sido;
  // Zipcode 클래스의 새로운 객체를 만들고 클래스 내 포함된 getGugun 함수에
  // sido값을 파라미터로 넣어서 실행하고 그 결과를 guguns 변수에 저장
  let guguns = new Zipcode().getGugun(sido).then((gugun) => gugun);

  // guguns 변수에 저장된 select 조회결과를 JSON 문자열 형식으로 바꾸고 요청주소로 보내줌
  res.send(JSON.stringify(await guguns));
});

module.exports = router;
