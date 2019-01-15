var selected_elem = 0
var states_function = function(us){    
    return us.objects.us_states;
}

var state_senate_map_function = function(us){
    return us.objects.combined;//us_states;
}


class CongressionalMapTemplate extends MapTemplate{
    
   // Removes selected effects of states
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
    
    appendToParentMap(parent_id){
        var self = this;
        d3.json(this.map_file_name, function(error, us) {
          if (error) throw error;             
            var old_d = topojson.feature( us, us.objects.combined ).features;

              
            // Draw states
            self.selected_state = d3.select("#"+parent_id);
            self.selected_state_data = self.selected_state.data()['0'];
            
            self.selected_state.remove();
            
            self.countriesGroup = d3.select("g.states");
            var country_data = self.countriesGroup.selectAll("path").data();    
            
            // var new_d = {};
            // for (var key in old_d)
            // {
                // key = parseInt(key);
                // var new_key = key + country_data['length'];
                // new_d[new_key.toString()] = old_d[key.toString()];
            // }
            // var final_d = Object.assign({},new_d, country_data);
            self.countriesGroup.selectAll("path").remove();
            self.countriesGroup.selectAll("path")
                .data(old_d)
                .enter().append("path")
                .attr("d", self.path)
                .attr("class", (parent_id + "-Congressional-Districts"))
                .attr("id", function(d, i) {
                    return d.properties.NAMELSAD.split(" ").join("-");
                });
            

            self.svg = d3
                .select("svg.states-svg")
                .attr("width", $("#map-holder").width())
                .attr("height", $("#map-holder").height())
                .call(self.zoom);;
         
            
              // Draw state border paths
            self.bordersGroup = self.svg.append("path")
                .attr("class", self.map_border_class)
                .attr("d", self.path(topojson.mesh(us, us.objects.combined, function(a, b) {return a !== b; })))
                .call(self.zoom);
                  
           self.svg.select("path.state-borders").remove();
           self.initiateZoom();
           self.boxZoom(self.path.bounds(self.selected_state_data), self.path.centroid(self.selected_state_data), 20);
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
