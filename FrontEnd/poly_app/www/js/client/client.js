// var httpRequest = new XMLHttpRequest();





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



function get_senator_prof_imgs(args, callback){
	let localHttpRequest = new XMLHttpRequest();
	
    localHttpRequest.onreadystatechange = acceptFile.bind(this, callback, localHttpRequest);
    localHttpRequest.open('GET', profile_url +'/request_senator_profile_img?'+ args, true);
    localHttpRequest.send();    
}

function get_state_politician_prof_img(args, callback){
	let localHttpRequest = new XMLHttpRequest();
	
    localHttpRequest.onreadystatechange = acceptFile.bind(this, callback, localHttpRequest);
    localHttpRequest.open('GET', profile_url +'/request_state_politician_profile_img?'+ args, true);
    localHttpRequest.send();    
}

function get_state_politician_profile(args, callback){
	let localHttpRequest = new XMLHttpRequest();
    localHttpRequest.onreadystatechange = acceptFile.bind(this, callback, localHttpRequest);
    localHttpRequest.open('GET', profile_url +'/request_state_politician_profile?'+ args, true);
    localHttpRequest.send();    
}

function get_wildcard_search(args, callback){
	let localHttpRequest = new XMLHttpRequest();
	
    localHttpRequest.onreadystatechange = acceptFile.bind(this, callback, localHttpRequest);
    localHttpRequest.open('GET', profile_url +'/request_wildcard_match?'+ args, true);
    localHttpRequest.send();    
}

function get_politician_news_articles(args, callback){
	let localHttpRequest = new XMLHttpRequest();
	
    localHttpRequest.onreadystatechange = acceptFile.bind(this, callback, localHttpRequest);
    localHttpRequest.open('GET', profile_url +'/request_articles?' + args, true);
    localHttpRequest.send();
}

function get_politician_bills(args, call_Back){
	let localHttpRequest = new XMLHttpRequest();
	console.log(args);
	localHttpRequest.onreadystatechange = acceptFile.bind(this, call_Back, localHttpRequest);
	localHttpRequest.open('GET', profile_url +'/request_candidates_bills?' + args, true);
	localHttpRequest.send();	
	
}
 
// function get_state_partisanships(args, callback){
	// let localHttpRequest = new XMLHttpRequest();
	
	// localHttpRequest.onreadystatechange = acceptFile.bind(this, callback, localHttpRequest);
    // localHttpRequest.open('GET', profile_url +'/request_us_senator_partisanships?' + args, true);
    // localHttpRequest.send();
// }

function get_us_senator_partisanships(args, callback){
	let localHttpRequest = new XMLHttpRequest();
	
	localHttpRequest.onreadystatechange = acceptFile.bind(this, callback, localHttpRequest);
    localHttpRequest.open('GET', profile_url +'/request_us_senator_partisanships?' + args, true);
    localHttpRequest.send();
}


function get_state_partisanships(args, callback){
	let localHttpRequest = new XMLHttpRequest();
	
	localHttpRequest.onreadystatechange = acceptFile.bind(this, callback, localHttpRequest);
    localHttpRequest.open('GET', profile_url +'/request_state_partisanships?' + args, true);
    localHttpRequest.send();
}
