import * as d3 from 'd3';
import { tip as d3tip } from "d3-v6-tip";

class TendrilPlot {
  constructor(selector, width, height, data, symptom, mean_selection) {
    this.selector = selector;
    this.width = width;
    this.height = height;
    this.data = data;
    this.symptom = symptom;
    this.mean_selection = mean_selection
  }

  init() {
    const { data, symptom, width, height, mean_selection } = this;

    this.svg = d3.select(this.selector)
      .append('svg')
      .attr('class', 'Tendrils')
      .attr('id', 'Tendrils')
      .attr('width', 200)
      .attr('height', 1450)
      .attr("viewBox", `0 0 ${width}, ${height}`)
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr('preserveAspectRatio', "xMidYMid meet");

    this.patientIdEl = this.svg
      .append('text')
      .classed('patientTitle', true)
      .attr('font-size', '1.8rem')
      .attr('transform', `translate(${120},${600}), rotate(-90)`);
    this.drawTendrils(data, symptom, mean_selection);
  }

  clear() {
    this.svg.select('.tendrils').remove();
    this.select('.Tendrils').remove();
  }

  async drawTendrils(data, symptom, mean_selection) {
    const { svg } = this;
    const tip = d3tip().attr('class', 'd3-tip').html((d) => d);
    svg.call(tip)


    function rotate(cx, cy, x, y, angle) {
      var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
      return [nx, ny];
    }

    function transformPeriodIndex(p) {
      switch (p) {
        case "0":
          return 0;
        case "1":
          return 1;
        case "2":
          return 2;
        case "3":
          return 3;
        case "4":
          return 4;
        case "5":
          return 5;
        case "6":
          return 6;
        case "7":
          return 7;
        case "12":
          return 8;
        case "24":
          return 9;
        case "48":
          return 10;
        default:
          return 11;
      }
    }

    if (!data.length) {

      var Symptoms = ['nausea', 'vomit', 'mucus', 'breath', 'choking', 'swallow', 'dryMouth', 'teeth', 'speech', 'taste', 'appetite', 'constipation',
        'sores', 'skin', 'pain', 'sleep', 'drowsiness', 'numbness', 'fatigue', 'distress', 'memory', 'sadness',
        'mood', 'enjoyment', 'activities', 'work', 'relations', 'walking'];


      if ($("#show-mean-tendrils").is(":checked")) {

        svg.attr("transform", "translate(100, -600), rotate(90)")
        const g = svg.append('g')
          .classed('tendrils', true)
          .attr('transform', `translate(110,500) scale(4, 4)`)

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
        this.patientIdEl.text(symptom);

        const therapy_colors = ["#9854cc", "#4d9221", " #058f96", "orange"]
        for (var i = 0; i < total_data.length; i++) {
          const angleRange = 3 * Math.PI / 4
          var prevX = 0;
          var prevY = 0;
          const points = [{ x: 0, y: 0 }];
          const points2 = []

          for (var k = 1; k < total_data[i].length; k++) {
            var dif = total_data[i][k] - total_data[i][k - 1];
            var angle = (dif + 10) / 20 * angleRange - angleRange / 2;

            var vala = k < 8 ? rotate(0, 0, 0, 25, -angle / (2 * Math.PI) * 360) : rotate(0, 0, 0, 50, -angle / (2 * Math.PI) * 360);

            prevX = vala[0] + prevX;
            prevY = vala[1] + prevY;

            if (k < 8) {


              points.push({ x: prevX, y: prevY })
              g.append('circle')
                .attr('cx', -prevX)
                .attr('cy', -prevY)
                .attr('r', 1.5)
                .attr("class", "mean_circle")
                .attr('opacity', 0.65)
                .attr('fill', therapy_colors[i])
                .attr("class", "singlePatientCircle " + symptom + "circle circleAcute")
                .attr("id", symptom + "circle")

              if (k == 7)
                points2.push({ x: prevX, y: prevY })

            }
            else {

              points2.push({ x: prevX, y: prevY })
              g.append('circle')
                .attr('cx', -prevX)
                .attr('cy', -prevY)
                .attr('r', 1.5)
                .attr("class", "mean_circle")
                .attr('opacity', 0.65)
                .attr('fill', therapy_colors[i])
                .attr("class", "singlePatientCircle " + symptom + "circle circleLate")
                .attr("id", symptom + "circle")
            }
          }
          const line = d3.line()
            .x((d) => (-d.x))
            .y((d) => (-d.y))
            .curve(d3.curveCardinal.tension(0.5));
          g.append('path')
            .attr('fill', 'none')
            .attr('class', "stackPath meanPathAcute" + therapy_colors[i])
            .attr('id', therapy_colors[i] + "tendril")
            .attr('stroke', therapy_colors[i])
            .attr('stroke-width', '0.5px')
            .attr("opacity", '0.65')
            .attr('d', line(points))
            .on('mouseover', function () {
              const th = i == 0 ? "Radiation" : i == 1 ? "IC + Radiation" : i == 2 ? "IC + Radiation + CC" : "CC + Radiation"
              const textt = "Therapy: " + th
              tip.show(textt, this)
            })
            .on('mouseout', function () {
              tip.hide()
            })

          g.append('path')
            .attr('fill', 'none')
            .attr('class', "stackPath meanPathLate" + therapy_colors[i])
            .attr('id', therapy_colors[i] + "tendril")
            .attr('stroke', therapy_colors[i])
            .attr('stroke-width', '0.5px')
            .attr("opacity", '0.65')
            .attr('d', line(points2))
            .on('mouseover', function () {
              const th = i == 0 ? "Radiation" : i == 1 ? "IC + Radiation" : i == 2 ? "IC + Radiation + CC" : "CC + Radiation"
              const textt = "Therapy: " + th
              tip.show(textt, this)
            })
            .on('mouseout', function () {
              tip.hide()
            })


        }
        if (mean_selection && mean_selection.length > 0) {
          const angleRange = 3 * Math.PI / 4
          var prevX = 0;
          var prevY = 0;
          const points = [{ x: 0, y: 0 }];
          const points2 = []
          for (var k = 1; k < mean_selection.length; k++) {
            var dif = mean_selection[k] - mean_selection[k - 1];
            var angle = ((10 + dif) / 20) * angleRange - angleRange / 2;

            const vala = k < 8 ? rotate(0, 0, 0, 25, -angle / (2 * Math.PI) * 360) : rotate(0, 0, 0, 50, -angle / (2 * Math.PI) * 360);
            prevX = vala[0] + prevX;
            prevY = vala[1] + prevY;

            if (k < 8) {
              points.push({ x: prevX, y: prevY })

              g.append('circle')
                .attr('cx', -prevX)
                .attr('cy', -prevY)
                .attr('r', 1.5)
                .attr("class", "mean_circle")
                .attr('opacity', 0.65)
                .attr('fill', "red")
                .attr("class", "singlePatientCircle circle circleAcute")
                .attr("id", symptom + "circle")


              if (k == 7)
                points2.push({ x: prevX, y: prevY })

            }


            else {
              points2.push({ x: prevX, y: prevY })
              g.append('circle')
                .attr('cx', -prevX)
                .attr('cy', -prevY)
                .attr('r', 1.5)
                .attr("class", "mean_circle")
                .attr('opacity', 0.65)
                .attr('fill', "red")
                .attr("class", "singlePatientCircle circle circleLate")
                .attr("id", symptom + "circle")
            }


          }
          const line = d3.line()
            .x((d) => (-d.x))
            .y((d) => (-d.y))
            .curve(d3.curveCardinal.tension(0.5));
          g.append('path')
            .attr('fill', 'none')
            .attr('class', "stackPath meanPathAcute")
            .attr('id', symptom + "tendril")
            .attr('stroke', "red")
            .attr('stroke-width', '0.5px')
            .attr("opacity", '0.65')
            .attr('d', line(points))
          g.append('path')
            .attr('fill', 'none')
            .attr('class', "stackPath meanPathLate")
            .attr('id', symptom + "tendril")
            .attr('stroke', "red")
            .attr('stroke-width', '0.5px')
            .attr("opacity", '0.65')
            .attr('d', line(points2))
        }
        if(!$("#Patients2D").hasClass('active')){
          if ($("#Late").hasClass('active')) {
            $('.circleLate').css("opacity", '0.65');
            $('.circleAcute').css("opacity", '0.1');
            $('.meanPathLate').css("opacity", '0.65');
            $('.meanPathAcute').css("opacity", '0.1');
      
          }
          if($("#Acute").hasClass('active')) {
            $('.circleLate').css("opacity", '0.1');
            $('.circleAcute').css("opacity", '0.65');
            $('.meanPathLate').css("opacity", '0.1');
            $('.meanPathAcute').css("opacity", '0.65');
      
          }
      
        }

      }

      else {

        svg.attr("transform", "translate(100, -600), rotate(90)").style("margin-bottom", "100px !important")

        const g = svg.append('g')
          .attr("class", 'tendrils ' + symptom)
          .attr('transform', `translate(110,500) scale(4, 4)`)
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
          const angleRange = 3 * Math.PI / 4
          var prevX = 0;
          var prevY = 0;
          const surv = this.survival;
          const points = [{ x: 0, y: 0 }];
          for (var k = 1; k < radialData.length; k++) {
            var dif = radialData[k][symptom] - radialData[k - 1][symptom];

            var angle = ((10 + dif) / 20) * angleRange - angleRange / 2;
            const vala = k < 8 ? rotate(0, 0, 0, 25, -angle / (2 * Math.PI) * 360) : rotate(0, 0, 0, 50, -angle / (2 * Math.PI) * 360);
            prevX = vala[0] + prevX;
            prevY = vala[1] + prevY;
            points.push({ x: prevX, y: prevY })

            g.append('circle')
              .attr('cx', -prevX)
              .attr('cy', -prevY)
              .attr('r', 1.5)
              .attr('opacity', 0.65)
              .attr('fill', '#83aad4')
              .attr("class", "singlePatientCircle " + symptom)
              .attr("id", symptom + "circle")

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

              const textt = "Symptom: " + symptom
              tip.show(textt, this)
              $(`.${symptom}Tendril`).css('stroke-width', '2.5')
                .css('opacity', '0.65');
              $(`.${symptom}circle`).css('opacity', '0.65')

              $(`.${symptom}`).css("opacity", "1")
            })
            .on('mouseout', function () {
              tip.hide()
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
      svg.attr("transform", "translate(100, -600), rotate(90)").style("margin-bottom", "100px !important")
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
        var timeIndex = 0
        var patientTimeIndexes = []
        const radialData = currentPatient.map(t => {
          const time = transformPeriodIndex(t['period'])
          patientTimeIndexes.push(time)
          if (transformPeriodIndex(t['period']) > 0) {
            const d = transformPeriodIndex(t['period']) - transformPeriodIndex(currentPatient[timeIndex - 1]['period'])
            for (var h = 0; h < d - 1; h++)
              sum.push(parseInt(currentPatient[timeIndex - 1][symptom]))
            sum.push(parseInt(t[symptom]))
          }
          else {
            sum.push(parseInt(t[symptom]))
          }

          timeIndex += 1

        })

        var time = 1;
        const angleRange = 3 * Math.PI / 4;
        var prevX = 0;
        var prevY = 0;
        const points = [{ x: 0, y: 0 }];
        const points2 = [];
        for (var k = 1; k < sum.length; k++) {
          var dif = sum[k] - sum[k - 1];
          var angle = ((10 + dif) / 20) * angleRange - angleRange / 2;

          const vala = k < 8 ? rotate(0, 0, 0, 25, -angle / (2 * Math.PI) * 360) : rotate(0, 0, 0, 50, -angle / (2 * Math.PI) * 360);
          prevX = vala[0] + prevX;
          prevY = vala[1] + prevY;

          const id = p[0][0].patientId;

          if (patientTimeIndexes.includes(k))
            if (k < 8) {
              points.push({ x: prevX, y: prevY })

              g.append('circle')
                .attr('cx', -prevX)
                .attr('cy', -prevY)
                .attr('r', 1.5)
                .attr('opacity', 0.65)
                .attr('fill', '#83aad4')
                .attr('class', currentPatient[currentPatient.length - 1].patientId + " circle tendrilCircle " + currentPatient[currentPatient.length - 1].patientId + "circle circleAcute");

              if (k == 7)
                points2.push({ x: prevX, y: prevY })
            }
            else {

              points2.push({ x: prevX, y: prevY })
              g.append('circle')
                .attr('cx', -prevX)
                .attr('cy', -prevY)
                .attr('r', 1.5)
                .attr('opacity', 0.65)
                .attr('fill', '#83aad4')
                .attr('class', currentPatient[currentPatient.length - 1].patientId + " circle tendrilCircle " + currentPatient[currentPatient.length - 1].patientId + "circle circleLate");
            }
        }


        g.append('path')
          .attr('fill', 'none')
          .attr('stroke', '#83aad4')
          .attr('class', currentPatient[0].patientId + " stackPath tendrilsPath " + currentPatient[0].patientId + "path meanPathAcute")
          .attr('id', currentPatient[0].patientId)
          .attr('stroke-width', '0.5px')
          .attr("opacity", () => { return window.freshTendril == 1 ? '0.2' : '0.65' })
          .attr('d', line(points))
          .on('mouseover', function () {
            const textt = "Patient ID: " + p[0][0]['patientId']
            tip.show(textt, this)
            window.selectedPatient = this['id'];
            $('.stackPath').css('opacity', '0.2');
            $('.circle').css('opacity', '0');
            $(`.${window.selectedPatient}`).css('stroke-width', '2.8')
              .css('opacity', '0.8');
            $(`#leaf-rect-${this['id']}`).css("opacity", '0.3')

            $('.sympBar').css('opacity', '0.2');

          })
          .on('mouseout', function () {
            tip.hide()
            d3.select(this)
              .attr('stroke', '#83aad4')
            $(`.${window.selectedPatient}`).css('stroke-width', '0.5px')
            $('.plot path').css('opacity', '0.6')
            $('.tendrilsPath').css('opacity', '0.65')
            $('.circle').css('opacity', '0.65')
            $(".leaf-rect").css("opacity", "0")
            $(`#leaf-rect-${window.selectedpatient}`).css("opacity", '0.3')

          })


        g.append('path')
          .attr('fill', 'none')
          .attr('stroke', '#83aad4')
          .attr('class', currentPatient[0].patientId + " stackPath tendrilsPath " + currentPatient[0].patientId + "path meanPathLate")
          .attr('id', currentPatient[0].patientId)
          .attr('stroke-width', '0.5px')
          .attr("opacity", () => { return window.freshTendril == 1 ? '0.2' : '0.65' })
          .attr('d', line(points2))
          .on('mouseover', function () {
            const textt = "Patient ID: " + p[0][0]['patientId']
            tip.show(textt, this)
            window.selectedPatient = this['id'];
            $('.stackPath').css('opacity', '0.2');
            $('.circle').css('opacity', '0');
            $(`.${window.selectedPatient}`).css('stroke-width', '2.8')
              .css('opacity', '0.8');
            $(`#leaf-rect-${this['id']}`).css("opacity", '0.3')

            $('.sympBar').css('opacity', '0.2');

          })
          .on('mouseout', function () {
            tip.hide()
            d3.select(this)
              .attr('stroke', '#83aad4')
            $(`.${window.selectedPatient}`).css('stroke-width', '0.5px')
            $('.plot path').css('opacity', '0.6')
            $('.tendrilsPath').css('opacity', '0.65')
            $('.circle').css('opacity', '0.65')
            $(".leaf-rect").css("opacity", "0")
            $(`#leaf-rect-${window.selectedpatient}`).css("opacity", '0.3')

          })
        window.selectedPatient = [];

      });


    }

  }

}

export default TendrilPlot;
