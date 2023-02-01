// 이미지 로드시 살짝 위로 올라오는 애니메이션 효과 적용
// todo! : 한번에 적용되고 한번에 풀리는식인데 순차적으로 적용시킬 수 있으면 해보기

let loadedImgAni = function (selector) {
  // 로딩 중 스크롤 방지(스크롤바 사라짐)
  $("html").css({ overflow: "hidden" });

  $("." + selector)
    .delay(500)
    .css({
      animation: "transY 2.5s forwards",
    })
    .delay(2600)
    .queue(function () {
      $(this).removeClass(selector);
      if ($("." + selector).length == 0) {
        $(".loadingAni").fadeOut();
        $("html").css({ overflow: "auto" }); //스크롤 방지 해제
      }
    })
    .css("opacity", 1);
  // 애니메이션 실행이후 그대로 남아있도록 하기 위해 opacity설정
};

// ---------------------picsum---------------------------------

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

// picsum 에서 원하는 특정페이지의, 원하는 갯수만큼 이미지 불러오기
let getImgesPicsum = function (page, number) {
  $.ajax({
    method: "GET",
    url: `https://picsum.photos/v2/list?page=${page}&limit=${number}`,
    dataType: "json",
    // ajax가 정보를 요청하기 전단계에서 실행됨
    beforeSend: function () {
      $(".loadingAni").fadeIn(300);
      // todo! 로딩 애니메이션 넣기
    },
  }).done(function (msg) {
    // 모든 통신이 끝난 후 동작하며 msg에 위에서 지정한 json 타입으로 정보가 들어옴
    // picsum용 이미지 세팅 실행
    console.log(msg);
    putImgPicsum(msg);
  });
};

// picsum용 이미지 세팅 함수
let putImgPicsum = function (msg) {
  let int = -1;
  for (let item of msg) {
    if (int >= $(".imgListWrap").children().length) {
      int = 0;
    } else {
      int++;
    }

    $(`.imgListWrap>:nth-child(${int})`).append(
      `<div class="loadedImgDiv"><img class="loadedImg picsum" src="${item.download_url}" id="${item.id}"></img></div>`
    );
    // 추후 픽섬에서 해당 이미지 아이디값을 검색해와야 할 경우를 위해 따로 클래스명 둠
  }

  // msg 리스트 상 가장 마지막에 추가된 img 태그의 이미지 로드가 끝나면 함수 실행
  $(`img[src="${$(msg).get(-1).download_url}"]`).on(
    `load`,
    loadedImgAni("loadedImg")
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

// todo! : 권한 유효성 이슈로 이미지 끌어오지 못하고 있음 해결필수!
let getImgesUnsplash = function (type, count) {
  $.ajax({
    method: "GET",
    url: `https://api.unsplash.com/photos/${type}?count=${count}`,
    dataType: "json",
    beforeSend: function (xhr) {
      $(".loadingAni").fadeIn(300);
      xhr.setRequestHeader(
        "Authorization",
        "Client-ID " + "8f8MJ6PUF8d_TQPhyNFoow_r8dZXUXojqWuT1oBEw5k"
      );
    },
  }).done(function (msg) {
    console.log(msg);
    putImgUnsplash(msg);
  });
};

let putImgUnsplash = function (msg) {
  let int = -1;
  for (let item of msg) {
    if (int >= $(".imgListWrap").children().length) {
      int = 0;
    } else {
      int++;
    }

    $(`.imgListWrap>:nth-child(${int})`).append(
      `<div class="loadedImgDiv"><img class="loadedImg unsplash" src="${item.urls.regular}" id="${item.id}"></img></div>`
    );
  }

  $(`img[src="${$(msg).get(-1).download_url}"]`).on(
    `load`,
    loadedImgAni(".loadedImg")
  );
};

// --------------------------스크롤 최하단 시 동작----------------------

// 스크롤 동작에 따라 이미지를 불러오기 위한 페이지 변수
var page = 1;

// 페이지에서 기본적으로 실행시킬 메소드들 모음
let init = function () {
  // getImgesUnsplash("random", 15);
  getImgesPicsum(page, $(".imgListWrap").children().length * 6);

  // 스크롤이 최 하단에 닿을때마다 페이지 수 증가시키며 이미지 불러오기
  $(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
      console.log(++page);
      // getImgesUnsplash("random", 15);
      getImgesPicsum(page, 15);
      console.log("무한스크롤: " + page);
    }
  });
};

// 처음 윈도우 로드 시에 스크롤 방지
$("html").css({ overflow: "hidden" }); //로딩 중 스크롤 방지
$(window).on("load", () => {
  setTimeout(() => {
    //  <-* 로딩속도 구현
    // $(".loadingAni").hide(300);
    $("html").css({ overflow: "auto" }); //스크롤 방지 해제
    console.log("페이지 로드 완료");

    // 윈도우가 모두 로드된 후 기본 메소드들을 실행시킨다
    init();
  }, 2000); //  <-* 로딩속도 구현
});
