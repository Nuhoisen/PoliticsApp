

class Footer{
 

    generateHTML(){
        var self = this;
        var html = "<div class='footer-body'></div>";
        
        $(".ui-body").append(html);  //decide what to apply : ui-body
        
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
 
    constructor(creator){
        this.creator = creator;
    }
}