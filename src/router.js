
import MainView from './views/main-view';
import RecorderView from './views/recorder-view';
import EndedView from './views/ended-view';
import ErrorView from './views/error-view';
import ProgressView from './views/progress-view';
import ViewerView from './views/viewer-view';
import { getParameterByName } from './utils/location';
import { ROUTE_VIEWER, ROUTE_RECORDER } from './route-names';
import { layoutRecorder, layoutViewer } from './layout';
import * as VIEW from './views/view-names';

class Router {
    constructor() {
        this.route = location.pathname.indexOf("viewer.html") >= 0 ? ROUTE_VIEWER : ROUTE_RECORDER;
        this.views = {};
    }

    init() {
        if(this.isRecorder()) {
            layoutRecorder();
            new MainView();
            new RecorderView();
            new EndedView();
            new ErrorView();
            new ProgressView();
        } 
 
        if(this.isViewer()) {
            layoutViewer();
            new ErrorView();
            new ProgressView();
            new ViewerView();

            if(getParameterByName("view_id")) {
                this.show(VIEW.VIEW_VIEWER)
            } else {
                this.view(VIEW.VIEW_ERROR).error("view_id parameter is missing");
            }
            
        }
    }
  


    isRecorder() {
        return this.route === ROUTE_RECORDER;
    }

    isViewer() {
        return this.route === ROUTE_VIEWER;
    }
    
    view(name, viewInstance) {
        if(viewInstance) {
            this.views[name] = viewInstance;
        }

        return this.views[name] || false; 
    }


    show(name) {
        let viewInstance;

        $.each( this.views, (viewName, instance) => {
            if(name === viewName) {
                viewInstance = instance;
                instance.show();
            } else {
                instance.hide();
            }
        });

        return viewInstance;
    }
}

export let $router = new Router();