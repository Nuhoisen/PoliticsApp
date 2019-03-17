var prevScrollpos = 0;
var currentScrollPos = 0;





class GlobalHeader{


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

                                // <div class='global-search-container'> \
                                    // <input class='global-search' type='text' placeholder='Search..' name='search'> \
                                // </div> \
                                // <div class='global-search-submit-container'> \
                                    // <button class='global-search-submit' type='submit'><i class='fa fa-search'></i></button> \
                                // </div> \
        $(".global-ui-body").append(header_html);  //decide what to apply : ui-body

        
        self.addListeners();
    }

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
            
        var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
        self.autoComplete(document.getElementById("global-search-id"), countries);
    }
    
    
    
                
    generateListSuggestions(profiles){
        profiles = JSON.parse(profiles);
        var outter_div, item_name, item_district;
        var a, b, i, val = this.value;
        a = document.getElementById(this.id+"autocomplete-list");
        
        for (i = 0; i < profiles.length; i++) {             
            /*check if the item starts with the same letters as the text field value:*/
            if (profiles[i]["Name"].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
              /*create a DIV element for each matching element:*/
              
              
              outter_div = document.createElement("DIV");
              outter_div.setAttribute("class", "search-item-container");
              
              
              item_name = document.createElement("DIV");
              item_name.setAttribute("class", "search-item-name");
              
              
               /*make the matching letters bold:*/
              item_name.innerHTML = "<strong>" + profiles[i]["Name"].substr(0, val.length) + "</strong>";
              item_name.innerHTML += profiles[i]["Name"].substr(val.length);
              /*insert a input field that will hold the current array item's value:*/
              item_name.innerHTML += "<input type='hidden' value='" + profiles[i]["Name"] + "'>";
              /*execute a function when someone clicks on the item value (DIV element):*/
                  
              
              outter_div.addEventListener("click", function(){
                  
                  document.getElementById("global-search-id").value = this.getElementsByTagName("input")[0].value;
                  var sel_district = this.getElementsByClassName("search-item-district")[0].innerHTML;
                  console.log(sel_district);
                  /*close the list of autocompleted values,
                  (or any other open lists of autocompleted values:*/
                  closeAllLists();
                  
              })
              
              item_district = document.createElement("DIV");
              item_district.setAttribute("class", "search-item-district");
              
              
             item_district.innerHTML = profiles[i]["District"];
              
              outter_div.appendChild(item_name);
              outter_div.appendChild(item_district);
              a.appendChild(outter_div);
            }
          }
    }
    
    
    // Function provides autoComplete functionality
    // to the search box. TODO: Make a call to the Database for all 
    // callable names
    autoComplete(inp, arr) {
            var self = this;
              /*the autocomplete function takes two arguments,
              the text field element and an array of possible autocompleted values:*/
              var currentFocus;
              /*execute a function when someone writes in the text field:*/
              inp.addEventListener("input", function(e) {
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
                  get_wildcard_search(val, self.generateListSuggestions.bind(this));
              });
              
              /*execute a function presses a key on the keyboard:*/
              inp.addEventListener("keydown", function(e) {
                  var x = document.getElementById(this.id + "autocomplete-list");
                  if (x) x = x.getElementsByClassName("search-item-container");
                  if (e.keyCode == 40) {
                    /*If the arrow DOWN key is pressed,
                    increase the currentFocus variable:*/
                    currentFocus++;
                    /*and and make the current item more visible:*/
                    addActive(x);
                  } else if (e.keyCode == 38) { //up
                    /*If the arrow UP key is pressed,
                    decrease the currentFocus variable:*/
                    currentFocus--;
                    /*and and make the current item more visible:*/
                    addActive(x);
                  } else if (e.keyCode == 13) {
                    /*If the ENTER key is pressed, prevent the form from being submitted,*/
                    e.preventDefault();
                    if (currentFocus > -1) {
                      /*and simulate a click on the "active" item:*/
                      if (x) x[currentFocus].click();
                    }
                  }
              });
              function addActive(x) {
                /*a function to classify an item as "active":*/
                if (!x) return false;
                /*start by removing the "active" class on all items:*/
                removeActive(x);
                if (currentFocus >= x.length) currentFocus = 0;
                if (currentFocus < 0) currentFocus = (x.length - 1);
                /*add class "autocomplete-active":*/
                x[currentFocus].classList.add("autocomplete-active");
              }
              function removeActive(x) {
                /*a function to remove the "active" class from all autocomplete items:*/
                for (var i = 0; i < x.length; i++) {
                  x[i].classList.remove("autocomplete-active");
                }
              }
              function closeAllLists(elmnt) {
                /*close all autocomplete lists in the document,
                except the one passed as an argument:*/
                var x = document.getElementsByClassName("autocomplete-items");
                for (var i = 0; i < x.length; i++) {
                  if (elmnt != x[i] && elmnt != inp) {
                  x[i].parentNode.removeChild(x[i]);
                }
              }
            }
            /*execute a function when someone clicks in the document:*/
            document.addEventListener("click", function (e) {
                closeAllLists(e.target);
            });
        }

    constructor(creator){
        
    }



}