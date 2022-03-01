
const db = firebase.firestore();
let innerContents = " "

function onLoadData(){
    db.collection("bbs")
        .get()
        .then((response) => {
            response.forEach((doc)=>{
                let id = doc.id
                let data = doc.data()
                innerContents += `<tr>
                <th>${doc.data().no}</th>
                <th>${doc.data().제목}</th>
                <th>${doc.data().작성자}</th>
                <th>${currentTime(new Date(doc.data().작성일.seconds * 1000))}</th>
                </tr>`
            })
            document.getElementById("tblData").innerHTML = innerContents
        })
}
onLoadData()


function getCurrentTime(val) {
    let t = "";
    let t1 = new Date(val);
    let yyyy = t1.getFullYear().toString();
    let mm = (t1.getMonth() + 1).toString();
    let dd = t1.getDate().toString();
    let hh = t1.getHours() < 10 ? "0" + t1.getHours() : t1.getHours();
    let min = t1.getMinutes() < 10 ? "0" + t1.getMinutes() : t1.getMinutes();
    let ss = t1.getSeconds() < 10 ? "0" + t1.getSeconds() : t1.getSeconds();
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


function selectData(id){
    _item = objectList.find(item=>item.id==id)
    console.log(_item)
    if(_item){
      $("#add_title").val(_item.others.제목)
      $("#add_content").val(_item.others.내용)
      $("#add_writer").val(_item.others.작성자)
  
      $('#deleteData').attr('rec-id', id)
      $('#updateData').attr('rec-id', id) //제쿼리 문법 #id를 가지고있는 돔에 rec-id에 id 부여 
    }else{
      $('#deleteData').attr('rec-id', "")
      $('#updateData').attr('rec-id', "")
    }
  }
  
  function deleteData(){
    _id = $('#deleteData').attr('rec-id')
    db.collection("bbs").doc(_id).delete()
      .then(()=>{
        $("#add_title").val("")
        $("#add_content").val("")
        $("#add_writer").val("")
      console.log("successfully deleted")
      onLoadData()
      })
  }
  
  function updateData(){
    _id = $("#updateData").attr('rec-id');
    db.collection("bbs").doc(_id)
      .update({
        no : 2,
        제목 : $('#add_title').val(),
        작성자 : $('#add_writer').val(),
        작성일 : new Date(),
        내용 : $('#add_content').val(),
      })
      .then(()=>{
        $("#add_title").val(" ")
        $("#add_content").val(" ")
        $("#add_writer").val(" ")
        onLoadData()
      })
  }
  