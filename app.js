// express 모듈과 기타 미들웨어 모듈 사용 선언
const express = require('express');
const path = require('path')
const logger = require('morgan');

// 라우팅 모듈 설정
const indexRouter = require('./routes/index');
const memberRouter = require('./routes/member');
const boardRouter = require('./routes/board');

// 포트변수 선언 및 express 객체 생성
const port = process.env.PORT || 3000;
const app = express();

// 라우팅 없이 바로 호출 가능하도록 static 폴더 설정
app.use(express.static(path.join(__dirname, 'static')));

app.use(logger('dev'));

// 라우팅 모듈 등록 - 클라이언트 요청 처리 핵심 파트
app.use('/', indexRouter);
app.use('/member', memberRouter);
app.use('/board', boardRouter);

// 404, 500 응답코드 라우팅 처리 정의
app.use((req, res) => {
    res.status(404);
    res.send('404-페이자가 없음');
});
app.use((err, req, res, next)=>{
    res.status(500);
    res.send('500-서버내부오류');
})

// 위에서 설정한 사항을 토대로 express 서버 실행
app.listen(port, () => {
    console.log('서버가 시작됐습니다. 중지하려면 ctrl + c');
})
