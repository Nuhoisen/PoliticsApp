

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


    