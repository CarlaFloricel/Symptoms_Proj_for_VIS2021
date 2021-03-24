import * as d3 from 'd3';
import { tip as d3tip } from "d3-v6-tip";
class ScatterPlot {
  drawHexagon(data) {
    return d3.line()
      .x(function (d) { return d.x; })
      .y(function (d) { return d.y; })
      .curve(d3.curveCardinalClosed.tension(0.65))(data);
  }

  constructor(selector, width, height, data, onPatientSelected) {
    this.selector = selector;
    this.width = width;
    this.height = height;
    this.data = data;
    this.onPatientSelected = onPatientSelected;
  }

  pack(data) {
    this.data = data.sort((a, b) => b.cluster - a.cluster)
    const { width, height } = this;
    const packer = d3.pack().size([width - 2, height - 2]).padding(3);
    return packer(d3.hierarchy({ children: this.data }).sum(d => {
      try {
        return parseInt(d.t_category[1])
      } catch (e) {
        return 1;
      }
    }));

  }

  init() {
    const { data, width, height } = this;
    const root = this.pack(data);
    this.colorScale = d3.scaleOrdinal()
      .domain(d3.extent(data.map(d => d.cluster)))
      .range(['#fee0d2', '#de2d26'])

    this.svg = d3.select(this.selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr("viewBox", `0 0 ${width}, ${height}`)
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr('preserveAspectRatio', "xMidYMid meet");

    this.drawLeaves(data);
  }

  transformMarginColor(r) {
    switch (r) {
      // case "CC":
      //   return '#80483b';
      // case "IC+CC":
      //   return '#d29f43';
      case "IC+Radiation alone":
        return '#058f96';
      case "IC+Radiation alone+CC":
        return 'orange';
      case "CC+Radiation alone":
        return '#4d9221';
      // case "IC":
      //   return '#e6f598'
      case "Radiation alone":
        return '#9854cc'
      default:
        return '#83aad4';
    }
  }

  transformClusterColor(r) {
    switch (r) {
      case 1:
        return '#cb181d';
      default:
        return '#fee0d2';
    }
  }



  transformRadius(r) {
    switch (r) {
      case 'T0':
        return 2;
      case 'T1':
        return 3.5;
      case 'T2':
        return 5;
      case 'T3':
        return 6.5;
      case 'T4':
        return 8;
      default:
        return 2;
    }
  }




  drawLeaves(leaves) {
    const { svg, onPatientSelected } = this;
    const minH = Math.min.apply(Math, leaves.map((o) => { return o.PC2; }))
    const maxH = Math.max.apply(Math, leaves.map((o) => { return o.PC2; }))
    const minW = Math.min.apply(Math, leaves.map((o) => { return o.PC1; }))
    const maxW = Math.max.apply(Math, leaves.map((o) => { return o.PC1; }))

    const xSc = d3.scaleLinear()
      .domain([minW, maxW])
      .range([10, this.width - 50]);

    const ySc = d3.scaleLinear()
      .domain([minH, maxH])
      .range([35, this.height - 55]);

    // var svgg = d3.select(svg);
    const tip = d3tip().attr('class', 'd3-tip').html((d) => d);
    svg.call(tip)

    const leaf = svg.selectAll("g")
      .data(leaves)
      .join("g")
      .attr("transform", d => `translate(${xSc(d.PC1)},${ySc(d.PC2)})`)
      .attr("class", "leaf")
      .attr("id", d => (`leaf-container-${d.patientId}`))
      .style('cursor', 'pointer')
      .on('mouseover', function () {
        console.log(window.selectedpatient)
        var aux_id = this['id'];
        aux_id = aux_id.replace("leaf-container-", "");
        if (!$('#show-mean-tendrils').is(":checked")) {
          $('.stackPath').css('opacity', '0.1');
          $('.circle').css('opacity', '0');
          // if(window.selectedpatient)
          // $(`.${window.selectedpatient}`).css('opacity','0.8')
          if (!$("#show-patient").is(":checked")) {
            $(`.${aux_id}`).css('stroke-width', '2.8')
              .css('opacity', '0.8');
            $(`.${aux_id}circle`).css('r', '3')
              .css('opacity', '1');
          }
          $(".sympBar").css("opacity", '0.2')
        }

        const textt = "Patient ID: " + aux_id
        tip.show(textt, this)
      })
      .on('mouseout', function () {
        tip.hide()
        $('.stackPath').css('opacity', '0.6')
        
        $('.circle').css('r', 1.5).css('stroke-width', '0.5px').css('opacity', '0.65')
        $('.tendrilsPath').css('opacity', '0.65')
          .css('stroke-width', '0.5px')
        
      })
    leaf.append("rect")
      .attr("class", "leaf-rect")
      .attr("id", d => (`leaf-rect-${d.patientId}`))
      .attr("transform", d => this.transformRadius(d.t_category) < 5 ? `translate(-${this.transformRadius(d.t_category) * 2.5},-${this.transformRadius(d.t_category) * 2.5})` : `translate(-${this.transformRadius(d.t_category) * 1.5},-${this.transformRadius(d.t_category) * 1.5})`)
      .attr("height", d => this.transformRadius(d.t_category) < 5 ? this.transformRadius(d.t_category) * 5 : this.transformRadius(d.t_category) * 3)
      .attr("width", d => this.transformRadius(d.t_category) < 5 ? this.transformRadius(d.t_category) * 5 : this.transformRadius(d.t_category) * 3)
      .attr("fill", "red")
      .attr("opacity", '0')

    leaf.append("path")
      .attr("d", d => {
        const h = (Math.sqrt(3) / 2),
          radius = this.transformRadius(d.t_category) + 1,
          xp = 0,
          yp = 0,
          hexagonData = [

            { "x": -radius * h + xp, "y": -radius / 2.0 + yp },
            { "x": radius * h + xp, "y": -radius / 2.0 + yp },
            { "x": xp, "y": radius * h + yp }


          ];
        return this.drawHexagon(hexagonData);
      })
      .attr("id", d => (`leaf-${d.patientId}`))
      .attr("class", "leaf-patient")
      .attr("fill", d => this.transformMarginColor(d.therapeutic_combination))
      .attr("fill-opacity", d => d.gender === 'Female' ? 0 : 0.8)

    leaf.append("circle")
      .attr("id", d => (`leaf-${d.patientId}`))
      .attr("class", "leaf-patient")
      .attr("r", d => this.transformRadius(d.t_category))
      .attr("fill", d => this.transformMarginColor(d.therapeutic_combination))
      .attr("fill-opacity", d => d.gender === 'Male' ? 0 : 0.8);


    // leaf.append("title")
    //   .text(d => "Patient ID: " +d.patientId);


    svg.append("text").text("Patients positioned using dimmentionality redution based on the selected clustering symptoms")
      .attr("class", "scatterPLOTTitle")
      .attr('transform', `translate(${this.width / 2},20)`)

  }

  highlight(ids) {
    if (!ids || ids.length === 0) {
      this.svg.selectAll('.leaf').style('opacity', 1);
      return;
    }
    const leaves = this.svg.selectAll('.leaf');

    leaves.style('opacity', 0.1);


    ids.forEach((id) => {
      this.svg.select(`#leaf-container-${id}`).style('opacity', 1);
    });
  }

  clear() {
    this.svg.selectAll('.leaf').remove();
    this.svg.selectAll('.scatterPLOTTitle').remove();
  }

  update(data) {
    this.data = data;
    this.drawLeaves(data);
  }
}

export default ScatterPlot;
