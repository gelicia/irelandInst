var map;

function init(){
	map = new L.Map("map", {center: [53.4152431, -8.2390307], zoom: 7, minZoom: 6})
    .addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/gelicia.igb21f36/{z}/{x}/{y}.png"));

    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

    var transform = d3.geo.transform({point: projectAndStreamPoint}),
    path = d3.geo.path().projection(transform);
	
	//map vibrates on safari if you set the maxBounds to bounds..
	var bounds = map.getBounds();
	var northEast = L.latLng((bounds._northEast.lat - 0.5), (bounds._northEast.lng - 0.5));
	var southWest = L.latLng((bounds._southWest.lat + 0.5), (bounds._southWest.lng + 0.5));
	var newBounds = L.latLngBounds(southWest, northEast);
  map.setMaxBounds(newBounds);

  d3.select("#map").attr({
    height : screen.height,
    width : screen.width
  });

  //$("#map").height($(window).height()).width($(window).width());
  map.invalidateSize();

  Tabletop.init( { key: '1lxmMW8A8Q0AoGaNXSuFCYF8N1vQGDM9UwPRVj5Hkfp8',
                   callback: mapDraw,//function(data, tabletop) { console.log(data); },
                   simpleSheet: true } );

  function mapDraw(data){
    console.log('sfsfd');
    console.log(data);
  }
   
}

function projectAndStreamPoint(x, y) {
  var point = project([x,y]);
  this.stream.point(point[0], point[1]);
}

  function project(x) {
    var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
    return [point.x, point.y];
  } 