var map_features_1 = {
    // "file_name" : "map_data/new_simpler_us_topo.json",
    "file_name" : us_map_url,
    "border_class_name" :"state-borders",
    "feature_access_hook": statesFunction
}

// var map_features_3 = {
    // "file_name" : "map_data/2017_us_cd115_quantize.json",
    // "border_class_name" :"state-borders",
    // "feature_access_hook": us_house_map_function
// }


var map_features_2 = {
    "file_name" : "map_data/congressional_borders/Oregon/state_house/topo_simple.json", //
    "border_class_name" :"state-senate-borders",
    "feature_access_hook": stateSenateMapFunction
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

    // This function overrides UI's
    // it appends HTML to the Body rather than the container?
    // Possibly change so that it applies it to the super's container
    generateHTML(){
        var self = this;
        var html = "<div class='"+self.class_name+ "'> \
                    </div>";
        $("body").append(html);
        
        //THIS WILL DEPEND ON VIEW- CHANGE LATER
        self.footer.generateHTML();
        self.us_state_map.generateMap();
        self.profile_page.generateHTML();
        self.profile_page.unfocus();
        self.header.generateHTML();
        
    }
    
    
    constructor(ui_class_name, creator, attr=null){
        super(ui_class_name, creator);
        this.footer = new GlobalFooter("global-ui-footer", this);
        this.header = new GlobalHeader("global-ui-header", this);
        this.us_state_map = new USMap("map-profile", this, map_features_1);
        this.profile_page = new ProfileUI("profile-page", this);
        this.selected_page = this.us_state_map;
        
    }
}



var glob_ui = new GlobalUI("global-ui-body", this);
glob_ui.generateHTML();



