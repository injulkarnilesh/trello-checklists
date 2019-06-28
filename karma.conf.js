//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: '.',

    files: [
      'app/lib/jquery/dist/jquery.min.js',
      'app/utils/trello-client.js',
      'app/lib/angular/angular.min.js',
      'app/lib/angular-animate/angular-animate.min.js',
      'app/lib/angular-aria/angular-aria.min.js',
      'app/lib/angular-route/angular-route.min.js',
      'app/lib/angular-material/angular-material.min.js',
      'app/lib/angular-material-icons/angular-material-icons.min.js',
      'app/lib/angular-messages/angular-messages.min.js',
      'app/lib/moment/min/moment.min.js',
      'app/lib/ng-material-datetimepicker/dist/angular-material-datetimepicker.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app/app.js',
      'app/app.spec.js',
      'app/js/**/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    // preprocessors: {
    //   'app/**/*.spec.js': [ 'browserify' ]
    // },

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine'
      //'karma-browserify'
    ]

  });
};
