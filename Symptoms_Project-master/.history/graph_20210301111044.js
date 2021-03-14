import $ from 'jquery';
import * as d3 from 'd3';
 

function main(){
    console.log("kaka")

    d3.select(".graph_symptom")
    .style('fill', red)
    

     $(`#graph_symptom`).on("mouseenter", function(){
         console.log("lala")
     });
}

main()