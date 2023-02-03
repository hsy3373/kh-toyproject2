// ------------ 페이지 새로고침, 닫기에 따른 로그인 정보 관련 기본 동작 ------------

// 만약 새로고침되어서 다시 실행되는 거라면 로그인창 띄우지 않게 처리
if (localStorage.getItem("beforeUser")) {
  $("#secLogin").css("display", "none");
  localStorage.setItem("currentUser", localStorage.getItem("test"));
  localStorage.removeItem("beforeUser");
}

// 창 닫힘, 새로고침시 동작 -> 현재 로그인 유저 정보 없애기
$(window).bind("beforeunload", function (e) {
  localStorage.removeItem("currentUser");
});

// 새로고침 관련 버튼 동작 -> 새로고침 시키되 로그인 정보 남기기
document.onkeydown = function (e) {
  let key = e.key;

  /* F5, Ctrl+r, Ctrl+F5 */
  if (
    key == "F5" ||
    (e.ctrlKey == true && key == "r") ||
    (e.ctrlKey == true && key == "R")
  ) {
    let cUser = localStorage.getItem("currentUser");
    if (cUser) {
      console.log(key, "눌림");
      localStorage.setItem("beforeUser", cUser);
    }
  }
};

// 로그인 화면상 마우스 휠이벤트 막기 -> 메인페이지 스크롤 막기 위함
$("#secLogin").on("wheel", function (e) {
  return false;
});
