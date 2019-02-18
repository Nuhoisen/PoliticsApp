

class StateUI extends UI{
    // Congressional Map
    generateCongressionalMap(file_name){
        var self = this;
        var selected = d3.select("#"+self.selected_state_id);
        this.old_states_data = selected.data();
        
        self.removeUI();
        self.state_congressional_map.map_file_name  = file_name;
        self.state_congressional_map.appendToParentMap(self.selected_state_id);
    }
    
    // Appends HTML to existing HTML
    // Sets the ui_generated flag to true
    generateHTML(){
        var self = this;
        super.generateHTML();
        
        var html = "<div class='state-ui state-label'>Text</div> \
                    <div class='state-button-container'> \
                        <a  id='state-left-button' class='state-ui state-districts-button state-buttons'>Districts</a> \
                    </div> \
                    <a class='state-exit-button state-ui'>Back</a>" ;

        $(".ui-body").addClass("state-ui");
        
        $(".ui-body").append(html);
        
        self.addLabel(self.selected_state_id);
        self.footer.generateHTML();
        
       $(".state-ui").css("z-index", 1);
       
       d3.selectAll(".state-ui")
            .style("opacity", 1);
    }
      
    // Modifies the Title Label
    addLabel(id){
        var self = this;
        self.selected_state_id = id;
        d3.select(".state-label")
            .html( self.selected_state_id );
    }
    
    
    // Adds the district listener,
    // the back listener, 
    // and the footer listeners
    addListeners(){
        var self = this;
        
        d3.select(".state-districts-button")
            .on("click", function(){
                var file_name = "map_data/congressional_borders/" + self.selected_state_id + "/state_senate/topo_simple.json";
                self.removeUI();
                self.generateCongressionalMap(file_name);
            });
            
        d3.select(".state-exit-button")
            .on("click", function(){
                    self.removeUI();
                    self.creator.zoomOut();
            });
            
        self.footer.addListeners();
    }
    
    
    // Generates HTML
    // Saves the selected state
    // Calls addListeners
    applyUI(id){
        var self = this;
        self.selected_state_id = id;
        self.generateHTML();
        
        self.addListeners(); 
    }
    
    
    constructor(ui_class_name, creator){
        super(ui_class_name, creator);
        
        this.state_congressional_map = new CongressionalMapTemplate(map_features_2, this);
        this.footer = new ToggleFooter(this);
        this.old_states_data;
        
        this.selected_state_id = null;
        this.ui_class_name = ui_class_name;
    }
}

    