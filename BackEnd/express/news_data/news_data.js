// Node requires
var mysql       = require('mysql');


const POLITICIAN_NEWS_TABLE = "politician_based_newsarticlestable"


exports.request_articles  = async function ( req , res ) {
	
	query_json = { "Politician" : req.query.politician_name } ;
	
	news_db.retrieve_by_wildcard_and( query_json , function ( err, results) {
		if(err)
			res.send(err);
		
		// NEED TODO -- Finish writing News Conversion features here
		
	} );
	
	
	
}


////////////////////////////////DELETE BENEATH HERE ////////////////





// This function pulls all detailed voting records, from an individual politican
// based on their VoteSmartCandID. Results are formatted and returned.
exports.request_candidates_bills = async function( req , res ) {
	// Form raw Query
	var raw_query = "   SELECT  B.*,V.* FROM    PoliticianInfo.bill_info_table B \
                    inner join  \
					PoliticianInfo.politician_voting_record_table V ON \
                    B.VoteSmartBillId = V.VoteSmartBillId \
                    where V.VoteSmartCandID=" + mysql.escape(req.query.VoteSmartCandID) + " and (";
	
	// Get category ids
	var cat_ids = req.query.VoteSmartPrimaryCategoryId.split(',');
	
	for (var i = 0 ; i < cat_ids.length; i += 1){
		raw_query += "B.VoteSmartPrimaryCategoryId=" + mysql.escape(cat_ids[i])
		if ( i == (cat_ids.length-1)) {
			raw_query += ")";
			break;
		}
		raw_query += " OR ";
	}
	raw_query += "ORDER BY `DateIntroduced`";
	
	// Execute the raw query
	poly_db.execute_raw_query(raw_query, function(err, results) {
		if(err)
			res.send(err);
		
		// Format Results
		var formatted_bill_list = [];
		var formatted_bill_json = {};
		// Add all bills to category list
		Object.keys(results).forEach(function(key) {
			var cand_bill_record_row = results[key];
			formatted_bill_list.push(JSON.parse(JSON.stringify(cand_bill_record_row)));
		});
		
		res.send(formatted_bill_list);
	});
}
