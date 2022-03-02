const firebaseConfig = {
    apiKey: "AIzaSyDfvN2kZo41BNoej8GWNeVVtl6R6we1a9Y",
    authDomain: "bbs-practice-1.firebaseapp.com",
    projectId: "bbs-practice-1",
    storageBucket: "bbs-practice-1.appspot.com",
    messagingSenderId: "273720413604",
    appId: "1:273720413604:web:34d287324a139d06b0c531"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
let dataList = []
const store = {
    currentPage:1,
}

window.addEventListener("hashchange",router)

function loadData(){
    db.collection("bbs")
        .get()
        .then((response)=>{response.forEach((data)=>{
            dataList.push({
                _id : data.id,
                _data : data.data(),
            })
        })
    let titles = ""
    for(i = (store.currentPage -1)*3 ;i < store.currentPage * 3;i++){
        titles += `<div><a href="#/show/${dataList[i]._id}">${dataList[i]._data.제목}</a></div>`
    }
    titles +=     `<div>
    <a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전 페이지</a>
    <a href="#/page/${store.currentPage + 1}">다음 페이지</a>
</div>`
    document.getElementById('root').innerHTML = titles
        })
}
loadData()

function contentDetail(){
    let locId = location.hash.substring(7);
    let theItem = dataList.find(item=>item._id == locId)
    let content = ""

    if(theItem){
        content = `
        <h1>${theItem._data.제목}</h1>
        <div>${theItem._data.내용}</div>
        <a href = '#/page/${store.currentPage}'>목록으로</a>`
    }
    document.getElementById("root").innerHTML = content

}

function router(){
    let route = location.hash;
    if(route == ' '){
        loadData()
    }else if(route.indexOf('#/page/')>= 0){
        store.currentPage = Number(route.substring(7));
        loadData()
    }else {
        contentDetail()
    }
}
