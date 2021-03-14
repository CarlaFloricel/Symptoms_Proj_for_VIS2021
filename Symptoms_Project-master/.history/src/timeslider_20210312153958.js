import $ from 'jquery';
import * as d3 from 'd3';

class TimeSlider {
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

 
  for (let i = 0; i < this.labels.length ; i++) {
    this.labels[i] = this.labels[i] ;
  }
  this.afterChange = afterChange;
}



 async init() {

   const labels2=['0w', '1w', '2w', '3w', '4w', '5w', '6w', '7w', '3m', '6m', '12m', '18m']

    $(this.selector).slider({
      max: this.labels.length,
      min: 1,
      onChange: this.onChange.bind(this),
    });
    const { labels } = this;
    $(`${this.selector} ul li`).each(function (i) {
      $(this).text(labels2[i]);
    })

  

  }

  onChange(value) {
    window.currentPeriod = this.timePeriods[value - 1];
    $('#matrix > img').attr('src', `/assets/imgs/correlation/${window.currentPeriod}.svg`);
    this.afterChange(window.currentPeriod);
  }
}

export default TimeSlider;
