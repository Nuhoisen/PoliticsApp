

class StateUI {
    
    stateSenateListener(id, parent){
        var self = this;
        
        var file_name = "map_data/congressional_borders/" + id + "/state_house/topo_simple.json";

        var selected = d3.select("#"+id);
        this.old_states_data = selected.data();
        
        var new_map_features = {
            "file_name" : file_name, //
            "border_class_name" : "state-senate-borders",
            "feature_access_hook": state_senate_map_function
        }
        
        this.state_congressional_map = new CongressionalMapTemplate(new_map_features);
        this.state_congressional_map.appendToParentMap(id);
        // d3.json(file_name, function(error, state_sel) {
            
            
            
            // if (error) throw error;
          
            
            
            // var d = topojson.feature( state_sel, state_sel.objects.combined ).features;
            
            // selected.remove();
            // var new_mapping = d3.select("g.states").select("#"+id);
            
            // new_mapping
                // .data(d).enter()
                // .append("path")
                // .attr("class", (id + "-Congressional-Districts"))
                // .attr("d", parent.path)
                // .call(parent.zoom);
          
        // });
        
    }
    
    stateHouseListener(id, parent){
        
        console.log(id);
    }
    
    removeStateUI(){
        $(".state-ui").css("z-index", -1);
        d3.selectAll(".state-ui")
            .transition()
            .style("opacity", 0);
    }
     
    applyStateUI(id, parent){
        var self = this;
        
        d3.select(".state-label")
            .html(id);
        
        $(".state-ui").css("z-index", 1);
        
        d3.selectAll(".state-ui")
            .transition()
            .style("opacity", 1);
            
            
        d3.select("#state-left-button")
            .on("click", function(){
                self.stateSenateListener(id, parent);
            });
            
                   
            
        d3.select("#state-right-button")
            .on("click", function(){
                self.stateHouseListener(id, parent);
            });
    }
    
    
    constructor(){
        this.state_congressional_map = null;
        this.old_states_data;
    }
}


    