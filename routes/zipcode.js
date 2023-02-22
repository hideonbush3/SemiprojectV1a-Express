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
    zips: await zips,
    sido: sido,
    gugun: gugun,
  });
});

module.exports = router;
