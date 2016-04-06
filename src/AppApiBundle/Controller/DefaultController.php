<?php

namespace AppApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Yet is not configured, can contains API's basic information.
 *
 * @package AppApiBundle\Controller
 */
class DefaultController extends Controller
{
    /**
     * Returns an API's base information.
     *
     * @Route(
     *  "/",
     *  name="api_base"
     * )
     * @Method("GET")
     */
    public function getApiInfo()
    {
        return new JsonResponse([
            'title' => 'Articles API',
            'description' => 'Api is used for dealing with articles and comments',
            'server_time' => new \DateTime()
        ]);
    }
}
