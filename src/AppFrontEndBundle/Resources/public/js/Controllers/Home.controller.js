(function(){
    'use strict';

    angular
        .module('app')
        .controller('HomeController', homeController);

    /**
     * Controller dependency injections.
     *
     * @type {string[]}
     */
    homeController.$inject = [
        '$rootScope',
        '$scope',
        'articlesService'
    ];

    /**
     * @ngdoc controller
     *
     * @description
     * This controller is responsible for dealing with home page.
     *
     * @param $rootScope
     * @param $scope
     * @param articlesService
     */
    function homeController($rootScope, $scope, articlesService) {
        /**
         * Sets page title.
         *
         * @type {string}
         */
        $rootScope.title = 'Home';

        /**
         * All articles which were obtained from server.
         *
         * @type {Array}
         */
        $scope.articles = [];

        /**
         * Flag means that articles are loading in the moment.
         *
         * @type {boolean}
         */
        $scope.articlesLoading = true;

        // Lets get articles just after controller initialized.
        articlesService
            .getArticles()
            .success(function(response, status){
                $scope.articles = response;
                $scope.articlesLoading = false;
            });
    }
})()