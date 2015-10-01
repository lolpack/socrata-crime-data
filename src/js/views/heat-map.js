var $ = require('jquery');
var Backbone = require('backbone');
var template = require('../templates/heat-map.hbs');

Backbone.$ = $;

var HeatMapView = Backbone.View.extend({
  el: '#heatMapContainer',
  template: template,

  render: function() {
    this.$el.html(template(
      {map: 'Hello World'}
    ));
  }
});

module.exports = HeatMapView;
