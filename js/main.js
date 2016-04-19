// Begin script when window loads
window.onload = initialize();

// First function called once the HTML is loaded
function initialize(){
    setMap();
};

function setMap(){

    // Map frame dimensions
    var width  = 1000;
    var height = 500;

    // Create a new SVG element using the dimensions:
    var map = d3.select("body")
        .append("svg")
	.attr("width", width)
	.attr("height", height);

    // Create Europe Albers equal area conic projection, centred on France
    var projection = d3.geo.mercator()
	.center([-88, 46.2])  // centre on France [lon, lat]
	//.rotate([-30, 0])    // anticlockwise (from North pole) [lon,lat,roll]
	//.parallels([43, 62]) // set standard parallels [lat1, lat2]
	.scale(100)         // arbitrary scale factor (smaller number = larger
                            // coverage)
	.translate([width / 2, height / 2]); // position of map centre in SVG

    // Create SVG path generator using the projection
    var path = d3.geo.path()
	.projection(projection);

    // Add graticule lines (must go after the path)
    var graticule = d3.geo.graticule()
	.step([10, 10]); // every 10 degrees

    // Create graticule background (light blue)
    var gratBackground = map.append("path")
	.datum(graticule.outline) // bind graticule background
	.attr("class", "gratBackground") // assign class for styling
	.attr("d", path) // project graticule

    // Create graticule lines (grid lines):
    /*
    var gratLines = map.selectAll(".gratLines") // select graticule elements
	.data(graticule.lines) // bind graticule lines to each element
	.enter() // create an element for each datum
	.append("path") // append each element to the SVG as a path element
	.attr("class", "gratLines") // add class for styling
	.attr("d", path); // project graticule lines
    */
    // Use queue.js to parallelize asynchronous data loading
    queue()
	//.defer(d3.csv, "")  // load attributes from CSV
	.defer(d3.json, "data/countries.topojson") // load geometry
	//.defer(d3.json, "") // load geometry
	.await(callback);   // trigger callback function

    // Arguments: error, then each defered thing from queue
    function callback(error, countryData){
	// Add countries to the map:
	var countries = map.append("path") // create SVG path element
	    .datum(topojson.feature(
		countryData, countryData.objects.collection))
	    .attr("class", "countries") // class name for styling
	    .attr("d", path); // project data as geometry in SVG
	console.log();
    };
}