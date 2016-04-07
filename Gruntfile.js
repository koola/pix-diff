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
            protractor: {
                cmd: 'node_modules/.bin/protractor',
                args: [
                    'test/protractor.conf.js'
                ]
            }
        }

    });

    //tasks
    grunt.registerTask('test', 'Run integration tests', ['clean:screens', 'run:protractor']);
    grunt.registerTask('default', ['test']);
};