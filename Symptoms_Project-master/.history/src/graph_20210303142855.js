import $ from 'jquery';
import * as d3 from 'd3';
import { line } from 'd3';
 

export function main() {

   
        function offset(el) {
            var rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
        }


       
        var svgObject = document.getElementById('scatterplot2')
        //  var svg = svgObject.getElementById('external_svg2');
        console.log(svgObject)
        // var l = svg.getElementById('surface1');
       
    //     var circles = l.getElementsByClassName('graph_circle')
    //     var symptoms = l.getElementsByClassName('graph_symptom')
    //     var arrows = l.getElementsByClassName('graph_line')
    //     var lines = l.getElementsByClassName('graph_arrow')
    //     console.log(arrows)
    //     var containers = l.getElementsByClassName('graph_symptom_container')
    //     var cc = document.querySelectorAll(".graph_circle");


    //     var c =  Array.prototype.map.call(containers, function(el) {

    //         return el.id.replace("_symp", '');
    //     });


    //     c.forEach(el => {
    //         $(`#${el}Filter`).addClass("active")
    //         $(`#${el}Filter`).addClass("rule")
    //     })

      
    //         d3.selectAll(arrows).style('z-index', '10')
    //         d3.selectAll(containers).attr('z-index', '100')
    //         d3.selectAll(circles).attr('z-index', '100')
 

    //    d3.selectAll(circles)
    //    .on('mouseover', function(){
    //     d3.select(this)
    //     .append("title")
    //     .text("Rule: " )
    //     d3.select(this).style("stroke","grey")
    //    })
    //    .on('mouseout', function(){

    //     d3.select(this).style("stroke","transparent")
    //    })

    //    d3.selectAll(containers).style('stroke', 'aliceblue')
    //    .style('fill', 'aliceblue')
    //    .style('opacity', '1')
    //    .on('mouseover', function(event){
    //        var e = d3.select(this)['_groups'][0][0].id
    //        var e2 = e.replace('_symp', '')
    //        d3.select(this).style("stroke","red")
    //        $(`#${e2}-highlight`).css("opacity","1")
    //        $(`#${e2}`).css("color","#fd8d3c")
           
    //    })
    //    .on('mouseout', function(event){
    //     var e = d3.select(this)['_groups'][0][0].id
    //     var e2 = e.replace('_symp', '')
    //     $(`#${e}`).css("stroke","aliceblue")
    //     $(`#${e2}-highlight`).css("opacity","0")
    //     $(`#${e2}`).css("color","black")
    //     d3.select(this).style("stroke","aliceblue")
        
    // })

    //    d3.selectAll(symptoms).style('opacity', '1')
       
    //    d3.selectAll(arrows)
    //    .style('stroke', '#aaaaaa')
    //    .style("stroke-width", '1')
    //    .attr('marker-end', "url(#triangle)")

}
main();