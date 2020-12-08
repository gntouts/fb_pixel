var pixelID = '1264687297239092';
var OGPageTitle = 'meta[property="og:title"]';

// variables for prodListAddToCart() function
var thumbnailAddToCartButtons = 'li.product.type-product a.button.add_to_cart_button.ajax_add_to_cart'; // querySelectorAll
var thumbnailAddToCartProductId = 'data-product_id'; // getAtribute
var thumbnailAddToCartDetailsParent = 'li.product.type-product'; // parent of Name and Price
var thumbnailProductName = 'span.entry-title'; // get inner text
var thumbnailProductPrice = 'ins .woocommerce-Price-amount'; // parse inner text as float


// variables for trackProductViewAndProductCart() function
var breadcrumbsContainer = 'ul.breadcrumb-wrap' // textContent split by breadcrumbCharacter
var breadcrumbCharacter = '\n';
var productPagePrice = 'meta[property="product:sale_price:amount"]' // parse content as int

var productPageAddToCartButtons = '.single_add_to_cart_button' //query selector all
var productPageQantity = 'div.quantity input[type=number]'// parse value as int


// variables for main procedure
var homepageUrl = 'https://kidstoys.gr';
var categoryPageUrl = '/product-category/';
var categoryPageName = OGPageTitle; //get content
var categoryPageNameRemove = ['–', 'kidstoys.gr'];

var productPageUrl = '/product/';

var searchPageUrl = '/?s=';
var searchTerm = OGPageTitle; //get content
var searchPageTermRemove = ['–', 'kidstoys.gr', 'Αποτελέσματα για', '“', '”', '  '];

var cartPageUrl = '/cart/';
var checkoutPageUrl = '/checkout/';
var orderReceivedUrl = '/order-received/';
var checkoutPageValue = '#order_review tr.order-total span' // parse innerText as float
var checkoutPageProducts = '#order_review tbody td.product-name > strong';
var checkoutQuantityMultiplier = '×';

