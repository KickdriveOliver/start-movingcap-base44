# Extend the MovingCap product pages and product data

## add `long_description` for all motor data in `products.jsx`

Please work on the MovingCap product data stored in the JSON data structure, and the product detail pages that should present this data, e.g: 
https://start.movingcap.de/#/product/turntrack
https://start.movingcap.de/#/product/maxtrack
https://start.movingcap.de/#/product/pushtrack
https://start.movingcap.de/#/product/shorttrack
https://start.movingcap.de/#/product/flattrack
https://start.movingcap.de/#/product/fattrack

Current state: 
The "Specifications" / "Spezifikation" tabs on the product detail pages do not present any information. It just refers to the downloadable datasheet "Siehe Datenblatt für detaillierte Spezifikationen.". And indeed that's where the exact specs are. 

Here is the change I propose: 

Instead of "Specification" , call this tab "Description" / "Beschreibung", and present the text description that can be found on the old fullmo.de website:

For each product variant, use the description found here in English:
https://fullmo.de/movingcap-turntrack/en
https://fullmo.de/movingcap-maxtrack/en
https://fullmo.de/movingcap-pushtrack/en
https://fullmo.de/movingcap-shorttrack/en
https://fullmo.de/movingcap-flattrack/en 
(for FATtrack, cook up a modified text of the flatTRACK entry, with an addition that this is a variant with higher peak power)

and here are the relevant texts in German :
https://fullmo.de/movingcap-turntrack
https://fullmo.de/movingcap-maxtrack
https://fullmo.de/movingcap-pushtrack
https://fullmo.de/movingcap-shorttrack
https://fullmo.de/movingcap-flattrack 
(Do not translate the English yourself a second time)

for Italian and French, translate from the German version.

Note: I suggest to add a new key to the products data in `products.jsx` named `long_description` and then create the corresponding translation keys and texts with the actual description. 

## extend the `technical_specs` for the linear motor data in `products.jsx`

- add key `nom_force_n` in newton and use the following values: 
shorttrack = 9
flattrack = 30
fattrack = 30

- add key 'stroke_options_mm': 
shorttrack = 46
flattrack = 100, 195, 290, 485, 585, 650, 1325
fattrack = 200

## selective display of "Motion Calculator" button

- on the product detail pages, only display the "Motion Calculator" button if the product has a `technical_specs' group in the  `products.jsx`. E.g:
https://start.movingcap.de/#/product/pushtrack - don't show "Motion Calculator" button 
https://start.movingcap.de/#/product/shorttrack - yes, do show "Motion Calculator" button 

