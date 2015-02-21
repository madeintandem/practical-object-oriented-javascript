var express = require("express");
var app = express();
var _ = require("lodash");
var url = require('url');
var port = process.env.PORT || 3000;

app.use(express.static("."));

app.get("/fruits", function (req, res) {
  var parsedUrl = url.parse(req.url, true);
  var params = parsedUrl.query;
  var fruits = require("./fruit.json");
  var filteredFruits = _.filter(fruits, function(fruit) {
    var pattern = new RegExp("^" + params.query, "i");
    return !!fruit.text.match(pattern);
  });
  res.send(req.params);
});
app.listen(port);
console.log("Server started at: " + "http://localhost:".concat(port));
