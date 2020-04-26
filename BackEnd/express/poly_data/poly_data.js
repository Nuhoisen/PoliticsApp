// Node requires
var mysql       = require('mysql');


const POLITICIAN_TABLE = "politiciantable";

// State Partisanship Requests- 
// Used for district partisan coloring
exports.request_state_partisanship = async function(req, res){
	// Retrieve the state argument
	var state = mysql.escape(req.query.state);
	// Form raw query 
	var raw_query = "SELECT District, PartyAffiliation FROM " + POLITICIAN_TABLE + " WHERE State LIKE " + state + " AND InOffice='Yes' and Role NOT LIKE 'US Senator'";
	
	// Execute raw query, return response back to client. 
	// No formatting required
	poly_db.execute_raw_query(raw_query,  function(err, results) {
		if (err)
			res.send(err);
		res.json(results);
	});
};

// Senate Partisanship Requests- 
// Used for state partisan coloring
exports.request_us_senator_partisanships = async function(req, res){
	var select_options = ["State", "PartyAffiliation"]
	var query_json = { "Role" : "US Senator" } ;
	poly_db.retrieve_specifics_by_wildcard_and( select_options, query_json , POLITICIAN_TABLE, function(err, results){
		if (err)
			res.send(err);
		
		// Format the result
		var form_result = {};
		Object.keys(results).forEach(function(key) {
			var row = results[key];
			// If Property Doesn't exist, initialize it with empty str
			if(!form_result.hasOwnProperty(row.State))
				form_result[row.State] = "";
			form_result[row.State] += row.PartyAffiliation.toString();
		}); 
		// Send the result
		res.json(form_result);
	});
	
}

// This function pulls all information off politicians profiles and returns it to client.
// No formatting required
exports.request_state_politician_profile = async function(req, res){

	query_json = {  "State": req.query.state ,
                    "Role": req.query.role,
                    "District": req.query.district};
					
	poly_db.retrieve_by_wildcard_and(query_json, POLITICIAN_TABLE, function(err, results){
		if (err)
			res.send(err);
		res.json(results);
	});
}