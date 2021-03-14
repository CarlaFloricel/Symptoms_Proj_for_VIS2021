import $ from 'jquery';
import * as d3 from 'd3';
 

var main = function() {

    window.addEventListener("load", function() {
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
               
            var cx = offset(c)
            console.log(cx) 
            //     cy = d.getAttribute('cy');
            // circleCoords.push([cx, cy]);
         })
  
        
      
       console.log(c)

        d3.selectAll(arrows).style('opacity', '0')

       d3.selectAll(circles)
       .on('mouseover', function(){
           console.log("cucu")
        d3.select(this)
        .append("title")
        .text("Patient ID: " )
       })


       
       d3.selectAll(symptoms).append('rect')
       
       .attr('x', 0)
       .attr('width', "100%")
       .attr('height', "100%")
       .attr('fill', 'red')

      
       

    })
}
main()