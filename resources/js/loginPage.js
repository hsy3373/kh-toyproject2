// -----------로그인 페이지 안쪽 동작 영역----------------

// 테스트 위해서 로그인 버튼 누르면 로그인 영역 닫히도록 설정함
// $("#loginBtn").click(function () {
//   $("#secLogin").css("display", "none");
// });

// ---------------------------기존 로그인 섹션 내부 동작

// 로그인 버튼 눌렀을 때 로그인폼 등장하는 스크립트
// if ($("#main").css("display") === "none") {
//   $("#main").css("display", "flex");
//   // $("#bg").css("display","flex");
// } else {
//   // $("#main").css("display","none");
// }

$("#loginBtn").click(function () {
  // 로그인 버튼 눌렀을 때 로컬 스토리지에 있는 값과 적은값이 일치하는지 비교검사하는 스크립트
  let userEmail = document.getElementById("userEmail").value;
  let ulist = JSON.parse(localStorage.getItem("userList"));
  if (ulist) {
    if (ulist[userEmail]) {
      let a = ulist[userEmail].email;
      if ($("#userEmail").val() === "") {
        alert("아이디를 입력하세요.");
        return;
      } else if ($("#userPwd").val() === "") {
        alert("비밀번호를 입력하세요.");
        return;
      } else if (userEmail === a) {
        var decrypt = CryptoJS.enc.Base64.parse(ulist[userEmail].Pwd);
        var hashData = decrypt.toString(CryptoJS.enc.Utf8);
        console.log("디코딩된 값 : " + hashData);

        if ($("#userPwd").val() === hashData) {
          localStorage.setItem("currentUser", JSON.stringify(userEmail));
          alert("로그인 되었습니다.");
          $("#secLogin").css("display", "none");

          let cUser = JSON.parse(localStorage.getItem("currentUser"));
          if (cUser) {
            $("#userId").text(`${cUser}님`);
            $("#welcome").css({ visibility: "visible" });
          }
        } else {
          alert("비밀번호가 틀립니다. 다시 입력 해 주세요.");
          return;
        }
      } else {
        alert("아이디를 확인하세요.");
      }
    } else {
      alert("아이디가 틀립니다.");
      return;
    }
    // return;
  } else {
    alert("회원가입이 필요합니다");
  }
});

$("#sign").click(function () {
  // 가입하기 눌렀을 때 form1번은 꺼지고 form2 는 켜지는 스크립트
  $("#loginForm, #loginForm3").css("display", "none");
  $("#loginForm2").css("display", "flex");
});

$("#loginBtn2").click(function () {
  // 이메일 입력과 비밀번호 중복 체크하는 스크립트
  if ($("#userEmail2").val() === "") {
    alert("아이디를 입력하세요.");
    return;
  } else if ($("#userPwd2").val() === "") {
    alert("비밀번호를 입력하세요.");
    return;
  } else if ($("#userPwd3").val() === "") {
    alert("비밀번호를 다시 한번 입력해 주세요.");
    return;
  } else if ($("#userPwd3").val() !== $("#userPwd2").val()) {
    alert("비밀번호가 다릅니다. 다시 입력 해 주세요.");
    return;
  } else if ($("#userPwd3").val() === $("#userPwd2").val()) {
    alert("회원가입 완료.");
    // 회원가입 완료된 후 동작 구현 필요
    $("#loginForm2, #loginForm3").css("display", "none");
    $("#loginForm").css("display", "block");
  }

  var inputText = document.getElementById("userPwd2").value;

  console.log("< Base64 인코딩 및 디코딩 >");
  var key = CryptoJS.enc.Utf8.parse(inputText);
  var base64 = CryptoJS.enc.Base64.stringify(key);
  console.log("인코딩된 값 : " + base64);
  var decrypt = CryptoJS.enc.Base64.parse(base64);
  var hashData = decrypt.toString(CryptoJS.enc.Utf8);
  console.log("디코딩된 값 : " + hashData);

  let ulist = JSON.parse(localStorage.getItem("userList"));
  let user = document.getElementById("userEmail2").value;
  if (ulist) {
    ulist[user] = {
      email: user,
      Pwd: base64,
      favorite: {},
    };
  } else {
    ulist = {
      [user]: {
        email: user,
        Pwd: base64,
        favorite: {},
      },
    };
  }

  localStorage.setItem("userList", JSON.stringify(ulist));
});

$("#sign2").click(function () {
  // 아이디가 이미 있다면 로그인하기 눌러서 다시 form1번으로 돌아가는 스크립트
  $("#loginForm2, #loginForm3").css("display", "none");
  $("#loginForm").css("display", "block");
});

$("#loginForgot").click(function () {
  alert("그건 저도 어쩔수가 없네용 ㅠ.ㅠ");
});

// --------------------------- 기존 회원 탈퇴 동작 -------------

let openUserDelete = function () {
  $("#loginForm, #loginForm2").css("display", "none");
  $("#secLogin").css("display", "block");
  // 로그인 화면상 마우스 휠이벤트 막기 -> 메인페이지 스크롤 막기 위함
  $("#secLogin").on("wheel", function (e) {
    return false;
  });

  $("#loginForm3").css("display", "block");
};

$("#deleteUser").on("click", function () {
  openUserDelete();
});

$("#exit").click(function () {
  let ulist = JSON.parse(localStorage.getItem("userList"));
  let cUser = JSON.parse(localStorage.getItem("currentUser"));
  if (ulist && cUser) {
    if (ulist[cUser]) {
      let userPwdval = document.getElementById("outPassword").value;
      var decrypt = CryptoJS.enc.Base64.parse(ulist[cUser].Pwd);
      var hashData = decrypt.toString(CryptoJS.enc.Utf8);
      if (userPwdval === hashData) {
        delete ulist[cUser];
        localStorage.setItem("userList", JSON.stringify(ulist));
        alert("삭제 되었습니다.");
        localStorage.removeItem("currentUser");
        location.reload();
      } else {
        alert("비밀번호를 확인 해 주세요.");
        return;
      }
    }
  } else {
    alert("회원가입부터 해주세요.");
    return;
  }
});

$("#cancle").click(function () {
  $("#secLogin").css("display", "none");
  // $("#bg").css("display", "none");
});
