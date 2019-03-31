var prevScrollpos = 0;
var currentScrollPos = 0;

function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var inp = document.getElementById("global-search-id");
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}



class GlobalHeader extends Header{

    // Generate template HTML
    generateHTML(){
        var self = this;
        var header_html = " <div class='global-header' id='navbar'>  \
                                <div class='global-search-container' > \
                                    <input class='global-search' id='global-search-id' type='text' placeholder='Search..' name='search'> \
                                </div> \
                                <span class='header-search-span'>\
                                    <i class='fas fa-search header-search-icon'></i> \
                                </span>\
                            </div> ";
                                
        $(".global-ui-body").append(header_html);  //decide what to apply : ui-body

        
        self.addListeners();
    }

    
    // Add all event listeners including search suggestions
    addListeners(){
        var self = this;
         d3.selectAll(".profile-page")
            .on("scroll", function(){
                currentScrollPos = this.scrollTop;
                if (prevScrollpos > currentScrollPos) {
                    document.getElementById("navbar").style.top = "0%";
                } 
                else {
                    document.getElementById("navbar").style.top = "-8%";
                }
                prevScrollpos = currentScrollPos;
            });
            
        self.addAutoCompleteListeners();
    }
    
    // Search suggestion selected event listener
    optionSelectedListener(profile){
        var self = this;
        closeAllLists();
        document.getElementById("global-search-id").value = profile["Name"];//
        
        self.creator.profile_page.loadPoliticianImage(profile);
        self.creator.toggleActivePage("news");
    }
    
    // Callback from client, generating HTML for list suggestions
    generateListSuggestions(profiles){
        var self = this;
        
        profiles = JSON.parse(profiles);
        var outter_div, item_name, item_district, item_picture_container, item_picture;
        
        var this_prompt = document.getElementById("global-search-id");
        var a, b, i, val = this_prompt.value;
        a = document.getElementById(this_prompt.id+"autocomplete-list");
        
        var start_index = 0;
        
        for (i = 0; i < profiles.length; i++) {             
            /*check if the item starts with the same letters as the text field value:*/
            var match_name = profiles[i]["Name"];
            start_index = match_name.toUpperCase().indexOf( val.toUpperCase() );
            
            if ( start_index !== -1){//profiles[i]["Name"].substr(start_index, start_index + val.length).toUpperCase() == val.toUpperCase()) {
              /*create a DIV element for each matching element:*/
              
              outter_div = document.createElement("DIV");
              outter_div.setAttribute("class", "search-item-container");
              
              item_name = document.createElement("DIV");
              item_name.setAttribute("class", "search-item-name");
              
              // item_picture_container = document.createElement("DIV");// item_picture_container.setAttribute("class", "search-item-picture-container");// item_picture = document.createElement("img");item_picture.setAttribute("class", "search-item-picture");// item_picture.setAttribute("src", profiles[i]['ImageURL']);// item_picture_container.appendChild(item_picture);
              
               /*make the matching letters bold:*/
               if(start_index==0)
               {
                    item_name.innerHTML = "<strong>" + match_name.substr(0, val.length) + "</strong>"; //profiles[i]["Name"].substr(0, val.length )
                    item_name.innerHTML +=  match_name.substr(val.length); // profiles[i]["Name"].substr(val.length);
               }else{
                    item_name.innerHTML = match_name.substr(0, start_index);//profiles[i]["Name"].substr(0, start_index);
                    item_name.innerHTML += "<strong>" + match_name.substr(start_index, val.length) + "</strong>"; //profiles[i]["Name"].substr(start_index, start_index+(val.length-1))
                    item_name.innerHTML += profiles[i]["Name"].substr(start_index+val.length);
               }
              
              /*insert a input field that will hold the current array item's value:*/
              item_name.innerHTML += "<input type='hidden' value='" + profiles[i]["Name"] + "'>";
              /*execute a function when someone clicks on the item value (DIV element):*/
                  
              outter_div.addEventListener("click", self.optionSelectedListener.bind(self, profiles[i]));
              
              item_district = document.createElement("DIV");
              item_district.setAttribute("class", "search-item-district");
              
              item_district.innerHTML = profiles[i]["District"];
              
              outter_div.appendChild(item_name);
              outter_div.appendChild(item_district);
              a.appendChild(outter_div);
            }
          }
    }
    
    
    // Function provides addAutoCompleteListeners functionality
    // to the search box. 
    addAutoCompleteListeners() {
          var self = this;
          /*the autocomplete function takes two arguments,
          the text field element and an array of possible autocompleted values:*/
          var currentFocus;
          /*execute a function when someone writes in the text field:*/
          // inp.addEventListener("input",
          d3.select("#global-search-id")
            .on("input", function(e) {
              var a, b, i, val = this.value;
              /*close any already open lists of autocompleted values*/
              closeAllLists();
              if (!val) { return false;}
              currentFocus = -1;
              /*create a DIV element that will contain the items (values):*/
              a = document.createElement("DIV");
              a.setAttribute("id", this.id + "autocomplete-list");
              a.setAttribute("class", "autocomplete-items");
              /*append the DIV element as a child of the autocomplete container:*/
              this.parentNode.appendChild(a);
              /*for each item in the array...*/
              // generateSearchSugg(arr);
              val = "query=" + val;
              get_wildcard_search(val, self.generateListSuggestions.bind(self));
          })
          .on("keydown", function() {
              var x = document.getElementById(this.id + "autocomplete-list");
              if (x) x = x.getElementsByClassName("search-item-container");
              if (d3.event.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
              } else if (d3.event.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
              } else if (d3.event.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                d3.event.preventDefault();
                if (currentFocus > -1) {
                  /*and simulate a click on the "active" item:*/
                  if (x) x[currentFocus].click();
                }
              }
          });
            /*execute a function when someone clicks in the document:*/
            document.addEventListener("click", function (e) {
                closeAllLists(e.target);
            });
          
          function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive();
            
            // reset focus
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
            
          }
          function removeActive() {
            /*a function to remove the "active" class from all autocomplete items:*/
            d3.selectAll(".search-item-container")
                .classed("autocomplete-active", false);
          }
          
      
        }

    constructor(creator){
        super(creator);
    }



}