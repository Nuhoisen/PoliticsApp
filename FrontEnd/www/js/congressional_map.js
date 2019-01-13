var selected_elem = 0
var states_function = function(us){    
    return us.objects.us_states;
}

var state_senate_map_function = function(us){
    return us.objects.combined;//us_states;
}


class CongressionalMapTemplate extends MapTemplate{
    
   // Removes selected effects of states

    
    
    // generateMap(){
        // var self = this;
        
        // d3.json(this.map_file_name, function(error, us) {
          // if (error) throw error;

            // self.svg = d3
                // .select("#map-holder")
                // .append("svg")
                // .attr("width", $("#map-holder").width())
                // .attr("height", $("#map-holder").height())
                // .call(self.zoom);
             
                    
              
            // // Draw states
            // self.countriesGroup = self.svg.append("g")
                // .attr("class", "states")
                // .selectAll("path")
                // .data(topojson.feature(us, self.access_hook(us)).features)
                // .enter().append("path")
                // .attr("d", self.path)
                // .attr("class", "state-neutral")
                // .attr("id", function(d, i) {
                    // return d.properties.NAMELSAD.split(" ").join("-");
                // })
                // .on("click", function(d, i){
                    // var id = d.properties.NAMELSAD.split(" ").join("-");
                    // self.boxZoom(self.path.bounds(d), self.path.centroid(d), 20, id);
                // });

              // // Draw state border paths
            // self.bordersGroup = self.svg.append("path")
                // .attr("class", self.map_border_class)
                // .attr("d", self.path(topojson.mesh(us, self.access_hook(us), function(a, b) { return a !== b; })))
                // .call(self.zoom);
                  
            // self.initiateZoom();
          
        // });
        
        
        // // On window resize
        // $(window).resize(function() {
            // self.svg
              // .attr("width", $("#map-holder").width())
              // .attr("height", $("#map-holder").height())
            // ;
            // self.initiateZoom();
        // });
        
    // }
    
    initiateZoom()
    {
        var self = this;
        var box = self.path.bounds(self.selected_state_data);
        var centroid = self.path.centroid(self.selected_state_data);
        var paddingPerc = 20;
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
        
        
        self.svg
          .transition()
          .duration(500)   
          .call(
            self.zoom.transform,
            d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
          );
        
    }
    
    
    appendToParentMap(parent_id){
        var self = this;
        d3.json(this.map_file_name, function(error, us) {
          if (error) throw error;             
            var d = topojson.feature( us, us.objects.combined ).features;

              
            // Draw states
            self.selected_state = d3.select("#"+parent_id);
            self.selected_state_data = self.selected_state.data()['0'];
            
            self.selected_state.remove();
            
            self.countriesGroup = d3.select("g.states");
                
            self.countriesGroup.selectAll("path").remove();
            self.countriesGroup.selectAll("path")
                .data(d)
                .enter().append("path")
                .attr("d", self.path)
                .attr("class", (parent_id + "-Congressional-Districts"))
                .attr("id", function(d, i) {
                    return d.properties.NAMELSAD.split(" ").join("-");
                })
                .call(self.zoom);
            

            self.svg = d3
                .select("svg.states-svg");
         
            
              // Draw state border paths
            self.bordersGroup = self.svg.append("path")
                .attr("class", self.map_border_class)
                .attr("d", self.path(topojson.mesh(us, us.objects.combined, function(a, b) {return a !== b; })))
                .call(self.zoom);
                  
            self.svg.select("path.state-borders").remove();
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
        super(passed_map_features);
        self.selected_state = null;
        self.selected_state_data = null;
    }
    
};


// var map_features_1 = {
    // "file_name" : "map_data/new_simpler_us_topo.json",
    // "border_class_name" :"state-borders",
    // "feature_access_hook": states_function
// }


var map_features_2 = {
    "file_name" : "map_data/congressional_borders/Alabama/state_house/topo_simple.json", //
    "border_class_name" :"state-senate-borders",
    "feature_access_hook": state_senate_map_function
}

// var map_2 = new CongressionalMapTemplate(map_features_2);
