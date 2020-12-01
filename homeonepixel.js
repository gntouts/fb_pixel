! function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
        n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s)
}(window, document, 'script',
    'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '337782320833467');
fbq('track', 'PageView');


function isProductPage() {
    let myURL = window.location.href.toString();
    return myURL.includes('/product/');
}

function isCategoryPage() {
    let myURL = window.location.href.toString();
    return myURL.includes('/product-category/');
}

function isHomePage() {
    let myURL = window.location.href.toString();
    return myURL === 'https://homeone.gr';
}


function getProductId() {
    let id = Array.from(document.querySelector('body').classList);
    id = id.filter(className => className.includes('postid'))[0];
    id = id.replace('postid-', '');
    return id;
}

function getCategory() {
    let cat = document.querySelector('nav.rey-breadcrumbs');
    cat = cat.textContent;
    cat = cat.split('›');
    if (isCategoryPage()) {
        cat = cat[cat.length - 1];
    }
    else if (isProductPage()) {
        cat = cat[cat.length - 2];
    }
    return cat;
}

function trackCategoryView() {
    let cat = document.querySelector('nav.rey-breadcrumbs');
    cat = cat.textContent;
    console.log(cat);
}

function trackProductView() {
    let id = getProductId();
    let category = getCategory();
    console.log(id);
}

function trackViewContent() {
    if (isHomePage()) {
        fbq('track', 'ViewContent', { content_name: 'Homepage' });
    } else if (isCategoryPage()) {
        console.log('category');
    } else if (isProductPage()) {
        console.log('product');
    }
}