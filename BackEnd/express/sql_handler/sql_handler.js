var mysql       = require('mysql');


class SQL_Handler{
	
	// Constructor accepts the name of the database
	// It's up to user to specify table name
	constructor(db_name="PoliticianInfo"){
		this.db_name  = db_name;
		this.db_connection = null;
	}
	
	
	// Function connects database with parameters passed
	// prior in constructor
	connect(){
		// Initiate connection w/parameters
		this.db_connection = mysql.createConnection({
              host     : 'localhost',
              user     : 'root',
              password : 'sqlPW123!',
              database : this.db_name,
			  dateStrings : true
		});
		
		// Execute connection
		this.db_connection.connect(function(err){
			if (err) throw err;
			console.log("Successfully connected to SQL server");
		});
	}
	
	
	    
    // This function just accepts a pre-formatted string query
    // and executes it 
	execute_raw_query( query_str , callback ){
		this.db_connection.query(
			query_str, 
			function(err, results, fields)
			{
				callback(err, results);
				
			}		
		);
	}
	
	// This function accepts a json object
	// where the key is the Column, and the 
	// value is the matching sql item.
	retrieve_specifics_by_wildcard_and(select_list, wildcard_json, table_name, callback) {
		
		var query_str = "SELECT " + select_list.join(", " )  + " from " +  table_name + " where ";
		
		var count = 0;
		
		// iterate through the query json , appending each specifier 
		for (var key in wildcard_json) { 
			var value = wildcard_json[key];
			var form_key = key;
			
			
			var temp  = form_key + " like '%" + value + "%'";
			
			query_str += temp;
			count +=1;
			// Check if the item is last in json object,
			// If so, terminate the query and execute
			if(count == Object.keys(wildcard_json).length){
				break;
			}
			query_str += " AND " ;
		}
		
		
		this.db_connection.query(
			query_str, 
			function(err, results, fields)
			{
				callback(err, results);	
			}		
		);
	}
	
	
	// This function accepts a json object
	// where the key is the Column, and the 
	// value is the matching sql item.
	retrieve_by_wildcard_and(wildcard_json, table_name, callback) {
		var query_str = "SELECT * from " +  table_name + " where ";
		
		var count = 0;
		// iterate through the query json , appending each specifier 
		for (var key in wildcard_json) { 
			var value = wildcard_json[key];
			var form_key = key;
			
			var temp  = form_key + " like '%" + value + "%'";
			
			query_str += temp;
			count +=1;
			// Check if the item is last in json object,
			// If so, terminate the query and execute
			if(count == Object.keys(wildcard_json).length){
				break;
			}
			query_str += " AND " ;
		}
		
		this.db_connection.query(
			query_str, 
			function(err, results, fields)
			{
				callback(err, results);
			}		
		);
	}
	
	
	
}


module.exports = {SQL_Handler: SQL_Handler};