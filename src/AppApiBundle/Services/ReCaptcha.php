<?php

namespace AppApiBundle\Services;

use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Used for interacting with Recaptcha service.
 *
 * @link https://developers.google.com/recaptcha/docs/verify#api-request
 *
 * @package AppApiBundle\Services
 */
class ReCaptcha implements ContainerAwareInterface
{
    /**
     * Recaptcha service API url
     */
    const API_URL = 'https://www.google.com/recaptcha/api/siteverify';

    /**
     * During this time we will not werify recaptcha from current user.
     *
     * @var
     */
    protected $expirationTime;

    /**
     * Recaptcha api seecret key.
     *
     * @var Api
     */
    protected $apiSecret;

    /**
     * Dependency injection container.
     *
     * @var ContainerInterface
     */
    protected $container;

    /**
     * ReCaptcha constructor.
     *
     * @param $apiSecret Api secret key
     * @param $expirationTime Recaptcha expiration time.
     */
    public function __construct($apiSecret, $expirationTime)
    {
        $this->apiSecret = $apiSecret;
        $this->expirationTime = $expirationTime;
    }

    /**
     * {@inheritdoc}
     */
    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    /**
     * Checks whether user is already verified last time.
     *
     * @return bool
     */
    public function isCaptchaVerified()
    {
        $lastVerifyTime = $this
            ->container
            ->get('session')
            ->get('reCaptchaVerifiedAt');

        $currentTime = time();

        if (!$lastVerifyTime || $currentTime > $lastVerifyTime + $this->expirationTime) {
            return false;
        }

        return true;
    }

    /**
     * Makes an API call to the recaptcha service which verifies recaptcha response code (obtained from client).
     *
     * @link https://developers.google.com/recaptcha/docs/verify#api-request
     *
     * @param $captchaCode Recaptcha response code.
     * @return bool Result of verifying
     */
    public function verifyCode($captchaCode)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, self::API_URL);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'secret' => $this->apiSecret,
            'response' => $captchaCode,
            'remoteip' => $this->container->get('request_stack')->getCurrentRequest()->getClientIp()
        ]));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = json_decode(curl_exec($ch));

        curl_close($ch);

        if ($response->success) {
            $this
                ->container
                ->get('session')
                ->set('reCaptchaVerifiedAt', time());

            return true;
        }

        return false;
    }
}