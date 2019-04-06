
var genericMeshFunction = function(self, us){
    return topojson.mesh(us, self.access_hook(us), function(a, b) { return a !== b; });
}

// var meshFunction = genericMeshFunction;

class MapTemplate extends UI {
    
    zoomed(self){}
    
    initiateZoom() {}
    
    
    
     // Resets map while performing half-second transition
    zoomOut(){
        var self = this;
        self.minZoom = Math.min($( "#map-holder").width() / (self.w), $( "#map-holder").height() / (self.h)); //#map-holder
        var midX = ($("#map-holder").width() - self.minZoom * self.w) / 2;
        var midY = ($("#map-holder").height() - self.minZoom * self.h) / 2;
        // change zoom transform to min zoom and centre offsets
        return self.svg
            .transition()
            .duration(500)
            .call(self.zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(self.minZoom));
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
    selectedClickListener(d, i){}
    selectedExtractID(d){}
    
    selectPathByID(id){
        var self = this;
        return self.countriesGroup.select("#"+id);
    }
    
   meshFunction(self, us){
        return genericMeshFunction(self, us);
   };
    
    generateMapPaths(file_name){
        var self = this;
        self.map_file_name = file_name;
        self.path_ids = [];
        d3.json(this.map_file_name, function(error, us) {
            if (error) throw error;
            
            // Draw states
            self.countriesGroup.selectAll("path")
                .data(topojson.feature(us, self.access_hook(us)).features)
                .enter().append("path")
                .attr("d", self.path)
                .attr("class", "state-neutral")
                .attr("id", function(d, i) {
                   var path_id = self.selectedExtractID(d).split(" ").join("-"); 
                    self.path_ids.push(path_id);
                    return path_id;
                })
                .on("click", function(d, i){
                    self.selectedClickListener(d, i);
                });
                
              // Draw state border paths
            self.bordersGroup = self.svg.append("path")
                .attr("class", self.map_border_class)
                .attr("d", self.path( self.meshFunction( self, us ) ) );
                
                
            self.svg.call(self.zoom);
            self.initiateZoom();
            // On window resize
            $(window).resize(function() {
                self.svg
                  .attr("width", $("#map-holder").width())
                  .attr("height", $("#map-holder").height())
                ;
                self.initiateZoom();
            });
        });
    }
    
    generateContainer(){
        var self = this;
        d3.select("."+self.creator.class_name)
            .append("div")
            .attr("class", self.class_name)
            .attr("id", "map-holder");
            
    }

    generateMapSVG(){
        var self = this;
        self.svg = d3
            .select("." + self.class_name)//"#map-holder")
            .append("svg")
            .attr("class", "states-svg")
            .attr("width", $("#map-holder").width())//"#map-holder").width())
            .attr("height", $("#map-holder").height())//"#map-holder").height())
            .call(self.zoom);
    }
   
    generateMapG(){
        var self = this;
         self.countriesGroup = self.svg.append("g")
            .attr("class", "states");
    }
    
     
    generateMap(){
        var self = this;
        self.generateContainer();
        self.generateMapSVG();
        self.generateMapG();
        self.generateMapPaths(this.map_file_name);
    }
    
    constructor(ui_class_name, creator,  attr){
        super(ui_class_name, creator, attr);
        this.creator = creator;
        this.attr = attr;
        this.map_border_class =  this.attr['border_class_name'];
        this.access_hook = this.attr['feature_access_hook'];
        this.map_file_name = this.attr['file_name'];
        this.svg;
        this.minZoom=0;
        this.maxZoom=0;
        this.w = 999;
        this.h = 634.5; 
        this.selected_state = "none";
        this.previous_scale  = 0;
        this.path_ids = [];
        this.ui = NaN;
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

}