module.exports = function(grunt){
    grunt.initConfig({
        lint: {
            all: ['grunt.js', 'js/*.js']
        },
        test: {
            files: ['test/*.js']
        }
    });

    grunt.registerTask('default', 'lint');

    grunt.registerTask('example', 'just a custom example task', function(){
        // insert task code here
    });
};
