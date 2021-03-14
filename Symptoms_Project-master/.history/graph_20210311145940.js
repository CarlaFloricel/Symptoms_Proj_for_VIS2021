import $ from 'jquery';
import * as d3 from 'd3';
import { line, stratify } from 'd3';
import { tip as d3tip } from "d3-v6-tip";


export async function main() {

    window.addEventListener("load", async function () {

        const acute_data = await d3.csv('/data/mdasi_files/acuteTopRules.csv');
        const late_data = await d3.csv('/data/mdasi_files/lateTopRules.csv');


        // var svgObject = document.getElementById('external_svg')
        var svg = document.getElementById('internal_svg');
        var l = svg.getElementById('surface1');
        var circles = l.getElementsByClassName('graph_circle')
        var arrows = l.getElementsByClassName('graph_line')
        var containers = l.getElementsByClassName('graph_symptom_container')
        var texts = l.getElementsByClassName("graph_symptom_text")
        var cc = document.querySelectorAll(".graph_circle");

        var svgg = d3.select(svg);
        const tip = d3tip().attr('class', 'd3-tip').html((d)=> d);
        svgg.call(tip)
        var la = d3.selectAll(circles)
        la.on("mouseout", tip.hide)
        d3.selectAll(arrows).style('z-index', '10')
        d3.selectAll(containers).attr('z-index', '50')
        d3.selectAll(circles).attr('z-index', '100')


        
        d3.selectAll(circles)
            .on('mouseover', function () {
                
                // d3.selectAll(circles).classed("focused", false)
                const id = d3.select(this)['_groups'][0][0].id.replace("rule_acute_", "")
                const rule = acute_data.filter(d => d['rule_no'] == id)
                const rule_lhs = rule.map(e => e["lhs"])[0]
                const rule_rhs = rule.map(e => e["rhs"])[0]
                const rule_support = rule.map(e => e["support"])[0]
                const rule_confidence = rule.map(e => e["lift"])[0]
                var texttt = "Rule "+id+": " + "{ " + rule_lhs + " => " + rule_rhs + " }" + "<br />" + "Support: " + rule_support + "<br />" + "Confidence: " + rule_confidence
                tip.show(texttt, this)
                // d3.select(this)
                //     .append("title")
                //     .text("Rule "+id+": " + "{ " + rule_lhs + " => " + rule_rhs + " }" + "\n" + "Support: " + rule_support + "\n" + "Confidence: " + rule_confidence)
                d3.select(this).style("stroke", "grey")
            })
            .on('mouseout', function (d) {
                d3.select(this).style("stroke", "transparent")
                d3.select(".d3-tip")
                .transition()
                  .delay(100)
                  .duration(600)
                  .style("opacity",0)
                  .style('pointer-events', 'none')
                });
                // tip.show(null, this)
            
            .on("click", function () {
                d3.select(this).classed("focused", !d3.select(this).classed("focused"))
                if (d3.select(this).classed("focused")) {

                    const id = d3.select(this)['_groups'][0][0].id.replace("rule_acute_", "")
                    const rule = acute_data.filter(d => d['rule_no'] == id)
                    const rule_lhs = rule.map(e => e["lhs"])[0].split(",")
                    const rule_rhs = rule.map(e => e["rhs"])[0].split(",")
                    const rule_support = rule.map(e => e["support"])[0]
                    const rule_confidence = rule.map(e => e["lift"])[0]
                    d3.selectAll(texts).style("opacity", "0.1")
                    d3.selectAll(circles).style("opacity", "0.1")
                    d3.selectAll(arrows).style("opacity", "0.1")
                    var texttt = "Rule "+id+": " + "{ " + rule_lhs + " => " + rule_rhs + " }" + "<br />" + "Support: " + rule_support + "<br />" + "Confidence: " + rule_confidence

                    d3.select(this).style("opacity", 1)
                    rule_rhs.forEach(r2 => {
                        const text_name2 = r2 + "_acute_text"
                        const out_r = "in_" + r2 + " out_" + id
                        const f = l.getElementsByClassName(out_r)
                        $(`#${text_name2}`).css("opacity", "1")
                        d3.selectAll(f).style("opacity", "1").style("stroke", 'orange')
                    })
                    rule_lhs.forEach(r => {
                        const text_name = r + "_acute_text"
                        const container_name = r + "_acute_symp"
                        const in_r = "in_" + id + " out_" + r
                        
                        const f = l.getElementsByClassName(in_r)
                        console.log(f)
                        d3.selectAll(f).style("opacity", "1").style("stroke", 'blue')
                        $(`#${text_name}`).css("opacity", "1")
                    })



                }
                else {
               
                    d3.selectAll(texts).style("opacity", "1")
                    d3.selectAll(containers).style("opacity", "1")
                    d3.selectAll(circles).style("opacity", "1")
                    // d3.selectAll(containers).style("opacity", "1")
                    d3.selectAll(arrows).style("opacity", "1").style("stroke", "#aaaaaa")
                }

            })

        d3.selectAll(containers).style('stroke', 'aliceblue')
            .style('opacity', '1')
            .style("cursor", "pointer")
            .on('mouseover', function (event) {
                var e = d3.select(this)['_groups'][0][0].id
                var e2 = e.replace('_acute_symp', '')
                d3.select(this).style("stroke", "#aaaaaa")
                $(`#${e2}-highlight`).css("opacity", "1")
                $(`#${e2}`).css("color", "#fd8d3c")

            })
            .on('mouseout', function (event) {
                var e = d3.select(this)['_groups'][0][0].id
                var e2 = e.replace('_acute_symp', '')
                
                if (! $(`#${e2}_acute_text`).hasClass("focused")){
                    
                $(`#${e}`).css("stroke", "aliceblue")
                $(`#${e2}-highlight`).css("opacity", "0")
                $(`#${e2}`).css("color", "black")
                d3.select(this).style("stroke", "trasparent")
                }
            })
        d3.selectAll(texts)
            .style('opacity', '1')
            .style("cursor", "pointer")
            .on('mouseover', function (event) {
                var e = d3.select(this)['_groups'][0][0].id
                var e2 = e.replace('_acute_text', '')
                $(`#${e2}_acute_symp`).css("stroke", "#aaaaaa")
                $(`#${e2}-highlight`).css("opacity", "1")
                $(`#${e2}`).css("color", "#fd8d3c")

            })
            .on('mouseout', function (event) {
                var e = d3.select(this)['_groups'][0][0].id
                var e2 = e.replace('_acute_text', '')
                if (!d3.select(this).classed("focused")){
                    $(`#${e2}_acute_symp`).css("stroke", "transparent")
                    $(`#${e2}-highlight`).css("opacity", "0")
                    $(`#${e2}`).css("color", "black")
                }


            })
            .on("click", function () {
                d3.select(this).classed("focused", !d3.select(this).classed("focused"))
                if (d3.select(this).classed("focused")) {
                    d3.selectAll(texts).style("opacity", "0.1")
                    d3.selectAll(circles).style("opacity", "0.1")
                    d3.selectAll(arrows).style("opacity", "0.1")
                    d3.select(this).style("opacity", 1)
                    
                    const id = d3.select(this)['_groups'][0][0].id.replace("_acute_text", "")
                    const rules = acute_data.filter(d => d['lhs'].includes(id) || d['rhs'].includes(id))
                    $(`#${id}-highlight`).css("opacity", "1")
                    $(`#${id}_acute_symp`).css("stroke", "#aaaaaa")
                    rules.forEach(r => {
                        const rule_no = r['rule_no']

                        const rule_lhs = r['lhs'].split(',')
                        const rule_rhs = r['rhs'].split(',')
                        $(`#rule_acute_${rule_no}`).css("opacity", "1")
                        $(`.in_${rule_no}`).css("opacity", "1")
                        $(`.out_${rule_no}`).css("opacity", "1")
                        rule_lhs.forEach(el => [
                            $(`#${el}_acute_text`).css("opacity", "1")
                        ])
                        rule_rhs.forEach(ell => [
                            $(`#${ell}_acute_text`).css("opacity", "1")
                        ])
                    })


                }
                else {
                    d3.selectAll(texts).style("opacity", "1")
                    d3.selectAll(containers).style("opacity", "1").style('stroke', 'aliceblue')
                    d3.selectAll(circles).style("opacity", "1")
                    d3.selectAll(arrows).style("opacity", "1")

                }

            })

        d3.selectAll(arrows)
            .style('stroke', '#aaaaaa')
            .style("stroke-width", '1')
            .attr('marker-end', "url(#triangle)")






        // var svgObject2 = document.getElementById('external_svg2').contentDocument;
        var svg2 = document.getElementById('internal_svg2');
        var l2 = svg2.getElementById('surface2');
        var circles2 = l2.getElementsByClassName('graph_circle')
        var arrows2 = l2.getElementsByClassName('graph_line')
        var containers2 = l2.getElementsByClassName('graph_symptom_container')
        var texts2 = l2.getElementsByClassName("graph_symptom_text")


        d3.selectAll(arrows2).style('stroke', '#aaaaaa')
            .style("stroke-width", '0.65')
            .attr('marker-end', "url(#triangle2)")


        d3.selectAll(containers2).style('stroke', 'aliceblue')

            .style('opacity', '1')
            .style("cursor", "pointer")
            .on('mouseover', function (event) {
                var e = d3.select(this)['_groups'][0][0].id
                var e2 = e.replace('_late_symp', '')
                d3.select(this).style("stroke", "#aaaaaa")
                $(`#${e2}-highlight`).css("opacity", "1")
                $(`#${e2}`).css("color", "#fd8d3c")

            })
            .on('mouseout', function (event) {
                var e = d3.select(this)['_groups'][0][0].id
                var e2 = e.replace('_late_symp', '')
                if (! $(`#${e2}_late_text`).hasClass("focused")){
                $(`#${e}`).css("stroke", "aliceblue")
                $(`#${e2}-highlight`).css("opacity", "0")
                $(`#${e2}`).css("color", "black")
                d3.select(this).style("stroke", "transparent")
                }
            })
        d3.selectAll(texts2)
            .style('opacity', '1')
            .style("cursor", "pointer")
            .on('mouseover', function (event) {
                var e = d3.select(this)['_groups'][0][0].id
                var e2 = e.replace('_late_text', '')

                $(`#${e2}_late_symp`).css("stroke", "#aaaaaa")
                $(`#${e2}-highlight`).css("opacity", "1")
                $(`#${e2}`).css("color", "#fd8d3c")

            })
            .on('mouseout', function (event) {
                var e = d3.select(this)['_groups'][0][0].id
                var e2 = e.replace('_late_text', '')
                if (!d3.select(this).classed("focused")){
                $(`#${e2}_late_symp`).css("stroke", "transparent")
                $(`#${e2}-highlight`).css("opacity", "0")
                $(`#${e2}`).css("color", "black")
                }
            })
            .on("click", function () {
                d3.select(this).classed("focused", !d3.select(this).classed("focused"))
                if (d3.select(this).classed("focused")) {
                    d3.selectAll(texts2).style("opacity", "0.1")
                    d3.selectAll(circles2).style("opacity", "0.1")
                    d3.selectAll(arrows2).style("opacity", "0.1")
                    d3.select(this).style("opacity", 1)

                    const id = d3.select(this)['_groups'][0][0].id.replace("_late_text", "")
                    const rules = late_data.filter(d => d['lhs'].includes(id) || d['rhs'].includes(id))
                    $(`#${id}-highlight`).css("opacity", "1")
                    $(`#${id}_late_symp`).css("stroke", "#aaaaaa")
                    rules.forEach(r => {
                        const rule_no = r['rule_no']
                        const rule_lhs = r['lhs'].split(',')
                        const rule_rhs = r['rhs'].split(',')
                        $(`#rule_late_${rule_no}`).css("opacity", "1")
                        $(`.in2_${rule_no}`).css("opacity", "1")
                        $(`.out2_${rule_no}`).css("opacity", "1")
                        rule_lhs.forEach(el => [
                            $(`#${el}_late_text`).css("opacity", "1")
                        ])
                        rule_rhs.forEach(ell => [
                            $(`#${ell}_late_text`).css("opacity", "1")
                        ])
                    })


                }
                else {
                    d3.selectAll(texts2).style("opacity", "1")
                    d3.selectAll(containers2).style("opacity", "1").style('stroke', 'aliceblue')
                    d3.selectAll(circles2).style("opacity", "1")
                    d3.selectAll(arrows2).style("opacity", "1")

                }

            })


        d3.selectAll(circles2).attr('z-index', '100')
        .on('mouseover', function () {
            // d3.selectAll(circles2).classed("focused", false)
            const id = d3.select(this)['_groups'][0][0].id.replace("rule_late_", "")
            const rule = late_data.filter(d => d['rule_no'] == id)
            const rule_lhs = rule.map(e => e["lhs"])[0]
            const rule_rhs = rule.map(e => e["rhs"])[0]
            const rule_support = rule.map(e => e["support"])[0]
            const rule_confidence = rule.map(e => e["lift"])[0]
            const texttt = "Rule " + id+ ": " + "{ " + rule_lhs + " => " + rule_rhs + " }" + "<br />" + "Support: " + rule_support + "<br />" + "Confidence: " + rule_confidence
            tip.show(texttt, this)
            // d3.select(this)
            //     .append("title")
            //     .text("Rule " + id+ ": " + "{ " + rule_lhs + " => " + rule_rhs + " }" + "\n" + "Support: " + rule_support + "\n" + "Confidence: " + rule_confidence)
            d3.select(this).style("stroke", "grey")
        })
        .on('mouseout', function () {
            tip.show(null, this)
            d3.select(this).style("stroke", "transparent")
        })
        .on("click", function () {
            d3.select(this).classed("focused", !d3.select(this).classed("focused"))
            if (d3.select(this).classed("focused")) {

                const id = d3.select(this)['_groups'][0][0].id.replace("rule_late_", "")
                const rule = late_data.filter(d => d['rule_no'] == id)
                const rule_lhs = rule.map(e => e["lhs"])[0].split(",")
                const rule_rhs = rule.map(e => e["rhs"])[0].split(",")
                const rule_support = rule.map(e => e["support"])[0]
                const rule_confidence = rule.map(e => e["lift"])[0]
                d3.selectAll(texts2).style("opacity", "0.1")
                d3.selectAll(circles2).style("opacity", "0.1")
                d3.selectAll(arrows2).style("opacity", "0.1")
                // d3.selectAll(containers).style("opacity", "0.1")
                d3.select(this).style("opacity", 1)

            
                rule_rhs.forEach(r2 => {
                    const text_name2 = r2 + "_late_text"
                    const out_r = "out2_" + id + ".in2_" + r2
                    $(`#${text_name2}`).css("opacity", "1")
                    $(`.${out_r}`).css("opacity", "1").css("stroke", 'orange').css("stroke-width", '0.75')

                })
                rule_lhs.forEach(r => {
                    console.log(r)
                    const text_name = r + "_late_text"
                    const container_name = r + "_late_symp"
                    const in_r = "out2_" + r + ".in2_" + id
                    console.log(in_r)
                    $(`.${in_r}`).css("opacity", "1").css("stroke", 'blue').css("stroke-width", '0.75')
                    $(`#${text_name}`).css("opacity", "1")
                })



            }
            else {
                d3.selectAll(texts2).style("opacity", "1")
                d3.selectAll(containers2).style("opacity", "1")
                d3.selectAll(circles2).style("opacity", "1")
                d3.selectAll(arrows2).style("opacity", "1").style("stroke", "#aaaaaa").style("stroke-width", '0.65')
            }

        })

        
    var c2 = Array.prototype.map.call(containers2, function (el) {

        return el.id.replace("_late_symp", '');
    });


    c2.forEach(el => {
        $(`#${el}Filter`).addClass("rule2")
    })



    var c = Array.prototype.map.call(containers, function (el) {

        return el.id.replace("_acute_symp", '');
    });


    c.forEach(el => {
        $(`#${el}Filter`).addClass("rule")
    }) 
    })


   var labesl = ["1", "2", "3", "4", "5"]

   

}
main();