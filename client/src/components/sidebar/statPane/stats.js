// import $ from 'jquery';
import makeAjaxCall from 'Data/makeAjaxCall';
import lanstyrDefault from 'Data/lanstyrDefault';
import getWhereCondition from 'Data/getWhereCond';
import { getPoints, getPointsSuccess } from 'Data/getPoints';
import { trees } from 'Data/models/treetype';
import { addTableCaption, createTableHeader, addTableData } from 'Sidebar/createTable';

const stats = [
  { id: '', label: 'Välj Statistik' },
  // { id: "top20", label: "Largest Trees" },
  { id: 'MostCommon', label: 'Träd antal' },
  { id: 'AvgMax', label: 'Medel Omkrets' },
];

// function showTop20(regionSel, treetypeSel) {
//     $(".statpaneSelectTreeDiv").show();
//     var whereQuery = getWhereCondition(regionSel, null, treetypeSel);
//     var defaults = lanstyrDefault();
//     var success = function(response){ 
//         getPointsSuccess(response);
//         $.each(response.features, function(index, value){
//             response.features[index].Tradslag = response.features[index].attributes.Tradslag.replace("-släktet", "");
//             response.features[index].Stamomkret = response.features[index].attributes.Stamomkret.toString();// + " cm";
//             response.features[index].Lokalnamn = response.features[index].attributes.Lokalnamn;
//         });
//         var treeOrTrees = response.features.length > 1 ? "trees" : "tree";
//         var title = `Largest ${treetypeSel == "Alla" ? "" : treetypeSel} ${treeOrTrees} in ${regionSel == "Alla" ? "JKPG Lan" : regionSel}`;
//         addTableCaption(".stat-table", title);
//         createTableHeader(".stat-table", ["Tree type", "cm", "Place"]);
//         addTableData(".stat-table", response.features, ["Tradslag", "Stamomkret", "Lokalnamn"]);
//     };
//     var data = defaults.data;
//     data.where = whereQuery;
//     data.resultRecordCount = 20;

//     makeAjaxCall(defaults.url, data, defaults.type, defaults.datatyp, defaults.async, success, defaults.error);
// }

function showMostCommon(regionSel, treetypeSel) {
  $('.statpaneSelectTreeDiv').hide();
  $('select.statpaneSelect.treetype-select').prop('selectedIndex', 0);
  const whereQuery = getWhereCondition(regionSel, null, treetypeSel);
  const outStats = JSON.stringify([
    {
      statisticType: 'count',
      onStatisticField: 'Tradslag',
      outStatisticFieldName: 'TradslagCounts',
    },
  ]);
  const defaults = lanstyrDefault();
  const success = function (response) {
    const treeFreqList = response.features;
    const groupedTrees = groupTrees(treeFreqList);
    groupedTrees.sort((a, b) => b.total - a.total);
    const title = `Tree totals in ${regionSel == 'Alla' ? 'Jönköping Lan' : regionSel}`;
    addTableCaption('.stat-table', title);
    createTableHeader('.stat-table', ['Tree Type', 'Total']);
    addTableData('.stat-table', groupedTrees, ['label', 'total']);
    let sumTotal = 0;
    $.each(groupedTrees, (index, value) => {
      sumTotal += groupedTrees[index].total;
    });
    const sumRow$ = $('<tr class="boldRow"/>');
    sumRow$.append($('<td/>').html('Total'));
    sumRow$.append($('<td/>').html(sumTotal));
    $('.stat-table').append(sumRow$);
    // getPoints(regionSel, "Alla", treeFreqList[0].attributes.Tradslag);
  };

  const data = defaults.data;
  data.where = whereQuery;
  data.outStatistics = outStats;
  data.returnGeometry = false;
  data.outSR = null;
  data.orderByFields = null;
  data.groupByFieldsForStatistics = 'Tradslag';

  makeAjaxCall(defaults.url, data, defaults.type, defaults.datatyp, defaults.async, success, defaults.error);
}

function showAvg(regionSel, treetypeSel) {
  $('.statpaneSelectTreeDiv').show();

  const whereQuery = getWhereCondition(regionSel, 'Alla', treetypeSel);
  const defaults = lanstyrDefault();
  const success = function (response) {
    const dataObjArray = [{ avgStamomkret: response.features[0].attributes.avgStamomkret }];
    addTableCaption('.stat-table', `${treetypeSel == 'Alla' ? '' : treetypeSel} ${regionSel == 'Alla' ? 'JKPG Lan' : regionSel}`);

    createTableHeader('.stat-table', ['Average Circumference']);
    addTableData('.stat-table', dataObjArray, ['avgStamomkret'], false, false);
  };
  const outStats = JSON.stringify([
    {
      statisticType: 'avg',
      onStatisticField: 'Stamomkret',
      outStatisticFieldName: 'avgStamomkret',
    },
  ]);
  const data = defaults.data;
  data.where = whereQuery;
  data.outStatistics = outStats;
  data.returnGeometry = false;
  data.outSR = null;
  data.orderByFields = null;

  makeAjaxCall(defaults.url, data, defaults.type, defaults.datatyp, defaults.async, success, defaults.error);
}

function groupTrees(treeFreqList) {
  let groupedTrees = trees();
  groupedTrees.shift();
  let i,
    j;
  for (i = 0; i < treeFreqList.length; i += 1) {
    for (j = 0; j < groupedTrees.length; j += 1) {
      if (treeFreqList[i].attributes.Tradslag.match(groupedTrees[j].matchWith)) {
        if (groupedTrees[j].total === undefined) {
          groupedTrees[j].total = 0;
        }
        groupedTrees[j].total += treeFreqList[i].attributes.TradslagCounts;
        break;
      }
    }
  }
  groupedTrees = $.grep(groupedTrees, tree => tree.total !== undefined);
  return groupedTrees;
}

export { showMostCommon, showAvg, stats, addTableCaption, createTableHeader, addTableData };

