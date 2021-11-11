let maxPaginationShown = window.innerWidth < 1200 ? 5 : 10;

(() => {
    requestForPage(1, 10, "", "").then(data => {
        renderTable(data.body);
        loadPagination('#pagination', +data.count, 1, maxPaginationShown, 10);
    }).catch(err => console.log(err));
    requestForSelects().then(data => renderSelects(data)).catch(err => console.log(err));
})();

function requestForPage(page, perPageCount, searchStr, type) {
    let post = {
        "page": page,
        "count": perPageCount,
        "str": searchStr,
        "type": type
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            url: "/getItems",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(post),
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
    data.forEach(ele => {
        let tr = document.createElement('tr'), th = document.createElement('th');
        tr.setAttribute('data-clipboard-text', `/item ${ele.id} 1`);
        tr.setAttribute('title', 'click row to copy item code');
        th.setAttribute('scope', 'row');
        th.innerText = ele.id;
        tr.appendChild(th);

        let td = document.createElement('td');
        td.innerText = ele.name;
        tr.appendChild(td);

        td = td.cloneNode(false);
        td.innerHTML = `<img src="/icon/${ele.id}" class="scaleItem" alt="None"/>`
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
        target.appendChild(tr);
    })
    // load clipboard
    new ClipboardJS('tbody>tr');
}

function requestForSelects() {
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

function renderSelects(data) {
    let target = document.querySelector('#select-type');
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
        append += `<li class="page-item"><a class="btn-lg btn-outline-light px-2" href="javascript:void(0)" onclick="toPage(1)"><i class="bi-chevron-bar-left"></i></a></li>`;
    if (currentPage > 1)
        append += `<li class="page-item"><a class="btn-lg btn-outline-light px-2" href="javascript:void(0)" onclick="toPage(${currentPage - 1})"><i class="bi-chevron-left"></i></a></li>`;
    for (let i = startPage; i <= endPage; i++)
        append += `<li class="page-item"><a class="btn-lg btn-outline-light px-3 ${i === currentPage ? 'active' : ''}" href="javascript:void(0)" onclick="toPage(${i})">${i}</a></li>`;
    if (currentPage < totalPage)
        append += `<li class="page-item"><a class="btn-lg btn-outline-light px-2" href="javascript:void(0)" onclick="toPage(${currentPage + 1})"><i class="bi-chevron-right"></i></a></li>`;
    if (currentPage !== totalPage)
        append += `<li class="page-item"><a class="btn-lg btn-outline-light px-2" href="javascript:void(0)" onclick="toPage(${totalPage})"><i class="bi-chevron-bar-right"></i></a></li></ul>`;
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

$('#txt-search').on('input', function () {
    throttle(() => {
        let searchStr = $(this).val().trim(), type = $('#select-type').val(), count = $('#select-count').val();
        requestForPage(1, count, searchStr, type).then(data => {
            renderTable(data.body);
            loadPagination('#pagination', +data.count, 1, maxPaginationShown, count);
        }).catch(err => console.log(err));
    }, 500);
});

$('#select-type').on('change', function () {
    let searchStr = $('#txt-search').val(), type = $(this).val(), count = $('#select-count').val();
    requestForPage(1, count, searchStr, type).then(data => {
        renderTable(data.body);
        loadPagination('#pagination', +data.count, 1, maxPaginationShown, count);
    }).catch(err => console.log(err));
});

$('#select-count').on('change', function () {
    let searchStr = $('#txt-search').val(), type = $('#select-type').val(), count = $(this).val();
    requestForPage(1, count, searchStr, type).then(data => {
        renderTable(data.body);
        loadPagination('#pagination', +data.count, 1, maxPaginationShown, count);
    }).catch(err => console.log(err));
});

function toPage(page) {
    let searchStr = $('#txt-search').val(), type = $('#select-type').val(), count = $('#select-count').val();
    requestForPage(page, count, searchStr, type).then(data => {
        renderTable(data.body);
        loadPagination('#pagination', +data.count, page, maxPaginationShown, count);
    }).catch(err => console.log(err));
}