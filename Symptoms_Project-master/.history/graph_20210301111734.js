import $ from 'jquery';
import * as d3 from 'd3';
 

function main(){
    console.log("kaka")

    d3.select(".graph_symptom")
    .style('fill', "red")
    

     const va = document.getElementsByClassName("graph_symptom").contentDocument
     console.log(va)
}

main()