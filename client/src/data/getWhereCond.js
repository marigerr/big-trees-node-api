//import $ from 'jquery';
import {getCircumferenceQueryText} from './models/circumference.js';
import {getRegionQueryText} from './models/region.js';
import {getTreetypeQueryText} from './models/treetype.js';


export default function getWhereCondition(regionSel = "Alla", circumferenceSel = "Alla", treetypeSel = "Alla"){
    var kommunCond = getRegionQueryText(regionSel);
    var stamomkretCond = getCircumferenceQueryText(circumferenceSel);
    var tradslagCond = getTreetypeQueryText(treetypeSel);
    var whereQuery;
    whereQuery = [
        kommunCond,
        tradslagCond,
        stamomkretCond,
    ].join(" AND ");
    return whereQuery;
}    