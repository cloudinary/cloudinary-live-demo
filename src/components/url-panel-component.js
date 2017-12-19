
import Component from './component';


const elem = (options) => {
    const hidden = options.hidden ? "d-none" : "" ;

    return $(`
        <div id="${options.id}" class="p-2 mb-3 url-panel rounded ${ hidden }">
            <div class="d-flex align-items-center input-field-wrap">
                <label class="pr-3">URL</label>
                <input name="${options.name}" placeholder="${options.placeholder}" class="input-field input-field-inline border-primary text-primary" type="text"/>
            </div>
            <div class="d-flex align-items-center mt-2">
                <label class="pr-3 invisible">URL</label>
                <small>${options.info}</small>
            </div>
        </div>
    `);
}


const defaults = {
    id: "",
    name: "",
    hidden: false,
    info: "",
    placeholder: ""
}

class UrlPanelComponent extends Component {
    constructor(viewInstance, placeholderSelector, options = {} ) {
        options = Object.assign({}, defaults, options);
        const _el = elem(options);
        
        super(viewInstance, placeholderSelector, _el, options);               

        this.val = (value) => {
            if(value === "") {
                _el.addClass("d-none")
            }
            _el.find("input").val(value);
        }
    }
};

export default UrlPanelComponent;

