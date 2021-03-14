import * as d3 from 'd3';

class SymptomsList {
	constructor( symptoms, selectedSymptoms, patients) {
		this.symptoms = symptoms;
		this.selectedSymptoms = selectedSymptoms;
		this.patients = patients;
	}

	init() {

	// 	if(!this.patients || this.patients.length < 1)
	// 		this.drawSymptomsList(this.symptoms, this.selectedSymptoms, []);
	// 	else
	// 		this.drawSymptomsList(this.symptoms, this.selectedSymptoms, this.patients);
	// }

	// async drawSymptomsList(symptoms, selectedSymptoms, patients){
	//     var i = 0;
	//     var j = 0;
	//     const margin = {
	//       left: 0,
	//       right: 10,
	//       top: 10,
	//       bottom: 10
	//     };
	//     const width = 145;
	//     const height = 419;
	//     const colors = ['#803e3b', '#DA8A00', '#058f96', '#9854cc', '#66a61e'];


	//  	function transformText(p,i) {
	 
	//  		if (!patients || patients.length <1) {
	//  			return "black";
	//  		}
	//     	else 
	//     		if(selectedSymptoms.includes(p)){
	//     			for(j = 0; j < selectedSymptoms.length; j++){
	//     				if (selectedSymptoms[j] == p)
	//     					return colors[j];
	//     			}
	        		
	//     		}
	//       		else
	//         		return "black";
	//     }

	//     function transformRectangle(p,i) {
	 
	//  		if (!patients || patients.length <1) {
	//  			return '#e0e6ec70';
	//  		}
	//     	else 
	//     		if(selectedSymptoms.includes(p)){
	//     			for(j = 0; j < selectedSymptoms.length; j++){
	//     				if (selectedSymptoms[j] == p)
	//     					return colors[j];
	//     			}
	        		
	//     		}
	//       		else
	//         		return '#e0e6ec70';
	//     }

	//     function transformRectangleopacity(p) {
	 
	//  		if (!patients || patients.length <1) {
	//  			return '1';
	//  		}
	//     	else 
	//     		if(selectedSymptoms.includes(p)){
	//     			for(j = 0; j < selectedSymptoms.length; j++){
	//     				if (selectedSymptoms[j] == p)
	//     					return '0.15';
	//     			}
	        		
	//     		}
	//       		else
	//         		return '1';
	//     }

	//     this.svg = d3.select("#symptomsText")
	//     		  .append('svg')
	// 		      .attr('class', 'symptomsText')
	// 		      .attr('viewBox', `0 0 ${width} ${height}`)
	// 		      .attr("font-family", "sans-serif")
	// 		      .attr('preserveAspectRatio', "xMidYMid meet")
	// 		      .attr('width', 145)
	// 		      .attr('height', 419)
	// 		      .attr('z-index',100)

	// 	this.g = this.svg.append('g')
 //      			.attr('class', 'symptoms')
 //      			.attr('transform', `translate(-132,50)`);


	// 	for (i = 0; i < symptoms.length; i++) {


 //           this.g.append('rect')
	// 	    .attr('class', 'symptomBackground')
	// 	    .attr('x', 132)
	// 	    .attr('id', symptoms[i])
	// 	    .attr('y', height - 70 - 14.5 * i)
	// 	    .attr('width', '144px')
	// 	    .attr('height','11px')
	// 	    .attr('fill', transformRectangle(symptoms[i],i))
	// 	    .attr('opacity',transformRectangleopacity(symptoms[i]))
	// 	    .attr('rx','8px')
		

	// 	  this.g.append('text')
	// 	    .attr('class', 'symptomText')
	// 	    .attr('id',symptoms[i])
	// 	    .attr('x', 135)
	// 	    .attr('y', height - 60 - 14.5 * i)
	// 	    .attr('color', 'black')
	// 	    .attr('font-size','0.8rem')
	// 	    .text(symptoms[i])
	// 	    .style("cursor", "pointer")
	// 	    .style("fill", transformText(this.symptoms[i],i))
	// 	    .on('mouseover', function (d) {
 //           	 d3.select(this)
 //              	.attr('font-size', "0.9rem")})
 //            .on('mouseout', function () {
 //            	d3.select(this)
 //              	.attr('font-size', "0.8rem");
 //          })
	// 	}
	}


  clear() {
    d3.selectAll('.symptomsText').remove();
  }


}
  export default SymptomsList;
