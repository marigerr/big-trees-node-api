//import $ from 'jquery';
import getWhereCondition from 'Data/getWhereCond.js';
import makeAjaxCall from 'Data/makeAjaxCall.js';
import lanstyrDefault from 'Data/lanstyrDefault.js';
import {createSelect} from 'Sidebar/select.js';
import {updateLegend} from 'Map/map.js';

function trees() { 
        return [{"family" : "zzzz", "matchWith" : /XXXXX/i,"id":"Alla","querytext":"Tradslag is not null","label":"Alla", "color" : ""},
                {"family" : "Björkväxter", "matchWith" : /al$/i,"id":"Al","querytext":"Tradslag like '%Al'","label":"Al", "color" : "#0C2CAB"},
                {"family" : "Almväxter", "matchWith" : /alm/i,"id":"Alm","querytext":"Tradslag like '%Alm%'","label":"Alm", "color" : "#F72530"},
                {"family" : "Syrenväxter", "matchWith" : /ask/i,"id":"Ask","querytext":"Tradslag like '%Ask%'","label":"Ask", "color" : "#732e00"},
                {"family" : "Videväxter", "matchWith" : /^asp/i,"id":"Asp","querytext":"Tradslag = 'Asp'","label":"Asp", "color" : "#3E1380"},
                {"family" : "Rosväxter", "matchWith" : /apel|äpple|malus/i,"id":"Äpple","querytext":"Tradslag like '%Apel%' OR Tradslag like '%Äpple%' OR Tradslag like '%malus%'","label":"Äpple", "color" : "#EB8AAE"},
                {"family" : "Björkväxter", "matchWith" : /avenbok/i,"id":"Avenbok","querytext":"Tradslag like '%Avenbok%'","label":"Avenbok", "color" : "#134D80"},
                {"family" : "Björkväxter", "matchWith" : /björk/i,"id":"Björk","querytext":"Tradslag like '%Björk%'","label":"Björk", "color" : "#090C66"},
                {"family" : "Bokväxter", "matchWith" : /^bok|blodbok/i,"id":"Bok","querytext":"Tradslag='Bok' OR Tradslag='Blodbok'","label":"Bok", "color" : "#424E82"},
                {"family" : "Bokväxter", "matchWith" : /ek/i,"id":"Ek","querytext":"Tradslag like '%Ek%'","label":"Ek", "color" : "#267F99"},
                {"family" : "Cypressväxter", "matchWith" : /en$/i,"id":"En","querytext":"Tradslag='En' OR Tradslag='Kungsen'","label":"En", "color" : "#002b40"},
                {"family" : "Tallväxter", "matchWith" : /^(gran)|(ädelgran)/i,"id":"Gran","querytext":"Tradslag='Gran' OR Tradslag='Ädelgran'","label":"Gran", "color" : "#00802b"},
                {"family" : "Björkväxter", "matchWith" : /hassel/i,"id":"Hassel","querytext":"Tradslag like '%Hassel%'","label":"Hassel", "color" : "#0738FA"},
                {"family" : "Rosväxter", "matchWith" : /hagtorn/i,"id":"Hagtorn","querytext":"Tradslag like '%Hagtorn%'","label":"Hagtorn", "color" : "#CF3C72"},
                {"family" : "Idegransväxter", "matchWith" : /idegran/i,"id":"Idegran","querytext":"Tradslag='Idegran'","label":"Idegran", "color" : "#0CE80C"},
                {"family" : "Rosväxter", "matchWith" : /körsbär|hägg|fågelbär/i,"id":"Körsbär","querytext":"Tradslag like '%Körsbär%'OR Tradslag='Hägg' OR Tradslag='Fågelbär'","label":"Körsbär", "color" : "#F0469D"},
                {"family" : "Kinesträdsväxter", "matchWith" : /kastanj/i,"id":"Kastanj","querytext":"Tradslag like '%Kastanj'","label":"Kastanj", "color" : "#F56B45"},
                {"family" : "Tallväxter", "matchWith" : /lärk/i,"id":"Lärk","querytext":"Tradslag like '%Lärk'","label":"Lärk", "color" : "#00b33c"},
                {"family" : "Kinesträdsväxter", "matchWith" : /lönn/i,"id":"Lönn","querytext":"Tradslag like '%Lönn'","label":"Lönn", "color" : "#FA5311"},
                {"family" : "Malvaväxter", "matchWith" : /lind/i,"id":"Lind","querytext":"Tradslag like '%Lind%'","label":"Lind", "color" : "#ffaa00"},
                {"family" : "Rosväxter", "matchWith" : /oxel/i,"id":"Oxel","querytext":"Tradslag like 'Oxel'","label":"Oxel", "color" : "#F584C4"},
                {"family" : "Rosväxter", "matchWith" : /päron/i,"id":"Päron","querytext":"Tradslag like 'Päron'","label":"Päron", "color" : "#DB099C"},
                {"family" : "Videväxter", "matchWith" : /pil|salix|jolster|sälg|vide/i,"id":"Pil",
                    "querytext":"Tradslag like '%Pil%' OR Tradslag like '%Salix%' OR Tradslag = 'Jolster' OR Tradslag = 'Sälg' OR Tradslag = 'Vide'",
                    "label":"Pil", "color" : "#8C4DAB"},
                {"family" : "Videväxter", "matchWith" : /poppel|populus/i, "id":"Poppel","querytext":"Tradslag like '%Poppel' OR Tradslag = 'Populus sp'","label":"Poppel", "color" : "#49287A"},
                {"family" : "Rosväxter", "matchWith" : /rönn/i, "id":"Rönn","querytext":"Tradslag = 'Rönn'","label":"Rönn", "color" : "#F21693"},
                {"family" : "Tallväxter", "matchWith" : /tall/i, "id":"Tall","querytext":"Tradslag like '%Tall'","label":"Tall", "color" : "#006600"},
                {"family" : "zzzz", "matchWith" : /annat|övrig|obestämd|okänt/i, "id":"Annat",
                "querytext":"Tradslag like 'Övrig%' OR Tradslag = 'Annat' OR Tradslag = 'Obestämd' OR Tradslag = 'Okänt'",
                "label":"Annat/Obestämd", "color" : "#000000"}
                ];        
}

function getTreetypeQueryText(treetypeSelection) {
    var treeArray = trees();
    var queryText;
    $.each(treeArray, function(index, value) {
        if(treeArray[index].id == treetypeSelection){
            queryText = "(" + treeArray[index].querytext + ")";
            return false;
        }
    });
    return queryText;
}


function getTrees(regionSel= "Alla",  circumferenceSel = 100, treetypeSel = "Alla") {

    var whereQuery = getWhereCondition(regionSel, circumferenceSel, treetypeSel);
    var defaults = lanstyrDefault();
    var success = getTreesSuccess;
    var data = defaults.data;
    data.where = whereQuery;
    data.returnGeometry = false;
    data.outSR = null;
    data.outFields = 'Tradslag';
    data.orderByFields = 'Tradslag';
    data.returnDistinctValues = true;
    
    makeAjaxCall(defaults.url, data, defaults.type, defaults.datatyp, defaults.async, success, defaults.error);
}

function getTreesSuccess(response) { //getCircumferenceRangeSuccess;
    var filteredTrees =[];
    
    $.each(response.features, function(index, value){
        filteredTrees.push(value.attributes.Tradslag);
    });

    var finalFilteredTrees;
    finalFilteredTrees = removeDuplicateTrees(filteredTrees);

    createSelect(".filterSelect.treetype-select", finalFilteredTrees);
    // updateLegend(finalFilteredTrees);
}

function removeDuplicateTrees(treeArray){
    var masterTreeListArray = trees();
    
    var finalFilteredTrees = [];
    var i, j;
    for (i = 0; i < treeArray.length; i++) {       
        for (j = 0; j < masterTreeListArray.length; j++) {          
            // if(trees[j].matchWith.test(treeArray[i])){
            if(treeArray[i].match(masterTreeListArray[j].matchWith)){
                finalFilteredTrees.push(masterTreeListArray[j]);
                break;    
            }    
        }        
    }   
    finalFilteredTrees.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} ); 
    
    // delete all duplicates from the array
    for( i=0; i<finalFilteredTrees.length-1; i++ ) {
        if ( finalFilteredTrees[i].id == finalFilteredTrees[i+1].id ) {
            finalFilteredTrees.splice(i, 1);
            i--;
        }
    }
    finalFilteredTrees.unshift({"family": "zzzz", "matchWith" : /XXXXX/i,"id":"Alla","querytext":"Tradslag is not null","label":"Alla"});    

    return finalFilteredTrees;
}


export {trees, getTreetypeQueryText, getTrees, removeDuplicateTrees};

