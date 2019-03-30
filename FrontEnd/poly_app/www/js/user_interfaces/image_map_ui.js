class ImageMapUI extends UI {
     
     
    
    // Make a client call to the server, request the 
    // image of the politician by state & role
    retrievePoliticianImages(id){
        var self = this;
        id = id.replace(/-/g, " ");
        var args = "state=" + self.selected_state_id + "&role=" + self.selected_role + "&district=" + self.selected_district;
        get_state_politician_profile(args, self.loadPoliticianImages.bind(self));
    }
     
    setStateInfo(id){
        var self = this;
        self.selected_state_id = id.replace(/-/g, " "); 
    }
    // This sets the district. It does not change the state
    setDistrictInfo(id){
        var self = this;
        self.selected_district = id.replace(/-/g, " "); 
    }
     
    constructor(ui_class_name, creator, attr=null){
       super(ui_class_name, creator,attr);
       this.selected_state_id = null;
       this.selected_role = null;
       this.selected_district = null;
       
    }
}