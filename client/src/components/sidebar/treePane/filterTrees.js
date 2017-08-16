import { removeLocationMarker } from 'Sidebar/locatePane/locate';
import getWhereCondition from 'Data/getWhereCond';
// import lanstyrDefault from 'Data/lanstyrDefault';
import { localStorageKeyExists, addToLocalStorage, getFromLocalStorage, storageAvailable } from 'Data/storeLocally';
import { getPointsSuccess } from 'Data/getPoints';
import makeAjaxCall from 'Data/makeAjaxCall';
import { buildTable, addRowClickHandler } from 'Sidebar/createTable';

function filterTrees(regionSel = 'Alla', circumferenceSel = 'Alla', treetypeSel = 'Alla', resultRecordCount = 1000) {
  removeLocationMarker();
  // var whereQuery = getWhereCondition(regionSel, circumferenceSel, treetypeSel);
  // var defaults = lanstyrDefault();
  // var data = defaults.data;
  // data.where = whereQuery;
  // data.resultRecordCount = resultRecordCount;
  const async = true;
  const success = function (response) {
    if (regionSel == 'Alla' && circumferenceSel == 'Alla' && treetypeSel == 'Alla') {
      addToLocalStorage('top500Habo', response);
    }
    getPointsSuccess(response);
    buildTable('.tree-table', response, true);
    addRowClickHandler();
  };
  const loadingScreen = true;
  // makeAjaxCall("localhost:3000/trees", data, defaults.type, defaults.datatype, async, success, defaults.error, loadingScreen);
  makeAjaxCall('http://localhost:3000/trees', success);
}

export { filterTrees };
