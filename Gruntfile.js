'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        clean: {
            screens: {
                src: [
                    'test/screenshots/*',
                    '!test/screenshots/exampleFail*.png'
                ]
            }
        },

        jshint: {
            all: ['index.js', 'test/**/*.spec.js', 'test/**/*.steps.js'],
            options: {
                jshintrc: '.jshintrc',
                ignores: ['node_modules/', 'framework/']
            }
        },

        run: {
            cucumber: {
                cmd: 'node_modules/.bin/protractor',
                args: [
                    'test/protractorCucumber.conf.js'
                ]
            },
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
            },
            ios: {
                cmd: 'node_modules/.bin/protractor',
                args: [
                    'test/appium/protractorSimulatorIOS.conf.js'
                ]
            },
            android: {
                cmd: 'node_modules/.bin/protractor',
                args: [
                    'test/appium/protractorEmulatorAndroid.conf.js'
                ]
            }
        },

        bump: {
            options: {
                files: ['package.json'],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'CHANGELOG.md'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin'
            }
        }

    });

    //tasks
    grunt.registerTask('cucumber', 'Run cucumber integration tests', ['clean:screens', 'run:cucumber']);
    grunt.registerTask('jasmine', 'Run Jasmine integration tests', ['clean:screens', 'run:jasmine']);
    grunt.registerTask('mocha', 'Run Mocha integration tests', ['clean:screens', 'run:mocha']);
    grunt.registerTask('ios', 'Run Appium tests on Saucelabs', ['clean:screens', 'run:ios']);
    grunt.registerTask('android', 'Run Appium tests on Saucelabs', ['clean:screens', 'run:android']);
    grunt.registerTask('build', ['jshint:all']);
    grunt.registerTask('release', ['bump']);
    grunt.registerTask('default', ['jasmine', 'mocha', 'cucumber', 'ios']);
};