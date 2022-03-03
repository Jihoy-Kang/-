const titles = []
for(i = 0; i < 109; i++){
    titles.push({
        id : i,
        title : i.toString().repeat(10),
    })
}

const store = {
    currentPage : 1,
}

let totalContents = titles.length
let showingContents = 10
console.log(titles[100].id)




window.addEventListener('hashchange', router)


function router(){
    let routePath = location.hash;
    if(routePath === ''){
        loadData()
    }else if(routePath.indexOf("#/page/") >= 0){
        store.currentPage = Number(routePath.substring(7))
        loadData()
    }else {
        loadContent().Number
    }
}
router()


function loadData(){
    let loadedTitle = ''
    for(i = (store.currentPage - 1)*10; i < store.currentPage*10 ;i++){
        loadedTitle += `
            <div><a href="#/show/${titles[i].id}">${titles[i].title}</a></div>
        `
    }
    loadedTitle +=`
        <div>
            <a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전</a>
            <a href="#/page/${store.currentPage + 1}">다음</a>
        </div>`
    document.getElementById("root").innerHTML = loadedTitle
}


function loadContent(){
    let loadedContent = ' '
    theContent = titles.find(item => item.id == location.hash.substring(7))
    loadedContent = `<h1>${theContent.title}</h1>
    <div><a href="#/page/${store.currentPage}">목록으로</a></div>`
    document.getElementById("root").innerHTML = loadedContent
}
