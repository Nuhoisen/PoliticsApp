

class StateUI {
    
    generateCongressionalMap(file_name){
       // Possibly Remove
        var self = this;
        var selected = d3.select("#"+self.selected_state_id);
        this.old_states_data = selected.data();
        
        congr_map.map_file_name  = file_name;
        congr_map.appendToParentMap(self.selected_state_id);
    }
    
    // Removes UI and zooms out
    softStateExitListener(){
        var self = this;
        self.removeUI();
        us_state_map.zoomOut();
    }
    
    
    // Removes UI & Map data & replaces it with Country Map
    hardStateExitListener(){
        var self = this;
        congr_map.removeMapPaths();
        us_state_map.generateMapPaths("map_data/new_simpler_us_topo.json")
        self.softStateExitListener();
    }
    
    
   
    // Pulls senate geo filename and calls generate function
    stateSenateListener(){
        var self = this;
        var file_name = "map_data/congressional_borders/" + self.selected_state_id + "/state_senate/topo_simple.json";
        self.generateCongressionalMap(file_name);
        self.applyExitListener();   
    }
    
    // Pulls house geo filename and calls generate function
    stateHouseListener(){
        var self = this;
        var file_name = "map_data/congressional_borders/" + self.selected_state_id + "/state_house/topo_simple.json";
        self.generateCongressionalMap(file_name);
        self.applyExitListener();
    }
    
    // Cause UI fadeout
    opaqueUI(){
        d3.selectAll(".state-ui")
            .transition()
            .style("opacity", 0);
    }
    
    // Removes UI after fadeout
    // Resets the ui_generated flag
    removeUI(){
        var self = this;
        d3.selectAll(".state-ui").remove();
        
        self.ui_generated = false;
    }
     
     
    // Appends HTML to existing HTML
    // Sets the ui_generated flag to true
    generateHTML(){
        var self = this;
        var html = "<div class='state-ui container'> \
                        <div class='state-ui state-label'>Text</div> \
                        <div class='state-button-container'> \
                            <a  id='state-left-button' class='state-ui state-buttons'>State Senate</a> \
                            <a id='state-right-button' class='state-ui state-buttons'>State House</a> \
                        </div> \
                        <a class='state-exit-button state-ui'>Back</a> \
                    </div>" ;
        
        $("#map-holder").append(html);
        self.ui_generated = true;
        
    } 
    
    applyExitListener(){
        var self = this;
        if(reg_flag.exists()){
            d3.select(".state-exit-button")
                .on("click", function(){
                       self.hardStateExitListener(); 
                });   
        }
        else{
            d3.select(".state-exit-button")
                .on("click", function(){
                       self.softStateExitListener(); 
                });   
        }
    }
    
    
    applyUI(id, exit_override=false){
        var self = this;
        self.selected_state_id = id;
        if(self.ui_generated){
            console.log("This should not be hit");
            d3.select(".state-label")
                .html( self.selected_state_id );
            
            d3.selectAll(".state-ui")
                .style("opacity", 1);
        }
        else{
            self.generateHTML();
            
            d3.select(".state-label")
                .html( self.selected_state_id );
            
            $(".state-ui").css("z-index", 1);
            
            d3.selectAll(".state-ui")
                .style("opacity", 1);
            
            d3.select("#state-left-button")
                .on("click", function(){
                    self.stateSenateListener();
                });
            
                   
            
            d3.select("#state-right-button")
                .on("click", function(){
                    self.stateHouseListener();
                });
            
          
            self.applyExitListener();   
            
        }
    }
    
    
    constructor(){
        this.state_congressional_map = null;
        this.old_states_data;
        this.ui_generated = false;
        this.selected_state_id = null;
    }
}

var state_ui = new StateUI();
    