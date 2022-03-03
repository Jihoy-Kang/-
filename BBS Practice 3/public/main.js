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

function onLoadData(){
    let contents =""

    db.collection('bbs')
        .get()
        .then((result)=>{result.forEach((doc)=>{
            dataList.push({
                _id : doc.id,
                _other : doc.data(),
            })

        })})

        .catch((error) => {
            console.log("Error onLoadData documents:", error);
        })
}
onLoadData()