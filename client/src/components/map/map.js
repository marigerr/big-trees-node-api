// import $ from 'jquery';
// import 'leaflet';
// import 'leaflet/dist/leaflet.css';
import styles from 'Stylesheets/app.css';

import '../../../../node_modules/sidebar-v2/js/leaflet-sidebar.min.js';
import '../../../../node_modules/sidebar-v2/css/leaflet-sidebar.min.css';
import 'Stylesheets/sidebar.custom.css';
import { getPointsSuccess, getTreeCount } from 'Data/getPoints.js';
import { filterTrees } from 'Sidebar/treePane/filterTrees.js';
import {trees} from 'Data/models/treetype.js';
import { getPointSize } from 'Data/models/circumference.js';
import { isMobile } from 'App/app.js';
import { localStorageKeyExists, getFromLocalStorage } from 'Data/storeLocally.js';
import { buildTable, addRowClickHandler } from 'Sidebar/createTable.js';


var topo = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFyaWdlcnIiLCJhIjoiY2l6NDgxeDluMDAxcjJ3cGozOW1tZnV0NCJ9.Eb2mDsjDBmza-uhme0TLSA', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
});



var satellite = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
    attribution: 'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
});

// var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFyaWdlcnIiLCJhIjoiY2l6NDgxeDluMDAxcjJ3cGozOW1tZnV0NCJ9.Eb2mDsjDBmza-uhme0TLSA', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
//     '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//     'Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     id: 'mapbox.satellite'
// });

var baseLayers = {
    "Topo": topo,
    "Satellite": satellite
};


var initBounds = L.latLngBounds(L.latLng(56.96162003401705, 13.088924617411951), L.latLng(58.147842301716636, 15.602056619493775));
var map = L.map('map', { layers: [topo] });//, center: latlng, zoom: 13, zoomControl : false
map.fitBounds(initBounds, {paddingBottomRight: [400, 0]});
// L.control.zoom( {position : 'bottomright'} ).addTo(map);
L.control.layers(baseLayers, {}, { position: 'topleft' }).addTo(map);

var sidebar = L.control.sidebar('sidebar', { position: 'right' }).addTo(map);
var geojsonLayer = L.geoJSON().addTo(map);
var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    // for (var i = 1; i < trees.length; i++) {
    //     div.innerHTML +=
    //         '<i style="background:' + getColor(trees[i].id) + '"></i> ' + trees[i].id + '</br>';
    // }
    return div;
};

legend.addTo(map);

function initMap() {
    if (localStorageKeyExists("top500Habo")) {
        var response = getFromLocalStorage("top500Habo");
        console.log(response);
        getPointsSuccess(response);
        buildTable(".tree-table", response, true);
        addRowClickHandler();
        // if (!isMobile){
        //     sidebar.open("locate");
        // }
        // getTreeCount();
    } else {
        var circumferenceSel = "Alla";
        var treetypeSel = "Alla";
        var regionSel = "Alla";
        // var resultRecordCount = 500;
        filterTrees(regionSel, circumferenceSel, treetypeSel);
    }
}

function updateGeojsonLayer(geojson, mapViewPoint, zoom, keepZoomLevel) {//, filterCondition) {
  console.log(geojson);
  
    var paddingBottomRight;
    map.removeLayer(geojsonLayer);

    geojsonLayer = L.geoJSON(geojson, { pointToLayer: pointToLayer, onEachFeature: onEachFeature }).addTo(map);
    // markers.addLayer(geojsonLayer);
    // map.addLayer(markers);
    if (mapViewPoint) {
        map.setView(mapViewPoint, zoom);
    } else if (!keepZoomLevel) {
        if (isMobile) {
            paddingBottomRight = [45,0];
        } else {
            paddingBottomRight = [400,0];
        }
        var bounds = geojsonLayer.getBounds();
        console.log(geojsonLayer);
        
        var roughBoundsArea = calcRoughArea(bounds);
        if (roughBoundsArea < 0.005) {
            map.setView(bounds.getCenter(), 12);
        } else {
            map.fitBounds(bounds, {paddingBottomRight: paddingBottomRight});
        }
    }
    // $(".overlay, #loading-message-well").fadeOut(2000);
}

function calcRoughArea(bounds) {
    var coord = bounds.toBBoxString().split(",");
    var roughArea = Math.abs((coord[0] - coord[2]) * (coord[1] - coord[3]));
}

function onEachFeature(feature, layer) {
    var popupContent = "";
    if (feature.properties) {
        popupContent += "Tradslag: " + feature.properties.Tradslag + "</br>";
        popupContent += "Stamomkret: " + feature.properties.Stamomkret + " cm</br>";
        popupContent += "Status: " + feature.properties.Tradstatus + "</br>";
        popupContent += "Plats: " + feature.properties.Lokalnamn + "</br>";
        popupContent += "Id: " + feature.properties.Id + "</br>";
    }

    layer.bindPopup(popupContent, { autoPanPaddingTopLeft: [65, 5], autoPanPaddingBottomRight: [45, 5] });
    if (!isMobile) {
        layer.on({
            mouseover: function (e) {
                layer = e.target;
                layer.openPopup();
            },
            mouseout: function (e) {
                layer = e.target;
                layer.closePopup();
            },
            // click: highlightFeature
        });
    }
    // $(".overlay").hide();
}

function pointToLayer(feature, latlng) {
    var radius = getPointSize(feature.properties.Stamomkret);
    return new L.CircleMarker(latlng, {
        radius: radius,
        fillColor: getColor(feature.properties.Tradslag),
        color: getColor(feature.properties.Tradslag),
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        clickable: true
    });
}

function getColor(treeType){
    var color;
    var masterTreeArray = trees();
    $.each(masterTreeArray, function(index, tree){
        if (treeType.match(tree.matchWith)) {
            color = tree.color;
            return false;
        }
    });
    return color;
}

function updateLegend(filteredTrees) {

    $(".legend.leaflet-control").empty();
    var newLegendContent = '';
    for (var i = 0; i < filteredTrees.length; i++) {
        if (filteredTrees[i].id != "Alla") {
            newLegendContent += '<i style="background:' + getColor(filteredTrees[i].id) + '"></i> ' + filteredTrees[i].id + '</br>';
        }
    }
    $(".legend.leaflet-control").html(newLegendContent);
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
    $.each(map._layers, function(index, layer){
        if (layer.feature) {
            if (point[0] == layer.feature.geometry.coordinates[1] && point[1] == layer.feature.geometry.coordinates[0]){
                layer.openPopup();
                if (isMobile) {
                    sidebar.close();
                }
                return false;
            }
        }
    });
}

export { initMap, map, sidebar, geojsonLayer, updateLegend, emptyMap, updateGeojsonLayer, setViewOpenPopup }; //vlocationMarker,


