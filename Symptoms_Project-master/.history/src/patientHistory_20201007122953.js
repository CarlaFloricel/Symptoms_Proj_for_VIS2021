import * as d3 from 'd3';

class PatientHistory {
  constructor(data, patientId, symptom, selectedSymptoms) {
    this.data = data;
    this.patientId = patientId;
    this.symptoms = symptom;
    this.selectedSymptoms = selectedSymptoms;
  }

  init() {
    this.drawPatientHistory(this.patientId, this.selectedSymptoms);
  }

  async drawPatientHistory(patientId, selectedSymptoms) {

    const patients = await d3.csv('/data/datasets/patients_complete.csv');
    var patientBackground = patients.find(p => p.patientId == this.patientId);
    var symptomsSelected = this.selectedSymptoms;
    var i = 0;
    var j = 0;
    const margin = {
      left: 10,
      right: 0,
      top: 10,
      bottom: 10
    };
    const width = 100;
    const height = window.innerHeight;

    const periods = ["0M", "6M", "12M", "18M", "24M", ">24M"];
    const colors = ['#fff', '#fff5f0', '#d1c0c0', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d', '#4a1212'];
    var patient = this.data.filter(p => p.patientId == this.patientId);



    function transformRatingColor(r) {
      switch (r) {
        case 0:
          return '#bdbdbd';
        case 1:
          return '#d9d9d9';
        case 2:
          return '#fee0d2';
        case 3:
          return '#fcbba1';
        case 4:
          return '#fc9272';
        case 5:
          return '#fb6a4a';
        case 6:
          return '#ef3b2c';
        case 7:
          return '#cb181d';
        case 8:
          return '#a50f15';
        case 9:
          return '#67000d';
        case 10:
          return '#4a1212';
        default:
          return '#d9d9d9';
      }
    }


    this.svg = d3.select("#patient-info")
      .append('svg')
      .attr('class', 'patientSvg')
      .attr('viewBox', `0 0 ${width } ${height }`)
      .attr('preserveAspectRatio', "xMidYMid meet")
      .style('display', 'none')
      .attr('z-index',10);

    this.g = this.svg.append('g')
      .attr('class', 'patientGroup')
      .attr('transform', `translate(0,0)`);


     if (!patientBackground) return;
        this.g.append('rect')
          .attr('id','selectedMonths')
          .attr('x',transformHighlight(window.currentPeriod) + 24)
          .attr('y',window.innerHeight -height + 62)
          .attr('height', window.innerHeight -212)
          .attr('width', 13)
          .attr("stroke", '#ffd152')
          .attr("opacity",'0.8')
          .attr("stroke-width", 3)
          .attr('fill','transparent')

    // periods.forEach((p, i) => {
    //   this.g.append('text')
    //        .attr('transform', 'rotate(10)')
    //     .attr('class', 'periodText')
    //     .attr('x', 14 * i +145)
    //     .attr('y', height-150)
    //     .attr('color', 'black')
        
    //     .attr('font-size', '0.8rem')

    //     .text(p)
    // });

    function transformPeriod(p) {
      switch (p) {
        case 0:
        case 6:
        case 12:
        case 18:
        case 24:
          return Math.round(p / 6);
        default:
          return 5;
      }
    }


    var symptoms_localdata = []
    var patients_localdata = []
    var text_tooltip = ''
    for (i = 0; i < 28; i++) {
      symptoms_localdata.push(this.symptoms[i]);

      for (j = 0; j < patient.length; j++) {
        patients_localdata.push(patient[j])
        this.g.append('rect')
          .attr('class', 'symptoms')
          .attr('x', 25 +13 * transformPeriod(parseInt(patient[j].period)))
          .attr('y', height-173- 27.1 * i)
          .attr('height', 22)
          .attr('width', 10)
          .attr('fill', transformRatingColor(parseInt(patient[j][this.symptoms[i]])))
          .style("cursor", "pointer")
          .attr('opacity', '0.9')
          .append("title")
          .text(function () {
            var months = ''
            text_tooltip = 'Symptom: ' + symptoms_localdata[i] + '\n';
            text_tooltip = text_tooltip + 'Rating: ' + patients_localdata[j][symptoms_localdata[i]] + '\n' + 'Months: ';
            if (j == 0) {
              months = '0';
            } else if (j == 1) {
              months = '6';
            } else if (j == 2) {
              months = '12';
            } else if (j == 3) {
              months = '18';
            } else if (j == 4) {
              months = '24';
            } else {
              months = '25';
            }
            text_tooltip = text_tooltip + months;
            return text_tooltip;
          });
      }
    }



    // this.g.append('text')
    //   .attr('class', 'patientTitle')
    //   .attr('id', 'patientTitle')
    //   .attr('font-size', '1.5rem')
    //   .attr('transform', `translate(${margin.left},${margin.top +10})`)
    //   .text("Patient " + this.patientId)

  


    // this.g.append('text')
    //   .attr('class', 'OtherDetails')
    //   .attr('id', 'patientTitle')
    //   .attr('font-size', '1rem')
    //   .attr('transform', `translate(${margin.left},${margin.top + 510})`)
    //   .text("Other Details: ");

    // this.g.append('text')
    //   .attr('class', 'AgeTitle')
    //   .attr('id', 'patientTitle')
    //   .attr('font-size', '0.9rem')
    //   .attr('transform', `translate(${margin.left},${margin.top + 532})`)
    //   .text("Age: " + parseInt(patientBackground.age));

    // this.g.append('text')
    //   .attr('class', 'GenderTitle')
    //   .attr('id', 'patientTitle')
    //   .attr('font-size', '0.9rem')
    //   .attr('transform', `translate(${margin.left},${margin.top + 548})`)
    //   .text("Gender: " + patientBackground.gender)

    // this.g.append('text')
    //   .attr('class', 'TumorTitle')
    //   .attr('id', 'patientTitle')
    //   .attr('font-size', '0.9rem')
    //   .attr('transform', `translate(${margin.left},${margin.top + 564})`)
    //   .text("Tumor category: " + patientBackground.t_category)

    // this.g.append('text')
    //   .attr('class', 'patientTitle')
    //   .attr('font-size', '0.9rem')
    //   .attr('transform', `translate(${margin.left},${margin.top + 578})`)
    //   .text("Therapeutic combination: " + patientBackground.therapeutic_combination)

    // this.g.append('text')
    //   .attr('class', 'DoseTitle')
    //   .attr('id', 'patientTitle')
    //   .attr('font-size', '0.9rem')
    //   .attr('transform', `translate(${margin.left},${margin.top + 594})`)
    //   .text("Total dose: " + patientBackground.total_dose)

    // this.g.append('text')
    //   .attr('class', 'FractionTitle')
    //   .attr('id', 'patientTitle')
    //   .attr('font-size', '0.9rem')
    //   .attr('transform', `translate(${margin.left},${margin.top +610})`)
    //   .text("Total fractions: " + patientBackground.total_fractions)


      function transformHighlight(period){
         switch (period) {
        case 0:
          return -1;
        case 6:
          return 19;
        case 12:
          return 39;
        case 18:
          return 59;
        case 24:
          return 79;
        default:
          return 99;
      }

      }


  }

  clear() {
    this.svg.selectAll('#selectedMonths').remove();
    this.svg.selectAll('.patientTitle').remove();
    d3.selectAll('.patientSvg').remove();
  }


  async update(patientId, selectedSymptoms) {
    this.patientId = patientId;
    this.clear();
    await this.drawPatientHistory(patientId, selectedSymptoms);
    this.svg.style('display', 'block');
  }
}
export default PatientHistory;
