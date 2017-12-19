import { $router } from '../router';

const ANIMATION_END = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
const EFFECT_NAME = "animated fadeIn";
 
class View {
    constructor(name, elem) {
        this.name = name;
        this._active = false;
        if(elem) {
            this.el = $(elem).appendTo(".container").first();
        }
        $router.view(name, this);
    }
    
    active() {
        return this._active;
    }

    show() {
        this.el.removeClass("d-none").addClass(EFFECT_NAME).one(ANIMATION_END, () => this.el.removeClass(EFFECT_NAME) );
        $("body").addClass(this.name + "-view");
        $("body").trigger(this.name+":show");
        this._active = true;
        return this;
    }

    hide() {
        this.el.addClass("d-none");
        $("body").removeClass(this.name + "-view");
        $("body").trigger("view:hide");
        $("body").trigger(name+":hide");
        this._active = false;
        return this;
    }
}

export default View;