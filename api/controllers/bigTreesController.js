'use strict';

var mongoose = require('mongoose'),
  Trees = mongoose.model('Trees');

exports.list_all_trees = function(req, res) {
  Trees.find({}, function(err, tree) {
    if (err)
      res.send(err);
    res.json(tree);
  });
};

exports.by_treetype = function(req, res) {
  console.log(req.params.tradslag);
  
  Trees.find({"properties.Tradslag": req.params.tradslag}, function(err, tree) {
    if (err)
      res.send(err);
    res.json(tree);
  });
};

// exports.within_bounding_box = function(req, res) {
//   Trees.find(
//    {
//      coordinates: {
//        $geoWithin: {
//           $geometry: req.params.within
//        }
//      }
//    }
// )
    
//     req.params.within, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
// };

// exports.create_a_tree = function(req, res) {
//   var new_task = new Trees(req.body);
//   new_task.save(function(err, tree) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
// };

// exports.find_tree_by_id = function(req, res) {
//   Trees.findById(req.params.treeId, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
// };


// exports.update_a_tree = function(req, res) {
//   Trees.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
// };


// exports.delete_a_task = function(req, res) {
//   Trees.remove({
//     _id: req.params.taskId
//   }, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json({ message: 'Trees successfully deleted' });
//   });
// };