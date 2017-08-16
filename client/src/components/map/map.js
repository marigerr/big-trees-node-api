// import $ from 'jquery';
// import 'leaflet';
// import 'leaflet/dist/leaflet.css';
import styles from 'Stylesheets/app.css';

import '../../../../node_modules/sidebar-v2/js/leaflet-sidebar.min';
import '../../../../node_modules/sidebar-v2/css/leaflet-sidebar.min.css';
import 'Stylesheets/sidebar.custom.css';
import { getPointsSuccess, getTreeCount } from 'Data/getPoints';
import { filterTrees } from 'Sidebar/treePane/filterTrees';
import { trees } from 'Data/models/treetype';
import { getPointSize } from 'Data/models/circumference';
import { isMobile } from 'App/app';
import { localStorageKeyExists, getFromLocalStorage } from 'Data/storeLocally';
import { buildTable, addRowClickHandler } from 'Sidebar/createTable';


const topo = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFyaWdlcnIiLCJhIjoiY2l6NDgxeDluMDAxcjJ3cGozOW1tZnV0NCJ9.Eb2mDsjDBmza-uhme0TLSA', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
  '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.streets',
});


const satellite = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
  attribution: 'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
});

// var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFyaWdlcnIiLCJhIjoiY2l6NDgxeDluMDAxcjJ3cGozOW1tZnV0NCJ9.Eb2mDsjDBmza-uhme0TLSA', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
//     '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//     'Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     id: 'mapbox.satellite'
// });

const baseLayers = {
  Topo: topo,
  Satellite: satellite,
};


const initBounds = L.latLngBounds(L.latLng(56.96162003401705, 13.088924617411951), L.latLng(58.147842301716636, 15.602056619493775));
const map = L.map('map', { layers: [topo] });// , center: latlng, zoom: 13, zoomControl : false
map.fitBounds(initBounds, { paddingBottomRight: [400, 0] });
// L.control.zoom( {position : 'bottomright'} ).addTo(map);
L.control.layers(baseLayers, {}, { position: 'topleft' }).addTo(map);

const sidebar = L.control.sidebar('sidebar', { position: 'right' }).addTo(map);
let geojsonLayer = L.geoJSON().addTo(map);
const legend = L.control({ position: 'bottomleft' });

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'legend');
  // for (var i = 1; i < trees.length; i++) {
  //     div.innerHTML +=
  //         '<i style="background:' + getColor(trees[i].id) + '"></i> ' + trees[i].id + '</br>';
  // }
  return div;
};

legend.addTo(map);

function initMap() {
  if (localStorageKeyExists('top500Habo')) {
    const response = getFromLocalStorage('top500Habo');
    // console.log(response);
    getPointsSuccess(response);
    buildTable('.tree-table', response, true);
    addRowClickHandler();
    // if (!isMobile){
    //     sidebar.open("locate");
    // }
    // getTreeCount();
  } else {
    const circumferenceSel = 'Alla';
    const treetypeSel = 'Alla';
    const regionSel = 'Alla';
    // var resultRecordCount = 500;
    filterTrees(regionSel, circumferenceSel, treetypeSel);
  }
}

function updateGeojsonLayer(geojson, mapViewPoint, zoom, keepZoomLevel) { // , filterCondition) {
  // console.log(geojson);

  let paddingBottomRight;
  map.removeLayer(geojsonLayer);

  geojsonLayer = L.geoJSON(geojson, { pointToLayer, onEachFeature }).addTo(map);
  // markers.addLayer(geojsonLayer);
  // map.addLayer(markers);
  if (mapViewPoint) {
    map.setView(mapViewPoint, zoom);
  } else if (!keepZoomLevel) {
    if (isMobile) {
      paddingBottomRight = [45, 0];
    } else {
      paddingBottomRight = [400, 0];
    }
    const bounds = geojsonLayer.getBounds();
    // console.log(geojsonLayer);

    const roughBoundsArea = calcRoughArea(bounds);
    if (roughBoundsArea < 0.005) {
      map.setView(bounds.getCenter(), 12);
    } else {
      map.fitBounds(bounds, { paddingBottomRight });
    }
  }
  // $(".overlay, #loading-message-well").fadeOut(2000);
}

function calcRoughArea(bounds) {
  const coord = bounds.toBBoxString().split(',');
  const roughArea = Math.abs((coord[0] - coord[2]) * (coord[1] - coord[3]));
}

function onEachFeature(feature, layer) {
  let popupContent = '';
  if (feature.properties) {
    popupContent += `Tradslag: ${feature.properties.Tradslag}</br>`;
    popupContent += `Stamomkret: ${feature.properties.Stamomkret} cm</br>`;
    popupContent += `Status: ${feature.properties.Tradstatus}</br>`;
    popupContent += `Plats: ${feature.properties.Lokalnamn}</br>`;
    popupContent += `Id: ${feature.properties.Id}</br>`;
  }

  layer.bindPopup(popupContent, { autoPanPaddingTopLeft: [65, 5], autoPanPaddingBottomRight: [45, 5] });
  if (!isMobile) {
    layer.on({
      mouseover(e) {
        layer = e.target;
        layer.openPopup();
      },
      mouseout(e) {
        layer = e.target;
        layer.closePopup();
      },
      // click: highlightFeature
    });
  }
  // $(".overlay").hide();
}

function pointToLayer(feature, latlng) {
  const radius = getPointSize(feature.properties.Stamomkret);
  return new L.CircleMarker(latlng, {
    radius,
    fillColor: getColor(feature.properties.Tradslag),
    color: getColor(feature.properties.Tradslag),
    weight: 1,
    opacity: 1,
    fillOpacity: 1,
    clickable: true,
  });
}

function getColor(treeType) {
  let color;
  const masterTreeArray = trees();
  $.each(masterTreeArray, (index, tree) => {
    if (treeType.match(tree.matchWith)) {
      color = tree.color;
      return false;
    }
  });
  return color;
}

function updateLegend(filteredTrees) {
  $('.legend.leaflet-control').empty();
  let newLegendContent = '';
  for (let i = 0; i < filteredTrees.length; i++) {
    if (filteredTrees[i].id != 'Alla') {
      newLegendContent += `<i style="background:${getColor(filteredTrees[i].id)}"></i> ${filteredTrees[i].id}</br>`;
    }
  }
  $('.legend.leaflet-control').html(newLegendContent);
}
function emptyMap() {
  map.removeLayer(geojsonLayer);
}

function setViewOpenPopup(point, zoom) {
  if (zoom) {
    map.setView(point, zoom);
  } else {
    map.setView(point);
  }
  $.each(map._layers, (index, layer) => {
    if (layer.feature) {
      if (point[0] == layer.feature.geometry.coordinates[1] && point[1] == layer.feature.geometry.coordinates[0]) {
        layer.openPopup();
        if (isMobile) {
          sidebar.close();
        }
        return false;
      }
    }
  });
}

export { initMap, map, sidebar, geojsonLayer, updateLegend, emptyMap, updateGeojsonLayer, setViewOpenPopup }; // vlocationMarker,

