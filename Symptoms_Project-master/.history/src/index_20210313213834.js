import * as d3 from "d3";
import $ from 'jquery';
import _ from 'lodash';
require('bootstrap/dist/css/bootstrap.min.css');
window.$ = window.jQuery = $;
require('fomantic-ui-css/semantic');
require('fomantic-ui-css/semantic.min.css');
require('../assets/styles/main.scss')


import TimeSlider from './timeslider';
import SuppoortSlider from './supportslider';
import LiftSlider from './liftslider'
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
    this.sliderSupportUpdate = this.sliderSupportUpdate.bind(this);
    this.sliderLiftUpdate = this.sliderLiftUpdate.bind(this);
    this.patientHistory = null;
    this.onPatientSelect = this.onPatientSelect.bind(this);
    this.showStackPlot = this.showStackPlot.bind(this);
    this.onSymptomsSelect = this.onSymptomsSelect.bind(this);
    this.onPatientFilter = this.onPatientFilter.bind(this);
    this.clusterSymptoms = this.clusterSymptoms.bind(this);
    this.onFilterToggle = this.onFilterToggle.bind(this);
    this.onCategoryFilterReset = this.onCategoryFilterReset.bind(this);
    this.updateCategoryResetButton = this.updateCategoryResetButton.bind(this);
    this.selectSymptom = this.selectSymptom.bind(this);
    this.drawMatrix = this.drawMatrix.bind(this);
    this.showPatientNeighbors = this.showPatientNeighbors.bind(this);
    this.initLifts = this.initLifts.bind(this);
    this.showPatients2D = this.showPatients2D.bind(this);
    this.showRules = this.showRules.bind(this);
    this.patients = [];
    this.initSupportSlider = this.initSupportSlider.bind(this);

    this.patientFilters = [];
    this.filteredPatients = [];
    this.emptyPatientFilter = false;
    this.symptomsList = null;
    this.tendrilPlots = [];
    this.period = 0;
    this.clusteringSymptoms = [];
    this.supportSlider = null
    this.lastSelectedSymptom = 'nausea';
    this.symptoms = ['nausea', 'vomit', 'mucus', 'breath', 'choking', 'swallow', 'dryMouth', 'teeth', 'speech', 'taste', 'appetite', 'constipation',
      'sores', 'skin', 'pain', 'sleep', 'drowsiness', 'numbness', 'fatigue', 'distress', 'memory', 'sadness',
      'mood', 'enjoyment', 'activities', 'work', 'relations', 'walking'];
    this.allSymptoms = [...this.symptoms];
    // this.symptoms = ['breath','mucus','vomit','nausea'];
    this.symptoms = ['vomit', 'nausea'];
  }

  async initTimeSlider() {
    // const symptoms = await d3.csv('/data/datasets/symptoms.csv');
    const symptoms = await d3.csv('/data/mdasi_files/mdasi_all_timepoints.csv');
    const timePeriods = _.sortedUniq(
      symptoms.map(({ period }) => parseInt(period, 10)).sort((a, b) => a - b));
    const timeSlider = new TimeSlider('#time-slider', timePeriods, await this.sliderUpdate);
    timeSlider.init();
  }

  async initSupportSlider() {
    this.supportSlider = new SuppoortSlider('#support-slider', window.supportlabels, await this.sliderSupportUpdate);
    this.supportSlider.init();
  }
  async initLifts() {
    this.liftSlider = new LiftSlider('#lift-slider', window.liftlabels, await this.sliderSupportUpdate);
    this.liftSlider.init();
  }

  init() {
    
    window.supportlabels = ['0.20', "0.21", '0.22', '0.23', '0.24']
    window.currentSupport = 0.20
    window.liftlabels = ['2.5', "2.54", '2.6', '2.7', '2.8']
    window.currentLift = 2.5
    const transactionGraph = new SymptomsList()
    transactionGraph.init()
    window.freshTendril = 1;
    this.initTimeSlider()
    this.initSupportSlider();
    this.initLifts()
    this.showStackPlot(0);
    var i = 0;
    window.lastSelectedSymptom = 'nausea';
    window.selectedpatient = "";

    $('#patient-list').dropdown({
      maxSelections: 1,
      action: 'activate',
      onChange: this.onPatientSelect,

    });

    $("#resetTimeButton").on('click', function () {
      $('.stackPath').css('opacity', '0.6')
      $('circle').css('opacity', '0.65');
    })

    $(`#${this.lastSelectedSymptom}`).css("color", "red");
    $(".symptoms-list").on("click", this.selectSymptom);
    $("#Patients2D").on("click", this.showPatients2D);
    $(".rules_button").on("click", this.showRules);

    $("#SymptomRules").on("click", this.showPatients2D);

    $(".btn_without_categ").on("click", (event) => {
      $(`#${event.target.id}`).toggleClass("active")
    });
    $(".symptoms-list").on("click", (event) => {
      this.lastSelectedSymptom = event.target.id;
      window.lastSelectedSymptom = event.target.id;

      var element = event.target.id;
      $(".symptoms-list").css("color", "black");
      $(`#${element}`).css("color", "red");
      this.drawMatrix(event.target.id);
    });

    $(".symptoms-list").on("mouseover", (event) => {
      var s = event.target.id;
      $(`.symptoms-list`).css("color", "black")
      $(`#${s}`).css("color", "#fd8d3c")
      $(`#${window.lastSelectedSymptom}`).css("color", "red")
      $(`#${s}-highlight`).css('opacity', '1');
    });
    $(".symptoms-list").on("mouseout", (event) => {
      var s = event.target.id;
      $(`.symptoms-list`).css("color", "black");

      $(`#${s}-highlight`).css('opacity', '0');
      $(`#${window.lastSelectedSymptom}`).css("color", "red")
    });

    $("#show-patient").on("click", () => {
      this.onPatientSelect(this.patients);
    })

    $(".category-entry").on("click", this.onFilterToggle);
    $(".reset-category-filter").on("click", this.onCategoryFilterReset);
    $(".filters-symptoms-list").on("click", this.clusterSymptoms);
    $("#filtersResetButton").on("click", () => {
      for (var k = 0; k < $(".filters-list").length; k++) {
        var el = $(".filters-list")[k].id;
        $(`#${el}`).removeClass("active");
        this.updateCategoryResetButton(el);
      }
    });


    this.patientFilters = ["Male", "Female"];
    this.onPatientSelect();

    setTimeout(() => {
      $('.stackPath').css('opacity', '0.2');
      $('.tendrilCircle').css('opacity', '0');
    }, 20);

    $(document).on("click", (event) => {
      var idd = event.target.id;
      if (idd) {
        if ($(`#${idd}`).hasClass("leaf-patient")) {
          idd = idd.replace("leaf-", "");
          this.onPatientSelect([idd]);
          this.updatePatientIds(window.totalPatientsIds, idd)
        }
      }
    })


    $("#show-patient-nearest_neighbors").on("click", () => {
      this.showPatientNeighbors();
    })
    $("#show-mean-tendrils").on("click", () => {
      if( ! $(`#SymptomRules`).hasClass('active')){
        $('#selectedAcute').hide()

      }
      this.drawTendrilPlot(this.filteredPatients, this.symptoms);
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
    })

    $("#show-colored-tendrils").on("click", () => {
      if( ! $(`#SymptomRules`).hasClass('active')){
        $('#selectedAcute').hide()
      }
      this.drawTendrilPlot(this.filteredPatients, this.symptoms);
    })
    $('#cluster-trajectory').on("click", this.clusterSymptoms)

    $(`.rule`).addClass("active")
    $('#selectedAcute').css("display", "block");
  }

  async sliderLiftUpdate() {



  }

  async sliderSupportUpdate() {

    if (window.oldSupValue > 1 || window.oldLiftValue > 1) {
      const data_acute = await d3.csv('/data/mdasi_files/acuteTopRules.csv');
      const data_late = await d3.csv('/data/mdasi_files/lateTopRules.csv');
      var rules_acute = null
      var rules_late = null
      rules_acute = data_acute.filter(d => parseFloat(d['support']) >= parseFloat(window.supportlabels[window.oldSupValue - 1])
        && parseFloat(d['lift']) >= parseFloat(window.liftlabels[window.oldLiftValue - 1]))
      rules_late = data_late.filter(d => parseFloat(d['support']) >= parseFloat(window.supportlabels[window.oldSupValue - 1]) && parseFloat(d['lift']) >= parseFloat(window.liftlabels[window.oldLiftValue - 1]))

      $(`.graph_symptom_text`).css("opacity", "0.1")
      $(`.graph_circle`).css("opacity", "0.1")
      $(`.graph_line`).css("opacity", "0.1")


      rules_acute.forEach(rule => {
        const id = rule["rule_no"]

        $(`#rule_acute_${id}`).css("opacity", "1")
        const rule_acute_lhs = rule['lhs'].split(",")
        const rule_acute_rhs = rule["rhs"].split(",")

        rule_acute_rhs.forEach(r2 => {
          $(`#${r2}_acute_text`).css("opacity", "1")
          $(`.out_${id}.in_${r2}`).css("opacity", "1")
        })
        rule_acute_lhs.forEach(r => {
          $(`.out_${r}.in_${id}`).css("opacity", "1")
          $(`#${r}_acute_text`).css("opacity", "1")
        })
      })

      rules_late.forEach(rule => {
        const id = rule["rule_no"]

        $(`#rule_late_${id}`).css("opacity", "1")
        const rule_late_lhs = rule['lhs'].split(",")
        const rule_late_rhs = rule["rhs"].split(",")

        rule_late_rhs.forEach(r2 => {
          $(`#${r2}_late_text`).css("opacity", "1")
          $(`.out2_${id}.in2_${r2}`).css("opacity", "1")
        })
        rule_late_lhs.forEach(r => {
          $(`.out2_${r}.in2_${id}`).css("opacity", "1")
          $(`#${r}_late_text`).css("opacity", "1")
        })
      })


    }
    else {
      $(`.graph_circle`).css("opacity", "1")
      $(`.graph_symptom_text`).css("opacity", "1")
      $(`.graph_line`).css("opacity", "1")
    }

  }

  async showPatients2D(event) {
    var el = event.target.id
    if (el == 'Patients2D') {
      $('.circleLate').css("opacity", '0.65');
      $('.circleAcute').css("opacity", '0.65');
      $('.meanPathLate').css("opacity", '0.65');
      $('.meanPathAcute').css("opacity", '0.65');
      $('#selectedLate').hide();
      $('#selectedAcute').hide();
      $('#SymptomRules').removeClass("active");
      $('#RulesContainer').hide()
      $('#RulesContainer2').hide()
      $('#scatterplot').css('display', 'block')
      $(`.filters-symptoms-list`).removeClass("active")
      $('#rules_cluster_panel').hide()
      $('#patients_cluster_panel').css('display', 'block')
      $('#rules_filters_panel_title').hide()
      $('#patients_filters_panel_title').css('display', 'block')

    }
    if (el == 'SymptomRules') {
      $('#selectedAcute').css("display", "block");
      $('#Late').removeClass("active");
      $('.circleLate').css("opacity", '0.1');
      $('.circleAcute').css("opacity", '0.65');
      $('.meanPathLate').css("opacity", '0.1');
      $('.meanPathAcute').css("opacity", '0.65');
      $('#Acute').addClass("active");
      $(`#Patients2D`).removeClass("active");
      $('#scatterplot').hide()
      $('#RulesContainer').css('display', 'block')
      $(`.rule`).addClass("active")

      $('#patients_cluster_panel').hide()
      $('#rules_cluster_panel').css('display', 'block')

      $('#patients_filters_panel_title').hide()
      $('#rules_filters_panel_title').css('display', 'block')
    }

  }


  async showRules(event) {

    var el = event.target.id
    if (el == 'Late') {
      $('#selectedLate').css("display", "block");
      $('#selectedAcute').hide();
      $('#Acute').removeClass("active");
      $('#RulesContainer').hide()
      $('#RulesContainer2').css('opacity', '1')
      $('#RulesContainer2').css('display', 'block')
      $(`.rule`).removeClass("active")
      $(`.rule2`).addClass("active")
      $('.circleLate').css("opacity", '0.65');
      $('.circleAcute').css("opacity", '0.1');
      $('.meanPathLate').css("opacity", '0.65');
      $('.meanPathAcute').css("opacity", '0.1');
      window.supportlabels = ['0.20', "0.21", '0.22', '0.23', '0.26']
      window.liftlabels = ['2.1', "2.2", '2.3', '2.8', '2.9']
      this.supportSlider.onChange();
      this.liftSlider.onChange();


    }
    if (el == 'Acute') {
      $('.circleLate').css("opacity", '0.1');
      $('.circleAcute').css("opacity", '0.65');
      $('.meanPathLate').css("opacity", '0.1');
      $('.meanPathAcute').css("opacity", '0.65');
      $('#selectedAcute').css("display", "block");
      $('#selectedLate').hide();
      $('#Late').removeClass("active");
      $(`.rule2`).removeClass("active")
      $(`.rule`).addClass("active")
      $('#RulesContainer2').hide()
      $('#RulesContainer').css('display', 'block')
      window.supportlabels = ['0.20', "0.21", '0.22', '0.23', '0.24']
      window.liftlabels = ['2.5', "2.54", '2.6', '2.7', '2.8']
      this.supportSlider.onChange();
      this.liftSlider.onChange();
      if( ! $(`#SymptomRules`).hasClass('active')){
        $('#selectedAcute').hide()
      }

    }

  }

  async showPatientNeighbors() {
    if ($("#show-patient-nearest_neighbors").is(":checked")) {
      var p_highlight = "leaf-rect-" + this.patients[0];
      $(".leaf-rect").css('opacity', '0')
      $(`#${p_highlight}`).css('opacity', '0.3')
      const data_patient = await d3.csv('/data/mdasi_files/mdasi_new_patients_features_with_therapy2.csv');
      var patient = data_patient.find(p => p.patientId == this.patients[0])
      var patients = data_patient.filter(p => p.t_category == patient.t_category && p.gender == patient.gender && p.therapeutic_combination == patient.therapeutic_combination && p.patientId != patient.patientId && p.survival == patient.survival && p.outcome == patient.outcome)
      var ids = patients.map(p => { return parseInt(p.patientId) })
      ids.unshift(parseInt(patient.patientId))
      this.drawTendrilPlot(ids, this.symptoms);
      this.stackPlot.clear();
      this.stackPlot.update(ids, this.symptoms);
      this.highlightPatients(ids)
    }
    else {
      this.onPatientSelect(this.patients);
    }
  }

  async onFilterToggle(event) {
    var element = event.target.id;
    if (element) {
      if (!$(`#${element}`).hasClass("active"))
        $(`#${element}`).addClass("active");
      else
        $(`#${element}`).removeClass("active");

      this.updateCategoryResetButton(element);
    }
  }


  async updateCategoryResetButton(element) {
    if ($(".filters-symptoms-list.active").length > 0) {
      $("#filtersResetButton").removeClass("hidden");
    }
    else {
      $("#filtersResetButton").addClass("hidden");
    }
    var container = $(`#${element}`).parent();
    var resetButton = container.parent().find(".reset-category-filter");
    if (container.children(".category-entry:not(.active)").length < container.children().length) {
      resetButton.removeClass("hidden");
    }
    else {
      resetButton.addClass("hidden");
    }

    this.patientFilters = [];
    for (var i = 0; i < $(".filters-list.active").length; i++) {
      if (!this.patientFilters.includes($(".filters-list.active")[i].id))
        this.patientFilters.push($(".filters-list.active")[i].id)
    }
    if ($(`#${element}`).hasClass("filters-symptoms-list")) {
      this.onPatientFilter(this.period, true);
    }
    else {
      this.onPatientFilter(this.period);
    }

  }

  async onCategoryFilterReset(event) {
    var element = event.target.id;
    $(`#${element}`).parent().next(".category-entries-container").children(".category-entry").removeClass("active");
    $(`#${element}`).addClass("hidden");
    this.patientFilters = [];
    for (var i = 0; i < $(".filters-list.active").length; i++) {
      if (!this.patientFilters.includes($(".filters-list.active")[i].id))
        this.patientFilters.push($(".filters-list.active")[i].id)
    }
    if ($(`#${element}`).hasClass("reset-clustering")) {
      $(`#${element}`).parent().parent().next(".category-entries-container").children(".category-entry").removeClass("active");
      $(`#${element}`).addClass("hidden");
      this.patientFilters = [];
      for (var i = 0; i < $(".filters-list.active").length; i++) {
        if (!this.patientFilters.includes($(".filters-list.active")[i].id))
          this.patientFilters.push($(".filters-list.active")[i].id)
      }
      this.onPatientFilter(this.period, true);
    }
    else {
      this.onPatientFilter(this.period);
    }
    this.clusterSymptoms();
  }


  async clusterSymptoms() {
    this.clusteringSymptoms = [];
    for (var i = 0; i < $(".filters-symptoms-list.active").length; i++) {
      var id = $(".filters-symptoms-list.active")[i].id;
      id = id.slice(0, id.length - 6)
      if (!this.clusteringSymptoms.includes(id)) {
        this.clusteringSymptoms.push(id)
      }
    }
    await this.drawClusters(this.period, this.clusteringSymptoms)
  }

  async selectSymptom(event) {
    if (!this.symptoms.includes(`${event.target.id}`)) {
      this.symptoms.shift();
      this.symptoms.push(`${event.target.id}`);
      await this.onSymptomsSelect(this.symptoms);
      for (var j = 0; j < $('.symptoms-list').length; j++) {
        var id = $('.symptoms-list')[j].id;
        $(`#${id}`).removeClass("active");
      }
      for (var i = 0; i < this.symptoms.length; i++) {
        $(`#${this.symptoms[i]}`).addClass("active");
      }
      if (this.patients.length > 0 || this.filteredPatients.length > 0) {
        $('#lastSymp').css('font-size', '1.1em');
        $('.linePlots').css('opacity', '0.3');
        $('.lastLinePlots').css('stroke-width', '2')
        $('#lastSelectedsymp').css('display', 'block');
        setTimeout(function () {
          $('#lastSelectedsymp').css('display', 'none');
          $('#lastSymp').css('font-size', '1em');
          $('.linePlots').css('opacity', '0.6');
          $('.lastLinePlots').css('stroke-width', '1')

        }, 10);
      }
    }
    var a1 = this.symptoms.filter(v => ['sleep', 'drowsiness', 'numbness', 'fatigue', 'distress', 'memory', 'sadness', 'mood', 'enjoyment', 'activities', 'work', 'relations'].includes(v))
    var a2 = this.symptoms.filter(v => ['mucus', 'breath', 'dryMouth', 'teeth', 'speech', 'taste', 'appetite'].includes(v));
    var a3 = this.symptoms.filter(v => ['mucus', 'nausea', 'vomit', 'choking', 'swallow'].includes(v));

    if (a1.length > 0) {
      $("#brain").css("opacity", '0.2')
    }
    else {
      $("#brain").css("opacity", '0')
    }

    if (a2.length > 0) {
      $("#mouth").css("opacity", '0.2')
    }
    else {
      $("#mouth").css("opacity", '0')
    }

    if (a3.length > 0) {
      $("#throat").css("opacity", '0.2')
    }
    else {
      $("#throat").css("opacity", '0')
    }

  }


  async onSymptomsSelect(value) {

    var i;
    var sympList = [];
    for (i = 0; i < value.length; i++) {
      if (!sympList.includes(value[i])) {
        sympList.push(value[i])
      }
    }
    if (this.symptoms.length > 2) {
      this.symptoms.slice(this.symptoms.length - 2)
    }
    if (sympList.length > 2) {
      sympList.slice(sympList.length - 2)
    }
    if (this.filteredPatients.length > 0 && !$("#show-patient").is(":checked")) {
      if( ! $(`#SymptomRules`).hasClass('active')){
        $('#selectedAcute').hide()
      }
      this.drawTendrilPlot(this.filteredPatients, sympList);
    }
    this.symptoms = sympList;
  }


  async onPatientSelect(value) {
    
    $(".leaf-rect").css('opacity', '0')
    if (!value) { return; }
    this.patients = value;
    $("#overview0R").css("visibility", "visible")
    $("#overview10R").css("visibility", "visible")
    $("#overview5R").css("visibility", "visible")
    $("#overview9R").css("visibility", "visible")
    if (this.patients.length == 0) {
      window.selectedpatient = "";
      $("#show-patient").prop("checked", false);
      $(".show-patient-checkbox").css("visibility", "hidden")
      $("#show-patient-nearest_neighbors").prop("checked", false);
      $(".show-patient-checkbox-neighbors").css("visibility", "hidden")
      $(".show-percentages").css("visibility", "visible")


      this.onPatientFilter(window.currentPeriod)
      return;
    }
    else {
      window.selectedpatient = "" + this.patients[0];
      var patient_highlight = "leaf-rect-" + this.patients[0]

      $(".show-patient-checkbox").css("visibility", "visible")
      if ($("#show-patient").is(":checked")) {
        $(".show-percentages").css("visibility", "hidden")
        $("#show-patient-nearest_neighbors").prop("checked", false);
        $(".show-patient-checkbox-neighbors").css("visibility", "visible")
        $("#overview0R").css("visibility", "hidden")
        $("#overview10R").css("visibility", "hidden")
        $("#overview5R").css("visibility", "hidden")
        $("#overview9R").css("visibility", "hidden")
        if( ! $(`#SymptomRules`).hasClass('active')){
          $('#selectedAcute').hide()
        }
        this.drawTendrilPlot(this.patients, this.symptoms);
        this.highlightPatients(this.patients);
        this.stackPlot.clear();
        this.stackPlot.update(value, this.symptoms);
        $(".leaf-rect").css("opacity", '0')
      }
      else {
        $("#show-patient-nearest_neighbors").prop("checked", false);
        $(".show-patient-checkbox-neighbors").css("visibility", "hidden")
        await this.onPatientFilter(window.currentPeriod)
        $(`#${patient_highlight}`).css('opacity', '0.3')
        $(".show-percentages").css("visibility", "visible")
      }
    }
    window.selectedpatient = "" + this.patients[0];
    for (var i = 0; i < this.symptoms.length; i++) {
      $(`#${this.symptoms[i]}`).addClass("active");
    }

  }


  async onPatientFilter(period, redrawTendrils) {

    if (this.patientFilters.length == 0) {
      this.patientFilters = ["Male", "Female"]
    }


    const data = await this.loadDataset(parseInt(window.currentPeriod), this.clusteringSymptoms);
    var i = 0;
    var patients = [];
    var totalPatients = [];
    var ratingsFilter = [];
    var genderFilter = [];
    var therapyFilter = [];
    var tumorFilter = [];
    var outcomeFilter = [];
    this.emptyPatientFilter = false;
    if (this.patientFilters.includes("T1")) {
      patients = (data.filter(d => d.t_category == "T1"));
      patients.forEach(el => tumorFilter.push(el));
    }
    if (this.patientFilters.includes("T2")) {
      patients = (data.filter(d => d.t_category == "T2"));
      patients.forEach(el => tumorFilter.push(el));
    }

    if (this.patientFilters.includes("T3")) {
      patients = (data.filter(d => d.t_category == "T3"));
      patients.forEach(el => tumorFilter.push(el));

    }
    if (this.patientFilters.includes("T4")) {
      patients = (data.filter(d => d.t_category == "T4"));
      patients.forEach(el => tumorFilter.push(el));
    }
    if (this.patientFilters.includes("ICRad")) {
      patients = (data.filter(d => d.therapeutic_combination == "IC+Radiation alone"));
      patients.forEach(el => therapyFilter.push(el));

    }
    if (this.patientFilters.includes("CCRad")) {
      patients = (data.filter(d => d.therapeutic_combination == "CC+Radiation alone"));
      patients.forEach(el => therapyFilter.push(el));

    }
    if (this.patientFilters.includes("ICCCR")) {
      patients = (data.filter(d => d.therapeutic_combination == "IC+Radiation alone+CC"));
      patients.forEach(el => therapyFilter.push(el));

    }
    if (this.patientFilters.includes("Radiation")) {
      patients = (data.filter(d => d.therapeutic_combination == "Radiation alone"));
      patients.forEach(el => therapyFilter.push(el));
    }
    if (this.patientFilters.includes("Female")) {
      patients = (data.filter(d => d.gender == "Female"));
      patients.forEach(el => genderFilter.push(el));

    }
    if (this.patientFilters.includes("Male")) {
      patients = (data.filter(d => d.gender == "Male"));
      patients.forEach(el => genderFilter.push(el));
    }

    if (this.patientFilters.includes("Mild")) {
      patients = (data.filter(d => d.cluster == 0));
      patients.forEach(el => ratingsFilter.push(el));

    }
    if (this.patientFilters.includes("Severe")) {
      patients = (data.filter(d => d.cluster == 1));
      patients.forEach(el => ratingsFilter.push(el));

    }
    if (this.patientFilters.includes("Negative")) {

      patients = (data.filter(d => d.outcome == -1 || d.survival == "0"));
      patients.forEach(el => outcomeFilter.push(el));

    }
    if (this.patientFilters.includes("Positive")) {
      patients = (data.filter(d => d.outcome == 1 && d.survival == "1"));
      patients.forEach(el => outcomeFilter.push(el));

    }

    if (therapyFilter.length > 0) {
      if (totalPatients.length < 1) {
        totalPatients = therapyFilter;
      }
      else {
        var x = [];
        for (i = 0; i < therapyFilter.length; i++) {
          if (totalPatients.includes(therapyFilter[i])) {
            x.push(therapyFilter[i]);
            this.emptyPatientFilter = false;
          }
        }
        if (x.length < 1)
          this.emptyPatientFilter = true;
        totalPatients = x;

      }

    }
    if (ratingsFilter.length > 0) {
      if (totalPatients.length < 1 && therapyFilter.length < 1) {
        totalPatients = ratingsFilter;
      }
      else {
        var x = [];
        for (i = 0; i < ratingsFilter.length; i++) {
          if (totalPatients.includes(ratingsFilter[i])) {
            this.emptyPatientFilter = false;
            x.push(ratingsFilter[i]);
          }
        }
        if (x.length < 1)
          this.emptyPatientFilter = true;
        totalPatients = x;
      }

    }
    if (genderFilter.length > 0) {
      if (totalPatients.length < 1 && ratingsFilter.length < 1 && therapyFilter.length < 1) {
        totalPatients = genderFilter;
      }
      else {
        var x = [];
        for (i = 0; i < genderFilter.length; i++) {
          if (totalPatients.includes(genderFilter[i])) {
            this.emptyPatientFilter = false;
            x.push(genderFilter[i]);
          }
        }
        if (x.length < 1)
          this.emptyPatientFilter = true;
        totalPatients = x;
      }
    }

    if (tumorFilter.length > 0) {
      if (totalPatients.length < 1 && ratingsFilter.length < 1 && genderFilter.length < 1 && therapyFilter.length < 1) {
        totalPatients = tumorFilter;
      }
      else {
        var x = [];
        for (i = 0; i < tumorFilter.length; i++) {
          if (totalPatients.includes(tumorFilter[i])) {
            this.emptyPatientFilter = false;
            x.push(tumorFilter[i]);
          }
        }
        if (x.length < 1)
          this.emptyPatientFilter = true;
        totalPatients = x;
      }
    }
    if (outcomeFilter.length > 0) {

      if (totalPatients.length < 1 && ratingsFilter.length < 1 && genderFilter.length < 1 && therapyFilter.length < 1 && tumorFilter.length < 1) {
        totalPatients = outcomeFilter;

      }
      else {
        var x = [];
        for (i = 0; i < outcomeFilter.length; i++) {
          if (totalPatients.includes(outcomeFilter[i])) {
            this.emptyPatientFilter = false;
            x.push(outcomeFilter[i]);
          }
        }
        if (x.length < 1)
          this.emptyPatientFilter = true;
        totalPatients = x;
      }
    }


    if (this.emptyPatientFilter == true) {
      if (this.patients.length > 0) {
        this.highlightPatients(this.patients);
      }
      else
        this.highlightPatients('none');
    }
    else {
      if (this.patients.length > 0 && totalPatients.length == []) {
        this.highlightPatients(this.patients);
      }
      else {
        var p = totalPatients.map(d => d.patientId)
        if (!p.includes(this.patients[0]))
          p.push(this.patients[0])
      }
      this.highlightPatients(p);

    }


    this.filteredPatients = totalPatients.map(el => el.patientId);

    if (this.patients.length > 0 && !this.filteredPatients.includes(this.patients[0])) {
      this.filteredPatients.push(this.patients[0])
    }
    if (this.filteredPatients.length > 0) {
      this.stackPlot.clear();
      this.stackPlot.update(this.filteredPatients, this.symptoms);
      if (!redrawTendrils) {
        if( ! $(`#SymptomRules`).hasClass('active')){
          $('#selectedAcute').hide()
        }
        setTimeout(() => {
          this.drawTendrilPlot(this.filteredPatients, []);
          window.freshTendril = 0;
          for (var i = 0; i < this.symptoms.length; i++) {
            $(`#${this.symptoms[i]}`).addClass("active");
          }

        }, 10);
      }
      return;
    }
    else {

      for (var i = 0; i < this.symptoms.length; i++) {
        $(`#${this.symptoms[i]}`).removeClass("active");
      }
      this.stackPlot.clear();
      this.stackPlot.update([], []);

      if (!redrawTendrils) {
        if( ! $(`#SymptomRules`).hasClass('active')){
          $('#selectedAcute').hide()
        }
        setTimeout(() => {
          this.drawTendrilPlot();
          window.freshTendril = 0;

        }, 10);
      }

    }


  }


  async loadDataset(period, symptoms, patientId) {
    const patients = await d3.csv('/data/mdasi_files/mdasi_new_patients_features_with_therapy2.csv');
    const clusters = await d3.csv(`/data/output/week_${period}.csv`);
    var filename = ''
    if (!symptoms || symptoms.length == 0) {
      filename = `C:/Users/carla/Desktop/Symptoms_Project-master/Symptoms_Project-master/data/mdasi_files/week_${period}.csv`;
      var symptoms = this.allSymptoms;
      if (!patientId) {
        var patientId = []
        const response = await fetch("http://localhost:5000/", { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename, symptoms, patientId }) });
        const filtered_clusters = await response.json();
        const f = []
        for (var i = 0; i < clusters.length; i++) {
          if (filtered_clusters[i])
            f.push(filtered_clusters[i])
          else
            break;
        }
        const data = f
          .filter(cluster => patients.find(patient => patient.patientId == cluster['patientId']))
          .map(cluster => ({ ...cluster, ...patients.find(patient => patient.patientId == cluster['patientId']) }))
          .sort((a, b) => a.patientId - b.patientId)
          .map(({ cluster, sum, gender, patientId, t_category, therapeutic_combination, PC1, PC2, outcome, survival }) => ({
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
          if( ! $(`#SymptomRules`).hasClass('active')){
            $('#selectedAcute').hide()
          }
        return data;
      }
    }
    else {
      if (!patientId) {
        var patientId = []
        filename = `C:/Users/carla/Desktop/Symptoms_Project-master/Symptoms_Project-master/data/mdasi_files/week_${period}.csv`;
        const response = await fetch("http://localhost:5000/", { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename, symptoms, patientId }) });
        const filtered_clusters = await response.json();
        const f = []
        for (var i = 0; i < clusters.length; i++) {
          if (filtered_clusters[i])
            f.push(filtered_clusters[i])
          else
            break;
        }

        const data = f
          .filter(cluster => patients.find(patient => patient.patientId == cluster['patientId']))
          .map(cluster => ({ ...cluster, ...patients.find(patient => patient.patientId == cluster['patientId']) }))
          .sort((a, b) => a.patientId - b.patientId)
          .map(({ cluster, sum, gender, patientId, t_category, therapeutic_combination, PC1, PC2, outcome, survival }) => ({
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
          if( ! $(`#SymptomRules`).hasClass('active')){
            $('#selectedAcute').hide()
          }
        return data;
      }
      else {
        filename = `C:/Users/carla/Desktop/Symptoms_Project-master/Symptoms_Project-master/data/mdasi_files/week_${period}.csv`;
        const response = await fetch("http://localhost:5000/", { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename, symptoms, patientId }) });
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
    var stop_index = 0;
    ids.forEach((id) => {
      const optionEl = $('<option></option>', { value: id });
      optionEl.text(id);
      selectEl.append(optionEl);
      if (id == parseInt(selectedId))
        stop_index = index
      else
        index = index + 1;
    })
    if (selectedId) {
      $('#patient-list').dropdown('clear');
      selectEl[0][stop_index].selected = 'selected';

    }

  }


  async sliderUpdate(period) {
    const correlatedIndex = 0;
    this.period = period;
    this.drawClusters(period, this.clusteringSymptoms)
    $('#patient-list').dropdown('clear');
    this.patients = []
    await this.onPatientFilter();
    window.freshTendril = 1;
    this.drawMatrix(this.lastSelectedSymptom)
  }

  async drawMatrix(symptom) {
    var result = []
    const matrixData = await d3.csv(`/data/mdasi_files/mdasi_corr-${window.currentPeriod}.csv`);

    for (var i = 0; i < 28; i++) {
      result.push(matrixData[i][symptom])
    }
    result = result.reverse();
    if (!this.correlationMatrix && matrixData.length > 0) {
      this.correlationMatrix = new CorrelationMatrix('#matrix', 350, window.innerHeight / 3, result);
      this.correlationMatrix.init();
    } else {
      this.correlationMatrix.clear();
      this.correlationMatrix.update(result);
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
    if (this.patients.length > 0) {
      this.showPatientNeighbors()
    }
    else
      this.highlightPatients(this.filteredPatients)
      if( ! $(`#SymptomRules`).hasClass('active')){
        $('#selectedAcute').hide()
      }
  }


  async drawTendrilPlot(patientIds, symptoms) {

    $(".tendrilsPath").css('stroke', '#83aad4')
    $(".tendrilCircle").css('stroke', '83aad4')
    if (!$('#Late').hasClass("active")) {
      $('#RulesContainer2').hide()
    }
    if (this.tendrilPlots && this.tendrilPlots.length > 0) {
      this.tendrilPlots.forEach(plot => plot.svg.remove());
      this.tendrilPlots = [];
    }
    if (!patientIds || patientIds.length < 1) {
      if (this.filteredPatients.length < 1 || this.patients.length == 0) {
        return;
      }
    }
    const data = await d3.csv('/data/mdasi_files/mdasi_all_timepoints.csv');
    const data_patient = await d3.csv('/data/mdasi_files/mdasi_new_patients_features_with_therapy2.csv');
    const patients = patientIds.map(patientId => data.filter(d => d.patientId === patientId.toString()));
    const p = patients;


    if ($("#show-mean-tendrils").is(":checked")) {
      const mean_patient = data.filter(el => el['patientId'] == this.patients[0])
      for (var i = 0; i < this.symptoms.length; i++) {
        const final_mean = mean_patient.map((e) => e[this.symptoms[this.symptoms.length - i - 1]])
        const tendrilPlot = new TendrilPlot('#tendril', 340, 300, [], this.symptoms[this.symptoms.length - i - 1], final_mean);
        tendrilPlot.init();
        this.tendrilPlots.push(tendrilPlot);
      }


      $("#showTherapyForTendril").css("opacity", "1")
    }
    else {
      $("#showTherapyForTendril").css("opacity", "0")
    }
    if (this.filteredPatients.length > 1 && !$("#show-patient").is(":checked") && !$("#show-patient-nearest_neighbors").is(":checked") && !$("#show-mean-tendrils").is(":checked")) {
      const colors = ['#66a61e', '#9854cc', '#058f96', '#DA8A00', '#803e3b'];
      const patientDataSelected = [];
      patients.forEach(patient => {
        const id = patient[0].patientId;
        const p_surv = data_patient.filter(d => d.patientId == id).map((p) => { return parseInt(p.survival) })
        const p_with_survival = p.filter(d => d[0].patientId == id)
        p_with_survival['survival'] = p_surv;
        patientDataSelected.push(p_with_survival);

      });

      for (var i = 0; i < this.symptoms.length; i++) {
        const tendrilPlot = new TendrilPlot('#tendril', 340, 300, patientDataSelected, this.symptoms[this.symptoms.length - i - 1]);
        tendrilPlot.init();
        this.tendrilPlots.push(tendrilPlot);
        if ($("#show-colored-tendrils").is(":checked")) {
          var icr = data_patient.filter(p => p.therapeutic_combination == 'IC+Radiation alone').map(patient => { return patient.patientId })
          var r = data_patient.filter(p => p.therapeutic_combination == 'Radiation alone').map(patient => { return patient.patientId })
          var icrcc = data_patient.filter(p => p.therapeutic_combination == 'IC+Radiation alone+CC').map(patient => { return patient.patientId })
          var ccr = data_patient.filter(p => p.therapeutic_combination == 'CC+Radiation alone').map(patient => { return patient.patientId })
          icr.forEach(p => {
            if (patientIds.includes(p)) {
              $(`.${p}path `).css("stroke", '#058f96')
              $(`.${p}circle `).css("fill", '#058f96')

            }
          })
          r.forEach(p => {
            if (patientIds.includes(p)) {
              $(`.${p}path `).css("stroke", '#9854cc')
              $(`.${p}circle `).css("fill", '#9854cc')
            }
          })
          ccr.forEach(p => {
            if (patientIds.includes(p)) {
              $(`.${p}path `).css("stroke", '#4d9221')
              $(`.${p}circle `).css("fill", '#4d9221')

            }
          })
          icrcc.forEach(p => {
            if (patientIds.includes(p)) {
              $(`.${p}path `).css("stroke", 'orange')
              $(`.${p}circle `).css("fill", 'orange')

            }
          })
        }
      }
      if (this.patients.length > 0) {
        var patient_id = "" + this.patients[0]
        $(`.${patient_id}`).filter(".tendrilsPath").css('stroke', '#de2d26')
        $(`.${patient_id}`).filter(".tendrilCircle").css('stroke', '#de2d26')
        $(`.${patient_id}`).filter(".tendrilCircle").css("fill", "#de2d26")
      }
      return;
    }
    patients.forEach(patient => {
      const id = patient[0].patientId;
      const patientData = { patient, symptoms };
      const patientDataSelected = data_patient.filter(d => d.patientId == id)
      patientData['survival'] = patientDataSelected[0].survival

      if (this.tendrilPlots.length < 2) {
        const tendrilPlot = new TendrilPlot('#tendril', 340, 300, patientData);
        tendrilPlot.init();
        this.tendrilPlots.push(tendrilPlot);
        $(`#leaf-rect-${id}`).css('opacity', '0.15')
      }
    });
    $(`#leaf-rect-${this.patients[0]}`).css('opacity', '0.3')
    if (this.patients.length > 0) {
      var patient_id = "" + this.patients[0]
    }
    window.selectedpatient = [];

  }



  async showStackPlot(patientId) {

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

