import * as d3 from 'd3';

class TendrilPlot {
  constructor(selector, width, height, data, symptom, color) {
    this.selector = selector;
    this.width = width;
    this.height = height;
    this.data = data;
    this.symptom = symptom;
    this.color = color;
  }

  init() {
    const { data, symptom, color, width, height } = this;
    // d3.select(this.selector)
    //   .attr('title', 'This plot shows how the selected c ratings change over time. ' + 
    //     'Each tendril represents a symptom and each circle one time stamp .' + 
    //     'Left leaning indicates rating increase and vice versa.');

    const width2 = 500
    const height2 = 200
    this.svg = d3.select(this.selector)
      .append('svg')
      .attr('class', 'Tendrils')
      .attr('id', 'Tendrils')
      .attr('width', 200)
      .attr('height', 750)
      .attr("viewBox", `0 0 ${width}, ${height}`)
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr('preserveAspectRatio', "xMidYMid meet");

    this.patientIdEl = this.svg
      .append('text')
      .classed('patientTitle', true)
      .attr('font-size', '1.8rem')
      .attr('transform', `translate(${75},${590}), rotate(-90)`);
    this.drawTendrils(data, symptom, color);
  }

  clear() {
    this.svg.select('.tendrils').remove();
    this.select('.Tendrils').remove();
  }

  drawTendrils(data, symptom, color) {
    const { svg, height, width } = this;

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

      function rotate(cx, cy, x, y, angle) {
         var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [nx, ny];
      }

    if(!data.length){
      svg.attr("transform","translate(100, -200), rotate(90)")
      const { patient, symptoms, survival } = data;
            var Symptoms = ['nausea', 'vomit','mucus', 'breath', 'choking',  'swallow','dryMouth','teeth','speech','taste','appetite','constipation', 
    'sores','skin', 'pain','sleep', 'drowsiness', 'numbness','fatigue', 'distress','memory', 'sadness',
    'mood','enjoyment','activities', 'work', 'relations', 'walking'];
      const s = survival;
      const timestamps = patient.map(p => parseInt(p.period));
      const radiusScale = d3.scaleLinear()
        .domain(d3.extent(timestamps))
        .range([10, 50]);
      const angleScale = d3.scaleLinear()
        .domain([0, 10])
        .range([-Math.PI/8, Math.PI / 8]);
      const colors =['#803e3b', '#DA8A00', '#058f96', '#9854cc', '#66a61e'];
      const colorScale = d3.scaleOrdinal(colors);

      const line = d3.lineRadial()
        .curve(d3.curveCardinal);

      this.patientIdEl.text(`Patient ${patient[0].patientId}`);


      const g = svg.append('g')
        .classed('tendrils', true)
        .attr('transform', `translate(100,500) scale(4, 4)`)




      Symptoms.forEach((symptom, i) => {
        var time = 1;
        const radialData = patient
          .map(p => ({
            [symptom]: parseInt(p[symptom])
          }))
          const angleRange = Math.PI/2;
          var prevX=0;
          var prevY=0;
          const surv = this.survival;
          const points = [{x: 0, y: 0}];
          for(var k = 1; k< radialData.length; k++){
              var dif =radialData[k][symptom] - radialData[k-1][symptom]; 
              var angle = ((10+dif)/20) *  angleRange -  angleRange/2;
              const vala = rotate(0,0,0,20,-angle/(2*Math.PI)*360);
              prevX = vala[0] + prevX;
              prevY = vala[1] + prevY;
              points.push({x: prevX, y: prevY})
              if(k == radialData.length-1 ){

              	if( parseInt(s) ==0 ){
              	g.append('circle')
                  .attr('cx', -prevX)
                  .attr('cy', -prevY)
                  .attr('r',1.5)
                  .attr('fill-opacity', 0.65)
                  .attr('fill', 'black')
                  .attr("class","singlePatientCircle " + symptom+"circle")
                  .attr("id", symptom + "circle")
               
                  

              }
              else {
              	 g.append('circle')
                  .attr('cx', -prevX)
                  .attr('cy', -prevY)
                  .attr('r',1.5)
                  .attr('fill-opacity', 0.65)
                  .attr('fill','#83aad4')
                  .attr("class","singlePatientCircle "+symptom+"circle")
                  .attr("id", symptom+"circle")
               
                
              }
          }
              else{
                g.append('circle')
                  .attr('cx', -prevX)
                  .attr('cy', -prevY)
                  .attr('r',1.5)
                  .attr('fill-opacity', 0.65)
                  .attr('fill', '#83aad4')
                  .attr("class","singlePatientCircle " +symptom+"circle")
                  .attr("id", symptom+"circle")
               
              }

          }
          const line = d3.line()
            .x((d) => (-d.x))
            .y((d) => (-d.y))
            .curve(d3.curveCardinal.tension(0.5));




          g.append('path')
            .attr('fill', 'none')
            .attr('class',patient[0].patientId + " tendrilsPath " +symptom+"Tendril" )
            .attr('id',symptom+"tendril")
            .attr('stroke','#83aad4')
            .attr('stroke-width', '0.5px')
            .attr("opacity",'0.65')
            .attr('d', line(points))
            .on('mouseover', function () {
                 window.selectedsymp = this['id']
                 $('.tendrilsPath').css('opacity','0.2')
                  $('.singlePatientCircle').css('opacity','0.2')
                d3.select(this)
                  .append("title")
                  .text("Symptom: " + symptom)
               $(`.${symptom}Tendril`).css('stroke-width','2.5')
                                              .css('opacity','0.65');
              $(`.${symptom}circle`).css('opacity','0.65')
               
            $(`.${symptom}`).css("opacity","1")
              })
            .on('mouseout', function () {

                d3.select(this)
                  .attr('stroke-width', '0.5px');
                   $('.singlePatientCircle').css('opacity','0.65')
                  $('.tendrilsPath').css('opacity','0.65')
                                    .css('stroke-width','0.5')
                  $(`.${symptom}`).css("opacity","0")
                  window.selectedPatient = []
              });
            
      });


  }
  else{
    svg.attr("transform","translate(100, -200), rotate(90)")
    this.patientIdEl.text(symptom);
    const g = svg.append('g')
        .attr("class",'tendrils ' + symptom)
        //.classed('tendrils', true)
        .attr('transform', `translate(100,500) scale(4, 4)`)
          .on('mouseover', ()=>{
              var id =symptom;
              $(`#${id}-highlight`).css('opacity','1')
              $(`.symptoms-list`).css("color","black")
              $(`#${id}`).css("color","#fd8d3c")
              $(`#${window.lastSelectedSymptom}`).css("color","red")
            })
            .on('mouseout', ()=> {
              $(`.symptoms-list`).css("color","black")
                $('.selectedSympBar').css('opacity','0');
                 $(`.symptoms-list`).css("color","black")
                $(`#${window.lastSelectedSymptom}`).css("color","red")
                      
                })

    const patients = data;
    
   var index = 0;
   patients.forEach((p,i) =>{
    if (parseInt(p[0][0].patientId) == window.selectedpatient)
      index = i})
   var e = patients[index]
   patients.splice(index,1)
 
    patients.sort((a,b)=> b.survival -a.survival )
      patients.push(e)
    patients.forEach( (p,i) => {
      const timestamps = p.map(p => parseInt(p.length));
      const radiusScale = d3.scaleLinear()
        .domain(d3.extent(timestamps))
        .range([10, 50]);
      const angleScale = d3.scaleLinear()
        .domain([0, 10])
        .range([-Math.PI/8, Math.PI / 8]);
      const line = d3.line()
                .x((d) => (-d.x))
                .y((d) => (-d.y))
                .curve(d3.curveCardinal.tension(0.5));

      const currentPatient = p[0]
      var sum=[]
      const radialData = currentPatient.map(t =>{
        sum.push( parseInt(t[symptom]))
        
      })
      var time = 1;
        const angleRange =Math.PI;
        var prevX=0;
        var prevY=0;
        const points = [{x: 0, y: 0}];
        for(var k = 1; k< sum.length; k++){
            var dif =sum[k] - sum[k-1]; 
            var angle = ((10+dif)/20) *  angleRange -  angleRange/2;
            const vala = rotate(0,0,0,20,-angle/(2*Math.PI)*360);
            prevX = vala[0] + prevX;
            prevY = vala[1] + prevY;
            points.push({x: prevX, y: prevY})
            const id = p[0][0].patientId;
            if(k == radialData.length-1 ){

             
              if( p.survival ==0 ){
              g.append('circle')
                .attr('cx', -prevX)
                .attr('cy', -prevY)
                .attr('r',1.5)
                .attr('fill-opacity', 0.65)
                .attr('fill', 'black')
                .attr('class', currentPatient[currentPatient.length-1].patientId +" circle tendrilCircle");

            }
            else {
               g.append('circle')
                .attr('cx', -prevX)
                .attr('cy', -prevY)
                .attr('r',1.5)
                .attr('fill-opacity', 0.65)
                .attr('fill', '#83aad4')
                .attr('class', currentPatient[currentPatient.length-1].patientId +" circle tendrilCircle "+currentPatient[currentPatient.length-1].patientId+"circle");
            }

        }
            else{
              g.append('circle')
                .attr('cx', -prevX)
                .attr('cy', -prevY)
                .attr('r',1.5)
                .attr('fill-opacity', 0.65)
                .attr('fill', '#83aad4')
                .attr('class', currentPatient[currentPatient.length-1].patientId +" circle tendrilCircle " +currentPatient[currentPatient.length-1].patientId+"circle");
            }

        }


        g.append('path')
          .attr('fill', 'none')
          .attr('stroke', '#83aad4')
          .attr('class',currentPatient[0].patientId + " stackPath tendrilsPath " +currentPatient[0].patientId+"path" )
          .attr('id',currentPatient[0].patientId)
          .attr('stroke-width', '0.5px')
          .attr("opacity", ()=> {return window.freshTendril == 1? '0.2' : '0.6'} )
          .attr('d', line(points))
          .on('mouseover', function () {
            d3.select(this)
              .append("title")
              .text("Patient ID: " + p[0][0]['patientId'])
               window.selectedPatient = this['id'];
               $('.stackPath').css('opacity','0.2');
                $('.circle').css('opacity','0');
               $(`.${window.selectedPatient}`).css('stroke-width','2.8')
                                              .css('opacity','0.8');
              $(`#leaf-rect-${this['id']}`).css("opacity",'0.3')

              $('.sympBar').css('opacity','0.2');
              
          })
          .on('mouseout', function () {
             d3.select(this)
               .attr('stroke', '#83aad4')
              $(`.${window.selectedPatient}`).css('stroke-width','0.5px')
             $('.plot path').css('opacity','0.6')
             $('.tendrilsPath').css('opacity','0.65')
             $('circle').css('opacity','1')
             $(".leaf-rect").css("opacity","0")
             $(`#leaf-rect-${window.selectedpatient}`).css("opacity",'0.3')

          })
        window.selectedPatient = [];
          
      });


  }

}
 
}

export default TendrilPlot;
