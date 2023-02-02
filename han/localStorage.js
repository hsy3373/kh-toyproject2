// ---------------- 로컬 스토리지와 연동 구역 -------------------

// 더미 user 객체

let userList = {
  // 유저 아이디
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
};
// 현재 로그인 된 유저
let currentUser = "userId1";

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

// JSON 형태로 파싱해주지 않으면 string 형태로 데이터가 오고가기 때문에
// 원할한 사용을 위해 꼭 파싱 필요
localStorage.setItem("userList", JSON.stringify(userList));

$("#modalFavorite").on("click", function () {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log(currentUser);

  // 자바스크립트 자료형에서 "", null, undefined, 0, NaN을 조건식에 넣으면 false로 반환됨
  //  currentUser가 비었는지 확인
  if (currentUser) {
    console.log("null 아님");
    let uList = JSON.parse(localStorage.getItem("userList"));
    let favor = {
      type: $(".innerImgModal").attr("class"),
      id: $(".innerImgModal").attr("id"),
    };
    uList[currentUser].favorite.push(favor);
  } else {
    console.log("null 임");
    currentUser = {
      1: { type: "picsum", id: "1" },
      2: { type: "picsum", id: "2" },
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }
});

// ulist["변수"].id = "변수";

// ulist["변수"].pwd = "pwd1";

// console.log(ulist, typeof ulist);

// test(() => {
//   console.log("test");
// });

// window.onload = test;
