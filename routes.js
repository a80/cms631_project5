$(document).ready(function() {
	console.log("ROUTES");

	var width = 600, height = 400;
	var svg = d3.select("#mapContainer").append("svg")
		.attr("width", width).attr("height", height)
		.attr("id", "map");

	var colorScale = d3.scale.category10();

	var po = org.polymaps;
	var map = po.map().container(document.getElementById("map")).add(po.interact());
	map.add(po.image()
		.url(po.url("http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png")
			.hosts(["a.", "b.", "c.", ""])));

	d3.xml("data/marathon_route.gpx", "application/xml", function(xml) {
		console.log(xml.documentElement.getElementsByTagName("trkpt"));

	});

	map.add(po.compass().pan("none"));


});