let getImges = function (page, number) {
  $.ajax({
    method: "GET",
    url: `https://picsum.photos/v2/list?page=${page}&limit=${number}`,
    dataType: "json",
    beforeSend: function () {
      $("#loading").show();
    },
  }).done(function (msg) {
    console.log(msg);
    goimg(msg);
  });
};

// $.ajax({
//   method: 'GET',
//   url: 'https://picsum.photos/v2/list?page=2&limit=20',

//   dataType: 'json',
//   beforeSend: function () {
//     $('#loading').show();
//   },
// }).done(function (msg) {
//   goimg(msg);
//   $('#loading').hide();
// });

// $.ajax({
//   method: "GET",
//   url: `https://api.unsplash.com/photos/random?count=5`,
//   dataType: "json",
//   beforeSend: function (xhr) {
//     $("#loading").show();
//     xhr.setRequestHeader(
//       "Authorization",
//       "Client-ID " + "8f8MJ6PUF8d_TQPhyNFoow_r8dZXUXojqWuT1oBEw5k"
//     );
//   },
// }).done(function (msg) {
//   // $("#loading").hide();
//   console.log(msg);
//   goimg2(msg);
// });

$.ajax({
  method: "GET",
  url: `https://api.unsplash.com/photos/?client_id=8f8MJ6PUF8d_TQPhyNFoow_r8dZXUXojqWuT1oBEw5k`,
  dataType: "json",
  beforeSend: function (xhr) {
    $("#loading").show();
    xhr.setRequestHeader(
      "Authorization",
      "Client-ID " + "8f8MJ6PUF8d_TQPhyNFoow_r8dZXUXojqWuT1oBEw5k"
    );
  },
}).done(function (msg) {
  // $("#loading").hide();
  console.log(msg);
  goimg2(msg);
});

let goimg = function (list) {
  let int = -1;
  for (let item of list) {
    if (int >= $(".grid").children().length) {
      int = 0;
    } else {
      int++;
    }
    let img = `<div class="load-img"><img class="loaded-img" src="${item.download_url}" id="${item.id}"></img></div>`;
    $(`.grid>:nth-child(${int})`).append(img);
  }

  $(`img[src="${$(list).get(-1).download_url}"]`).on(`load`, function () {
    $(".loaded-img")
      .css({
        animation: "transY 2.5s forwards",
      })
      .delay(2600)
      .queue(function () {
        $(this).removeClass("loaded-img");
      })
      .css("opacity", 1);
  });
};

let goimg2 = function (list) {
  let int = -1;
  for (let item of list) {
    if (int >= $(".grid").children().length) {
      int = 0;
    } else {
      int++;
    }

    let img = `<div class="load-img"><img class="ani-test" src="${item.urls.regular}" id="${item.id}"></img></div>`;
    $(`.grid>:nth-child(${int})`).append(img);
  }

  $(`img[src="${$(list).get(-1).urls.regular}"]`).on(`load`, function () {
    $(".ani-test")
      .css({
        animation: "transY 2.5s forwards",
      })
      .delay(2600)
      .queue(function () {
        $(this).removeClass("ani-test");
      })
      .css("opacity", 1);
  });
};

const loader = $(".loader");
const html = $("html");

html.css({ overflow: "hidden" }); //로딩 중 스크롤 방지

$(window).on("load", () => {
  setTimeout(() => {
    //  <-* 로딩속도 구현

    loader.fadeOut(300);
    html.css({ overflow: "auto" }); //스크롤 방지 해제
  }, 2000); //  <-* 로딩속도 구현
});

var page = 3;

$(window).scroll(function () {
  if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    console.log(++page);
    // getImges(page, 15);
  }
});
