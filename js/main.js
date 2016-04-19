// Begin script when window loads
window.onload = initialize();

// Global variables
var keyArray = ["population"]; // array of CSV properties to attach to topojson
var expressed = keyArray[0]; // initial attribute

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
	.defer(d3.csv, "data/us_state_population.csv")  // load CSV
	.defer(d3.json, "data/countries.topojson") // load geometry
	.defer(d3.json, "data/us_states.topojson") // load geometry
	.await(callback);   // trigger callback function

    // Arguments: error, then each defered thing from queue
    function callback(error, popData, countryData, stateData){

	var recolourMap = colourScale(popData);

	// A simplification of the part of the object to access
	var jsonStates = stateData.objects.collection.geometries;

	// Loop through CSV to assign each CSV value to JSON region
	for (var i = 0; i < popData.length; i++ ){
	    var csvState = popData[i]; // the current state
	    var nameState = csvState.name;

	    // Loop through the JSON regions to find right region:
	    for (var a = 0; a < jsonStates.length; a++) {
		// Where names match, attach CSV object to JSON
		if(jsonStates[a].properties.NAME == nameState) {
		    
		    // assign all key/value pairs
		    for (var key in keyArray) {
			var attr = keyArray[key];
			var val = parseFloat(csvState[attr]);
			jsonStates[a].properties[attr] = val;
		    };
		    // As match has been made, stop looking through JSON
		    break;
		};
	    };
	};

	// Add countries to the map:
	var countries = map.append("path") // create SVG path element
	    .datum(topojson.feature(
		countryData, countryData.objects.collection))
	    .attr("class", "countries") // class name for styling
	    .attr("d", path); // project data as geometry in SVG
	
	// To add finer regions, you can just repeath the stuff above, e.g.:
	var regions = map.selectAll(".regions")
	    .data(topojson.feature(stateData, stateData.objects.collection).features)
	    .enter() // create elements
	    .append("path") // add elements to path
	    .attr("class", "usStates") // class for styling
	    .attr("id", function(d) { return d.properties.NAME })
	    .attr("d", path) // project data as geometry in SVG
	    .style("fill", function(d) { // colour enumeration units
		return choropleth(d, recolourMap);
	    });
    };
};

function colourScale(csvData) {
    
    // Create quantile classes with colour scale
    var colour = d3.scale.quantile() // designate quantile scale generator
	.range([
	    "#D4B9DA",
	    "#C994C7",
	    "#DF65B0",
	    "#DD1C77",
	    "#980043"
	]);

    // Build array of all currently expressed values for input domain
    var domainArray = [];
    for (var i in csvData) {
	domainArray.push(Number(csvData[i][expressed]));
    };

    // Pass array of expressed values as domain
    colour.domain(domainArray);

    return colour; // return the colour scale generator
};

function choropleth(d, recolourMap){

    // get data value
    var value = d.properties[expressed];
    
    // If value exists, assign it a colour, if not assign grey
    if (value) {
	return recolourMap(value);
    } else {
	return "#ccc";
    };
};