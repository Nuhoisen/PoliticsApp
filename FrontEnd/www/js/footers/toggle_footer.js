
class ToggleFooter extends Footer {


    generateList(){
        var self = this;
        var path_ids = self.creator.creator.path_ids;
        d3.select("div.vertical-menu").selectAll("a").remove();
        d3.select("div.vertical-menu").selectAll("a")
            .data(path_ids)
            .enter().append("a")
            .html(function(d, i){
                return d;
            })
            .attr("id", function(d, i){return d;})
            .on("click", function(id, i){
                var data = self.creator.creator.selectPathByID(id).data()[0];   //congress_map.selectPathsByID
                
                self.creator.creator.boxZoom(self.creator.creator.path.bounds(data), self.creator.creator.path.centroid(data), 20); //congress_map.bounds ...
                self.creator.creator.applyStateSelection(id); // congress_map.applyStateSelection
                self.creator.retrieveProfileImages(id);
                // self.creator.retrieveSenatorImages(id);
                self.creator.addLabel(id);   // congress_ui.applyUI
            });
    } 

    generateHTML(){
        var self = this;
        super.generateHTML();
        
        var html = "<div class='close-btn'>☰</div>\
                    <div class='vertical-menu'></div>"
        
        $("."+super.getName()).append(html);
        $("."+super.getName()).addClass("cart-drawer cart-drawer-bottom " + self.creator.class_name)
        
        self.generateList();
        
    }

    toggleOpen(drawer){
        drawer
            .transition()
            .style("height", "60%")
            .on('end', function(){
                d3.select(".close-btn")
                    .style("height", "10%");
            });
        drawer.classed("cart-drawer-active", true);
    }
    

    toggleClose(drawer){
        drawer
            .transition()
            .style("height", "10%")
            .on('end', function(){
                d3.select(".close-btn")
                    .style("height", "100%");
            });
        drawer.classed("cart-drawer-active", false);
    }
    
    addListeners(){
        self = this;
        // Add any existing listeners from parent class
        super.addListeners();
        
         d3.select(".close-btn")
                .on("click", function(){
                    var drawer = d3.select(".cart-drawer");
                    // drawer.classed("cart-drawer-active", !drawer.classed("cart-drawer-active"));
                    if(!drawer.classed("cart-drawer-active")){
                        self.toggleOpen(drawer);
                    }
                    else{
                        self.toggleClose(drawer);
                    }
                    
                });
    }

    constructor(creator){
        super(creator);
    }
    
}