document.onreadystatechange = () => {
    if (document.readyState === 'interactive') {
        console.log('begin');
        if (window.location.href.toString().includes('checkout/order-received')) {
            var totalValue = document.getElementsByClassName('woocommerce-order-overview__total')[0];
            totalValue = totalValue.getElementsByClassName('woocommerce-Price-amount')[0].innerText
            totalValue = totalValue.replace('€', '').trim();
            totalValue = parseFloat(totalValue);
            fbq('track', 'Purchase', { value: totalValue, currency: 'EUR' });
            console.log(totalValue);

        }
    }
};
