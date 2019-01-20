
class RegistryFlag{
    
    // Creates Registry Flag when a congressional map is created
    create(){
        this.flag = true;
        // d3.select('body')
            // .append("div")
            // .attr("class", "registry");
    }
    
    // Returns status of registry flag
    exists(){
        return this.flag;//d3.select('.registry').empty();
    }
    
    // Destroys registry flag
    destroy(){
        this.flag = false;
        //d3.select('.registry').remove();
    }
    
    constructor(){
        this.flag = false;
    }
    
}

var reg_flag = new RegistryFlag();