(function(){
    'use strict';

    /**
     * @ngdoc module
     * @name app
     *
     * @requires ui.router
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