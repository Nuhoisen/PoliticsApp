var selected_elem = 0


var stateSenateMapFunction = function(us){
    return us.objects.combined;//us_states;
}



var genericExtractIDFunction = function(d){
        return  d.properties.NAMELSAD;
}

var usRepresentativeMeshFunction = function(self, us){
    return topojson.mesh(us);
}

var usRepresentativeExtractIDFunction = function(d){
        return d.properties.state_name + "-District-" + d.properties.district;
}

class CongressionalMapTemplate extends MapTemplate{    
    // Create function to apply zoom to countriesGroup
    zoomed(self) {
        var t = d3
            .event
            .transform;
            
        if( self.previous_scale > t.k )
        {
            self.removeStateSelection();
            self.previous_scale = 0;
            self.ui.removeUI();    //interface screen
            self.ui.applyUI(self.selected_state_id);
            
        }    
        
        //save previous scale
        self.countriesGroup.attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
        self.bordersGroup.attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
    }
   
    // Removes selected effects of states
    initiateZoom() {
        var self = this;
        // Inside initiateZoon, reset the old scale factor
        self.previous_scale = 0;
        // Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides
        self.minZoom = Math.min($("#map-holder").width() / (self.w), $("#map-holder").height() / (self.h));
        // set max zoom to a suitable factor of this value
        self.maxZoom = 20 * self.minZoom;

          
        // define X and Y offset for centre of map to be shown in centre of holder
        var midX = ($("#map-holder").width() - self.minZoom * self.w) / 2;
        var midY = ($("#map-holder").height() - self.minZoom * self.h) / 2;
        // change zoom transform to min zoom and centre offsets
        self.svg.call(self.zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(self.minZoom));
        // self.previous_scale = self.minZoom;
        
        
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
     
        // Set zoom
        self.svg          
          .call(
            self.zoom.transform,
            d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
          );
          
        var minX = box[0][0];
        var minY = box[0][1];
        var maxX = box[1][0];
        var maxY = box[1][1];        
        
        // 20% Free movement
        minX = minX -(minX *.2);
        minY = minY -(minY *.2);
        maxX = maxX +(maxX *.2);
        maxY = maxY +(maxY *.2);
        
        self.zoom
          .scaleExtent([zoomScale, zoomScale*20])
          .translateExtent( [ [ minX, minY ], [ maxX, maxY ] ] );
    }
    
	// This applies state color affects based on whether
	// The state is republican, democrat, or mixed,
	// Senator majority
    statePartisanClassifier (response_json){
        var self = this;
        
        response_json = JSON.parse(response_json);
		for (var i = 0 ; i < response_json.length; i = i +1 ) {
			var subject_district = response_json[i];
		// for (var key in response_json) {
			
            if(subject_district["PartyAffiliation"].includes('R')) // RED
            {
                d3.select("#" + subject_district["District"].replace(/ /g, "-"))
                    .style("fill", "#ff4a4a");
            }
            else if(subject_district["PartyAffiliation"].includes('D')) // BLUE
            {
                d3.select("#" + subject_district["District"].replace(/ /g, "-"))
                    .style("fill", "#7676e3");
            }
            else //PURPLE
            {
                d3.select("#" + subject_district["District"].replace(/ /g, "-"))
					.style("fill", "#b75696");
            }
        }
    }
	
	
	
	// This function checks if each role-type list has been cached.
	// if so, it applies 
	// If not , it executes makes a call to the server to retrieve this information.
    generatePartisanList(){
        var self = this;
		
		var args = "";
		
		// If the list doesn't exist make a request to the server to retrieve it.
		if(!self.accumulative_state_level_partisan_list){
			args = "state=" + self.selected_state_id;
			get_state_partisanships(args, function(response_text){
				self.accumulative_state_level_partisan_list = response_text;
				
				// Apply the call back only to the state senators 
				self.statePartisanClassifier(self.accumulative_state_level_partisan_list);
			});
		}
		// Otherwise, just apply it to the make
		else{
			self.statePartisanClassifier(self.accumulative_state_level_partisan_list);
		}
		
    }

	
  
    // Sets opacity to zero before removing congressional district paths
    removeMapPaths()
    {
        var self = this;
        d3.select("g.states").selectAll("path").remove();
        d3.select("svg.states-svg").select("path.state-senate-borders").remove();
        reg_flag.destroy();
        
        self.svg.on("mousedown.zoom", null);
        self.svg.on("mousemove.zoom", null);
        self.svg.on("dblclick.zoom", null);
        self.svg.on("touchstart.zoom", null);
        self.svg.on("wheel.zoom", null);
        self.svg.on("mousewheel.zoom", null);
        self.svg.on("MozMousePixelScroll.zoom", null);
    }
    
    // Activates when a congressional district is clicked
    selectedClickListener(d, i){
        var self = this;
        // ID Is selected from the the element tag field
        var id = self.selectedExtractID(d).split(" ").join("-");
        self.boxZoom(self.path.bounds(d), self.path.centroid(d), 20);
        self.applyStateSelection(id);
        self.ui.setDistrictInfo(id);
        self.ui.addLabel(); 
        self.ui.retrievePoliticianImages(id);
    }
    
    selectedExtractID(d){
        return genericExtractIDFunction(d);
    }
    
    // Sets up function overrides for US vs State Reps/Sens
	// Function overrides are going to mainly affect
	// the generation of ID retrieval on a map basis in order to 
	// avoid any null error
    overrideClassFunctions(subClassName="State Senator"){
        var self = this;
        switch(subClassName){
            case "US Representative":
                self.selectedExtractID = usRepresentativeExtractIDFunction;
                self.meshFunction = usRepresentativeMeshFunction;
            break;
            default:
                self.selectedExtractID = genericExtractIDFunction;
                self.meshFunction = genericMeshFunction;
        }
    }
    
    
    // Takes existing map, removes state & border paths
    // and adds congressional district paths
    appendToParentMap(parent_id){
        var self = this;
            
        // Need to Consider Changing this
        if(!reg_flag.exists()){
            reg_flag.create();
            self.selected_state_id = parent_id;
            self.selected_state = d3.select("#"+self.selected_state_id.replace(/ /g, "-"));
            self.selected_state_data = self.selected_state.data()['0'];            
        }
        
        // Set SVG handle
        self.svg = d3.select("svg.states-svg")
                    .call(self.zoom);
        
        // Set g handle
        self.countriesGroup = d3.select("g.states");
        
        // Make State map fade out, add congressional paths & and borders
        self.svg
            .transition()
            .style("opacity", "0")
            .on("end", function(){
                
                self.countriesGroup.selectAll("path").remove();
                self.svg.select("path.state-borders").remove();
                self.svg.select("path.state-senate-borders").remove();
                self.generateMapPaths(self.map_file_name)
				.then(function(){                    
                    self.svg.style("opacity", "1");
                    self.ui.setStateInfo(self.selected_state_id);
                    self.ui.applyUI();
					
                });
            });
            
        
        
    }
    
   
    constructor(class_name, creator, attr){
        super(class_name,creator,attr);
        this.ui = new CongressionalUI("congressional-ui", this);
        this.selected_state = null;
        this.selected_state_data = null;
        this.selected_state_id = null;
		
		// Partisan list for state senators, representives, and US representives
		this.accumulative_state_level_partisan_list = null;
        
    }
    
};


var map_features_2 = {
    // "file_name" : "map_data/congressional_borders/Alabama/state_house/topo_simple.json", //
    "file_name" : "map_data/congressional_borders/Alabama/state_house/topo_simple.json", //
    "border_class_name" :"state-senate-borders",
    "feature_access_hook": stateSenateMapFunction
}

