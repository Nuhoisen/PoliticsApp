class ProfileUI extends UI{
    
    
    stancesClick(){
        var self = this;
        // var collasp = d3.select(".profile-stances-collapsible");
        // var fold = d3.select(".profile-stances-container");
        
        var coll = document.getElementsByClassName("profile-stances-collapsible")[0];
        var fold = document.getElementsByClassName("profile-stances-container")[0];
        
        coll.classList.toggle("active");
        fold.style.display = ( fold.style.display == "block" ) ? "none" : "block";
        
        // if(collasp.classed("active")){
            // collasp.classed("active", false);
            // fold.style("display", "block");
        // }
        // else{
            // collasp.classed("active", true);
            // fold.style("display", "none");
        // }
                
        
    }
   
    
    addTopicContainers(topics){
        var self = this;
        for (var i = 0; i < 1; i++){ //topics.length
            var slider_html = "<div class='topic-container'>\
                                    <div class='topic-left replace-left'> \
                                    </div> \
                                    <div class='topic-right replace-right'> \
                                    </div> \
                                    <div class='topic-slide-container replace-slide-container'> \
                                        <input type='range' min='1' max='100' value='50' class='topic-slider replace-slider'> \
                                    </div> \
                                    <div class='profile-stance-topic-title replace-stance-topic-title'> \
                                    </div> \
                                </div>";
            
            slider_html = slider_html.replace(/replace/g, topics[i]);
            console.log(slider_html);
            $(".profile-stances-container").append(slider_html);
        }
        
        d3.select(".profile-stances-collapsible")
            .on("click", function(){
                self.stancesClick();
            });
    }
    
    generateHTML(){
        var self = this;
        super.generateHTML();
        var html = "<div class='profile-header'>\
                        <div class='profile-picture-background'></div>\
                        <img class='profile-picture' src='./temp/alabama_us_senate/Richard_Shelby.png'/> \
                        <div class='profile-name'>\
                            Shetland Rapist\
                        </div>\
                    </div>\
                    <div class='profile-body'> \
                        <div class='profile-stances-collapsible'> \
                            Stances \
                        </div> \
                        <div class='profile-stances-container'> \
                        </div> \
                    </div>";
          
        $(".ui-body").append(html);
        
        self.addTopicContainers(self.topics_list);
        
                    
     
        
        
    }
    

    constructor(ui_class_name, creator){
        super(ui_class_name, creator);
        
        this.topics_list = ["Abortion", "Guns", "Economics", "Education", "Environment", "Health Care"]
    }
    
    
    

}


// var ui = new UI("ui", this);
var prof_ui  = new ProfileUI("test_profile", this);
prof_ui.generateHTML();