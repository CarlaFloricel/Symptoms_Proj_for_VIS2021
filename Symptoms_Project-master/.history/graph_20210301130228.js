import $ from 'jquery';
import * as d3 from 'd3';
import { line } from 'd3';
 

var main = function() {

    window.addEventListener("load", function() {

        function offset(el) {
            var rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
        }

        var svgObject = document.getElementById('external_svg').contentDocument;
        var svg = svgObject.getElementById('internal_svg');
        var l = svg.getElementById('surface1');
        var circles = l.getElementsByClassName('graph_circle')
        var symptoms = l.getElementsByClassName('graph_symptom')
        var arrows = l.getElementsByClassName('graph_arrow')
        var cc = document.querySelectorAll(".graph_circle");
        console.log(cc)

        var c =  Array.prototype.map.call(circles, function(el) {

            return el;
        });
        var circleCoords =[]
    

       
            c.forEach( d => {    
               
           var  cx = d.getBoundingClientRect().x
            var cy=d.getBoundingClientRect().y
            
            circleCoords.push([cx, cy]);
         })
  
        console.log(circleCoords)
      
 

        d3.selectAll(arrows).style('opacity', '0')

       d3.selectAll(circles)
       .on('mouseover', function(){
           console.log("cucu")
        d3.select(this)
        .append("title")
        .text("Patient ID: " )
       })


       
       d3.selectAll(symptoms)
       
  
       var line d3.l.line()

       l.append('path')
       .attr({'d': line(circleCoords)})
      
       

    })
}
main()