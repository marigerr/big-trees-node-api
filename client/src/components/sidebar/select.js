// import $ from 'jquery';
import { filterTrees } from './treePane/filterTrees';
import { circumference, getCircumferenceRange } from 'Data/models/circumference';
import { regions, getRegions } from 'Data/models/region';
import { trees, getTrees } from 'Data/models/treetype';
import { updateLegend, emptyMap } from 'Map/map';
import { showMostCommon, showAvg, stats } from './statPane/stats';
import { findLocationWithNavigator, searchVisibleMap } from 'Sidebar/locatePane/locate';

function createSelect(selectDiv, arr) {
  // if select has options, empty to create new option list
  const optionExistCheck = `${selectDiv} option`;
  if ($(optionExistCheck).length > 0) {
    $(selectDiv).empty();
  }
  const sel = $(selectDiv);
  const fragment = document.createDocumentFragment();
  $.each(arr, (i) => {
    const opt = document.createElement('option');
    opt.innerHTML = arr[i].label;
    opt.value = arr[i].id;
    fragment.appendChild(opt);
  });
  sel.append(fragment);
}

function addDropdowns() {
  const treeArray = trees();
  const dropdowns = [{ div: '.circumference-select', arr: circumference }, { div: '.region-select', arr: regions }, { div: '.treetype-select', arr: treeArray }, { div: '.stat-select', arr: stats }];
  $.each(dropdowns, (index, value) => {
    createSelect(value.div, value.arr);
  });

  addListeners();
}

function addListeners() {
  $('#locateBtn').click(() => {
    // searchCounter = 0;
    findLocationWithNavigator();
  });

  $('#searchVisibleBtn').click(() => {
    $('.tree-table-div, .stat-table-div').hide();
    $('.results').hide();
    searchVisibleMap();
  });

  $('.filterSelect').change((e) => {
    $('.results').hide();
    $('.stat-table-div').hide();
    const circumferenceSel = $('.filterSelect.circumference-select').val();
    const regionSel = $('.filterSelect.region-select').val();
    // console.log( e.target.classList[1]);
    const treetypeSel = $('.filterSelect.treetype-select').val();
    filterTrees(regionSel, circumferenceSel, treetypeSel);
    updateDropdowns(regionSel, circumferenceSel, treetypeSel, e.target.classList[1]);
  });

  /* jshint ignore:start */
  $('.statpaneSelect').change((e) => {
    //    $(".statpaneSelectRegionDiv").show();
    //    $(".statpaneSelectTreeDiv").show();
    emptyMap();
    const statSelect = $('.stat-select').val();
    const regionSel = $('.statpaneSelect.region-select').val();
    const treetypeSel = $('.statpaneSelect.treetype-select').val();
    $('.stat-table').empty();
    $('.results').hide();
    $('.tree-table-div').hide();
    // statSelect == "top20" ? showTop20(regionSel, treetypeSel) :
/*eslint-disable*/
    statSelect === 'MostCommon' ? showMostCommon(regionSel, 'Alla') :
      statSelect === 'AvgMax' ? showAvg(regionSel, treetypeSel) :
        reset();
  });
/*eslint-enable*/
  /* jshint ignore:end */
}

function reset() {
  $('select.statpaneSelect.treetype-select').prop('selectedIndex', 0);
  $('select.statpaneSelect.region-select').prop('selectedIndex', 0);
  emptyMap();
  console.log('no choice made');
}
function updateDropdowns(region, circumference, treetype, exclude) {
  if (circumference === 'Alla' && exclude !== 'circumference-select') {
    getCircumferenceRange(region, circumference, treetype);
  }
  if (treetype === 'Alla' && exclude !== 'treetype-select') {
    getTrees(region, circumference, treetype);
  }
  // else if (treetype !== 'Alla' && exclude !== 'treetype-select') {

  // }
  if (region === 'Alla' && exclude !== 'region-select') {
    getRegions(region, circumference, treetype);
  }
}

export { createSelect, addDropdowns, updateDropdowns };
