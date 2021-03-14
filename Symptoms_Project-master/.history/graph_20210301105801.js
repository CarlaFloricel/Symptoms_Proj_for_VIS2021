import $ from 'jquery';
import * as d3 from 'd3';

function main(){
    console.log("kaka")

    // d3.select(".graph_symptom")
    // .on('mouseover', function () {
    // //    d3.select(this)
    // //      .append("title")
    // //      .text("Symptom: " )
    // console.log("kuku")
      
    //  })

     $(`.graph_symptom`).mouseover(function(){
         console.log("lala")
     });
}

main()