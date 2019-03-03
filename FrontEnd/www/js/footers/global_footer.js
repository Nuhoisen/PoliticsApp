
class GlobalFooter extends Footer {
    
    
    
    addListeners(){
        var self = this;
        d3.selectAll(".footer-item")
            .on("click", function(d, i){
                var all_fters = d3.selectAll(".footer-item");
                all_fters.classed("selected", false);
                d3.select("#"+this.id).classed("selected", true);
                self.creator.toggleActivePage(this.id);
                
            });
    }
    
    generateHTML(){
        var self = this;
        super.generateHTML();
        

        var html = "<div class='global-footer' id='footerHolder'> \
                        <span class='footer-item' id='news'> \
                            <i class='fas fa-newspaper'></i> \
                        </span> \
                        <span class='footer-item selected' id='map'> \
                            <i class='fas fa-globe '></i> \
                        </span> \
                        <span class='footer-item' id='search'> \
                            <i class='fas fa-search'></i> \
                        </span> \
                    </div>";
        
        $(".global-ui-body").append(html);  //decide what to apply : ui-body
        self.addListeners();
    } 
    
    
    constructor(creator){
        super(creator);
    }
    
}