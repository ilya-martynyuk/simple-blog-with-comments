composer install
bin/console doctrine:schema:update --force
bin/console doctrine:fixtures:load