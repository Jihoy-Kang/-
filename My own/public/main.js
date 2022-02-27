const firebaseConfig = {
    apiKey: "AIzaSyD47SoY-tAmOmh5XYhJLIerZLDJR0zcwms",
    authDomain: "my-own-2f093.firebaseapp.com",
    projectId: "my-own-2f093",
    storageBucket: "my-own-2f093.appspot.com",
    messagingSenderId: "1035026129566",
    appId: "1:1035026129566:web:f4467f350bbbd22699d18f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


//jquery를 활용한 로그인 기능
$(document).ready(function ($) {
    firebase.auth().onAuthStateChanged(function (user) {
    onLoadData() // 로그인 전후 상관없이 리스트 보여주기 위해서 여기에 함수 실행
    if (user) {
        console.log(user)
        $("#profile").css("display","block")
        $("#profile_img").attr("src",user.photoURL)
        $("#profile.info").css("display","block")
        $("#profile_img").text(user.displayName)
        $("#logInButton").css("display","none")
        $("#logOutButton").css("display","block")

    }
    else{ 
        console.log('not login')
        $("#profile").css("display","none")
        $("#profile_img").attr("src","")
        $("#profile.info").css("display","none")
        $("#profile_img").text("")
        $("#logInButton").css("display","block")
        $("#logOutButton").css("display","none")
    }
    });
    });



function logOut(){
    firebase.auth().signOut().then(function () {
    }, function (error) {
    //DO
    });
}



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
            })
            .catch(function (error) {// Handle Errors here.
                var errorCode = error.code;
                // The email of the user's account used.
                var email = error.email;
            });
    });
}


//CRUD 기능
let db = firebase.firestore(); // firestore DB 불러오는 코드 규칙설정 true로 해야 접근가능

//데이터 기록
function onAddRecord() {
    var _no = 2; // 번호 자동생성하는거 알면 좋을듯
    var _title = $("#exampleInputTitle").val();
    var _name = $("#exampleInputName").val();
    var _date = new Date();


    db.collection("bbs").add({
        No : _no,
        작성자: _name,
        제목: _title,
        작성일 : _date
    })
        .then((docRef) => {

            var _str = "<tr>";
            _str += "<td>" + _no + "</td>";
            _str += "<td>" + _title + "</td>";
            _str += "<td>" + _name + "</td>";
            _str += "<td>" + _date + "</td></tr>";
            $("#tblData").append(_str)

            $("#exampleInputTitle").val("");
            $("#exampleInputName").val("");
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}



//데이터 불러오기

var _allBbs = [];
function onLoadData() {
    $("#tblData").empty();
    db.collection("bbs")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var _t = {
                    id: doc.id,
                    value: doc.data()
                }
                _allBbs.push(_t);
                var _str = '<tr onclick="onSelectData(\'' + doc.id + '\')">';
                _str += "<td>" + doc.data().No + "</td>";
                _str += "<td>" + doc.data().제목 + "</td>";
                _str += "<td>" + doc.data().작성자 + "</td>";
                _str += "<td>" + getCurrentTime(
                    new Date(doc.data().작성일.seconds * 1000)
                    ) + "</td></tr>";
                $("#tblData").append(_str);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

//업데이트
//데이터 선택시 수정할 술 있는 펑션
function onSelectData(id) {
    console.log(id);

    var _item = _allBbs.find(item => item.id == id);

    console.log(_item)
    if (_item) {
        $("#btnUpdate").attr("data-rec-id", id);
        $("#btnDelete").attr("data-rec-id", id);
        $("#exampleInputTitle").val(_item.value.제목);
        $("#exampleInputName").val(_item.value.작성자);
    }
    else {
        $("#btnUpdate").attr("data-rec-id", '')
        $("#btnDelete").attr("data-rec-id", '')
    }
}

function onUpdateRecord(){
    var _no = 2; // 번호 자동생성하는거 알면 좋을듯
    var _title = $("#exampleInputTitle").val();
    var _name = $("#exampleInputName").val();
    var _date = new Date();
    let db = firebase.firestore();
    var _id = $("#btnUpdate").attr("data-rec-id")
    var mRef = db.collection('bbs').doc(_id);
    mRef
    .update({
        No : _no,
        작성자: _name,
        제목: _title,
        작성일 : _date
    })
    .then(function() {
        onLoadData()
    });
}

// 삭제기능
function onDeleteRecord(){
    var user = firebase.auth().currentUser;
    if(user){
        var _id = $("#btnDelete").attr("data-rec-id")
        db.collection("bbs").doc(_id).delete().then(() => {

            $("#exampleInputTitle").val('');
            $("#exampleInputName").val('');
            console.log("Document successfully deleted!");
            onLoadData()
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }else{
        alert("Not Login")
    }
}
    



//시간 정상화


function getCurrentTime(val) {
    var t = "";
    var t1 = new Date(val);
    var yyyy = t1.getFullYear().toString();
    var mm = (t1.getMonth() + 1).toString();
    var dd = t1.getDate().toString();
    var hh = t1.getHours() < 10 ? "0" + t1.getHours() : t1.getHours();
    var min = t1.getMinutes() < 10 ? "0" + t1.getMinutes() : t1.getMinutes();
    var ss = t1.getSeconds() < 10 ? "0" + t1.getSeconds() : t1.getSeconds();
    t =
        yyyy +
        "/" +
        (mm[1] ? mm : "0" + mm[0]) +
        "/" +
        (dd[1] ? dd : "0" + dd[0]) +
        " " +
        hh +
        ":" +
        min +
        ":" +
        ss;
    return t;
}