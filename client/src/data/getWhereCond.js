// import $ from 'jquery';
import { getCircumferenceQueryText } from './models/circumference';
import { getRegionQueryText } from './models/region';
import { getTreetypeQueryText } from './models/treetype';


export default function getWhereCondition(regionSel = 'Alla', circumferenceSel = 'Alla', treetypeSel = 'Alla') {
  const kommunCond = getRegionQueryText(regionSel);
  const stamomkretCond = getCircumferenceQueryText(circumferenceSel);
  const tradslagCond = getTreetypeQueryText(treetypeSel);
  let whereQuery;
  whereQuery = [
    kommunCond,
    tradslagCond,
    stamomkretCond,
  ].join(' AND ');
  return whereQuery;
}
