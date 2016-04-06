<?php

namespace AppApiBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Comment
 * @Gedmo\Tree(type="nested")
 *
 * @ORM\Table(name="comments", indexes={@ORM\Index(name="IDX_5F9E962A727ACA70", columns={"parent_id"})})
 * @ORM\Entity(repositoryClass="AppApiBundle\Repository\ArticleCommentsRepository")
 * @ORM\HasLifecycleCallbacks
 */
class Comment
{
    use TraitPopulateEntity;

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @Gedmo\TreeLeft
     * @ORM\Column(type="integer")
     */
    private $lft;

    /**
     * @Gedmo\TreeLevel
     * @ORM\Column(type="integer")
     */
    private $lvl;

    /**
     * @Gedmo\TreeRight
     * @ORM\Column(type="integer")
     */
    private $rgt;

    /**
     * @Gedmo\TreeRoot
     * @ORM\ManyToOne(targetEntity="Comment")
     * @ORM\JoinColumn(referencedColumnName="id", onDelete="CASCADE")
     */
    private $root;

    /**
     * @var \DateTime $created
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(name="created_at", type="datetime")
     */
    private $created;

    /**
     * @var integer
     *
     * @ORM\Column(name="article_id", type="integer", nullable=false)
     */
    private $articleId;

    /**
     * @var string
     *
     * @ORM\Column(name="text", type="string", length=500, nullable=true)
     * @Assert\Type(type="string")
     * @Assert\NotBlank()
     */
    private $text;

    /**
     * @var string
     *
     * @ORM\Column(name="user_name", type="string", length=100, nullable=false)
     * @Assert\NotBlank()
     */
    private $userName;

    /**
     * @var string
     *
     * @ORM\Column(name="user_email", type="string", length=100, nullable=false)
     * @Assert\NotBlank()
     * @Assert\Email()
     */
    private $userEmail;

    /**
     * @Gedmo\TreeParent
     * @ORM\ManyToOne(targetEntity="Comment", inversedBy="children")
     * @ORM\JoinColumn(name="parent_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $parent;

    /**
     * @ORM\OneToMany(targetEntity="Comment", mappedBy="parent")
     * @ORM\OrderBy({"lft" = "ASC"})
     */
    private $children;

    /**
     * @return mixed
     */
    public function getChildren()
    {
        return $this->children;
    }

    /**
     * @param mixed $children
     * @return $this
     */
    public function addChildren($children)
    {
        $this->children[] = $children;

        return $this;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return int
     */
    public function getArticleId()
    {
        return $this->articleId;
    }

    /**
     * @param int $articleId
     */
    public function setArticleId($articleId)
    {
        $this->articleId = $articleId;
    }

    /**
     * @return string
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * @param string $text
     * @return $this
     */
    public function setText($text)
    {
        $this->text = $text;

        return $this;
    }

    /**
     * @return string
     */
    public function getUserName()
    {
        return $this->userName;
    }

    /**
     * @param $userName
     * @return $this
     */
    public function setUserName($userName)
    {
        $this->userName = $userName;

        return $this;
    }

    /**
     * @return string
     */
    public function getUserEmail()
    {
        return $this->userEmail;
    }

    /**
     * @param string $userEmail
     * @return $this
     */
    public function setUserEmail($userEmail)
    {
        $this->userEmail = $userEmail;

        return $this;
    }

    /**
     * @return \Comment
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * @param Comment $parent
     * @return $this
     */
    public function setParent(Comment $parent)
    {
        $this->parent = $parent;

        return $this;
    }
}

