import $ from 'jquery';
import * as d3 from 'd3';
 

var main = function() {

    window.addEventListener("load", function() {
        var svgObject = document.getElementById('external_svg').contentDocument;
        var svg = svgObject.getElementById('internal_svg');
        var l = svg.getElementById('surface1');
        var circles = l.getElementsByClassName('graph_circle')
        // e[0].style("opacity",0)
       d3.selectAll(circles).on('mouseover', function(){
           console.log("cucu")
        d3.select(this)
        .append("title")
        .text("Patient ID: " )
       })

       var symptoms = l.getElementsByClassName('graph_symptom')
       var arrows = l.getElementsByClassName('graph_arrow')
       d3.selectAll(symptoms).style('color', 'red')
    })
}
main()