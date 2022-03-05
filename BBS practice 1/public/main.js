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



let addTitle = document.getElementById("add_title")
let addWriter = document.getElementById("add_writer")
let addContent = document.getElementById("add_content")



let objectList = []
let innerTitle = " "
let innerContents = " "
let footerHTML =
`<div>
    Copyright 2020ⓒ 제주더큰내일센터. All rights reserved
</div>`






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

function addData(){
  db.collection("bbs").add({
    no : 2,
    내용 : addContent.value,
    작성일 : new Date(),
    작성자 : addWriter.value,
    제목 : addTitle.value
  })
    .then(()=>{
      $("#add_title").val(" ")
      $("#add_content").val(" ")
      $("#add_writer").val(" ")
    onLoadData()
    })

}


function onLoadData(){
  innerTitle = ""
  db.collection("bbs")
    .get()
    .then((response)=>{
      response.forEach((doc)=>{
        objectList.push({
          id : doc.id,
          others : doc.data(),
        })
        innerTitle += `
        <tr onclick="selectData('${doc.id}')">
          <td>${doc.data().no}</td>
          <td><a href='#${doc.id}'>${doc.data().제목}</a></td>
          <td>${doc.data().작성자}</td>
          <td>${getCurrentTime(new Date(doc.data().작성일.seconds * 1000))}</td>
        </tr>
        `
      })
      document.getElementById('tblData').innerHTML = innerTitle
    })
  document.getElementById("footer").innerHTML = footerHTML
}
onLoadData()

function selectData(id){
  let _item = objectList.find(item =>item.id == id)
  if(_item){
    $("#add_title").val(_item.others.제목)
    $("#add_content").val(_item.others.내용)
    $("#add_writer").val(_item.others.작성자)

    $('#updateData').attr('rec-id',id)
    $('#deleteData').attr('rec-id',id)
  }else{
    $('#updateData').attr('rec-id', '')
    $('#deleteData').attr('rec-id', '')
  }
}

function deleteData(){
  let _id = $('#deleteData').attr('rec-id')
  db.collection('bbs').doc(_id).delete()
    .then(()=>{
      $("#add_title").val(" ")
      $("#add_content").val(" ")
      $("#add_writer").val(" ")
      onLoadData()
    })
  }

function updateData(){
  let _id = $('#updateData').attr('rec-id')
  db.collection('bbs').doc(_id).update({
    작성일 : new Date(),
    작성자 : $("#add_writer").val(),
    제목 : $("#add_title").val(),
    내용 : $("#add_title").val(),
  })
    .then(()=>{
      $("#add_title").val(" ")
      $("#add_content").val(" ")
      $("#add_writer").val(" ")
    })
    onLoadData()
}

//해시체이지 및 페이지 네이션
const arrTest = [{
  id : 1,
  name : 2,},
  {
  id : 2,
  name : {1:3,2:3,}
  }
]
console.log(Array.isArray(objectList))
console.log(objectList)
console.log(arrTest)
function test1(){
  const result1 = ""
  for(i = 0; i < 5 ; i++){
    result1 += `${objectList[i].id}`
  }
  document.getElementById('workArea').innerHTML = result1
}


function test2() {
  db.collection("bbs")
  .get()
  .then((response)=>{
    response.forEach((doc)=>{ 
      objectList.push({
        id : doc.id,
        others : doc.data(),
      })
    })
    console.log(objectList)
  })
}

test2()

window.addEventListener('hashchange',router)

function newDetail(){
  const _id = location.hash.substring(1)
  db.collection('bbs')
    .get()
    .then((response)=>{
      response.forEach((doc)=>{
        if(doc.id == _id){
          innerContents = `<h1>${doc.data().제목}</h1>
          <div>
            <a href="#">목록으로</a>
          </div>`
          console.log(doc.data().제목)
          console.log(doc)
        }
      })
      document.getElementById("tblData").innerHTML = innerContents
    })
}

function router(){
  const routePath = location.hash;

  if(routePath === '') {
    onLoadData()
  } else{
    newDetail()
  }
}
router()