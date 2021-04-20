import * as moment from 'moment';

export const options = {
  timelineChart: function (onStateChange: (event) => void = (event) => {
  }, onTooltipRecord: (record) => string = (record => {
    return 'a';
  })) {
    return {
      chart: {
        margin: {
          top: 40,
          right: 40,
          bottom: 60,
          left: 40
        },
        type: 'linePlusBarChart',
        showLabels: true,
        focusHeight: 100,
        focusMargin: {
          bottom: 60
        },
        color: ['#2ca02c', 'darkred'],
        height: 400,
        xAxis: {
          tickFormat: d => moment(d).format('hh:mm')
        },
        x2Axis: {
          tickFormat: d => moment(d).format('hh:mm')
        },
        dispatch: {
          stateChange: onStateChange,
          changeState: function (b, e) {
          },
          renderEnd: function (a, b) {
          }
        }
      }
    };
  }
};

