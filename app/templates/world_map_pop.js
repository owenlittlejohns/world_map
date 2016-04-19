var format = function(d) {
    d = d / 1000000;
    return d3.format(',.02f')(d) + 'M';
}

var map = d3.geomap.choropleth()
    .geofile('/d3-geomap/topojson/world/countries.json')
    .colors(colorbrewer.YlGnBu[9])
    .column('2014')
    .format(format)
    .legend(true)
    .unitId('Country Code');

d3.csv('/home/owen/Documents/github/world_map/country_pops.csv', function(error, data) {
    d3.select('#map')
        .datum(data)
        .call(map.draw, map);
});