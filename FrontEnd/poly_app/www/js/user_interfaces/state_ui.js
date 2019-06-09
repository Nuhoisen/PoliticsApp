

class StateUI extends ImageMapUI{
    
    // Gets binded to the politicians profile
    // Swaps view over to profile page
    imageListener(profile){
        var self = this;
        // var img_url = this.src;
        self.creator.creator.profile_page.loadPoliticianImage(profile);
        self.creator.creator.toggleActivePage("news");
        // self.removeUI();
    }
    
    // Load senator images and add click listeners
    loadPoliticianImages(profiles){
        profiles = JSON.parse(profiles)
        var self = this;
        
        d3.selectAll(".senator-img-left")
             .attr("src", profiles[0]["ImageURL"])
             .on("click", self.imageListener.bind(self, profiles[0]));//"profile_pics/alabama/us_senator/alabama_us_senate/Richard_Shelby.png")
                  
        d3.selectAll(".senator-img-left-name")
              .text(profiles[0]["Name"]);
            
        d3.selectAll(".senator-img-right")
            .attr("src", profiles[1]["ImageURL"])
            .on("click", self.imageListener.bind(self, profiles[1]));
           
        d3.selectAll(".senator-img-right-name")
             .text(profiles[1]["Name"]);
            
        // d3.selectAll(".governor-img")
            // .attr("src", "profile_pics/alabama/us_senator/alabama_us_senate/Richard_Shelby.png");
        
        // d3.selectAll(".governor-name-label")
            // .text("fill name");
    }
    
    // Congressional Map
    generateCongressionalMap(file_name){
        var self = this;
        var selected = d3.select("#"+self.selected_state_id);
        // this.old_states_data = selected.data();
        
        self.removeUI();
        self.state_congressional_map.map_file_name = file_name;
        self.state_congressional_map.overrideClassFunctions();
        self.state_congressional_map.appendToParentMap(self.selected_state_id);
    }
    
    // Appends HTML to existing HTML
    // Sets the ui_generated flag to true
    generateHTML(){
        var self = this;
        super.generateHTML();
        //<img src='profile_pics/alabama/us_senator/alabama_us_senate/Richard_Shelby.png'/> \
        
                    // <div class='state-ui governor-img-div'> \
                        // <div class='governor-label state-ui'>Governor</div> \
                        // <img src='' class='governor-img state-ui' alt=''/> \
                        // <div  class='governor-name-label state-ui'></div> \
                    // </div> 
                    
                    
        var html = "<div class='state-ui state-label'>Text</div> \
                    <div class='state-ui senate-img-div-left senate-img-div'> \
                        <img src='' alt='' class='senator-img-left senator-img state-ui'/> \
                         <div href='' class='senator-img-left-name  senator-img-name  state-ui'></div> \
                    </div> \
                    \
                    <div class='state-ui senate-img-div-right senate-img-div'> \
                        <img src='' class='senator-img-right senator-img state-ui' alt=''/>\
                         <div  class='senator-img-right-name senator-img-name state-ui'></div> \
                    </div> \
                    \
                    <div class='state-ui state-button-container'> \
                        <a  id='state-left-button' class='state-ui state-districts-button state-buttons'>Districts</a> \
                    </div> \
                    \
                    <a class='state-exit-button state-ui'>Back</a>" ;

        //MODIFICATIONS
        // $(".us-map").addClass("state-ui");
        $(".map-profile").append(html);
        // $(".ui-body").addClass("state-ui");
        // $(".ui-body").append(html);
        
        // Add State Name to the Label
        self.addLabel(self.selected_state_id);
        // Generate Footer
        self.footer.generateHTML();
        
        // self.loadImages();
        self.retrievePoliticianImages(self.selected_state_id);
        
        
       $(".state-ui").css("z-index", 1);
       d3.selectAll(".state-ui")
            .transition()
            .duration(1000)
            .style("opacity", 1);
    }
    

    
    
    setLocationInfo(id){
        var self = this;
        // self.selected_state_id = id.replace(/-/g, " "); //id;
        var district  = id + " US Senate";
        self.setStateInfo(id);
        self.setDistrictInfo(district);
    }
    
    // Modifies the Title Label
    addLabel(id=this.selected_state_id){
        var self = this;
        self.setLocationInfo(id);
        
        // self.selected_state_id = id.replace(/-/g, " "); //id;
        // self.selected_district = self.selected_state_id + " US Senate";
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
                // var file_name = "./map_data/congressional_borders/" + self.selected_state_id + "/state_senate/topo_quantize.json";
                var file_name = server_ip+ ":5000/request_state_senate/" + self.selected_state_id;
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
        self.selected_state_id = id.replace(/-/g, " ");
        self.selected_district = self.selected_state_id + " US Senate";
        self.generateHTML();
        
        self.addListeners(); 
    }
    
    
    constructor(ui_class_name, creator){
        super(ui_class_name, creator);
        
        this.state_congressional_map = new CongressionalMapTemplate("congressional-map", this, map_features_2);
        this.footer = new ToggleFooter("state-ui-footer", this);
        
        // this.old_states_data = null;
        this.selected_state_id = null;
        this.selected_district = null;
        this.selected_role = "US Senator";
        this.ui_class_name = ui_class_name;
    }
}

    