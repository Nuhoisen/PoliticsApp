

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
                        <div class='congressional-ui label'>Text</div> \
                        <div class='cart-drawer cart-drawer-bottom congressional-ui'> \
                            <div class='close-btn congressional-ui'>☰</div> \
                        </div> \
                    </div>";
        
        $("#map-holder").append(html);
     
        $(document).ready(function() {
            var $drawerRight = $('.cart-drawer-bottom');
            var $cart_list = $('.cart-btn, .close-btn');
            
            $cart_list.click(function() {
                $(this).toggleClass('active'); 
                $drawerRight.toggleClass('cart-drawer-open');
            });
        });
        
        self.ui_generated = true;
    } 
    
    applyUI(id, parent){
        var self = this;
        self.selected_state_id = id;
        if(self.ui_generated)
        {
            d3.select(".label")
                .html(id);
        }
        else{
            self.generateHTML();
        
            d3.select(".label")
                .html(id);
            
            $(".congressional-ui").css("z-index", 1);
        }
        
    }
    
    
    constructor(){
       super();
    }
}


var cong_ui = new CongressionalUI();
