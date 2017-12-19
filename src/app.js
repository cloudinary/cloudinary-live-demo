//import 'Popper';
import 'bootstrap'; 
import 'jssocials';
import './scss/style.scss';
import { $router } from './router';
import * as VIEW from './views/view-names';
import * as main from  './js/main.js';
import { getParameterByName } from './utils/location';
 
$(".app").on("error:general", (e, msg = '', handler = false) => {
    $router.view(VIEW.VIEW_ERROR).error(msg).action();
});

$(document).ready(function() {
    $router.init(); 

    if($router.isRecorder()) {
        //$router.show(VIEW.VIEW_MAIN);
        //$router.show(VIEW.VIEW_MAIN);
        main.initJanus();
        
        $("#show-main").on("click", () => {
            $router.show("main");
        })
    
        $("#show-invite").on("click", () => {
            $router.show("main").invite(true);
        })
    
        $("#show-recorder").on("click", () => {
            $router.show("recorder");
        })
    
        $("#show-recorder-loading").on("click", () => {
            $router.show("recorder").loading(true);
        })
    
        $("#show-ended").on("click", () => {
            $router.show("ended");
        })
    
        $("#show-error").on("click", () => {
            $router.show("error").action() ;
        })
    
        $("#show-progress").on("click", () => {
            $router.show("progress").text("Test Progress View");
        })
    
        $("#show-values").on("click", () => {
            const values = $router.view("main").values();
            console.log(values);
        })

        $("#show-transformation").on("click", () => {
            const values = $router.view("main").transformation();
            console.log(values);
        })
    }
    
});

