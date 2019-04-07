
class GlobalFooter extends Footer {
    
    
    // Highlights the newly selected tab
    // Called from Global UI
    
    toggleFooter(id){
         var all_fters = d3.selectAll(".footer-item");
         all_fters.classed("selected", false);
         d3.select("#"+id).classed("selected", true);
    }
    
    
    
    addListeners(){
        var self = this;
        d3.selectAll(".footer-item")
            .on("click", function(d, i){
                
                // var all_fters = d3.selectAll(".footer-item");
                // all_fters.classed("selected", false);
                // d3.select("#"+this.id).classed("selected", true);
                self.creator.toggleActivePage(this.id);
                
            });
    }
    
    // Calls the super constructor which implements a footer under the global-ui-body
    // This creates customer global footer html and appends this to the body too.
    generateHTML(){
        var self = this;
        var html = "<div class='global-footer " + self.class_name + "' id='footerHolder'> \
                        <span class='footer-item' id='news'> \
                            <img class='footer-profile-img' src='img/cutouts/profile.png' alt=/> \
                        </span> \
                        <span class='footer-item selected' id='map'> \
                            <img class='footer-globe-img' src='img/cutouts/globe_2.png' alt=/> \
                        </span> \
                    </div>";
                    
                    // <span class='footer-item' id='search'> \
                            // <img class='footer-search-img' src='img/cutouts/search.png' alt=/> \
                        // </span> \

        // var html = "<div class='global-footer' id='footerHolder'> \
                        // <span class='footer-item' id='news'> \
                            // <i class='fas fa-newspaper'></i> \
                        // </span> \
                        // <span class='footer-item selected' id='map'> \
                            // <i class='fas fa-globe '></i> \
                        // </span> \
                        // <span class='footer-item' id='search'> \
                            // <i class='fas fa-search'></i> \
                        // </span> \
                    // </div>";
        
        $("."+self.creator.class_name).append(html);  //decide what to apply : ui-body
        self.addListeners();
    } 
    
    
    
    
    constructor(footer_class_name, creator, attr=null){
        super(footer_class_name, creator, attr);
        
    }
    
}