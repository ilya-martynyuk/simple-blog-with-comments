(function(){
    'use strict';

    angular
        .module('app')
        .controller('ArticleController', articleController);

    articleController.$inject = [
        '$rootScope',
        '$scope',
        '$routeParams',
        '$location',
        'articlesService'
    ];

    function articleController($rootScope, $scope, $routeParams, $location, articlesService) {
        $rootScope.title = 'Article';

        $scope.article = {};
        $scope.comments = [];

        $scope.articleLoading = true;
        $scope.commentsLoading = true;
        $scope.commentToPost = {
            parentId: '',
            userName: '',
            userEmail: '',
            text: '',
            captchaCode: ''
        };
        $scope.forms = {};

        var articleId = $routeParams.article_id;

        $scope.formatDate = function(date) {
            var date = date.split("-").join("/");
            var dateOut = new Date(date);

            return dateOut;
        };

        $scope.postComment = function() {
            if (!$scope.forms.userForm.$valid) {
                return;
            }

            articlesService
                .postComment($scope.article.id, $scope.commentToPost)
                .then(function(){
                    $scope.commentToPost = {};

                    __loadComments();
                });
        }

        $scope.replyComment = function(commentId) {
            $scope.commentToPost.parentId = commentId;
            console.log(commentId);
        }

        $scope.closeReply = function() {
            $scope.commentToPost.parentId = '';
        }

        function __loadComments() {
            articlesService
                .getComments(articleId)
                .then(function(response, status) {
                    $scope.comments = response.data;
                    $scope.commentsLoading = false;
                });
        }

        articlesService
            .getArticle(articleId)
            .then(function(response, status) {
                $scope.article = response.data;
                $rootScope.title += ' - ' + response.data.title;
                $scope.commentToPost.articleId = response.data.id;

                $scope.articleLoading = false;

                __loadComments();
            }, function(response){
                if (response.status === 404) {
                    $location.path('/404');
                }
            });
    }
})();