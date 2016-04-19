# World Map:#

## Purpose: ##

Make a d3 choropleth, colour coding countries by data and giving tooltip for hover behaviour.

## Contents: ##

### Tutorial followed: http://cartographicperspectives.org/index.php/journal/article/view/cp78-sack-et-al/1359 ###

* **README.md** - Description of the repo (this file)
* **tutorial.html** - Main boilerplate HTML
* **css/style.css** - Main CSS styling (such as default colour for countries and sea)
* **data/countries.json** - Country GeoJSON
* **data/countries.topojson** - Country TopoJSON (used in **js/main.js**)
* **data/us_state_population.csv** - Population data taken from Wikipedia
* **data/us_states.json** - US states GeoJSON
* **data/us_states.json** - US states TopoJSON (used in **js/main.js**)
* **js/main.js** - JavaScript to produce the d3.js plot.
* **lib/d3.min.js** - Local version of d3.js.

## Notes: ##

Importing JSON data to d3 doesn't work if you have a path that starts with "file:///". Instead, the simplest solution is to go into the parent directory and run the following command:

```python
python3 -m http.server 8000
```

Then, in your browser, go to `http://localhost:8000` and select `tutorial.html`. The figure should appear.