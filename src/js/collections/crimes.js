var Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
  model: Backbone.Model,
  url: 'crimes'
});
