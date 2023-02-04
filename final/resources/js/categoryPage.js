// ------------------ 카테고리 내부 동작 메서드 선언 구역 ------------------

// 카테고리 목록 변경시 호출할 메서드
let changeCategory = function (category) {
  let categoryList = $('#content > *');
  for (let cl of categoryList) {
    if ($(cl).hasClass(category)) {
      $(cl).css('display', 'grid');
    } else {
      $(cl).css('display', 'none');
    }
    console.log('현재 카테고리 : ', $(cl).attr('class'), $(cl).css('display'));
  }
};

// 현재 페이지에 접속한 방법 알아내는 메서드
let getNavType = function () {
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
};

// ------------------------ 이미지 로드 관련 메서드 선언 구역---------------------------

// 이미지로드되면 각 이미지에 그리드 값 주고 애니메이션 할당 및 클래스 제거하는 메서드
let loadedImgAni = function () {
  // 아래 효과들은 해당 클래스 요소가 생성되자마자 적용되면 안되고 순차적으로 적용되어야 해서
  // 동적생성요소에 한번에 이벤트를 넣는 방식으로 하지 않고 매번 이벤트를 따로 주는 것으로 설정한 것임
  $('.loadedImg').on(`load`, function () {
    // 각 이미지 위치를 잡기 위해 높이값 가져와서 부모요소가 차지할 그리드 행 설정
    let height = Math.ceil($(this).height() / 10) + 3;
    $(this).parent().css('grid-row-end', `span ${height}`);

    // 각이미지에 애니메이션 실행 후 클래스 삭제 및 로딩바 사라짐 효과 추가
    $(this)
      .delay(1000)
      .css({
        animation: 'transY 2.5s forwards',
      })
      .delay(2600)
      .queue(function () {
        $(this).removeClass('loadedImg');
        if ($('.loadedImg').length == 0) {
          $('.loadingAni').fadeOut();
          console.log('페이드 아웃');
        }
      })
      .css('opacity', 1);
    // 애니메이션 실행 후에도 계속 보여지도록 오퍼시티값 설정
  });
};

// unsplash 전용 키
let unsplashKey1 = '-nwvkN9jP_iusw2zg2YbLPJFOPsTpJmRldNZhBoojXM';
let unsplashKey2 = '8f8MJ6PUF8d_TQPhyNFoow_r8dZXUXojqWuT1oBEw5k';
/* 
Unsplash 객체 예시
{
  "id": "pXhwzz1JtQU",
  "updated_at": "2016-07-10T11:00:01-05:00",
  "username": "jimmyexample",
  "first_name": "James",
  "last_name": "Example",
  "twitter_username": "jimmy",
  "portfolio_url": null,
  "bio": "The user's bio",
  "location": "Montreal, Qc",
  "total_likes": 20,
  "total_photos": 10,
  "total_collections": 5,
  "followed_by_user": false,
  "downloads": 4321,
  "uploads_remaining": 4,
  "instagram_username": "james-example",
  "location": null,
  "email": "jim@example.com",
  "links": {
    "self": "https://api.unsplash.com/users/jimmyexample",
    "html": "https://unsplash.com/jimmyexample",
    "photos": "https://api.unsplash.com/users/jimmyexample/photos",
    "likes": "https://api.unsplash.com/users/jimmyexample/likes",
    "portfolio": "https://api.unsplash.com/users/jimmyexample/portfolio"
  },
  "urls": {
    "raw": "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?ixid=2yJhcHBfaWQiOjEyMDd9",
    "full": "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?ixid=2yJhcHBfaWQiOjEyMDd9&fm=jpg&q=80",
    "regular": "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?ixid=2yJhcHBfaWQiOjEyMDd9&fm=jpg&fit=crop&w=1080&q=80&fit=max",
    "small": "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?ixid=2yJhcHBfaWQiOjEyMDd9&&fm=jpg&w=400&fit=max",
    "thumb": "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?ixid=2yJhcHBfaWQiOjEyMDd9&fm=jpg&w=200&fit=max"
  }
}
*/

// Unsplash api 사용하여 이미지 로드 , 이미지를 넣을 카테고리(클래스명)와 이미지 검색 쿼리를 매개로 넣어 이용
let getImgesUnsplash = function (category, query) {
  $.ajax({
    method: 'GET',
    url: `https://api.unsplash.com/photos${query}`,
    dataType: 'json',
    beforeSend: function (xhr) {
      $('.loadingAni').fadeIn(300);
      xhr.setRequestHeader('Authorization', 'Client-ID ' + unsplashKey1);
    },
    error: function (jqXHR) {
      console.log(jqXHR); //응답 메시지
      getImgesPicsum(5, 20, category);
    },
  }).done(function (msg) {
    putImgUnsplash(msg, category);
  });
};

// Unsplash 객체용 이미지 삽입 메서드
let putImgUnsplash = function (msg, category) {
  for (let item of msg) {
    $(`.${category}`).append(
      `<div class="loadedImgDiv"><img class="unsplash" src="${item.urls.regular}" id="${item.id}"></img><div class="favoriteDiv"></div></div>`
    );
  }
  // msg 리스트 상 가장 마지막에 추가된 img 태그의 이미지 로드가 끝나면 함수 실행
  $(`img[src="${$(msg).get(-1).urls.regular}"]`).on(`load`, loadedImgAni());
};

/*
  picsum 객체 예시 
  {
    author: "Alejandro Escamilla"
    download_url: "https://picsum.photos/id/0/5000/3333"
    height: 3333
    id: "0"
    url: "https://unsplash.com/photos/yC-Yzbqy7PY"
    width: 5000
  }
*/
// Picsum api 사용하여 이미지 로드 , 페이지넘버, 가져올 이미지 수, 이미지를 넣을 카테고리(클래스명)를 매개로 넣어 이용
let getImgesPicsum = function (page, number, category) {
  $.ajax({
    method: 'GET',
    url: `https://picsum.photos/v2/list?page=${page}&limit=${number}`,
    dataType: 'json',
    // ajax가 정보를 요청하기 전단계에서 실행됨
    beforeSend: function () {
      $('.loadingAni').fadeIn(300);
    },
  }).done(function (msg) {
    putImgPicsum(msg, category);
  });
};

// picsum용 이미지 세팅 함수
let putImgPicsum = function (msg, category) {
  for (let item of msg) {
    $(`.${category}`).append(
      `<div class="loadedImgDiv"><img class="loadedImg picsum" src="${item.download_url}" id="${item.id}"></img><div class="favoriteDiv"></div></div>`
    );
  }
  // msg 리스트 상 가장 마지막에 추가된 img 태그의 이미지 로드가 끝나면 함수 실행
  $(`img[src="${$(msg).get(-1).download_url}"]`).on(`load`, loadedImgAni());
};

// ------------------- 이미지 클릭, 모달창 동작 메서드 선언 구역 -----------

// 이미지 id 값으로 정보 불러온 후 모달창 팝업 시키는 메서드
// Picsum 이미지용, Unsplash이미지용 두가지 존재
let getOneImgePicsum = function (id) {
  $.ajax({
    method: 'GET',
    url: `https://picsum.photos/id/${id}/info`,
    dataType: 'json',
    beforeSend: function () {
      $('#shareText').text('');
    },
  }).done(function (msg) {
    $('#imgAuthor').text(msg.author);
    $('.innerImgModal').attr('src', msg.download_url);
    $('.innerImgModal').attr('id', msg.id);
    $('.innerImgModal').attr('class', 'innerImgModal picsum');

    $('#shareText').text(msg.url);
  });

  $('#exampleModal').modal('show');
};

// GET /search/photos:id
let getOneImgeUnsplash = function (id) {
  $.ajax({
    method: 'GET',
    url: `https://api.unsplash.com/photos/${id}`,
    dataType: 'json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        'Authorization',
        'Client-ID ' + '8f8MJ6PUF8d_TQPhyNFoow_r8dZXUXojqWuT1oBEw5k'
      );
    },
  }).done(function (msg) {
    console.log(`https://api.unsplash.com/photos?:${id}`);
    console.log(id, msg);
    $('#imgAuthor').text(msg.user.first_name + ' ' + msg.user.last_name);
    $('.innerImgModal').attr('src', msg.urls.regular);
    $('.innerImgModal').attr('id', msg.id);
    $('.innerImgModal').attr('class', 'innerImgModal unsplash');
    $('#shareText').text(msg.urls.regular);
  });

  $('#exampleModal').modal('show');
};

// toast 메세지 띄우는 메서드
let toast = function (text) {
  $('#toast').text(text);
  if ($('.toastShow').length > 0) return; // 토스트 메세지 show 중이면 다시 뜨지 않도록 처리
  $('#toast').addClass('toastShow'); // show라는 클래스를 추가해서 토스트 메시지를 띄우는 애니메이션을 발동시킴
  setTimeout(function () {
    // 2700ms 후에 show 클래스를 제거함
    $('#toast').removeClass('toastShow');
  }, 2700);
};

// url 넣으면 해당 파일 다운로드 됨
let downloadPic = function (url) {
  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  img.onload = function () {
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(this, 0, 0);

    const elt = document.createElement('a');
    elt.setAttribute('href', canvas.toDataURL('image/png'));
    elt.setAttribute('download', 'file.png');
    elt.style.display = 'none';
    document.body.appendChild(elt);
    elt.click();
    document.body.removeChild(elt);
  };
  img.crossOrigin = 'anonymous';
  img.src = url;
};

// 이미지, 모달창 관련 이벤트 할당
let imgClickEvent = function () {
  // 이미지 클릭 시 아이디 값 가져와서 해당 사이트에서 아이디값으로 검색 가능함
  $(document).on('click', '.picsum', function () {
    $('.innerImgModal').attr('src', '');
    getOneImgePicsum($(this).attr('id'));
  });
  $(document).on('click', '.unsplash', function () {
    $('.innerImgModal').attr('src', '');
    getOneImgeUnsplash($(this).attr('id'));
  });
  // picsum용, unsplash용 각각 나눔

  // 이미지들 마우스 오버,아웃 관련 이벤트 (이미지 상 즐겨찾기 영역 표시용)
  $(document).on('mouseover', '.loadedImgDiv', function (e) {
    $(this).children('div').css('opacity', 1);
  });
  $(document).on('mouseleave', '.loadedImgDiv', function (e) {
    $(this).children('div').css('opacity', 0);
  });

  //  모달창의 다운로드 버튼 이벤트
  $('#modalDown').on('click', function () {
    // 안쪽 이미지 url을 파일로 다운로드
    downloadPic($('.innerImgModal').attr('src'));
    toast('이미지 다운로드 중입니다');
  });

  // 모달창의 공유 버튼 이벤트 (이미지 url 클립보드에 복사)
  $('#modalShare').on('click', function () {
    // Clipboard API 를 사용하는 것으로 비동기로 복사를 수행하고 Promise를 반환하게 된다
    // 다만 localhost, https 환경에서만 동작한다 -> 에러 처리 위해 try로 감쌈
    try {
      // writeText()의 인자로 넣은 텍스트가 복사된다.
      window.navigator.clipboard.writeText($('#shareText').text()).then(() => {
        // 복사가 완료되면 이 부분이 호출된다.
        toast('클립보드로 복사되었습니다');
      });
    } catch (err) {
      console.log(err);
      toast('복사에 실패하였습니다');
    }
  });
};

// ------------------  페이지 시작 시 실행시킬 메서드 모음 ----------------------------
function init() {
  getNavType();
  // 현재 페이지에 로그인 된 유저 값 받아오기
  if (localStorage.getItem('beforeUser')) {
    localStorage.setItem('currentUser', localStorage.getItem('beforeUser'));
    localStorage.removeItem('beforeUser');
  }
  // 페이지 첫 시작시 표시 카테고리 화면결정
  if (localStorage.getItem('category')) {
    let currentC = localStorage.getItem('category');
    changeCategory(currentC);
    // getImgesUnsplash(currentC, '/random?count=20');
    getImgesPicsum(2, 20, currentC);
  } else {
    console.log('카테고리 값 없음');
  }

  // 기본 클릭 이벤트들 설정 메서드
  imgClickEvent();

  // 스크롤이 하단에 닿을때마다 페이지 수 증가시키며 이미지 불러오기
  $(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
      console.log(++scrollnum);
      // getImgesUnsplash('random', $('.imgListWrap').children().length * 6);
      // testtest();
      getImgesPicsum(scrollnum, 15, localStorage.getItem('category'));
    }
  });

  //스크롤 방지 해제
  $('html').css({ overflow: 'auto' });
}

// -----------페이지 시작시 호출될 기본 동작 -------------

/* 브라우저는 문서를 처음 로드시 load 이벤트 다음에 pageshow 이벤트를 발생시킴, 문서를 벗어날때는 pagehide
  pageshow 이벤트의 경우 뒤로가기로 재진입한 경우에도 발생하는 이벤트이므로 
  페이지가 열릴 때마다 수행되어야하는 코드가 있다면 이 이벤트에 바인딩하는 것이 더 바람직하다.
  해당 이벤트 객체의 persisted 프로퍼티의 값은 페이지가 로드/새로고침이 아니라 복원되었을 경우에 true 임 - 그외는 false
*/
// 페이지가 뒤로가기로 인해 오게되었거나 새로고침 되었을 때 현재 유저 정보를 잃지 않기 위한 메서드
window.onpageshow = function (event) {
  if (
    event.persisted ||
    (window.performance &&
      window.performance.getEntriesByType('navigation')[0].type ===
        'back_forward')
  ) {
    console.log('Back button was pressed.');
    localStorage.setItem('beforeUser', localStorage.getItem('currentUser'));
  }
};

// 처음 윈도우 로드 시에 스크롤 방지
$('html').css({ overflow: 'hidden' }); //로딩 중 스크롤 방지

// 스크롤 된 횟수 확인용 변수
let scrollnum = 1;

$(window).on('load', () => {
  setTimeout(() => {
    //  <-* 로딩속도 구현
    // 윈도우가 모두 로드된 후 기본 메소드들을 실행시킨다
    init();
  }, 2000); //  <-* 로딩속도 구현
});

// ------------------ 페이지 css 관련 동작 구역 ---------------
$('#logo').on({
  click: function () {
    $('#la>img').css({ width: '27px', height: 'auto' });
    $('#textLogo').css({ width: '27px', height: 'auto', 'font-size': '15px' });
  },
});

// 카테고리 선택될때마다 색부여(회색)
$('.categoryName').click(function () {
  $(this).css({
    'background-color': '#00000040',
    'border-radius': '100% 90% 0% 0%',
    color: 'white',
  });
  $('#content').css('background-color', '#00000040');
  var notClicked = $('.categoryName').not(this);
  notClicked.css({ 'background-color': 'white', color: 'black' });
});

// 버튼 호버
$('#star').hover(
  function () {
    $(this).css('background-color', '#ad081b');
  },
  function () {
    $(this).css('background-color', '#f51f1f');
  }
);

$('#hb2').hover(
  function () {
    $(this).css('backgroundColor', '#d0d0d0');
  },
  function () {
    $(this).css('backgroundColor', '#f0f0f0');
  }
);
