

class CongressionalUI extends StateUI {
    
    // Cause UI fadeout
    opaqueUI(){
        d3.selectAll(".congressional-ui")
            .transition()
            .style("opacity", 0);
    }
    
    removeUI(){
        var self = this;
        d3.selectAll(".congressional-ui")
            .transition().remove()
            .style("opacity", 0);
        self.ui_generated = false;
    }
    
     
    generateHTML(){
        var self = this;
        var html = "<div class='container congressional-ui'> \
                        <div class='congressional-ui congressional-label'>Text</div> \
                        <div class='cart-drawer cart-drawer-bottom congressional-ui'> \
                            <div class='close-btn congressional-ui'>☰</div> \
                        </div> \
                    </div>";
        
        $("#map-holder").append(html);
     
        
        
        self.ui_generated = true;
    } 
    
    applyUI(id, parent){
        var self = this;
        self.selected_state_id = id;
        if(self.ui_generated)
        {
            d3.select(".congressional-label")
                .html(id);
            d3.selectAll(".congressional-ui")
                .style("opacity", 1);
        }
        else{
            self.generateHTML();
        
            d3.select(".congressional-label")
                .html(id);
            
            
            d3.select(".close-btn")
                .on("click", function(){
                    var drawer = d3.select(".cart-drawer");
                    // drawer.classed("cart-drawer-active", !drawer.classed("cart-drawer-active"));
                    if(!drawer.classed("cart-drawer-active")){
                        drawer
                            .transition()
                            .style("height", "60%")
                            .on('end', function(){
                                d3.select(".close-btn")
                                    .style("height", "10%");
                            });
                        drawer.classed("cart-drawer-active", true);
                    }
                    else{
                        drawer
                            .transition()
                            .style("height", "10%")
                            .on('end', function(){
                                d3.select(".close-btn")
                                    .style("height", "100%");
                            });
                        drawer.classed("cart-drawer-active", false);
                    }
                    
                });
            
           
            $(".congressional-ui").css("z-index", 1);
        }
        
    }
    
    
    constructor(){
       super();
    }
}


var cong_ui = new CongressionalUI();



d3.select(".close-btn")
                .on("click", function(){
                    profile_ui.generateHTML();
                    var drawer = d3.select(".cart-drawer");
                    // drawer.classed("cart-drawer-active", !drawer.classed("cart-drawer-active"));
                    if(!drawer.classed("cart-drawer-active")){
                        drawer
                            .transition()
                            .style("height", "60%")
                            .on('end', function(){
                                d3.select(".close-btn")
                                    .style("height", "10%");
                            });
                        drawer.classed("cart-drawer-active", true);
                    }
                    else{
                        drawer
                            .transition()
                            .style("height", "10%")
                            .on('end', function(){
                                d3.select(".close-btn")
                                    .style("height", "100%");
                            });
                        drawer.classed("cart-drawer-active", false);
                    }
                    
                });