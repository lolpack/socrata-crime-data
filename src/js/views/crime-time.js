var $ = require('jquery');
var Backbone = require('backbone');
var template = require('../templates/crime-time.hbs');

_ = require('lodash');

var d3 = require('d3');

Backbone.$ = $;

var HeatmapView = Backbone.View.extend({
  el: '#crimeTimeContainer',
  template: template,
  initialize: function () {
    this.data2012 = [];
    this.data2015 = [];
    this.noRecordedTime = [];
    var self = this;

    this.collection.each(function (crime) {
      var sceneTime = crime.get('at_scene_time');
      if (sceneTime && sceneTime.slice(0,4) === "2015") {
        self.data2015.push(crime);
      } else if (sceneTime && sceneTime.slice(0,4) === "2012") {
        self.data2012.push(crime);
      } else {
        self.noRecordedTime.push(crime);
      }
    });
  },
  _makeChart: function (chartEl, data) {
    var xy_chart = d3_xy_chart()
      .width(500)
      .height(300)
      .xlabel("Months")
      .ylabel("Number of Crime Reports");
    var svg = d3.select(chartEl).append("svg")
      .datum(data)
      .call(xy_chart);

    function d3_xy_chart() {
      var width = 300,  
        height = 300, 
        xlabel = "x",
        ylabel =  "y";
        
      function chart(selection) {
        selection.each(function(datasets) {
          var margin = {top: 20, right: 80, bottom: 30, left: 50}, 
              innerwidth = width - margin.left - margin.right,
              innerheight = height - margin.top - margin.bottom;
          
          var x_scale = d3.scale.linear()
            .domain([ d3.min(datasets, function(d) { return d3.min(d.x); }), 
              d3.max(datasets, function(d) { return d3.max(d.x); }) ]) ;
          
          var y_scale = d3.scale.linear()
            .range([innerheight, 0])
            .domain([ d3.min(datasets, function(d) { return d3.min(d.y); }),
              d3.max(datasets, function(d) { return d3.max(d.y); }) ]);

          var color_scale = d3.scale.category10()
            .domain(d3.range(datasets.length));

          var x_axis = d3.svg.axis()
            .scale(x_scale)
            .orient("bottom")
            .ticks(12);

          var y_axis = d3.svg.axis()
            .scale(y_scale)
            .orient("left");

          var x_grid = d3.svg.axis()
            .scale(x_scale)
            .orient("bottom")
            .tickSize(-innerheight)
            .tickFormat("");

          var y_grid = d3.svg.axis()
            .scale(y_scale)
            .orient("left") 
            .tickSize(-innerwidth)
            .tickFormat("");

          var draw_line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return x_scale(d[0]); })
            .y(function(d) { return y_scale(d[1]); });

          var svg = d3.select(this)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          
          svg.append("g")
            .attr("class", "x grid")
            .attr("transform", "translate(0," + innerheight + ")")
            .call(x_grid);

          svg.append("g")
            .attr("class", "y grid")
            .call(y_grid);

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + innerheight + ")") 
            .call(x_axis)
            .append("text")
            .attr("dy", "-.71em")
            .attr("x", innerwidth)
            .style("text-anchor", "end")
            .text(xlabel);
          
          svg.append("g")
            .attr("class", "y axis")
            .call(y_axis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .text(ylabel);

          var data_lines = svg.selectAll(".d3_xy_chart_line")
            .data(datasets.map(function(d) {return d3.zip(d.x, d.y);}))
            .enter().append("g")
            .attr("class", "d3_xy_chart_line");
          
          data_lines.append("path")
            .attr("class", "line")
            .attr("d", function(d) {return draw_line(d); })
            .attr("stroke", function(_, i) {return color_scale(i);});
          
          data_lines.append("text")
            .datum(function(d, i) { return {name: datasets[i].label, final: d[d.length-1]}; }) 
            .attr("transform", function(d) { 
                return ( "translate(" + x_scale(d.final[0]) + "," + 
                         y_scale(d.final[1]) + ")" ); })
            .attr("x", 3)
            .attr("dy", ".35em")
            .attr("fill", function(_, i) { return color_scale(i); })
            .text(function(d) { return d.name; });

        });
      }

      chart.width = function(value) {
          if (!arguments.length) return width;
          width = value;
          return chart;
      };

      chart.height = function(value) {
          if (!arguments.length) return height;
          height = value;
          return chart;
      };

      chart.xlabel = function(value) {
        if(!arguments.length) return xlabel;
        xlabel = value;
        return chart;
      };

      chart.ylabel = function(value) {
        if(!arguments.length) return ylabel;
        ylabel = value;
        return chart;
      };

      return chart;
    }
  },
  formatCollection: function(collection) {
    var beatHashCount = {};

    _.each(collection, function (model) {
      // Only month/year needed
      var sceneTime = model.get('at_scene_time') && model.get('at_scene_time').slice(0,7);
      
      if (!beatHashCount[model.get('zone_beat')]) {
        beatHashCount[model.get('zone_beat')] = {
          zoneCount: 1,
          date: parseInt(sceneTime.slice(5,7)),
          dateString: sceneTime,
          zoneBeat: model.get('zone_beat')

        };
      } else if (beatHashCount[model.get('zone_beat')].dateString === sceneTime) {
        beatHashCount[model.get('zone_beat')].zoneCount +=1
      }
    });
    return beatHashCount;
  },
  makeNestData: function (beatHashCount) {
    // Put in D3 format
    // Nest the entries by symbol
    return _.map(beatHashCount, function (val, k) {
      return {
        label: k,
        x: [val.date],
        y: [val.zoneCount]
      }
    });
  },
  render: function () {
    this.$el.html(template());
    var formatted2012 = this.formatCollection(this.data2012);
    var formatted2015 = this.formatCollection(this.data2015);

    this._makeChart('.chart-2012', this.makeNestData(formatted2012));
    this._makeChart('.chart-2015', this.makeNestData(formatted2015));
  }
});

module.exports = HeatmapView;
