class StateFooter extends Footer{

    generateHTML(){
        var self = this;
        super.generateHTML();
        
        var html = "<div class='close-btn state-ui'>☰</div>\
                    <div class='vertical-menu state-ui'></div>";
        
        
    }
    
    
    
    constructor(creator){
        super(creator);
    }
}