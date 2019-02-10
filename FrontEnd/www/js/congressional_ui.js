

class CongressionalUI extends StateUI {
    
    // Cause UI fadeout
    // opaqueUI(){
        // d3.selectAll(".congressional-ui")
            // .transition()
            // .style("opacity", 0);
    // }
    
    // removeUI(){
        // var self = this;
        // d3.selectAll(".congressional-ui")
            // .transition().remove()
            // .style("opacity", 0);
        // self.ui_generated = false;
    // }
    
    generateList(){
        var self = this;
        var path_ids = congr_map.path_ids;
        d3.select("div.vertical-menu").selectAll("a").remove();
        d3.select("div.vertical-menu").selectAll("a")
            .data(path_ids)
            .enter().append("a")
            .html(function(d, i){
                return d;
            })
            .attr("id", function(d, i){return d;})
            .on("click", function(id, i){
                var data = congr_map.selectPathByID(id).data()[0];
                congr_map.boxZoom(congr_map.path.bounds(data), congr_map.path.centroid(data), 20);
                congr_map.applyStateSelection(id);
                self.applyUI(id);
            });
    } 
     
    generateHTML(){
        var self = this;
        var path_ids = congr_map.path_ids;
        var html = "<div class='container congressional-ui'>\
                            <div class='congressional-ui congressional-label'>Text</div>\
                            <div class='cart-drawer cart-drawer-bottom congressional-ui'>\
                                <div class='close-btn congressional-ui'>☰</div>\
                                <div class='vertical-menu congressional-ui'></div> \
                            </div> \
                    </div>";
        
        $("#map-holder").append(html);
        
        self.generateList();
        
        
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
    
    
    constructor(ui_class_name){
       super(ui_class_name);
    }
}


var cong_ui = new CongressionalUI("congressional-ui");



