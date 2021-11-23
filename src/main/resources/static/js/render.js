let maxPaginationShown = window.innerWidth < 1200 ? 5 : 10;

(() => {
    requestForPage({
        "page": 1,
        "count": 10,
        "str": "",
        "type": "",
        "fav": "",
        "slot": ""
    }).then(data => {
        renderTable(data.body);
        loadPagination('#pagination', +data.count, 1, maxPaginationShown, 10);
    }).catch(err => console.log(err));
    requestForTypes().then(data => renderSelect('#select-type', data)).catch(err => console.log(err));
    requestForSlots().then(data => renderSelect('#select-slot', data)).catch(err => console.log(err));
    let theme = localStorage.getItem('codex-theme');
    if (theme === 'light') {
        light();
        $('#switch-theme').prop('checked', false);
    } else {
        dark();
        $('#switch-theme').prop('checked', true);
    }
})();

function requestForPage(formObj) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            url: "/getItems",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(formObj),
            cache: false,
            timeout: 10000,
            success: data => {
                data ? resolve(data) : reject('empty');
            },
            complete: (_, status) => {
                status !== 'success' ? reject(status) : '';
            }
        })
    });
}

function renderTable(data) {
    let target = document.querySelector('tbody');
    target.innerHTML = '';
    if (data.length === 0) {
        let tr = document.createElement('tr'), td = document.createElement('td');
        td.colSpan = '7';
        td.innerHTML = `<h1>No Result was Found!</h1>`;
        tr.appendChild(td);
        target.appendChild(tr);
    } else {
        data.forEach(ele => {
            let tr = document.createElement('tr'), th = document.createElement('th');
            tr.setAttribute('data-clipboard-text', `/item ${ele.id} 1 `);
            tr.setAttribute('title', 'click row to copy item code');
            th.setAttribute('scope', 'row');
            th.innerText = ele.id;
            tr.appendChild(th);

            let td = document.createElement('td');
            td.innerText = ele.name;
            tr.appendChild(td);

            td = td.cloneNode(false);
            td.innerHTML = `<img src="/icon/${ele.id}" class="scale" alt="No Preview"/>`;
            tr.appendChild(td);

            td = td.cloneNode(false);
            td.innerText = ele.type;
            tr.appendChild(td);

            td = td.cloneNode(false);
            td.innerText = ele.feature;
            tr.appendChild(td);

            td = td.cloneNode(false);
            td.innerText = ele.slot;
            tr.appendChild(td);

            td = td.cloneNode(false);
            let i = document.createElement('i');
            i.classList.add(ele.favourited === '0' ? 'si-unstar' : 'si-star', 'star' + ele.id);
            i.addEventListener('click', function (e) {
                toggleFavorite(ele.id);
                e.stopPropagation();
            });
            td.appendChild(i);
            tr.appendChild(td);
            target.appendChild(tr);
        })
    }
    // load clipboard
    new ClipboardJS('tbody>tr');
}

function requestForTypes() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "get",
            url: "/getTypes",
            dataType: "json",
            cache: false,
            timeout: 10000,
            success: data => {
                data ? resolve(data) : reject('empty');
            },
            complete: (_, status) => {
                status !== 'success' ? reject(status) : '';
            }
        })
    });
}

function requestForSlots() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "get",
            url: "/getSlots",
            dataType: "json",
            cache: false,
            timeout: 10000,
            success: data => {
                data ? resolve(data) : reject('empty');
            },
            complete: (_, status) => {
                status !== 'success' ? reject(status) : '';
            }
        })
    });
}

function renderSelect(targetSelector, data) {
    let target = document.querySelector(targetSelector);
    for (let item of data) {
        let option = document.createElement('option');
        option.innerText = option.value = item;
        target.appendChild(option);
    }
}

/**
 * load page navigation components
 * @param targetElementSelector target element to load
 * @param totalRecordsAmount total records amount
 * @param currentPage current browsing page
 * @param maxPaginationShown One page show maximum page navigations
 * @param perPageAmount one page show maximum record amount
 */
function loadPagination(targetElementSelector, totalRecordsAmount, currentPage, maxPaginationShown, perPageAmount) {
    // prepare for necessary data
    let startPage, endPage, totalPage = Math.ceil(totalRecordsAmount / perPageAmount);
    let target = $(targetElementSelector);
    if (totalPage === 1 || totalPage === 0) { // do not load page when total page count is less than 2
        target.html('');
        return;
    }
    if (totalPage <= maxPaginationShown) {
        startPage = 1;
        endPage = totalPage;
    } else {
        if (currentPage <= Math.floor(maxPaginationShown / 2)) {
            startPage = 1;
            endPage = startPage + maxPaginationShown - 1;
        } else if (currentPage >= totalPage - Math.floor(maxPaginationShown / 2)) {
            startPage = totalPage - maxPaginationShown + 1;
            endPage = totalPage;
        } else {
            startPage = currentPage - Math.floor(maxPaginationShown / 2);
            endPage = startPage + maxPaginationShown - 1;
        }
    }

    // load pagination to page
    let append = `<ul class="pagination float-end">`;
    if (currentPage !== 1)
        append += `<li class="page-item"><a class="btn-lg btn-outline px-2" href="javascript:void(0)" onclick="toPage(1)"><i class="bi-chevron-bar-left"></i></a></li>`;
    if (currentPage > 1)
        append += `<li class="page-item"><a class="btn-lg btn-outline px-2" href="javascript:void(0)" onclick="toPage(${currentPage - 1})"><i class="bi-chevron-left"></i></a></li>`;
    for (let i = startPage; i <= endPage; i++)
        append += `<li class="page-item"><a class="btn-lg btn-outline px-3 ${i === currentPage ? 'active' : ''}" href="javascript:void(0)" onclick="toPage(${i})">${i}</a></li>`;
    if (currentPage < totalPage)
        append += `<li class="page-item"><a class="btn-lg btn-outline px-2" href="javascript:void(0)" onclick="toPage(${currentPage + 1})"><i class="bi-chevron-right"></i></a></li>`;
    if (currentPage !== totalPage)
        append += `<li class="page-item"><a class="btn-lg btn-outline px-2" href="javascript:void(0)" onclick="toPage(${totalPage})"><i class="bi-chevron-bar-right"></i></a></li></ul>`;
    target.html(append);
}

/**
 * debounce a function
 * @param fn function
 * @param delay execute delay time
 */
let debounce = (function () {
    let timeout;
    return function (fn, delay) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn();
        }, delay);
    }
})();

/**
 * throttle a function
 * @param fn function
 * @param delay execute delay time
 */
let throttle = (function () {
    let valid = true;
    return function (fn, delay) {
        if (!valid)
            return false;
        valid = false;
        setTimeout(() => {
            fn();
            valid = true;
        }, delay);
    }
})();

function getFormValues() {
    return {
        "page": 1,
        "count": $('#select-count').val(),
        "str": $('#txt-search').val().trim(),
        "type": $('#select-type').val(),
        "fav": $('#select-fav').val(),
        "slot": $('#select-slot').val()
    }
}

$('#txt-search').on('input', function () {
    throttle(() => {
        let formObj = getFormValues();
        requestForPage(formObj).then(data => {
            renderTable(data.body);
            loadPagination('#pagination', +data.count, 1, maxPaginationShown, formObj.count);
        }).catch(err => console.log(err));
    }, 500);
});

$('#select-count,#select-fav,#select-type,#select-slot').on('change', function () {
    let formObj = getFormValues();
    requestForPage(formObj).then(data => {
        renderTable(data.body);
        loadPagination('#pagination', +data.count, 1, maxPaginationShown, formObj.count);
    }).catch(err => console.log(err));
});

function toPage(page) {
    let formObj = getFormValues();
    formObj.page = page;
    requestForPage(formObj).then(data => {
        renderTable(data.body);
        loadPagination('#pagination', +data.count, page, maxPaginationShown, formObj.count);
    }).catch(err => console.log(err));
}

$('#switch-theme').on('change', function () {
    let value = $(this).prop('checked');
    if (value) { // to dark theme
        dark();
        localStorage.setItem('codex-theme', 'dark');
    } else { // to light theme
        light();
        localStorage.setItem('codex-theme', 'light');
    }
});

function light() {
    document.querySelector('#toggle-theme-target').setAttribute('href', '/css/light.css');
}

function dark() {
    document.querySelector('#toggle-theme-target').setAttribute('href', '/css/dark.css');
}

function toggleFavorite(targetItemId) {
    let star = document.querySelector('.star' + targetItemId);
    star.onclick = null;
    ajaxToggleFavorite(targetItemId).then(() => {
        if (star.classList.contains('si-unstar')) {
            star.classList.remove('si-unstar');
            star.classList.add('si-star');
        } else if (star.classList.contains('si-star')) {
            star.classList.remove('si-star');
            star.classList.add('si-unstar');
        }
        star.onclick = toggleFavorite.bind(null, targetItemId);
    }).catch(err => {
        console.log(err);
        star.onclick = toggleFavorite.bind(null, targetItemId);
    });
}

function ajaxToggleFavorite(targetItemId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            url: "/toggleFavorite",
            contentType: "text/plain",
            dataType: "text",
            data: '' + targetItemId,
            cache: false,
            timeout: 10000,
            success: data => {
                data === 'success' ? resolve() : reject('failed');
            },
            complete: (_, status) => {
                status !== 'success' ? reject(status) : '';
            }
        })
    })
}