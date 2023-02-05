// const myModal = document.getElementById("#exampleModal");

// myModal.addEventListener("shown.bs.modal", () => {});

// $(function () {
//   $("button").click(function () {
//     $("#exampleModal").on("shown.bs.modal", function () {});
//   });
// });

AOS.init();

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

$('#testBtn').click(function () {
  let id = 23;
  $.ajax({
    method: 'GET',
    url: `https://picsum.photos/id/${id}/info`,
    dataType: 'json',
  }).done(function (msg) {
    console.log(msg);

    $('#imgAuthor').text(msg.author);
    // $('#imgUrl').text(msg.download_url);
    // $('#imgHeight').text(msg.height);
    // $('#imgWidth').text(msg.width);

    $('#img-div').append(
      `<img class="test-img" src="${msg.download_url}" id="${msg.id}"></img>`
    );
  });
});

let userList = {
  ['userId1']: {
    id: 'userId1',
    pwd: 'pwd1',
    favorite: [
      {
        type: 'picsum',
        id: '14',
        url: 'https://picsum.photos/id/14/2500/1667',
      },
      {
        type: 'picsum',
        id: '14',
        url: 'https://picsum.photos/id/14/2500/1667',
      },
      {
        type: 'unsplash',
        id: 'v1QmkLHgURc',
        url: 'https://images.unsplash.com/photo-1673182770245-c4b1c119d6ea?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=Mnw0MDUwNTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzUyNTM5NTU&amp;ixlib=rb-4.0.3&amp;q=80&amp;w=1080',
      },
    ],
  },
  ['userId2']: {
    id: 'userId2',
    pwd: 'pwd2',
    favorite: [
      {
        type: 'picsum',
        id: '14',
        url: 'https://picsum.photos/id/14/2500/1667',
      },
      {
        type: 'picsum',
        id: '14',
        url: 'https://picsum.photos/id/14/2500/1667',
      },
      {
        type: 'unsplash',
        id: 'v1QmkLHgURc',
        url: 'https://images.unsplash.com/photo-1673182770245-c4b1c119d6ea?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=Mnw0MDUwNTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzUyNTM5NTU&amp;ixlib=rb-4.0.3&amp;q=80&amp;w=1080',
      },
    ],
  },
};
let currentUser = 'userId';

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

localStorage.setItem('testjson1', 'test');

localStorage.setItem('testjson2', JSON.stringify('test'));

console.log(
  // 파싱이 안됨
  // JSON.parse(localStorage.getItem('testjson1')),
  localStorage.getItem('testjson1')
);

console.log(
  JSON.parse(localStorage.getItem('testjson2')),
  localStorage.getItem('testjson2')
);
