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

        var c =   d3.selectAll(circles)
        var circleCoords =[]

       c.array.forEach(d => {
        for ( i = 0; i < d.length; i++ ) {
            var cx = d3.select(d[i]).attr('cx'),
                cy = d3.select(d[i]).attr('cy');
  
            circleCoords.push([cx, cy]);
        }
       })

        d3.selectAll(arrows).style('opacity', '0')

       d3.selectAll(circles)
       .on('mouseover', function(){
           console.log("cucu")
        d3.select(this)
        .append("title")
        .text("Patient ID: " )
       })


       
       d3.selectAll(symptoms).append('rect')
       
       .attr('x', d3.select(this).attr('x'))
       .attr('width', "100%")
       .attr('height', "100%")
       .attr('fill', 'red')

      
       

    })
}
main()