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
    
  
    generateHTML(){
        var self = this;
        var html = "<div class='global-ui-body'> \
                    </div>";
        $("body").append(html);
        
        self.footer.generateHTML();
        
        //THIS WILL DEPEND ON VIEW- CHANGE LATER
        this.us_state_map.generateMap();
        this.us_state_map.unfocus();
        this.profile_page.generateHTML();
        
    }
    
    
    constructor(ui_class_name, creator, attr=null){
        super(ui_class_name, creator);
        this.footer = new GlobalFooter(this);
        
        
        this.us_state_map = new USMap("us-map", this,map_features_1);
        this.profile_page = new ProfileUI("profile-page", this);
        
    }
}



var glob_ui = new GlobalUI("global-ui-body", this);
glob_ui.generateHTML();



