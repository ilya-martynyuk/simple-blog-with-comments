(function(){
    'use strict';

    angular
        .module('app')
        .config(
            moduleConfig);

    /**
     * @ngdoc function
     *
     * @description
     * Common application configuration file
     *
     * @param $routeProvider
     * @param $httpProvider
     * @param $locationProvider
     * @param vcRecaptchaServiceProvider
     */
    function moduleConfig($routeProvider, $httpProvider, $locationProvider, vcRecaptchaServiceProvider) {
        vcRecaptchaServiceProvider
            .setSiteKey(appConfig.recaptchaClientKey);

        $httpProvider
            .defaults
            .headers
            .post['Content-Type'] =  'application/x-www-form-urlencoded';

        $routeProvider
            .when('/', {
                templateUrl : appConfig.jsUrl + '/Views/page.home.html',
                controller  : 'HomeController'
            })
            .when('/articles/:article_id', {
                templateUrl : appConfig.jsUrl +  '/Views/page.article.html',
                controller  : 'ArticleController'
            })
            .when('/404', {
                templateUrl : appConfig.jsUrl +  '/Views/page.404.html',
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();