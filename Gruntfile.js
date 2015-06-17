module.exports = function (grunt) {

    "use strict";

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: ['dist/css/app**.*', 'dist/js/app**.*'],
        },

        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.jpg', '**/*.png', '**/*.gif'],
                    dest: 'dist/'
                }, ]
            },
        },

        responsive_images: {
            resimg: {
                options: {
                    newFilesOnly: false,
                    engine: 'im',
                    quality: 80,
                    upscale: false,
                    sizes: [{
                        width: 320
                    }, {
                        width: 768
                    }, {
                        width: 1024
                    }]
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**/*.{jpg,gif,png}'],
                    dest: 'dist/temp/'
                }]
            },
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { // Dictionary of files
                    'dist/index.html': 'src/index.html' // 'destination': 'source'

                }
            },
        },

        sass: {
            build: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none',
                    precision: 10,
                },
                files: {
                    'src/css/sass.css': 'src/scss/sass.scss'
                }
            }
        },

        uncss: {
            options: {
                ignore: [
                    /(#|\.)fancybox(\-[a-zA-Z]+)?/,
                    // needed for Bootstrap's transitions
                    ".fade",
                    ".fade.in",
                    ".collapse",
                    ".collapse.in",
                    ".navbar-collapse",
                    ".navbar-collapse.in",
                    ".collapsing",
                    // needed for the <noscript> warning; remove when fixed in uncss
                    ".alert-danger",
                    ".visible-xs",
                    ".noscript-warning",
                    ".fadeIn",
                    ".fade-in",
                    ".fade-out",
                ],
                report: 'min',
                timeout: 1000,
                ignoreSheets: ['/fonts.googleapis/'],
            },
            dist: {
                files: {
                    'dist/css/tidy.css': ['src/index.html']
                }
            }
        },

        cssmin: {
            options: {
                keepSpecialComments: 1
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.css', '!**/*.min.css', '!**/*.map'],
                    dest: 'dist/',
                    ext: '.min.css',
                    extDot: 'last'
                }]
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 9']
            },

            // prefix all files
            files: {
                expand: true,
                flatten: true,
                cwd: 'src/css/',
                src: '*.css',
                dest: 'src/css/'
            }
        },

        uglify: {
            options: {
                preserveComments: 'some'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js', '!**/*.min.js'],
                    dest: 'dist/',
                    ext: '.min.js',
                    extDot: 'last'
                }]
            },
            other: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['js/foundation.min.js'],
                    dest: 'dist/',
//                    ext: '.min.js',
                    extDot: 'last'
                }]
            }
        },

        hashres: {
            options: {
                encoding: 'utf8',
                fileNameFormat: '${name}.${hash}.${ext}',
                renameFiles: true
            },
            min: {
                // Specific options, override the global ones
                options: {
                    // You can override encoding, fileNameFormat or renameFiles
                    fileNameFormat: '${name}.min.${ext}',
                    renameFiles: false
                },
                // Files to hash
                src: [
                    // WARNING: These files will be renamed!
                    'src/**/*.css', 'src/**/*.js', '!**/*.min.*'
                ],
                // File that refers to above files and needs to be updated with the hashed name
                dest: 'dist/index.html',
            },
            prod: {
                // Specific options, override the global ones
                options: {
                    // You can override encoding, fileNameFormat or renameFiles
                },
                // Files to hash
                src: [
                    // WARNING: These files will be renamed!
                    'dist/css/app.min.css',
                    'dist/js/custom.min.js'
                ],
                // File that refers to above files and needs to be updated with the hashed name
                dest: 'dist/index.html',
            }
        },

        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: [
                        '**/*',
                        '!**/*.css',
                        '!**/*.js',
                        '!**/*.html',
                        '!**/*.scss',
                        '!**/*.less',
                        '!**/*.php',
                        '!**/*.map',
                        '!**/*.jpg',
                        '!**/*.png',
                        '!**/*.gif',
                        '!**/less/**',
                        '!**/scss/**'
                    ],
                    dest: 'dist/',
                }]
            },
            others: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['js/jquery**.min.js', '.htaccess', 'js/foundation.min.js'],
                    dest: 'dist/',
                }]
            },
        },

        shell: {
            bumpVersion: {
                command: 'npm version patch'
            }
        },

        watch: {
            options: {
            //    livereload: true
            },
            sass: {
                files: ['src/scss/sass.scss'],
                tasks: ['sass'],
            },
            livereload: {
                files: ['src/**/*.html', 'src/**/*.css', 'src/**/*.js'],
                options: {livereload: true}
            }
        }

    });

    // Default task(s).
    grunt.registerTask('default', ['watch']);

    // Interim Deployment
    grunt.registerTask('deploy', ['clean', 'newer:imagemin', 'htmlmin', 'uglify', 'cssmin', 'newer:copy', 'string-replace', 'hashres']);

        // Bump release version numbers
    grunt.registerTask('release', ['shell:bumpVersion']);

};
