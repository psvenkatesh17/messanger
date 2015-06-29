// lazyload config
angular.module('instagramApp')
/**
 * jQuery plugin config use ui-jq directive , config the js and css files that required
 * key: function name of the jQuery plugin
 * value: array of the css js file located
 */
.constant('JQ_CONFIG', {
    easyPieChart: ['components/jquery/charts/easypiechart/jquery.easy-pie-chart.js'],
    sparkline: ['components/jquery/charts/sparkline/jquery.sparkline.min.js'],
    plot: ['components/jquery/charts/flot/jquery.flot.min.js', 'components/jquery/charts/flot/jquery.flot.resize.js', 'components/jquery/charts/flot/jquery.flot.tooltip.min.js', 'components/jquery/charts/flot/jquery.flot.spline.js', 'components/jquery/charts/flot/jquery.flot.orderBars.js', 'components/jquery/charts/flot/jquery.flot.pie.min.js'],
    slimScroll: ['components/jquery/slimscroll/jquery.slimscroll.min.js'],
    filestyle: ['components/jquery/file/bootstrap-filestyle.min.js'],
    chosen: ['components/jquery/chosen/chosen.jquery.min.js', 'components/jquery/chosen/chosen.css']
})
// oclazyload config
.config(['$ocLazyLoadProvider',
    function($ocLazyLoadProvider) {
        // We configure ocLazyLoad to use the lib script.js as the async loader
        $ocLazyLoadProvider.config({
            debug: true,
            events: true,
            modules: [{
                name: 'ngGrid',
                files: ['bower_components/ng-grid/ng-grid.min.js', 'bower_components/ng-grid/ng-grid.min.css', 'bower_components/ng-grid/theme.css']
            }, {
                name: 'ui.select',
                files: ['bower_components/angular-ui-select/select.min.js', 'bower_components/angular-ui-select/select.min.css']
            }, {
                name: 'angularFileUpload',
                files: ['bower_components/angular-file-upload/angular-file-upload.min.js']
            }, {
                name: 'toaster',
                files: ['bower_components/angularjs-toaster/toaster.js', 'bower_components/angularjs-toaster/toaster.css']
            }]
        });
    }
]);