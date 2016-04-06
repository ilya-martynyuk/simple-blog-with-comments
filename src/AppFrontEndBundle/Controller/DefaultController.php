<?php

namespace AppFrontEndBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * Class DefaultController
 *
 * @package AppFrontEndBundle\Controller
 */
class DefaultController extends Controller
{
    /**
     * Renders common SPA page.
     *
     * @Route("/")
     */
    public function indexAction()
    {
        return $this->render('AppFrontEndBundle:Default:index.html.twig', [
            'recaptcha_client_key' => $this->container->getParameter('app_api.recaptcha_client_key')
        ]);
    }
}