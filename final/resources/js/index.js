// ------------ 페이지 새로고침, 닫기에 따른 로그인 정보 관련 기본 동작 ------------

if (localStorage.getItem("beforeUser")) {
  $("#secLogin").css("display", "none");
  localStorage.setItem("currentUser", localStorage.getItem("test"));
  localStorage.removeItem("beforeUser");
}

$(window).bind("beforeunload", function (e) {
  localStorage.removeItem("currentUser");
});

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

$("#secLogin").on("wheel", function (e) {
  console.log(e);
  return false;
});

$("#loginBtn").click(function () {
  $("#secLogin").css("display", "none");
});
