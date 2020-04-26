var fs = require('fs'),
	path = require('path');

// For entire us map
exports.request_map = async function( req , res ) {
	var map_name = req.params.map_name;
	
	var file_path = path.join(__dirname, map_name);
	console.log(file_path);
	
	fs.readFile(file_path, {encoding: 'utf-8'}, function(err,data){
		if (err)
			res.send(err);
		res.send(data);
	})
}

// For state districts - House of representatives
exports.request_us_house = async function( req , res ) {
	var state_id = req.params.state_id;
	
	var file_path = path.join(__dirname, "congressional_borders/"+ state_id + "/us_representatives/us-house.json");
	console.log(file_path);
	
	fs.readFile(file_path, {encoding: 'utf-8'}, function(err,data){
		if (err)
			res.send(err);
		res.send(data);
	})
}

// For state districts - State Assembly/House 
exports.request_state_house = async function( req , res ) {
	var state_id = req.params.state_id;
	var file_path = path.join(__dirname, "congressional_borders/"+ state_id + "/state_house/topo_quantize.json");
	
	fs.readFile(file_path, {encoding: 'utf-8'}, function(err,data){
		if (err)
			res.send(err);
		res.send(data);
	})
}

// For state districts - State senate 
exports.request_state_senate = async function( req , res ) {
	var state_id = req.params.state_id;
	var file_path = path.join(__dirname, "congressional_borders/"+ state_id + "/state_senate/topo_quantize.json");
	
	fs.readFile(file_path, {encoding: 'utf-8'}, function(err,data){
		if (err)
			res.send(err);
		res.send(data);
	})
}