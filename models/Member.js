const oracledb = require("../models/Oracle");

let membersql = {
  insertsql: "insert into member (mno, userid, passwd, name, email) values (mno.nextval, :1, :2, :3, :4)",
}
class Member {

  // 생성자 정의 - 변수 초기화
  constructor(userid, passwd, name, email) {
    this.userid = userid;
    this.passwd = passwd;
    this.name = name;
    this.email = email;
  }

  // 회원정보 저장
  async insert() {
    let conn = null;
    let params = [this.userid, this.passwd, this.name, this.email];

    try {
      conn = await oracledb.makeConn();
      let result = await conn.execute(membersql.insertsql, params);
      await conn.commit(); // insert 할때 반드시 필요!
      console.log(result);
      // rowsAffected - DML문에 대한 결과 행 수를 확인
      if (result.rowsAffected > 0) console.log("회원정보 저장 성공!");
    } catch (e) {
      console.error(e);
    } finally {
      await oracledb.closeConn(conn);
    }
  }
}
module.exports = Member;
