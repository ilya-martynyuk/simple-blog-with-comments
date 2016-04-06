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