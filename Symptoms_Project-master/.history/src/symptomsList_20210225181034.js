import * as d3 from 'd3';

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


	 	

	    this.svg = d3.select("#symptomsList")
	    		  .append('svg')
			      .attr('class', 'symptomsText')
			      .attr('viewBox', `0 0 ${width} ${height}`)
			      .attr("font-family", "sans-serif")
			      .attr('preserveAspectRatio', "xMidYMid meet")
			      .attr('width', 600)
			      .attr('height', 400)
			      .attr('z-index',100)
				  .attr('transform', `translate(-132,800)`);

		this.g = this.svg.append('g')
      			.attr('class', 'symptoms')
      			
	const n = await d3.csv('/data/mdasi_files/transaction_nodes.csv');
	const links = await d3.csv('/data/mdasi_files/transaction_liks.csv');
console.log(n)

	}


  clear() {
    d3.selectAll('.symptomsText').remove();
  }


}
  export default SymptomsList;
