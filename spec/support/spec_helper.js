function renderFixture(nodeType, attrs, content) {

  var attributes = _.reduce(attrs, function(memo, value, attr) {
    return memo += " " + attr + '="' + value + '"';
  }, "");

  return [
    "<", nodeType,
    attributes,
    ">",
    content,
    "</" + nodeType + ">"
  ].join("");
}

function appendFixture(nodeType, attrs, content) {
  $("#fixtures").append(renderFixture(nodeType, attrs, content));
}

window.expect = chai.expect;

beforeEach(function() {
  $("body").append("<div id='fixtures'/>");
});

afterEach(function() {
  $("#fixtures").remove();
});
