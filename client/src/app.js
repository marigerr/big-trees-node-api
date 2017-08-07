// import 'leaflet';
// //import $ from 'jquery';
// import 'leaflet/dist/leaflet.css';
import styles from './stylesheets/app.css';
import '../../node_modules/sidebar-v2/css/leaflet-sidebar.min.css';
import 'Stylesheets/sidebar.custom.css';
import mobileAndTabletcheck from 'Utilities/checkIfMobile.js';
import { map, initMap } from 'Map/map.js';
import {getPoints} from 'Data/getPoints.js';
import {findLocationWithNavigator, searchVisibleMap} from 'Sidebar/locatePane/locate.js';
import {addDropdowns, updateDropdowns} from 'Sidebar/select.js';
import {storageAvailable} from 'Data/storeLocally.js';

var isMobile = mobileAndTabletcheck();
initMap();
addDropdowns();


export {isMobile};



