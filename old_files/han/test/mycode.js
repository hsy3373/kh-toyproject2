// ------ 프로젝트상 쓰이지 않으나 기록해두고 싶은 코드들 목록 ---------

// 창 닫힘, 새로고침시 동작 -> 현재 로그인 유저 정보 없애기
$(window).bind('beforeunload', function (e) {
  localStorage.removeItem('currentUser');
});

// 새로고침 관련 버튼 동작 -> 새로고침 시키되 로그인 정보 남기기
document.onkeydown = function (e) {
  let key = e.key;

  /* F5, Ctrl+r, Ctrl+F5 */
  if (
    key == 'F5' ||
    (e.ctrlKey == true && key == 'r') ||
    (e.ctrlKey == true && key == 'R')
  ) {
    let cUser = JSON.parse(localStorage.getItem('currentUser'));
    if (cUser) {
      console.log(key, '눌림');
      localStorage.setItem('beforeUser', JSON.stringify(cUser));
    }
  }
};
