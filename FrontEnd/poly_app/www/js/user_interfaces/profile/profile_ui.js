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
    
    unfocus(){
        super.unfocus();
        // Specialized behavior
        d3.selectAll(".profile-subject-collapsible-all")
            .html("Expand All");
    }
    
    loadRelatedArticles(response){
        var html_text = "";
        
        var json_response = JSON.parse(response);
        

         d3.selectAll(".profile-news-container")   
            .html("");

        for(var i = 0; i < json_response.length; i++)
        {
            d3.selectAll(".profile-news-container")   
                .append('h1')
                .html(json_response[i].title);
            
            
            d3.selectAll(".profile-news-container")
                .append("a")
                .attr("href", json_response[i].url)
                .append('img')
                .attr("src", json_response[i].top_img)
                .attr("width", "100%");
            
            d3.selectAll(".profile-news-container")
                .append("div")
                .html(json_response[i].news_company)
            
            d3.selectAll(".profile-news-container")
                .append("hr");
                
                
                // .on("click", function(){window.open(json_response[i].url)});
            
            // d3.selectAll(".profile-news-container")
                // .append('div')
                // .html(json_response[i].url)
                // .attr("class", "topic-container");
            
        }
        
        
       
            
            // .html(html_text);
            
            
            
    }
    
    requestRelatedArticles(name){
        var self = this;
        console.log(name);
        var last_name = name.split(" ")[1];
        var args = "keyword=" + name;
        
        get_politician_news_articles(args,self.loadRelatedArticles.bind(self));
    }
    
    // Load political image
    loadPoliticianImage(profile){
        var self = this;
        
        d3.selectAll(".profile-picture")
            .attr("src", profile['ImageURL']);
            
        d3.selectAll(".profile-name")
            .html(profile['Name']);
 
        d3.selectAll(".profile-position")
            .html(profile['District']);
 
        d3.selectAll(".profile-header-twitter-img-div")
            .attr("href", profile['Twitter']);
        
        d3.selectAll(".profile-header-facebook-img-div")
            .attr("href", profile['Facebook']);
        
        self.requestRelatedArticles(profile['Name']);
    
      
        var bio =  profile['Bio'];
        var modified_bio = "";
        bio = bio.split("<br/>");
        bio.forEach( function( sentence, index ) {
           modified_bio  = modified_bio + sentence + "<br/><br/>" 
        });
        // var bio_html = "<span id='lblBio'>BORN-<br/>December 16, 1949 <br/>    EDUCATION- <br/>B.S. St. Thomas Aquinas College (Social Science/Criminal Justice)<br/>M.A. Seton Hall University (Administration and Supervision)<br/>U.S. Army Command and General Staff College <br/>    OCCUPATION- <br/>Independent Consultant<br/>    PUBLIC/PARTY SERVICE- <br/>Bergen County, Undersheriff 2002-05, 1999-2001, Sheriff 2001-02<br/>    MILITARY SERVICE- <br/>U.S. Army Reserve, Major<br/>    LEGISLATIVE SERVICE- General Assembly 2002-present, Deputy Speaker 2014-present, Majority Conference Leader 2012-13, Deputy Conference Leader 2010-11</span>";                
        // $(".profile-bio-container").append(bio_html);
        d3.selectAll(".profile-bio-container").html(modified_bio);
        // $(".profile-bio-container").append(modified_bio);
        
        // addRule(".topic-slider::-moz-range-thumb", 
        // {
            // "height": "25px",
            // "border-radius": "50%", 
            // "width": "25px", 
            // "background": "url('" + profile['ImageURL'] + "')",
            // "background-size": "100%",
            // "cursor": "pointer"
        // });
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
        // d3.select(".profile-stances-collapsible-all")
        d3.selectAll(".profile-subject-collapsible-all")
            .on("click", function(){
                    // coll = d3.select(this.parentNode).select(".profile-subject-collapsible");
                    d3.select(this.parentNode).select(".profile-subject-collapsible").classed("active", !d3.select(this.parentNode).select(".profile-subject-collapsible").classed("active"));
                    
                    if (d3.select(this.parentNode).select(".profile-subject-collapsible").classed("active")){
                        // d3.selectAll(".topic-body")
                        d3.select(this.parentNode).selectAll(".subject-display-block")
                            .style("display", "block");
                        
                        d3.select(this).html( "Collapse All" );
                        // d3.select(this.parentNode).selectAll("*")
                        // d3.select(".profile-subject-container")
                            // .style("display", "block");
                    }
                    else{
                        // d3.selectAll(".topic-body")
                            // .style("display", "none");
                            
                        // d3.selectAll(".topic-source-list")
                            // .style("display", "none");
                        d3.select(this.parentNode).selectAll(".subject-display-block")
                            .style("display", "none");
                        d3.select(this).html( "Expand All" );
                            
                        // d3.select(".profile-stances-container")
                            // .style("display", "none");
                    }
            });
        
        // Stance expand listeners
        d3.selectAll(".profile-subject-collapsible")
            .on("click", function(d, i){
                    // var coll = d3.select(this);//.select("profile-subject-collapsible")
                    d3.select(this).classed("active", !d3.select(this).classed("active"));
                    
                    // if (coll.classed("active")){
                    if (d3.select(this).classed("active")){
                        d3.select(this.parentNode).select(".profile-subject-container")
                            .style("display", "block");
                        d3.select(this.parentNode).select(".profile-subject-collapsible-all").html("Collapse All");
                    }
                    else{
                        d3.select(this.parentNode).select(".profile-subject-container")
                            .style("display", "none");
                        d3.select(this.parentNode).select(".profile-subject-collapsible-all").html("Expand All");
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
   
   addHeader(){
       var self = this;
       var header_html =  "<div class='profile-header'> \
                                <div class='profile-donate-container'> \
                                    <img  class='profile-donate-img' src='img/cutouts/click_donate.png' alt=/> \
                                    <div class='profile-donate-text'> \
                                        Donate\
                                    </div> \
                                </div> \
                                <div class='profile-picture-background'> \
                                </div> \
                                <div class = 'profile-picture-container'> \
                                    <img class='profile-picture' src='./css/user_interfaces/profile/temp/alabama_us_senate/Richard_Shelby.png'/> \
                                </div> \
                                <div class='profile-name-position-container'> \
                                    <div class='profile-name-and-social-media-container'>\
                                        <div class='profile-name'> \
                                            Bob Billard \
                                        </div> \
                                        <div class='profile-header-social-media-container'> \
                                            <a class='profile-header-facebook-img-div' href='http://www.facebook.com/kimthatcheroregon'> \
                                                <img class='profile-header-facebook-img' src='img/cutouts/facebook.png' alt=/>  \
                                            </a> \
                                            <a class='profile-header-twitter-img-div' > \
                                                <img  class='profile-header-twitter-img' src='img/cutouts/twitter.png' alt=/>  \
                                            </a>\
                                            <a class='profile-header-email-img-div' > \
                                                <img  class='profile-header-email-img' src='img/cutouts/email.png' alt=/>  \
                                            </a>\
                                        </div> \
                                    </div>\
                                    <div class='profile-position'> \
                                        Senator \
                                    </div> \
                                </div>\
                            </div>";
       
       $(".profile-page").append(header_html);
       
   }
   
   addBody(){
       var body_html = "<div class='profile-body'> \
                            <div class='profile-stances-collapsible-container profile-subject-collapsible-container'> \
                                <div class='profile-stances-collapsible profile-subject-collapsible'> \
                                    <div class='profile-stances-collapsible-text profile-subject-collapsible-text'> \
                                        Stances \
                                    </div> \
                                    <div class='profile-stances-collapsible-img-div profile-subject-collapsible-img-div'> \
                                        <img  class='profile-subject-collapsible-img' src='img/cutouts/stances.png' alt=/> \
                                    </div> \
                                </div> \
                                <div class='profile-stances-collapsible-all profile-subject-collapsible-all'> \
                                    Expand All \
                                </div> \
                                <div class='profile-stances-container profile-subject-container subject-display-block'> \
                                </div> \
                            </div> \
                            <div class='profile-bio-collapsible-container profile-subject-collapsible-container'> \
                                <div class='profile-bio-collapsible profile-subject-collapsible'> \
                                    <div class='profile-bio-collapsible-text profile-subject-collapsible-text'> \
                                        Bio \
                                    </div> \
                                    <div class='profile-bio-collapsible-img-div profile-subject-collapsible-img-div'> \
                                        <img  class='profile-subject-collapsible-img' src='img/cutouts/bio.png' alt=/>  \
                                    </div> \
                                </div> \
                                <div class='profile-bio-collapsible-all profile-subject-collapsible-all'> \
                                    Expand All \
                                </div> \
                                <div class=' profile-bio-container profile-subject-container subject-display-block'> \
                                </div> \
                            </div> \
                            \
                            <div class='profile-news-collapsible-container profile-subject-collapsible-container'> \
                                    <div class='profile-news-collapsible profile-subject-collapsible'> \
                                        <div class='profile-news-collapsible-text profile-subject-collapsible-text'> \
                                            News \
                                        </div> \
                                        <div class='profile-News-collapsible-img-div profile-subject-collapsible-img-div'> \
                                            <img  class='profile-subject-collapsible-img' src='img/cutouts/news.png' alt=/>  \
                                        </div> \
                                    </div> \
                                    <div class='profile-news-collapsible-all profile-subject-collapsible-all'> \
                                        Expand All \
                                    </div> \
                                    <div class='profile-news-container profile-subject-container subject-display-block'> \
                                    </div> \
                            </div> \
                        </div>";
        $(".profile-page").append(body_html);
       
   }
   
   
   addBioContainer(){
        var self = this;
    }
   
   
   
   
    // Topic containers
    addStanceContainer(topics){
        var self = this;
        for (var i = 0; i < topics.length; i++){ //
            var slider_html = " <div class='topic-container'> \
                                    <div class='topic-collapsible replace-collapsible'>  \
                                        replace \
                                    </div> \
                                    <div class='topic-body subject-display-block'> \
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
    
    
    
    // This function calls the respective component html generators
    // These generators make up the building blocks of the profile page
    generateHTML(){
        var self = this;
        // super.generateHTML();
        var html = " <div class='profile-page'> \
                     </div>";
        
          
        $("."+this.creator.class_name).append(html);
        self.addHeader();
        self.addBody();
        self.addBioContainer();
        self.addStanceContainer(self.topics_dict);
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


