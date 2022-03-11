let firebaseConfig = {
    apiKey: "AIzaSyDfvN2kZo41BNoej8GWNeVVtl6R6we1a9Y",
    authDomain: "bbs-practice-1.firebaseapp.com",
    projectId: "bbs-practice-1",
    storageBucket: "bbs-practice-1.appspot.com",
    messagingSenderId: "273720413604",
    appId: "1:273720413604:web:34d287324a139d06b0c531"
};

firebase.initializeApp(firebaseConfig);



$(document).ready(function ($) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log(JSON.stringify(user))
            localStorage.setItem('user', JSON.stringify(user))
            $("#profile").css("display","block");
            $("#profile_image").attr("src",user.photoURL);
            $("#profile_info").css("display","block")
            $("#navbarDropdown").text(user.displayName)
            $("#logInBtn").css("display","none")
            $("#logOutBtn").css("display","block")
        }
        else{ 
            console.log("not log in")
            $("#profile").css("display","none");
            $("#profile_image").attr("src","");
            $("#profile_info").css("display","none")
            $("#navbarDropdown").text("")
            $("#logInBtn").css("display","block")
            $("#logOutBtn").css("display","none")
        }
    });
})

function googleLogIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/plus.login");
    provider.setCustomParameters({
    prompt: "select_account"
    });
    firebase.auth().signInWithRedirect(provider).then(function (result) {
    firebase.auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
        console.log(user)
    })
    .catch(function (error) {// Handle Errors here.
    var errorCode = error.code;
    // The email of the user's account used.
    var email = error.email;
    });
    });
    }

function logOut(){
    firebase.auth().signOut().then(function () {
    }, function (error) {
    //DO
    });
}


const db = firebase.firestore()
let dataList = []
let store = {
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
    return `${yyyy}/${mm}/${dd} ${hh}:${min}:${sec}` 
}

function getData(cb) {
    dataList = []
    db.collection('bbs')
        .get()
        .then((response)=>{
            response.forEach((doc)=>{
                dataList.push({
                    _id : doc.id,
                    _other : doc.data(),
                })
            })
            
            cb(dataList)
        })
        .catch((error) => {
            console.log("Error onLoadData documents:", error);
        })
}

function onLoadData(){
    getData(function(dataList){
    let contents = []
    let pagination = []
    let template = `
        <div class="btnArea">
            <div><button onclick="writeBtn()">글쓰기</button></div>
        </div>
        <div>
            <table class="table">
                <thead>
                    <tr>
                        <th class="col-1">번호</th>
                        <th class="col-6">제목</th>
                        <th class="col-3">작성자</th>
                        <th class="col-2">시간</th>
                    </tr>
                </thead>
                <tbody>
                    {{__title__List}}
                </tbody>
            </table>
        </div>
        <div class="pageArea" id="pageArea">
            <div aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item">
                        <a class="page-link" href="#/page/{{__prev__page}}">
                        <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    {{__page__}}
                    <li class="page-item">
                        <a class="page-link" href="#/page/{{__next__page}}">
                        <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>`

        dataList.sort(function(a,b){
            return b._other.no - a._other.no;
        })
        
    
    for(i = (store.currentPage - 1)*10 ; i < ((store.currentPage * 10) > dataList.length ? dataList.length :(store.currentPage * 10)) ; i++){
        contents.push( `<tr>
        <th scope="row">${dataList[i]._other.no}</th>
        <td><a href="#/show/${dataList[i]._id}">${dataList[i]._other.제목}</a></td>
        <td>${dataList[i]._other.작성자}</td>
        <td>${getCurrentTime(new Date(dataList[i]._other.작성일.seconds * 1000))}</td>
        </tr>`)
    }

    for(j = 0 ; j < Math.ceil(dataList.length/10) ; j++){

        pagination.push(`
        <li class="page-item"><a class="page-link" href="#/page/${j+1}">${j+1}</a></li>
        `)
    }
        
    template = template.replace('{{__prev__page}}',store.currentPage > 1 ? store.currentPage - 1 : 1)
    template = template.replace('{{__page__}}', pagination.join(''))
    template = template.replace('{{__next__page}}', Math.ceil(dataList.length/10) > store.currentPage ? store.currentPage + 1 : Math.ceil(dataList.length/10))
    template = template.replace('{{__title__List}}',contents.join(''))
    document.getElementById("bbs").innerHTML = template
    })
}



function writeBtn(){
    let template =`
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
    document.getElementById("bbs").innerHTML = template
}

function upLoadBtn(){
    let number = 0
    db.collection('no')
        .get()
        .then((response)=>{response.forEach((doc)=>{
            number = doc.data().no

            db.collection('no').doc('no')
                .update({
                no : number + 1
                })

            db.collection('bbs').add({
                no : number + 1,
                제목 : $('#titleBox').val(),
                내용 : $('#exampleFormControlTextarea1').val(),
                작성일 : new Date(),
                작성자 : JSON.parse(localStorage.user).displayName,
                uid : JSON.parse(localStorage.user).uid,
            })
        })
        onLoadData()
        })
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
    getData(function(dataList){

        let contentId = location.hash.substring(7)
        let theItem = dataList.find(doc=>doc._id == contentId)
        
        let template = `
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
                <div>
                
                </div>

        `
        document.getElementById("bbs").innerHTML = template
    })
}

function deleteBtn(){
    let _id = location.hash.substring(7)
    db.collection('bbs').doc(_id).delete()
        .then(()=>{
            location.href =`#/page/${store.currentPage}`
        })
}

function updateBtn(){
    let _id = location.hash.substring(7)
    let theItem = dataList.find(doc=>doc._id == _id)
    let template =`
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
    document.getElementById("bbs").innerHTML = template

    
}

function updateBtn2(){
    let _id = location.hash.substring(7)
    db.collection('bbs').doc(_id).update({
        제목 : $('#titleBox').val(),
        내용 : $('#exampleFormControlTextarea1').val(),
        작성일 : new Date(),
        작성자 : JSON.parse(localStorage.user).displayName,
    })
        .then(()=>{
            loadContent()
        })
    
}


//추가사항
//2. 로그인
//3. 로그인 사용자
//4. 댓글기능 추가
