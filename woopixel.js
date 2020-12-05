function getCurrentUrl() {
    return window.location.href.toString()
}

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

function prodListAddToCart() {
    let atcB = Array.from(document.querySelectorAll('li.product a.button.add_to_cart_button.ajax_add_to_cart'));
    atcB.forEach(button => {
        button.addEventListener('click', function () {
            let prodId = button.getAttribute('data-product_id');
            let price = button.parentElement.parentElement;
            let name = price.querySelector('h2').innerText;
            price = price.querySelector('ins').querySelector('.woocommerce-Price-amount').firstChild.data;
            price = parseFloat(price);
            let params = { content_name: name, content_type: 'product', content_ids: [prodId], contents: [{ id: prodId, quantity: 1, price: price }], value: price, currency: "EUR" };
            fbq('track', 'AddToCart', params);
        })
    });
}

function trackProductViewAndProductCart() {
    // track viewcontent
    let id = Array.from(document.querySelector('body').classList).filter(className => className.includes('postid'))[0];
    id = id.replace('postid-', '');

    let data = document.querySelector('nav.rey-breadcrumbs').textContent.split('›');
    let category = data[data.length - 2];
    let prodName = data[data.length - 1];

    let price = parseInt(document.querySelector('meta[property="product:sale_price:amount"]').content);

    let content = { content_name: prodName, content_category: category, content_ids: [id], content_type: 'product', value: price, currency: 'EUR' };
    fbq('track', 'ViewContent', content);

    // add event listeners and track add to cart
    let addToCartButtons = Array.from(document.querySelectorAll('.single_add_to_cart_button'));
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            let quantity = document.querySelector('div.quantity input[type=number]').value;
            quantity = parseInt(quantity);
            let params = {
                content_name: prodName, content_type: 'product', content_ids: [id],
                contents: [{ id: id, quantity: quantity, price: price }],
                quantity: quantity, value: price * quantity, currency: "EUR"
            };
            fbq('track', 'AddToCart', params);
        })
    });
}

function mainProcedure() {
    let currentUrl = getCurrentUrl()
    if (currentUrl === 'https://homeone.gr') {
        fbq('track', 'ViewContent', { content_name: 'Homepage' });
        prodListAddToCart();
        setCookie('fromCheckout', 'no', 1);
    } else if (currentUrl.includes('/product-category/')) {
        let category = document.querySelector('meta[property="og:title"]').content.replace(' – Home one', '');
        fbq('track', 'ViewContent', { content_name: category });
        prodListAddToCart();
        setCookie('fromCheckout', 'no', 1);
    } else if (currentUrl.includes('/product/')) {
        trackProductViewAndProductCart();
        prodListAddToCart();
        setCookie('fromCheckout', 'no', 1);
    } else if (currentUrl.includes('/?s=')) {
        let searchString = document.querySelector('meta[property="og:title"]').content.replace('” – Home one', '');
        searchString = searchString.replace('Αποτελέσματα για “', '');
        fbq('track', 'Search', { search_string: searchString });
        prodListAddToCart();
        setCookie('fromCheckout', 'no', 1);
    } else if (currentUrl.includes('/cart/')) {
        fbq('track', 'ViewContent', { content_name: 'Cart' });
        setCookie('fromCheckout', 'no', 1);
    } else if (currentUrl.includes('/checkout/') && !currentUrl.includes('/order-received/')) {
        setCookie('fromCheckout', 'yes', 1);
        let totalValue = parseFloat(document.querySelector('#order_review tr.order-total span').innerText);
        let products = Array.from(document.querySelectorAll('#order_review tbody td.product-name > strong'));
        let numItems = 0;
        products.forEach(product => {
            let temp = parseInt(product.innerText.replace('×', ''));
            numItems += temp;
        })
        fbq('track', 'InitiateCheckout', { value: totalValue, num_items: numItems, currency: 'EUR' });
    } else if (currentUrl.includes('/order-received/') && getCookie('fromCheckout') == 'yes') {
        let skroutzScripts = Array.from(document.querySelectorAll('script[data-cfasync="false"]'));
        skroutzScripts = skroutzScripts.map(script => script.innerText);
        let selectedSkroutz = skroutzScripts.filter(script => script.includes('revenue'))[0];

        let order = selectedSkroutz.split(';')[0]
        let totalValue = parseFloat(order.split('revenue":')[1].split(',')[0]);
        let items = selectedSkroutz.split(';');
        items.pop();
        items.shift();

        let sItmes = [];
        items.forEach(item => {
            temp = item.replace("skroutz_analytics('ecommerce', 'addItem', ", '')
            temp = temp.slice(0, -1);;
            temp = JSON.parse(temp)
            sItmes.push(temp);
        });
        let contentIds = [];
        let contents = []
        let numItems = 0;
        sItmes.forEach(item => {
            contentIds.push(item.product_id.toString())
            contents.push({ id: item.product_id.toString(), content_type: 'product', quantity: item.quantity, price: item.price })
            numItems += item.quantity;
        })
        let params = {
            content_type: 'product', content_ids: contentIds,
            contents: contents, num_items: numItems, value: totalValue, currency: "EUR"
        };
        fbq('track', 'Purchase', params);
        setCookie('fromCheckout', 'no', 1);

    } else if (currentUrl.includes('/order-received/')) {
        fbq('track', 'ViewContent', { content_name: 'Order Received Page' });
        setCookie('fromCheckout', 'no', 1);
    }
    else {
        let pageName = document.querySelector('meta[property="og:title"]').content;
        fbq('track', 'ViewContent', { content_name: pageName });
        setCookie('fromCheckout', 'no', 1);
    }
}

function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

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
docReady(mainProcedure);