(function(){
    'use strict';

    /**
     * @ngdoc module
     * @name app
     *
     * @requires vcRecaptcha
     *
     * @description
     * Common application module
     */
    angular
        .module('app', [
            'ngRoute',
            'vcRecaptcha'
        ]);
})();
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
         * Flag means that article is loading in the moment.
         *
         * @type {boolean}
         */
        $scope.articleLoading = true;

        /**
         * Flag means that article's comments are loading in the moment.
         *
         * @type {boolean}
         */
        $scope.commentsLoading = true;

        /**
         * Flag means that comment is posting in the moment.
         *
         * @type {boolean}
         */
        $scope.commentPosting = false;

        /**
         * Contains recaptcha widget id. Used for reloading of recaptcha widget,
         *
         * @link https://github.com/VividCortex/angular-recaptcha
         */
        $scope.recaptchaWidgetId = '';

        $rootScope.showRecaptcha = $rootScope.showRecaptcha || true;

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
            postingComment: false,
            loadingArticle: true,
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

            $scope.flags.commentPosting = true;

            articlesService
                .postComment($scope.article.id, $scope.commentToPost)
                .then(function(){
                    __clearCommentForm();
                    __loadComments();

                    $rootScope.showRecaptcha = false;
                    $scope.flags.commentPosting = false;
                }, function(response){
                    if (response.status === 400 && response.data.errors.reCaptchaResponse) {
                        vcRecaptchaService
                            .reload($scope.recaptchaWidgetId);

                        $rootScope.showRecaptcha = true;
                    }

                    $scope.flags.commentPosting = false;
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