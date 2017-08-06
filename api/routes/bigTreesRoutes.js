'use strict';
module.exports = function(app) {
  var trees = require('../controllers/bigTreesController');

  // trees Routes
  app.route('/trees')
    .get(trees.list_all_trees);
    // .post(trees.create_a_tree);

    app.route('/trees/:tradslag')
    .get(trees.by_treetype);

  // app.route('/trees/:within')
  //   .get(trees.within_bounding_box);
    // .put(trees.update_a_tree)
    // .delete(trees.delete_a_tree);
};
