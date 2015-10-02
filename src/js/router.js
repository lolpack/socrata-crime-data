var Backbone = require('backbone');
var HomeView = require('./views/home');
var CrimesCollection = require('./collections/crimes');

var Router = Backbone.Router.extend({
  routes: {
    '*path': 'default'
  },

  initialize: function() {
    Backbone.history.start();
    this.crimesCollection = new CrimesCollection();
    this.crimesCollection.fetch({
      success: function (data) {
        var view = new HomeView({ collection: data });
        view.render();
      }
    });
  }
});
  
module.exports = Router;
