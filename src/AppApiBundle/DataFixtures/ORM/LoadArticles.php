<?php

namespace AppBackEndBundle\DataFixtures\ORM;

use AppApiBundle\Entity\Article;
use AppApiBundle\Entity\Comment;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;

class LoadArticles extends AbstractFixture implements OrderedFixtureInterface
{
    /**
     * {@inheritdoc}
     */
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();

        for ($i = 0; $i < 9; $i++) {
            $article = new Article();
            $article->setTitle($faker->text(150));
            $article->setContent($faker->text(1500));

            $manager->persist($article);
        }

        $comment = new Comment();
        $comment->setUserName('Test');
        $comment->setUserEmail('Test');
        $comment->setText('Test text');
        $comment->setArticleId(100);

        $manager->persist($comment);

        $comment1 = new Comment();
        $comment1->setUserName('Test 1');
        $comment1->setUserEmail('Test 1');
        $comment1->setText('Test text 1');
        $comment1->setArticleId(101);
        $comment1->setParent($comment);

        $manager->persist($comment1);

        $manager->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function getOrder()
    {
        return 1;
    }
}
