// ------------------ 카테고리 내부 동작 메서드 선언 구역 ------------------

// 카테고리 목록 변경시 호출할 메서드, 현재 카테고리가 어떤건지 로컬스토리지 값도 변경
let changeCategory = function (category) {
  console.log("카테고리 준비중  ", category);
  localStorage.setItem("category", JSON.stringify(category));

  // 매개변수로 받은 카테고리 클래스만 보이고 그 외 카테고리들은 none으로 숨기기
  $(`#content > .${category}`).css("display", "grid");
  $("#content > *").not(`.${category}`).css("display", "none");

  // 즐겨찾기 메뉴와 그 외 카테고리들 구분하여 동작 실행
  if (category === "favorite") {
    $(`body, #content`).css("background-color", "#525252");
    getFavoriteImg();
  } else {
    $(`body, #content`).css("background-color", "#d9d9d9");
    if ($(`#content > .${category}`).children().length < 1) {
      getImgesUnsplash(category, unsplashKey1);
    }
  }
};

// ------------------------ 이미지 로드 관련 메서드 선언 구역---------------------------

// 이미지로드되면 각 이미지에 그리드 값 주고 애니메이션 할당 및 클래스 제거하는 메서드
let loadedImgAni = function () {
  // 아래 효과들은 해당 클래스 요소가 생성되자마자 적용되면 안되고 순차적으로 적용되어야 해서
  // 동적생성요소에 한번에 이벤트를 넣는 방식으로 하지 않고 매번 이벤트를 따로 주는 것으로 설정한 것임
  $(".loadedImg").on(`load`, function () {
    // 각 이미지 위치를 잡기 위해 높이값 가져와서 부모요소가 차지할 그리드 행 설정
    let height = Math.ceil($(this).height() / 10) + 3;
    $(this).parent().css("grid-row-end", `span ${height}`);

    // 각이미지에 애니메이션 실행 후 클래스 삭제 및 로딩바 사라짐 효과 추가
    $(this)
      .delay(1000)
      .css({
        animation: "transY 2.5s forwards",
      })
      .delay(2600)
      .queue(function () {
        $(this).removeClass("loadedImg");
        if ($(".loadedImg").length == 0) {
          $(".loadingAni").fadeOut();
          console.log("페이드 아웃");
        }
      })
      .css("opacity", 1);
    // 애니메이션 실행 후에도 계속 보여지도록 오퍼시티값 설정
  });
};

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

// unsplash 전용 키
let unsplashKey1 = "DdupjOmqsFLJM715aoqKaNwOTg3DoTDlVX6kmMHT9jk";
let unsplashKey2 = "0vljd_3IVQy3guaXeAHgo9VKYGSvFBWCaEuYkp4R89k";
let unsplashKey3 = "-nwvkN9jP_iusw2zg2YbLPJFOPsTpJmRldNZhBoojXM";
let unsplashKey4 = "8f8MJ6PUF8d_TQPhyNFoow_r8dZXUXojqWuT1oBEw5k";

// Unsplash api 사용하여 이미지 로드 , 이미지를 넣을 카테고리(클래스명)와 이미지 검색 쿼리를 매개로 넣어 이용
let getImgesUnsplash = function (category, key) {
  let querys = {
    c0: "/random?count=15",
    c1: "/random?query=animals&count=15",
    c2: "/random?query=food&count=15",
    c3: "/random?query=fashion-beauty&count=15",
  };

  $.ajax({
    method: "GET",
    url: `https://api.unsplash.com/photos${querys[category]}`,
    dataType: "json",
    beforeSend: function (xhr) {
      $(".loadingAni").fadeIn(300);
      xhr.setRequestHeader("Authorization", "Client-ID " + key);
    },
    error: function (jqXHR) {
      console.log(jqXHR); //응답 메시지
      if (key != unsplashKey2) {
        getImgesUnsplash(category, unsplashKey2);
      }
    },
  }).done(function (msg) {
    putImgUnsplash(msg, category);
    console.log(msg);
  });
};

// Unsplash 객체용 이미지 삽입 메서드
let putImgUnsplash = function (msg, category) {
  let list = getFavoriteList();
  let linkList = [];
  if (list.length > 0) {
    for (let item of list) {
      linkList.push(item.link);
    }
  }
  for (let item of msg) {
    let bookmarkClass = "favoriteUnfill";
    if (linkList.includes(item.urls.regular)) {
      bookmarkClass = "favoriteFill";
    }
    $(`.${category}`).append(
      `<div class="loadedImgDiv"><img class="loadedImg unsplash" src="${item.urls.regular}" id="${item.id}"></img><div class="${bookmarkClass}"></div></div>`
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
    method: "GET",
    url: `https://picsum.photos/v2/list?page=${page}&limit=${number}`,
    dataType: "json",
    // ajax가 정보를 요청하기 전단계에서 실행됨
    beforeSend: function () {
      $(".loadingAni").fadeIn(300);
    },
  }).done(function (msg) {
    putImgPicsum(msg, category);
  });
};

// picsum용 이미지 세팅 함수
let putImgPicsum = function (msg, category) {
  let list = getFavoriteList();
  let linkList = [];
  if (list.length > 0) {
    for (let item of list) {
      linkList.push(item.link);
    }
  }
  for (let item of msg) {
    let bookmarkClass = "favoriteUnfill";
    if (linkList.includes(item.download_url)) {
      bookmarkClass = "favoriteFill";
    }
    $(`.${category}`).append(
      `<div class="loadedImgDiv"><img class="loadedImg picsum" src="${item.download_url}" id="${item.id}"></img><div class="${bookmarkClass}"></div></div>`
    );
  }
  // msg 리스트 상 가장 마지막에 추가된 img 태그의 이미지 로드가 끝나면 함수 실행
  $(`img[src="${$(msg).get(-1).download_url}"]`).on(`load`, loadedImgAni());
};

// ------------------- 이미지 클릭, 모달창 동작 메서드 선언 구역 -----------

// 이미지 id 값으로 정보 불러온 후 모달창 팝업 시키는 메서드
// Picsum 이미지용, Unsplash이미지용 두가지 존재
let getOneImgePicsum = function (img) {
  let id = $(img).attr("id");
  let favorClass = $(img).next().attr("class");
  $.ajax({
    method: "GET",
    url: `https://picsum.photos/id/${id}/info`,
    dataType: "json",
    beforeSend: function () {
      $("#shareText").text("");
    },
  }).done(function (msg) {
    $("#modalFavorite").attr("class", favorClass);
    $("#imgAuthor").text(msg.author);
    $(".innerImgModal").attr("src", msg.download_url);
    $(".innerImgModal").attr("id", msg.id);
    $(".innerImgModal").attr("class", "innerImgModal picsum");

    $("#shareText").text(msg.url);
  });

  $("#exampleModal").modal("show");
};

// GET /search/photos:id
let getOneImgeUnsplash = function (img, key) {
  let id = $(img).attr("id");
  let favorClass = $(img).next().attr("class");
  $.ajax({
    method: "GET",
    url: `https://api.unsplash.com/photos/${id}`,
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Client-ID " + key);
    },
    error: function (jqXHR) {
      console.log(jqXHR); //응답 메시지
      if (key != unsplashKey2) {
        getOneImgeUnsplash(img, unsplashKey2);
      }
      return;
    },
  }).done(function (msg) {
    $("#modalFavorite").attr("class", favorClass);
    $("#imgAuthor").text(msg.user.first_name + " " + msg.user.last_name);
    $(".innerImgModal").attr("src", msg.urls.regular);
    $(".innerImgModal").attr("id", msg.id);
    $(".innerImgModal").attr("class", "innerImgModal unsplash");
    $("#shareText").text(msg.urls.regular);
  });

  $("#exampleModal").modal("show");
};

// toast 메세지 띄우는 메서드
let toast = function (text) {
  $("#toast").text(text);
  if ($(".toastShow").length > 0) return; // 토스트 메세지 show 중이면 다시 뜨지 않도록 처리
  $("#toast").addClass("toastShow"); // show라는 클래스를 추가해서 토스트 메시지를 띄우는 애니메이션을 발동시킴
  setTimeout(function () {
    // 2700ms 후에 show 클래스를 제거함
    $("#toast").removeClass("toastShow");
  }, 2700);
};

// url 넣으면 해당 파일 다운로드 됨
let downloadPic = function (url) {
  const img = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  img.onload = function () {
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(this, 0, 0);

    const elt = document.createElement("a");
    elt.setAttribute("href", canvas.toDataURL("image/png"));
    elt.setAttribute("download", "file.png");
    elt.style.display = "none";
    document.body.appendChild(elt);
    elt.click();
    document.body.removeChild(elt);
  };
  img.crossOrigin = "anonymous";
  img.src = url;
};

// 회원탈퇴 구역
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

// 회원탈퇴 구역
$("#cancle").click(function () {
  $("#secLogin").css("display", "none");
  // $("#bg").css("display", "none");
});

// 회원 탈퇴창 팝업
let openUserDelete = function () {
  $("#secLogin").css("display", "block");
  // 로그인 화면상 마우스 휠이벤트 막기 -> 메인페이지 스크롤 막기 위함
  $("#secLogin").on("wheel", function (e) {
    return false;
  });

  $("#loginForm3").css("display", "block");
};

// 이미지, 모달창 관련 이벤트 할당
let imgClickEvent = function () {
  // 이미지 클릭 시 아이디 값 가져와서 해당 사이트에서 아이디값으로 검색 가능함
  $(document).on("click", ".picsum", function () {
    $(".innerImgModal").attr("src", "");
    getOneImgePicsum($(this));
  });
  $(document).on("click", ".unsplash", function () {
    $(".innerImgModal").attr("src", "");
    getOneImgeUnsplash($(this), unsplashKey1);
  });
  // picsum용, unsplash용 각각 나눔

  // 이미지들 마우스 오버,아웃 관련 이벤트 (이미지 상 즐겨찾기 영역 표시용)
  $(document).on("mouseover", ".loadedImgDiv", function (e) {
    $(this).children("div").css("opacity", 1);
  });
  $(document).on("mouseleave", ".loadedImgDiv", function (e) {
    $(this).children("div").css("opacity", 0);
  });

  //  모달창의 다운로드 버튼 이벤트
  $("#modalDown").on("click", function () {
    // 안쪽 이미지 url을 파일로 다운로드
    downloadPic($(".innerImgModal").attr("src"));
    toast("이미지 다운로드 중입니다");
  });

  // 모달창의 공유 버튼 이벤트 (이미지 url 클립보드에 복사)
  $("#modalShare").on("click", function () {
    // Clipboard API 를 사용하는 것으로 비동기로 복사를 수행하고 Promise를 반환하게 된다
    // 다만 localhost, https 환경에서만 동작한다 -> 에러 처리 위해 try로 감쌈
    try {
      // writeText()의 인자로 넣은 텍스트가 복사된다.
      window.navigator.clipboard.writeText($("#shareText").text()).then(() => {
        // 복사가 완료되면 이 부분이 호출된다.
        toast("클립보드로 복사되었습니다");
      });
    } catch (err) {
      console.log(err);
      toast("복사에 실패하였습니다");
    }
  });

  $("#deleteUser").on("click", function () {
    openUserDelete();
  });
};

// ------------------ 즐겨찾기 관련 메서드 구역 ----------------------------

let getFavoriteList = function () {
  let uList = JSON.parse(localStorage.getItem("userList"));
  let cUser = JSON.parse(localStorage.getItem("currentUser"));
  let list = Object.values(uList[cUser].favorite);
  return list;
};

let getFavoriteImg = function () {
  let list = getFavoriteList();
  $("#myFavorites").empty();
  if (list.length > 0) {
    for (let item of list) {
      if (item.type === "picsum") {
        $("#myFavorites").append(
          `<div class="loadedImgDiv"><img class="loadedImg picsum bookmark" src="${item.link}" id="${item.id}"></img><div class="favoriteFill"></div></div>`
        );
      } else if (item.type === "unsplash") {
        $("#myFavorites").append(
          `<div class="loadedImgDiv"><img class="loadedImg unsplash bookmark" src="${item.link}" id="${item.id}"></img><div class="favoriteFill"></div></div>`
        );
      } else {
        console.log("예상하지 못한 타입 ", item.type);
      }
    }
    loadedImgAni();
  } else {
    $("#myFavorites").text("즐겨찾기 된 항목이 없습니다");
    $(".loadingAni").fadeOut();
  }
};

$("#star").click(function () {
  $(".categoryName").removeClass("selectedCategory");
  changeCategory("favorite");
});

// ------------------  페이지 시작 시 실행시킬 메서드 모음 ----------------------------
let init = function () {
  console.log("인잇");

  if (!localStorage.getItem("currentUser")) {
    location.href = "index.html";
    return;
  }
  // 페이지 첫 시작시 표시 카테고리 화면결정
  let currentC = JSON.parse(localStorage.getItem("category"));
  if (currentC) {
    $(`#${currentC}`).addClass("selectedCategory");
    changeCategory(currentC);
  } else {
    console.log("카테고리 값 없음");
  }

  // 기본 클릭 이벤트들 설정 메서드
  imgClickEvent();

  // 스크롤이 하단에 닿을때마다 페이지 수 증가시키며 이미지 불러오기
  $(window).scroll(function () {
    let category = JSON.parse(localStorage.getItem("category"));
    if (category === "favorite") {
      return;
    }
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
      getImgesUnsplash(category, unsplashKey1);
    }
  });

  //스크롤 방지 해제
  $("html").css({ overflow: "auto" });
};

// -----------페이지 시작시 호출될 기본 동작 -------------

// 처음 윈도우 로드 시에 스크롤 방지
$("html").css({ overflow: "hidden" }); //로딩 중 스크롤 방지

// 현재 유저 정보를 가져오는 로직이 userInfo.js 상 window.onload에 구현되어 있으므로
// 유저 정보 가져온 이후에 기본 동작들을 호출하기 위해 window.onpageshow를 사용
window.onpageshow = function () {
  init();
};

// ------------------ 페이지 css 관련 동작 구역 ---------------
$("#logo").on({
  click: function () {
    $("#la>img").css({ width: "27px", height: "auto" });
    $("#textLogo").css({ width: "27px", height: "auto", "font-size": "15px" });

    let cUser = JSON.parse(localStorage.getItem("currentUser"));
    localStorage.setItem("beforeUser", JSON.stringify(cUser));
    location.href = "index.html";
  },
});

// 카테고리 선택될때마다 색부여(회색)
$(".categoryName").click(function () {
  $(this).addClass("selectedCategory");
  var notClicked = $(".categoryName").not(this);
  notClicked.removeClass("selectedCategory");

  // 카테고리 정보도 변경해줌
  changeCategory($(this).attr("id"));
});

// 버튼 호버
$("#star").hover(
  function () {
    $(this).css("background-color", "#ad081b");
  },
  function () {
    $(this).css("background-color", "#f51f1f");
  }
);

$("#hb2").hover(
  function () {
    $(this).css("backgroundColor", "#d0d0d0");
  },
  function () {
    $(this).css("backgroundColor", "#f0f0f0");
  }
);
