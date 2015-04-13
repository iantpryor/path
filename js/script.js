(function(window, document, undefined) { 
    window.onload = init;
    function init() {
        //get the canvas
        var canvas = document.getElementById("mapcanvas");
        var c = canvas.getContext("2d");
        var width = 960;
        var height = 540;
    }
    
    document.getElementById("paintbtn").onclick = paint;
    
    function paint(){
        var widthSelect = document.getElementById("width");
        width = widthSelect.options[widthSelect.selectedIndex].value;
        
        var heightSelect = document.getElementById("height");
        height = heightSelect.options[heightSelect.selectedIndex].value;
        
    }
})(window, document, undefined);
