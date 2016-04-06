<?php

namespace AppApiBundle\Controller;

use AppApiBundle\Entity\Article;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

class ArticlesController extends Controller
{
    /**
     * @Route(
     *  "/articles",
     * )
     * @Method("GET")
     */
    public function getAll()
    {
        $serializer = $this
            ->get('serializer');

        $articles = $this->getDoctrine()
            ->getRepository('AppApiBundle:Article')
            ->createQueryBuilder('e')
            ->getQuery()
            ->getResult();

        return new Response($serializer->serialize($articles, 'json'));
    }

    /**
     * @Route(
     *  "/articles/{article_id}",
     *   requirements={
     *      "article_id": "\d+"
     *   }
     * )
     * @Method("GET")
     * @ParamConverter("article", class="AppApiBundle:Article", options={"mapping": {"article_id": "id"}})
     *
     * @param Article $article
     * @return Response
     */
    public function getArticle(Article $article)
    {
        $serializer = $this
            ->get('serializer');

        return new Response($serializer->serialize($article, 'json'));
    }
}
