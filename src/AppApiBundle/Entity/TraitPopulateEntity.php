<?php

namespace AppApiBundle\Entity;

/**
 * Class TraitPopulateEntity
 *
 * @codeCoverageIgnore
 *
 * @package AppApiBundle\Entity
 */
trait TraitPopulateEntity
{
    /**
     * Populates entity with given data.
     * Data should be represented as an array of key => value (field name => field value) parameters.
     *
     * @param array $allowedFields White list of allowed fields for populating.
     * @param array $data
     */
    public function populateFrom(array $data, array $allowedFields = [])
    {
        foreach ($data as $k => $v) {
            if (in_array($k, $allowedFields) && property_exists($this, $k)) {
                $this->$k = $v;
            }
        }
    }
}
