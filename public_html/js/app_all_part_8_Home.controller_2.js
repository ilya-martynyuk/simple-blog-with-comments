(function(){
    'use strict';

    angular
        .module('app')
        .controller('HomeController', homeController);

    homeController.$inject = [
        '$rootScope',
        '$scope',
        'articlesService'
    ];

    function homeController($rootScope, $scope, articlesService) {
        $rootScope.title = 'Home';

        $scope.articles = [];
        $scope.articlesLoading = true;

        articlesService
            .getArticles()
            .success(function(response, status){
                $scope.articles = response;
                $scope.articlesLoading = false;
            });
    }
})()