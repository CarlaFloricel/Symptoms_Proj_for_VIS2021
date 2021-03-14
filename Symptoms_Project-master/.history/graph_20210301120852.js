import $ from 'jquery';
import * as d3 from 'd3';
 

var main = function() {

    window.addEventListener("load", function() {
        var svgObject = document.getElementById('external_svg').contentDocument;
        var svg = svgObject.getElementById('internal_svg');
        var l = svg.getElementById('surface1');
        var e = l.getElementsByClassName('graph_circle')
        // e[0].style("opacity",0)
       var w = d3.selectAll(e).on('mouseover', function(){
           console.log("cucu")
        d3.select(this)
        .append("title")
        .text("Patient ID: " )
       })
        
      })
    }
main()