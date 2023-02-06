// -------------- 현재 유저 값에 따라 로그인 창 열고/닫기 -------------

let checkUserLogin = function () {
  $("#loginForm2, #loginForm3").css("display", "none");
  console.log("유저 체크중");
  let cUser = JSON.parse(localStorage.getItem("currentUser"));
  if (cUser) {
    $("#secLogin").css("display", "none");
    $("#userId").text(`${cUser}님`);
    $("#welcome").css({ visibility: "visible" });
  } else {
    $("#welcome").css({ visibility: "hidden" });

    $("#loginForm2, #loginForm3").css("display", "none");
    $("#secLogin").css("display", "block");
    $("#loginForm").css("display", "block");

    // 로그인 화면상 마우스 휠이벤트 막기 -> 메인페이지 스크롤 막기 위함
    $("#secLogin").on("wheel", function (e) {
      return false;
    });
  }
};

let setDefault = function () {
  $("#loginBtn").click(function () {
    // 테스트 위해서 로그인 버튼 클릭시 자동으로 현재 유저값 저장됨
    localStorage.setItem("currentUser", JSON.stringify("userId1"));
    checkUserLogin();
  });
};

// ------------------  페이지 시작 시 실행시킬 메서드 모음 ----------------------------
let init = function () {
  checkUserLogin();
  // setDefault();
};

// -----------페이지 시작시 호출될 기본 동작 -------------

// 현재 유저 정보를 가져오는 로직이 userInfo.js 상 window.onload에 구현되어 있으므로
// 유저 정보 가져온 이후에 기본 동작들을 호출하기 위해 window.onpageshow를 사용
window.onpageshow = function () {
  init();
};
