

class StateUI extends UI{
    
     retrieveProfileImages(id){
         var self = this;
         self.retrieveSenatorImages(id);
     }
     // Load image of senators and governor. Update they're banners
     retrieveSenatorImages(id){
         var self = this;
         var args= "state=" + id + "&role=US Senator";
         get_senator_prof_imgs(args, self.loadSenatorImages);
     }
     
    loadSenatorImages(urls){
        var urls = urls.split(',');
        
        console.log(urls)
        
        
        d3.selectAll(".senator-img-left")
             .attr("src", urls[0]);//"profile_pics/alabama/us_senator/alabama_us_senate/Richard_Shelby.png")
                  
        
        d3.selectAll(".senator-img-left-name")
              .text("Hello");
            
        
        d3.selectAll(".senator-img-right")
            .attr("src", urls[1])
           
        d3.selectAll(".senator-img-right-name")
             .text("shetland rapist");
            
        d3.selectAll(".governor-img")
            .attr("src", "profile_pics/alabama/us_senator/alabama_us_senate/Richard_Shelby.png")
        
        d3.selectAll(".governor-name-label")
            .text("shetland rapist");  
    }
    
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
        //<img src='profile_pics/alabama/us_senator/alabama_us_senate/Richard_Shelby.png'/> \
        
        var html = "<div class='state-ui state-label'>Text</div> \
                    \
                    <div class='state-ui governor-img-div'> \
                        <a href='' class='governor-label state-ui'>Governor</a> \
                        <img src='' class='governor-img state-ui' alt=''/> \
                        <a href='' class='governor-name-label state-ui'></a> \
                    </div> \
                    \
                    <div class='state-ui senate-img-div-left senate-img-div'> \
                        <img src='' alt='' class='senator-img-left senator-img state-ui'/> \
                         <a href='' class='senator-img-left-name  senator-img-name  state-ui'></a> \
                    </div> \
                    \
                    <div class='state-ui senate-img-div-right senate-img-div'> \
                        <img src='' class='senator-img-right senator-img state-ui' alt=''/>\
                         <a href='' class='senator-img-right-name senator-img-name state-ui'></a> \
                    </div> \
                    \
                    <div class='state-button-container'> \
                        <a  id='state-left-button' class='state-ui state-districts-button state-buttons'>Districts</a> \
                    </div> \
                    \
                    <a class='state-exit-button state-ui'>Back</a>" ;

        $(".ui-body").addClass("state-ui");
        
        $(".ui-body").append(html);
        
        // Add State Name to the Label
        self.addLabel(self.selected_state_id);
        // Generate Footer
        self.footer.generateHTML();
        
        // self.loadImages();
        self.retrieveSenatorImages(self.selected_state_id);
        
        
       $(".state-ui").css("z-index", 1);
       d3.selectAll(".state-ui")
            .transition()
            .duration(1000)
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

    