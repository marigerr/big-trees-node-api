// import $ from 'jquery';
import getWhereCondition from 'Data/getWhereCond';
import makeAjaxCall from 'Data/makeAjaxCall';
import lanstyrDefault from 'Data/lanstyrDefault';
import { createSelect } from 'Sidebar/select';


const regions = [{ id: 'Alla', label: 'Alla' }, { id: 'Aneby', label: 'Aneby' }, { id: 'Eksjö', label: 'Eksjö' }, { id: 'Gislaved', label: 'Gislaved' }, { id: 'Gnosjö', label: 'Gnosjö' }, { id: 'Habo', label: 'Habo' }, { id: 'Jönköping', label: 'Jönköping' }, { id: 'Mullsjö', label: 'Mullsjö' }, { id: 'Nässjö', label: 'Nässjö' }, { id: 'Sävsjö', label: 'Sävsjö' }, { id: 'Tranås', label: 'Tranås' }, { id: 'Vaggeryd', label: 'Vaggeryd' }, { id: 'Vetlanda', label: 'Vetlanda' }, { id: 'Värnamo', label: 'Värnamo' }];

function getRegionQueryText(regionSelection) {
  return regionSelection == 'Alla' ? 'Kommun IS NOT NULL' : `(Kommun='${regionSelection}')`;
}

function getRegions(regionSel = 'Alla', circumferenceSel = 100, treetypeSel = 'Alla') {
  const whereQuery = getWhereCondition(regionSel, circumferenceSel, treetypeSel);

  const defaults = lanstyrDefault();

  const success = getRegionsSuccess;

  const data = defaults.data;
  data.where = whereQuery;
  data.returnGeometry = false;
  data.outSR = null;
  data.outFields = 'Kommun';
  data.orderByFields = null;
  data.returnDistinctValues = true;

  makeAjaxCall(defaults.url, data, defaults.type, defaults.datatyp, true, success, defaults.error);
}

var getRegionsSuccess = function (response) { // getCircumferenceRangeSuccess;
  const regions = [{ id: 'Alla', label: 'Alla' }];
  $.each(response.features, (index, value) => {
    const obj = { id: value.attributes.Kommun, label: value.attributes.Kommun };
    regions.push(obj);
  });
  createSelect('.filterSelect.region-select', regions);
};

export { regions, getRegionQueryText, getRegions };
