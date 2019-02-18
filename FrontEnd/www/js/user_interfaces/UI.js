
class UI {

    applyUI(id, parent){} 
    generateHTML(){}
    
    // // Cause UI fadeout
    // opaqueUI(){
        // var self = this;
        // d3.selectAll("." + self.ui_class_name)
            // .transition()
            // .style("opacity", 0);
    // }
    
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
    
    constructor(ui_class_name, creator){
        this.class_name = ui_class_name;
        this.creator = creator;
        this.ui_generated = false;
        this.footer = NaN;
    }   
}


