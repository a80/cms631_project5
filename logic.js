/* JS logic */

$(document).ready(function() {
	$('#mapDiv').hide(); 
	$('#resultsDiv').hide(); 

	$('#submitStateButton').click(function() {
		var state = $('#stateFormField').val(); 
		$('#formEntryDiv').hide(); 
		$('#logo').hide(); 
		$('#mapDiv').show({ done: loadMap });
	}); 

	// loadMap();

	function loadMap() {

		var width = 600, height = 400;
		var svg = d3.select("#mapDiv").append("svg")
			.attr("width", width).attr("height", height)
			.attr("id", "map");

		var colorScale = d3.scale.category20b();

		d3.xml("data/marathon_route.gpx", "application/xml", function(xml) {
			var route = processTrkpts(xml.documentElement.getElementsByTagName("trkpt"));
			console.log(route);

			var params = mapParams(route.geometry.coordinates);
			console.log(params);

			// INITIALIZE MAP
			var po = org.polymaps;
			var map = po.map()
				.container(document.getElementById("map"))
				.center({lon: params[0], lat: params[1]})
				.zoom(10.5)
				.add(po.interact());

			map.add(po.image()
				.url(po.url("http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png")
				.hosts(["a.", "b.", "c.", ""])));

			// ADD MARATHON ROUTE
			var routeLayer = po.geoJson().features([route])
				.clip(false)
				.on("load", 
					po.stylist()
						.style("stroke", "red")
						.style("fill", "none")
						.style("stroke-width", 5)
						.attr("id", "path"));
			map.add(routeLayer);

			// INITIALIZE PLAYERS
			d3.json("data/average_splits_by_state.json", function(json) {
				console.log(json);
				var path = $("#path")[0];
				var pathLength = path.getTotalLength();
				var marathonLength = 42195; // length of marathon
				
				d3.select(path.parentElement).selectAll("circle")
					.data(json).enter()
					.append("circle")
					.attr("class", "players")
					.attr("r", 10)
					.style("fill", function(d, i) { return colorScale(i); })
					.style("opacity", 1)
					.attr("cx", function(d) {
						return path.getPointAtLength(0).x;
					})
					.attr("cy", function(d) {
						return path.getPointAtLength(0).y;
					});

				// ANIMATE PLAYERS
				var avgFields = ["avg5k", "avg10k", "avg20k", "avg25k", "avg30k", "avg35k", "avg40k", "avgOfficial"];
				var avgDistances = [5000, 10000, 20000, 25000, 30000, 35000, 40000, 42195];


				var durFactor = 10;
				svg.selectAll(".players")
					.transition()
					.duration(function(d, i) { return d.avgOfficial * durFactor; })
					.ease(function(t) {
						return t;
					})
					.attrTween("cx", function() {
						var i = d3.interpolate(0, pathLength);
						return function(t) {
							return path.getPointAtLength(i(t)).x;
						}
					})
					.attrTween("cy", function() {
						var i = d3.interpolate(0, pathLength);
						return function(t) {
							return path.getPointAtLength(i(t)).y;
						}
					});

			});

			map.add(po.compass().pan("none"));

		});

	}

	function processTrkpts(xml) {
		var json = { type: "LineString", coordinates: []};
		for (var i = 0; i < xml.length; i++) {
			var lat = parseFloat(xml[i].attributes[0].value);
			var lon = parseFloat(xml[i].attributes[1].value);
			json.coordinates.push([lon, lat]);
		}
		return {"geometry" : json};

	}

	function mapParams(coordinates) {
		var lonSum = 0, latSum = 0;
		var maxLat = -200, minLat = 200, maxLon = -200, minLon = 200;
		var delta = 0.005;

		for (var i = 0; i < coordinates.length; i++) {
			var lat = coordinates[i][1];
			var lon = coordinates[i][0];

			latSum += lat;
			lonSum += lon;

			if (lat > maxLat) {
				maxLat = lat;
			}

			if (lat < minLat) {
				minLat = lat;
			}

			if (lon > maxLon) {
				maxLon = lon;
			}

			if (lon < minLon) {
				minLon = lon;
			}

		}
		return [ lonSum / coordinates.length, latSum / coordinates.length, 
			maxLon + delta, minLat - delta, 
			minLon - delta, maxLat + delta ];
	}

}); 
