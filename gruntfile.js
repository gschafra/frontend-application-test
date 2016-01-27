module.exports = function(grunt) {
	"use strict";
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),

		watch : {
			js : {
				files : [ '**/js/*.js', '!**/js/*.min.js' ],
				tasks : [ 'uglify:prod' ]
			},
			css : {
				files : [ '**/css/*.less'],
				tasks : [ 'less:prod' ]
			}
		},

		uglify : {
			prod : {
				files : [ {
					expand : true,
					cwd : 'Aufgabe2/js/',
					src : [ '*.js', '!*.min.js' ],
					dest : 'Aufgabe2/js/',
					ext : '.min.js'
				} ],
				options : {
					sourceMap : true
				}
			}
		},

		less : {
			prod : {
				options : {
					plugins : [ new (require('less-plugin-clean-css'))({
						advanced: true,
						s1: ""
					}) ],
					sourceMap : true
				},
				files : [ {
					expand : true,
					cwd : 'Aufgabe2/css/',
					src : [ '*.less' ],
					dest : 'Aufgabe2/css/',
					ext : '.min.css'
				},{
					expand : true,
					cwd : 'Aufgabe1/css/',
					src : [ '*.less' ],
					dest : 'Aufgabe1/css/',
					ext : '.min.css'
				} ]
			},
			dev : {
				options : {
					plugins : [ new (require('less-plugin-clean-css'))({
						advanced: true,
						s1: ""
					}) ]
				},
				files : [ {
					expand : true,
					cwd : 'Aufgabe2/css/',
					src : [ '*.less' ],
					dest : 'Aufgabe2/css/',
					ext : '.css'
				},{
					expand : true,
					cwd : 'Aufgabe1/css/',
					src : [ '*.less' ],
					dest : 'Aufgabe1/css/',
					ext : '.css'
				} ]
			}
		}
	});

	grunt.registerTask('default', []);
	grunt.registerTask('prod',  ['less:prod', 'uglify:prod']);
	grunt.registerTask('dev',  ['less:dev']);
};