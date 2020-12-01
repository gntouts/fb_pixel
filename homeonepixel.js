! function(f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function() {
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

function trackCategoryView() {
    console.log('ok')
}

function trackProductView() {

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