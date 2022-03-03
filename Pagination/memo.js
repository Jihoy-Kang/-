

let loadedTitle = ''
let pagiNation = ''
let totalPage = titles.length
let pageGroup = Math.ceil(page/5)
let lastPage = pageGroup * 5
let firstPage = lastPage - 4

pagiNation += `<li class="page-item"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }

    document.querySelector(".pagination").innerHTML = pagiNation
function moveToPage(pageNum){
    page = pageNum
    console.log(page)

}




<div aria-label="Page navigation example">
<ul class="pagination">
    <li class="page-item">
    <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
    </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
    <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
    </a>
</li>
</ul>
</div>