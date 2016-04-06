(function($){
    'use strict';

    angular
        .module('app')
        .service('articlesService', articlesService);

    /**
     * Service dependencies.
     *
     * @type {string[]}
     */
    articlesService.$inject = [
        '$http'
    ];

    /**
     * @ngdoc service
     *
     * @description
     * Service is used for interacting with articles and their posts.
     *
     * @param $http Service.
     */
    function articlesService($http) {
        /**
         * Makes an API call to receive list of articles.
         *
         * @returns {*}
         */
        this.getArticles = function() {
            return $http({
                method: 'GET',
                'url': appConfig.apiUrl + 'articles'
            });
        }

        /**
         * Makes an API call to receive single article.
         *
         * @param articleId
         * @returns {*}
         */
        this.getArticle = function(articleId) {
            return $http({
                method: 'GET',
                'url': appConfig.apiUrl + 'articles/' + articleId
            });
        }

        /**
         * Makes an API call to receive list article's comments.
         *
         * @returns {*}
         */
        this.getComments = function(articleId) {
            return $http({
                method: 'GET',
                url: appConfig.apiUrl + 'articles/' + articleId + '/comments/'
            });
        }

        /**
         * Makes an API call to post comment.
         *
         * @returns {*}
         */
        this.postComment = function(articleId, commentData) {
            return $http({
                method: 'POST',
                url: appConfig.apiUrl + 'articles/' + articleId + '/comments/',
                data: $.param(commentData)
            });
        }
    }
})(jQuery);