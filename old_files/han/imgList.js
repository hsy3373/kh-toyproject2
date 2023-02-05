// 이미지 로드시 살짝 위로 올라오는 애니메이션 효과 적용
// todo! : 한번에 적용되고 한번에 풀리는식인데 순차적으로 적용시킬 수 있으면 해보기

let loadedImgAni = function (selector) {
  // 로딩 중 스크롤 방지(스크롤바 사라짐)
  // $('html').css({ overflow: 'hidden' });

  $('.' + selector)
    .delay(500)
    .css({
      animation: 'transY 2.5s forwards',
    })
    .delay(2600)
    .queue(function () {
      $(this).removeClass(selector);
      if ($('.' + selector).length == 0) {
        $('.loadingAni').fadeOut();
        console.log('페이드 아웃');
        // $('html').css({ overflow: 'auto' }); //스크롤 방지 해제
        // checkImgListH();
        // 이미지 길이 달라질 경우 처리 test중
      }
    })
    .css('opacity', 1);
  // 애니메이션 실행이후 그대로 남아있도록 하기 위해 opacity설정
};

// 총 이미지 길이 달라질 경우 처리  test중
let checkImgListH = function () {
  let arr = checkHeight();
  let min = $($('.imgListWrap').children()[arr[0]]).height();
  let max = $($('.imgListWrap').children()[arr[1]]).height();

  console.log(max, min, max - min > 300);
  if (max - min > 500) {
    console.log('길이 차이 심해짐');
    $.ajax({
      method: 'GET',
      url: `https://api.unsplash.com/photos/random?count=2`,
      dataType: 'json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          'Authorization',
          'Client-ID ' + 's5HxWa388mqO36Pv406O-LqMH8VNrKdr1wMQIQxcGTk'
        );
      },
    }).done(function (msg) {
      console.log('길이보충용 가지고옴', arr);
      for (let item of msg) {
        let index = arr[1];
        console.log(
          '길이보충용 넣기',
          $(`.imgListWrap>:nth-child(${index + ''})`)
        );

        $(`.imgListWrap>:nth-child(${index + ''})`).append(
          `<div class="loadedImgDiv"><img class="unsplash" src="${item.urls.regular}" id="${item.id}"></img><div class="favoriteDiv"></div></div>`
        );
      }

      $('.unsplash').css('opacity', 1);
    });
  }
};
let checkHeight = function () {
  let arr = [];
  $('.imgListWrap')
    .children()
    .each((index, c) => (arr['h' + index] = $(c).height()));

  console.log(arr);

  let min = arr['h' + 0];
  let max = 0;
  let result = [0, 0];

  for (let i = 0; i < $('.imgListWrap').children().length; i++) {
    let c = arr['h' + i];
    if (c < min) {
      min = c;
      result[0] = i + 1;
    } else if (c > max) {
      max = c;
      result[1] = i + 1;
    }
  }

  return result;
};
// ---------------------picsum---------------------------------

/*
https://picsum.photos/

https://picsum.photos/id/0/info

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

// picsum 에서 원하는 특정페이지의, 원하는 갯수만큼 이미지 불러오기
let getImgesPicsum = function (page, number) {
  $.ajax({
    method: 'GET',
    url: `https://picsum.photos/v2/list?page=${page}&limit=${number}`,
    dataType: 'json',
    // ajax가 정보를 요청하기 전단계에서 실행됨
    beforeSend: function () {
      $('.loadingAni').fadeIn(300);
    },
  }).done(function (msg) {
    // 모든 통신이 끝난 후 동작하며 msg에 위에서 지정한 json 타입으로 정보가 들어옴
    // picsum용 이미지 세팅 실행
    putImgPicsum(msg);
  });
};

// picsum용 이미지 세팅 함수
let putImgPicsum = function (msg) {
  let int = -1;
  for (let item of msg) {
    if (int >= $('.imgListWrap').children().length) {
      int = 0;
    } else {
      int++;
    }

    $(`.imgListWrap>:nth-child(${int})`).append(
      `<div class="loadedImgDiv"><img class="loadedImg picsum" src="${item.download_url}" id="${item.id}"></img><div class="favoriteDiv"></div></div>`
    );
    // 추후 픽섬에서 해당 이미지 아이디값을 검색해와야 할 경우를 위해 따로 클래스명 둠
  }

  // msg 리스트 상 가장 마지막에 추가된 img 태그의 이미지 로드가 끝나면 함수 실행
  $(`img[src="${$(msg).get(-1).download_url}"]`).on(
    `load`,
    loadedImgAni('loadedImg')
  );
};

// ---------------------unsplash---------------------------------
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
let testtest = function (type, count) {
  $.ajax({
    method: 'GET',
    url: `https://api.unsplash.com/topics/animals/photos?page=1`,
    dataType: 'json',
    beforeSend: function (xhr) {
      $('.loadingAni').fadeIn(300);
      xhr.setRequestHeader(
        'Authorization',
        'Client-ID ' + '-nwvkN9jP_iusw2zg2YbLPJFOPsTpJmRldNZhBoojXM'
      );
    },
  }).done(function (msg) {
    console.log('getImgesUnsplash 끝', msg);
    // putImgUnsplash(msg);
  });
};

let unsplashKey1 = '-nwvkN9jP_iusw2zg2YbLPJFOPsTpJmRldNZhBoojXM';
let unsplashKey2 = '8f8MJ6PUF8d_TQPhyNFoow_r8dZXUXojqWuT1oBEw5k';

let getImgesUnsplash = function (type, count) {
  $.ajax({
    method: 'GET',
    url: `https://api.unsplash.com/photos/${type}?count=${count}`,
    dataType: 'json',
    beforeSend: function (xhr) {
      $('.loadingAni').fadeIn(300);
      xhr.setRequestHeader('Authorization', 'Client-ID ' + unsplashKey1);
    },
  }).done(function (msg) {
    console.log('getImgesUnsplash 끝', msg);
    putImgUnsplash(msg);
  });
};

let putImgUnsplash = function (msg) {
  let int = -1;
  for (let item of msg) {
    if (int >= $('.imgListWrap').children().length) {
      int = 0;
    } else {
      int++;
    }

    $(`.imgListWrap>:nth-child(${int})`).append(
      `<div class="loadedImgDiv"><img class="loadedImg unsplash" src="${item.urls.regular}" id="${item.id}"></img><div class="favoriteDiv"></div></div>`
    );
  }

  $(`img[src="${$(msg).get(-1).urls.regular}"]`).on(
    `load`,
    loadedImgAni('loadedImg')
  );
};

// ---------------------이미지 id 값으로 정보 불러오기 ---------------

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

// ---------------------이미지 개별 클릭 이벤트 할당 구역--------------

// 이미지 클릭 시 아이디 값 가져와서 해당 사이트에서 아이디값으로 검색 가능함
// picsum용, unsplash용 각각 나눔
$(document).on('click', '.picsum', function () {
  $('.innerImgModal').attr('src', '');
  getOneImgePicsum($(this).attr('id'));
});

$(document).on('click', '.unsplash', function () {
  $('.innerImgModal').attr('src', '');
  getOneImgeUnsplash($(this).attr('id'));
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

// 이미지들 마우스 오버 관련 이벤트 (이미지 상 즐겨찾기 영역 표시용)
$(document).on('mouseover', '.loadedImgDiv', function (e) {
  $(this).children('div').css('opacity', 1);
});
$(document).on('mouseleave', '.loadedImgDiv', function (e) {
  $(this).children('div').css('opacity', 0);
});

// --------------------------------------------------------------
// url 넣으면 해당 파일 다운로드 됨
function downloadPic(url) {
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
}
// --------------------------페이지 기본 동작들 구역----------------------

// 스크롤 동작에 따라 이미지를 불러오기 위한 페이지 변수
var page = 1;

// 페이지에서 기본적으로 실행시킬 메소드들 모음
let init = function () {
  // getImgesUnsplash("random", 15);
  getImgesPicsum(page, $('.imgListWrap').children().length * 6);

  // 스크롤이 하단에 닿을때마다 페이지 수 증가시키며 이미지 불러오기
  $(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
      console.log(++page);
      getImgesUnsplash('random', $('.imgListWrap').children().length * 6);
      // testtest();
      // getImgesPicsum(page, 15);
    }
  });
};

// 처음 윈도우 로드 시에 스크롤 방지
$('html').css({ overflow: 'hidden' }); //로딩 중 스크롤 방지
$(window).on('load', () => {
  setTimeout(() => {
    //  <-* 로딩속도 구현
    $('html').css({ overflow: 'auto' }); //스크롤 방지 해제

    // 윈도우가 모두 로드된 후 기본 메소드들을 실행시킨다
    init();
  }, 2000); //  <-* 로딩속도 구현
});
