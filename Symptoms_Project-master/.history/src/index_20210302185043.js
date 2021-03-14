import * as d3 from "d3";
import $ from 'jquery';
import _ from 'lodash';
// import 'bootstrap';
require('bootstrap/dist/css/bootstrap.min.css');
window.$ = window.jQuery = $;
require('fomantic-ui-css/semantic');
require('fomantic-ui-css/semantic.min.css');


import TimeSlider from './timeslider';
import ScatterPlot from './scatterplot';
import StackedLinePlot from './stackedLinePlot';
import TendrilPlot from './tendrilplot';
import CorrelationMatrix from './correlationmatrix';
import SymptomsList from "./symptomsList";


class App {
  constructor() {
    this.scatterPlot = null;
    this.stackPlot = null;
    this.sliderUpdate = this.sliderUpdate.bind(this);
    this.patientHistory = null;
    this.onPatientSelect = this.onPatientSelect.bind(this);
    this.showStackPlot = this.showStackPlot.bind(this);
    this.onSymptomsSelect = this.onSymptomsSelect.bind(this);
    this.onPatientFilter = this.onPatientFilter.bind(this);
    this.drawFilteredClusters = this.drawFilteredClusters.bind(this);
    this.clusterSymptoms = this.clusterSymptoms.bind(this);
    this.onFilterToggle = this.onFilterToggle.bind(this);
    this.onCategoryFilterReset = this.onCategoryFilterReset.bind(this);
    this.updateCategoryResetButton = this.updateCategoryResetButton.bind(this);
    this.selectSymptom= this.selectSymptom.bind(this);
    this.drawMatrix = this.drawMatrix.bind(this);
    this.showPatientNeighbors =this.showPatientNeighbors.bind(this);
    this.showPatients2D = this.showPatients2D.bind(this);
    this.patients = [];
    this.symptoms = [];
    this.patientFilters = [];
    this.filteredPatients = []
    this.emptyPatientFilter = false;
    this.symptomsList = null;
    this.tendrilPlots = [];
    this.period = 0;
    this.clusteringSymptoms = [];
    this.lastSelectedSymptom = 'nausea';
    this.symptoms = ['nausea', 'vomit','mucus', 'breath', 'choking',  'swallow','dryMouth','teeth','speech','taste','appetite','constipation', 
    'sores','skin', 'pain','sleep', 'drowsiness', 'numbness','fatigue', 'distress','memory', 'sadness',
    'mood','enjoyment','activities', 'work', 'relations', 'walking'];
    this.allSymptoms = [...this.symptoms];
    this.symptoms = ['breath','mucus','vomit','nausea'];
  }

  async initTimeSlider() {
    // const symptoms = await d3.csv('/data/datasets/symptoms.csv');
    const symptoms = await d3.csv('/data/mdasi_files/mdasi_all_timepoints.csv');
    const timePeriods = _.sortedUniq(
      symptoms.map(({ period }) => parseInt(period, 10)).sort((a, b) => a - b));
    const timeSlider = new TimeSlider('#time-slider', timePeriods, await this.sliderUpdate);
    timeSlider.init();
  }

  init() {
    const transactionGraph = new SymptomsList()
    transactionGraph.init()
    window.freshTendril = 1;
    this.initTimeSlider();
    this.showStackPlot(0);
    var i = 0;
    window.lastSelectedSymptom = 'nausea';
    window.selectedpatient="";

    $('#patient-list').dropdown({
      maxSelections: 1,
      action: 'activate',
      onChange: this.onPatientSelect,

    });

    $("#resetTimeButton").on('click', function(){
      $('.stackPath').css('opacity','0.6')
      $('circle').css('opacity','1');
    })

    $(`#${this.lastSelectedSymptom}`).css("color","red");
    $(".symptoms-list").on("click", this.selectSymptom);
    $("#Patients2D").on("click", this.showPatients2D);
    $("#SymptomRules").on("click", this.showPatients2D);
    
    $(".symptoms-list").on("click", (event) => {
      this.lastSelectedSymptom = event.target.id;
      window.lastSelectedSymptom=event.target.id;

      var element = event.target.id;
       $(".symptoms-list").css("color","black");
        $(`#${element}`).css("color","red");
      this.drawMatrix(event.target.id);
    });

     $(".symptoms-list").on("mouseover", (event) => {

      var s = event.target.id;

      $(`.symptoms-list`).css("color","black")
      $(`#${s}`).css("color","#fd8d3c")
      $(`#${window.lastSelectedSymptom}`).css("color","red")
      $(`#${s}-highlight`).css('opacity','1');
    });
    $(".symptoms-list").on("mouseout", (event) => {
      var s = event.target.id;
      $(`.symptoms-list`).css("color","black");
      
      $(`#${s}-highlight`).css('opacity','0');
      $(`#${window.lastSelectedSymptom}`).css("color","red")
    });
   
   $("#show-patient").on("click",() => {
    this.onPatientSelect(this.patients);
   } )


    $(".category-entry").on("click", this.onFilterToggle);
    $(".reset-category-filter").on("click", this.onCategoryFilterReset);
    $(".filters-symptoms-list").on("click", this.clusterSymptoms);
    $("#filtersResetButton").on("click",()=>{
      for(var k = 0; k < $(".filters-list").length ; k++){
         var el = $(".filters-list")[k].id;
        $(`#${el}`).removeClass("active");
        this.updateCategoryResetButton(el);
      }
    });


    this.patientFilters = ["Male", "Female"];
    this.onPatientSelect();
    
     setTimeout(()=> {
      $('.stackPath').css('opacity','0.2');
      $('.tendrilCircle').css('opacity','0');


      }, 2000);

         $(document).on("click", (event) =>{
          var idd = event.target.id;
          if(idd){
           if ($(`#${idd}`).hasClass("leaf-patient")){
              idd=idd.replace("leaf-","");
               this.onPatientSelect([idd]);
               this.updatePatientIds(window.totalPatientsIds,idd)
           }
         }})


      $("#show-patient-nearest_neighbors").on("click",() => {
        this.showPatientNeighbors();
      })
      $("#show-colored-tendrils").on("click",() => {
        this.drawTendrilPlot(this.filteredPatients, this.symptoms);
     } )
    $('#cluster-trajectory').on("click",this.clusterSymptoms)
      
      // this.loadDataset(window.currentPeriod, this.symptoms)
   
         
  }


  async showPatients2D(event){
      var el = element.target.id
      // if(el == 'SymptomRules'){
      //   $(`#${el}`).removeClass("active");
      //   $('#Patients2D').removeClass("active");
      // }
      // if(el == 'Patients2D'){
      //   $(`#${el}`).removeClass("active");
      //   $('#SymptomRules').removeClass("active");
      // }
  }

  async showPatientNeighbors(){

    if($("#show-patient-nearest_neighbors").is(":checked")){

      var p_highlight= "leaf-rect-" + this.patients[0];

      
      $(".leaf-rect").css('opacity','0') 
      $( `#${p_highlight}`).css('opacity','0.3')
      // const data_patient = await d3.csv('/data/datasets/patients_complete_with_survival.csv');
      const data_patient = await d3.csv('/data/mdasi_files/mdasi_new_patients_features_with_therapy2.csv');


      var patient = data_patient.find(p => p.patientId == this.patients[0])


      var patients = data_patient.filter(p => p.t_category == patient.t_category && p.gender == patient.gender && p.therapeutic_combination == patient.therapeutic_combination && p.patientId != patient.patientId && p.survival == patient.survival && p.outcome == patient.outcome)
      var ids =  patients.map(p => {return parseInt( p.patientId)})
      ids.unshift(parseInt(patient.patientId))



      // const data = await this.loadDataset(parseInt(window.currentPeriod), this.clusteringSymptoms,this.patients[0]);
      // data.unshift(this.patients[0])
           this.drawTendrilPlot(ids, this.symptoms);
           this.stackPlot.clear();
           this.stackPlot.update(ids, this.symptoms);
           this.highlightPatients(ids)
    }
    else{
      this.onPatientSelect(this.patients);
    }
  }

  async  onFilterToggle(event){
    var element = event.target.id;
    console.log(element)
    if(element){
      if (!$(`#${element}`).hasClass("active"))
        $(`#${element}`).addClass("active");
      else
        $(`#${element}`).removeClass("active");
      
      this.updateCategoryResetButton(element);
    }
  }


  async updateCategoryResetButton(element){
    if($(".filters-symptoms-list.active").length > 0){
      $("#filtersResetButton").removeClass("hidden");
    }
    else{
      $("#filtersResetButton").addClass("hidden");
    }
    var container = $(`#${element}`).parent();
    var resetButton = container.parent().find(".reset-category-filter");
    if (container.children(".category-entry:not(.active)").length < container.children().length){
      resetButton.removeClass("hidden");
    }
    else{
      resetButton.addClass("hidden");
    }

      this.patientFilters = [];
          for(var i = 0; i < $(".filters-list.active").length; i++){
            if( !this.patientFilters.includes( $(".filters-list.active")[i].id))
            this.patientFilters.push($(".filters-list.active")[i].id)
        }
      if($(`#${element}`).hasClass("filters-symptoms-list")){
        this.onPatientFilter(this.period,true);
      }
      else{
        this.onPatientFilter(this.period);
      }
      
  }

  async onCategoryFilterReset(event){

    var element = event.target.id;
    
    $(`#${element}`).parent().next(".category-entries-container").children(".category-entry").removeClass("active");
    $(`#${element}`).addClass("hidden");
        this.patientFilters = [];
          for(var i = 0; i < $(".filters-list.active").length; i++){
            if( !this.patientFilters.includes( $(".filters-list.active")[i].id))
            this.patientFilters.push($(".filters-list.active")[i].id)
        }
      if($(`#${element}`).hasClass("reset-clustering")){
        $(`#${element}`).parent().parent().next(".category-entries-container").children(".category-entry").removeClass("active");
        $(`#${element}`).addClass("hidden");
            this.patientFilters = [];
              for(var i = 0; i < $(".filters-list.active").length; i++){
                if( !this.patientFilters.includes( $(".filters-list.active")[i].id))
                this.patientFilters.push($(".filters-list.active")[i].id)
            }
        this.onPatientFilter(this.period,true);
      }
      else{
        this.onPatientFilter(this.period);
      }
      this.clusterSymptoms();
  }


  async clusterSymptoms(){

    this.clusteringSymptoms = [];
    for(var i = 0; i <  $(".filters-symptoms-list.active").length; i++){
      var id =  $(".filters-symptoms-list.active")[i].id;

      id = id.slice(0,id.length - 6)
      if(! this.clusteringSymptoms.includes(id)){
        this.clusteringSymptoms.push(id)
      }
    }

    await this.drawClusters(this.period, this.clusteringSymptoms)
  }

  async drawFilteredClusters(period, symptoms){
   // await this.drawClusters(period,symptoms);
  }

  async selectSymptom(event) {
    var allSymp = this.allSymptoms;
    if(!this.symptoms.includes(`${event.target.id}`)){
        this.symptoms.shift();
        this.symptoms.push(`${event.target.id}`);
       await this.onSymptomsSelect(this.symptoms);
        for(var j = 0; j < $('.symptoms-list').length; j++){
          var id = $('.symptoms-list')[j].id;
           $(`#${id}`).removeClass("active");
        }
        for(var i = 0; i < this.symptoms.length; i++){
          $(`#${this.symptoms[i]}`).addClass("active");
        }
        if(this.patients.length > 0 || this.filteredPatients.length >0){
          $('#lastSymp').css('font-size','1.1em');
          $('.linePlots').css('opacity','0.3');
          $('.lastLinePlots').css('stroke-width','2')
          $('#lastSelectedsymp').css('display','block');
          setTimeout(function() {
             $('#lastSelectedsymp').css('display','none');
             $('#lastSymp').css('font-size','1em');
             $('.linePlots').css('opacity','0.6');
             $('.lastLinePlots').css('stroke-width','1')

          }, 1000);  
        }
      }
      var a1 = this.symptoms.filter(v => ['sleep','drowsiness', 'numbness','fatigue', 'distress','memory', 'sadness','mood','enjoyment','activities', 'work', 'relations' ].includes(v))
      var a2 = this.symptoms.filter(v => ['mucus', 'breath', 'dryMouth','teeth','speech','taste','appetite'].includes(v));
      var a3 =  this.symptoms.filter(v => ['mucus','nausea','vomit', 'choking',  'swallow'].includes(v));

      if(a1.length>0){
        $("#brain").css("opacity",'0.2')
      }
      else{
        $("#brain").css("opacity",'0')
      }

      if(a2.length>0){
        $("#mouth").css("opacity",'0.2')
      }
      else{
        $("#mouth").css("opacity",'0')
      }

      if(a3.length>0){
        $("#throat").css("opacity",'0.2')
      }
      else{
        $("#throat").css("opacity",'0')
      }
  }


  async onSymptomsSelect(value) {

    var i;
    var sympList = [];
    for(i =0; i<value.length;i++){
      if(!sympList.includes(value[i])){
        sympList.push(value[i])
      }
    }
    if(this.symptoms.length >4){
      this.symptoms.slice(this.symptoms.length-4)
    }
    if(sympList.length >4){
      sympList.slice(sympList.length-4)
    }
    if(this.filteredPatients.length >0 && ! $("#show-patient").is(":checked")){
       this.drawTendrilPlot(this.filteredPatients, sympList);
    } 
    this.symptoms = sympList;
  }


  async onPatientSelect(value) {

    $(".leaf-rect").css('opacity','0')
    if(!value)
      {return;}
    this.patients = value;

    if (this.patients.length == 0 ) {
      window.selectedpatient="";
      $("#show-patient").prop("checked", false);
      $(".show-patient-checkbox").css("visibility","hidden")
      $("#show-patient-nearest_neighbors").prop("checked", false);
      $(".show-patient-checkbox-neighbors").css("visibility","hidden")
       $(".show-percentages").css("visibility","visible")
      this.onPatientFilter(window.currentPeriod)
      return;
    }
    else{
      window.selectedpatient=""+this.patients[0];
      var patient_highlight = "leaf-rect-"+this.patients[0]

      $(".show-patient-checkbox").css("visibility","visible")
      if ($("#show-patient").is(":checked")){
        $(".show-percentages").css("visibility","hidden")
        $("#show-patient-nearest_neighbors").prop("checked", false);
        $(".show-patient-checkbox-neighbors").css("visibility","visible")
       
        this.drawTendrilPlot(this.patients, this.symptoms);
        this.highlightPatients(this.patients);
        this.stackPlot.clear();
        this.stackPlot.update(value, this.symptoms);
         $(".leaf-rect").css("opacity",'0')
      }
      else{
        $("#show-patient-nearest_neighbors").prop("checked", false);
        $(".show-patient-checkbox-neighbors").css("visibility","hidden")
        //$(".show-percentages").css("visibility","visible")
        await this.onPatientFilter(window.currentPeriod)
        $( `#${patient_highlight}`).css('opacity','0.3')
        $(".show-percentages").css("visibility","visible")
      }
       
    }

    window.selectedpatient=""+this.patients[0];
    for(var i = 0; i < this.symptoms.length; i++){
      $(`#${this.symptoms[i]}`).addClass("active");
    }
  }


  async onPatientFilter(period, redrawTendrils){
      if(this.patientFilters.length == 0){
        this.patientFilters=["Male", "Female"]
      }
      const data = await this.loadDataset(parseInt(window.currentPeriod), this.clusteringSymptoms);
      var i =0;
      var patients = [];
      var totalPatients = [];
      var ratingsFilter = [];
      var genderFilter = [];
      var therapyFilter = [];
      var tumorFilter = [];
      var outcomeFilter = [];
      this.emptyPatientFilter = false;
      if(this.patientFilters.includes("T1")){
        patients = (data.filter(d => d.t_category == "T1"));
        patients.forEach(el => tumorFilter.push(el));
      }
      if(this.patientFilters.includes("T2")){
        patients = (data.filter(d => d.t_category == "T2"));
         patients.forEach(el => tumorFilter.push(el));
      }

      if(this.patientFilters.includes("T3")){
        patients = (data.filter(d => d.t_category == "T3"));
        patients.forEach(el => tumorFilter.push(el));
       
      }
      if(this.patientFilters.includes("T4")){
        patients = (data.filter(d => d.t_category == "T4"));
         patients.forEach(el => tumorFilter.push(el));
      }
      if(this.patientFilters.includes("CC")){
        patients = (data.filter(d => d.therapeutic_combination == "CC"));
        patients.forEach(el => therapyFilter.push(el));
       
      }
      if(this.patientFilters.includes("IC")){
        patients = (data.filter(d => d.therapeutic_combination == "IC"));
         patients.forEach(el => therapyFilter.push(el));
      }
      if(this.patientFilters.includes("ICCC")){
        patients = (data.filter(d => d.therapeutic_combination == "IC+CC"));
         patients.forEach(el => therapyFilter.push(el));
      }

      if(this.patientFilters.includes("ICRad")){
        patients = (data.filter(d => d.therapeutic_combination == "IC+Radiation alone"));
        patients.forEach(el => therapyFilter.push(el));
       
      }
      if(this.patientFilters.includes("CCRad")){
        patients = (data.filter(d => d.therapeutic_combination == "CC+Radiation alone"));
        patients.forEach(el => therapyFilter.push(el));
       
      }
      if(this.patientFilters.includes("ICCCR")){
        patients = (data.filter(d => d.therapeutic_combination == "IC+Radiation alone+CC"));
        patients.forEach(el => therapyFilter.push(el));
       
      }
      if(this.patientFilters.includes("Radiation")){
        patients = (data.filter(d => d.therapeutic_combination == "Radiation alone"));
         patients.forEach(el => therapyFilter.push(el));
      }
      if(this.patientFilters.includes("NoTherapy")){
        patients = (data.filter(d => d.therapeutic_combination == "None" ));
         patients.forEach(el => therapyFilter.push(el));
      }

      if(this.patientFilters.includes("Female")){
        patients = (data.filter(d => d.gender == "Female"));
        patients.forEach(el => genderFilter.push(el));
       
      }
      if(this.patientFilters.includes("Male")){
        patients = (data.filter(d => d.gender == "Male"));
         patients.forEach(el => genderFilter.push(el));
      }

      if(this.patientFilters.includes("Mild")){
        patients = (data.filter(d => d.cluster == 0));
        patients.forEach(el => ratingsFilter.push(el));
       
      }
      if(this.patientFilters.includes("Severe")){
        patients = (data.filter(d => d.cluster == 1));
         patients.forEach(el => ratingsFilter.push(el));

      }
      if(this.patientFilters.includes("Negative")){

        patients = (data.filter(d => d.outcome == -1 || d.survival == "0"));
        patients.forEach(el => outcomeFilter.push(el));
       
      }
      if(this.patientFilters.includes("Positive")){
       patients = (data.filter(d => d.outcome == 1 && d.survival == "1"));
         patients.forEach(el => outcomeFilter.push(el));

      }

      if(therapyFilter.length >0){
        if(totalPatients.length < 1){
          totalPatients = therapyFilter;
        }
        else{
          var x = [];
          for(i = 0; i < therapyFilter.length; i++){
            if(totalPatients.includes(therapyFilter[i])){
              x.push(therapyFilter[i]);
               this.emptyPatientFilter = false;
            }
          }
          if(x.length <1)
            this.emptyPatientFilter = true;
          totalPatients = x;

        } 

      }
      if(ratingsFilter.length >0){
        if(totalPatients.length <1 && therapyFilter.length <1){
         totalPatients = ratingsFilter;
        }
        else{
          var x = [];
          for(i = 0; i < ratingsFilter.length; i++){
            if(totalPatients.includes(ratingsFilter[i])){
              this.emptyPatientFilter = false;
              x.push(ratingsFilter[i]);
            }
          }
          if(x.length <1)
            this.emptyPatientFilter = true;
          totalPatients = x;
        } 

      }
      if(genderFilter.length >0){
        if(totalPatients.length <1 && ratingsFilter.length <1 && therapyFilter.length <1){
         totalPatients = genderFilter;
        }
        else{
          var x = [];
          for(i = 0; i < genderFilter.length; i++){
            if(totalPatients.includes(genderFilter[i])){
              this.emptyPatientFilter = false;
              x.push(genderFilter[i]);
            }
          }
          if(x.length <1)
            this.emptyPatientFilter = true;
          totalPatients = x;
        } 
      }

      if(tumorFilter.length >0){
        if(totalPatients.length <1 && ratingsFilter.length<1 && genderFilter.length <1 && therapyFilter.length <1){
         totalPatients = tumorFilter;
        }
        else{
          var x = [];
          for(i = 0; i < tumorFilter.length; i++){
            if(totalPatients.includes(tumorFilter[i])){
              this.emptyPatientFilter = false;
              x.push(tumorFilter[i]);
            }
          }
          if(x.length <1)
            this.emptyPatientFilter = true;
          totalPatients = x;
        } 
      }
      if(outcomeFilter.length >0){

        if(totalPatients.length <1 && ratingsFilter.length<1 && genderFilter.length <1 && therapyFilter.length <1 && tumorFilter.length <1){
         totalPatients = outcomeFilter;

        }
        else{
          var x = [];
          for(i = 0; i < outcomeFilter.length; i++){
            if(totalPatients.includes(outcomeFilter[i])){
              this.emptyPatientFilter = false;
              x.push(outcomeFilter[i]);
            }
          }
          if(x.length <1)
            this.emptyPatientFilter = true;
          totalPatients = x;
        } 
      }


      if(this.emptyPatientFilter == true){
        if(this.patients.length >0){
           this.highlightPatients(this.patients);
        }
        else
        this.highlightPatients('none');
      }
      else{
         if(this.patients.length >0 && totalPatients.length ==[]){
          this.highlightPatients(this.patients);
        }
        else{
          var p = totalPatients.map(d => d.patientId)
          if(!p.includes(this.patients[0]))
            p.push(this.patients[0])
        }
        this.highlightPatients(p);

      }


      this.filteredPatients = totalPatients.map(el => el.patientId);

      if(this.patients.length > 0 && !this.filteredPatients.includes(this.patients[0])){
        this.filteredPatients.push(this.patients[0])
      }
      if(this.filteredPatients.length >0){
          this.stackPlot.clear();
          this.stackPlot.update(this.filteredPatients, this.symptoms);
         if(!redrawTendrils){
          setTimeout(()=> {
            this.drawTendrilPlot(this.filteredPatients, []);
             
            window.freshTendril = 0;
            
              for(var i = 0; i < this.symptoms.length; i++){
                $(`#${this.symptoms[i]}`).addClass("active");
              } 
            
          }, 500);
        }
          return;
      }
      else{
        
          for(var i = 0; i < this.symptoms.length; i++){
            $(`#${this.symptoms[i]}`).removeClass("active");
          } 
        this.stackPlot.clear();
        this.stackPlot.update([], []);

        if(!redrawTendrils){
         
          setTimeout(()=> {
         this.drawTendrilPlot();
         window.freshTendril = 0;

      }, 500);
        }

      }

  }


  async loadDataset(period, symptoms, patientId) {
    // const patients = await d3.csv('/data/datasets/patients_complete_with_survival.csv');
    const patients =await d3.csv('/data/mdasi_files/mdasi_new_patients_features_with_therapy2.csv');
    // const clusters = await d3.csv(`/data/output/raw_result-time-${period}.csv`);
    const clusters = await d3.csv(`/data/output/week_${period}.csv`);
    var filename=''
    if(!symptoms || symptoms.length == 0){
      // if( $('#cluster-trajectory').is(":checked"))
         
      //    filename = `C:/Users/carla/Desktop/Symptoms_Project-master/Symptoms_Project-master/data/output/${period}_t.csv`;
    
      
      // else
        //  filename = `C:/Users/carla/Desktop/Symptoms_Project-master/Symptoms_Project-master/data/output/raw_result-time-${period}.csv`;
        filename = `C:/Users/carla/Desktop/Symptoms_Project-master/Symptoms_Project-master/data/mdasi_files/week_${period}.csv`;
      var symptoms = this.allSymptoms;
      if(!patientId){
      var patientId = []
      const response = await fetch("http://localhost:5000/", {method:'POST', mode: 'cors', headers:{'Content-Type': 'application/json'}, body: JSON.stringify({filename,symptoms, patientId}) });
      const filtered_clusters = await response.json();
      const f = []
      for (var i =0; i <clusters.length; i++){
        if(filtered_clusters[i])
          f.push(filtered_clusters[i])
        else
          break;
      }
      const data = f
      .filter(cluster => patients.find(patient => patient.patientId == cluster['patientId']))
      .map(cluster => ({ ...cluster, ...patients.find(patient => patient.patientId == cluster['patientId']) }))
      .sort((a, b) => a.patientId - b.patientId)
      .map(({ cluster,sum, gender, patientId, t_category,therapeutic_combination, PC1, PC2, outcome, survival }) => ({
        cluster: parseInt(cluster),
        sum,
        patientId,
        gender,
        t_category,
        therapeutic_combination,
        PC1,
        PC2,
        outcome,
        survival
      }));
      return data;
      }
      // else{
      //   const response = await fetch("http://localhost:5000/", {method:'POST', mode: 'cors', headers:{'Content-Type': 'application/json'}, body: JSON.stringify({filename,symptoms, patientId}) });
      //   const filtered_clusters = await response.json();
      //   console.log("4")
      //   return filtered_clusters;
      // }
    }
    else{
      if(!patientId){
      var patientId = []
    
      //   if( $('#cluster-trajectory').is(":checked"))
      //    filename = `C:/Users/carla/Desktop/Symptoms_Project-master/Symptoms_Project-master/data/output/${period}_t.csv`;
       
      // else
      //    filename = `C:/Users/carla/Desktop/Symptoms_Project-master/Symptoms_Project-master/data/output/raw_result-time-${period}.csv`;
      filename = `C:/Users/carla/Desktop/Symptoms_Project-master/Symptoms_Project-master/data/mdasi_files/week_${period}.csv`;
      const response = await fetch("http://localhost:5000/", {method:'POST', mode: 'cors', headers:{'Content-Type': 'application/json'}, body: JSON.stringify({filename,symptoms, patientId}) });
      const filtered_clusters = await response.json();
      const f = []
      for (var i =0; i <clusters.length; i++){
                if(filtered_clusters[i])
          f.push(filtered_clusters[i])
        else
          break;
      }
      
      const data = f
      .filter(cluster => patients.find(patient => patient.patientId == cluster['patientId']))
      .map(cluster => ({ ...cluster, ...patients.find(patient => patient.patientId == cluster['patientId']) }))
      .sort((a, b) => a.patientId - b.patientId)
      .map(({ cluster,sum, gender, patientId, t_category,therapeutic_combination, PC1, PC2, outcome, survival }) => ({
        cluster: parseInt(cluster),
        sum,
        patientId,
        gender,
        t_category,
        therapeutic_combination,
        PC1,
        PC2,
        outcome,
        survival
      }));

      return data;
      }
      else{
      //   if( $(`#cluster-trajectory`).is(":checked"))
      //    filename = `C:/Users/carla/Desktop/Symptoms_Project-master/Symptoms_Project-master/data/output/${period}_t.csv`;
      // else
      //    filename = `C:/Users/carla/Desktop/Symptoms_Project-master/Symptoms_Project-master/data/output/raw_result-time-${period}.csv`;
      filename = `C:/Users/carla/Desktop/Symptoms_Project-master/Symptoms_Project-master/data/mdasi_files/week_${period}.csv`;
        const response = await fetch("http://localhost:5000/", {method:'POST', mode: 'cors', headers:{'Content-Type': 'application/json'}, body: JSON.stringify({filename,symptoms, patientId}) });
        const filtered_clusters = await response.json();

        return filtered_clusters
        }
   }
  }

  async updatePatientIds(ids, selectedId) {

    $('.ui.dropdown:has(#patient-list) .default.text')
      .text(`Total: ${ids.size}`);

    const selectEl = $('#patient-list');
    selectEl.empty();
    var index = 0;
    var stop_index=0;
    ids.forEach((id) => {
      const optionEl = $('<option></option>', { value: id });
      optionEl.text(id);
      selectEl.append(optionEl);
      if (id == parseInt(selectedId))
        stop_index= index
      else
      index = index +1;
    })
    if(selectedId){
      $('#patient-list').dropdown('clear');
       selectEl[0][stop_index].selected='selected';
   
    }

      
  }



  async sliderUpdate(period) {
    const correlatedIndex = 0;
    this.period = period;
    this.drawClusters(period,this.clusteringSymptoms)
    $('#patient-list').dropdown('clear'); 
    this.patients =[]
    await this.onPatientFilter(); 
    window.freshTendril = 1;
    // await this.drawTendrilPlot();
   this.drawMatrix(this.lastSelectedSymptom)
  }

  async drawMatrix(symptom){
    var result = []
  // const matrixData = await d3.csv(`/data/output/correlation//corr-nou-${window.currentPeriod}.csv`);
  const matrixData = await d3.csv(`/data/mdasi_files/mdasi_corr-${window.currentPeriod}.csv`);

   for(var i = 0; i < 28; i++){
      result.push(matrixData[i][symptom])
   }
    result = result.reverse();
    if (!this.correlationMatrix && matrixData.length > 0) {
      this.correlationMatrix = new CorrelationMatrix('#matrix', 350,  window.innerHeight/3,result);
      this.correlationMatrix.init();
    } else {
      this.correlationMatrix.clear();
      this.correlationMatrix.update( result);
    }
  }

  async drawClusters(period, symptoms) {

    const data = await this.loadDataset(period, symptoms);
    const patientIds = data.map(({ patientId }) => parseInt(patientId));
    if (!this.scatterPlot && data.length > 0) {
      this.scatterPlot = new ScatterPlot('#scatterplot', 512, 480, data, this.selectPatient);
      await this.scatterPlot.init();
    } 
    else if (this.scatterPlot) {
      await this.scatterPlot.clear();
      await this.scatterPlot.update(data);
    }
    window.totalPatientsIds = patientIds;
    this.updatePatientIds(new Set(patientIds));
    if(this.patients.length > 0){
      this.showPatientNeighbors()
    }
    else
     this.highlightPatients(this.filteredPatients)
  }


  async drawTendrilPlot(patientIds, symptoms) {
    
    $(".tendrilsPath").css('stroke','#83aad4')
    $(".tendrilCircle").css('stroke','83aad4')

    if (this.tendrilPlots.length >0){

      this.tendrilPlots.forEach(plot => plot.svg.remove());
      this.tendrilPlots = [];
    }
    if (!patientIds || patientIds.length <1 ) {
      if(this.filteredPatients.length <1 || this.patients.length ==0){
      return; 
      }
    }

    // const data = await d3.csv('/data/datasets/symptoms.csv');
    // const data_patient = await d3.csv('/data/datasets/patients_complete_with_survival.csv');
    const data = await d3.csv('/data/mdasi_files/mdasi_all_timepoints.csv');
    const data_patient = await d3.csv('/data/mdasi_files/mdasi_new_patients_features_with_therapy2.csv');
        
    const patients = patientIds.map(patientId => data.filter(d => d.patientId === patientId.toString()));
    const p = patients;

   // if (patientIds.includes(patient.patientId)
    if (this.filteredPatients.length> 1 && ! $("#show-patient").is(":checked") && ! $("#show-patient-nearest_neighbors").is(":checked")){
      const colors = ['#66a61e', '#9854cc', '#058f96', '#DA8A00', '#803e3b' ];
      const patientDataSelected =[];
      patients.forEach(patient => {
        const id = patient[0].patientId;
        const p_surv = data_patient.filter(d => d.patientId == id).map((p) =>{return parseInt(p.survival)} )
        const p_with_survival = p.filter(d => d[0].patientId == id)
        p_with_survival['survival'] = p_surv;
        patientDataSelected.push(p_with_survival);

      });
      for (var i = 0; i < this.symptoms.length/2; i++){
        const tendrilPlot = new TendrilPlot('#tendril', 340, 300, patientDataSelected,this.symptoms[this.symptoms.length -i -1],colors[i] );
        tendrilPlot.init();
        this.tendrilPlots.push(tendrilPlot);
        if ($("#show-colored-tendrils").is(":checked")){
           var cc = data_patient.filter(p => p.therapeutic_combination =='CC').map(patient => {return patient.patientId})
           var icr = data_patient.filter(p => p.therapeutic_combination =='IC+Radiation alone').map(patient => {return patient.patientId})
           var ic = data_patient.filter(p => p.therapeutic_combination =='IC+CC').map(patient => {return patient.patientId})
           var r = data_patient.filter(p => p.therapeutic_combination =='Radiation alone').map(patient => {return patient.patientId})
           var icrcc = data_patient.filter(p => p.therapeutic_combination =='IC+Radiation alone+CC').map(patient => {return patient.patientId})
           var n = data_patient.filter(p => p.therapeutic_combination =='None').map(patient => {return patient.patientId})
           var ccr = data_patient.filter(p => p.therapeutic_combination =='CC+Radiation alone').map(patient => {return patient.patientId})
            icr.forEach(p =>{
              if(patientIds.includes(p)){
                  $(`.${p}path `).css("stroke",'#058f96')
                  $(`.${p}circle `).css("fill",'#058f96')

              }
            })
            r.forEach(p =>{
              if(patientIds.includes(p)){
                  $(`.${p}path `).css("stroke",'#9854cc')
                  $(`.${p}circle `).css("fill",'#9854cc')

              }
            })
            ic.forEach(p =>{
              if(patientIds.includes(p)){
                  $(`.${p}path `).css("stroke",'#DA8A00')
                  $(`.${p}circle `).css("fill",'#DA8A00')

              }
            })
            cc.forEach(p =>{
              if(patientIds.includes(p)){
                  $(`.${p}path `).css("stroke",'#803e3b')
                  $(`.${p}circle `).css("fill",'#803e3b')

              }
            })
            // n.forEach(p =>{
            //   if(patientIds.includes(p)){
            //       $(`.${p}path `).css("stroke",'#83aad4')
            //       $(`.${p}circle `).css("fill",'#83aad4')

            //   }
            // })
            ccr.forEach(p =>{
              if(patientIds.includes(p)){
                  $(`.${p}path `).css("stroke",'#4d9221')
                  $(`.${p}circle `).css("fill",'#4d9221')

              }
            })
            icrcc.forEach(p =>{
              if(patientIds.includes(p)){
                  $(`.${p}path `).css("stroke",'orange')
                  $(`.${p}circle `).css("fill",'orange')

              }
            })
          }
          
        }
      if(this.patients.length>0){
         var patient_id = ""+this.patients[0]
         $(`.${patient_id}`).filter(".tendrilsPath").css('stroke','#de2d26')
         $(`.${patient_id}`).filter(".tendrilCircle").css('stroke','#de2d26')
         $(`.${patient_id}`).filter(".tendrilCircle").css("fill","#de2d26")


      }
      // /window.selectedpatient = [];
      return;
    }

      patients.forEach(patient => {
        const id = patient[0].patientId;
        const patientData = { patient, symptoms };
        const patientDataSelected=data_patient.filter(d => d.patientId == id)
        patientData['survival'] = patientDataSelected[0].survival
        
        if(this.tendrilPlots.length <2){
        const tendrilPlot = new TendrilPlot('#tendril', 340, 300, patientData);
        tendrilPlot.init();
        this.tendrilPlots.push(tendrilPlot);
        $( `#leaf-rect-${id}`).css('opacity','0.15')

        } 
        
      });
       $( `#leaf-rect-${this.patients[0]}`).css('opacity','0.3')
      if(this.patients.length>0){
         var patient_id = ""+this.patients[0]
         // $(`.${patient_id}`).filter(".tendrilsPath").css('stroke','red')


      }
      window.selectedpatient = [];
}

  async showStackPlot(patientId) {
    // const patientInfo = await d3.csv('/data/datasets/symptoms.csv');
    const patientInfo = await d3.csv('/data/mdasi_files/mdasi_all_timepoints.csv');
    this.stackPlot = new StackedLinePlot(patientInfo, patientId);
    this.stackPlot.init();
  }


  async highlightPatients(patientIds) {
    if (!this.scatterPlot) return;
    this.scatterPlot.highlight(patientIds);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

