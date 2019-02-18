

class CongressionalUI extends UI{//extends StateUI {
    
    
    
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
  
     
    generateHTML(){
        var self = this;
        super.generateHTML();
        
        var html = "<div class='congressional-ui congressional-label'>Text</div> \
                        <div class='congressional-button-container'> \
                            <a  id='congressional-left-button' class='congressional-ui congressional-buttons'>State Senate</a> \
                            <a id='congressional-right-button' class='congressional-ui congressional-buttons'>State House</a> \
                        </div> \
                        <a class='congressional-exit-button congressional-ui'>Back</a>";
        
        $(".ui-body").addClass("congressional-ui");
        
        d3.select(".congressional-label")
                .html(self.selected_state_id);
        
        self.footer.generateHTML();
        $(".state-ui").css("z-index", 1);
        
        
    }
    
    addListeners(){
        var self = this;
        
        d3.select("#state-left-button")
                .on("click", function(){
                    self.stateSenateListener();
                });
                       
            
        d3.select("#state-right-button")
            .on("click", function(){
                self.stateHouseListener();
            });
                
                
        d3.select(".congressional-exit-button")
            .on("click", function(){
                self.state_congressional_map.removeMapPaths();
                self.creator.generateMapPaths("map_data/new_simpler_us_topo.json")
                self.removeUI();
                self.creator.zoomOut();
            });
         
        
        self.footer.addListeners();
    }
    
    
    applyUI(id){
        var self = this;
        self.selected_state_id = id;
        self.generateHTML();
        
            
       self.addListeners();
       
            // $(".congressional-ui").css("z-index", 1);
        // }
        
    }
    
    
    constructor(ui_class_name, creator){
       super(ui_class_name, creator);
       this.footer = new ToggleFooter(this);
    }
}


// var cong_ui = new CongressionalUI("congressional-ui");



