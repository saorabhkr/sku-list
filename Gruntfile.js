module.exports = function (grunt) {

  grunt.initConfig({
    'pkg': grunt.file.readJSON('package.json'),
    //configured a tasks
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: {                         // Dictionary of files
          // 'destination': 'source'
          "src/css/style.css" : "src/css/scss/style.css.scss"
        }
      }
    },
    concat : {
      js: {
        src : [ "vendor/js/jquery.min.js", "vendor/js/bootstrap.min.js", "vendor/js/bootstrap3-typeahead.min.js",
                "vendor/js/mustache.js", "src/js/modalBox.js", "src/js/range.js", "src/js/star.js", "src/js/common.js"
              ],
        dest : "dist/common.js"
      },
      css: {
        src : [  "vendor/css/font-awesome.min.css", "vendor/css/bootstrap.min.css", "vendor/css/bootstrap-theme.min.css",

                "src/css/reset.css", "src/css/typo.css", "src/css/layout.css", "src/css/modalBox.css",
                "src/css/common.css", "src/css/style.css"
              ],
        dest : "dist/common.css"
      }
    },
    uglify : {
        tasks :{
          files : {
            'dist/all.common.min.js' : ["dist/common.js"]
          }
        }
    },
    cssmin: {
      tasks : {
        files: {
          'dist/all.common.min.css': ["dist/common.css"]
        }
      }
    },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['sass', 'cssmin']
      },
      js: {
        files: '**/*.js',
        tasks: ['uglify']
      }
    }
  });

  //setup the application workflow
  //load a task from NPM module

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register Grunt tasks
  grunt.registerTask('default', ['sass','concat','cssmin','uglify', 'watch']);

};
