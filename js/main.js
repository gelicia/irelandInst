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
  //map.setMaxBounds(newBounds);

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
    for (var i = 0; i < data.length; i++) {
      var coordinate = data[i].geographicalcoordinatesifknown;

      //I know I could do this all at once but I don't want to :( 
      if (coordinate !== '' && coordinate.split(",").length == 2){
        var coords = coordinate.split(",");
        coords[0] = coords[0].trim();
        coords[1] = coords[1].trim();
        if (coords[0].search('^(-)?[0-9]*[.][0-9]+$') !== -1 &&  coords[1].search('^(-)?[0-9]*[.][0-9]+$') !== -1 ){
          var marker = L.marker([coords[0], coords[1]]).addTo(map);

          var outScript = "";

          for (var prop in data[i]){
            if (data[i][prop] !== ""){
              outScript = outScript + "<p><b>" + prop + "</b> : " + data[i][prop] + "</p>";
            }
          }

          marker.bindPopup(outScript);
        }
      }
    }

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