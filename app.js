// express 모듈과 기타 미들웨어 모듈 사용 선언
const express = require("express");
const path = require("path");
const logger = require("morgan");
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const oracledb = require("./models/Oracle");

// 라우팅 모듈 설정
const indexRouter = require("./routes/index");
const memberRouter = require("./routes/member");
const boardRouter = require("./routes/board");
const zipcodeRouter = require("./routes/zipcode");    // SSR
const zipcode2Router = require("./routes/zipcode2");  // CSR

// express 객체 생성 및 포트 변수 선언
const app = express();
const port = process.env.PORT || 3000;

// 템플릿 엔진 등록
// 첫번째 인자는 템플릿 엔진의 이름
// 두번째 인자는 handlebars 구성하는 옵션을 포함하는 함수
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "layout",
    helpers: require('./helpers/handlebars-helper'),
  })
);

// 렌더링할 view 파일들의 위치로 'views' 폴더를 지정
app.set("views", path.join(__dirname, "views"));

// Handlebars 라는 view engine을 사용한다는 것을 의미
// 위에서 app.engine() 메서드를 사용해서 hbs라는
// 이름으로 Handlebars engine을 등록했기 때문
// 즉, app.engine 에서는 엔진을 등록하고 여기선 사용한다고 선언하는 것
app.set("view engine", "hbs");

// 세션
// 세션 유효시간 30초
const maxAge = 1000 * 30;
// 세션 구성을 위한 옵셥들을 담은 객체
const sessionObj = {
  // 세션이 변경되지 않았을 때 세션을 다시 저장하지 않는다
  resave: false,
  // 초기화되지 않은 세션을 저장하지 않는다
  saveUninitialized: false,
  // secret 세션 ID를 암호화하는데 사용되는 비밀 키
  secret: "process.env.COOKIE_SECRET",
  // httpOnly는 클라이언트 측에서 쿠키에 접근할 수 없도록 하는 설정
  // secure는 HTTPS 프로토콜을 사용하지 않는 경우에도 쿠키를 전송할 수 있도록 하는 설정
  cookie: { httpOnly: true, secure: false },
  // 세션 쿠키의 이름을 설정
  name: "session-cookie",
  // 세션의 유효 시간을 설정
  maxAge: maxAge,
};
// 세션 구성을 위한 sessionOBJ 객체를 인자로 받아 session 미들웨어 등록
app.use(session(sessionObj));

app.use(express.static(path.join(__dirname, "static")));

app.use(logger("dev"));

// 미들웨어 등록 및 설정
app.use(express.json());
// 전송된 폼 데이터에 대한 urlencoding 설정
app.use(express.urlencoded({ extended: false }));
// 전송된 폼 데이터는 json 형식
app.use(bodyParser.json());
// app.use(bodyParser.text()) // enctype이 text/plain 일때 필요 (비추)

// 서버가 시작될때 한번만 오라클 instant client 초기화
oracledb.initConn();

// 생성한 세션을 모든 페이지에서 접근 가능하게 함
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

// 라우팅 모듈 등록 - 클라이언트 요청 처리 핵심 파트
app.use("/", indexRouter);
app.use("/member", memberRouter);
app.use("/board", boardRouter);
app.use("/zipcode", zipcodeRouter);
app.use("/zipcode2", zipcode2Router);

// 404, 500 응답코드 라우팅 처리 정의
app.use((req, res) => {
  res.status(404);
  res.send("404-페이지가 없음");
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500);
  res.send("500-서버 내부 오류발생");
});

// 위에서 설정한 사항을 토대로 express 서버 실행
app.listen(port, () => {
  console.log("서버가 시작됐습니다. 중지하려면 ctrl + c");
});
