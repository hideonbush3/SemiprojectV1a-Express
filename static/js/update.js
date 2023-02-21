let updatebtn = document.querySelector("#updatebtn");

updatebtn?.addEventListener("click", () => {
  let frm = document.update;
  if(frm.title.value == '') alert('제목을 입력하세요');
  else if(frm.contents.value == '') alert('본문을 입력하세요');
  else if(frm.uid.value != '') {
    frm.method = 'post';
    frm.submit();
  }
});
