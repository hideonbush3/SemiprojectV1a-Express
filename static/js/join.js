const processJoin = () => {
    let frm = document.join
    if(frm.userid.value === '') alert('아이디는?')
    else if(frm.passwd.value === '') alert('비밀번호는?')
    else if(frm.repwd.value === '') alert('비밀번호는?')
    else if(frm.name.value === '') alert('이름은?')
    else if(frm.email.value === '') alert('이메일은?')
    else{
        frm.method= 'post';
        frm.enctype = 'application/x-www-form-urlencoded';
        frm.submit();
    }
};

let joinbtn = document.querySelector('#mbbtn');
joinbtn.addEventListener('click', processJoin);