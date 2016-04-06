Simple blog implementation made on Symfony3 and AngularJs
====

Symfony3 is used as REST api. AngularJs as client.
Implemented nested comments and recaptcha.
Materialize is used as common CSS framework.

Instalation guide
-----------------
Install [Composer](http://getcomposer.org/) packages:

    composer install --dev

Install DB schema data:

    bin/console doctrine:schema:update --force

Load fixtures:

    bin/console doctrine:fixtures:load
    
Also you should install [Npm](https://www.npmjs.com/) packages (npm is used instead of Bower):

    npm install
    
