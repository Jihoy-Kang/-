window.addEventListener('hashchange',function(){
    console.log("gotl")
})


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

  function onLoadData(){
db.collection("bbs")
    .get()
    .then((response)=>{
    response.forEach((doc)=>{
        objectList.push({
        id : doc.id,
        others : doc.data(),
        })
    })
    document.getElementById('tblData').innerHTML = innerTitle
    })
}