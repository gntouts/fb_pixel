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


function isCheckoutPage() {
    let myURL = window.location.href.toString();
    return myURL.includes('/checkout/');
}

function isFromCheckout() {
    let fromCheckout = getCookie('fromCheckout');
    return fromCheckout == 'yes';
}


function isOrderReceivedPage() {
    let myURL = window.location.href.toString();
    let myLastParameter = myURL.split('/');
    myLastParameter = myLastParameter[myLastParameter.length - 3];
    return myURL.includes('/order-received/')
}

function isProperOrder() {
    return isFromCheckout() && isOrderReceivedPage();
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
    let cat = document.querySelector('meta[property="og:title"]');
    cat = cat.content.replace('– Home one', '').replace('  ', '');
    fbq('track', 'ViewContent', { content_name: cat });
}

function trackProductView() {
    let id = getProductId();
    let category = getCategory();
    let prodName = document.querySelector('meta[property="og:title"]').content;
    let price = document.querySelector('meta[property="product:sale_price:amount"]').content;
    price = parseInt(price);
    let content = { content_name: prodName, content_category: category, content_ids: [id], content_type: 'product', value: price, currency: 'EUR' };
    fbq('track', 'ViewContent', content);
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

function trackViewContent() {
    if (isHomePage()) {
        fbq('track', 'ViewContent', { content_name: 'Homepage' });
    } else if (isCategoryPage()) {
        trackCategoryView();
    } else if (isProductPage()) {
        trackProductView();
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

function getProductContentFromCookieValue(value) {
    let products = [];
    let temp = value.split('-');

    temp.forEach(function(product) {
        let i = product.split('&')[0].replace('gnpid:', '');
        let q = product.split('&')[1].replace('gnq:', '');
        products.push({ id: i, quantity: parseInt(q) })
    })
    return products
}

function addToCartFromCategoryView(element) {
    let prodId = element.getAttribute('data-product_id');
    let price = element.parentElement.parentElement;
    let name = price.getElementsByTagName('h2')[0].innerText;
    price = price.getElementsByTagName('ins')[0].getElementsByClassName('woocommerce-Price-amount')[0].firstChild.data;
    price = parseFloat(price);
    let params = { content_name: name, content_type: 'product', content_ids: [prodId], value: price, currency: "EUR" };
    // let gnfbp = getCookie('gnfbp');
    // if (gnfbp != '') {
    //     gnfbp = gnfbp + '-' + 'gnpid:' + prodId.toString() + '&gnq:1'
    // } else {
    //     gnfbp = 'gnpid:' + prodId.toString() + '&gnq:1'
    // }
    // setCookie('gnfbp', gnfbp, 2);
    fbq('track', 'AddToCart', params);
}

function addToCartFromProductPage(element) {
    let prodId = element.getAttribute('value');
    let price = parseFloat(document.getElementsByClassName('rey-innerSummary')[0].getElementsByTagName('ins')[0].getElementsByClassName('woocommerce-Price-amount')[0].firstChild.data);
    let name = document.getElementsByClassName('rey-productTitle-wrapper')[0].innerText;
    let q = document.querySelector('div.quantity input[type=number]').value;
    q = parseInt(q);
    let params = { content_name: name, content_type: 'product', content_ids: [prodId], quantity: q, value: price * q, currency: "EUR" };
    fbq('track', 'AddToCart', params);
}

function productPageProcedure() {
    var addToCartButtons = Array.from(document.getElementsByClassName('single_add_to_cart_button'));
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            addToCartFromProductPage(button);
        })
    });
}
/**
 * mainProcedure description
 * @return {boolean}      The Main Procedure
 */
function oldMain() {
    if (isCheckoutPage()) {
        console.log('Checkout Page');
        setCookie('fromCheckout', 'yes', 1);
    } else if (isProperOrder()) {
        setCookie('fromCheckout', 'no', 1);
        let totalValue = document.getElementsByClassName('woocommerce-order-overview__total')[0];
        totalValue = totalValue.getElementsByClassName('woocommerce-Price-amount')[0].innerText
        totalValue = totalValue.replace('€', '').trim();
        totalValue = parseFloat(totalValue);
        console.log('Purchase log:', totalValue.toString());
        // let gnfbp = getCookie('gnfbp');
        // let cookieContents = getProductContentFromCookieValue(gnfbp);
        // contents - i have to split gnfb and create the data fo the pixel tracking
        // setCookie('gnfbp', '', 2);
        // fbq('track', 'Purchase', { value: totalValue, currency: 'EUR', contents: cookieContents, content_type: 'product' });
        gtag('event', 'conversion', {
            'send_to': 'AW-617519608/TCN3CNKtj-QBEPizuqYC',
            'value': totalValue,
            'currency': 'EUR',
            'transaction_id': ''
        });
    } else {
        setCookie('fromCheckout', 'no', 1);
        trackViewContent();
    }
}

function setCookieFromMiniCart() {
    let products = '';
    setCookie('gnfbp', products, 1);
    let cartItems = Array.from(document.querySelectorAll('li.woocommerce-mini-cart-item.mini_cart_item'));
    cartItems.forEach(function() {
        let prId = item.querySelector('a.remove.remove_from_cart_button').getAttribute('data-product_id');
        let prQ = item.querySelector('span.quantity').innerText.split(' ×')[0];
        let temp = 'gnpid:' + prId.toString() + '&' + 'q:' + prQ.toString();
        products += temp + ';';
    })
    if (products != '') {
        products = products.slice(0, -1);
        setCookie('gnfbp', products, 1);
    }
}

function getMiniCartRemoveButtons() {
    return Array.from(document.querySelectorAll('ul.woocommerce-mini-cart a.remove.remove_from_cart_button'));
}

function miniCartButtonsProc() {
    setCookieFromMiniCart();
    getMiniCartRemoveButtons().forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(miniCartButtonsProc, 500);
        })
    });
}


function getListViewAddToCartButtons() {
    return Array.from(document.querySelectorAll('li.product a.button.add_to_cart_button.ajax_add_to_cart'));
}

function listViewAddToCartProc() {
    getListViewAddToCartButtons().forEach(button => {
        button.addEventListener('click', function() {
            addToCartFromCategoryView(button);
            setTimeout(miniCartButtonsProc, 500);
        })
    });
}

function defaultShopProc() {
    // remove form cart function
    miniCartButtonsProc();
    // add to cart function
    listViewAddToCartProc();
}

function addToCartFromProductPage(element) {
    let prodId = element.getAttribute('value');
    let price = parseFloat(document.getElementsByClassName('rey-innerSummary')[0].getElementsByTagName('ins')[0].getElementsByClassName('woocommerce-Price-amount')[0].firstChild.data);
    let name = document.getElementsByClassName('rey-productTitle-wrapper')[0].innerText;
    let q = document.querySelector('div.quantity input[type=number]').value;
    q = parseInt(q);
    let params = { content_name: name, content_type: 'product', content_ids: [prodId], quantity: q, value: price * q, currency: "EUR" };
    fbq('track', 'AddToCart', params);
}

function productPageProc() {
    var addToCartButtons = Array.from(document.getElementsByClassName('single_add_to_cart_button'));
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            addToCartFromProductPage(button);
            setTimeout(miniCartButtonsProc, 500);
        })
    });
}

function mainProcedure() {
    if (isHomePage()) {
        fbq('track', 'ViewContent', { content_name: 'Homepage' });
        defaultShopProc();

    } else if (isCategoryPage()) {
        trackCategoryView();
        defaultShopProc();
    } else if (isProductPage()) {
        trackProductView();
        productPageProc();
        defaultShopProc();
    } else if (isCheckoutPage()) {



    } else if (isProperOrder()) {

    } else {

    }
}


docReady(function() {
    if (!isProductPage()) {
        categoryViewProcedure();
    } else {
        productViewProcedure();
    }
    mainProcedure();
});