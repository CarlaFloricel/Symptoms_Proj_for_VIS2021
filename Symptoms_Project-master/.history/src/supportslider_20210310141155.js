import $ from 'jquery';
import * as d3 from 'd3';

class SuppoortSlider {
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
    $(this.selector).slider({
      max: this.labels.length,
      min: 1,
      onChange: this.onChange.bind(this),
    });
    const { labels } = this;
    $(`${this.selector} ul li`).each(function (i) {
      $(this).text(labels[i]);
    })

  

  }

  onChange(value) {
    window.currentSupport = this.timePeriods[value - 1];
    // $('#matrix > img').attr('src', `/assets/imgs/correlation/${window.currentPeriod}.svg`);
    this.afterChange(window.currentSupport);
  }
}

export default SupportSlider;
