require.config({
    paths: {
        "underscore": 'libs/underscore',
        "backbone": 'libs/backbone',
        "backbone.marionette": 'libs/backbone.marionette'
    },
    shim: {
        "backbone": {
            deps: ['underscore'],
            exports: 'Backbone'
        },
        "backbone.marionette": {
            deps: ['backbone'],
            exports: 'Backbone'
        },
        "underscore": {
            exports: '_'
        }
    }
});

require([
    'jquery'
  , 'backbone.marionette'
], function ($, Backbone) {
    var MyApp = new Backbone.Marionette.Application();
});