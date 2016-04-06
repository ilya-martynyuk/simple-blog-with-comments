<?php

namespace AppApiBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class AppApiExtension extends Extension
{
    /**
     * {@inheritDoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration =  new Configuration();
        $this->processConfiguration($configuration, $configs);

        $container->setParameter('app_api.recaptcha_secret_key', $configs[0]['recaptcha_secret_key']);
        $container->setParameter('app_api.recaptcha_client_key', $configs[0]['recaptcha_client_key']);
        $container->setParameter('app_api.recaptcha_expiration_time', $configs[0]['recaptcha_expiration_time']);

        $loader = new Loader\YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.yml');
    }
}