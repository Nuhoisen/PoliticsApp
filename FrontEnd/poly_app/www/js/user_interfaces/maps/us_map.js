

var selected_elem = 0;
var statesFunction = function(us){    
    return us.objects.us_states;
}




class USMap extends MapTemplate {
    
    // Create function to apply zoom to countriesGroup
    zoomed(self) {
        var t = d3
            .event
            .transform;
        
        if( self.previous_scale > t.k ){
            self.removeStateSelection();
            self.previous_scale = 0;
            self.ui.removeUI();    //interface screen
        }    
        
        //save previous scale
        self.countriesGroup.attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
        self.bordersGroup.attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
    }
    
    
     
    generatePartisanList(){
        var self = this;
        var args = "role=US Senator&district_type=State";
        if (self.partisan_list){
            self.statePartisanClassifier(self.partisan_list);
        }
        else{
            args = ""
            get_state_partisanships("", self.statePartisanClassifier.bind(this));
        }   
    }
    
    statePartisanClassifier (response_text){
        var self = this;
        var response_json;
        console.log("In the child");
        self.partisan_list = response_text;
        response_json = JSON.parse(self.partisan_list);
        
        
        for (var key in response_json) {
            // self.selected_state_id =  //id;
            if(response_json[key].includes('RR')) // RED
            {
               
                d3.select("#" + key.replace(" ", "-"))
                    .style("fill", "url(#republicans)");
            }
            else if(response_json[key].includes('DD')) // BLUE
            {
                d3.select("#" + key.replace(" ", "-"))
                    .style("fill", "url(#democrats)");
            }
            else if(response_json[key].includes('DR') || response_json[key].includes('RD')) // PURPLE
            {
                d3.select("#" + key.replace(" ", "-"))
                    .style("fill", "url(#mixed)");
            }
            
        }
    }
     // Function that calculates zoom/pan limits and sets zoom to default value 
    initiateZoom() {
        var self = this;
        // Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides
        self.minZoom = Math.min($("#map-holder").width() / (self.w), $("#map-holder").height() / (self.h));
        // set max zoom to a suitable factor of this value
        self.maxZoom = 20 * self.minZoom;
        // set extent of zoom to chosen values
        // set translate extent so that panning can't cause map to move out of viewport
        self.zoom
          .scaleExtent([self.minZoom, self.maxZoom])
          .translateExtent([[0, 0], [self.w, self.h]]);
          
        // define X and Y offset for centre of map to be shown in centre of holder
        var midX = ($("#map-holder").width() - self.minZoom * self.w) / 2;
        var midY = ($("#map-holder").height() - self.minZoom * self.h) / 2;
        // change zoom transform to min zoom and centre offsets
        self.svg
            .call(self.zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(self.minZoom));
        self.previous_scale = self.minZoom;
    }
    
    selectedClickListener(d, i){
        var self = this;
        var id = self.selectedExtractID(d).split(" ").join("-");
                    self.ui.removeUI();
                    self.ui.applyUI(id);
                    self.boxZoom(self.path.bounds(d), self.path.centroid(d), 20);
                    self.applyStateSelection(id);
    }
    
    selectedExtractID(d){
        return d.properties.NAME;
    }
   
   
    constructor(class_name, creator, attr){
        super(class_name, creator, attr);
        this.ui = new StateUI("state-ui", this);
    }
    
};



   
    
    

