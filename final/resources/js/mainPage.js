// ------------------------메인 페이지 구역-------------------------------
// 로고 클릭시 작아짐 클릭하지 않았을때는 다시 원상태
$('#logo').on({
  click: function () {
    $('#la>img').css({ width: '27px', height: 'auto', 'font-size': '15px' });
    $('#textLogo').css({ width: '27px', height: 'auto', 'font-size': '15px' });
  },
});

// 버튼 호버

$('#star, #hb1').hover(
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

$('.c1, .c2, .c3, .c4').hover(
  function () {
    $('.category>div').css('border', '5px solid rgb(216, 54, 108)');
  },
  function () {
    $('.category>div').css('border', '');
  }
);

// ------------------------slickSlide 구역-------------------------------
$('.slickSlide').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  draggable: false,
  autoplay: false,
  infinite: false,
  vertical: true,
  dots: false, // 테스트용 도트
  nextArrow: $('.goCt'),
  prevArrow: $('.prevNone'),
  //  initialSlide: 0 => default
});

// 마우스 휠로 슬라이드 이동
$('.slickSlide').on('wheel', function (e) {
  e.preventDefault();

  if (e.originalEvent.deltaY < 0) {
    $(this).slick('slickPrev');
  } else {
    $(this).slick('slickNext');
  }
});

var f1b = document.getElementById('f1b');
setInterval(function () {
  var color = Math.random() * 0xffffff;
  color = parseInt(color);
  color = color.toString(16);

  f1b.style.background = '#' + color;
}, 3000);

$('.autoplay').slick({
  slidesToShow: 4,
  // slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  Infinity: true,
  dots: false,
  prevArrow: $('.prevArrow'),
  nextArrow: $('.nextArrow'),
  // ,
  // appendDots: $(".dots")
});
