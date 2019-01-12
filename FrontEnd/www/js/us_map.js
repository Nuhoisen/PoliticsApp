var selected_elem = 0
var states_function = function(us){    
    return us.objects.us_states;
}

var state_senate_map_function = function(us){
    // var temp_json = {
        // "geometries": [],
        // "type": "GeometryCollection"
    // }    
    // for(var key in us.objects){
        // var temp = us.objects[key]['geometries'];   
        // temp_json['geometries'].push(temp['0']);
    // }
    return us.objects.combined;
}




class MapTemplate {

     
         
    // Create function to apply zoom to countriesGroup
    zoomed() {
        var self = this;
        var t = d3
            .event
            .transform;
        var countriesGroup = d3.select("g.states");
        countriesGroup
            .attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
                        map_2.bordersGroup
            .attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
    }

    initiateStateZoom(passed_states){
       var self = this;
        // Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides
        self.minZoom = Math.min($("#map-holder").width() / (self.w), $("#map-holder").height() / (self.h));
        // set max zoom to a suitable factor of this value
        self.maxZoom = 20 * self.minZoom;
        // set extent of zoom to chosen values
        // set translate extent so that panning can't cause map to move out of viewport
        self.zoom
          .scaleExtent([self.minZoom, self.maxZoom])
          .translateExtent([[0, 0], [self.w, self.h]])
        ;
        // define X and Y offset for centre of map to be shown in centre of holder
        var midX = ($("#map-holder").width() - self.minZoom * self.w) / 2;
        var midY = ($("#map-holder").height() - self.minZoom * self.h) / 2;
        // change zoom transform to min zoom and centre offsets
        passed_states.call(self.zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(self.minZoom));
        
        
    }

     // Function that calculates zoom/pan limits and sets zoom to default value 
    initiateZoom() {
        var self = this;
        // Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides
        self.minZoom = Math.min($("#map-holder").width() / (self.w), $("#map-holder").height() / (self.h));
        // set max zoom to a suitable factor of this value
        self.maxZoom = 20 * self.minZoom;
        // set extent of zoom to chosen values
        // set translate extent so that panning can't cause map to move out of viewport
        self.zoom
          .scaleExtent([self.minZoom, self.maxZoom])
          .translateExtent([[0, 0], [self.w, self.h]])
        ;
        // define X and Y offset for centre of map to be shown in centre of holder
        var midX = ($("#map-holder").width() - self.minZoom * self.w) / 2;
        var midY = ($("#map-holder").height() - self.minZoom * self.h) / 2;
        // change zoom transform to min zoom and centre offsets
        self.svg.call(self.zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(self.minZoom));
    }
        
    // Define map zoom behaviour
    // zoom to show a bounding box, with optional additional padding as percentage of box size
    boxZoom(box, centroid, paddingPerc) {
        var self = this;
        var minXY = box[0];
        var maxXY = box[1];
        // find size of map area defined
        var zoomWidth = Math.abs(minXY[0] - maxXY[0]);
        var zoomHeight = Math.abs(minXY[1] - maxXY[1]);
        // find midpoint of map area defined
        var zoomMidX = centroid[0];
        var zoomMidY = centroid[1];
        // increase map area to include padding
        zoomWidth = zoomWidth * (1 + paddingPerc / 100);
        zoomHeight = zoomHeight * (1 + paddingPerc / 100);
        // find scale required for area to fill svg
        var maxXscale = $("svg").width() / zoomWidth;
        var maxYscale = $("svg").height() / zoomHeight;
        var zoomScale = Math.min(maxXscale, maxYscale);
        // handle some edge cases
        // limit to max zoom (handles tiny countries)
        zoomScale = Math.min(zoomScale, self.maxZoom);
        // limit to min zoom (handles large countries and countries that span the date line)
        zoomScale = Math.max(zoomScale, self.minZoom);
        // Find screen pixel equivalent once scaled
        var offsetX = zoomScale * zoomMidX;
        var offsetY = zoomScale * zoomMidY;
        // Find offset to centre, making sure no gap at left or top of holder
        var dleft = Math.min(0, $("svg").width() / 2 - offsetX);
        var dtop = Math.min(0, $("svg").height() / 2 - offsetY);
        // Make sure no gap at bottom or right of holder
        dleft = Math.max($("svg").width() - self.w * zoomScale, dleft);
        dtop = Math.max($("svg").height() - self.h * zoomScale, dtop);
        // set zoom
        self.svg
          .transition()
          .duration(500)    
          .call(
            self.zoom.transform,
            d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
          );
    }

    
     
    
    constructor(passed_map_features)
    {
        this.feature_map = passed_map_features;
        this.map_border_class =  this.feature_map['border_class_name'];
        this.access_hook = this.feature_map['feature_access_hook'];
        this.map_file_name = this.feature_map['file_name'];
        this.svg;
        this.minZoom=0;
        this.maxZoom=0;
        this.w = 999;
        this.h = 634.5; 
        
        var self = this;
        // DEFINE FUNCTIONS/OBJECTS
        // Define map projection
        this.projection = d3
            .geoAlbersUsa()
            .scale([self.w]) // scale to fit group width
            .translate([self.w / 2, self.h / 2]) // ensure centred in group
            ;

        this.path = d3.geoPath().projection(self.projection);
      
        
        // Define map zoom behaviour
        this.zoom = d3
            .zoom()
            .on("zoom", self.zoomed);
        
        
        d3.json(this.map_file_name, function(error, us) {
          if (error) throw error;

            self.svg = d3
                .select("#map-holder")
                .append("svg")
                .attr("width", $("#map-holder").width())
                .attr("height", $("#map-holder").height())
                .call(self.zoom);
             
                    
              
            // Draw states
            self.countriesGroup = self.svg.append("g")
                .attr("class", "states")
                .selectAll("path")
                .data(topojson.feature(us, self.access_hook(us)).features)
                .enter().append("path")
                .attr("d", self.path)
                .attr("id", function(d, i) {
                    return d.properties.NAME;
                })
                .on("click", function(d, i){
                    var id = d.properties.NAME;
                    var file_name = "map_data/districts-gh-pages/states/OR/sldl/topo_simple.json";
                    
                    d3.json( file_name, function( error, state_sel ){
                        if ( error ) throw error;
                        var old_d  = d;
                        d = topojson.feature( state_sel, state_sel.objects.combined ).features;
                        
                        d3.select("#"+ id).remove();    // remove old state
                        
                        var new_state = self.countriesGroup.select("#"+ id);
                        new_state.data(d).enter().append("path")
                            .attr("class", (id + " Congressional Districts"))
                            .attr("d", self.path)
                            .call(self.zoom);
                        self.countriesGroup = self.svg.select("g.states");
                        
                        //self.boxZoom(self.path.bounds(d), self.path.centroid(d), 20);
                    });
                    
                    //selected_elem = $("#"+d.properties.NAME);
                    
                    
                });
                 

              // Draw state border paths
            self.bordersGroup = self.svg.append("path")
                .attr("class", self.map_border_class)
                .attr("d", self.path(topojson.mesh(us, self.access_hook(us), function(a, b) { return a !== b; })))
                .call(self.zoom);
                  
            self.initiateZoom();
          
        });
        
        
        // On window resize
        $(window).resize(function() {
            self.svg
              .attr("width", $("#map-holder").width())
              .attr("height", $("#map-holder").height())
            ;
        self.initiateZoom();
    });
    }
    
};


var map_features_1 = {
    "file_name" : "json/new_us_topo.json",
    "border_class_name" :"state-borders",
    "feature_access_hook": states_function
}


var map_features_2 = {
    "file_name" : "map_data/districts-gh-pages/states/OR/sldl/topo_simple.json",
    "border_class_name" :"state-senate-borders",
    "feature_access_hook": state_senate_map_function
}

var map_2 = new MapTemplate(map_features_1);






   
    
    

