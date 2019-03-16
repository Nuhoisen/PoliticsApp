// Dynamically modifies CSS with updated info
// Necessary for rendering slider profile pics
var addRule = (function (style) {
    var sheet = document.head.appendChild(style).sheet;
    return function (selector, css) {
        var propText = typeof css === "string" ? css : Object.keys(css).map(function (p) {
            return p + ":" + (p === "content" ? "'" + css[p] + "'" : css[p]);
        }).join(";");
        try{
            sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);            
        }
        catch(err){
            console.log(err);
        }
    };
})(document.createElement("style"));
    
    
class ProfileUI extends UI{
    
 
    // Load political image
    loadPoliticianImage(url){
        d3.selectAll(".profile-picture")
            .attr("src", url);
 
        addRule(".topic-slider::-moz-range-thumb", 
        {
            "height": "25px",
            "border-radius": "50%", 
            "width": "25px", 
            "background": "url('" + url + "')",
            "background-size": "100%",
            "cursor": "pointer"
        });
    }
    
    // Stances click listener
    stancesClick(){
        var self = this;
        
        var coll = document.getElementsByClassName("profile-stances-collapsible")[0];
        var fold = document.getElementsByClassName("profile-stances-container")[0];
        
        coll.classList.toggle("stances-active");
        fold.style.display = ( fold.style.display == "block" ) ? "none" : "block";
    }
   
  
   
   addListeners(){
        d3.select(".profile-stances-collapsible-all")
            .on("click", function(){
                 
                    var coll = d3.select(".profile-stances-collapsible");
                    coll.classed("active", !coll.classed("active"));
                    
                    if (coll.classed("active")){
                        d3.selectAll(".topic-body")
                            .style("display", "block");
                        
                        d3.select(".profile-stances-container")
                            .style("display", "block");
                        d3.select(this).html( "Collapse All" );
                    }
                    else{
                        d3.selectAll(".topic-body")
                            .style("display", "none");
                            
                        d3.selectAll(".topic-source-list")
                            .style("display", "none");
                            
                        d3.select(".profile-stances-container")
                            .style("display", "none");
                        d3.select(this).html( "Expand All" );
                    }
            });
            
        d3.select(".profile-stances-collapsible")
            .on("click", function(){
                    var coll = d3.select(".profile-stances-collapsible");
                    coll.classed("active", !coll.classed("active"));
                    
                    if (coll.classed("active")){
                        d3.select(".profile-stances-container")
                            .style("display", "block");
                        d3.select(".profile-stances-collapsible-all").html("Collapse All");
                    }
                    else{
                        d3.select(".profile-stances-container")
                            .style("display", "none");
                        d3.select(".profile-stances-collapsible-all").html("Expand All");
                    }
                });
                
         d3.selectAll(".topic-collapsible")
            .on("click", function(){
                 var som = d3.select(this.nextElementSibling);
                 ( som.style("display") == "block" ) ? som.style("display", "none") : som.style("display", "block");        
            });
            
        d3.selectAll(".topic-stance-sources-collapsible")
            .on("click", function(){
                var src_lst = d3.select(this.nextElementSibling);
                ( src_lst.style("display") == "block" ) ? src_lst.style("display", "none") : src_lst.style("display", "block");
            });
            
        d3.selectAll(".topic-perceived-stance")
            .on("click", function(){
                var sel_top = this.classList[1];
                d3.select("." + sel_top + "-slide-container")
                    .transition()
                    .duration(500)
                    .style("opacity", 0)
                    .on("end", function(){
                        // Enable the slider
                        d3.select("." + sel_top + "-slider")
                            .property("disabled", false);
                        
                        d3.select(this) 
                            .transition()
                            .duration(250)
                            .style("opacity", 1);
                        
                    })
                var self = d3.select(this);
                console.log(self.attr("class"));
            })
       
   }
   
    // Topic containers
    addTopicContainers(topics){
        var self = this;
        for (var i = 0; i < topics.length; i++){ //
            var slider_html = " <div class='topic-container'> \
                                    <div class='topic-collapsible replace-collapsible'>  \
                                        replace \
                                    </div> \
                                    <div class='topic-body'> \
                                        <div class='topic-left replace replace-left'> \
                                            Here \
                                        </div> \
                                        <div class='topic-right replace replace-right'> \
                                            There \
                                        </div> \
                                        <div class='topic-slide-container replace replace-slide-container'> \
                                            <input type='range' min='1' max='100' value='50' class='topic-slider replace replace-slider'> \
                                        </div> \
                                        <div class='topic-stance-source-container replace replace-stance-source-container'> \
                                                <div class='topic-stance-sources-collapsible replace replace-stance-sources-collapsible'>\
                                                    Sources \
                                                </div> \
                                                <ul class='topic-source-list replace replace-source-list'> \
                                                    <li> \
                                                        Source \
                                                    </li> \
                                                    <li> \
                                                        Source \
                                                    </li> \
                                                </ul> \
                                        </div> \
                                        <div class='topic-perceived-stance replace replace-perceived-stance'> \
                                            Perceived Stance \
                                        </div> \
                                    </div>  \
                                </div>";
            
            
            
            
           
            
            slider_html = slider_html.replace(/replace/g, topics[i]['Topic']);
            $(".profile-stances-container").append(slider_html);
            $("."+topics[i]['Topic']+"-left").html(topics[i]['Left']);
            $("."+topics[i]['Topic']+"-right").html(topics[i]['Right']);
            
        }
        
        // disable the sliders
        d3.selectAll(".topic-slider")
            .property("disabled", true);
            
        d3.select(".profile-stances-collapsible")
            .on("click", function(){
                self.stancesClick();
            });
    }
    
    generateHTML(){
        var self = this;
        // super.generateHTML();
        var html = "    <div class='profile-page'> \
                            <div class='profile-header'> \
                                <div class='profile-picture-background'> \
                                </div> \
                                <img class='profile-picture' src='./css/user_interfaces/profile/temp/alabama_us_senate/Richard_Shelby.png'/> \
                                <div class='profile-name'> \
                                    Bob Billard \
                                </div> \
                            </div> \
                            <div class='profile-body'>  \
                                <div class='profile-stances-collapsible-container'> \
                                    <div class='profile-stances-collapsible'> \
                                        Stances \
                                    </div> \
                                    <div class='profile-stances-collapsible-all'> \
                                        Expand All \
                                    </div> \
                                </div> \
                                <div class='profile-stances-container'> \
                                </div> \
                            </div> \
                        </div> ";
        
        
        
          
        $("."+this.creator.class_name).append(html);
        
        self.addTopicContainers(self.topics_dict);
        self.addListeners();
        
    }
    

    constructor(ui_class_name, creator, attr=null){
        super(ui_class_name, creator, attr);
        
        this.topics_list = ["Abortion", "Guns", "Economics", "Education", "Environment", "Health Care"]
        
        this.topics_dict = [
                            {   "Topic": "Abortion",
                                "Left": "Pro-Choice",
                                "Right": "Pro-Life"
                            },
                            
                            {   "Topic": "Guns",
                                "Left": "Ban",
                                "Right": "No Restrictions"
                            },
                            
                            {   "Topic": "Economics",
                                "Left": "Government Controlled",
                                "Right": "Market Controlled"
                            },
                            
                            {   "Topic": "Education",
                                "Left": "Public",
                                "Right": "Private"
                            },
                            
                            {   "Topic": "Environment",
                                "Left": "Regulations",
                                "Right": "No Regulations"
                            },  
                            {   "Topic": "Health-Care",
                                "Left": "Government Backed",
                                "Right": "Market Based"
                            }
                        ];
    }
    
    
    

}


