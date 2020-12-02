function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function isCheckout() {
    let myURL = window.location.href.toString();
    let myLastParameter = myURL.split('/');
    myLastParameter = myLastParameter[myLastParameter.length - 2];
    return myLastParameter == 'checkout';
}

function isFromCheckout() {
    let fromCheckout = getCookie('fromCheckout');
    return fromCheckout == 'yes';
}


function isOrderReceived() {
    let myURL = window.location.href.toString();
    let myLastParameter = myURL.split('/');
    myLastParameter = myLastParameter[myLastParameter.length - 3];
    return myLastParameter == 'order-received';
}

function isProperOrder() {
    return isFromCheckout() && isOrderReceived();
}

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
    } else if (isProductPage()) {
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

function categoryViewProcedure() {
    let addToCartButtons = Array.from(document.getElementsByClassName('add_to_cart_button'));
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            addToCartFromCategoryView(button)
        })
    });
}

function addToCartFromCategoryView(element) {
    let prodId = element.getAttribute('data-product_id');
    let price = element.parentElement.parentElement;
    let name = price.getElementsByTagName('h2')[0].innerText;
    price = price.getElementsByTagName('ins')[0].getElementsByClassName('woocommerce-Price-amount')[0].firstChild.data;
    price = parseFloat(price);
    let params = { content_name: name, content_type: 'product', content_ids: [prodId], value: price, currency: "EUR" };
    let gnfbp = getCookie('gnfbp');
    if (gnfbp != '') {
        gnfbp = gnfbp + '-' + 'gnpid:' + prodId.toString() + '&gnq:1'
    } else {
        gnfbp = 'gnpid:' + prodId.toString() + '&gnq:1'
    }
    setCookie('gnfbp', gnfbp, 2);
    fbq('track', 'AddToCart', params);
}

function addToCartFromProductView() {
    let prodId = element.getAttribute('value');
    let price = parseFloat(document.getElementsByClassName('rey-innerSummary')[0].getElementsByTagName('ins')[0].getElementsByClassName('woocommerce-Price-amount')[0].firstChild.data);
    let name = document.getElementsByClassName('rey-productTitle-wrapper')[0].innerText;
    let quantity = document.querySelector('div.quantity input[type=number]')
    let params = { content_name: name, content_type: 'product', contents: [{ id: prodId, quantity: quantity }], value: price, currency: "EUR" };
    let gnfbp = getCookie('gnfbp');
    if (gnfbp != '') {
        gnfbp = gnfbp + '-' + 'gnpid:' + prodId.toString() + '&gnq:' + quantity.toString();
    } else {
        gnfbp = 'gnpid:' + prodId.toString() + '&gnq:' + quantity.toString();
    }
    setCookie('gnfbp', gnfbp, 2);
    fbq('track', 'AddToCart', params);
}

function productViewProcedure() {
    var addToCartButtons = Array.from(document.getElementsByClassName('single_add_to_cart_button'));
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            addToCartFromPage(button)
        })
    });
}

docReady(function() {
    if (!isProductPage()) {
        // category/list view
        categoryViewProcedure();
    } else {
        // product view
        productViewProcedure();
        doAddToCartPageStuff();
    }
    doStuff();
});