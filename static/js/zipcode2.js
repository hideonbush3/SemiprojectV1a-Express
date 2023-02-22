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

const setSido = (sidos) => {
  let objs = JSON.parse(sidos); // 문자열 sidos를 파싱해서 객체로 바꿈

  objs.forEach((obj, idx) => {
    // forEach 함수가 objs 객체에 있는 값들을 하나씩 순회하면서 값과 인덱스를 가져옴 그 값을 파라미터로 갖는 콜백함수 실행
    makeopt(sido, obj.sido); // makeopt 함수에 obj의 sido값 중 첫번째 값을 파라미터로 넣어줌
  });
};

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
