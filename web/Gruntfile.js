'use strict';

var jsLibs = require('./modules/jslibs');

module.exports = function(grunt) {
    grunt.initConfig({
        meta: {
            bowerPath: 'public/bower_components',
            jsPath: 'public/js',
            lessPath: 'public/less',
            cssPath: 'public/css',
            fontsPath: 'public/fonts',
            libBundle: '<%= meta.jsPath %>/dist/lib.js'
        },

        browserify: {
            local: {
                options: {
                    watch: true,
                    keepAlive: true,
                    browserifyOptions: {
                        debug: true
                    }
                },
                files: {
                    '<%= meta.jsPath %>/dist/submissions.js': '<%= meta.jsPath %>/src/submissions.js'
                }
            },
            dev: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                files: {
                    '<%= meta.jsPath %>/dist/submissions.js': '<%= meta.jsPath %>/src/submissions.js'
                }
            },
            dist: {
                files: {
                    '<%= meta.jsPath %>/dist/submissions.js': '<%= meta.jsPath %>/src/submissions.js'
                }
            }
        },

        clean: {
            dist: [
                '<%= meta.jsPath %>/dist',
                '<%= meta.cssPath %>',
                '<%= meta.fontsPath %>/fontawesome*.*',
                '<%= meta.fontsPath %>/glyphicons*.*',
                '*.log'],
            ini: ['<%= copy.defaultSettings.dest %>']
        },

        concat: {
            options: {
                separator: ';'
            },
            local: {
                files: {
                    '<%= meta.libBundle %>': jsLibs('public')
                }
            },
            dist: {
                files: {
                    '<%= meta.libBundle %>': jsLibs('public', true)
                }
            }
        },

        concurrent: {
            local: {
                tasks: ['browserify:local', 'watch', 'nodemon'],
                options: {
                    logConcurrentOutput: true
                }
            },
            vagrant: {
                tasks: ['browserify:local', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        copy: {
            fonts: {
                expand: true,
                flatten: true,
                filter: 'isFile',
                src: ['<%= meta.bowerPath %>/bootstrap/fonts/**', '<%= meta.bowerPath %>/font-awesome/fonts/**'],
                dest: '<%= meta.fontsPath %>/'
            },
            defaultSettings: {
                src: ['config/common_sample.ini'],
                dest: 'config/common.ini'
            },
            angularFileUpload: {
                expand: true,
                flatten: true,
                filter: 'isFile',
                src: ['<%= meta.bowerPath %>/ng-file-upload/FileAPI.*'],
                dest: '<%= meta.jsPath %>/dist/'
            },
            ckeditor: {
                expand: true,
                cwd: '<%= meta.bowerPath %>/ckeditor/',
                src: ['**'],
                dest: '<%= meta.jsPath %>/dist/ckeditor'
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            bundles: {
                src: '<%= meta.jsPath %>/src/**/*.js'
            },
            tests: {
                src: 'test/**/*.js'
            }
        },

        less: {
            local: {
                options: {
                    paths: [
                        '<%= meta.bowerPath %>',
                        '<%= meta.lessPath %>'
                    ]
                },
                files: {
                    '<%= meta.cssPath %>/styles.css': '<%= meta.lessPath %>/styles.less'
                }
            }
        },

        nodemon: {
            local: {
                script: 'worker.js'
            }
        },

        uglify: {
            dist: {
                files: {
                    '<%= meta.jsPath %>/dist/submissions.js': '<%= meta.jsPath %>/dist/submissions.js'
                }
            }
        },

        watch: {
            less: {
                options: {
                    livereload: true
                },
                files: ['<%= meta.lessPath %>/**/*.less'],
                tasks: ['less']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: ['<%= meta.jsPath %>/dist/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('dist', ['clean', 'concat:dist', 'less', 'copy', 'browserify:dist', 'uglify']);
    grunt.registerTask('dev', ['clean', 'concat:local', 'less', 'copy', 'browserify:dev']);
    grunt.registerTask('vagrant', ['dev', 'concurrent:vagrant']);
    grunt.registerTask('default', ['dev', 'concurrent:local']);
};
