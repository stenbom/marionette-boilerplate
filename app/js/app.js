require.config({
    paths: {
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        marionette: 'libs/backbone.marionette'
    },
    shim: {
        "backbone": {
            deps: ['underscore', 'jquery', 'marionette'],
            exports: 'Backbone'
        },
        "marionette": {
            deps: ['backbone', 'underscore', 'jquery'],
            exports: 'Backbone'
        },
        "underscore": {
            exports: '_'
        }
    }
});

require([
    'jquery'
  , 'backbone'
], function ($, Backbone) {
    var MyApp = new Backbone.Marionette.Application();

});