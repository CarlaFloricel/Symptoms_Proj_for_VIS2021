import * as d3 from 'd3';
// import {swatches} from "@d3/color-legend"

class SymptomsList {
	constructor( data) {
		this.data = data;

	}

	async init() {

			this.drawSymptomsList();
	}

	async drawSymptomsList(){
	    var i = 0;
	    var j = 0;
	    const margin = {
	      left: 0,
	      right: 10,
	      top: 10,
	      bottom: 10
	    };
	    const width = 145;
	    const height = 419;
	    const colors = ['#803e3b', '#DA8A00', '#058f96', '#9854cc', '#66a61e'];

const types = [1, 2]


const color = d3.scaleOrdinal(types, d3.schemeCategory10)

	    this.svg = d3.select("#transactions")
	    		  .append('svg')
			      .attr('class', 'symptomsText')
			      .attr('viewBox', `0 0 ${width} ${height}`)
			      .attr("font-family", "sans-serif")
			      .attr('preserveAspectRatio', "xMidYMid meet")
			      .attr('width', 600)
			      .attr('height', 400)
			      .attr('z-index',100)
				  .attr('transform', `translate(-132,1000)`);

		// this.g = this.svg.append('g')
      	// 		.attr('class', 'symptoms')
      			
	const ni = await d3.csv('/data/mdasi_files/xsw.csv');
	const li = await d3.csv('/data/mdasi_files/lal.csv');

// console.log(n)
	const data = ({ni: ni,  li})
	const links = li
	const nodes = ni

  
	const simulation = d3.forceSimulation(nodes)
		.force("link", d3.forceLink(links).id(d => d.node_name))
		.force("charge", d3.forceManyBody().strength(-10))
		.force("x", d3.forceX())
		.force("y", d3.forceY());
  
  console.log(simulation)
	// const svg = d3.create("svg")
	// 	.attr("viewBox", [-width / 2, -height / 2, width, height])
	// 	.style("font", "12px sans-serif");
  
	// Per-type markers, as they don't inherit styles.
	this.svg.append("defs").selectAll("marker")
	  .data(types)
	  .join("marker")
		.attr("id", d => `arrow-${d}`)
		.attr("viewBox", "0 -5 10 10")
		.attr("refX", 15)
		.attr("refY", -0.5)
		.attr("markerWidth", 6)
		.attr("markerHeight", 6)
		.attr("orient", "auto")
	  .append("path")
		.attr("fill", 'yellow')
		.attr("d", "M0,-5L10,0L0,5");
  
	function linkArc(d) {
		const r = Math.hypot(d.target_node.x - d.source_node.x, d.target_node.y - d.source_node.y);
		return `
		  M${d.source_node.x},${d.source_node.y}
		  A${r},${r} 0 0,1 ${d.target_node.x},${d.target_node.y}
		`;
	  }

	// const   drag = simulation => {
  
	// 	function dragstarted(event, d) {
	// 	  if (!event.active) simulation.alphaTarget(0.3).restart();
	// 	  d.fx = d.x;
	// 	  d.fy = d.y;
	// 	}
		
	// 	function dragged(event, d) {
	// 	  d.fx = event.x;
	// 	  d.fy = event.y;
	// 	}
		
	// 	function dragended(event, d) {
	// 	  if (!event.active) simulation.alphaTarget(0);
	// 	  d.fx = null;
	// 	  d.fy = null;
	// 	}
		
	// 	return d3.drag()
	// 		.on("start", dragstarted)
	// 		.on("drag", dragged)
	// 		.on("end", dragended);
	//   }

	const link = this.svg.append("g")
		.attr("fill", "none")
		.attr("stroke-width", 1.5)
	  .selectAll("path")
	  .data(links)
	  .join("path")
		.attr("stroke", 'red')
		.attr("marker-end", "url(#triangle)");
  
	const node = this.svg.append("g")
		.attr("fill", "green")
		.attr("stroke-linecap", "round")
		.attr("stroke-linejoin", "round")
	  .selectAll("g")
	  .data(nodes)
	  .join("g")
		// .call(drag(simulation));
  
	node.append("circle")
		.attr("stroke", "red")
		.attr("stroke-width", 1.5)
		.attr("r", 4);
  
	node.append("text")
		.attr("x", 8)
		.attr("y", "0.31em")
		.text(d => d.node_name)
	console.log(nodes)
	//   .clone(true).lower()
	// 	.attr("fill", "blue")
	// 	.attr("stroke", "blue")
	// 	.attr("stroke-width", 3);
  
	simulation.on("tick", () => {
	  link.attr("d", linkArc);
	  node.attr("transform", d => `translate(${d.x+20},${d.y+100})`);
	});
  
	// invalidation.then(() => simulation.stop());
  
	return this.svg.node();


	}


  clear() {
    d3.selectAll('.symptomsText').remove();
  }


}
  export default SymptomsList;
