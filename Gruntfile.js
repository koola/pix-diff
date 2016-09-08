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
            iosSim: {
                cmd: 'node_modules/.bin/protractor',
                args: [
                    'test/protractorSimulator.ios.conf.js'
                ]
            },
            androidEm: {
                cmd: 'node_modules/.bin/protractor',
                args: [
                    'test/protractorEmulator.android.conf.js'
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
    grunt.registerTask('iosSim', 'Run Appium iOS Simulator integration tests', ['clean:screens', 'run:iosSim']);
    grunt.registerTask('androidEm', 'Run Appium Android emulator integration tests', ['clean:screens', 'run:androidEm']);
    grunt.registerTask('build', ['jshint:all']);
    grunt.registerTask('release', ['bump']);
    grunt.registerTask('default', ['jasmine', 'mocha', 'cucumber']);
};