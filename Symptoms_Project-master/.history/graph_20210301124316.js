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

        var c =   Array.prototype.slice.call(cc).map(function(element) {
            console.log(element)
            return element.value;
        });
        var circleCoords =[]
    

        // for (var j=0; j<circles.length; j++) {
        //     circles[j].forEach( d => {    
        //         console.log(d) 
        //     // var cx = d.getAttribute('cx'),
        //     //     cy = d.getAttribute('cy');
        //     // circleCoords.push([cx, cy]);
        //  })
  
        // }
      
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