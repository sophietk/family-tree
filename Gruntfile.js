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
            },
            'replace-cssfont': {
                cmd: 'npm run replace:cssfont'
            },
            usemin: {
                cmd: 'npm run usemin'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
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
        'exec:usemin',
        'exec:replace-cssfont'
    ]);

    grunt.registerTask('dist', [
        'build',
        'exec:clean-zip',
        'exec:compress'
    ]);

};
