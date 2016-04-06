(function(){
    'use strict';

    angular
        .module('app')
        .controller('HomeController', homeController);

    homeController.$inject = [
        '$scope',
        'articlesService'
    ];

    function homeController($scope, articlesService) {
        $scope.articles = [];

        articlesService
            .getArticles()
            .success(function(response, status){
                $scope.articles = response;
            });
    }
})()