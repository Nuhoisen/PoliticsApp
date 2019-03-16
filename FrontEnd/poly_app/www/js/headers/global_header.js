var prevScrollpos = window.pageYOffset;
class GlobalHeader{


    generateHTML(){
        var self = this;
        var header_html = " <div class='global-header' id='navbar'>  \
                                <div class='global-search-container'> \
                                    <input class='global-search' type='text' placeholder='Search..' name='search'> \
                                </div> \
                                <span class='header-search-span'>\
                                    <i class='fas fa-search header-search-icon'></i> \
                                </span>\
                            </div> ";

                                // <div class='global-search-container'> \
                                    // <input class='global-search' type='text' placeholder='Search..' name='search'> \
                                // </div> \
                                // <div class='global-search-submit-container'> \
                                    // <button class='global-search-submit' type='submit'><i class='fa fa-search'></i></button> \
                                // </div> \
        $(".global-ui-body").append(header_html);  //decide what to apply : ui-body

        
        self.addListeners();
    }

    addListeners(){
         d3.selectAll(".profile-page")
            .on("scroll", function(){
                console.log("scrolling");
            });
        
            // var currentScrollPos = window.pageYOffset;
            // if (prevScrollpos > currentScrollPos) {
                // document.getElementById("navbar").style.top = "0%";
            // } 
            // else {
                // document.getElementById("navbar").style.top = "10%";
            // }
            // prevScrollpos = currentScrollPos;
    }
    

    constructor(creator){
        
    }



}