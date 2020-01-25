var httpRequest = new XMLHttpRequest();





function acceptFile(callBack, invokedRequest){
    if(invokedRequest.readyState === XMLHttpRequest.DONE){//done
        if(invokedRequest.status === 200){
            console.log("Successful Response!");
			console.log(invokedRequest.responseText);
            callBack(invokedRequest.responseText);
        }
        else{
            console.log("Error. Status:");
            console.log(invokedRequest.status);
        }
    }
    else{//not done
        console.log("Not Done. Server Status:");
        console.log(invokedRequest.readyState);        
    }
    
}

// function getData(){
    // httpRequest.onreadystatechange = acceptFile.bind(this, jsonCallback);
    // httpRequest.open('GET', url +'/request_profile_img?state=Ohio&role=US%20Senator', true);
    // httpRequest.send();    
// }


// function process_prof_img(url){
    // console.log(url)
// }

function get_senator_prof_imgs(args, callback){
    httpRequest.onreadystatechange = acceptFile.bind(this, callback, httpRequest);
    httpRequest.open('GET', profile_url +'/request_senator_profile_img?'+ args, true);
    httpRequest.send();    
}

function get_state_politician_prof_img(args, callback){
    httpRequest.onreadystatechange = acceptFile.bind(this, callback, httpRequest);
    httpRequest.open('GET', profile_url +'/request_state_politician_profile_img?'+ args, true);
    httpRequest.send();    
}

function get_state_politician_profile(args, callback){
    httpRequest.onreadystatechange = acceptFile.bind(this, callback, httpRequest);
    httpRequest.open('GET', profile_url +'/request_state_politician_profile?'+ args, true);
    httpRequest.send();    
}

function get_wildcard_search(args, callback){
    httpRequest.onreadystatechange = acceptFile.bind(this, callback, httpRequest);
    httpRequest.open('GET', profile_url +'/request_wildcard_match?'+ args, true);
    httpRequest.send();    
}

function get_politician_news_articles(args, callback){
    httpRequest.onreadystatechange = acceptFile.bind(this, callback, httpRequest);
    httpRequest.open('GET', profile_url +'/request_articles?' + args, true);
    httpRequest.send();
}

function get_politician_bills(args, call_Back){
	let localHttpRequest = new XMLHttpRequest();
	
	localHttpRequest.onreadystatechange = acceptFile.bind(this, call_Back, localHttpRequest);
	// function(callBack){
		// if(localHttpRequest.readyState === XMLHttpRequest.DONE){//done
			// if(localHttpRequest.status === 200){
				// console.log("Successful Response!");
				// console.log(localHttpRequest.responseText);
				// callBack(localHttpRequest.responseText);
			// }
			// else{
				// console.log("Error. Status:");
				// console.log(localHttpRequest.status);
			// }
		// }
		// else{//not done
			// console.log("Not Done. Server Status:");
			// console.log(localHttpRequest.readyState);        
		// }
	// }.bind(this, call_Back)
	//acceptFile.bind(this, callback);
	
	
	
	localHttpRequest.open('GET', profile_url +'/request_candidates_bills?' + args, true);
	localHttpRequest.send();	
	
}

function get_state_partisanships(args, callback){
	httpRequest.onreadystatechange = acceptFile.bind(this, callback, httpRequest);
    httpRequest.open('GET', profile_url +'/request_state_partisanships?' + args, true);
    httpRequest.send();
}

// var args = "state=Mississippi&role=US Senator&district=Mississippi US Senate";
// get_state_politician_profile(args, response_here)


// getData();

// get_prof_img()