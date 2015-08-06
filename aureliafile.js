var aurelia = require('aurelia-cli');

aurelia.command('bundle', {
  js: {
    "dist/app-bundle": {
      modules: [
        '*',
        'aurelia-bootstrapper',
        'aurelia-http-client',
        'aurelia-router',
        'aurelia-animator-css',
        'github:aurelia/templating-binding@0.13.2',
        'github:aurelia/templating-resources@0.13.3',
        'github:aurelia/templating-router@0.14.1',
        'github:aurelia/loader-default@0.9.1',
        'github:aurelia/history-browser@0.6.2',
        'github:google/material-design-lite@1.0.2',
        'github:google/material-design-lite@1.0.2/material',
        'github:jbellsey/material-decorator@master'
      ],
      options: {
        inject: true,
        minify: false
      }
    }
  }
});
