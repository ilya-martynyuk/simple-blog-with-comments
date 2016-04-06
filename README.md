Simple blog implementation made on Symfony3 and AngularJs
====

Symfony3 is used as REST api. AngularJs as client.
Implemented nested comments and recaptcha.
Materialize is used as common CSS framework.

### Instalation

- Install composer pacjages:
composer install

- Intall DB tables:
bin/console doctrine:schema:update --force

- Load fixtures:
bin/console doctrine:fixtures:load
