import * as d3 from 'd3';

class StarPlot {
  constructor(selector, width, height, data) {
    this.selector = selector;
    this.width = width;
    this.height = height;
    this.data = data;
  }

  init() {
    this.radialScale = d3.scaleLinear()
      .domain([0, 10])
      .range([0, this.height / 2]);
    this.colorScale = d3.scaleOrdinal()
      .domain([0, 6, 12, 18, 24, 25])
      .range(['blue', 'purple', 'green', 'skyblue', 'orange', 'red']);
    this.line = d3.line().x(d => d.x).y(d => d.y);
    this.container = d3.select(this.selector)
      .append('div')
      .style('display', 'inline-flex')
      .style('flex-direction', 'column')
      .style('justify-content', 'center')
      .style('align-items', 'center')
      .style('padding', '4px');
    this.svg = this.container
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr("viewBox", `0 -12 ${this.width}, ${this.height}`)
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr('preserveAspectRatio', "xMidYMid meet")
      .classed('starplot-svg', true);
    this.drawPlot(this.data);
  }

  angleToCoordinate(angle, value) {
    const x = Math.cos(angle) * this.radialScale(value);
    const y = Math.sin(angle) * this.radialScale(value);
    return { x: this.width / 2 + x, y: this.height / 2 - y };
  }

  getPathCoordinates(ratings) {
    const coordinates = [];
    // console.log(ratings);
    for (var i = 0; i < ratings.length; i++) {
      let rating = ratings[i];
      let angle = (Math.PI / 2) + (Math.PI * i / ratings.length);
      coordinates.push(this.angleToCoordinate(angle, rating));
    }
    return coordinates;
  }

  drawPlot(data) {
    const { timestamps, patient, symptom } = data;
    if (patient.length === 0) return;
    for (let i = 0; i < timestamps.length; i++) {
      const angle = Math.PI / 2 + 2 * Math.PI * i / timestamps.length;
      const lineCoordinate = this.angleToCoordinate(angle, 10);
      const labelCoordinate = this.angleToCoordinate(angle, 10.5);
      // if (labelCoordinate.y < 0)
      //   labelCoordinate.y = 0;
      this.svg.append('line')
        .attr('x1', this.width / 2)
        .attr('x2', lineCoordinate.x)
        .attr('y1', this.height / 2)
        .attr('y2', lineCoordinate.y)
        .attr('stroke', d => this.colorScale(timestamps[i]))
        .attr('stroke-width', 2.5);
      this.svg.append('text')
        .attr('x', labelCoordinate.x)
        .attr('y', labelCoordinate.y)
        .text(timestamps[i]);
    }

    const dataPoints = timestamps.map(ts => patient.find(p => parseInt(p.period) === ts));
    const ratings = dataPoints.map(d => d && parseInt(d[symptom]) || 0);
    const coordinates = this.getPathCoordinates(ratings);
    // console.log(coordinates);
    this.svg.append("path")
      .datum(coordinates)
      .attr("d", this.line)
      .attr("stroke-width", 3)
      .attr("stroke",  '#de2d26')
      .attr("fill",  '#de2d26')
      .attr("stroke-opacity", 1)
      .attr("opacity", 0.5);

    this.container.append("p")
      .text(symptom)
      .attr("x", this.width / 2)
      .attr("y", this.height - 18)
      .attr('text-anchor', 'middle')
      .style("font-size", "1rem")
      .style('color', 'black')
      .style('margin', 0)
      .style('display', 'inline')
      .style('margin-top', '-1rem');
  }
}

export default StarPlot;
