(function($){
    'use strict';

    angular
        .module('app')
        .service('articlesService', articlesService);

    articlesService.$inject = [
        '$http'
    ];

    function articlesService($http) {
        this.getArticles = function() {
            return $http({
                method: 'GET',
                headers : {'Content-Type': 'application/x-www-form-urlencoded'} ,
                'url': appConfig.apiUrl + 'articles'
            });
        }

        this.getArticle = function(articleId) {
            return $http({
                method: 'GET',
                headers : {'Content-Type': 'application/x-www-form-urlencoded'} ,
                'url': appConfig.apiUrl + 'articles/' + articleId
            });
        }

        this.getComments = function(articleId) {
            return $http({
                method: 'GET',
                headers : {'Content-Type': 'application/x-www-form-urlencoded'} ,
                url: appConfig.apiUrl + 'articles/' + articleId + '/comments/'
            });
        }

        this.postComment = function(articleId, commentData) {
            return $http({
                method: 'POST',
                url: appConfig.apiUrl + 'articles/' + articleId + '/comments/',
                headers : {'Content-Type': 'application/x-www-form-urlencoded'} ,
                data: $.param(commentData)
            });
        }
    }
})(jQuery);