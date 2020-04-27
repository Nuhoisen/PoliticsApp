// Node requires
var mysql = require('mysql');


const POLITICIAN_NEWS_TABLE = "politician_based_newsarticlestable"


exports.request_articles  = async function ( req , res ) {
	
	var raw_query = "SELECT Title as title,\
							ArticleURL as url,\
							ArticleImgURL as top_img,\
							NewsCompany as news_company \
							FROM newsarticlesdb.politician_based_newsarticlestable where Politician LIKE '%" + req.query.politician_name + "%' ORDER BY (DateAdded) DESC";
	// query_json = { "Politician" : req.query.politician_name } ;
	news_db.execute_raw_query( raw_query , function ( err, results) {
		if(err)
			res.send(err);
		
		// Format all articles
		var formatted_art_list = [];
		Object.keys(results).forEach(function(key) {
			var article_record_row = results[key];
			
			formatted_art_list.push(JSON.parse(JSON.stringify(article_record_row)));
		});
		res.send(formatted_art_list);
	} );
}
