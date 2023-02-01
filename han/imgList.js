// picsum 에서 원하는 특정페이지의, 원하는 갯수만큼 이미지 불러오기
let getImgesPicsum = function (page, number) {
  $.ajax({
    method: 'GET',
    url: `https://picsum.photos/v2/list?page=${page}&limit=${number}`,
    dataType: 'json',
    // ajax가 정보를 요청하기 전단계에서 실행됨
    beforeSend: function () {
      $('.loading-ani').show();
      // todo! 로딩 애니메이션 넣기
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
    if (int >= $('.img-list-wrap').children().length) {
      int = 0;
    } else {
      int++;
    }

    $(`.img-list-wrap>:nth-child(${int})`).append(
      `<div class="loaded-img-div"><img class="loaded-img picsum-img" src="${item.download_url}" id="${item.id}"></img></div>`
    );
    // 추후 픽섬에서 해당 이미지 아이디값을 검색해와야 할 경우를 위해 따로 클래스명 둠
  }

  // msg 리스트 상 가장 마지막에 추가된 img 태그의 이미지 로드가 끝나면 함수 실행
  $(`img[src="${$(msg).get(-1).download_url}"]`).on(
    `load`,
    loadedImgAni('.loaded-img')
  );
};

// 이미지 로드시 살짝 위로 올라오는 애니메이션 효과 적용
// todo! : 한번에 적용되고 한번에 풀리는식인데 순차적으로 적용시킬 수 있으면 해보기
let loadedImgAni = function (selector) {
  $(selector)
    .css({
      animation: 'transY 2.5s forwards',
    })
    .delay(2600)
    .queue(function () {
      $(this).removeClass(selector);
    })
    .css('opacity', 1);
  // 애니메이션 실행이후 그대로 남아있도록 하기 위해 opacity설정
};
