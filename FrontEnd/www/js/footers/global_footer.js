
class GlobalFooter extends Footer {
    generateHTML(){
        var self = this;
        super.generateHTML();
        

        var html = "<div class='global-footer' id='footerHolder'> \
                        <span class='footer-item'> \
                            <i class='fas fa-newspaper'></i> \
                        </span> \
                        <span class='footer-item'> \
                            <i class='fas fa-globe '></i> \
                        </span> \
                        <span class='footer-item'> \
                            <i class='fas fa-search'></i> \
                        </span> \
                    </div>";
        
        $(".global-ui-body").append(html);  //decide what to apply : ui-body
        
    } 
    
    
    constructor(creator){
        super(creator);
    }
    
}