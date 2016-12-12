'use strict';

module.exports = grunt => {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        clean: {
            images: {
                src: [
                    'test/baseline/',
                    'test/diff'
                ]
            }
        },

        jshint: {
            all: ['index.js', 'lib/*.js', 'test/*.spec.js', 'test/conf/*.conf.js'],
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
            unit: {
                cmd: 'node_modules/.bin/_mocha',
                args: [
                    '-R', 'spec',
                    'test/unit/index.spec.js'
                ]
            },
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

        contributors: {
            options: {
                commitMessage: 'chore(npm) update contributors'
            }
        },

        bump: {
            options: {
                files: ['package.json'],
                commit: true,
                commitMessage: 'chore(release) v%VERSION%',
                commitFiles: ['package.json', 'CHANGELOG.md', 'docs/*.md'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin'
            }
        }
    });

    grunt.registerTask('unit', 'Run unit tests', ['run:unit']);
    grunt.registerTask('local', 'Run desktop tests on local', ['clean:images', 'run:local']);
    grunt.registerTask('saucelabs', 'Run all tests on Saucelabs', ['clean:images', 'run:saucelabs']);
    grunt.registerTask('build', ['jshint:all', 'unit', 'local']);
    grunt.registerTask('release', 'Docs, bump and push to GitHub', (type) => {
        grunt.task.run(
            [
                'jsdoc2md',
                'contributors',
                `bump-only:${type || 'patch'}`,
                'conventionalChangelog',
                'bump-commit'
            ]);
    });
    grunt.registerTask('default', ['build']);
};