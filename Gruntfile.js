'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        clean: {
            screens: {
                src: [
                    'test/baseline/',
                    'test/diff'
                ]
            }
        },

        jshint: {
            all: ['index.js', 'test/*.spec.js', 'test/conf/*.conf.js'],
            options: {
                jshintrc: '.jshintrc',
                ignores: ['node_modules/', 'framework/']
            }
        },

        jsdoc2md: {
            oneOutputFile: {
                src: 'index.js',
                dest: 'docs/index.md'
            }
        },

        run: {
            local: {
                cmd: 'node_modules/.bin/protractor',
                args: [
                    'test/conf/protractor.local.conf.js'
                ]
            },
            saucelabs: {
                cmd: 'node_modules/.bin/protractor',
                args: [
                    'test/conf/protractor.saucelabs.conf.js'
                ]
            }
        },

        conventionalChangelog: {
            options: {
                changelogOpts: {
                    preset: 'angular',
                    releaseCount: 0
                }
            },
            release: {
                src: 'CHANGELOG.md'
            }
        },

        bump: {
            options: {
                files: ['package.json'],
                commit: true,
                commitMessage: 'chore(release) v%VERSION%',
                commitFiles: ['package.json', 'CHANGELOG.md', 'docs/**/*.md'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin'
            }
        }

    });

    grunt.registerTask('local', 'Run desktop tests on local', ['clean:screens', 'run:local']);
    grunt.registerTask('saucelabs', 'Run all tests on Saucelabs', ['clean:screens', 'run:saucelabs']);
    grunt.registerTask('build', ['jshint:all', 'local']);
    grunt.registerTask('release', ['jsdoc2md', 'conventionalChangelog', 'bump']);
    grunt.registerTask('default', ['local']);
};