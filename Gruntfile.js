module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            sass: {
                files: ['app/sass/*.scss'],
                tasks: ['sass:dev']
            },
            handlebars: {
                files: ['app/**/*.hbs'],
                tasks: ['handlebars:dev']
            }
        },

        clean: {
            dist: ['dist/**'],
            zip: ['zip/**']
        },

        sass: {
            dev: {
                files: {
                    'app/css/style.css': 'app/sass/style.scss'
                }
            }
        },

        handlebars: {
            options: {
                namespace: 'JST',
                partialRegex: /\.partial/,
                processName: function (filePath) {
                    var pieces = filePath.split('/');
                    return pieces[pieces.length - 1].replace('.hbs', '');
                },
                processPartialName: function (filePath) {
                    var pieces = filePath.split('/');
                    return pieces[pieces.length - 1].replace('.partial.hbs', '');
                }
            },
            dev: {
                files: {
                    'app/js/templates.js': ['**/*.hbs', '**/*.partial.hbs']
                }
            }
        },

        copy: {
            html: {
                src: 'app/index.html',
                dest: 'dist/index.html'
            },
            img: {
                expand: true,
                cwd: 'app/img',
                src: '**',
                dest: 'dist/img'
            },
            font: {
                expand: true,
                cwd: 'app/bower_components/materialize/font',
                src: '**',
                dest: 'dist/font'
            },
            i18n: {
                expand: true,
                cwd: 'app/js/i18n',
                src: '**',
                dest: 'dist/js/i18n'
            }
        },

        cssmin: {
            options: {
                keepSpecialComments: 0,
                rebase: false
            }
        },

        // @todo: replace by cssmin relativeTo/target configuration
        replace: {
            cssfont: {
                options: {
                    patterns: [
                        {
                            match: '../font/',
                            replacement: 'font/'
                        }
                    ]
                },
                files: {
                    'dist/style.min.css': 'dist/style.min.css'
                }
            }
        },

        useminPrepare: {
            html: 'app/index.html'
        },

        usemin: {
            html: 'dist/index.html'
        },

        compress: {
            zip: {
                options: {
                    archive: 'zip/<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                expand: true,
                cwd: 'dist/',
                src: ['**/*'],
                dest: '<%= pkg.name %>/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', [
        'sass',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'sass',
        'handlebars',
        'copy',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'replace:cssfont',
        'uglify:generated',
        'usemin'
    ]);

    grunt.registerTask('dist', [
        'build',
        'clean:zip',
        'compress'
    ]);

};