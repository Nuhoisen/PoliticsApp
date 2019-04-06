

class Footer{
 

    generateHTML(){
        var self = this;
        var html = "<div class='footer-body' '" + self.class_name + "'></div>";
        
        $(".global-ui-body").append(html);  //decide what to apply : ui-body
        // $(".ui-body").append(html);  //decide what to apply : ui-body
        
        self.ui_generated = true;
    } 
 
    getName(){
        return "footer-body";
    }
 
    addListeners(){
        
    }
 
    removeFooter(){
        d3.selectAll(".footer-body").remove();
    }
 
    constructor(footer_class_name, creator, attr=null){
        this.creator = creator;
        this.class_name = footer_class_name;
        this.attr = attr;
    }
}