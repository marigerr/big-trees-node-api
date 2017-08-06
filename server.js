var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Trees = require('./api/models/bigTreesModel'),
  bodyParser = require('body-parser');
  
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/bigtreeshabo'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(function(req, res) {
//   res.status(404).send({url: req.originalUrl + ' not found'})
// });

// app.use(function (err, req, res, next) {
//   console.error(err.stack)
//   res.status(404).send({url: req.originalUrl + ' not found'})
//   res.status(500).send('Something broke!')
// })

var routes = require('./api/routes/bigTreesRoutes');
routes(app);


app.listen(port);


console.log('server started on: ' + port);