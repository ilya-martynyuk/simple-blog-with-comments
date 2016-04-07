(function($){
    'use strict';

    angular
        .module('app')
        .controller('ArticleController', articleController);

    /**
     * Controller dependency injections.
     *
     * @type {string[]}
     */
    articleController.$inject = [
        '$rootScope',
        '$scope',
        '$routeParams',
        '$location',
        'articlesService',
        'vcRecaptchaService'
    ];

    /**
     * @ngdoc controller
     *
     * @description
     * Controller used for dealing with single article page.
     *
     * @param $rootScope
     * @param $scope
     * @param $routeParams
     * @param $location
     * @param articlesService Articles service.
     * @param vcRecaptchaService Recaptcha service.
     */
    function articleController($rootScope, $scope, $routeParams, $location, articlesService, vcRecaptchaService) {
        /**
         * Sets page title.
         *
         * @type {string}
         */
        $rootScope.title = 'Article';

        /**
         * An article id.
         */
        var articleId = $routeParams.article_id;

        /**
         * Contains article information.
         *
         * @type {Object}
         */
        $scope.article = {};

        /**
         * Contains an array of article's comments.
         *
         * @type {Array}
         */
        $scope.comments = [];

        /**
         * Contains recaptcha widget id. Used for reloading of recaptcha widget,
         *
         * @link https://github.com/VividCortex/angular-recaptcha
         */
        $scope.recaptchaWidgetId = '';

        if (typeof $rootScope.showRecaptcha === 'undefined') {
            $rootScope.showRecaptcha = true;
        }

        /**
         * Contains data of comment to post.
         *
         * @type {{
         *  parentId: string,
         *  userName: string,
         *  userEmail: string,
         *  text: string,
         *  reCaptchaResponse: string
         * }}
         */
        $scope.commentToPost = {
            parentId: '',
            userName: '',
            userEmail: '',
            text: '',
            reCaptchaResponse: ''
        };

        /**
         * Contains all of controller's forms.
         *
         * @type {Object}
         */
        $scope.forms = {};

        /**
         * Formats data data obtained from server into AngularJs readable format.
         *
         * @param date
         * @returns {Date}
         */
        $scope.formatDate = function(date) {
            var date = date.split("-").join("/"),
                dateOut = new Date(date);

            return dateOut;
        };

        $scope.flags = {
            // Flag means that comment is posting in the moment.
            postingComment: false,

            // Flag means that article is loading in the moment.
            loadingArticle: true,

            // Flag means that article's comments are loading in the moment.
            loadingComments: false
        };

        $scope.setRecaptchaWidgetId = function(widgetId) {
            $scope.recaptchaWidgetId = widgetId;
        };

        /**
         * Posts new comment or reply,
         */
        $scope.postComment = function() {
            if (!$scope.forms.userForm.$valid) {
                return;
            }

            $scope.flags.postingComment = true;

            articlesService
                .postComment($scope.article.id, $scope.commentToPost)
                .then(function(){
                    __clearCommentForm();
                    __loadComments();

                    // User is not a robot.
                    $rootScope.showRecaptcha = false;
                    $scope.flags.postingComment = false;
                }, function(response){
                    if (response.status === 400 && response.data.errors.reCaptchaResponse) {
                        vcRecaptchaService
                            .reload($scope.recaptchaWidgetId);

                        $rootScope.showRecaptcha = true;
                    }

                    $scope.flags.postingComment = false;
                });
        }

        /**
         * Sets parent id of comment to post.
         *
         * @param commentId
         */
        $scope.replyComment = function(commentId) {
            $("html, body")
                .animate({
                    scrollTop: $(document).height()
                }, 500);

            angular
                .element('#post-comment-form-text')
                .focus();

            $scope.commentToPost.parentId = commentId;
        }

        /**
         * Removes parent id of comment to post.
         */
        $scope.closeReply = function() {
            $scope.commentToPost.parentId = '';
        }

        /**
         * Loads article comments.
         *
         * @private
         */
        function __loadComments() {
            articlesService
                .getComments(articleId)
                .then(function(response, status) {
                    $scope.comments = response.data;
                    $scope.flags.loadingComments = false;
                });
        }

        /**
         * Resets some sensitive fields of comment form.
         * We need to preserve articleId and reCaptchaResponse.
         *
         * @private
         */
        function __clearCommentForm()
        {
            $scope.commentToPost.userEmail = '';
            $scope.commentToPost.userName = '';
            $scope.commentToPost.text = '';
            $scope.commentToPost.parentId = '';

            angular
                .element('#post-comment-form')
                .trigger('reset');
        }

        /**
         * Initializing article.
         */
        articlesService
            .getArticle(articleId)
            .then(function(response, status) {
                $scope.article = response.data;
                $rootScope.title += ' - ' + response.data.title;
                $scope.commentToPost.articleId = response.data.id;
                $scope.flags.loadingArticle = false;

                __loadComments();
            }, function(response){
                if (response.status === 404) {
                    $location.path('/404');
                }
            });
    }
})(jQuery);