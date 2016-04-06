<?php

namespace AppApiBundle\Services;

use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * This class is used for processing of entities (validation and populating)
 *
 * @package AppApiBundle\Services
 */
class EntityForm
{
    /**
     * DI container
     *
     * @var ContainerInterface
     */
    protected $container;

    /**
     * Found entity errors
     *
     * @var array
     */
    protected $errors;

    /**
     * Entity to process
     *
     * @var
     */
    protected $entity;

    /**
     * Initializing parameters
     *
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->errors = [];
    }

    /**
     * Injects entity
     *
     * @param $entity
     *
     * @return $this
     */
    public function load($entity)
    {
        $this->entity = $entity;

        return $this;
    }

    /**
     * Populates entity with given data
     *
     * @param array $data
     *
     * @return $this
     */
    public function populate(array $data, array $allowFields = [])
    {
        $this->entity->populateFrom($data, $allowFields);

        return $this;
    }

    /**
     * Validates entity, populate errors
     *
     * @return $this
     */
    public function validate()
    {
        $validator = $this
            ->container
            ->get('validator');

        $errorsIterator = $validator
            ->validate($this->entity)
            ->getIterator();

        $this->errors = [];

        while ($errorsIterator->valid()) {
            $error = $errorsIterator->current();

            $this->errors[$error->getPropertyPath()] = $error->getMessage();

            $errorsIterator->next();
        }

        return $this;
    }

    /**
     * Checks whether entity is valid (should be used after calling validate method)
     *
     * @return bool
     */
    public function isValid()
    {
        return count($this->errors) === 0;
    }

    /**
     * Returns entity errors if they exist
     *
     * @return array An array of errors
     */
    public function getErrors()
    {
        return $this->errors;
    }
}
