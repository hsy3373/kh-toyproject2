// 메인화면과 카테고리 화면 전체에서 동작하는 유저 정보 관련 코드들 모음

// ------------------ 로그인 정보 확인 관련 구역 (페이지 새로고침, 닫기 등에 따른 로그인 정보 관련 기본 동작 ) ---------------------

/* 브라우저는 문서를 처음 로드시 load 이벤트 다음에 pageshow 이벤트를 발생시킴, 문서를 벗어날때는 pagehide
  pageshow 이벤트의 경우 뒤로가기로 재진입한 경우에도 발생하는 이벤트
  해당 이벤트 객체의 persisted 프로퍼티의 값은 페이지가 로드/새로고침이 아니라 복원되었을 경우(뒤로 가기 등)에 true 임 - 그외는 false
*/
window.onload = function (event) {
  let navType = performance.getEntriesByType('navigation')[0].type;

  console.log(`navType : ${navType}`);
  console.log(`event.persisted : ${event.persisted}`);

  // url 접속과 그외 방법으로 접속시 처리할 동작
  if (navType != 'reload' && navType != 'back_forward') {
    // 기본적으로 현재 유저 값 삭제
    localStorage.removeItem('currentUser');

    // bUser 값이 있는, 의도된 재진입이었다면 현재 유저값 다시 할당
    let bUser = JSON.parse(localStorage.getItem('beforeUser'));
    if (bUser) {
      // 만약 로그인창이 있는 메인 화면이라면 로그인 창 none 설정시키기
      localStorage.setItem('currentUser', JSON.stringify(bUser));
      localStorage.removeItem('beforeUser');
      console.log('유저값 다시 생성후 이전 유저값 삭제');
    }
  }
};

// 로그아웃
$('#logOut').on('click', function () {
  console.log('로그아웃');
  localStorage.removeItem('currentUser');
  location.href = 'index.html';
  return;
});

// 회원탈퇴 todo!
$('#deleteUser').click(function () {
  // localStorage.removeItem('currentUser');
  // checkUserLogin();
});

// ---------------- 로컬 스토리지와 연동 구역 -------------------

//------------------------------- 즐겨찾기 관련 구역 ----------------------------

// 즐겨찾기 추가 메서드
let favorAdd = function (img) {
  let imgClass = '';
  let imgId = img.attr('id');
  if (img.hasClass('picsum')) {
    imgClass = 'picsum';
  } else {
    imgClass = 'unsplash';
  }

  let cUser = JSON.parse(localStorage.getItem('currentUser'));
  //  currentUser가 비었는지 확인
  // 자바스크립트 자료형에서 "", null, undefined, 0, NaN을 조건식에 넣으면 false로 반환됨
  if (cUser) {
    let uList = JSON.parse(localStorage.getItem('userList'));

    // 만약 유저리스트 안에 currentUser 아이디 값이 없을 경우를 대비
    if (uList[cUser]) {
      uList[cUser].favorite[imgId] = {
        type: imgClass,
        id: imgId,
        link: img.attr('src'),
      };
      localStorage.setItem('userList', JSON.stringify(uList));
      $(`#${imgId}`).next('.favoriteUnfill').attr('class', 'favoriteFill');
      favorToast('즐겨찾기에 추가되었습니다');
    } else {
      favorToast('유저 정보 없음. 다시 로그인해주세요');
      localStorage.removeItem('currentUser');
    }
  } else {
    favorToast('로그인 후 사용 가능합니다');
  }
};

// 즐겨찾기 삭제하는 메서드
let favorRemove = function (img) {
  let imgId = img.attr('id');
  let cUser = JSON.parse(localStorage.getItem('currentUser'));
  //  currentUser가 비었는지 확인
  // 자바스크립트 자료형에서 "", null, undefined, 0, NaN을 조건식에 넣으면 false로 반환됨
  if (cUser) {
    let uList = JSON.parse(localStorage.getItem('userList'));

    // 만약 유저리스트 안에 currentUser 아이디 값이 없을 경우를 대비
    if (uList[cUser]) {
      // 로컬스토리지 데이터에서 해당 즐겨찾기 삭제
      delete uList[cUser].favorite[imgId];
      localStorage.setItem('userList', JSON.stringify(uList));

      // 만약 즐겨찾기 영역에 해당 아이디 값 가진 이미지 요소 있으면 삭제
      $(`.bookmark#${imgId}`).parent().remove();
      // 해당 이미지 아이디를 가진 요소의 형제 요소 클래스 바꿔서 북마크 아이콘 변경
      $(`#${imgId}`).next('.favoriteFill').attr('class', 'favoriteUnfill');

      favorToast('즐겨찾기가 삭제되었습니다');
    } else {
      favorToast('유저 정보 없음. 다시 로그인해주세요');
      localStorage.removeItem('currentUser');
    }
  } else {
    favorToast('로그인 후 사용 가능합니다');
  }
};

// toast 메세지 띄우는 메서드
let favorToast = function (text) {
  $('#toast').text(text);
  if ($('.toastShow').length > 0) return; // 토스트 메세지 show 중이면 다시 뜨지 않도록 처리
  $('#toast').addClass('toastShow'); // show라는 클래스를 추가해서 토스트 메시지를 띄우는 애니메이션을 발동시킴
  setTimeout(function () {
    // 2700ms 후에 show 클래스를 제거함
    $('#toast').removeClass('toastShow');
  }, 2700);
};

// 모달창 안의 즐겨찾기 버튼에 이벤트 부여
$('#modalFavorite').on('click', function () {
  let id = $('.innerImgModal').attr('id');
  if ($(this).attr('class') == 'favoriteFill') {
    console.log('favoriteFill 로 들어와서 리무브 됨');
    favorRemove($('.innerImgModal'));

    $(`#myFavorites`);

    $(`#${id}:not(.innerImgModal)`).next().attr('class', 'favoriteUnfill');
    $(this).attr('class', 'favoriteUnfill');
  } else if ($(this).attr('class') == 'favoriteUnfill') {
    console.log('favoriteUnfill 로 들어와서 add 됨');
    favorAdd($('.innerImgModal'));
    $(`#${id}:not(.innerImgModal)`).next().attr('class', 'favoriteFill');
    $(this).attr('class', 'favoriteFill');
  } else {
    console.log('클래스값 제대로 못찾음');
  }
});

// 이미지 즐겨찾기 버튼 이벤트
$(document).on('click', '.favoriteUnfill:not(#modalFavorite)', function () {
  favorAdd($(this).prev());
});

// 이미지 즐겨찾기 버튼 이벤트
$(document).on('click', '.favoriteFill:not(#modalFavorite)', function () {
  favorRemove($(this).prev());
});
