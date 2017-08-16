// import $ from 'jquery';
import makeAjaxCall from 'Data/makeAjaxCall';
import lanstyrDefault from 'Data/lanstyrDefault';
import { map, sidebar } from 'Map/map';
import { getPointsSuccess } from 'Data/getPoints';
import { buildTable, addRowClickHandler } from 'Sidebar/createTable';
import { isMobile } from 'App/app';

let locationMarker;

function findLocationWithNavigator() {
  console.log('findLocationWithNavigator');

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };
  if (navigator.geolocation) {
    removeLocationMarker();
    navigator.geolocation.getCurrentPosition((pos) => { navLocatesuccess(pos); }, (err) => { navLocateerror(err); }, options);
  } else {
    findLocationWithGoogleGeolocation();
  }
}

function navLocatesuccess(pos) {
  const crd = pos.coords;
  const mapViewPoint = L.latLng(crd.latitude, crd.longitude);
  if (isMobile) {
    sidebar.close();
    console.log(isMobile);
  }
  const searchEnvelope = getSearchArea(crd.latitude, crd.longitude);
  findNearTrees(searchEnvelope, mapViewPoint);
  createLocationMarker(crd.latitude, crd.longitude, crd.accuracy);
}

function navLocateerror(err) {
  console.warn(`navigator.geolocation error(${err.code}): ${err.message}`);
  findLocationWithGoogleGeolocation();
}

function findLocationWithGoogleGeolocation() {
  removeLocationMarker();
  console.log('google geolocation called');
  const url = 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyALDj8UcNZ1fQlXcoMlJ84lSavkcyODExI';
  const type = 'POST';
  let data;
  const datatype = 'json';
  const async = true;
  const success = (response) => {
    // console.log(response);
    const lat = response.location.lat;
    const lng = response.location.lng;
    createLocationMarker(lat, lng, response.accuracy);
    // console.log("Accuracy: " + response.accuracy + " meters");
    const mapViewPoint = L.latLng(lat, lng);

    const searchEnvelope = getSearchArea(lat, lng);
    findNearTrees(searchEnvelope, mapViewPoint);
    if (isMobile) {
      sidebar.close();
      console.log(isMobile);
    }
  };
  const error = (xhr) => {
    console.log(xhr.statusText);
  };

  makeAjaxCall(url, data, type, datatype, async, success, error);
}

function getSearchArea(lat, lng) {
// use leaflet toBounds  toBounds(<Number> sizeInMeters) LatLngBounds
// Returns a new LatLngBounds object in which each boundary is sizeInMeters/2 meters apart from the LatLng.
  return L.latLng(lat, lng).toBounds(4000).toBBoxString(); // search area 4000 meters
}

function findNearTrees(searchEnvelope, mapViewPoint, keepZoomLevel) {
  const defaults = lanstyrDefault();
  let success;
  if (mapViewPoint) {
    success = (response) => {
      getPointsSuccess(response, mapViewPoint, 1);
      buildTable('.tree-table', response, true);
      addRowClickHandler();
    };
  } else {
    success = (response) => {
      getPointsSuccess(response, null, null, keepZoomLevel);
      buildTable('.tree-table', response, true);
      addRowClickHandler();
    };
  }
  const data = defaults.data;
  data.where = '';
  data.geometry = JSON.stringify(searchEnvelope);
  data.outSR = 4326;
  data.inSR = 4326;
  data.spatialRel = 'esriSpatialRelContains';
  makeAjaxCall(defaults.url, data, defaults.type, defaults.datatyp, defaults.async, success, defaults.error);
}

function removeLocationMarker() {
  if (locationMarker) {
    locationMarker.remove();
  }
}

function createLocationMarker(lat, lng, accuracy) {
  locationMarker = L.marker([lat, lng]).addTo(map);
  let popupContent = '';
  popupContent += 'Your location</br>';
  popupContent += `Accuracy: ${Math.round(accuracy)} meters</br>`;
  locationMarker.bindPopup(popupContent, { autoPanPaddingTopLeft: [65, 5], autoPanPaddingBottomRight: [45, 5] }); // .openPopup();
}

function searchVisibleMap() {
  $('table').empty();
  $('.tableBtns').hide();
  const bounds = map.getBounds().toBBoxString();
  findNearTrees(bounds, null, true);
}

export { removeLocationMarker, findLocationWithGoogleGeolocation, findLocationWithNavigator, searchVisibleMap };
