
class ProfileUI {
    
    
    generateHTML(){
            var html = "<div class='container congressional-ui'>\
                            <div class='congressional-ui congressional-label'>Text</div>\
                            <div class='cart-drawer cart-drawer-bottom congressional-ui'>\
                                <div class='close-btn congressional-ui'>☰</div>\
                                <div class='vertical-menu'></div> \
                            </div> \
                        </div>";
        var path_ids = us_state_map.path_ids;
        
        $(".container")
            .append(html);
                    
        html = "";
        
        d3.select("div.vertical-menu").selectAll("a")
            .data(path_ids)
            .enter().append("a")
            .html(function(d, i){
                
                return d;
            })
            .attr("id", function(d, i){return d;})
            .on("click", function(id, i){
                var data = us_state_map.selectPathByID(id).data()[0];
                us_state_map.boxZoom(us_state_map.path.bounds(data), us_state_map.path.centroid(data), 20)
                console.log(data)
            });
            
        // for (var i = 0 ; i < path_ids.length; i++){
            // html += "<a>" + path_ids[i] + "</a>"
        // }
        
        // $(".vertical-menu")
            // .append(html);
            
            
        // d3.select("div.vertical-menu").selectAll("a")
            // .on("click", function(d, i){
                // console.log(d);
                // console.log(i);
            // });
    }
}


var profile_ui = new ProfileUI();
profile_ui.generateHTML();