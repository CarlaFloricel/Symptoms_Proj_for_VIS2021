import * as d3 from 'd3';

class TendrilPlot {
  constructor(selector, width, height, data, symptom) {
    this.selector = selector;
    this.width = width;
    this.height = height;
    this.data = data;
    this.symptom = symptom;
  }

  init() {
    const { data, symptom, width, height } = this;

    const width2 = 950
    const height2 = 200
    this.svg = d3.select(this.selector)
      .append('svg')
      .attr('class', 'Tendrils')
      .attr('id', 'Tendrils')
      .attr('width', 200)
      .attr('height', 950)
      .attr("viewBox", `0 0 ${width}, ${height}`)
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr('preserveAspectRatio', "xMidYMid meet");

    this.patientIdEl = this.svg
      .append('text')
      .classed('patientTitle', true)
      .attr('font-size', '1.8rem')
      .attr('transform', `translate(${75},${600}), rotate(-90)`);
    this.drawTendrils(data, symptom);
  }

  clear() {
    this.svg.select('.tendrils').remove();
    this.select('.Tendrils').remove();
  }

  async drawTendrils(data, symptom) {
    const { svg } = this;

    function transformPeriod(p) {
      switch (p) {
        case 0:
          return 0;
        case 1:
          return 20;
        case 2:
          return 40;
        case 3:
          return 60;
        case 4:
          return 80;
        default:
          return 100;
      }
    }

    function normalize_data(el) {
      const normalized_data = []
      const min_el = Math.min(...el)
      const max_el = Math.max(...el)
      if (min_el == max_el) {
        return el
      }
      for (var j = 0; j < el.length; j++) {
        normalized_data.push((el[j] - min_el) / (max_el - min_el))

      }

      return normalized_data
    }

    function rotate(cx, cy, x, y, angle) {
      var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
      return [nx, ny];
    }

    if (!data.length) {

      svg.attr("transform", "translate(100, -350), rotate(90)")
      const g = svg.append('g')
        .classed('tendrils', true)
        .attr('transform', `translate(110,500) scale(4, 4)`)

      var Symptoms = ['nausea', 'vomit', 'mucus', 'breath', 'choking', 'swallow', 'dryMouth', 'teeth', 'speech', 'taste', 'appetite', 'constipation',
        'sores', 'skin', 'pain', 'sleep', 'drowsiness', 'numbness', 'fatigue', 'distress', 'memory', 'sadness',
        'mood', 'enjoyment', 'activities', 'work', 'relations', 'walking'];


      if ($("#show-mean-tendrils").is(":checked")) {
        const mean_tendril_data = await d3.csv('/data/mdasi_files/tendril_data.csv');
        const current_data_therapy_1 = mean_tendril_data.filter(d => {
          if (d['period'] == window.currentPeriod && d['therapeutic_combination'] == "Radiation alone")
            return d
        }).map(el => { return el[symptom] })
        const current_data_therapy_2 = mean_tendril_data.filter(d => {
          if (d['period'] == window.currentPeriod && d['therapeutic_combination'] == "CC+Radiation alone")
            return d
        }).map(el => { return el[symptom] })
        const current_data_therapy_3 = mean_tendril_data.filter(d => {
          if (d['period'] == window.currentPeriod && d['therapeutic_combination'] == "IC+Radiation alone")
            return d
        }).map(el => { return el[symptom] })
        const current_data_therapy_4 = mean_tendril_data.filter(d => {
          if (d['period'] == window.currentPeriod && d['therapeutic_combination'] == "IC+Radiation alone+CC")
            return d
        }).map(el => { return el[symptom] })

        const total_data = []
        total_data.push(current_data_therapy_1)
        total_data.push(current_data_therapy_2)
        total_data.push(current_data_therapy_3)
        total_data.push(current_data_therapy_4)



        const therapy_colors = ["#9854cc", "#4d9221", " #058f96", "orange"]
        for (var i = 0; i < total_data.length; i++) {
          const angleRange = Math.PI / 2
          var prevX = 0;
          var prevY = 0;
          const points = [{ x: 0, y: 0 }];
          
          const normalized_data = normalize_data(total_data[i])
          for (var k = 1; k < total_data[i].length; k++) {
            var dif = total_data[i][k] - total_data[i][k - 1];
            var angle = (dif+10)/20 * angleRange - angleRange / 2;
            console.log((dif+10)/20)
            const vala = rotate(0, 0, 0, 25, -angle / (2 * Math.PI) * 360);
            prevX = vala[0] + prevX;
            prevY = vala[1] + prevY;
            points.push({ x: prevX, y: prevY })

            g.append('circle')
              .attr('cx', -prevX)
              .attr('cy', -prevY)
              .attr('r', 1.5)
              .attr('fill-opacity', 0.65)
              .attr('fill', therapy_colors[i])
              .attr("class", "singlePatientCircle " + symptom + "circle")
              .attr("id", symptom + "circle")

            const line = d3.line()
              .x((d) => (-d.x))
              .y((d) => (-d.y))
              .curve(d3.curveCardinal.tension(0.5));
            g.append('path')
              .attr('fill', 'none')
              .attr('class', "lala")
              .attr('id', symptom + "tendril")
              .attr('stroke', therapy_colors[i])
              .attr('stroke-width', '0.5px')
              .attr("opacity", '0.65')
              .attr('d', line(points))
          }
        }
      }

      else {
        const { patient, survival } = data;
        const s = survival;
        const timestamps = patient.map(p => parseInt(p.period));

        this.patientIdEl.text(`Patient ${patient[0].patientId}`);


        Symptoms.forEach((symptom, i) => {
          var time = 1;
          const radialData = patient
            .map(p => ({
              [symptom]: parseInt(p[symptom])
            }))
          const angleRange = Math.PI / 2;
          var prevX = 0;
          var prevY = 0;
          const surv = this.survival;
          const points = [{ x: 0, y: 0 }];
          for (var k = 1; k < radialData.length; k++) {
            var dif = radialData[k][symptom] - radialData[k - 1][symptom];
            console.log((10 + dif) / 20)
            var angle = ((10 + dif) / 20) * angleRange - angleRange / 2;
            const vala = rotate(0, 0, 0, 25, -angle / (2 * Math.PI) * 360);
            prevX = vala[0] + prevX;
            prevY = vala[1] + prevY;
            points.push({ x: prevX, y: prevY })
            if (k == radialData.length - 1) {

              if (parseInt(s) == 0) {
                g.append('circle')
                  .attr('cx', -prevX)
                  .attr('cy', -prevY)
                  .attr('r', 1.5)
                  .attr('fill-opacity', 0.65)
                  .attr('fill', 'black')
                  .attr("class", "singlePatientCircle " + symptom + "circle")
                  .attr("id", symptom + "circle")



              }
              else {
                g.append('circle')
                  .attr('cx', -prevX)
                  .attr('cy', -prevY)
                  .attr('r', 1.5)
                  .attr('fill-opacity', 0.65)
                  .attr('fill', '#83aad4')
                  .attr("class", "singlePatientCircle " + symptom + "circle")
                  .attr("id", symptom + "circle")

              }
            }
            else {
              g.append('circle')
                .attr('cx', -prevX)
                .attr('cy', -prevY)
                .attr('r', 1.5)
                .attr('fill-opacity', 0.65)
                .attr('fill', '#83aad4')
                .attr("class", "singlePatientCircle " + symptom + "circle")
                .attr("id", symptom + "circle")

            }
          }
          const line = d3.line()
            .x((d) => (-d.x))
            .y((d) => (-d.y))
            .curve(d3.curveCardinal.tension(0.5));

          g.append('path')
            .attr('fill', 'none')
            .attr('class', patient[0].patientId + " tendrilsPath " + symptom + "Tendril")
            .attr('id', symptom + "tendril")
            .attr('stroke', '#83aad4')
            .attr('stroke-width', '0.5px')
            .attr("opacity", '0.65')
            .attr('d', line(points))
            .on('mouseover', function () {
              window.selectedsymp = this['id']
              $('.tendrilsPath').css('opacity', '0.2')
              $('.singlePatientCircle').css('opacity', '0.2')
              d3.select(this)
                .append("title")
                .text("Symptom: " + symptom)
              $(`.${symptom}Tendril`).css('stroke-width', '2.5')
                .css('opacity', '0.65');
              $(`.${symptom}circle`).css('opacity', '0.65')

              $(`.${symptom}`).css("opacity", "1")
            })
            .on('mouseout', function () {

              d3.select(this)
                .attr('stroke-width', '0.5px');
              $('.singlePatientCircle').css('opacity', '0.65')
              $('.tendrilsPath').css('opacity', '0.65')
                .css('stroke-width', '0.5')
              $(`.${symptom}`).css("opacity", "0")
              window.selectedPatient = []
            });
        });
      }
    }
    else {

      svg.attr("transform", "translate(100, -350), rotate(90)")
      this.patientIdEl.text(symptom);
      const g = svg.append('g')
        .attr("class", 'tendrils ' + symptom)
        //.classed('tendrils', true)
        .attr('transform', `translate(110,500) scale(4, 4)`)
        .on('mouseover', () => {
          var id = symptom;
          $(`#${id}-highlight`).css('opacity', '1')
          $(`.symptoms-list`).css("color", "black")
          $(`#${id}`).css("color", "#fd8d3c")
          $(`#${window.lastSelectedSymptom}`).css("color", "red")
        })
        .on('mouseout', () => {
          $(`.symptoms-list`).css("color", "black")
          $('.selectedSympBar').css('opacity', '0');
          $(`.symptoms-list`).css("color", "black")
          $(`#${window.lastSelectedSymptom}`).css("color", "red")

        })

      const patients = data;

      var index = 0;
      patients.forEach((p, i) => {
        if (parseInt(p[0][0].patientId) == window.selectedpatient)
          index = i
      })
      var e = patients[index]
      patients.splice(index, 1)

      patients.sort((a, b) => b.survival - a.survival)
      patients.push(e)


      patients.forEach((p, i) => {
        const timestamps = p.map(p => parseInt(p.length));
        const line = d3.line()
          .x((d) => (-d.x))
          .y((d) => (-d.y))
          .curve(d3.curveCardinal.tension(0.5));

        const currentPatient = p[0]
        var sum = []
        const radialData = currentPatient.map(t => {
          sum.push(parseInt(t[symptom]))

        })

        var time = 1;
        const angleRange = 3 * Math.PI / 4;
        var prevX = 0;
        var prevY = 0;
        const points = [{ x: 0, y: 0 }];
        for (var k = 1; k < sum.length; k++) {
          var dif = sum[k] - sum[k - 1];
          var angle = ((10 + dif) / 20) * angleRange - angleRange / 2;
          const vala = rotate(0, 0, 0, 25, -angle / (2 * Math.PI) * 360);
          prevX = vala[0] + prevX;
          prevY = vala[1] + prevY;
          points.push({ x: prevX, y: prevY })
          const id = p[0][0].patientId;
          if (k == radialData.length - 1) {


            if (p.survival == 0) {
              g.append('circle')
                .attr('cx', -prevX)
                .attr('cy', -prevY)
                .attr('r', 1.5)
                .attr('fill-opacity', 0.65)
                .attr('fill', 'black')
                .attr('class', currentPatient[currentPatient.length - 1].patientId + " circle tendrilCircle");

            }
            else {
              g.append('circle')
                .attr('cx', -prevX)
                .attr('cy', -prevY)
                .attr('r', 1.5)
                .attr('fill-opacity', 0.65)
                .attr('fill', '#83aad4')
                .attr('class', currentPatient[currentPatient.length - 1].patientId + " circle tendrilCircle " + currentPatient[currentPatient.length - 1].patientId + "circle");
            }

          }
          else {
            g.append('circle')
              .attr('cx', -prevX)
              .attr('cy', -prevY)
              .attr('r', 1.5)
              .attr('fill-opacity', 0.65)
              .attr('fill', '#83aad4')
              .attr('class', currentPatient[currentPatient.length - 1].patientId + " circle tendrilCircle " + currentPatient[currentPatient.length - 1].patientId + "circle");
          }

        }


        g.append('path')
          .attr('fill', 'none')
          .attr('stroke', '#83aad4')
          .attr('class', currentPatient[0].patientId + " stackPath tendrilsPath " + currentPatient[0].patientId + "path")
          .attr('id', currentPatient[0].patientId)
          .attr('stroke-width', '0.5px')
          .attr("opacity", () => { return window.freshTendril == 1 ? '0.2' : '0.6' })
          .attr('d', line(points))
          .on('mouseover', function () {
            d3.select(this)
              .append("title")
              .text("Patient ID: " + p[0][0]['patientId'])
            window.selectedPatient = this['id'];
            $('.stackPath').css('opacity', '0.2');
            $('.circle').css('opacity', '0');
            $(`.${window.selectedPatient}`).css('stroke-width', '2.8')
              .css('opacity', '0.8');
            $(`#leaf-rect-${this['id']}`).css("opacity", '0.3')

            $('.sympBar').css('opacity', '0.2');

          })
          .on('mouseout', function () {
            d3.select(this)
              .attr('stroke', '#83aad4')
            $(`.${window.selectedPatient}`).css('stroke-width', '0.5px')
            $('.plot path').css('opacity', '0.6')
            $('.tendrilsPath').css('opacity', '0.65')
            $('circle').css('opacity', '1')
            $(".leaf-rect").css("opacity", "0")
            $(`#leaf-rect-${window.selectedpatient}`).css("opacity", '0.3')

          })
        window.selectedPatient = [];

      });


    }

  }

}

export default TendrilPlot;
