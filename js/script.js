const newsList = $('.js-news-list');
const newsCardTemplate = $('#template-element').content;

const elSearchInput = $('.js-search-input');
const elSearchSelect = $('.js-search-select');
const elSearchBtn = $('.js-search-btn');
const elFailTxt = $('.js-fail-txt');

let arr = [];

function mainFunc() {
    // creating elements for news list
    let createNewsElement = function (arr) {

        let newsElement = newsCardTemplate.cloneNode(true);
        newsElement.querySelector('.js-news-img').src = arr.urlToImage;
        newsElement.querySelector('.js-news-img').alt = arr.title;
        newsElement.querySelector('.js-news-img').style.width = '555px';
        newsElement.querySelector('.js-modal-news-img').src = arr.urlToImage;
        newsElement.querySelector('.js-modal-news-img').style.backgroundPosition = 'center';

        if (arr.title.length > 65) {
            newsElement.querySelector('.js-news-title').textContent = arr.title.slice(0, 65) + '...';
        } else {
            newsElement.querySelector('.js-news-title').textContent = arr.title;
        }

        newsElement.querySelector('.js-modal-title').textContent = arr.title;
        newsElement.querySelector('.js-news-artist-name').textContent = arr.description;
        if (arr.description === null) {
            newsElement.querySelector('.js-news-artist-name').textContent = 'No description';
        } else {
            newsElement.querySelector('.js-news-name').textContent = arr.source.name;
        }

        if (arr.author === null || arr.author === '' || arr.author === undefined || arr.author === 'null') {
            newsElement.querySelector('.js-news-author').textContent = 'No author';
        } else {
            if (arr.author.length >= 20) {
                newsElement.querySelector('.js-news-author').textContent = arr.author.slice(0, 30) + '...';
            } else {
                newsElement.querySelector('.js-news-author').textContent = arr.author;
            }
        }
        newsElement.querySelector('.js-news-published-time').textContent = arr.publishedAt.slice(0, 10).split('-').reverse().join('.');
        newsElement.querySelector('.js-news-source-link').href = arr.url;
        newsElement.querySelector('.js-news-modal-source-link').href = arr.url;
        newsElement.querySelector('.js-news-modal-image-link').href = arr.urlToImage;
        newsElement.querySelector('.js-news-content').textContent = arr.content;

        let modalId = `${arr.publishedAt.replace(/[^a-z0-9]/gi, '')}`;
        newsElement.querySelector('.js-modal').id = `q${modalId}`;
        newsElement.querySelector('.js-modal-title').id = `q${modalId}`;
        newsElement.querySelector('.js-modal-btn').setAttribute('data-bs-target', `#q${modalId}`);

        return newsElement;
    }

    // render function
    let renderNews = function (arr) {
        newsList.innerHTML = null;
        let fragment = document.createDocumentFragment();
    
        arr.forEach(news => {
            fragment.appendChild(createNewsElement(news));
        });
        
        newsList.appendChild(fragment);
    }
    
    renderNews(arr);
    if (arr.length === 0) {
        elFailTxt.classList.remove('d-none');
    } else {
        elFailTxt.classList.add('d-none');
    }
}

let searchRequest = 'us';

// default api request
const defaultNews = async news => {
    try {
        const urlApi = await fetch(`https://newsapi.org/v2/top-headlines?country=${searchRequest}&apiKey=6fd18f4af64147edae5be3f19f66020c`);
        const data = await urlApi.json();
        
        if (data.status === 404) {
            arr = [];
            elFailTxt.classList.remove('d-none');
            return;
        } else {
            elSearchInput.blur();
            elFailTxt.classList.add('d-none');
            arr = data.articles;
            paginationFunction() ;
        }
    } catch (err) {
        console.log(err);
    } finally {
        elSearchInput.value = '';
            elSearchBtn.disabled = false;
            elSearchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>`;
    }
}
defaultNews();

let cloneArr = [];

// api request
const searchMusics = async news => {
    try {
        const urlApi = await fetch(`https://newsapi.org/v2/top-headlines?country=${searchRequest}&q=${news}&apiKey=6fd18f4af64147edae5be3f19f66020c`);
        const data = await urlApi.json();
        
        if (data.status === 404) {
            arr = [];
            elFailTxt.classList.remove('d-none');
            return;
        } else {
            elSearchInput.blur();
            elFailTxt.classList.add('d-none');
            arr = data.articles;
            paginationFunction();
        }
    } catch (err) {
        console.log(err);
    } finally {
        elSearchInput.value = '';
        elSearchBtn.disabled = false;
        elSearchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>`;
    }
}

elSearchSelect.addEventListener('change', () => {
    if (elSearchSelect.value === 'default') {
        searchRequest = 'us';
        newsList.innerHTML = null;
        arr = [];
        elSearchBtn.disabled = true;
        elSearchBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
        defaultNews();
    } else {
        searchRequest = elSearchSelect.value;
        searchMusics(searchRequest);
        newsList.innerHTML = null;
        arr = [];
        elSearchBtn.disabled = true;
        elSearchBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    }
});

// Search input enter
elSearchInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        elSearchBtn.click();
    }
});

// Search btn click
elSearchBtn.onclick = function () {
    let value = elSearchInput.value.toLowerCase().trim();
    if (value === '') {
        elSearchInput.value = null;
        return;
    } else {
    newsList.innerHTML = null;
    arr = [];
    elSearchBtn.disabled = true;
    elSearchBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    searchMusics(value)
    }
}

// Pagination  
async function paginationFunction() {
    const postsData = arr;
    let currentPage = 1;
    let rows = 5;

    // let pagination calc function
    function displayList(arrData, rowPerPage, page) {
        page--;

        const start = rowPerPage * page;
        const end = start + rowPerPage;
        const paginatedData = arrData.slice(start, end);

        paginatedData.forEach((el) => {
        const postEl = document.createElement("div");
        postEl.classList.add("post");
        postEl.innerText = `${el.title}`;
        })
        arr = paginatedData;
        mainFunc();
    }

    // render pagination
    function displayPagination(arrData, rowPerPage) {
        const paginationEl = document.querySelector('.pagination');
        paginationEl.innerHTML = "";
        const pagesCount = Math.ceil(arrData.length / rowPerPage);
        const ulEl = document.createElement("ul");
        ulEl.classList.add('pagination__list');
    
        for (let i = 0; i < pagesCount; i++) {
            const liEl = displayPaginationBtn(i + 1);
            ulEl.appendChild(liEl)
        }
        paginationEl.appendChild(ulEl)
    }
    // render pagination btn and func
    function displayPaginationBtn(page) {
        const liEl = document.createElement("li");
        liEl.classList.add('pagination__item')
        liEl.innerText = page
    
        if (currentPage == page) liEl.classList.add('pagination__item--active');
    
        liEl.addEventListener('click', () => {
        currentPage = page
        displayList(postsData, rows, currentPage)

        let currentItemLi = document.querySelector('li.pagination__item--active');
        currentItemLi.classList.remove('pagination__item--active');

        liEl.classList.add('pagination__item--active');
    })

    return liEl;
    }

    displayList(postsData, rows, currentPage);
    displayPagination(postsData, rows);
}
