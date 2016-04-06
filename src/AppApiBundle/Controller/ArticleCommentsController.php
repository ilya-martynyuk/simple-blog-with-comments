<?php

namespace AppApiBundle\Controller;

use AppApiBundle\Entity\Article;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use AppApiBundle\Entity\Comment;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Used for handling requests related to article's comments.
 *
 * @package AppApiBundle\Controller
 */
class ArticleCommentsController extends Controller
{
    /**
     * Returns all comments of certain article.
     *
     * @Route(
     *  "/articles/{article_id}/comments/",
     *   requirements={
     *      "article_id": "\d+"
     *   }
     * )
     * @Method("GET")
     * @ParamConverter("article", class="AppApiBundle:Article", options={"mapping": {"article_id": "id"}})
     */
    public function getAll(Article $article)
    {
        $em = $this
            ->getDoctrine()
            ->getManager();

        $repo = $em->getRepository('AppApiBundle:Comment');

        $query = $em
            ->createQueryBuilder()
            ->select('c')
            ->from('AppApiBundle:Comment', 'c')
            ->where('c.articleId=:article_id')
            ->orderBy('c.root, c.lft', 'ASC')
            ->setParameter('article_id', $article->getId())
            ->getQuery()
        ;

        $tree = $repo->buildTree($query->getArrayResult(), []);

        return new JsonResponse($tree);
    }


    /**
     * Posts new comment to an article.
     * Can be posted as reply of another comment.
     *
     * @Route(
     *  "/articles/{articleId}/comments/",
     *   requirements={
     *      "articleId": "\d+"
     *   }
     * )
     * @Method("POST")
     * @ParamConverter("article", class="AppApiBundle:Article", options={"mapping": {"articleId": "id"}})
     */
    public function postComment(Article $article, Request $request)
    {
        $comment = new Comment();
        $comment->setArticleId($article->getId());

        $serializer = $this
            ->get('serializer');

        $reCaptchaService = $this
            ->container
            ->get('app.recaptcha');

        if (!$reCaptchaService->isCaptchaVerified()) {
            $reCaptchaIsValid = $reCaptchaService
                ->verifyCode(
                    $request
                        ->get('reCaptchaResponse')
                );

            // Checks that captcha code is valid.
            if (!$reCaptchaIsValid) {
                return new JsonResponse([
                    'errors' => ['reCaptchaResponse' => 'Code is not valid']
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        // Loads data from request into comment entity.
        $entityForm = $this
            ->get('forms.entity_form')
            ->load($comment)
            ->populate($request->request->all(), [
                'userName', 'userEmail', 'text'
            ])
            ->validate();

        // Validates comment data before saving.
        if (false === $entityForm->isValid()) {
            return new JsonResponse([
                'errors' => $entityForm->getErrors()
            ], Response::HTTP_BAD_REQUEST);
        }

        $em = $this
            ->getDoctrine()
            ->getManager();

        // If comment has parent, append him to it.
        if ($request->get('parentId')) {
            $parentComment = $em
                ->getRepository('AppApiBundle:Comment')
                ->find($request->get('parentId'));

            if (!$parentComment) {
                return new Response('', Response::HTTP_BAD_REQUEST);
            }

            $comment->setParent($parentComment);
        }

        $em->persist($comment);
        $em->flush();

        // All ok, comment was successfully created.
        return new Response(
            $serializer->serialize($comment, 'json'),
            Response::HTTP_CREATED
        );
    }
}
