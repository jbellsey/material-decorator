var path = require('path');

var appRoot = 'src/';
var outputRoot = 'dist/';

module.exports = {
    root:         appRoot,

    source:       appRoot + '**/*.js',
    html:         appRoot + '**/*.html',
    styleInput:   appRoot + '../styles/_master.less',
    styleWatch:   appRoot + '../**/*.less', // 'styles/**/*.css',

    output:       outputRoot,

    doc:          './doc',
    e2eSpecsSrc:  'test/e2e/src/*.js',
    e2eSpecsDist: 'test/e2e/dist/'
};