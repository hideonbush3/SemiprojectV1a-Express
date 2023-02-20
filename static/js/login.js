const processLogin = () => {
    let frm = document.login;
    if (frm.uid.value === "") alert("아이디를 입력하세요");
    else if (frm.pwd.value === "") alert("패스워드를 입력하세요");
    else{
        frm.method = "post";
        frm.submit();
    }
};

let loginbtn = document.querySelector("#loginbtn");
loginbtn.addEventListener("click", processLogin);