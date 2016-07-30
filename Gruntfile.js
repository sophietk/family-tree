module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            sass: {
                files: ['app/sass/*.scss'],
                tasks: ['exec:sass']
            },
            handlebars: {
                files: ['app/**/*.hbs'],
                tasks: ['exec:handlebars']
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
                            match: /\.\.\/font\//g,
                            replacement: './font/'
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

        exec: {
            sass: {
                cmd: 'npm run sass'
            },
            'copy-all': {
                cmd: 'npm run copy-all'
            },
            'clean-dist': {
                cmd: 'npm run clean:dist'
            },
            'clean-zip': {
                cmd: 'npm run clean:zip'
            },
            compress: {
                cmd: 'npm run compress'
            },
            handlebars: {
                cmd: 'npm run handlebars'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', [
        'exec:sass',
        'watch'
    ]);

    grunt.registerTask('build', [
        'exec:clean-dist',
        'exec:sass',
        'exec:handlebars',
        'exec:copy-all',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'replace:cssfont',
        'uglify:generated',
        'usemin'
    ]);

    grunt.registerTask('dist', [
        'build',
        'exec:clean-zip',
        'exec:compress'
    ]);

};
