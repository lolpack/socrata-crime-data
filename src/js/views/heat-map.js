var $ = require('jquery');
var Backbone = require('backbone');
var template = require('../templates/heat-map.hbs');
var _ = require('lodash');

var GoogleMapsLoader = require('google-maps');
var GMapsConfig = require('../maps-helpers/gmaps-config');

Backbone.$ = $;

var HeatMapView = Backbone.View.extend({
  el: '#heatMapContainer',
  template: template,

  drawMap: function () {
    var map = new google.maps.Map(document.getElementById('map-canvas'), GMapsConfig);

    // heatmap overlay
    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.getHeatMapData()
    });

    heatmap.setMap(map);
  },
  getHeatMapData: function () {
    var heatMapHash = [];

    this.collection.each( function (crime) {
      var lat = crime.get('latitude');
      var lng = crime.get('longitude');

      heatMapHash.push({
        location: new google.maps.LatLng(lat, lng),
        weight: 1,
        radius: 3
      });
    });

    return heatMapHash
  },
  render: function() {
    this.$el.html(template(
      {map: 'Hello World'}
    ));

    this.drawMap()
  }
});

module.exports = HeatMapView;
