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

function addToCartFromList(element) {
    let prodId = element.getAttribute('data-product_id');
    let price = element.parentElement.parentElement;
    let name = price.getElementsByTagName('h2')[0].innerText;
    price = price.getElementsByTagName('ins')[0].getElementsByClassName('woocommerce-Price-amount')[0].firstChild.data;
    price = parseFloat(price);
    let params = { content_name: name, content_type: 'product', content_ids: [prodId], value: price, currency: "EUR" };
    fbq('track', 'AddToCart', params);
}

function doAddToCartListStuff() {
    var addToCartButtons = document.getElementsByClassName('add_to_cart_button');
    Array.from(addToCartButtons).forEach(element => {
        element.addEventListener('click', function() {
            addToCartFromList(element)
        })

    });
}

function doAddToCartPageStuff() {
    var addToCartButtons = document.getElementsByClassName('single_add_to_cart_button');
    Array.from(addToCartButtons).forEach(element => {
        element.addEventListener('click', function() {
            addToCartFromPage(element)
        })

    });
}

function addToCartFromPage(element) {
    let prodId = element.getAttribute('value');
    let price = document.getElementsByClassName('rey-innerSummary')[0].getElementsByTagName('ins')[0].getElementsByClassName('woocommerce-Price-amount')[0].firstChild.data;
    let name = document.getElementsByClassName('rey-productTitle-wrapper')[0].innerText;
    let params = { content_name: name, content_type: 'product', content_ids: [prodId], value: price, currency: "EUR" };
    fbq('track', 'AddToCart', params);

}

function doStuff() {
    if (isCheckout()) {
        setCookie('fromCheckout', 'yes', 1);
    } else if (isProperOrder()) {
        setCookie('fromCheckout', 'no', 1);
        let totalValue = document.getElementsByClassName('woocommerce-order-overview__total')[0];
        totalValue = totalValue.getElementsByClassName('woocommerce-Price-amount')[0].innerText
        totalValue = totalValue.replace('€', '').trim();
        totalValue = parseFloat(totalValue);
        console.log('Purchase log:', totalValue.toString());
        fbq('track', 'Purchase', { value: totalValue, currency: 'EUR' });
        gtag('event', 'conversion', {
            'send_to': 'AW-617519608/TCN3CNKtj-QBEPizuqYC',
            'value': totalValue,
            'currency': 'EUR',
            'transaction_id': ''
        });
    } else {
        setCookie('fromCheckout', 'no', 1);
    }
}

docReady(function() {
    var isProductPage = Array.from(document.getElementsByTagName('body')[0].classList).includes('single-product') && Array.from(document.getElementsByTagName('body')[0].classList).includes('single');

    if (!isProductPage) {
        doAddToCartListStuff();
    } else {
        doAddToCartPageStuff();
    }
    doStuff();
});