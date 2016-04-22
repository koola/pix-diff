'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        clean: {
            screens: {
                src: [
                    "test/screenshots/*",
                    "!test/screenshots/exampleFail*.png",
                    "test/screenshots/diff/*.png"
                ]
            }
        },

        run: {
            jasmine: {
                cmd: 'node_modules/.bin/protractor',
                args: [
                    'test/protractorJasmine.conf.js'
                ]
            },
            mocha: {
                cmd: 'node_modules/.bin/protractor',
                args: [
                    'test/protractorMocha.conf.js'
                ]
            }
        }

    });

    //tasks
    grunt.registerTask('jasmine', 'Run Jasmine integration tests', ['clean:screens', 'run:jasmine']);
    grunt.registerTask('mocha', 'Run Mocha integration tests', ['clean:screens', 'run:mocha']);
    grunt.registerTask('default', ['jasmine', 'mocha']);
};