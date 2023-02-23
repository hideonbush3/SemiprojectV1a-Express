// setSidos() 메소드의 objs 배열객체내에 들어있는 객체가 forEach() 메소드에
// 순서대로 하나씩 들어갈때마다 makeopt() 메소드가 호출되면서 option 태그가 하나씩 생성되면서
// 마지막 객체까지 처리되면 한싸이클 끝~!
const makeopt = (elm, text) => {
  let opt = document.createElement("option");
  let txt = document.createTextNode(text);
  opt.appendChild(txt);
  elm.appendChild(opt);
};

const makeAddr = (elm, text) => {
  let p = document.createElement("p");
  let txt = document.createTextNode(text);
  p.appendChild(txt);
  elm.appendChild(p);
};

// 아래의 getSido가 보내준 select 결과값의 문자열을 sidos라는 매개변수로 받음
const setSido = (sidos) => {
  // console.log(sidos);   // [{"sido":"강원"}, , , ]  getSido에서 JSON 문자열을 문자열로 변환한 모습
  let objs = JSON.parse(sidos); // 문자열 sidos를 파싱해서 객체로 바꿈
  // console.log(objs);  // [{sido: '강원'}, , , ]  파싱하면 이렇게 배열객체 형태로 바뀜

  // forEach 함수가 objs 배열객체에 있는 객체들을 하나씩 가져옴 그 객체와 인덱스를 파라미터로 갖는 콜백함수 실행(인덱스는 빼도 상관없음)
  objs.forEach((obj, idx) => {
    makeopt(sido, obj.sido); // makeopt() 메소드에 선택자로 가져온 셀렉트 태그와 첫번째로 들어온 객체 obj의 sido 값을 파라미터로 넣어줌
  });
};

// 맨 처음 시작은 얘임
// routes/zipcode2는 처음에 http://localhost:3000/zipcode2 페이지를 렌더링하기만 함
// 얘가 zipcode2 라우터의 sido 경로에 GET 요청을함
// routes/zipcode2의 '/sido' path를 맡는애가 Zipcode 객체를 생성하고
// select 함수를 실행해서 받아온 프라미스 객체를 JSON 문자열로 변환해서 보내주면
// 여기서 비동기처리를 위해 사용한 then() 메서드가 response 라는 매개변수로 받고
// 그 값을 문자열 형태로 가져온 다음 그 값을 setSido() 메서드의 매개변수로 보내주는 것임
// 서버에 시도 데이터 요청
const getSido = () => {
  fetch("zipcode2/sido")
    .then((response) => response.text())
    .then((text) => setSido(text));
};

const setGugun = (guguns) => {
  let objs = JSON.parse(guguns);

  while (gugun.lastChild) {
    gugun.removeChild(gugun.lastChild);
  }
  makeopt(gugun, "--- 시군구 ---");
  objs.forEach((obj, idx) => {
    makeopt(gugun, obj.gugun);
  });
};

const getGugun = () => {
  fetch(`zipcode2/gugun/${sido.value}`)
    .then((response) => response.text())
    .then((text) => setGugun(text));
};

const setDong = (dongs) => {
  let objs = JSON.parse(dongs);

  while (dong.lastChild) {
    dong.removeChild(dong.lastChild);
  }
  makeopt(dong, "--- 읍면동 ---");
  objs.forEach((obj, idx) => {
    makeopt(dong, obj.dong);
  });
};

const getDong = () => {
  fetch(`zipcode2/dong/${sido.value}/${gugun.value}`)
    .then((response) => response.text())
    .then((text) => setDong(text));
};

const setZipcode = (zips) => {
  let objs = JSON.parse(zips);

  while (zipcode.lastChild) {
    zipcode.removeChild(zipcode.lastChild);
  }

  objs.forEach((obj, idx) => {
    let addr =
      `${obj.zipcode} ${obj.sido} ${obj.gugun}` +
      `${obj.dong} ${obj.ri} ${obj.bunji}`;
    makeAddr(zipcode, addr);
  });
};

const getZipcode = () => {
  fetch(`zipcode2/zipcode/${sido.value}/${gugun.value}/${dong.value}`)
    .then((response) => response.text())
    .then((text) => setZipcode(text));
};

let sido = document.querySelector("#sido");
let gugun = document.querySelector("#gugun");
let dong = document.querySelector("#dong");
let zipcode = document.querySelector("#zipcode");
sido.addEventListener("change", getGugun);
gugun.addEventListener("change", getDong);
dong.addEventListener("change", getZipcode);

getSido();
