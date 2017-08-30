---
---

var sector = {
    1: 'Public, 4-year or above'
    , 2: 'Private not-for-profit, 4-year or above'
    , 3: 'Private for-profit, 4-year or above'
    , 4: 'Public, 2-year'
    , 5: 'Private not-for-profit, 2-year'
    , 6: 'Private for-profit, 2-year'
    , 7: 'Public, less-than 2-year'
    , 8: 'Private not-for-profit, less-than 2-year'
    , 9: 'Private for-profit, less-than 2-year'
}

function init() {

    // wait until load all
    d3.queue()
	.defer(d3.json, "{{ site.baseurl }}/data/schools.min.geojson")
	.defer(d3.tsv, "{{ site.baseurl }}/data/schools.tsv")
	.await(function(error, schgeo, schdat) {
	    ready(schgeo, schdat);
	});
}

init();

function ready(schgeo, schdat) {

    // init map
    var map = L.map('map').setView([37.8, -96], 5);

    // add map link (bottom right of page)
    mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

    // add tiles
    L.tileLayer(
	'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
	}).addTo(map);

    // add locate icon to map
    L.control.locate({
	setView : 'once'
    }).addTo(map);

    var sch_info_map = [];
    for (var i = 0; i < schdat.length; i++) {
    	sch_info_map[schdat[i].id] = {
	    name: schdat[i].name,
    	    sector: sector[schdat[i].sector]
	};
    };

    // create school icon
    var schoolIcon = L.AwesomeMarkers.icon({
    	icon: 'graduation-cap',
    	prefix: 'fa'
    });

    // init information pane 
    var info = L.control();

    // create div element for information pane
    info.onAdd = function (map) {
    	this._div = L.DomUtil.create('div', 'info'); 
    	this.update();
    	return this._div;
    };
    
    // function to update the info pane
    info.update = function (e) {	
    	this._div.innerHTML = '<h4>School Info</h4>' +
    	    (e ? '<b>' +
	     sch_info_map[e.id].name +
	     '</b><br />' +
	     sch_info_map[e.id].sector
        : 'Click on a school icon');
    };

    // add information to map
    info.addTo(map);

    // function for clicking on marker to add info to info div
    function clickOnMarker(e) {
	var layer = e.target;
	info.update(layer.feature.properties);
    }
 
    // load schools geojson
    var schools = L.geoJson(schgeo, {
    	pointToLayer: function(feature, latlng) {
    	    var marker = L.marker(latlng, {icon : schoolIcon})
    	    return marker;
	},
	onEachFeature: function (feature, layer) {
	    layer.on({
		click: clickOnMarker
	    });
	}
    });

    // init and add clusters to map
    var clusters = L.markerClusterGroup();
    clusters.addLayer(schools);
    map.addLayer(clusters); 
   
}

    
