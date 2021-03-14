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
        console.log(arrows)
        var containers = l.getElementsByClassName('graph_symptom_container')
        var cc = document.querySelectorAll(".graph_circle");


        var c =  Array.prototype.map.call(containers, function(el) {

            return el.id.replace("_symp", '');
        });


        c.forEach(el => {
            $(`#${el}Filter`).addClass("active")
            $(`#${el}Filter`).addClass("rule")
        })
        // var circleCoords =[]
        //     c.forEach( d => {        
        //    var  cx = d.getBoundingClientRect().x
        //     var cy=d.getBoundingClientRect().y
        //     circleCoords.push([cx, cy]);
        //  })

      
            d3.selectAll(arrows).style('z-index', '10')
            d3.selectAll(containers).attr('z-index', '100')
            d3.selectAll(circles).attr('z-index', '100')
 

        // d3.selectAll(arrows).style('transform', 'scale(0.7')

       d3.selectAll(circles)
       .on('mouseover', function(){
        d3.select(this)
        .append("title")
        .text("Rule: " )
        d3.select(this).style("stroke","grey")
       })
       .on('mouseout', function(){

        d3.select(this).style("stroke","transparent")
       })

       d3.selectAll(containers).style('stroke', 'aliceblue')
       .style('fill', 'aliceblue')
       .style('opacity', '1')
       .on('mouseover', function(event){
           var e = d3.select(this)['_groups'][0][0].id
           var e2 = e.replace('_symp', '')
           d3.select(this).style("stroke","red")
           $(`#${e2}-highlight`).css("opacity","1")
           $(`#${e2}`).css("color","#fd8d3c")
           
       })
       .on('mouseout', function(event){
        var e = d3.select(this)['_groups'][0][0].id
        var e2 = e.replace('_symp', '')
        $(`#${e}`).css("stroke","aliceblue")
        $(`#${e2}-highlight`).css("opacity","0")
        $(`#${e2}`).css("color","black")
        d3.select(this).style("stroke","aliceblue")
        
    })

       d3.selectAll(symptoms).style('opacity', '1')
       
       d3.selectAll(arrows)
       .style('stroke', '#aaaaaa')
       .style("stroke-width", '1')
       .attr('marker-end', "url(#triangle)")
    //    .style('transform', 'translate(-5,-5),scale(0.95)')
       

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
       
    //    d3.selectAll(symptoms).on('mouseover', function(){
    //        console.log( d3.select(this).attr("transform"))
    //    })

       
    //    d3.selectAll(containers).attr('opacity', '0')


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