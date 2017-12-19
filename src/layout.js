import { ROUTE_VIEWER, ROUTE_RECORDER} from './route-names';

const layoutRecorder = () => {
    const tpl = `
        <div class="fixed-top d-none" style="z-index: 2000;">
            <button id="show-main">MAIN</button>
            <button id="show-recorder">RECORDER</button>
            <button id="show-recorder-loading">RECORDER_LOADING</button>
            <button id="show-ended">ENDED</button>
            <button id="show-error">ERROR</button>
            <button id="show-progress">PROGRESS</button>
            <button id="show-invite">INVITE</button> 
            <button id="show-values">VALUES</button>
            <button id="show-transformation">TRANSFORMATION</button>
        </div>
        <!-- DESKTOP NAVBAR -->
        <div class="desktop-navbar-placeholder"></div>
        <!-- CONTROL BAR -->
        <div class="controlbar-placeholder"></div>
        <!-- CONTENT -->
        <div class="content-container p-0 pt-sm-5 pt-md-5 container bg-opacity">
            <div class="bg-blur"></div>
        </div>
    `;
    
    $("body").html(tpl);    
}

const layoutViewer = () => {
    const tpl = `
        <div class="desktop-navbar-placeholder d-none"></div>
        <div class="content-container pt-sm-5 pt-md-5 container bg-opacity">
            <div class="bg-blur"></div>
        </div>
    `;

    $("body").html(tpl);
}

export { layoutRecorder, layoutViewer };