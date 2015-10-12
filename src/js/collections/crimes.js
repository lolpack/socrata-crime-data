var Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
  model: Backbone.Model,
  url: function () {
    return "https://data.seattle.gov/resource/3k2p%2D39jp.json"
  }
});
