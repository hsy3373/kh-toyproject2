// ----------------------
/*

// 키에 데이터 쓰기
localStorage.setItem("key", value);

// 키로 부터 데이터 읽기
localStorage.getItem("key");

// 키의 데이터 삭제
localStorage.removeItem("key");

// 모든 키의 데이터 삭제
localStorage.clear();

// 저장된 키/값 쌍의 개수
localStorage.length
*/

// ---------------- 로컬 스토리지와 연동 구역 -------------------

// 더미 user 객체
let userList = {
  // 유저 아이디를 키값으로 씀
  userId1: {
    id: "userId1",
    pwd: "pwd1",
    favorite: {
      1: { type: "picsum", id: "1" },
      2: { type: "picsum", id: "2" },
      j34IJcOtv9w: { type: "unsplash", id: "j34IJcOtv9w" },
    },
  },
  userId2: {
    id: "userId2",
    pwd: "pwd2",
    favorite: [{ type: "picsum", id: "23" }],
  },
  dbw: {
    id: "dbw",
    pwd: "pwd1",
  },
  test: { favorite: {} },
};

// 현재 로그인 된 유저 더미
let currentUser = "userId1";

// JSON 형태로 파싱해주지 않으면 string 형태로 데이터가 오고가기 때문에
// 원할한 사용을 위해 꼭 파싱 필요
localStorage.setItem("userList", JSON.stringify(userList));
localStorage.setItem("currentUser", JSON.stringify(currentUser));
// 모달창 안의 즐겨찾기 버튼에 이벤트 부여
$("#modalFavorite").on("click", function () {
  favorAdd($(".innerImgModal"));
});

// 모달창의 즐겨찾기 버튼 이벤트
$(document).on("click", ".favoriteDiv", function () {
  favorAdd($(this).prev());
});

// todo! 나중에 시간되면 즐겨찾기 되어있을때 , 안되어있을때로 나눠서 로직 구현하기
// if($('.innerImgModal').attr('id') in uList[cUser].favorite){
//   // 이미 즐겨찾기 되어있음
// }else{
//   //
// }

// toast 메세지 띄우는 메서드
let favorToast = function (text) {
  $("#toast").text(text);
  if ($(".toastShow").length > 0) return; // 토스트 메세지 show 중이면 다시 뜨지 않도록 처리
  $("#toast").addClass("toastShow"); // show라는 클래스를 추가해서 토스트 메시지를 띄우는 애니메이션을 발동시킴
  setTimeout(function () {
    // 2700ms 후에 show 클래스를 제거함
    $("#toast").removeClass("toastShow");
  }, 2700);
};

// 즐겨찾기 추가 메서드
let favorAdd = function (img) {
  let imgClass = "";
  let imgId = img.attr("id");
  if (img.hasClass("picsum")) {
    imgClass = "picsum";
  } else {
    imgClass = "unsplash";
  }

  let cUser = JSON.parse(localStorage.getItem("currentUser"));

  // 자바스크립트 자료형에서 "", null, undefined, 0, NaN을 조건식에 넣으면 false로 반환됨
  //  currentUser가 비었는지 확인
  if (cUser) {
    let uList = JSON.parse(localStorage.getItem("userList"));

    // 만약 유저리스트 안에 currentUser 아이디 값이 없을 경우를 대비
    if (uList[cUser]) {
      uList[cUser].favorite[imgId] = {
        type: imgClass,
        id: imgId,
        link: img.attr("src"),
      };
      localStorage.setItem("userList", JSON.stringify(uList));
      favorToast("즐겨찾기에 추가되었습니다");
    } else {
      favorToast("유저 정보 없음. 다시 로그인해주세요");
      localStorage.removeItem("currentUser");
    }
  } else {
    favorToast("로그인 후 사용 가능합니다");
  }
};
