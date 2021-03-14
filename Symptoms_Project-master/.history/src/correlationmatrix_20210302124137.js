
import * as d3 from 'd3';

class CorrelationMatrix {
  constructor(selector, width, height, data) {
    this.selector = selector;
    this.width = width;
    this.height = height;
    this.data = data;
    this.itemSize = 22;
    this.cellSize = this.itemSize - 3;
  }

  prepareData(data) {
    this.symptoms = ['nausea', 'vomit','mucus', 'breath', 'choking',  'swallow','dryMouth','teeth','speech','taste','appetite','constipation', 
    'sores','skin', 'pain','sleep', 'drowsiness', 'numbness','fatigue', 'distress','memory', 'sadness',
    'mood','enjoyment','activities', 'work', 'relations', 'walking'];
      this.symptoms = this.symptoms.reverse();
      data = data.reverse();
    this.correlationData = [];
    for (let j = 0; j < 28; j++) {
      this.correlationData.push({
        row: j,
        col: 0,
        value: parseFloat(data[j]),
      });
    }
    
  }

  init() {
    const {
      data,
      width,
      height
    } = this;
    this.margin = {
      left: 30,
      bottom: 30
    };

    this.svg = d3.select(this.selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr("viewBox", `0 0 ${width}, ${height}`)
      .attr("font-size", "1rem")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr('preserveAspectRatio', "xMidYMid meet")
      .classed('correlation', true)
      .classed('correlation-full', true);

    this.tooltip = d3.select("body")
      .append("div")
      .style("width", "40px")
      .style("height", "24px")
      .style("background", "#fee0d2")
      .style("opacity", "1")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("box-shadow", "0px 0px 6px #7861A5")
      .style("padding", "4px")
      .attr('id', 'correlation-tooltip')
      .style('border-radius', '10px');

    this.toolval = this.tooltip.append('div');

    this.prepareData(data);

    this.xScale = d3.scaleBand()
      .rangeRound([0, width - this.margin.left])
      .domain(this.symptoms);
    this.yScale = d3.scaleBand()
      .range([0, height *1.20])
      .domain(this.symptoms);
    this.colorScale = d3.scaleLinear()
      .domain([-1, 0, 1])
      .range(['#fc9272', '#fee0d2', '#de2d26']);
    this.radiusScale = d3.scaleSqrt()
      .domain([0, 1])
      .range([0, 0.5 * this.xScale.bandwidth()]);

    this.drawCells();
  }

  drawCells() {
    const cells = this.svg.append('g')
      .attr('transform', `translate(5, -270)`)
      .attr('id', 'cells')
      .selectAll('empty')
      .data(this.correlationData)
      .enter().append('g')
      .attr('class', 'cell')
      .style('pointer-events', 'all')
      .attr("transform",`scale(2, 2)`);

    cells.append('rect')
      .attr('x', d => this.xScale(this.symptoms[d.col]))
      .attr('y', d => this.yScale(this.symptoms[d.row]))
      .attr('width', d => this.xScale.bandwidth()/1.2)
      .attr('height', d => this.yScale.bandwidth())
      .attr('fill', 'none')
      .attr('stroke', 'none')
      .attr('stroke-width', '1')

    cells.append('circle')
      .attr('cx', d => this.xScale(this.symptoms[d.col]) + 0.5 * this.xScale.bandwidth())
      .attr('cy', d => this.yScale(this.symptoms[d.row]) + 0.4 * this.yScale.bandwidth())
      .attr('r', d => this.radiusScale(Math.abs(d.value))/1.)
      .style('fill', d => this.colorScale(d.value))
      .style('fill-opacity', 0.5);

    const {
      svg,
      toolval,
      tooltip,
      xScale,
      yScale,
      height,
      symptoms,
      margin
    } = this;
    svg.selectAll('g.cell')
      .on('mouseover', function (d) {
        d3.select(this)
          .select('rect')
          .attr('stroke', 'black');
        // svg.append('text')
        //   .attr('class', 'correlation-label')
        //   .attr('x', margin.left + xScale(symptoms[d.col]))
        //   .attr('y', height - margin.bottom)
        //   .text(symptoms[d.col])
        //   .attr('text-anchor', d.col <= symptoms.length / 2 ? 'start' : 'end')
        //   .style('font-size', '1em');

        // svg.append('text')
        //   .attr('class', 'correlation-label')
        //   .attr('x', -15 - yScale(symptoms[d.row]))
        //   .attr('y', margin.left - 5 )
        //   .attr('text-anchor', d.row > symptoms.length / 2 ? 'start' : 'end')
        //   .attr('dominant-baseline', 'middle')
        //   .attr('transform', 'rotate(-90)')
        //   .text(symptoms[d.row]);

        tooltip.style('visibility', 'visible')
          .style('left', `${d3.event.pageX - 20}px`)
          .style('top', `${d3.event.pageY - 20}px`);
        toolval.text(d3.format('.2f')(d.value));
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .select('rect')
          .attr('stroke', 'none');
        d3.selectAll('.correlation-label').remove();
        d3.selectAll('#correlation-tooltip')
          .style('visibility', 'hidden');
      });
    var defs = d3.select(".correlation").append("defs");
    var linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient");
    linearGradient
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", '#fc9272');
    linearGradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", '#fee0d2');
    linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", '#de2d26')

  }

  clear() {
    this.svg.select('#cells').remove();
  }

  update(data) {
    this.data = data;
    this.prepareData(this.data);
    this.drawCells();
  }
}

export default CorrelationMatrix;
