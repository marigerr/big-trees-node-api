// import $ from 'jquery';
import makeAjaxCall from 'Data/makeAjaxCall';
import lanstyrDefault from 'Data/lanstyrDefault';
import getWhereCondition from 'Data/getWhereCond';
import { createSelect } from 'Sidebar/select';

const circumference = [
  { range: 'Stamomkret > 0 ', querytext: 'Stamomkret > 0', pointsize: null, id: 'Alla', label: 'Alla' },
  { range: 'Stamomkret > 0 && Stamomkret < 250', querytext: 'Stamomkret BETWEEN 0 AND 250', pointsize: 3, id: '1', label: 'Under 250 cm' },
  { range: 'Stamomkret >= 250 && Stamomkret < 500', querytext: 'Stamomkret BETWEEN 251 AND 500', pointsize: 5, id: '2', label: '250-500 cm' },
  { range: 'Stamomkret >= 500 && Stamomkret < 750', querytext: 'Stamomkret BETWEEN 501 AND 750', pointsize: 7, id: '5', label: '500-750' },
  { range: 'Stamomkret >= 750 && Stamomkret < 1000', querytext: 'Stamomkret BETWEEN 751 AND 1000', pointsize: 10, id: '7', label: '750-1000' },
  { range: 'Stamomkret > 1000', querytext: 'Stamomkret > 1000', pointsize: 10, id: '10', label: 'Over 1000 cm' },
];

// TO DO --> look into if ok to use Eval() in this circumstance
function getPointSize(Stamomkret) {
  /* jshint ignore:start */
  return eval(circumference[1].range) ? circumference[1].pointsize :
    eval(circumference[2].range) ? circumference[2].pointsize :
      eval(circumference[3].range) ? circumference[3].pointsize :
        eval(circumference[4].range) ? circumference[4].pointsize :
          eval(circumference[5].range) ? circumference[5].pointsize :
            3;
  /* jshint ignore:end */             
}

function getCircumferenceQueryText(circumferenceSelection) {
  return circumferenceSelection == circumference[0].id ? `(${circumference[0].querytext})` :
    circumferenceSelection == circumference[1].id ? `(${circumference[1].querytext})` :
      circumferenceSelection == circumference[2].id ? `(${circumference[2].querytext})` :
        circumferenceSelection == circumference[3].id ? `(${circumference[3].querytext})` :
          circumferenceSelection == circumference[4].id ? `(${circumference[4].querytext})` :
            circumferenceSelection == circumference[5].id ? `(${circumference[5].querytext})` :
              '(Stamomkret > 0)';
}

function getCircumferenceRange(regionSel, circumferenceSel = 100, treetypeSel = 'Alla') {
  const outStats = JSON.stringify([{
    statisticType: 'min',
    onStatisticField: 'Stamomkret',
    outStatisticFieldName: 'minStamomkret',
  },
  {
    statisticType: 'max',
    onStatisticField: 'Stamomkret',
    outStatisticFieldName: 'maxStamomkret',
  },
  ]);

  const whereQuery = getWhereCondition(regionSel, circumferenceSel, treetypeSel);
  const defaults = lanstyrDefault();
  const success = getCircumSuccess;

  const data = defaults.data;
  data.where = whereQuery;
  data.outStatistics = outStats;
  data.returnGeometry = false;
  data.outSR = null;
  data.orderByFields = null;

  makeAjaxCall(defaults.url, data, defaults.type, defaults.datatyp, defaults.async, success, defaults.error);
}

var getCircumSuccess = function (response) {
  const Stamomkret = response.features[0].attributes.maxStamomkret;
  let filteredCircumference = [];
  let i = circumference.length - 1;
  for (i; i > 0; i--) {
    /* jshint ignore:start */
    if (eval(circumference[i].range)) {
      filteredCircumference = circumference.slice(0, i + 1);
      break;
    }
    /* jshint ignore:end */          
  }
  createSelect('.filterSelect.circumference-select', filteredCircumference);
};

export { circumference, getCircumferenceQueryText, getCircumferenceRange, getPointSize };

