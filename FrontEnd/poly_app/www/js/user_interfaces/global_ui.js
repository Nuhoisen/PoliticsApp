var map_features_1 = {
    "file_name" : "map_data/new_simpler_us_topo.json",
    "border_class_name" :"state-borders",
    "feature_access_hook": states_function
}


var map_features_2 = {
    "file_name" : "map_data/congressional_borders/Oregon/state_house/topo_simple.json", //
    "border_class_name" :"state-senate-borders",
    "feature_access_hook": state_senate_map_function
}

class GlobalUI extends UI{
    
    
    
    
    toggleActivePage(id){
        var self = this;
        self.selected_page.unfocus();
        
        switch(id){
            case "news":
                self.selected_page = self.profile_page;
            break;
            
            case "map":
                self.selected_page = self.us_state_map;
            break;
        }
        
        self.selected_page.refocus();
        self.footer.toggleFooter(id);
    }

  
    generateHTML(){
        var self = this;
        var html = "<div class='global-ui-body'> \
                    </div>";
        $("body").append(html);
        
        self.footer.generateHTML();
        //THIS WILL DEPEND ON VIEW- CHANGE LATER
        self.us_state_map.generateMap();
        self.profile_page.generateHTML();
        self.profile_page.unfocus();
        self.header.generateHTML();
        
    }
    
    
    constructor(ui_class_name, creator, attr=null){
        super(ui_class_name, creator);
        this.footer = new GlobalFooter(this);
        this.header = new GlobalHeader(this);
        
        this.us_state_map = new USMap("us-map", this, map_features_1);
        this.profile_page = new ProfileUI("profile-page", this);
        
        
        this.selected_page = this.us_state_map;
        
    }
}



var glob_ui = new GlobalUI("global-ui-body", this);
glob_ui.generateHTML();



