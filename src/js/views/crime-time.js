var $ = require('jquery');
var Backbone = require('backbone');
var template = require('../templates/crime-time.hbs');

Backbone.$ = $;

var HeatmapView = Backbone.View.extend({
  el: '#crimeTimeContainer',
  template: template,

  render: function() {
    this.$el.html(template(
      {map: 'Hello World'}
    ));
  }
});

module.exports = HeatmapView;
