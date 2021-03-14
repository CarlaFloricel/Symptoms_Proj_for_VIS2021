import * as d3 from 'd3';

class SymptomsList {
	constructor( data) {
		this.data = data;

	}

	init() {

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
			      .attr('width', 145)
			      .attr('height', 419)
			      .attr('z-index',100)

		this.g = this.svg.append('g')
      			.attr('class', 'symptoms')
      			.attr('transform', `translate(-132,950)`);


	}


  clear() {
    d3.selectAll('.symptomsText').remove();
  }


}
  export default SymptomsList;
