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
        var arrows = l.getElementsByClassName('graph_line')
        var lines = l.getElementsByClassName('graph_arrow')
        var cc = document.querySelectorAll(".graph_circle");


        var c =  Array.prototype.map.call(circles, function(el) {

            return el;
        });
        var circleCoords =[]
            c.forEach( d => {        
           var  cx = d.getBoundingClientRect().x
            var cy=d.getBoundingClientRect().y
            circleCoords.push([cx, cy]);
         })

      
 

        // d3.selectAll(arrows).style('transform', 'scale(0.7')

       d3.selectAll(circles)
       .on('mouseover', function(){
        d3.select(this)
        .append("title")
        .text("Rule: " )
       })


    //    const link = d3.linkVertical()({
    //     source: circleCoords[0][0],
    //     target: circleCoords[0][1]
    //   }); 

    //    d3.selectAll(symptoms).append('rect').attr("width", function(d) {return this.parentNode.getBBox().width;})
    //    .attr("height", function(d) {return this.parentNode.getBBox().height;})
    //    .attr("transform", function() {
    //        var xq = d3.select(this.parentNode)['_groups'][0][0].getBoundingClientRect().x
    //     //    var e = xq.getBoundingClientRect().y
    //        console.log(xq)
    //    })
       
       d3.selectAll(symptoms).on('mouseover', function(){
           console.log( d3.select(this).attr("transform"))
       })

       
    //    d3.select(l)
    //    .append('line')
    //    .attr("x1",401.175781)
    //    .attr("y1", 54.71875)
    //    .attr("x2", 382.492188)
    //    .attr("y2", 43.199219)
    //    .attr('stroke', 'black')


    })
}
main()