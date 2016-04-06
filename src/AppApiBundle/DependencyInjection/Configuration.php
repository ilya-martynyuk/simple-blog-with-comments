<?php

namespace AppApiBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();

        $rootNode = $treeBuilder->root('app_api');
        $rootNode
            ->children()
                ->scalarNode('recaptcha_secret_key')
                    ->cannotBeEmpty()
                ->end()
                ->scalarNode('recaptcha_client_key')
                    ->cannotBeEmpty()
                ->end()
                ->scalarNode('recaptcha_expiration_time')
                    ->info('Time in secconds while recaptcha will not start processing')
                    ->defaultValue(120)
                ->end()
            ->end()
        ;

        return $treeBuilder;
    }
}
