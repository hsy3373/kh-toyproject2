// ------------------------메인 페이지 구역-------------------------------
// 로고 클릭시 작아짐 클릭하지 않았을때는 다시 원상태
$("#logo").on({
  click: function () {
    $("#la>img").css({ width: "27px", height: "auto", "font-size": "15px" });
    $("#textLogo").css({ width: "27px", height: "auto", "font-size": "15px" });
    let cUser = JSON.parse(localStorage.getItem("currentUser"));
    localStorage.setItem("beforeUser", JSON.stringify(cUser));
    location.href = "index.html";
  },
});

// 버튼 호버

$("#star, #hb1").hover(
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

$(".category>div").hover(
  function () {
    $(this).css({ border: "5px solid rgb(216, 54, 108)", "z-index": "2" });
  },
  function () {
    $(this).css({ border: "", "z-index": "" });
  }
);

$(".category>div").hover(
  function () {
    $(".category h4").addClass("hoverCt").css("visibility", "visible");
  },
  function () {
    $(".category h4").removeClass("hoverCt").css("visibility", "hidden");
  }
);

$("#f1b").hover(
  function () {
    $(this).addClass("transYb");
  },
  function () {
    $(this).removeClass("transYb");
  }
);

// ------------------------slickSlide 구역-------------------------------
$(".slickSlide").slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  draggable: false,
  autoplay: false,
  infinite: false,
  vertical: true,
  dots: false, // 테스트용 도트
  nextArrow: $(".goCt"),
  prevArrow: $(".prevNone"),
  //  initialSlide: 0 => default
});

// 마우스 휠로 슬라이드 이동
$(".slickSlide").on("wheel", function (e) {
  e.preventDefault();

  if (e.originalEvent.deltaY < 0) {
    $(this).slick("slickPrev");
  } else {
    $(this).slick("slickNext");
  }
});

var f1b = document.getElementById("f1b");
setInterval(function () {
  var color = Math.random() * 0xffffff;
  color = parseInt(color);
  color = color.toString(16);

  f1b.style.background = "#" + color;
}, 3000);

$(".autoplay").slick({
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2700,
  infinite: true,
  dots: false,
  prevArrow: $(".prevArrow"),
  nextArrow: $(".nextArrow"),
  speed: 2200,
  // cssEase: "linear",
  // ,
  // appendDots: $(".dots")
});

// ---------메인 페이지 이미지 관련----------------

let unsplashKey1 = "DdupjOmqsFLJM715aoqKaNwOTg3DoTDlVX6kmMHT9jk";
let unsplashKey2 = "0vljd_3IVQy3guaXeAHgo9VKYGSvFBWCaEuYkp4R89k";
let unsplashKey3 = "-nwvkN9jP_iusw2zg2YbLPJFOPsTpJmRldNZhBoojXM";
let unsplashKey4 = "8f8MJ6PUF8d_TQPhyNFoow_r8dZXUXojqWuT1oBEw5k";

/**
 * @param {*} query  해당 api 로 전송할 url 뒷부분 (=명령어, 쿼리)
 * @param {*} category 불러온 이미지를 넣을 요소
 */
let getImgesUnsplash = function (query, category, key) {
  $.ajax({
    method: "GET",
    url: `https://api.unsplash.com/photos${query}`,
    dataType: "json",
    beforeSend: function (xhr) {
      $(".loadingAni").fadeIn(300);
      xhr.setRequestHeader("Authorization", "Client-ID " + key);
    },
    error: function (jqXHR) {
      console.log(jqXHR); //응답 메시지
      if (key != unsplashKey2) {
        getImgesUnsplash(query, category, unsplashKey2);
      }
      return;
    },
  }).done(function (msg) {
    putImgUnsplashMain(msg, category);
  });
};

let putImgUnsplashMain = function (msg, category) {
  if (msg[0]) {
    msg = msg[0];
  }
  try {
    $(category).css({
      ["background-image"]: `url(${msg.urls.regular})`,
      ["background-size"]: "contain",
      id: msg.id,
    });
  } catch (e) {
    console.log(e);
    console.log("에러난", msg);
    console.log(category);
    console.log(typeof msg);
  }
  // console.log(msg);
};

// picsum용 이미지 세팅 함수
let putImgPicsum = function () {
  for (let i = 0; i < 20; i++) {
    let int = Math.floor(Math.random() * 100);
    console.log(typeof $(`#c2 img`));
    $($(`#c2 img`)[i]).attr(
      "src",
      `https://picsum.photos/400/500?random=${int}`
    );
  }
};

// 상단 최신 이미지들 구역 기본 이미지들 삭제
$(`#c2 img`).attr("src", "");
// 메인 상단 최신 이미지들에 픽섬에서 따온 랜덤 이미지 부여
putImgPicsum();

// 카테고리들에 각각 이미지 할당
getImgesUnsplash("/random?count=1", ".category>.c0", unsplashKey1);
getImgesUnsplash(
  "/random?query=animals&count=1",
  ".category>.c1",
  unsplashKey1
);
getImgesUnsplash("/random?query=food&count=1", ".category>.c2", unsplashKey1);
getImgesUnsplash(
  "/random?query=fashion-beauty&count=1",
  ".category>.c3",
  unsplashKey1
);

// 클릭시 해당 클래스명을 가지는 카테고리로 이동(페이지 변경됨)
$(".c0, .c1, .c2, .c3, #star").click(function () {
  let cUser = JSON.parse(localStorage.getItem("currentUser"));
  localStorage.setItem("beforeUser", JSON.stringify(cUser));
  localStorage.setItem("category", JSON.stringify($(this).attr("class")));
  location.href = "categoryPage.html";
});
