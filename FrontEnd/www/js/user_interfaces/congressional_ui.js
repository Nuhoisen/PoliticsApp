

class CongressionalUI extends UI{//extends StateUI {
    
    // Retrieve political images
     retrieveProfileImages(id){
         var self = this;
         self.retrievePoliticianImage(id);
     }
    
    
    // Make a client call to the server, request the 
    // image of the politician by state & role
     retrievePoliticianImage(id){
         var self = this;
         id = id.replace(/-/g, " ");
         var args = "state=" + self.creator.creator.selected_state_id + "&role=" + self.selected_role + "&district=" + id;
         get_state_politician_prof_img(args, self.loadPoliticianImage.bind(self));
     }
     
     
    // Load the politician's image
    loadPoliticianImage(urls){
        var self = this;
        var urls = urls.split(',');
        
        // When they click the profile picture 
        d3.selectAll(".state-politician-img")
            .attr("src", urls[0])
            .on("click", function(){
                var img_url = this.src;
                self.creator.creator.creator.creator.profile_page.loadPoliticianImage(img_url);
                self.creator.creator.creator.creator.toggleActivePage("news");
                self.removeUI();
            })
        
        d3.selectAll(".state-politician-img-name")
            .text("");  
    }
    
    
    // Congressional Map
    generateCongressionalMap(file_name){
        var self = this;
        var selected = d3.select("#"+self.selected_state_id);
        this.old_states_data = selected.data();
        
        self.removeUI();
        self.creator.map_file_name  = file_name;
        self.creator.appendToParentMap(self.selected_state_id);
    }
    
    // Pulls senate geo filename and calls generate function
    stateSenateListener(){
        var self = this;
        var file_name = "map_data/congressional_borders/" + self.creator.creator.selected_state_id + "/state_senate/topo_simple.json";
        if(self.selected_role != "State Senator")
        {
            self.selected_role = "State Senator";
            self.generateCongressionalMap(file_name);
        }
        // self.applyExitListener();   
    }
    
    // Pulls house geo filename and calls generate function
    stateHouseListener(){
        var self = this;
        var file_name = "map_data/congressional_borders/" + self.creator.creator.selected_state_id + "/state_house/topo_simple.json";
        if(self.selected_role != "State Representative")
        {
            self.selected_role = "State Representative";
            self.generateCongressionalMap(file_name);
        }
        // self.applyExitListener();
    }
  
    
     // Modifies the title label.
    addLabel(id){
        var self = this;
        
        d3.select(".congressional-label")
            .html( id.replace(/-/g, " ") );
    }
    
    
    // Generates HTML, for UI, and footer
    generateHTML(){
        var self = this;
        super.generateHTML();
        
        var html = "    <div class='congressional-ui congressional-label'>Text</div> \
                        <div class='congressional-ui state-politician-img-div'> \
                            <img src='' class='state-politician-img congressional-ui' alt=''/> \
                            <a href='' class='state-politician-img-name congressional-ui'></a> \
                        </div> \
                        <div class='congressional-ui congressional-button-container'> \
                            <a class='congressional-ui congressional-buttons' id='congressional-left-button' >State Senate</a> \
                            <a class='congressional-ui congressional-buttons' id='congressional-right-button' >State House</a> \
                        </div> \
                        <a class='congressional-exit-button congressional-ui'>Back</a>";
        
        $(".ui-body").addClass("congressional-ui");
        $(".ui-body").append(html);
        
        // Activate Highlighting
        (self.selected_role == "State Senator") ? $("#congressional-left-button").addClass("congressional-buttons-active") : $("#congressional-right-button").addClass("congressional-buttons-active");
        
        self.addLabel(self.selected_state_id)
        
        self.footer.generateHTML();
        self.retrievePoliticianImage(self.selected_state_id);
        $(".congressional-ui").css("z-index", 1);
        
        d3.selectAll(".congressional-ui")
            .style("opacity", 1);
    }
    
    
    // Add listeners to the left/right options, and exit option
    addListeners(){
        var self = this;
        
        d3.select("#congressional-left-button")
                .on("click", function(){
                    self.stateSenateListener();
                    // d3.selectAll(".congressional-buttons").classed("congressional-buttons-active", false);
                    // d3.select("#"+this.id).classed("congressional-buttons-active", true);
                });
                       
            
        d3.select("#congressional-right-button")
            .on("click", function(){
                self.stateHouseListener();
                // d3.selectAll(".congressional-buttons").classed("congressional-buttons-active", false);
                // d3.select("#"+this.id).classed("congressional-buttons-active", true);
            });
                
                
        d3.select(".congressional-exit-button")
            .on("click", function(){
                self.selected_role = "State Senator";   //reset role
                self.removeUI();
                self.creator.zoomOut();
                self.creator.removeMapPaths();
                
                self.creator.creator.creator.generateMapPaths("map_data/new_simpler_us_topo.json"); //us_map.generateMapPaths
            });
         
        
        self.footer.addListeners();
    }
    
    
    applyUI(id){
        var self = this;
        self.selected_state_id = id;
        self.generateHTML();    
        self.addListeners();
    }
    
    
    constructor(ui_class_name, creator, attr=null){
       super(ui_class_name, creator,attr);
       this.footer = new ToggleFooter(this);
       this.selected_role = "State Senator";
    }
}


// var cong_ui = new CongressionalUI("congressional-ui");



