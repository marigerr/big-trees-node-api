// import $ from 'jquery';
import lanstyrDefault from 'Data/lanstyrDefault';
import { sidebar, updateGeojsonLayer, updateLegend } from 'Map/map';
import makeAjaxCall from 'Data/makeAjaxCall';
import convertToGeoJson from 'Data/convertToGeoJson';
// import getWhereCondition from 'Data/getWhereCond';
import { removeDuplicateTrees } from 'Data/models/treetype';
import { isMobile } from '../app';
// import { removeLocationMarker } from 'Sidebar/locatePane/locate';
import { addToLocalStorage } from 'Data/storeLocally';

let hitsCounter = 1000;
let geojson;

function getPointsSuccess(response, mapViewPoint, zoom, keepZoomLevel) {
  console.log('inside getpointssuccess');
  // console.log(response);

  hitsCounter = response.length;
  console.log(hitsCounter);

  if (response.length === 500) {
    $('.results').html('Visar första 500 resultat<br>Klicka på raden för att se mer info');
    $('.results').show();
  } else {
    $('.results').hide();
  }
  const result = convertToGeoJson(response);
  geojson = result.geojson;

  const treelist = result.trees;
  const noDupesTreeList = removeDuplicateTrees(treelist);
  // noDupesTreeList.sort(function(a,b) {return a.family.localeCompare(b.family);} ); 
  // eslint-disable-next-line
  noDupesTreeList.sort((a, b) => ((a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)));
  updateLegend(noDupesTreeList);

  updateGeojsonLayer(geojson, mapViewPoint, zoom, keepZoomLevel);
  // console.log(isMobile);
  if (isMobile) {
    sidebar.close();
  }
}

function getTreeCount() {
  const whereQuery = 'Kommun is not null';
  const defaults = lanstyrDefault();
  const data = defaults.data;
  data.where = whereQuery;
  const async = true;
  data.returnGeometry = false;
  data.outSR = null;
  data.orderByFields = null;
  data.returnCountOnly = true;
  const success = (response) => {
    addToLocalStorage('JkpgLanTreeCount', response.count);
  };
  makeAjaxCall(defaults.url, data, defaults.type, defaults.datatype, async, success, defaults.error);
}


export { getPointsSuccess, getTreeCount };
