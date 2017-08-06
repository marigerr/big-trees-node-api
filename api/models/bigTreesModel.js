'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TreeSchema = new Schema({
  type: String,
  properties: {
    Obj_idnr: Number,
    Kommun: String,
    Lokalnamn: String,
    Xkoord: Number,
    Ykoord: Number,
    Tradslag: String,
    Stamomkret: Number,
    Skyddsvrde: String,
    Tradstatus: String,
    Tradfamilj: String,
  },
  bbox: [Number, Number, Number, Number],
  geometry: {
    type: String,
    coordinates: [Number, Number]
  }
});

module.exports = mongoose.model('Trees', TreeSchema);