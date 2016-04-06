<?php

namespace AppApiBundle\Services;

use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Used for creating of EntityForm objects.
 *
 * @package AppApiBundle\Services
 */
class EntityFormFactory
{
    /**
     * Returns EntityForm new instance
     *
     * @param ContainerInterface $container
     *
     * @return EntityForm
     */
    public function createEntityForm(ContainerInterface $container)
    {
        return new EntityForm($container);
    }
}
