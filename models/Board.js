const oracledb = require("../models/Oracle");
const ppg = 15;

let boardsql = {
  insert:
    "insert into board (bno, title, userid, contents) values (bno.nextval, :1, :2, :3)",

  select:
    "select bno,title,userid,views,to_char(regdate, 'YYYY-MM-DD') regdate from board order by bno desc",

  paging1:
    ` select * from (select bno, title, userid, views, to_char(regdate, 'YYYY-MM-DD') regdate, ` +
    ` row_number() over (order by bno desc) rowno from board `,

  paging2: ` ) bd where rowno >= :1 and rowno < :2 `,

  selectOne:
    "select board.*, to_char(regdate, 'YYYY-MM-DD hh:MI:ss') regdate2 from board where bno = :1",

  selectCount: "select count(bno) cnt from board", // 게시글 총 개수 세기, 페이지네이션할때 필요함

  viewOne: "update board set views = views + 1 where bno = :1",

  update:
    "update board set title = :1, contents = :2, regdate = current_timestamp where bno = :3",

  delete: "delete from board where bno = :1",
};

class Board {
  constructor(bno, title, userid, regdate, contents, views) {
    this.bno = bno;
    this.title = title;
    this.userid = userid;
    this.regdate = regdate;
    this.contents = contents;
    this.views = views;
  }

  // 게시글 저장
  async insert() {
    let conn = null;
    let params = [this.title, this.userid, this.contents];
    let insertcnt = 0;
    try {
      conn = await oracledb.makeConn(); // 연결
      let result = await conn.execute(boardsql.insert, params); // 실행
      await conn.commit(); // 저장
      console.log(result);
      if (result.rowsAffected > 0) insertcnt = result.rowsAffected;
    } catch (e) {
      console.log(e);
    } finally {
      await oracledb.closeConn(conn); // 종료
    }
    return insertcnt;
  }

  // 게시판 목록보기
  async select(stnum) {
    let conn = null;
    let params = [stnum, stnum + ppg];
    let bds = []; // 결과 저장용


    try {
      conn = await oracledb.makeConn();
      let idx = await this.selectCount(); // 총 게시글수 계산
      idx = idx - stnum + 1;

      let result = await conn.execute(
          boardsql.paging1 + boardsql.paging2, params, oracledb.options);
      let rs = result.resultSet;
      let row = null;
      while((row = await rs.getRow())) {
        let bd = new Board(row.BNO, row.TITLE,
            row.USERID, row.REGDATE, null, row.VIEWS);
        bd.idx = idx--; // 글번호 컬럼
        bds.push(bd);
      }
    } catch (e) {
      console.log(e);
    } finally {
      await oracledb.closeConn(conn);
    }
    return bds;
  }

  // 총 게시물 수 계산
  async selectCount() {
    let conn = null;
    let params = [];
    let cnt = -1;   // 결과 저장용

    try {
      conn = await oracledb.makeConn();
      let result = await conn.execute(
          boardsql.selectCount, [], oracledb.options);
      let rs = result.resultSet;
      let row = null;
      if ((row = await rs.getRow())) cnt = row.CNT;
    } catch (e) {
      console.log(e);
    } finally {
      await oracledb.closeConn();
    }

    return cnt;
  }

  // 게시글 상세조회
  async selectOne(bno) {
    let conn = null;
    let params = [bno];
    let bds = [];

    try {
      // 본문글 상세보기
      conn = await oracledb.makeConn();
      let result = await conn.execute(
        boardsql.selectOne,
        params,
        oracledb.options
      );
      let rs = result.resultSet;
      let row = null;
      while ((row = await rs.getRow())) {
        let bd = new Board(
          row.BNO,
          row.TITLE,
          row.USERID,
          row.REGDATE2,
          row.CONTENTS,
          row.VIEWS
        );
        bds.push(bd);

        // 조회수 증가
        await conn.execute(boardsql.viewOne, params);
        await conn.commit();
      }
    } catch (e) {
      console.log(e);
    } finally {
      await oracledb.closeConn(conn);
    }

    return bds;
  }

  // 게시글 수정
  async updete() {
    let conn = null;
    let params = [this.title, this.contents, this.bno];
    let updatecnt = 0;
    try {
      conn = await oracledb.makeConn();
      let result = await conn.execute(boardsql.update, params);
      await conn.commit();
      if (result.rowsAffected > 0) updatecnt = result.rowsAffected;
    } catch (e) {
      console.log(e);
    } finally {
      await oracledb.closeConn(conn);
    }
    return updatecnt;
  }

  // 게시글 삭제
  async delete(bno) {
    let conn = null;
    let params = [bno];
    let deletecnt = 0;

    try {
      conn = await oracledb.makeConn();
      let result = await conn.execute(boardsql.delete, params);
      await conn.commit();
      if (result.rowsAffected > 0) deletecnt = result.rowsAffected;
    } catch (e) {
      console.log(e);
    } finally {
      await oracledb.closeConn(conn);
    }
    return deletecnt;
  }
}

module.exports = Board;
