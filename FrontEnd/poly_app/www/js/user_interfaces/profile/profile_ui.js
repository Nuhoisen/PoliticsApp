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
        d3.selectAll(".profile-subject-tab-all")
            .html("Expand All");
    }
    
	
	////////////////////////////////////////////////
	// This function handles the 		////////////
	// response from the http call		////////////
	// and loads the information into 	////////////
	// the HTML page					////////////
	////////////////////////////////////////////////
    loadRelatedArticles(response){
		
        var html_text = "";
        
        var json_response = JSON.parse(response);
        

         d3.selectAll(".profile-news-container")   
            .html("");

        for(var i = 0; i < json_response.length; i++)
        {
                    
            var news_panel_piece = d3.selectAll(".profile-news-container")
					.append("div");
                
            news_panel_piece.attr("class", "news-panel-piece-container");
                
            news_panel_piece
				.append('h1')
                .html(json_response[i].title);
                
            news_panel_piece
				.append("a")
                .attr("href", json_response[i].url)
                .append('img')
                .attr("src", json_response[i].top_img)
                .attr("width", "100%");
            
            news_panel_piece
                .append("div")
                .html(json_response[i].news_company)
            
            
        }
        
    }
    

	
	// This function sets up the arguments and makes 
	// a call to the client functions
	// lastly, binds the loadRelatedArticles as 
	// a call back
    requestRelatedArticles(name){
        var self = this;
        
        var last_name = name.split(" ")[1];
        var args = "keyword=" + name;
        
        get_politician_news_articles(args,self.loadRelatedArticles.bind(self));
    }
    
	
	
	////////////////////////////////////////////////
	// This function retrieves handles UI 		////
	// interaction with bills 				 	////
	////////////////////////////////////////////////
	addBillEventListeners(){
		// ---------------------------------------------
		// ------------- Expand Bills ------------------
		// ---------------------------------------------
		d3.selectAll(".topic-source-list-bill-expand-tab")
			.on("click", function(){
				var details_class_id = this.classList[1].split('-')[0];
				details_class_id = ".source-list-bill-details-" + details_class_id;
				
				var details_pane = d3.select(details_class_id);
				details_pane.classed("active", !details_pane.classed("active"));
					
				var details_tab = d3.select(this);
				details_tab.classed("active", !details_tab.classed("active"));
				
			});
		
		
		// ---------------------------------------------
		// ------------- Expand highlights -------------
		// ---------------------------------------------
		d3.selectAll(".topic-source-list-bill-expand-highlights-tab")
			.on("click", function(){
				var highlights_class_id = this.classList[1].split('-')[0];
				highlights_class_id = ".source-list-bill-highlights-" + highlights_class_id;
				
				var highlights_pane = d3.select(highlights_class_id);
					highlights_pane.classed("active", !highlights_pane.classed("active"));
					
				var highlights_tab = d3.select(this);
					highlights_tab.classed("active", !highlights_tab.classed("active"));
			});	
			
			
			
		// ---------------------------------------------
		// ------------- Expand Analysis -------------
		// ---------------------------------------------
		d3.selectAll(".topic-source-list-bill-analysis-tab")
			.on("click", function(){
				var analysis_class_id = this.classList[1].split('-')[0];
				analysis_class_id = ".source-list-bill-analysis-" + analysis_class_id;
				
				var analysis_pane = d3.select(analysis_class_id);
					analysis_pane.classed("active", !analysis_pane.classed("active"));
					
				var analysis_tab = d3.select(this);
					analysis_tab.classed("active", !analysis_tab.classed("active"));
			});	
		
	}
	
	
	generateBarGraph(bill_data , graph_class, graph_title, parent_container_class){
		
		//  Create the svg w/class name
		d3.select("." + parent_container_class)
			.append("svg")
			.attr("class", graph_class) //"analysis-senate-graph-" + bill_id)
			.attr("width", 300)
			.attr("height", 300);
			
			
		// select fields from svg
		var svg = d3.select("." + graph_class),
            width = svg.attr("width"),
            height = svg.attr("height"),
            radius = Math.min(width, height) / 2;
        
        var g = svg.append("g")
                   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);

        var pie = d3.pie().value(function(d) { 
                return d.vote_count; 
            });

        var path = d3.arc()
                     .outerRadius(radius - 10)
                     .innerRadius(0);

        var label = d3.arc()
                      .outerRadius(radius)
                      .innerRadius(radius - 80);

        
		var arc = g.selectAll(".arc")
				   .data(pie(bill_data))
				   .enter().append("g")
				   .attr("class", "arc");

		arc.append("path")
		   .attr("d", path)
		   .attr("fill", function(d) { return color(d.data.field); });
	
		// console.log(arc)
	
		arc.append("text")
		   .attr("transform", function(d) { 
					return "translate(" + label.centroid(d) + ")"; 
			})
		   .text(function(d) { return d.data.field + " : " + d.data.vote_count ; });

		svg.append("g")
		   .attr("transform", "translate(" + (width / 2 - 120) + "," + 20 + ")")
		   .append("text")
		   .text(graph_title)
		   .attr("class", "title");
	}
	
	loadBillAnalysis(bill_json){
		console.log(bill_json);
		var self = this;


		

		
		var container_class = "";
		var graph_title = "";
		var graph_class = "";
		// var senate_class = "";
		
		if (bill_json["HouseYea"] || bill_json["SenateYea"]){d3.select(".source-list-bill-analysis-"+ bill_json['VoteSmartBillID']).html("");}
		//////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////
		//////////////////////HOUSE VOTES/////////////////////////
		//////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////
		if(bill_json["HouseYea"]){
			
			var house_votes = [
				{"field": "Yeas" , "vote_count" : bill_json["HouseYea"]},
				{"field": "Nays",  "vote_count" : bill_json["HouseNay"]},
			];
		
			// Set the house votes item
			container_class = "source-list-bill-analysis-house-votes-" + bill_json['VoteSmartBillID'];
			graph_class = "analysis-house-graph-" + bill_json['VoteSmartBillID'];
			graph_title = "House Votes";
			

			// Append the div to the selector
			d3.select(".source-list-bill-analysis-"+ bill_json['VoteSmartBillID'])
				.append("div")
				.attr("class", container_class);
			
			self.generateBarGraph(house_votes, graph_class, graph_title, container_class);
		}
		
		//////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////
		//////////////////////SENATE VOTES////////////////////////
		//////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////
		if(bill_json["SenateYea"]){
			
			var senate_votes= [
				{"field": "Yeas" , "vote_count" : bill_json["SenateYea"]},
				{"field": "Nays",  "vote_count" : bill_json["SenateNay"]},
			];
		
			// Set the senate votes item
			container_class = "source-list-bill-analysis-senate-votes-" + bill_json['VoteSmartBillID'];
			graph_class = "analysis-senate-graph-" + bill_json['VoteSmartBillID']
			graph_title = "Senate Votes";
				
			d3.select(".source-list-bill-analysis-"+ bill_json['VoteSmartBillID'])
				.append("div")
				.attr("class", container_class);
				
			self.generateBarGraph(senate_votes, graph_class, graph_title, container_class);
		}
	
	}
	
	
	
	
	////////////////////////////////////////////////
	// This function retrieves bill information ////
	// from the server and loads it into the 	////
	// HTML										////
	////////////////////////////////////////////////
	loadRelatedBills(category, response){

		var self = this;
		var html_text  = ""
        
        var json_response = JSON.parse(response);
		
		
		for(var i = 0; i < json_response.length; i++)
        {			
		   	html_text = "	<div class='topic-source-list-bill replace replace-source-list-bill'> \
								<div class='topic-source-list-bill-number replace replace-source-list-bill-number'> \
								</div> \
								<div class='topic-source-list-bill-vote replace replace-source-list-bill-vote'> \
									Yea \
								</div> \
								<div class='topic-source-list-bill-details replace replace-source-list-bill-details source-list-bill-details-replace'> \
									<div class='topic-source-list-bill-title replace replace-source-list-bill-title'> \
										Empty BillName Placeholder\
									</div> \
									<div class='topic-source-list-bill-synopsis replace replace-source-list-bill-synopsis'> \
										Bill Synopsis: See Highlights\
									</div> \
									<div class='topic-source-list-bill-highlights replace replace-source-list-bill-highlights source-list-bill-highlights-replace'> \
										No Bill Highlights \
									</div> \
									<div class='topic-source-list-bill-expand-highlights-tab replace replace-source-list-bill-expand-highlights-tab'> \
										Bill Highlights \
									</div> \
									<div class='topic-source-list-bill-analysis replace replace-source-list-bill-analysis source-list-bill-analysis-replace'> \
										No Analysis Available \
									</div> \
									<div class='topic-source-list-bill-analysis-tab replace replace-source-list-bill-analysis-tab'> \
										Analysis \
									</div> \
								</div> \
								<div class='topic-source-list-bill-expand-tab replace replace-source-list-bill-expand-tab'> \
									Details \
								</div> \
							</div>" ;

			
							
			html_text = html_text.replace(/replace/g, json_response[i]['VoteSmartBillID']);
			
			// Add all the text
			$("." + category + "-source-list").append(html_text);
			
			// Fill in the fields
			$("." + json_response[i]['VoteSmartBillID'] + "-source-list-bill-title").html("Title: " + json_response[i]['BillTitle']);
			$("." + json_response[i]['VoteSmartBillID'] + "-source-list-bill-vote").html(json_response[i]['PoliticianVote']);
			$("." + json_response[i]['VoteSmartBillID'] + "-source-list-bill-number").html(json_response[i]['BillNumber']);
			
			// Bill Highlights
			if ( json_response[i]['BillHighlights'] != null ) {
				$("." + json_response[i]['VoteSmartBillID'] + "-source-list-bill-highlights").html("Highlights: " + json_response[i]['BillHighlights']);
			}
			
			// Bill Synopsis
			if ( json_response[i]['BillSynopsis'] != null ) {
				$("." + json_response[i]['VoteSmartBillID'] + "-source-list-bill-synopsis").html(json_response[i]['BillSynopsis']);
			}
			
			// Bill Analysis
			// if( i == 0) {				
			self.loadBillAnalysis(json_response[i]);
			// }
			
		}
		
		// Bill event listeners
		self.addBillEventListeners();
		
	}
	
	
	///////////////////////////////////////////////////////
	// This function sets up the arguments and makes //////
	// a call to the client functions				 //////
	// lastly, binds the loadRelatedBills as 		 //////
	// a call back									 //////
	///////////////////////////////////////////////////////
	requestRelatedBills(voteSmartId){
		var self = this;
		var args = "";
		
		self.vs_topic_dict = {
			"Abortion" : [75, 2],
			"Guns" : [37],
			"Drugs" : [25],
			"Education": [27, 93, 98],
			"Environment": [30],
			"Economics": [11],
			"Health-Care": [38, 91]
		}
		
		// this.topics_list = ["Abortion", "Guns", "Economics", "Education", "Environment", "Health Care"]
       
	    for ( var key in self.vs_topic_dict ){
			
			// Iterate through each potential category id in the category
			for ( var i = 0 ; i < self.vs_topic_dict[key].length; i += 1){
				
				args = "VoteSmartCandID=" + voteSmartId + "&VoteSmartPrimaryCategoryId=" +  self.vs_topic_dict[key][i];
				
				// Pass the argument into the bound callback function
				get_politician_bills(args, self.loadRelatedBills.bind(self, key));
			}	
		}
	}
	
	///////////////////////////////////////
    // Load political information	 //////
	// This includes profile picture //////
	// The politicians name			 //////
	// Their position				 //////
	// Their Social Media information//////
	// All related articles			 //////
	// The corresponding votesmart id//////
	///////////////////////////////////////
	
    loadPoliticianInfo(profile){
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
    
		self.requestRelatedBills(profile['VoteSmartID']);
	
      
        var bio =  profile['Bio'];
        var modified_bio = "";
        bio = bio.split("<br/>");
        bio.forEach( function( sentence, index ) {
           modified_bio  = modified_bio + sentence + "<br/><br/>" 
        });
        // var bio_html = "<span id='lblBio'>BORN-<br/>December 16, 1949 <br/>    EDUCATION- <br/>B.S. St. Thomas Aquinas College (Social Science/Criminal Justice)<br/>M.A. Seton Hall University (Administration and Supervision)<br/>U.S. Army Command and General Staff College <br/>    OCCUPATION- <br/>Independent Consultant<br/>    PUBLIC/PARTY SERVICE- <br/>Bergen County, Undersheriff 2002-05, 1999-2001, Sheriff 2001-02<br/>    MILITARY SERVICE- <br/>U.S. Army Reserve, Major<br/>    LEGISLATIVE SERVICE- General Assembly 2002-present, Deputy Speaker 2014-present, Majority Conference Leader 2012-13, Deputy Conference Leader 2010-11</span>";                
        // $(".profile-bio-container").append(bio_html);
        d3.selectAll(".profile-bio-container").html(modified_bio);
 
    }
    
    // Stances click listener
    stancesClick(){
        var self = this;
        
        var coll = document.getElementsByClassName("profile-stances-tab")[0];
        var fold = document.getElementsByClassName("profile-stances-container")[0];
        
        coll.classList.toggle("stances-active");
        fold.style.display = ( fold.style.display == "block" ) ? "none" : "block";
    }
   
    addListeners(){
            
        d3.selectAll(".profile-subject-tab-all")
            .on("click", function(){
                    // coll = d3.select(this.parentNode).select(".profile-subject-tab");
                    d3.select(this.parentNode).select(".profile-subject-tab").classed("active", !d3.select(this.parentNode).select(".profile-subject-tab").classed("active"));
                    
                    if (d3.select(this.parentNode).select(".profile-subject-tab").classed("active")){
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
        d3.selectAll(".profile-subject-tab")
            .on("click", function(d, i){
                    // var coll = d3.select(this);//.select("profile-subject-tab")
                    d3.selectAll(".profile-subject-tab").classed("active", false);
                    d3.select(this).classed("active", true);
                    
                    // Hide all display containers, before showing new one.
                    d3.selectAll(".profile-subject-container")
                        .style("display", "none");
                    
                    var test_obj = d3.select(this).node();
                    if(test_obj.className.includes("stances")){
                        d3.select(".profile-stances-container")
                            .style("display", "block");
                    }
                    
                    if(test_obj.className.includes("bio")){
                        d3.select(".profile-bio-container")
                            .style("display", "block");
                    }
                    
                    if(test_obj.className.includes("news")){
                        d3.select(".profile-news-container")
                            .style("display", "block");
                    }
                        
                   
                });
         
         d3.selectAll(".topic-tab")
            .on("click", function(){
                 var som = d3.select(this.nextElementSibling);
                 ( som.style("display") == "block" ) ? som.style("display", "none") : som.style("display", "block");        
            });
            
        d3.selectAll(".topic-stance-sources-tab")
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
                                <div class='profile-picture-background'> \
                                </div> \
                                <div class = 'profile-picture-container'> \
                                    <img class='profile-picture' src='./css/user_interfaces/profile/temp/alabama_us_senate/Richard_Shelby.png'/> \
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
                                    <a class='profile-donate-container'> \
                                        <img  class='profile-donate-img' src='img/cutouts/click_donate.png' alt=/> \
                                        <div class='profile-donate-text'> \
                                            Donate\
                                        </div> \
                                    </a> \
                                </div> \
                                <div class='profile-name-position-container'> \
                                    <div class='profile-name-container'>\
                                        <div class='profile-name'> \
                                            Bob Billard \
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
                            <div class='profile-stances-tab-container profile-subject-tab-container'> \
                                <div class='profile-stances-tab profile-subject-tab'> \
                                    <div class='profile-stances-tab-img-div profile-subject-tab-img-div'> \
                                        <img  class='profile-subject-tab-img' src='img/cutouts/stances.png' alt=/> \
                                    </div> \
                                    <div class='profile-stances-tab-text profile-subject-tab-text'> \
                                        Stances \
                                    </div> \
                                </div>  \
                                 <div class='profile-bio-tab profile-subject-tab'> \
                                    <div class='profile-bio-tab-img-div profile-subject-tab-img-div'> \
                                        <img  class='profile-subject-tab-img' src='img/cutouts/bio.png' alt=/>  \
                                    </div> \
                                    <div class='profile-bio-tab-text profile-subject-tab-text'> \
                                        Bio \
                                    </div> \
                                </div> \
                                <div class='profile-news-tab profile-subject-tab'> \
                                        <div class='profile-News-tab-img-div profile-subject-tab-img-div'> \
                                            <img  class='profile-subject-tab-img' src='img/cutouts/news.png' alt=/>  \
                                        </div> \
                                        <div class='profile-news-tab-text profile-subject-tab-text'> \
                                            News \
                                        </div> \
                                </div> \
                            </div> \
                            <div class='profile-stances-container profile-subject-container subject-display-block'> \
                            </div> \
                            <div class=' profile-bio-container profile-subject-container subject-display-block'> \
                            </div> \
                            <div class='profile-news-container profile-subject-container subject-display-block'> \
                            </div> \
                        </div>";
       
       // var body_html = "<div class='profile-body'> \
                            // <div class='profile-stances-tab-container profile-subject-tab-container'> \
                                // <div class='profile-stances-tab profile-subject-tab'> \
                                    // <div class='profile-stances-tab-text profile-subject-tab-text'> \
                                        // Stances \
                                    // </div> \
                                    // <div class='profile-stances-tab-img-div profile-subject-tab-img-div'> \
                                        // <img  class='profile-subject-tab-img' src='img/cutouts/stances.png' alt=/> \
                                    // </div> \
                                // </div> \
                                // <div class='profile-stances-container profile-subject-container subject-display-block'> \
                                // </div> \
                            // </div> \
                            // <div class='profile-bio-tab-container profile-subject-tab-container'> \
                                // <div class='profile-bio-tab profile-subject-tab'> \
                                    // <div class='profile-bio-tab-text profile-subject-tab-text'> \
                                        // Bio \
                                    // </div> \
                                    // <div class='profile-bio-tab-img-div profile-subject-tab-img-div'> \
                                        // <img  class='profile-subject-tab-img' src='img/cutouts/bio.png' alt=/>  \
                                    // </div> \
                                // </div> \
                                // <div class=' profile-bio-container profile-subject-container subject-display-block'> \
                                // </div> \
                            // </div> \
                            // \
                            // <div class='profile-news-tab-container profile-subject-tab-container'> \
                                    // <div class='profile-news-tab profile-subject-tab'> \
                                        // <div class='profile-news-tab-text profile-subject-tab-text'> \
                                            // News \
                                        // </div> \
                                        // <div class='profile-News-tab-img-div profile-subject-tab-img-div'> \
                                            // <img  class='profile-subject-tab-img' src='img/cutouts/news.png' alt=/>  \
                                        // </div> \
                                    // </div> \
                                    // <div class='profile-news-container profile-subject-container subject-display-block'> \
                                    // </div> \
                            // </div> \
                        // </div>";
        $(".profile-page").append(body_html);
       
   }
   
    addBioContainer(){
        var self = this;
    }
    
    // Topic containers
    addStanceContainer(topics){
        var self = this;
        for (var i = 0; i < topics.length; i++){ //
            var slider_html = " <div class='topic-container replace replace-container'> \
                                    <div class='topic-tab replace-tab'>  \
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
										 <div class='topic-perceived-stance replace replace-perceived-stance'> \
                                            Perceived Stance \
                                        </div> \
                                        <div class='topic-stance-source-container replace replace-stance-source-container'> \
                                                <div class='topic-stance-sources-tab replace replace-stance-sources-tab'>\
                                                    Sources \
                                                </div> \
												<div class='topic-source-list replace replace-source-list'> \
													<div class='topic-source-list-bill-title-header replace replace-source-list-bill-title-header'> \
														Title:  \
													</div> \
													<div class='topic-source-list-bill-vote-header replace replace-source-list-bill-vote-header'> \
														Vote:  \
													</div> \
												</div>\
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
            
        d3.select(".profile-stances-tab")
            .on("click", function(){
                self.stancesClick();
            });
    }
    
    
    // This function calls the respective component html generators
    // These generators make up the building blocks of the profile page
	// This function executes before the bills are loaded from the SQL DB
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
        
		// This is used to map votesmart category ID numbers
		// to topics
		this.vs_topic_dict = new Object();
		
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


