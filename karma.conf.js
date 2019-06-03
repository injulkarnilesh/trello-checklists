//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: '.',

    files: [
      'app/lib/angular/angular.min.js',
      'app/lib/angular-animate/angular-animate.min.js',
      'app/lib/angular-aria/angular-aria.min.js',
      'app/lib/angular-route/angular-route.min.js',
      'app/lib/angular-material/angular-material.min.js',
      'app/lib/angular-material-icons/angular-material-icons.min.js',
      'app/lib/angular-messages/angular-messages.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app/app.js',
      'app/app.spec.js',
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
