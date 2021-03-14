import $ from 'jquery';
import * as d3 from 'd3';
 

var main = function() {

    window.addEventListener("load", function() {
        var svgObject = document.getElementById('external_svg').contentDocument;
        var svg = svgObject.getElementById('internal_svg');
        var l = svg.getElementById('surface1');
        var e = l.getElementsByClassName('graph_symptom')
        // e[0].style("opacity",0)
       var w = d3.select(l).attr('opacity','0')
        
      })
    }
main()