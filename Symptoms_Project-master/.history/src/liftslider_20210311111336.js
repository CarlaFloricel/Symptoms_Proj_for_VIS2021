import $ from 'jquery';
import * as d3 from 'd3';

class LiftSlider {
  constructor(selector, timePeriods, afterChange, labels) {
    this.selector = selector;
    this.timePeriods = timePeriods;
    this.labels = labels || [...timePeriods];
  //   this.labels[0] = '0M';
  //   for (let i = 1; i < this.labels.length - 1; i++) {
  //     this.labels[i] = this.labels[i] + 'M';
  //   }
  //   this.labels[this.labels.length - 1] = '>24M';
  //   this.afterChange = afterChange;
  // }

 
  for (let i = 0; i < window.liftlabels.length ; i++) {
    this.labels[i] = window.liftlabels[i] ;
  }
  this.afterChange = afterChange;
}



 async init() {
    $(this.selector).slider({
      max: window.liftlabels.length,
      min: 1,
      onChange: this.onChange.bind(this),
    });
    const { labels } = this;
    $(`${this.selector} ul li`).each(function (i) {
      $(this).text(window.liftlabels[i]);
    })

  

  }

  onChange(value) {

    if(value){
     console.log(value)
      window.oldLiftValue = value
      
      window.currentLift = window.liftlabels[value - 1];
      
      // $('#matrix > img').attr('src', `/assets/imgs/correlation/${window.currentPeriod}.svg`);
      this.afterChange(window.currentLift);
      $(`${this.selector} ul li`).each(function (i) {
        $(this).text(window.liftlabels[i]);
      })
    }
    else{
      
      window.currentLift = window.liftlabels[window.oldLiftValue-1];
      
      // $('#matrix > img').attr('src', `/assets/imgs/correlation/${window.currentPeriod}.svg`);
      this.afterChange(window.liftlabels[window.oldLiftValue-1]);
      $(`${this.selector} ul li`).each(function (i) {
        $(this).text(window.liftlabels[i]);
      })
    }


  }
}

export default LiftSlider;
