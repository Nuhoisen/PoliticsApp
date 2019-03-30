

class USRepresentativeMapTemplate extends CongressionalMapTemplate{    


    selectedExtractID(d){
        return "district-" + d.properties.district;//d.properties.NAMELSAD;
    }

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
                .attr("d", self.path(topojson.mesh(us)))//, self.access_hook(us), function(a, b) { return a !== b; })));
                
                
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
    
}