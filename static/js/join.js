const processJoin = () => {
    let frm = document.join
    if(frm.uid.value === '') alert('아이디를 입력하세요')
    else if(frm.pwd.value === '') alert('비밀번호를 입력하세요')
    else if(frm.repwd.value === '') alert('비밀번호를 입력하세요')
    else if(frm.name.value === '') alert('이름을 입력하세요')
    else if(frm.email.value === '') alert('이메일을 입력하세요')
    else{
        frm.method= 'post';
        frm.enctype = 'application/x-www-form-urlencoded';
        frm.submit();
    }
};

let joinbtn = document.querySelector('#joinbtn');
joinbtn.addEventListener('click', processJoin);