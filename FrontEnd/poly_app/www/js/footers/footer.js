

class Footer{

    // All footers should have their class name applied in the generate HTML function
    // This ensures they can be removed by this class name
    removeFooter(){
        d3.selectAll("." + self.class_name).remove();
    }

    constructor(footer_class_name, creator, attr=null){
        this.creator = creator;
        this.class_name = footer_class_name;
        this.attr = attr;
    }
}