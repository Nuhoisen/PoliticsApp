

class CongressionalUI extends ImageMapUI{//extends StateUI {
         
    // Gets binded to the politicians profile
    // Swaps view over to profile page
     imageListener(profile){
        var self = this;
        // var img_url = this.src;
        self.creator.creator.creator.creator.profile_page.loadPoliticianInfo(profile);
        self.creator.creator.creator.creator.toggleActivePage("news");
        
    }
     
    // Load the politician's image
    loadPoliticianImages(profile){
        var self = this;
        profile = JSON.parse(profile);
        
        // When they click the profile picture 
        d3.selectAll(".state-politician-img")
            .attr("src", profile[0]["ImageURL"])
            .on("click", self.imageListener.bind(self, profile[0]));
            
        d3.selectAll(".state-politician-img-name")
            .text(profile[0]["Name"]);
            
            
    }
    
    
    // Congressional Map
    generateCongressionalMap(file_name){
        var self = this;
        var selected = d3.select("#"+self.selected_state_id);
        // this.old_states_data = selected.data();
        
        self.removeUI();
        self.creator.map_file_name = file_name;
        self.creator.appendToParentMap(self.selected_state_id);
    }
    
    usRepresentativeListener(){
        var self = this;

        var file_name = node_url + "/request_us_house/" + self.creator.creator.selected_state_id ;
        if(self.selected_role != "US Representative")
        {
            self.selected_role = "US Representative";
            self.creator.overrideClassFunctions(self.selected_role);
            self.generateCongressionalMap(file_name);
        }
    }
    
    // Pulls senate geo filename and calls generate function
    stateSenateListener(){
        var self = this;

        var file_name = node_url + "/request_state_senate/" + self.creator.creator.selected_state_id;
        if(self.selected_role != "State Senator")
        {
            self.selected_role = "State Senator";
            self.creator.overrideClassFunctions(self.selected_role);
            self.generateCongressionalMap(file_name);
        }
    }
    
    
    // Pulls house geo filename and calls generate function
    stateHouseListener(){
        var self = this;
        var file_name = node_url + "/request_state_house/" + self.creator.creator.selected_state_id;
        if(self.selected_role != "State Representative")
        {
            self.selected_role = "State Representative";
            self.creator.overrideClassFunctions(self.selected_role);
            self.generateCongressionalMap(file_name);
        }
    }
  
 
    // Override!
    setLocationInfo(id){
        var self = this;
        self.setDistrictInfo(id);
    }
	
     // Modifies the title label.
    addLabel(id=this.selected_district){
        var self = this;
        self.setDistrictInfo(id);
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
                            <div  class='state-politician-img-name congressional-ui'></div> \
                        </div> \
                        <div class='congressional-ui congressional-button-container'> \
                            <a class='congressional-ui congressional-buttons' id='congressional-left-button' >US Representatives</a> \
                            <a class='congressional-ui congressional-buttons' id='congressional-center-button' >State Senate</a> \
                            <a class='congressional-ui congressional-buttons' id='congressional-right-button' >State House</a> \
                        </div> \
                        <a class='congressional-exit-button congressional-ui'>Back</a>";
        
        // $(".us-map").addClass("congressional-ui");
        $(".map-profile").append(html);
        // $(".ui-body").addClass("congressional-ui");
        // $(".ui-body").append(html);
        
        // Activate Highlighting
        switch(self.selected_role){
            case "US Representative":
                $("#congressional-left-button").addClass("congressional-buttons-active"); break;
            case "State Senator":
                $("#congressional-center-button").addClass("congressional-buttons-active"); break;
            case "State Representative":
                $("#congressional-right-button").addClass("congressional-buttons-active"); break;     
            default:
                $("#congressional-left-button").addClass("congressional-buttons-active"); break;   
        }
        // (self.selected_role == "State Senator") ?  : $("#congressional-right-button").addClass("congressional-buttons-active");
        
        self.addLabel(self.selected_state_id)
        
        self.footer.generateHTML();
        self.retrievePoliticianImages(self.selected_state_id);
        $(".congressional-ui").css("z-index", 1);
        
        d3.selectAll(".congressional-ui")
            .style("opacity", 1);
    }
    
    
  
    
    // Add listeners to the left/right options, and exit option
    addListeners(){
        var self = this;
        
        d3.select("#congressional-left-button")
                .on("click", function(){
                    self.usRepresentativeListener();
                });
        
        d3.select("#congressional-center-button")
                .on("click", function(){
                    self.stateSenateListener();
                });
                       
            
        d3.select("#congressional-right-button")
            .on("click", function(){
                self.stateHouseListener();
            });
                
        // In congressional UI, apply hard-exit
        d3.select(".congressional-exit-button")
            .on("click", function(){
                self.selected_role = "State Senator";   //reset role
				
                // Calling zoomout, reapplies UI, so need to remove the UI once it finishes
                self.creator.zoomOut().on("end", function(){
                    self.removeUI();
					self.creator.accumulative_state_level_partisan_list = null;
                    self.creator.removeMapPaths();
                    self.creator.creator.creator.generateMapPaths(us_map_url); //us_map.generateMapPaths
                });
            });
         
        
        self.footer.addListeners();
    }
    
    
    // This takes all the information present
    // in the class structure and makes a UI out of it.
    // All settings must be set with mutators prior to call
    applyUI(){
        var self = this;
        self.generateHTML();    
        self.addListeners();
    }
    
    
    constructor(ui_class_name, creator, attr=null){
       super(ui_class_name, creator,attr);
       this.footer = new ToggleFooter("congressional-ui-footer", this);
       this.selected_role = "State Senator";
       this.selected_state_id = null;
       this.selected_district = null;
    }
}


// var cong_ui = new CongressionalUI("congressional-ui");



