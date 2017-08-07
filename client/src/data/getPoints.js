//import $ from 'jquery';
import lanstyrDefault from 'Data/lanstyrDefault.js';
import { map, sidebar, geojsonLayer, updateGeojsonLayer, updateLegend } from 'Map/map.js';
import makeAjaxCall from 'Data/makeAjaxCall.js';
import convertToGeoJson from 'Data/convertToGeoJson.js';
import getWhereCondition from 'Data/getWhereCond.js';
import { removeDuplicateTrees } from 'Data/models/treetype.js';
import { isMobile } from '../app.js';
import { removeLocationMarker } from 'Sidebar/locatePane/locate.js';
import { localStorageKeyExists, addToLocalStorage, getFromLocalStorage, storageAvailable } from 'Data/storeLocally.js';

var hitsCounter = 1000;
var geojson;

function getPointsSuccess(response, mapViewPoint, zoom, keepZoomLevel) {
    console.log("inside getpointssuccess");
    console.log(response);
    
    
    hitsCounter = response.length;
    console.log(hitsCounter);

    if (response.length == 500) {
        $('.results').html("Visar första 500 resultat<br>Klicka på raden för att se mer info");
        $(".results").show();
    } else {
        $(".results").hide();    
    }
    var result = convertToGeoJson(response);
    geojson = result.geojson;

    var treelist = result.trees;
    var noDupesTreeList = removeDuplicateTrees(treelist);
    // noDupesTreeList.sort(function(a,b) {return a.family.localeCompare(b.family);} ); 
    noDupesTreeList.sort(function (a, b) { return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0); });
    updateLegend(noDupesTreeList);

    updateGeojsonLayer(geojson, mapViewPoint, zoom, keepZoomLevel);
    // console.log(isMobile);
    if (isMobile) {
        sidebar.close();
    }
}

function getTreeCount() {
    var whereQuery = "Kommun is not null";
    var defaults = lanstyrDefault();
    var data = defaults.data;
    data.where = whereQuery;
    var async = true;
    data.returnGeometry = false;
    data.outSR = null;
    data.orderByFields = null;
    data.returnCountOnly = true;
    var success = function (response) {
        addToLocalStorage("JkpgLanTreeCount", response.count);
    };
    makeAjaxCall(defaults.url, data, defaults.type, defaults.datatype, async, success, defaults.error);
}



export { getPointsSuccess, getTreeCount };
