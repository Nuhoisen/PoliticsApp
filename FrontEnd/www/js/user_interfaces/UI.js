
class UI {


    unfocus(){
        var self = this;
        d3.selectAll("."+self.class_name)
            // .style("zIndex", -1)
            .style("display","none");
    }

    refocus(){
        var self = this;
        d3.selectAll("."+self.class_name)
            // .style("zIndex", 1)
            .style("display", "block");
    }
    
    generateCongressionalMap(file_name){
        var self = this;
        var selected = d3.select("#"+self.selected_state_id);
        this.old_states_data = selected.data();
        
        self.removeUI();
        self.state_congressional_map.map_file_name  = file_name;
        self.state_congressional_map.appendToParentMap(self.selected_state_id);
    }
    loadImages(){}


    applyUI(id, parent){} 
    generateHTML(){}
    

    getName(){
        return "ui-body";
    }
    // Removes UI after fadeout
    // Resets the ui_generated flag
    removeUI(){
        var self = this;
        self.footer.removeFooter();
        d3.selectAll(".ui-body").remove();
        self.ui_generated = false;
    }

    generateHTML(){
         var html = "<div class='ui-body'>\
                    </div>";
    
        $("body").append(html);
        // $("#map-holder").append(html);
    }
    
    constructor(ui_class_name, creator, attr=null){
        this.class_name = ui_class_name;
        this.creator = creator;
        this.ui_generated = false;
        this.footer = NaN;
        this.attr = attr;
    }   
}


