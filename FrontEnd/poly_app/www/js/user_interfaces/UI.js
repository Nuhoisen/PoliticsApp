
class UI {
    unfocus(){
        var self = this;
        d3.selectAll("."+self.class_name +" *")
            .style("display","none");
        d3.selectAll("."+self.class_name)
            .style("display","none");
            
            
            

            
    }

    refocus(){
        var self = this;
        d3.selectAll("."+self.class_name +" *")
            .style("display", "");
            
        d3.selectAll("."+self.class_name)
            .style("display", "block");            
            
        
    }
    
    loadImages(){}
    applyUI(id){} 
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
        d3.selectAll("." + self.class_name).remove();
        // self.ui_generated = false;
    }

    generateHTML(){
         // var html = "<div class='ui-body'>\
                    // </div>";
    
        // $("body").append(html);
        // $("#map-holder").append(html);
    }
    
    constructor(ui_class_name, creator, attr=null){
        this.class_name = ui_class_name;
        this.creator = creator;
        // this.ui_generated = false;
        this.footer = null;
        this.attr = attr;
    }   
}


