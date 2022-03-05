const firebaseConfig = {
    apiKey: "AIzaSyDfvN2kZo41BNoej8GWNeVVtl6R6we1a9Y",
    authDomain: "bbs-practice-1.firebaseapp.com",
    projectId: "bbs-practice-1",
    storageBucket: "bbs-practice-1.appspot.com",
    messagingSenderId: "273720413604",
    appId: "1:273720413604:web:34d287324a139d06b0c531"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
let dataList = []
let contents =" "
const store = {
    currentPage : 1,
}



function getCurrentTime(val){
    let _t = val
    let yyyy = _t.getFullYear()
    let mm = _t.getMonth() < 10 ? '0' + _t.getMonth() : _t.getMonth()
    let dd = _t.getDate() < 10 ? '0' + _t.getDate() : _t.getDate()
    let hh = _t.getHours()  < 10 ? '0' + _t.getHours() : _t.getHours()
    let min = _t.getMinutes()  < 10 ? '0' + _t.getMinutes() : _t.getMinutes()
    let sec = _t.getSeconds()  < 10 ? '0' + _t.getSeconds() : _t.getSeconds()
    return `${yyyy}/${mm}/${dd} ${hh}:${min}:${sec}` // 리턴값이 업스면 undefined으로 돌려줌
}


function onLoadData(){
    let contents = ""
    let pagination = ""
    contents =`<div class="btnArea">
    <div><button onclick="writeBtn()">글쓰기</button></div>
</div>
<table class="table">
    <thead>
        <tr>
            <th class="col-1">번호</th>
            <th class="col-6">제목</th>
            <th class="col-3">작성자</th>
            <th class="col-2">시간</th>
        </tr>
    </thead>
    <tbody>`
    db.collection('bbs')
        .get()
        .then((result)=>{
            result.forEach((doc)=>{
                dataList.push({
                    _id : doc.id,
                    _other : doc.data(),
                })
            }) 

            for(i = (store.currentPage - 1)*10 ; i < store.currentPage * 10 ; i++){
                contents += `<tr>
                <th scope="row">${dataList[i]._other.no}</th>
                <td><a href="#/show/${dataList[i]._id}">${dataList[i]._other.제목}</a></td>
                <td>${dataList[i]._other.작성자}</td>
                <td>${getCurrentTime(new Date(dataList[i]._other.작성일.seconds * 1000))}</td>
                </tr>`
            }
            contents += `</tbody>
            </table>
        </div>`
            pagination =` 
            <div aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item">
                        <a class="page-link" href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">
                        <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li class="page-item"><a class="page-link" href="#/page/1">1</a></li>
                    <li class="page-item"><a class="page-link" href="#/page/2">2</a></li>
                    <li class="page-item"><a class="page-link" href="#/page/3">3</a></li>
                    <li class="page-item">
                        <a class="page-link" href="#/page/${store.currentPage + 1}">
                        <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </div>`
            document.getElementById("bbs").innerHTML = contents
            document.getElementById("pageArea").innerHTML = pagination
        })
        
        .catch((error) => {
            console.log("Error onLoadData documents:", error);
        })        
}


function writeBtn(){
    pagination = ''
    let writeArea =`
    <div class="input-group mb-3">
        <span class="input-group-text" id="inputGroup-sizing-default">제목</span>
        <input id="titleBox" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
    </div>
    <div class="mb-3">
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
    </div>
    <div class="btnArea">
        <div><button onclick="upLoadBtn()">올리기</button></div>
    </div>`
    document.getElementById("bbs").innerHTML = writeArea
    document.getElementById("pageArea").innerHTML = pagination
}

function upLoadBtn(){
    db.collection('bbs').add({
        no : 1,
        제목 : $('#titleBox').val(),
        내용 : $('#exampleFormControlTextarea1').val(),
        작성일 : new Date(),
        작성자 : 'User',
    })
    onLoadData()
}

window.addEventListener('hashchange', router)

function router(){
    let routePath = location.hash;
    if (routePath == ''){
        onLoadData()
    } else if(routePath.indexOf("page") >= 0){
        store.currentPage = Number(routePath.substring(7))
        onLoadData()
    } else{
        loadContent()
    }
}
router()

function loadContent(){
    let contents = ""
    let pagination = ""
    let contentId = location.hash.substring(7)
    let theItem = dataList.find(doc=>doc._id == contentId)
    
    contents = `
    <table class="table">
                <tbody>
                    <tr>
                        <th class="border_bottom bg txt_center">제목</th>
                        <td class="border_bottom" colspan="5">${theItem._other.제목}</td>
                    </tr>
                    <tr>
                        <th class="border_bottom bg txt_center">작성자</th>
                        <td class="border_bottom">${theItem._other.작성자}</td>
                        <th class="border_bottom bg txt_center">작성일</th>
                        <td class="border_bottom">${getCurrentTime(new Date(theItem._other.작성일.seconds * 1000))}</td>
                        <th class="border_bottom bg txt_center">조회수</th>
                        <td class="border_bottom">43</td>
                    </tr>
                    <tr>
                        <td class="border_bottom board_content" colspan="6">
                        ${theItem._other.내용}
                        </td>
                    </tr> 
                </tbody>
            </table>
            <div class = "mb-3 d-flex justify-content-end">
                <button class="me-2" onclick="updateBtn()">수정</button>
                <button class="me-2" onclick="deleteBtn()">삭제</button>
                <button class="me-2" onclick = "location.href ='#/page/${store.currentPage}';">목록으로</button>
            </div>
            <div class="form-floating">
                <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                <label for="floatingTextarea">Comments</label>
            </div>
            <div class = "mt-1 d-flex justify-content-end">
                <button class="me-2">댓글남기기</button>
            </div>
        </div>
        <div>
    `
    document.getElementById("bbs").innerHTML = contents
    document.getElementById("pageArea").innerHTML = pagination
}

function deleteBtn(){
    let _id = location.hash.substring(7)
    db.collection('bbs').doc(_id).delete()
        .then(()=>{
            onLoadData()
        })
}

function updateBtn(){
    let _id = location.hash.substring(7)
    let theItem = dataList.find(doc=>doc._id == _id)
    pagination = ''
    let updateArea =`
        <div class="input-group mb-3">
            <span class="input-group-text" id="inputGroup-sizing-default">제목</span>
            <input id="titleBox" value="${theItem._other.제목}" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
        </div>
        <div class="mb-3">
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3">${theItem._other.내용}</textarea>
        </div>
        <div class="btnArea">
            <div><button onclick="updateBtn2()">수정하기</button></div>
        </div>`
    document.getElementById("bbs").innerHTML = updateArea
    document.getElementById("pageArea").innerHTML = pagination

    
}

function updateBtn2(){
    let _id = location.hash.substring(7)
    db.collection('bbs').doc(_id).update({
        no : 1,
        제목 : $('#titleBox').val(),
        내용 : $('#exampleFormControlTextarea1').val(),
        작성일 : new Date(),
        작성자 : 'User',
    })
    onLoadData()
}


//추가사항
//1. 페이지네이션
//2. 로그인
//3. 로그인 사용자