

class CongressionalStateHouseMapTemplate extends MapTemplate {
    loadHouseMap(d){
        var file_name = "map_data/congressional_borders/" + id + "/state_house/topo_simple.json";
        
        var old_d  = d;
                        d = topojson.feature( state_sel, state_sel.objects.combined ).features;
                        
                        d3.select("#"+ id).remove();    // remove old state
                        
                        var new_state = self.countriesGroup.select("#"+ id);
                        new_state.data(d).enter().append("path")
                            .attr("class", (id + " Congressional Districts"))
                            .attr("d", self.path)
                            .call(self.zoom);
                        self.countriesGroup = self.svg.select("g.states");
    }
    constructor(passed_map_features){
        super(passed_map_features);
    }
};







   
    
    

