const express = require("express");
const router = express.Router();
const Zipcode = require("../models/Zipcode");

router.get("/", async (req, res) => {
  let sido = req.query.sido;
  let gugun = req.query.gugun;
  let dong = req.query.dong;
  let [guguns, dongs, zips] = [null, null, null];

  let sidos = new Zipcode().getSido().then((sido) => sido);
  // console.log(await sidos);

  // 셀렉트의 값이 바뀔때마다 같은 일을 계속 실행함 SSR의 단점~
  // 이런 종류의 페이지를 만들때는 서버에 무리가 감 그러므로 CSR이 적합하다~
  if (sido !== undefined)
    guguns = new Zipcode().getGugun(sido).then((gugun) => gugun);
  // console.log(await guguns);

  if (sido !== undefined && gugun !== undefined)
    dongs = new Zipcode().getDong(sido, gugun).then((dong) => dong);
  // console.log(await dongs);

  if (sido !== undefined && gugun !== undefined && dong !== undefined)
    zips = new Zipcode().getZipcode(sido, gugun, dong).then((zip) => zip);

  res.render("zipcode", {
    title: "시군구동 찾기",
    sidos: await sidos,
    guguns: await guguns,
    dongs: await dongs,
    sido: sido,
    gugun: gugun,
    dong: dong,
    zips: await zips,
  });
});

module.exports = router;
