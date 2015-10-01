var $ = require('jquery');
var Backbone = require('backbone');
var template = require('../templates/home.hbs');

var HeatMapView = require('./heat-map');
var CrimeTimeView = require('./crime-time');

Backbone.$ = $;

var HomeView = Backbone.View.extend({
  el: '#main',
  template: template,

  initialize: function () {
    
  },

  initializeChildViews: function () {
    this.heatMapView = new HeatMapView();
    this.heatMapView.render();

    this.crimeTimeView = new CrimeTimeView();
    this.crimeTimeView.render();
  },

  render: function() {
    this.$el.html(template(
      {name: 'Hello World'}
    ));

    this.initializeChildViews()
  }
});

module.exports = HomeView;
 