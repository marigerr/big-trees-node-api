//import $ from 'jquery';
import { filterTrees } from './treePane/filterTrees.js';
import { circumference, getCircumferenceRange } from 'Data/models/circumference.js';
import { regions, getRegions } from 'Data/models/region.js';
import { trees, getTrees } from 'Data/models/treetype.js';
import { updateLegend, emptyMap } from 'Map/map.js';
import { showMostCommon, showAvg, stats } from './statPane/stats.js';
import {findLocationWithNavigator, searchVisibleMap} from 'Sidebar/locatePane/locate.js';

function createSelect(selectDiv, arr) {
    // if select has options, empty to create new option list
    var optionExistCheck = selectDiv + " option";
    if ($(optionExistCheck).length > 0) {
        $(selectDiv).empty();
    }
    var sel = $(selectDiv);
    var fragment = document.createDocumentFragment();
    $.each(arr, function (i) {
        var opt = document.createElement('option');
        opt.innerHTML = arr[i].label;
        opt.value = arr[i].id;
        fragment.appendChild(opt);
    });
    sel.append(fragment);
}

function addDropdowns() {
    var treeArray = trees();
    var dropdowns = [{ div: ".circumference-select", arr: circumference }, { div: ".region-select", arr: regions }, { div: ".treetype-select", arr: treeArray }, { div: ".stat-select", arr: stats }];
    $.each(dropdowns, function (index, value) {
        createSelect(value.div, value.arr);
    });

    addListeners();
}

function addListeners() {
    $("#locateBtn").click(function () {
        // searchCounter = 0;
        findLocationWithNavigator();
    });

    $("#searchVisibleBtn").click(function () {
        $(".tree-table-div, .stat-table-div").hide();
        $(".results").hide();
        searchVisibleMap();
    });

    $(".filterSelect").change(function (e) {
        $(".results").hide();
        $(".stat-table-div").hide();
        var circumferenceSel = $(".filterSelect.circumference-select").val();
        var regionSel = $(".filterSelect.region-select").val();
        //console.log( e.target.classList[1]);
        var treetypeSel = $(".filterSelect.treetype-select").val();
        filterTrees(regionSel, circumferenceSel, treetypeSel);
        updateDropdowns(regionSel, circumferenceSel, treetypeSel, e.target.classList[1]);
    });

    /* jshint ignore:start */
    $(".statpaneSelect").change(function (e) {
        //    $(".statpaneSelectRegionDiv").show();
        //    $(".statpaneSelectTreeDiv").show();
        emptyMap();
        var statSelect = $(".stat-select").val();
        var regionSel = $(".statpaneSelect.region-select").val();
        var treetypeSel = $(".statpaneSelect.treetype-select").val();
        $(".stat-table").empty();
        $(".results").hide();
        $(".tree-table-div").hide();
        // statSelect == "top20" ? showTop20(regionSel, treetypeSel) :
        statSelect == "MostCommon" ? showMostCommon(regionSel, "Alla") :
            statSelect == "AvgMax" ? showAvg(regionSel, treetypeSel) :
                reset();
    });
    /* jshint ignore:end */
}

function reset() {
    $("select.statpaneSelect.treetype-select").prop('selectedIndex', 0);
    $("select.statpaneSelect.region-select").prop('selectedIndex', 0);
    emptyMap();
    console.log("no choice made");
}
function updateDropdowns(region, circumference, treetype, exclude) {
    if (circumference == "Alla" && exclude != 'circumference-select') {
        getCircumferenceRange(region, circumference, treetype);
    }
    if (treetype == "Alla" && exclude != 'treetype-select') {
        getTrees(region, circumference, treetype);
    } else if (treetype != "Alla" && exclude != 'treetype-select') {

    }
    if (region == "Alla" && exclude != 'region-select') {
        getRegions(region, circumference, treetype);
    }
}

export { createSelect, addDropdowns, updateDropdowns };