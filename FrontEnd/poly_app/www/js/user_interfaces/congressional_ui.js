

class CongressionalUI extends ImageMapUI{//extends StateUI {
    
    // Retrieve political images
     // retrieveProfileImages(id){
         // var self = this;
         // self.retrievePoliticianImages(id);
     // }
    
    
    // Make a client call to the server, request the 
    // image of the politician by state & role
     // retrievePoliticianImages(id){
         // var self = this;
         // id = id.replace(/-/g, " ");
         // var args = "state=" + self.creator.creator.selected_state_id + "&role=" + self.selected_role + "&district=" + id;
         // get_state_politician_profile(args, self.loadPoliticianImage.bind(self));
     // }
     
     
    // Gets binded to the politicians profile
    // Swaps view over to profile page
     imageListener(profile){
        var self = this;
        // var img_url = this.src;
        self.creator.creator.creator.creator.profile_page.loadPoliticianImage(profile);
        self.creator.creator.creator.creator.toggleActivePage("news");
        self.removeUI();
    }
     
    // Load the politician's image
    loadPoliticianImages(profile){
        profile = JSON.parse(profile);
        var self = this;
        
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
        this.old_states_data = selected.data();
        
        self.removeUI();
        self.creator.map_file_name  = file_name;
        self.creator.appendToParentMap(self.selected_state_id);
    }
    
    usRepresentativeListener(){
        var self = this;
        // var file_name = "map_data/us_house_borders/CA/us-house-ca.json";
        var file_name = "map_data/congressional_borders/" + self.creator.creator.selected_state_id + "/us_representatives/us-house.json";
        if(self.selected_role != "US Representative")
        {
            self.selected_role = "US Representative";
            self.generateCongressionalMap(file_name);
        }
    }
    
    // Pulls senate geo filename and calls generate function
    stateSenateListener(){
        var self = this;
        // var file_name = "map_data/us_house_borders/CA/us-house-ca.json";
        var file_name = "map_data/congressional_borders/" + self.creator.creator.selected_state_id + "/state_senate/topo_quantize.json";
        if(self.selected_role != "State Senator")
        {
            self.selected_role = "State Senator";
            self.generateCongressionalMap(file_name);
        }
    }
    
    
    // Pulls house geo filename and calls generate function
    stateHouseListener(){
        var self = this;
        var file_name = "map_data/congressional_borders/" + self.creator.creator.selected_state_id + "/state_house/topo_quantize.json";
        if(self.selected_role != "State Representative")
        {
            self.selected_role = "State Representative";
            self.generateCongressionalMap(file_name);
        }
    }
  
  
    // This sets the state. Does not change the district
    // setStateInfo(id){
        // var self = this;
        // self.selected_state_id = id.replace(/-/g, " "); 
    // }
    // // This sets the district. It does not change the state
    // setDistrictInfo(id){
        // var self = this;
        // self.selected_district = id.replace(/-/g, " "); 
    // }
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
        
        $(".ui-body").addClass("congressional-ui");
        $(".ui-body").append(html);
        
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
       this.footer = new ToggleFooter(this);
       this.selected_role = "State Senator";
       this.selected_state_id = null;
       this.selected_district = null;
    }
}


// var cong_ui = new CongressionalUI("congressional-ui");



