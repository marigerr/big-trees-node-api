// import 'leaflet';
// //import $ from 'jquery';
// import 'leaflet/dist/leaflet.css';
// import styles from './stylesheets/app.css';
import '../../node_modules/sidebar-v2/css/leaflet-sidebar.min.css';
import 'Stylesheets/sidebar.custom.css';
import mobileAndTabletcheck from 'Utilities/checkIfMobile';
import { initMap } from 'Map/map';
import { addDropdowns } from 'Sidebar/select';
// import { getPoints } from 'Data/getPoints';
// import { findLocationWithNavigator, searchVisibleMap } from 'Sidebar/locatePane/locate';
// import { storageAvailable } from 'Data/storeLocally';

const isMobile = mobileAndTabletcheck();
initMap();
addDropdowns();


export { isMobile };

