const firebaseConfig = {
  apiKey: "AIzaSyD1U6-b7LBLBOynzrU085qc6tZJwbxZ1U8",
  authDomain: "up-project-bb641.firebaseapp.com",
  projectId: "up-project-bb641",
  storageBucket: "up-project-bb641.appspot.com",
  messagingSenderId: "911219651262",
  appId: "1:911219651262:web:113fded73357fac23564ef"
};


firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();

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

