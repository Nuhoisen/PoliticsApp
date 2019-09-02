var httpRequest = new XMLHttpRequest();





function acceptFile(callBack){
    if(httpRequest.readyState === XMLHttpRequest.DONE){//done
        if(httpRequest.status === 200){
            console.log("Successful Response!");
           
            callBack(httpRequest.responseText);
        }
        else{
            console.log("Error. Status:");
            console.log(httpRequest.status);
        }
    }
    else{//not done
        console.log("Not Done. Server Status:");
        console.log(httpRequest.readyState);        
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
    httpRequest.onreadystatechange = acceptFile.bind(this, callback);
    httpRequest.open('GET', profile_url +'/request_senator_profile_img?'+ args, true);
    httpRequest.send();    
}

function get_state_politician_prof_img(args, callback){
    httpRequest.onreadystatechange = acceptFile.bind(this, callback);
    httpRequest.open('GET', profile_url +'/request_state_politician_profile_img?'+ args, true);
    httpRequest.send();    
}

function get_state_politician_profile(args, callback){
    httpRequest.onreadystatechange = acceptFile.bind(this, callback);
    httpRequest.open('GET', profile_url +'/request_state_politician_profile?'+ args, true);
    httpRequest.send();    
}

function get_wildcard_search(args, callback){
    httpRequest.onreadystatechange = acceptFile.bind(this, callback);
    httpRequest.open('GET', profile_url +'/request_wildcard_match?'+ args, true);
    httpRequest.send();    
}

function get_politician_news_articles(args, callback){
    httpRequest.onreadystatechange = acceptFile.bind(this, callback);
    httpRequest.open('GET', profile_url +'/request_articles?' + args, true);
    httpRequest.send();
}

// var args = "state=Mississippi&role=US Senator&district=Mississippi US Senate";
// get_state_politician_profile(args, response_here)


// getData();

// get_prof_img()