var selected_elem = 0
var states_function = function(us){    
    return us.objects.us_states;
}

var state_senate_map_function = function(us){
    return us.objects.combined;//us_states;
}


class MapTemplate {
    
    // Create function to apply zoom to countriesGroup
    zoomed(self) {
        var t = d3
            .event
            .transform;
            
        // if( self.previous_scale > t.k )
        // {
            // self.removeStateSelection();
            // self.state_ui.removeStateUI();    //interface screen
            // self.previous_scale = 0;
        // }    
        
        //save previous scale
        self.countriesGroup.attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
        self.bordersGroup.attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
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
          .translateExtent([[0, 0], [self.w, self.h]]);
          
        // define X and Y offset for centre of map to be shown in centre of holder
        var midX = ($("#map-holder").width() - self.minZoom * self.w) / 2;
        var midY = ($("#map-holder").height() - self.minZoom * self.h) / 2;
        // change zoom transform to min zoom and centre offsets
        self.svg.call(self.zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(self.minZoom));
        self.previous_scale = self.minZoom;
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
        
        self.previous_scale = 0;
        // Set zoom
        self.svg
          .transition()
          .duration(500)   
          .call(
            self.zoom.transform,
            d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
          )
          .on("end", function(){
              self.previous_scale = zoomScale;
          });
    }

    
    // Removes selected effects of states
    removeStateSelection(){
        
        d3.select("g.states").selectAll("path")
            .transition()
            .style("opacity", 1)
            .attr("class", null);
    }
    
    
    applyStateSelection(id){
        var self = this;
        // Select all states initially, default: unselected
        var all_paths = d3.select("g.states").selectAll("path")
            .attr("class", "state-unselected");
        
        // Select clicked state. Set opacity: 1
        d3.select("#"+ id)
            .attr("class", "state-selected")
            .style("opacity", 1);
            
        // Change opacity of the other states
        d3.selectAll(".state-unselected")
            .transition()
            .style("opacity", .5);
        
        self.selected_state = id;
    }
    
   
    generateMap(){
        var self = this;
         d3.json(this.map_file_name, function(error, us) {
          if (error) throw error;

           self.svg = d3
                .select("#map-holder")
                .append("svg")
                .attr("class", "states-svg")
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
                .attr("class", "state-neutral")
                .attr("id", function(d, i) {
                   return d.properties.NAME.split(" ").join("-"); // return d.properties.NAMELSAD.split(" ").join("-");//
                })
                .on("click", function(d, i){
                    var id = d.properties.NAME.split(" ").join("-");
                    self.boxZoom(self.path.bounds(d), self.path.centroid(d), 20);
                    self.applyStateSelection(id);
                    self.state_ui.applyStateUI(id, self);
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
        this.selected_state = "none";
        this.previous_scale  = 0;
        this.state_ui = new StateUI();
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
            .on("zoom", function(){
                self.zoomed(self);
            });     

        
    }
    
};


var map_features_1 = {
    "file_name" : "map_data/new_simpler_us_topo.json",
    "border_class_name" :"state-borders",
    "feature_access_hook": states_function
}


var map_features_2 = {
    "file_name" : "map_data/congressional_borders/Oregon/state_house/topo_simple.json", //
    "border_class_name" :"state-senate-borders",
    "feature_access_hook": state_senate_map_function
}

var map_2 = new MapTemplate(map_features_1);
map_2.generateMap(); 





   
    
    

