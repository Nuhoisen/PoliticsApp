var svg ;

// DEFINE FUNCTIONS/OBJECTS
// Define map projection
var projection = d3
    .geoAlbersUsa()
    .scale([w]) // scale to fit group width
    .translate([w / 2, h / 2]) // ensure centred in group
    ;

var path = d3.geoPath();
var minZoom;
var maxZoom;
var w = 999;
var h = 634.5;   
     
// Create function to apply zoom to countriesGroup
function zoomed() {
    t = d3
        .event
        .transform;
    
    countriesGroup
        .attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
                    bordersGroup
        .attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
}

// Define map zoom behaviour
var zoom = d3
    .zoom()
    .on("zoom", zoomed);

 // Function that calculates zoom/pan limits and sets zoom to default value 
function initiateZoom() {
    // Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides
    minZoom = Math.min($("#map-holder").width() / (w), $("#map-holder").height() / (h));
    // set max zoom to a suitable factor of this value
    maxZoom = 20 * minZoom;
    // set extent of zoom to chosen values
    // set translate extent so that panning can't cause map to move out of viewport
    zoom
      .scaleExtent([minZoom, maxZoom])
      .translateExtent([[0, 0], [w, h]])
    ;
    // define X and Y offset for centre of map to be shown in centre of holder
    midX = ($("#map-holder").width() - minZoom * w) / 2;
    midY = ($("#map-holder").height() - minZoom * h) / 2;
    // change zoom transform to min zoom and centre offsets
    svg.call(zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(minZoom));
}
    
// Define map zoom behaviour
// zoom to show a bounding box, with optional additional padding as percentage of box size
function boxZoom(box, centroid, paddingPerc) {
    minXY = box[0];
    maxXY = box[1];
    // find size of map area defined
    zoomWidth = Math.abs(minXY[0] - maxXY[0]);
    zoomHeight = Math.abs(minXY[1] - maxXY[1]);
    // find midpoint of map area defined
    zoomMidX = centroid[0];
    zoomMidY = centroid[1];
    // increase map area to include padding
    zoomWidth = zoomWidth * (1 + paddingPerc / 100);
    zoomHeight = zoomHeight * (1 + paddingPerc / 100);
    // find scale required for area to fill svg
    maxXscale = $("svg").width() / zoomWidth;
    maxYscale = $("svg").height() / zoomHeight;
    zoomScale = Math.min(maxXscale, maxYscale);
    // handle some edge cases
    // limit to max zoom (handles tiny countries)
    zoomScale = Math.min(zoomScale, maxZoom);
    // limit to min zoom (handles large countries and countries that span the date line)
    zoomScale = Math.max(zoomScale, minZoom);
    // Find screen pixel equivalent once scaled
    offsetX = zoomScale * zoomMidX;
    offsetY = zoomScale * zoomMidY;
    // Find offset to centre, making sure no gap at left or top of holder
    dleft = Math.min(0, $("svg").width() / 2 - offsetX);
    dtop = Math.min(0, $("svg").height() / 2 - offsetY);
    // Make sure no gap at bottom or right of holder
    dleft = Math.max($("svg").width() - w * zoomScale, dleft);
    dtop = Math.max($("svg").height() - h * zoomScale, dtop);
    // set zoom
    svg
      .transition()
      .duration(500)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
      );
}

d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
  if (error) throw error;

    svg = d3
        .select("#map-holder")
        .append("svg")
        .attr("width", $("#map-holder").width())
        .attr("height", $("#map-holder").height())
        .call(zoom);
 
        
  
  // Draw states
  countriesGroup = svg.append("g")
    .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
    .attr("d", path)
    .attr("id", function(d, i) {
        return d.id;
    })
    .on("click", function(d, i){
        boxZoom(path.bounds(d), path.centroid(d), 20);
    });
     

  // Draw state border paths
  bordersGroup = svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })))
      .call(zoom);
      
  initiateZoom()
      
});




// On window resize
$(window).resize(function() {
    svg
      .attr("width", $("#map-holder").width())
      .attr("height", $("#map-holder").height())
    ;
    initiateZoom();
});