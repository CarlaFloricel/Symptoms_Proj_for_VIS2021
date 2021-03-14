import $ from 'jquery';
import * as d3 from 'd3';
import { line, stratify } from 'd3';


export async function main() {

    window.addEventListener("load", async function () {
        
        const acute_data = await d3.csv('/data/mdasi_files/acuteTopRules.csv');
        const late_data = await d3.csv('/data/mdasi_files/lateTopRules.csv');

        console.log(acute_data)
        console.log(late_data)

        var svgObject = document.getElementById('external_svg').contentDocument;
        var svg = svgObject.getElementById('internal_svg');
        var l = svg.getElementById('surface1');
        var circles = l.getElementsByClassName('graph_circle')
        var arrows = l.getElementsByClassName('graph_line')
        var containers = l.getElementsByClassName('graph_symptom_container')
        var texts = l.getElementsByClassName("graph_symptom_text")
        var cc = document.querySelectorAll(".graph_circle");
        // var x = l.getElementById("sores_symp")
                     
        // console.log(x)

        var c = Array.prototype.map.call(containers, function (el) {

            return el.id.replace("_symp", '');
        });


        c.forEach(el => {
            $(`#${el}Filter`).addClass("active")
            $(`#${el}Filter`).addClass("rule")
        })

        d3.selectAll(arrows).style('z-index', '10')
        d3.selectAll(containers).attr('z-index', '50')
        d3.selectAll(circles).attr('z-index', '100')
        d3.selectAll(circles)
            .on('mouseover', function () {
                d3.selectAll(circles).classed("focused", false)
                const id = d3.select(this)['_groups'][0][0].id.replace("rule_acute_", "")
                   const rule = acute_data.filter(d => d['rule_no'] == id )
                   const rule_lhs = rule.map(e => e["lhs"])[0]
                   const rule_rhs = rule.map(e => e["rhs"])[0]
                   const rule_support = rule.map(e => e["support"])[0]
                   const rule_confidence = rule.map(e => e["confidence"])[0]
                d3.select(this)
                    .append("title")
                    .text("Rule: " + "{ "+rule_lhs + " => "+ rule_rhs+" }" + "\n" + "Support: " + rule_support + "\n" + "Confidence: "+rule_confidence )
                d3.select(this).style("stroke", "grey")
            })
            .on('mouseout', function () {

                d3.select(this).style("stroke", "transparent")
            })
            .on("click", function(){
                d3.select(this).classed("focused", !d3.select(this).classed("focused"))
                if(d3.select(this).classed("focused")){

                   const id = d3.select(this)['_groups'][0][0].id.replace("rule_acute_", "")
                   const rule = acute_data.filter(d => d['rule_no'] == id )
                   const rule_lhs = rule.map(e => e["lhs"])[0].split(",")
                   const rule_rhs = rule.map(e => e["rhs"])[0].split(",")
                   const rule_support = rule.map(e => e["support"])[0]
                   const rule_confidence = rule.map(e => e["confidence"])[0]
                      d3.selectAll(texts).style("opacity", "0.2")
                    //  d3.selectAll(containers).style("opacity", "0.2")
                      d3.selectAll(circles).style("opacity","0.2")
                      d3.selectAll(arrows).style("opacity", "0.2")
                      d3.select(this).style("opacity", 1)

                   rule_lhs.forEach(r => {
                      const text_name= r+"_symp_text"
                      const container_name=r+"_symp"
                      const in_r = "in_"+r + " out_"+id
                      const f = l.getElementsByClassName(in_r)
                      console.log(f)
                      d3.selectAll(f).style("opacity", "1")
                   })
                   rule_rhs.forEach(r => {
                    const text_name= r+"_symp_text"
                    const container_name=r+"_symp"
                    const in_r = "in_"+id + " out_"+r
                    const f = l.getElementsByClassName(in_r)
                    console.log(f)
                    d3.selectAll(f).style("opacity", "1")
                 })
                   const t = l.getElementsByClassName("rule_acute_15")
                   d3.selectAll(t).style("opacity", "1")
                   console.log(t)

                }
                else{
                    d3.selectAll(texts).style("opacity", "1")
                    d3.selectAll(containers).style("opacity", "1")
                    d3.selectAll(circles).style("opacity", "1")
                    d3.selectAll(arrows).style("opacity", "1")
                    // const e = l.getElementsByClassName("in_sores")
                    // d3.selectAll().style("opacity", "1")
                }
                
            })

        d3.selectAll(containers).style('stroke', 'aliceblue')
            .style('opacity', '1')
            .style("cursor", "pointer")
            .on('mouseover', function (event) {
                var e = d3.select(this)['_groups'][0][0].id
                var e2 = e.replace('_acute_symp', '')
                d3.select(this).style("stroke", "red")
                $(`#${e2}-highlight`).css("opacity", "1")
                $(`#${e2}`).css("color", "#fd8d3c")

            })
            .on('mouseout', function (event) {
                var e = d3.select(this)['_groups'][0][0].id
                var e2 = e.replace('_acute_symp', '')
                $(`#${e}`).css("stroke", "aliceblue")
                $(`#${e2}-highlight`).css("opacity", "0")
                $(`#${e2}`).css("color", "black")
                d3.select(this).style("stroke", "aliceblue")

            })
        d3.selectAll(texts)
        .style('opacity', '1')
        .style("cursor", "pointer")
        .on('mouseover', function (event) {
            var e = d3.select(this)['_groups'][0][0].id
            var e2 = e.replace('_acute_text', '')
            d3.selectAll(containers).select("#dryMouth_acute_symp").style("stroke", "red")
            $(`#${e2}_acute_symp`).css("stroke", "red")
            $(`#${e2}-highlight`).css("opacity", "1")
            $(`#${e2}`).css("color", "#fd8d3c")

        })
        .on('mouseout', function (event) {
            var e = d3.select(this)['_groups'][0][0].id
            var e2 = e.replace('_acute_text', '')
            $(`#${e2}_acute_symp`).css("stroke", "aliceblue")
            $(`#${e2}-highlight`).css("opacity", "0")
            $(`#${e2}`).css("color", "black")
            // d3.select(this).style("stroke", "aliceblue")

        })

        // d3.selectAll(symptoms).style('opacity', '1')

        d3.selectAll(arrows)
            .style('stroke', '#aaaaaa')
            .style("stroke-width", '1')
            .attr('marker-end', "url(#triangle)")





        

        var svgObject2 = document.getElementById('external_svg2').contentDocument;
        var svg2 = svgObject2.getElementById('internal_svg');
        var l2 = svg2.getElementById('surface1');
        var circles2 = l2.getElementsByClassName('graph_circle')
        var symptoms2 = l2.getElementsByClassName('graph_symptom')
        var arrows2 = l2.getElementsByClassName('graph_line')
        var containers2 = l2.getElementsByClassName('graph_symptom_container')



        d3.selectAll(arrows2).style('stroke', '#aaaaaa')
            .style("stroke-width", '0.65')
            .attr('marker-end', "url(#triangle)")


        d3.selectAll(containers2).style('stroke', 'aliceblue')
            .style('opacity', '1')
            .on('mouseover', function (event) {
                var e = d3.select(this)['_groups'][0][0].id
                var e2 = e.replace('_symp', '')
                console.log(e2)
                d3.select(this).style("stroke", "red")
                $(`#${e2}-highlight`).css("opacity", "1")
                $(`#${e2}`).css("color", "#fd8d3c")
                d3.select(this).style("stroke", "aliceblue")

            })
            .on('mouseout', function (event) {
                var e = d3.select(this)['_groups'][0][0].id
                var e2 = e.replace('_symp', '')
                $(`#${e}`).css("stroke", "aliceblue")
                $(`#${e2}-highlight`).css("opacity", "0")
                $(`#${e2}`).css("color", "black")


            })

        var c2 = Array.prototype.map.call(containers2, function (el) {

            return el.id.replace("_symp", '');
        });


        c2.forEach(el => {
            $(`#${el}Filter`).addClass("rule2")
        })

        d3.selectAll(circles2).attr('z-index', '100')
        d3.selectAll(circles2)
            .on('mouseover', function () {
                d3.select(this)
                    .append("title")
                    .text("Rule: ")
                d3.select(this).style("stroke", "grey")
            })
            .on('mouseout', function () {

                d3.select(this).style("stroke", "transparent")
            })



    })




}
main();