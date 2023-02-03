// ------------ 페이지 새로고침, 닫기에 따른 로그인 정보 관련 기본 동작 ------------

// 만약 새로고침되어서 다시 실행되는 거라면 로그인창 띄우지 않게 처리
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
    let cUser = localStorage.getItem('currentUser');
    if (cUser) {
      console.log(key, '눌림');
      localStorage.setItem('beforeUser', cUser);
    }
  }
};

// 로그인 화면상 마우스 휠이벤트 막기 -> 메인페이지 스크롤 막기 위함
$('#secLogin').on('wheel', function (e) {
  return false;
});

// ---------메인 페이지 이미지 관련----------------

let unsplashKey1 = '-nwvkN9jP_iusw2zg2YbLPJFOPsTpJmRldNZhBoojXM';
let unsplashKey2 = '8f8MJ6PUF8d_TQPhyNFoow_r8dZXUXojqWuT1oBEw5k';

let getImgesUnsplash = function (query, category) {
  $.ajax({
    method: 'GET',
    url: `https://api.unsplash.com/photos${query}`,
    dataType: 'json',
    beforeSend: function (xhr) {
      $('.loadingAni').fadeIn(300);
      xhr.setRequestHeader('Authorization', 'Client-ID ' + unsplashKey2);
    },
  }).done(function (msg) {
    putImgUnsplashMain(msg, category);
  });
};

let putImgUnsplashMain = function (msg, category) {
  // for (let i = 0; i < 20; i++) {
  //   console.log(typeof $(`#c2 img`));
  //   $($(`#c2 img`)[i]).attr({ src: msg[i].urls.regular, id: msg[i].id });
  // }
  $(category).css({
    ['background-image']: `url(${msg.urls.regular})`,
    ['background-size']: 'contain',
    id: msg.id,
  });

  console.log(msg);
};

// picsum용 이미지 세팅 함수
let putImgPicsum = function () {
  for (let i = 0; i < 20; i++) {
    let int = Math.floor(Math.random() * 100);
    console.log(typeof $(`#c2 img`));
    $($(`#c2 img`)[i]).attr(
      'src',
      `https://picsum.photos/400/500?random=${int}`
    );
  }
};

// 이미지
$(`#c2 img`).attr('src', '');
// 메인 상단 최신 이미지들에 픽섬에서 따온 랜덤 이미지 부여
putImgPicsum();

// https://api.unsplash.com/photos?category=nature

getImgesUnsplash('/random?count=1', '.category>.c1');
getImgesUnsplash('/random?category=animals', '.category>.c2');
getImgesUnsplash('/random?category=food', '.category>.c3');
getImgesUnsplash('/random?category=fashion-beauty', '.category>.c4');

// console.log($('.category>.c1'));

$('.category>div').on('click', function () {
  // location.href = link;
  // location.replace(link);
});

// div태그 클릭시 카테고리페이지로 이동
$('.c1, .c2, .c3, .c4').click(function () {
  location.href = 'categoryPage.html';
  localStorage.setItem('beforeUser', localStorage.getItem('currentUser'));
});
