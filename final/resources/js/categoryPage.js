if (localStorage.getItem('beforeUser')) {
  $('#secLogin').css('display', 'none');
  localStorage.setItem('currentUser', localStorage.getItem('beforeUser'));
  localStorage.removeItem('beforeUser');
}

var navType = performance.getEntriesByType('navigation')[0].type;
console.log('네비 타입임 : ', navType, typeof navType);

if (navType === 'reload') {
  console.log('리로드 됨');
} else if (navType === 'back_forward') {
  console.log('뒤로가기로 옴');
} else if (navType === 'navigate') {
  console.log('url로 옴');
} else {
  console.log('방법 모름');
}

window.onpopstate = function (event) {};

window.onpageshow = function (event) {
  if (
    event.persisted ||
    (window.performance &&
      window.performance.getEntriesByType('navigation')[0].type ===
        'back_forward')
  ) {
    console.log('Back button was pressed.');
    localStorage.setItem('beforeUser', localStorage.getItem('currentUser'));
    // 처리
  }
};
