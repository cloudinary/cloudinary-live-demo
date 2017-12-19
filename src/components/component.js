class Component {
    constructor(inspectorRoot, placeholderSelector = "body", componentElement, options = {} ) {
        let root;

        if(inspectorRoot instanceof $) {
            root = inspectorRoot;
        } else if (typeof inspectorRoot === "string") {
            root = $(inspectorRoot);
        } else {
            root = inspectorRoot.el
        }
        
        root.find(placeholderSelector).replaceWith(componentElement);
        
        this.el = () => {
            return componentElement;
        }
    }
};

export default Component;