const oracledb = require("../models/Oracle");

let boardsql = {
  insert:
    "insert into board (bno, title, userid, contents) values (bno.nextval, :1, :2, :3)",
  select:
    "select bno,title,userid,to_char(regdate, 'YYYY-MM-DD') regdate,views,contents from board order by bno desc",
  selectOne: "select title, userid, to_char(regdate, 'YYYY-MM-DD') regdate," +
      " views, contents from board where bno = :1",
  update: "update board set title = :1, contents = :2 where bno = :3;",
  delete: "delete from board where bno = :1;",
};

class Board {
  // select할때 이 옵션이 있어야함

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
  async select() {
    let conn = null;
    let bds = [];
    let params = [];
    try {
      conn = await oracledb.makeConn();
      let result = await conn.execute(
          boardsql.select, params, oracledb.options);
      let rs = result.resultSet;
      let row = null;
      while ((row = await rs.getRow())) {
        let bd = new Board(row.BNO, row.TITLE, row.USERID, row.REGDATE,
            null, row.VIEWS);
        bds.push(bd);
      }
    } catch (e) {
      console.log(e);
    } finally {
      await oracledb.closeConn(conn);
    }
    return bds;
  }

  // 게시글 상세조회
  async selectOne(bno) {
    let conn = null;
    let result = null;
    let bds = [];

    try {
      conn = await oracledb.makeConn();
      result = await conn.execute(boardsql.selectOne, [bno], oracledb.options)
      let rs = result.resultSet;
      let row = null;
      while ((row = await rs.getRow())) {
        let bd = new Board(null, row.TITLE, row.USERID, row.REGDATE,
            row.CONTENTS, row.VIEWS);
        bds.push(bd);
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
    let params = [this.title, this.userid, this.contents];
    let insertcnt = 0;

    try {
      conn = await oracledb.makeConn();
      let result = await conn.execute(boardsql.update, params);
      await conn.commit();
      console.log(result);
    } catch (e) {
      console.log(e);
    } finally {
      await oracledb.closeConn(conn);
    }
    return insertcnt;
  }

  // 게시글 삭제
  async delete() {
    let conn = null;
    let params = [this.title, this.userid, this.contents];
    let insertcnt = 0;

    try {
      conn = await oracledb.makeConn();
      let result = await conn.execute(boardsql.delete, params);
      await conn.commit();
      console.log(result);
    } catch (e) {
      console.log(e);
    } finally {
      await oracledb.closeConn(conn);
    }
    return insertcnt;
  }
}

module.exports = Board;
