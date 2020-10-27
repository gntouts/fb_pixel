# gn_tracking
Quick and dirty scripts to add Facebook Pixel and Google Ads Tag to a Wordpress site without installing additional plugins.
It is not properly tested and could possibly produce very wrong converison events.
It has 0 error tolerance and uses absolutely bad practices.

## Usage
1. Clone or download.
2. Change the values that correspond to your specific website:
..* URL paths for cart and checkout
..* Facebook Pixel ID
..* Google Ads Tag 
..* Desired Currency
..* Selectors for the order value
3. Create a Github release.
4. Add the following lines to your website's head:
```
	<!-- Global site tag (gtag.js) - Google Ads: [your google tag id] -->
	<script src="https://www.googletagmanager.com/gtag/js?id=[your google tag id]"></script>
	<script src='https://cdn.jsdelivr.net/gh/[your user name]/[your repo name]@[your release version]/gn_tracking_init.min.js'></script>
	<script src='https://cdn.jsdelivr.net/gh/[your user name]/[your repo name]@[your release version]/gn_sale_trigger.min.js'></script>
  ```
