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

 
  for (let i = 0; i < window.supportlabels.length ; i++) {
    this.labels[i] = window.supportlabels[i] ;
  }
  this.afterChange = afterChange;
}



 async init() {
    $(this.selector).slider({
      range:{
        max: window.supportlabels.length,
        min: 1,
      },
      start:[window.supportlabels[0], window.supportlabels[window.supportlabels.length-1]],
      connect: true,
      onChange: this.onChange.bind(this),
    });
    const { labels } = this;
    $(`${this.selector} ul li`).each(function (i) {
      $(this).text(window.supportlabels[i]);
    })

  

  }

  onChange(value) {
    window.currentSupport = window.supportlabels[value - 1];
    console.log(window.currentSupport)
    // $('#matrix > img').attr('src', `/assets/imgs/correlation/${window.currentPeriod}.svg`);
    $(`${this.selector} ul li`).each(function (i) {
      $(this).text(window.supportlabels[i]);
    })
  }
}

export default SuppoortSlider;
