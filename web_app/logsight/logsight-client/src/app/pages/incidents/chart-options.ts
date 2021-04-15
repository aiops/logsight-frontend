import * as moment from 'moment';

export const options = {
    timelineChart: function (onStateChange: (event) => void = (event) => {
    }, onTooltipRecord: (record) => string = (record => {
      return '';
    })) {
      return {
        chart: {
          margin: {
            top: 40,
            right: 40,
            bottom: 60,
            left: 40
          },
          type: 'lineWithFocusChart',
          showLabels: true,
          focusHeight: 100,
          focusMargin: {
            bottom: 60
          },
          height: 400,
          xAxis: {
            tickFormat: d => moment(d).format('DD.MM.YYYY')
          },
          x2Axis: {
            tickFormat: d => moment(d).format('DD.MM.YYYY')
          },
          dispatch: {
            stateChange: onStateChange,
            changeState: function (b, e) {
            },
            renderEnd: function (a, b) {
            }
          },
          tooltip: {
            contentGenerator: onTooltipRecord
          }
        }
      };
    }

  }
;
