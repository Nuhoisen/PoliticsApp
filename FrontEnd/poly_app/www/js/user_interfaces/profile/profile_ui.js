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
        console.log("LOADING RELATED ARTICLES");

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
				// The second class of every div in this set will always be the vs id itself
				var highlights_class_id = this.classList[1];
				var highlights_tab_class_id = ".source-list-bill-expand-highlights-tab-" + highlights_class_id;
				highlights_class_id = ".source-list-bill-highlights-" + highlights_class_id;
				
				// Expand/Collapse the body pane
				var highlights_pane = d3.select(highlights_class_id);
					highlights_pane.classed("active", !highlights_pane.classed("active"));
					
				// Deactivate the tab(s) style
				var highlights_tab = d3.selectAll(highlights_tab_class_id);
					highlights_tab.classed("active", !highlights_tab.classed("active"));
			});	
			
			
			
		// ---------------------------------------------
		// ------------- Expand Analysis -------------
		// ---------------------------------------------
		d3.selectAll(".topic-source-list-bill-analysis-tab")
			.on("click", function(){
				// The second class of every div in this set will always be the vs id itself
				var analysis_class_id = this.classList[1];
				var analysis_tab_class_id = ".source-list-bill-analysis-tab-" + analysis_class_id;
				analysis_class_id = ".source-list-bill-analysis-" + analysis_class_id;
				
				// Expand/Collapse the body pane
				var analysis_pane = d3.selectAll(analysis_class_id);
					analysis_pane.classed("active", !analysis_pane.classed("active"));
					
				// De/activate the tab(s) style
				var analysis_tab = d3.selectAll(analysis_tab_class_id);
					analysis_tab.classed("active", !analysis_tab.classed("active"));
			});	
		
	}
	
	
	generateBarGraph( bill_data , graph_class, graph_title, parent_container_class){
		
		
		bill_data = bill_data.filter(function(d){ return d.vote_count != 0;});
		//  Create the svg w/class name
		d3.select("." + parent_container_class)
			.append("svg")
			.attr("class", graph_class) 
			.attr("width", 300)
			.attr("height", 300);
			
			
		// select fields from svg
		var svg 	= d3.select("." + graph_class),
            width 	= svg.attr("width"),
            height 	= svg.attr("height"),
            radius 	= Math.min(width, height) / 4,
			labelOffset = radius * 1.4;
			
        var g = svg.append("g")
				.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



		// Pie
        var pie = d3.pie().value(function(d) { 
                return d.vote_count; 
            });

		// Path
        var path = d3.arc()
				.outerRadius(radius - 10)
				.innerRadius(0);

		// Label
        var label = d3.arc()
				.outerRadius(labelOffset)
				.innerRadius(labelOffset);

        // Arc
		var arc = g.selectAll(".arc")
				   .data(pie(bill_data))
				   .enter().append("g")
				   .attr("class", "arc");

		// Path
		arc.append("path")
		   .attr("d", path)
		   .attr("fill", function(d) {
			   return  d.data.color; 
		   });
		   
		// Append the over-all vote labels
		arc.append("foreignObject")
			.attr("x", function(d) {
					return (label.centroid(d)[0]-45);
			})
			.attr("y", function(d) {
					return (label.centroid(d)[1]-15);
			})
			.attr("width", 70)
			.attr("height", 30)
			.style('text-anchor', 'middle')
			.style('alignment-baseline', 'middle')
			.style('font-size', '12px')
		    .text(function(d) { return d.data.field + " : " + d.data.vote_count ; });


		svg.append("g")
		   .attr("transform", "translate(" + ( width / 2 - 120 ) + "," + 20 + ")")
		   .append("text")
		   .text(graph_title)
		   .attr("class", "title");
	}
	
	loadBillAnalysis(bill_json){
		
		var self = this;
		
		var container_class = "";
		var graph_title = "";
		var graph_class = "";
		
		
		// If any Votes found in the bill's json. Clear the existing HTML
		// Add an additional tab to make collapsing the body pane easier
		if (bill_json["HouseYea"] || bill_json["SenateYea"]){
			d3.select(".source-list-bill-analysis-"+ bill_json['VoteSmartBillID']).html("")
				.append("div")
				.attr("class", "topic-source-list-bill-analysis-tab " + bill_json["VoteSmartBillID"] + " source-list-bill-analysis-tab-" + bill_json["VoteSmartBillID"])
				
				.text("Analysis");
		}
		
		
		//////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////
		//////////////////////SENATE VOTES////////////////////////
		//////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////
		if(bill_json["SenateYea"]!=null){
			
			var senate_votes = [
				{"field": "Yeas" , "vote_count" : bill_json["SenateYea"], "color": "#3bcb58"},
				{"field": "Nays",  "vote_count" : bill_json["SenateNay"], "color": "#ab2e2e"},
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
		
		//////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////
		///////////////////SENATE PARTISAN VOTES//////////////////
		//////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////
		if(bill_json["SenateDemocratYea"]!=null){
			var senate_partisan_votes = [
				{"field": "Democrat Nays"	, "vote_count" : bill_json["SenateDemocratNay"], "color":"#1e405e"},
				{"field": "Democrat Yeas" 	, "vote_count" : bill_json["SenateDemocratYea"], "color":"#4671f2"},
				{"field": "Republican Yeas" , "vote_count" : bill_json["SenateRepublicanYea"], "color":"#ef2e2e"},
				{"field": "Republican Nays" , "vote_count" : bill_json["SenateRepublicanNay"], "color":"#771c0e"},
			];
			
			
			// Set the senate votes item
			container_class = "source-list-bill-analysis-senate-partisan-votes-" + bill_json['VoteSmartBillID'];
			graph_class = "analysis-senate-partisan-graph-" + bill_json['VoteSmartBillID']
			graph_title = "Senate Votes Partisan Lines";
				
			d3.select(".source-list-bill-analysis-"+ bill_json['VoteSmartBillID'])
				.append("div")
					.attr("class", container_class);
				
			self.generateBarGraph(senate_partisan_votes, graph_class, graph_title, container_class);
		}
		
		
		//////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////
		//////////////////////HOUSE VOTES/////////////////////////
		//////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////
		if( bill_json["HouseYea"] != null){
			
			var house_votes = [
				{"field": "Yeas" , "vote_count" : bill_json["HouseYea"], "color": "#3bcb58"},
				{"field": "Nays",  "vote_count" : bill_json["HouseNay"], "color": "#ab2e2e"},
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
		///////////////////HOUSE PARTISAN VOTES//////////////////
		//////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////
		if(bill_json["HouseDemocratYea"]!=null){
			var house_partisan_votes = [
				{"field": "Democrat Nays"	, "vote_count" : bill_json["HouseDemocratNay"], "color":"#1e405e"},
				{"field": "Democrat Yeas" 	, "vote_count" : bill_json["HouseDemocratYea"], "color":"#4671f2"},
				{"field": "Republican Yeas" , "vote_count" : bill_json["HouseRepublicanYea"], "color":"#ef2e2e"},
				{"field": "Republican Nays" , "vote_count" : bill_json["HouseRepublicanNay"], "color":"#771c0e"},
			];
			
			
			// Set the senate votes item
			container_class = "source-list-bill-analysis-house-partisan-votes-" + bill_json['VoteSmartBillID'];
			graph_class = "analysis-house-partisan-graph-" + bill_json['VoteSmartBillID']
			graph_title = "House Votes Partisan Lines";
				
			d3.select(".source-list-bill-analysis-"+ bill_json['VoteSmartBillID'])
				.append("div")
				.attr("class", container_class);
				
			self.generateBarGraph(house_partisan_votes, graph_class, graph_title, container_class);
			
		}
	
	}
	
	
	// Add a function to highlight the bill
	// if its politician votes out of party lines.
	flagPoliticianBill(voteSmartBillId){
		
		d3.select(".source-list-bill-"+ voteSmartBillId)
			.classed("stand-out", true);	
	}
	
	/////////////////////////////////////////////////////
	// This function sets up the liberal conservative  //
	// weight for each category that a politician votes//
	// on. Sets where the politician falls on the      //
	// politic spectrum								   //
	/////////////////////////////////////////////////////
	setPartisanBias(category, json_response){

		var self = this;
		
		
		// Take yeas, nays, 
		// and politicans of each party
		var total_republican_yeas = 0;
		var total_republican_nays = 0;
		var total_republican = 0;
		
		var total_democrat_yeas = 0 ; 
		var total_democrat_nays = 0 ; 
		var total_democrat = 0 ; 

		// Set up the ratios
		var dem_yea_ratio = 0;
		var dem_nay_ratio = 0;
		var rep_yea_ratio = 0;
		var rep_nay_ratio = 0;

		// Acculmulative partisan rating- ranges -1 to 1 (conservative to liberal)
		var bills_acculmulative_partisan_rating = 0 ;
		// Aggregated value of politicians votes in accordance w/their party
		var politician_partisan_rating = 0;
		var normalized_politician_partisan_rating = 0;
		
		for( var i = 0; i < json_response.length; i++) {
			
			
			total_republican_yeas = 0;
			total_republican_nays = 0;
			total_republican = 0;
			
			total_democrat_yeas = 0 ; 
			total_democrat_nays = 0 ; 
			total_democrat = 0 ; 

			// Set up the ratios
			dem_yea_ratio = 0;
			dem_nay_ratio = 0;
			rep_yea_ratio = 0;
			rep_nay_ratio = 0;

			bills_acculmulative_partisan_rating = 0 ;
		
			if(json_response[i]['HouseYea'] || json_response[i]['HouseNay'] ){
				
				total_republican_yeas += json_response[i]['HouseRepublicanYea'];
				total_republican_nays += json_response[i]['HouseRepublicanNay'];
				
				total_democrat_yeas += json_response[i]['HouseDemocratYea'];
				total_democrat_nays += json_response[i]['HouseDemocratNay'];	
			}
			
		
			if(json_response[i]['SenateYea'] || json_response[i]['SenateNay']){
				
				total_republican_yeas += json_response[i]['SenateRepublicanYea'];
				total_republican_nays += json_response[i]['SenateRepublicanNay'];
				
				total_democrat_yeas += json_response[i]['SenateDemocratYea'];
				total_democrat_nays += json_response[i]['SenateDemocratNay'];	
			}
			// Calculate the total politicians per party to vote
			total_republican = total_republican_yeas + total_republican_nays;
			total_democrat =   total_democrat_yeas   + total_democrat_nays;
			
			// Calculate the ratio
			
			// The republican yea ratio will be opposite of the democratic nay ratio.
			// This way the weights will cancel out.
			dem_yea_ratio = (total_democrat_yeas / total_democrat) * -1;
			dem_nay_ratio = (total_democrat_nays / total_democrat) ;
			
			
			// Calculate the ratio
			rep_yea_ratio = (total_republican_yeas / total_republican) ;
			rep_nay_ratio = (total_republican_nays / total_republican) * -1;
			
			bills_acculmulative_partisan_rating = dem_yea_ratio + dem_nay_ratio + rep_yea_ratio + rep_nay_ratio;
			// Normalize the acculmulative ratio
			bills_acculmulative_partisan_rating = bills_acculmulative_partisan_rating / 2;
			
			// politician_partisan_rating
			// console.log("Legistlation:" + json_response[i]["BillNumber"] + " Conservative-Liberal Rating:" + bills_acculmulative_partisan_rating);
			
			
			///////////////////////////////////////////////////
			/////////////////////DEMOCRATS/////////////////////
			///////////////////////////////////////////////////
			if(self.loaded_profile["PartyAffiliation"] == "D"){
				if(json_response[i]["PoliticianVote"] == "Yea"){
					// Simply add one if the politicians vote:yea is 
					// in accord with their party majority
					if (bills_acculmulative_partisan_rating < 0) {
						politician_partisan_rating += -1;
					}
					// Otherwise, add the opposing party's
					// bill weight to the total
					else {// bill rating is positive- towards the dem-nay, rep-yea
						politician_partisan_rating += bills_acculmulative_partisan_rating * 1;
						self.flagPoliticianBill(json_response[i]["VoteSmartBillID"]);
					}	
				}
				else if(json_response[i]["PoliticianVote"] == "Nay"){
					// Simply add one if the politicians vote:nay is 
					// in accord with their party majority
					if (bills_acculmulative_partisan_rating > 0){
						politician_partisan_rating += -1;
					}
					// Otherwise, add the opposing party's 
					// bill weight to the total
					else{// bill rating is negative + torwards the dem-yea
						politician_partisan_rating += bills_acculmulative_partisan_rating * -1;
						console.log("Flag political bill");
						self.flagPoliticianBill(json_response[i]["VoteSmartBillID"]);
					}
				}
			}
			///////////////////////////////////////////////////
			/////////////////////REPUBLICANS///////////////////
			///////////////////////////////////////////////////
			else if(self.loaded_profile["PartyAffiliation"] == "R"){
				if(json_response[i]["PoliticianVote"] == "Yea"){
					// Simply sub one, if the politicians vote:nay is 
					// in accord with their party majority
					if (bills_acculmulative_partisan_rating > 0){
						politician_partisan_rating += 1;
					}
					// Otherwise, add the opposing party's 
					// bill weight to the total
					else{// bill rating negative- towards rep-nay, dem-yea
						politician_partisan_rating += bills_acculmulative_partisan_rating * 1;
						console.log("Flag political bill");
						self.flagPoliticianBill(json_response[i]["VoteSmartBillID"]);
					}
				}
				else if(json_response[i]["PoliticianVote"] == "Nay")
					// Simply sub one, if the politicians vote:nay is 
					// in accord with their party majority
					if(bills_acculmulative_partisan_rating < 0){
						politician_partisan_rating += 1;
					}
					// Otherwise, add the opposing party's 
					// bill weight to the total
					else{//bill rating postive- towards rep-yea, dem-nay
						politician_partisan_rating += bills_acculmulative_partisan_rating * -1;
						console.log("Flag political bill");
						self.flagPoliticianBill(json_response[i]["VoteSmartBillID"]);
					}
				
			}
		}
		normalized_politician_partisan_rating = politician_partisan_rating/json_response.length;
		// console.log("Politicians Acculmulative rating: " + (normalized_politician_partisan_rating) + " On subject " + category);
		
		
		
		d3.select("." + category + "-slider")
			.attr("value", (normalized_politician_partisan_rating*100) );
	}
	
	////////////////////////////////////////////////
	// This function retrieves bill information ////
	// from the server and loads it into the 	////
	// HTML.                                    ////
	// Current a new request is made everytime  ////
	// meaning that ALL of the bill content     ////
	// on the page here must be reloaded.       ////
	////////////////////////////////////////////////
	loadRelatedBills(category, response){

		var self = this;
		var html_text  = ""
        
        var json_response = JSON.parse(response);
		// Add all the text
		d3.select("." + category + "-source-list")
			.html("");

		for(var i = 0; i < json_response.length; i++)
        {			
		   	html_text = "	<div class='topic-source-list-bill replace replace-source-list-bill source-list-bill-replace'> \
								<div class='topic-source-list-bill-number-vote-container replace replace-source-list-bill-number-vote-container'> \
									<div class='topic-source-list-bill-number replace replace-source-list-bill-number'> \
									</div> \
									<div class='topic-source-list-bill-date-introduced replace replace-source-list-bill-date-introduced'> \
										</div> \
									<div class='topic-source-list-bill-vote replace replace-source-list-bill-vote source-list-bill-vote-replace'> \
										Yea \
									</div> \
								</div> \
								<div class='topic-source-list-bill-details replace replace-source-list-bill-details source-list-bill-details-replace'> \
									<div class='topic-source-list-bill-title replace replace-source-list-bill-title'> \
										Empty BillName Placeholder\
									</div> \
									<div class='topic-source-list-bill-synopsis replace replace-source-list-bill-synopsis'> \
										Bill Synopsis: See Highlights\
									</div> \
									<div class='topic-source-list-bill-highlights replace replace-source-list-bill-highlights source-list-bill-highlights-replace'> \
									</div> \
									<div class='topic-source-list-bill-expand-highlights-tab replace replace-source-list-bill-expand-highlights-tab source-list-bill-expand-highlights-tab-replace'> \
										Bill Highlights \
									</div> \
									<div class='topic-source-list-bill-analysis replace replace-source-list-bill-analysis source-list-bill-analysis-replace'> \
										No Analysis Available \
									</div> \
									<div class='topic-source-list-bill-analysis-tab replace replace-source-list-bill-analysis-tab source-list-bill-analysis-tab-replace'> \
										Analysis \
									</div> \
								</div> \
								<div class='topic-source-list-bill-expand-tab replace replace-source-list-bill-expand-tab'> \
									Details \
								</div> \
							</div>" ;

			
							
			html_text = html_text.replace(/replace/g, json_response[i]['VoteSmartBillID']);
			
			// Add all the text
			// d3.select("." + category + "-source-list")
				// .html(html_text);
			$("." + category + "-source-list")
				.append(html_text);
			
			///////////////////////
			// Fill in the fields//
			///////////////////////
			
			///////////////////////
			// Bill Title
			///////////////////////
			$("." + json_response[i]['VoteSmartBillID'] + "-source-list-bill-title")
				.html("Title: " + json_response[i]['BillTitle']);
			
			///////////////////////
			// Date Introduced
			///////////////////////
			$("." + json_response[i]['VoteSmartBillID'] + "-source-list-bill-date-introduced")
				.html(json_response[i]['DateIntroduced']);
			
			
			///////////////////////
			// Politician Vote 
			///////////////////////
			$("." + json_response[i]['VoteSmartBillID'] + "-source-list-bill-vote")
				.html(json_response[i]['PoliticianVote']);
			
			d3.select(".source-list-bill-vote-"+ json_response[i]['VoteSmartBillID'])
				.classed(json_response[i]['PoliticianVote'].replace(/ /g,'-') , true);
		
			///////////////////////
			// Bill Number
			///////////////////////
			$("." + json_response[i]['VoteSmartBillID'] + "-source-list-bill-number")
				.html(json_response[i]['BillNumber']);
			
			///////////////////////
			// Bill Highlights
			///////////////////////
			if ( json_response[i]['BillHighlights'] != null ) {
				d3.select(".source-list-bill-highlights-" +json_response[i]['VoteSmartBillID'])
					.append("div")
					.attr("class", "topic-source-list-bill-expand-highlights-tab " +json_response[i]['VoteSmartBillID'] + "  source-list-bill-expand-highlights-tab-"+json_response[i]['VoteSmartBillID'])
					.text("Bill Highlights");
				d3.select(".source-list-bill-highlights-" +json_response[i]['VoteSmartBillID'])
					.append("div")
					.attr("class", "source-list-bill-highlights-content-"+json_response[i]['VoteSmartBillID'])
					.html(json_response[i]['BillHighlights']);
			}
			
			// Bill Synopsis
			if ( json_response[i]['BillSynopsis'] != null ) {
				$("." + json_response[i]['VoteSmartBillID'] + "-source-list-bill-synopsis").html(json_response[i]['BillSynopsis']);
			}
			// console.log(json_response[i]);
			self.loadBillAnalysis(json_response[i]);
			
		}
		
		// Bill event listeners
		self.addBillEventListeners();
		
		// console.log(json_response);
		if(json_response.length)
			self.setPartisanBias(category, json_response);
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
		
		// self.vs_topic_dict = {
			// "Abortion" : [75, 2],
			// "Guns" : [37],
			// "Drugs" : [25],
			// "Education": [27, 93, 98],
			// "Environment": [30],
			// "Economics": [11],
			// "Health-Care": [38, 91],
			// "Labor-Unions": [43]
		// }
		
	    for ( var key in self.vs_topic_dict ){
			args = "VoteSmartCandID=" + voteSmartId + "&VoteSmartPrimaryCategoryId=";
			// Iterate through each potential category id in the category
			for ( var i = 0 ; i < self.vs_topic_dict[key].length; i += 1){
				
				args += self.vs_topic_dict[key][i] + ",";
				
				// Pass the argument into the bound callback function
			}	
			get_politician_bills(args, self.loadRelatedBills.bind(self, key));
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
        self.loaded_profile  = profile;
		
		/////////////////////////
		// Generate the BIO 
		/////////////////////////
		var bio =  profile['Bio'];
        var modified_bio = "";
        bio = bio.split("<br/>");
        bio.forEach( function( sentence, index ) {
           modified_bio  = modified_bio + sentence + "<br/><br/>" 
        });

        d3.selectAll(".profile-bio-container").html(modified_bio);
		/////////////////////////
		
		
		
		/////////////////////////
		// Generate the rest
		/////////////////////////
        d3.selectAll(".profile-picture")
            .attr("src", profile['ImageURL']);
            
        d3.selectAll(".profile-name")
            .html(profile['Name']);
 
        d3.selectAll(".profile-position")
            .html(profile['District']);
			
		d3.selectAll(".profile-political-party")
			.html(
			function(){
					if (profile["PartyAffiliation"] == 'D') return "Democrat";
					if (profile["PartyAffiliation"] == 'R') return "Republican";
					if (profile["PartyAffiliation"] == 'I') return "Independent";
					if (profile["PartyAffiliation"] == 'G') return "Green Party";
					if (profile["PartyAffiliation"] == 'L') return "Liberatarian";
			}
			
			);
		
        d3.selectAll(".profile-header-twitter-img-div")
            .attr("href", profile['Twitter']);
        
        d3.selectAll(".profile-header-facebook-img-div")
            .attr("href", profile['Facebook']);
        
        self.requestRelatedArticles(profile['Name']);
    
		self.requestRelatedBills(profile['VoteSmartID']);
		/////////////////////////
	
      

 
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
									<div class='profile-political-party'> \
                                        Democrat \
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
                                            <input type='range' min='-100' max='100' value='0' class='topic-slider replace replace-slider'> \
                                        </div> \
										 <div class='topic-perceived-stance replace replace-perceived-stance'> \
                                            Perceived Stance \
                                        </div> \
                                        <div class='topic-stance-source-container replace replace-stance-source-container'> \
                                                <div class='topic-stance-sources-tab replace replace-stance-sources-tab'>\
                                                    Sources \
                                                </div> \
												<div class='topic-source-list replace replace-source-list'> \
													<div class='topic-source-list-bill-title-vote-header-container replace replace-source-list-bill-title-vote-header-container'> \
														<div class='topic-source-list-bill-title-header replace replace-source-list-bill-title-header'> \
															Title:  \
														</div> \
														<div class='topic-source-list-bill-date-introduced-header replace replace-source-list-bill-date-introduced-header'> \
															Date Introduced:  \
														</div> \
														<div class='topic-source-list-bill-vote-header replace replace-source-list-bill-vote-header'> \
															Vote:  \
														</div> \
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
        
        // this.topics_list = ["Abortion", "Guns", "Economics", "Education", "Environment", "Health-Care", "Labor Unions"]
        
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
                            },
							{
								"Topic": "Labor-Unions",
								"Left" : "Pro-Union",
								"Right": "Anti-Union"	
							},
							
							{
								"Topic": "Immigration",
								"Left" : "Pro-Immigration",
								"Right": "Pro-Nativist"	
							}
                        ];
						
		this.vs_topic_dict = {
			"Abortion" : [75, 2],
			"Guns" : [37],
			"Drugs" : [25],
			"Education": [27, 93, 98],
			"Environment": [30],
			"Economics": [11],
			"Health-Care": [38, 91],
			"Labor-Unions": [43],
			"Immigration" : [40]
		}
		// Loaded Profile will contain reference to 
		// loaded politician information through out class
		this.loaded_profile = null;
    }
    
}


