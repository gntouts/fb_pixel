!function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s)
}(window, document, 'script',
    'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '337782320833467');
fbq('track', 'PageView');

document.onreadystatechange = () => {
    if (document.readyState === 'interactive') {
        if (window.location.href.toString().includes('checkout/order-received')) {
            var totalValue = document.getElementsByClassName('woocommerce-order-overview__total')[0];
            totalValue = totalValue.getElementsByClassName('woocommerce-Price-amount')[0].innerText
            totalValue = totalValue.replace('€', '').trim();
            totalValue = parseFloat(totalValue);
            fbq('track', 'Purchase', { value: totalValue, currency: 'EUR' });
        }
    }
};
