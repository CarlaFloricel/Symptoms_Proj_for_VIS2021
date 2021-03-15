import * as d3 from 'd3';
import { tip as d3tip } from "d3-v6-tip";

class StackedLinePlot {
  constructor(data, patientId) {
    this.data = data;
    this.patientId = patientId;
    this.symptoms = [];
  }

  init() {
    var i = 0;
    const {
      data,
      patientId
    } = this;
    const margin = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 10
    };
    const width = 400;
    const height = 450;
    const colors = ['#803e3b', '#DA8A00', '#058f96', '#9854cc', '#66a61e'];
    this.svg = d3.select("#stackplot")
      .append('svg')
      .attr('class', 'plot')
      .attr('viewBox', `0 0 ${width } ${height }`)
      .attr('font-size', '0.8rem')
      .attr('font-color','black')
      .attr("font-family", "sans-serif")
      .attr('preserveAspectRatio', "xMidYMid meet")
    

  }


 async drawStackPlot(patientId, symptoms) {


    const margin = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 10
    };
    const width = 400;
    const height = 450;
    var i = 0;
    var j = 0;
    var groupsNo = 5;
    var groupPlots = [];
    var patients = [];

    for (i = 0; i < patientId.length; i++) {
      patients[i] = this.data.filter(p => p.patientId == patientId[i]);
    }
    const colors = ['#803e3b', '#DA8A00', '#058f96', '#9854cc', '#66a61e'];
    const periods = ['0', '6', '12', '18', '24', '25'];

    function transformPeriod(p) {
      switch (p) {
        case 0:
          return "0w";
        case 1:
          return "1w";
        case 2:
          return "2w";
        case 3:
          return "3w";
        case 4:
          return "4w";
        case 5:
          return "5w";
        case 6:
          return "6w";
        case 7:
          return "7w";
        case 8:
          return "3m";
        case 9:
          return "6m";
        case 10:
          return "12m";
        case 11:
          return "18m";
      }
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





    function transformRatingColor(r) {
      switch (r) {
        case '0':
          return '#fff5f0';
        case '1':
          return '#fee0d2';
        case '2':
          return '#fcbba1';
        case '3':
          return '#fc9272';
        case '4':
          return '#fb6a4a';
        case '5':
          return '#ef3b2c';
        case '6':
          return '#e12f26';
        case '7':
          return '#cb181d';
        case '8':
          return '#a50f15';
        case '9':
          return '#67000d';
        case '10':
          return '#4a1212';
        default:
          return '#bdc9e1';
      }
    }


    function transformTooltipText(id, len,index,p){
      var l1=0;
      var l2=0;
      var l3=0;
      var l4=0;
      var part_len =0;
    part_len=matrixData[index].length;
    l1 = matrixData[index].filter(m => m[id] == 0).length
    l2 = matrixData[index].filter(m => m[id] > 0 && m[id]<=5 ).length
    l3 = matrixData[index].filter(m => m[id] > 5 && m[id]<=9 ).length
    l4 = matrixData[index].filter(m => m[id] == 10).length
    if($("#show-percentages").is(":checked")){
      l1 = (l1/matrixData[index].length *100).toFixed(2)
      l2 = (l2/matrixData[index].length *100).toFixed(2)
      l3 = (l3/matrixData[index].length *100).toFixed(2)
      l4 = (l4/matrixData[index].length *100).toFixed(2)
    }
    var text_tooltip = '';
    if(p=="empty"){
      var d = len - part_len;
      if(!$("#show-percentages").is(":checked")){
        text_tooltip = text_tooltip + 'Patients with no info: ' +d ;
      }
      else{
          d = (d /len*100).toFixed(2);
         text_tooltip = text_tooltip + 'Patients with no info: ' +d +"%";
      }
      return text_tooltip;
    }
    if(!$("#show-percentages").is(":checked")){
    text_tooltip = text_tooltip + part_len+ ' out of '+ len+ " Patients" + "<br />"
    text_tooltip = text_tooltip + '0 Rating: ' + l1 + "<br />"
    text_tooltip = text_tooltip + '>0 and <6 Rating: ' + l2 + "<br />"
    text_tooltip = text_tooltip + '>5 and <10 Rating: ' + l3 + "<br />"
    text_tooltip = text_tooltip + '10 Rating: ' + l4 + "<br />"
    }
    else{
        part_len = (part_len/len *100).toFixed(2)
        text_tooltip = text_tooltip + part_len+ '% out of a total of '+ len+ ' Patients'+ "<br />"
        text_tooltip = text_tooltip + '0 Rating: ' + l1 + "<br />"
        text_tooltip = text_tooltip + '>0 and <6 Rating: ' + l2 + "<br />"
        text_tooltip = text_tooltip + '>5 and <10 Rating: ' + l3 + "<br />"
        text_tooltip = text_tooltip + '10 Rating: ' + l4 + "<br />"
    }
    return text_tooltip;
  }

      const symp = ['nausea', 'vomit','mucus', 'breath', 'choking',  'swallow','dryMouth','teeth','speech','taste','appetite','constipation', 
    'sores','skin', 'pain','sleep', 'drowsiness', 'numbness','fatigue', 'distress','memory', 'sadness',
    'mood','enjoyment','activities', 'work', 'relations', 'walking'];
     this.symp = ['nausea', 'vomit','mucus', 'breath', 'choking',  'swallow','dryMouth','teeth','speech','taste','appetite','constipation', 
    'sores','skin', 'pain','sleep', 'drowsiness', 'numbness','fatigue', 'distress','memory', 'sadness',
    'mood','enjoyment','activities', 'work', 'relations', 'walking'];


      var matrixData = [[],[],[],[],[],[],[],[],[],[],[],[]];
      var selectedP = patients.filter(p => parseInt(p[0].patientId) == parseInt(window.selectedpatient))

      patients.forEach((patient) => {

        patient.forEach((p) =>{

          // if(matrixData[transformPeriodIndex(p.period)])
          matrixData[transformPeriodIndex(p.period)].push(p)
        })
      })
      var maxLen = Math.max(...matrixData.map(el => el.length));

      var selected_patient = [[],[],[],[],[],[],[],[],[],[],[],[]];
      if(selectedP.length>0)
      selectedP[0].forEach((p) =>{

          selected_patient[transformPeriodIndex(p.period)].push(p)
        })
      

      this.svg.selectAll('.stackContainer').remove();


      this.g = this.svg.append('g')
              .attr("class","stackContainerAll")
              .attr('transform', `translate(25,6) scale(0.92, 0.91)`)
      const tip = d3tip().attr('class', 'd3-tip').html((d)=> d);
      this.g.call(tip)

      this.g_overview= this.svg.append('g')
              .attr('transform', `translate(0,165)` )
              .attr('z-index','100')
           


        for(i=0;i<28; i++){
           this.g.append('rect')
                .attr('class', 'selectedSympBar ' + symp[27-i])
                .attr("id",symp[27-i]+"-highlight" )
                .attr('x',99)
                .attr('y', height -32.8-14.5*i)
                .attr('width', 297)
                .attr('height',14.3)
                .attr("stroke", '#fecc5c')
                .attr("opacity",'0')
                .attr("stroke-width", 1.5)
                .attr('fill','transparent')

         }
          this.g.append('rect')
          .attr('id','selectedMonth')
          .attr('x',98.5+ 25 * transformPeriodIndex(window.currentPeriod.toString()))
          .attr('y',24.5)
          .attr('height', height -41.7)
          .attr('width', 23)
          .attr("stroke", '#b3cde3')
          .attr("opacity",'0.8')
          .attr("stroke-width", 1.5)
          .attr('fill','transparent')


          this.g.append('rect')
          .attr('id','selectedAcute')
          .attr('x',148.5)
          .attr('y',24.5)
          .attr('height', height -41.7)
          .attr('width', 148)
          .attr("stroke", '#fecc5c')
          .attr("opacity",'0.8')
          .attr("display", "none")
          .attr("stroke-width", 1.5)
          .attr('fill','transparent')
          
          this.g.append('rect')
          .attr('id','selectedLate')
          .attr('x',297)
          .attr('y',24.5)
          .attr('height', height -41.7)
          .attr('width', 100)
          .attr("stroke", '#fecc5c')
          .attr("display", "none")
          .attr("opacity",'0.8')
          .attr("stroke-width", 1.5)
          .attr('fill','transparent')

        if(patients.length ==1){
          // const patients_complete = await d3.csv('/data/datasets/patients_complete_with_survival.csv');
          const patients_complete = await d3.csv('/data/mdasi_files/mdasi_patients_with_output.csv');


          var patientBackground = patients_complete.find(p => p.patientId == patients[0][0].patientId);
            for(var k = 0; k < 12; k ++){
              for( var i = 0; i < 28; i++){
                var ss = ""+symp[27-i]
                this.g.append('rect')
                .attr('id', symp[27-i]+'-rect')
                        .attr('x',100+25*k)
                        .attr('y', height -32-14.5*i)
                        .attr('width', 20)
                        .attr('height',13)
                        .attr('fill',matrixData[k][0] ? transformRatingColor(matrixData[k][0][ss]) : '#bdc9e1')
                        .attr('opacity',matrixData[k][0] ? '0.9' : '0.2')
                .on('mouseover', function () {
                  var id = this['id'];
                  id = id.replace("-rect","");
                  $(`#${id}-highlight`).css('opacity','1')
                  $(`.symptoms-list`).css("color","black")
                  $(`#${id}`).css("color","#fd8d3c")
                  $(`#${window.lastSelectedSymptom}`).css("color","red")
                })
                .on('mouseout', ()=> {
                   
                    $('.selectedSympBar').css('opacity','0');
                     $(`.symptoms-list`).css("color","black")
                  $(`#${window.lastSelectedSymptom}`).css("color","red")
                })
                .append('title')
                .text(matrixData[k][0] ? matrixData[k][0][ss] : "Missing information")

              }


            this.g.append('text')
            .attr('transform', `translate(${width -22 -25*k},${height-428})`)
            .text(transformPeriod((11-k)))
            .attr('font-size', '0.45rem');
              }



        }



        else{

            var i1=0;
            var i2=0;
            var i3=0;
            var i4 = 0;
             $('.symptoms-list').on("click", ()=>{
              if(this.patientId.length >1){

              var time = window.currentPeriod;
              var time_ind = time == 0 ? 0 : time == 1 ? 1 : time == 2 ? 2 : time == 3 ? 3 : time == 4 ? 4 : time == 5 ? 5 : time == 6 ? 6 : time == 7 ? 7 : time == 12 ? 8 : time == 24 ? 9: time == 48 ? 10 : 11;
              
              var sympText = ""+ window.lastSelectedSymptom
              
              i1=matrixData[time_ind].filter(m => m[ window.lastSelectedSymptom] == 0).length;
              i2=matrixData[time_ind].filter(m => m[ window.lastSelectedSymptom] > 0 && m[ window.lastSelectedSymptom] <6).length;
              i3=matrixData[time_ind].filter(m => m[ window.lastSelectedSymptom] > 5 && m[ window.lastSelectedSymptom] <10).length;
              i4=matrixData[time_ind].filter(m => m[ window.lastSelectedSymptom] == 10).length;
                $('#sympOverviewTitle').html("Patients for " +window.lastSelectedSymptom+":");
                if(!$("#show-percentages").is(":checked")){
                  $('#overview0R').html( i1);
                  $('#overview5R').html(i2 );
                  $('#overview9R').html(i3 );
                  $('#overview10R').html(i4);
                }
                else{
                  
                  $('#overview0R').html( ((i1/matrixData[time_ind].length *100).toFixed(2)) +"%");
                  $('#overview5R').html(((i2/matrixData[time_ind].length *100).toFixed(2)) +"%");
                  $('#overview9R').html(((i3/matrixData[time_ind].length *100).toFixed(2)) +"%");
                  $('#overview10R').html(((i4/matrixData[time_ind].length *100).toFixed(2)) +"%");
                }


            }})


          $('#ratings_legend').css('visibility','visible');
          $('#patientOverviewTitle').html('No. of patients per time point:');
          // $('#symptomOvervirePreTitle').html('No. of patients per rating categ');
          $('#sympOverviewTitle').css('visibility','visible');



          var length=[];
        for(var k = 0; k < 12; k ++){
           length.push(matrixData[k].length);
          for(i=0;i<28; i++){
            var h = 13/maxLen;
            var aux1 = 0;
            var aux2=0;
            var aux3=0;
            var aux4 =0;
            var l1 = 0;
            aux1 = matrixData[k].filter(m => m[symp[27-i]] == 0).length;
            if (aux1 >0){
              l1=aux1;
            }
            var l2 =0;
            aux2 =matrixData[k].filter(m => m[symp[27-i]] > 0 && m[symp[27-i]]<6 ).length;
            if( aux2 >0){
              l2= aux2;
            }
            var l3 = 0;
            aux3 = matrixData[k].filter(m => m[symp[27-i]] > 5 && m[symp[27-i]]<10 ).length
            if(aux3 > 0){
              l3=aux3;
            }
            var l4 =0;
            aux4= matrixData[k].filter(m => m[symp[27-i]] ==10 ).length
            if(aux4>0){
              l4=aux4;
            }

            
            var dif = maxLen - matrixData[k].length;
            var lmin=25;
            if ((l1 + l2 + l3+l4) >0)
            lmin =20/(l1+ l2+ l3+l4);


            var time = window.currentPeriod;
            var time_ind = time == 0 ? 0 : time == 1 ? 1 : time == 2 ? 2 : time == 3 ? 3 : time == 4 ? 4 : time == 5 ? 5 : time == 6 ? 6 : time == 7 ? 7 : time == 12 ? 8 : time == 24 ? 9 : time == 48 ? 10 : 11
            var Symp = window.lastSelectedSymptom;
            $('#sympOverviewTitle').html("Patients for " +Symp+":");
             if(!$("#show-percentages").is(":checked")){
              $('#overview0R').html(matrixData[time_ind].filter(m => m[Symp] == 0).length );
              $('#overview5R').html(matrixData[time_ind].filter(m => m[Symp] > 0 && m[Symp]<6 ).length );
              $('#overview9R').html(matrixData[time_ind].filter(m => m[Symp] > 5 && m[Symp]<10 ).length  );
              $('#overview10R').html(matrixData[time_ind].filter(m => m[Symp] ==10 ).length );
            }
          else{
              $('#overview0R').html(((matrixData[time_ind].filter(m => m[Symp] == 0).length /matrixData[time_ind].length *100).toFixed(2))+"%");
              $('#overview5R').html(((matrixData[time_ind].filter(m => m[Symp] > 0 && m[Symp]<6 ).length /matrixData[time_ind].length *100).toFixed(2))+"%");
              $('#overview9R').html(((matrixData[time_ind].filter(m => m[Symp] > 5 && m[Symp]<10 ).length /matrixData[time_ind].length *100).toFixed(2))+"%" );
              $('#overview10R').html(((matrixData[time_ind].filter(m => m[Symp] ==10 ).length /matrixData[time_ind].length *100).toFixed(2))+"%");
          }

             $("#show-percentages").on("click", ()=>{
               if(!$("#show-percentages").is(":checked")){

                  $('#overview0R').html(matrixData[time_ind].filter(m => m[Symp] == 0).length );
                  $('#overview5R').html(matrixData[time_ind].filter(m => m[Symp] > 0 && m[Symp]<6 ).length );
                  $('#overview9R').html(matrixData[time_ind].filter(m => m[Symp] > 5 && m[Symp]<10 ).length  );
                  $('#overview10R').html(matrixData[time_ind].filter(m => m[Symp] ==10 ).length );
               }
               else{
               $('#overview0R').html(((matrixData[time_ind].filter(m => m[Symp] == 0).length /matrixData[time_ind].length *100).toFixed(2))+"%");
              $('#overview5R').html(((matrixData[time_ind].filter(m => m[Symp] > 0 && m[Symp]<6 ).length /matrixData[time_ind].length *100).toFixed(2))+"%");
              $('#overview9R').html(((matrixData[time_ind].filter(m => m[Symp] > 5 && m[Symp]<10 ).length /matrixData[time_ind].length *100).toFixed(2))+"%" );
              $('#overview10R').html(((matrixData[time_ind].filter(m => m[Symp] ==10 ).length /matrixData[time_ind].length *100).toFixed(2))+"%");
               }
             })

            this.g.append('rect')
                .attr('class', 'sympBar ' +k)
                .attr('id', symp[27-i]+'-rect'+k)
                .attr('x',100+25*k)
                .attr('y', height -32-14.5*i)
                .attr('width', 20)
                .attr('height',13)
                .attr('fill', '#bdc9e1')
                .attr('opacity','0.2')
                .on('mouseover', function () {
                  var id = this['id'];
                  id = id.replace("-rect","");
                  var m = -1;
                  if(id.includes("10")){
                    m=3;
                    id = id.replace("10","")
                  }
                  if(id.includes("11")){
                    id = id.replace("11","")
                    m=4
                  }
                  if(id.includes("0")){
                    id = id.replace("0","")
                    m=0;
                  }
                  if (id.includes("1")){
                    m=1;
                    id = id.replace("1","")
                  }
                  if(id.includes("2")){
                    m=2;
                    id = id.replace("2","")
                  }
                  if(id.includes("3")){
                    m=3;
                    id = id.replace("3","")
                  }
                  if(id.includes("4")){
                    id = id.replace("4","")
                    m=4
                  }
                  if(id.includes("5")){
                    id = id.replace("5","")
                    m=5
                  }
                  if (id.includes("6")){
                    m=1;
                    id = id.replace("6","")
                  }
                  if(id.includes("7")){
                    m=2;
                    id = id.replace("7","")
                  }
                  if (id.includes("8")){
                    m=1;
                    id = id.replace("8","")
                  }
                  if(id.includes("9")){
                    m=2;
                    id = id.replace("9","")
                  }

                    const textt = transformTooltipText(id, maxLen,m,"empty")
                    tip.show(textt, this)
                    $(`#${id}-highlight`).css('opacity','1')
                    $(`.symptoms-list`).css("color","black")
                    $(`#${id}`).css("color","#fd8d3c")
                    $(`#${window.lastSelectedSymptom}`).css("color","red")
                })
                .on('mouseout', ()=> {
                   tip.hide()
                    $('.selectedSympBar').css('opacity','0');
                    $(`.symptoms-list`).css("color","black")

                    $(`#${window.lastSelectedSymptom}`).css("color","red")
                })
            this.g.append('rect')
                .attr('class', 'symp ' +k)
                .attr('id', symp[27-i]+'-rect'+k)
                .attr('x',100+25*k)
                .attr('y', height -32-14.5*i)
                .attr('width', l1*lmin)
                .attr('height', matrixData[k] ? h * matrixData[k].length : 0)
                .attr('fill', '#fee5d9')
                .attr('opacity','1')
                .on('mouseover', function () {
                  var m = -1;
                  var id = this['id'];
                  id = id.replace("-rect","");
                  if(id.includes("10")){
                    m=0;
                    id = id.replace("10","")
                  }
                  if (id.includes("11")){
                    m=1;
                    id = id.replace("11","")
                  }
                  if(id.includes("0")){
                    m=0;
                    id = id.replace("0","")
                  }
                  if (id.includes("1")){
                    m=1;
                    id = id.replace("1","")
                  }
                  if(id.includes("2")){
                    m=2;
                    id = id.replace("2","")
                  }
                  if(id.includes("3")){
                    m=3;
                    id = id.replace("3","")
                  }
                  if(id.includes("4")){
                    id = id.replace("4","")
                    m=4
                  }
                  if(id.includes("5")){
                    id = id.replace("5","")
                    m=5
                  }
                  if(id.includes("6")){
                    m=2;
                    id = id.replace("6","")
                  }
                  if(id.includes("7")){
                    m=3;
                    id = id.replace("7","")
                  }
                  if(id.includes("8")){
                    id = id.replace("8","")
                    m=4
                  }
                  if(id.includes("9")){
                    id = id.replace("9","")
                    m=5
                  }
                  d3.select(this)
                    .append("title")
                    .text(transformTooltipText(id, maxLen,m,"full") )
                    const textt = transformTooltipText(id, maxLen,m,"full")
                    tip.show(textt, this)
                  $(`#${id}-highlight`).css('opacity','1')
                  $(`.symptoms-list`).css("color","black")
                  $(`#${id}`).css("color","#fd8d3c")
                  $(`#${window.lastSelectedSymptom}`).css("color","red")
                })
                .on('mouseout', ()=> {
                   tip.hide()
                    $('.selectedSympBar').css('opacity','0');
                     $(`.symptoms-list`).css("color","black")

                  $(`#${window.lastSelectedSymptom}`).css("color","red")
                })

                  
           this.g.append('rect')
            .attr('class', 'symp '+k)
            .attr('id', symp[27-i]+'-rect'+k)
                .attr('x',100+25*k + l1*lmin)
                .attr('y',height -32-14.5*i)
                .attr('width', l2 * lmin)
                .attr('height',()=>{ return matrixData[k] ? h * matrixData[k].length : 0})
                .attr('fill', '#fcae91')
                .attr('opacity','1')
                .on('mouseover', function () {
                  var id = this['id'];
                  id = id.replace("-rect","");
                  var m = -1;
                  id = id.replace("-rect","");
                  if(id.includes("10")){
                    m=0;
                    id = id.replace("10","")
                  }
                  if (id.includes("11")){
                    m=1;
                    id = id.replace("11","")
                  }
                  if(id.includes("0")){
                    m=0;
                    id = id.replace("0","")
                  }
                  if (id.includes("1")){
                    m=1;
                    id = id.replace("1","")
                  }
                  if(id.includes("2")){
                    m=2;
                    id = id.replace("2","")
                  }
                  if(id.includes("3")){
                    m=3;
                    id = id.replace("3","")
                  }
                  if(id.includes("4")){
                    id = id.replace("4","")
                    m=4
                  }
                  if(id.includes("5")){
                    id = id.replace("5","")
                    m=5
                  }
                  if(id.includes("6")){
                    m=2;
                    id = id.replace("6","")
                  }
                  if(id.includes("7")){
                    m=3;
                    id = id.replace("7","")
                  }
                  if(id.includes("8")){
                    id = id.replace("8","")
                    m=4
                  }
                  if(id.includes("9")){
                    id = id.replace("9","")
                    m=5
                  } 

                    const textt =transformTooltipText(id, maxLen,m,"full")
                    tip.show(textt, this)
                  $(`#${id}-highlight`).css('opacity','1')
                  $(`.symptoms-list`).css("color","black")
                  $(`#${id}`).css("color","#fd8d3c")
                  $(`#${window.lastSelectedSymptom}`).css("color","red")
                })
                .on('mouseout', ()=> {
                   tip.hide()
                    $('.selectedSympBar').css('opacity','0');
                     $(`.symptoms-list`).css("color","black")
                      
                })


           this.g.append('rect')
            .attr('class', 'symp '+k)
            .attr('id', symp[27-i]+'-rect'+k)
                .attr('x',100+25*k+ l1*lmin + l2*lmin)
                .attr('y', height -32-14.5*i)
                .attr('width', l3 * lmin)
                .attr('height',()=>{ return matrixData[k] ? h * matrixData[k].length : 0})
                .attr('fill', '#fb6a4a')
                .attr('opacity','1')
                .on('mouseover', function () {
                  var id = this['id'];
                  id = id.replace("-rect","");
                  var m = -1;
                  id = id.replace("-rect","");
                  if(id.includes("10")){
                    m=0;
                    id = id.replace("10","")
                  }
                  if (id.includes("11")){
                    m=1;
                    id = id.replace("11","")
                  }
                  if(id.includes("0")){
                    m=0;
                    id = id.replace("0","")
                  }
                  if (id.includes("1")){
                    m=1;
                    id = id.replace("1","")
                  }
                  if(id.includes("2")){
                    m=2;
                    id = id.replace("2","")
                  }
                  if(id.includes("3")){
                    m=3;
                    id = id.replace("3","")
                  }
                  if(id.includes("4")){
                    id = id.replace("4","")
                    m=4
                  }
                  if(id.includes("5")){
                    id = id.replace("5","")
                    m=5
                  }
                  if(id.includes("6")){
                    m=2;
                    id = id.replace("6","")
                  }
                  if(id.includes("7")){
                    m=3;
                    id = id.replace("7","")
                  }
                  if(id.includes("8")){
                    id = id.replace("8","")
                    m=4
                  }
                  if(id.includes("9")){
                    id = id.replace("9","")
                    m=5
                  }

                    const textt = transformTooltipText(id, maxLen,m,"full")
                    tip.show(textt, this)
                  $(`#${id}-highlight`).css('opacity','1')
                  $(`.symptoms-list`).css("color","black")
                  $(`#${id}`).css("color","#fd8d3c")
                  $(`#${window.lastSelectedSymptom}`).css("color","red")
                })
                .on('mouseout', ()=> {
                   tip.hide()
                    $('.selectedSympBar').css('opacity','0');
                     $(`.symptoms-list`).css("color","black")

                      
                })

          this.g.append('rect')
            .attr('class', 'symp '+k)
            .attr('id', symp[27-i]+'-rect'+k)
                .attr('x',100+25*k + l1*lmin + l2*lmin + l3 * lmin)
                .attr('y', height -32-14.5*i)
                .attr('width', l4 * lmin)
                .attr('height',()=>{ return matrixData[k] ? h * matrixData[k].length : 0})
                .attr('fill', '#de2d26')
                .attr('opacity','1')
                .on('mouseover', function () {
                  var id = this['id'];
                  id = id.replace("-rect","");
                  var m = 0;
                  id = id.replace("-rect","");
                  var m = -1;
                  if(id.includes("10")){
                    m=0;
                    id = id.replace("10","")
                  }
                  if (id.includes("11")){
                    m=1;
                    id = id.replace("11","")
                  }
                  if(id.includes("0")){
                    m=0;
                    id = id.replace("0","")
                  }
                  if (id.includes("1")){
                    m=1;
                    id = id.replace("1","")
                  }
                  if(id.includes("2")){
                    m=2;
                    id = id.replace("2","")
                  }
                  if(id.includes("3")){
                    m=3;
                    id = id.replace("3","")
                  }
                  if(id.includes("4")){
                    id = id.replace("4","")
                    m=4
                  }
                  if(id.includes("5")){
                    id = id.replace("5","")
                    m=5
                  }
                  if(id.includes("6")){
                    m=2;
                    id = id.replace("6","")
                  }
                  if(id.includes("7")){
                    m=3;
                    id = id.replace("7","")
                  }
                  if(id.includes("8")){
                    id = id.replace("8","")
                    m=4
                  }
                  if(id.includes("9")){
                    id = id.replace("9","")
                    m=5
                  }

                    const textt = transformTooltipText(id, maxLen,m,"full")
                    tip.show(textt, this)
                  $(`#${id}-highlight`).css('opacity','1')
                  $(`.symptoms-list`).css("color","black")
                  $(`#${id}`).css("color","#fd8d3c")
                  $(`#${window.lastSelectedSymptom}`).css("color","red")
                })
                .on('mouseout', ()=> {
                   tip.hide()
                    $('.selectedSympBar').css('opacity','0');
                     $(`.symptoms-list`).css("color","black")

                      
                })
                if(selected_patient[k].length >0){
                  
                  var rating= selected_patient[k][0][symp[27-i]];
                  var l = rating == 0? 100+25*k + l1*lmin/2-2  : rating <6 && rating > 0 ? 100+25*k + l1*lmin + l2*lmin/2 -2: rating <10 && rating > 5?  100+25*k + l1*lmin + l2*lmin + l3*lmin/2-2 : 100+25*k+ l1*lmin + l2*lmin + l3*lmin +l4*lmin/2-2
                  
                  this.g.append('text')
                  .attr("class",i)
                    .attr('transform', `translate(${l},${height -27-14.5*i})`)
                    .text('+')
                    .attr('font-size', '0.45rem');
                }


          
    }
          this.g.append('text')
          .attr('transform', `translate(${width -22 -25*k},${height-428})`)
          .text(transformPeriod((11-k)))
          .attr('font-size', '0.5rem')

        }}

        this.g.append('text')
          .attr('transform', `translate(${width -25 -50*2.5},${height-447})`)
          .text("Time")
          .attr('font-size', '0.5rem')
          .attr('font-weight','bold');
        this.g.append('text')
          .attr('transform', `translate(${width -254},${height-7})`)
          .text("{")
          .attr('font-size', '0.5rem')
          this.g.append('text')
          .attr('transform', `translate(${width -104},${height-7})`)
          .text("}")
          .attr('font-size', '0.5rem')
          this.g.append('text')
          .attr('transform', `translate(${width -190},${height-7})`)
          .text("Acute")
          .attr('font-size', '0.5rem')
          this.g.append('text')
          .attr('transform', `translate(${width -102},${height-7})`)
          .text("{")
          .attr('font-size', '0.5rem')
          this.g.append('text')
          .attr('transform', `translate(${width -60},${height-7})`)
          .text("Late")
          .attr('font-size', '0.5rem')
          this.g.append('text')
          .attr('transform', `translate(${width -2},${height-7})`)
          .text("}")
          .attr('font-size', '0.5rem')


  }

  clear() {
    this.svg.selectAll('.stackPath').remove();
    this.svg.selectAll('.linePlots').remove();
    this.svg.selectAll('circle').remove();
    this.svg.selectAll('.stackTitle').remove();
    this.svg.selectAll('.symptomText').remove();
    this.svg.selectAll('.stackContainerAll').remove();
  }

  update(patientId, symptoms) {
    this.svg.selectAll('.stackContainerAll').remove();
    this.symptoms = symptoms;
    this.patientId = patientId;
    this.drawStackPlot(patientId, symptoms);
  }
}

export default StackedLinePlot;
