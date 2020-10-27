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
    console.log('is from checkout');
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

function doStuff() {
    if (isCheckout) {
        setCookie('fromCheckout', 'yes', 1);
    } else if (isProperOrder()) {
        setCookie('fromCheckout', 'no', 1);
        let totalValue = document.getElementsByClassName('woocommerce-order-overview__total')[0];
        totalValue = totalValue.getElementsByClassName('woocommerce-Price-amount')[0].innerText
        totalValue = totalValue.replace('€', '').trim();
        totalValue = parseFloat(totalValue);
        fbq('track', 'Purchase', { value: totalValue, currency: 'EUR' });
    } else {
        setCookie('fromCheckout', 'no', 1);
    }
}

setCookie('fromCheckout', 'no', 1);
docReady(function() {
    doStuff();
});
